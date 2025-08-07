Thanks for confirming. I’ll begin by gathering the official AWS constraints and valid values for AWS Backup CloudFormation parameters to help fix your deployment error. I’ll also check best practices for hourly backups and cross-region copy configurations.

I’ll follow up shortly with validated guidance and CloudFormation-compatible recommendations.


## Resolving the AWS Backup Plan Deployment Error

The CloudFormation error is caused by the **StartWindowMinutes** value being too low. AWS Backup requires a minimum window of 60 minutes for backup jobs to start. In your template, `StartWindowMinutes: 30` (for hourly backups) is below this minimum. To fix the deployment, increase **StartWindowMinutes** to at least **60** in the backup plan rule. This will satisfy the constraint and allow the stack to deploy.

### Minimum Backup Window Values (StartWindowMinutes & CompletionWindowMinutes)

* **StartWindowMinutes:** **Minimum 60 minutes.** If you specify a start window, it **must be ≥ 60 minutes** to avoid errors. (AWS Backup will keep the job in a `CREATED` state and retry for up to this window before marking it expired.) In practice, setting it to 60 minutes (the same as your schedule interval) is typical for hourly backups.
* **CompletionWindowMinutes:** **Minimum 60 minutes (recommended).** While the docs don’t explicitly call out a minimum for completion window, AWS Backup expects a reasonable time for the job to finish. It’s safest to use **≥ 60 minutes** here as well. This value defines how long a backup job can run after it starts before Backup cancels it. A value of 60 or 120 minutes is common for most workloads, but ensure it’s long enough for your largest backup to complete.

*(AWS Backup allows very large values – up to 100 years for these windows – but for our purposes we just need to meet the 60-minute minimum).*

### AWS Backup Lifecycle Policy Values (DeleteAfterDays & MoveToColdStorageAfterDays)

AWS Backup lifecycle settings control how long backups are retained and when they transition to cold storage. **Valid values** are integer days, with these rules and constraints:

* **MoveToColdStorageAfterDays:** The number of days after creation to transition the recovery point to cold storage. This can be any number of days (if omitted, backups never go to cold storage). There’s no fixed minimum, but typically you’d keep backups “warm” for at least a few days. For example, `MoveToColdStorageAfterDays: 30` means move to cold storage after 30 days.
* **DeleteAfterDays:** The number of days after creation to **delete** the recovery point. This defines your retention period. If you use cold storage, **DeleteAfterDays must be *at least 90 days greater* than MoveToColdStorageAfterDays**. In other words, any backup that is moved to cold storage must be retained for **at least 90 additional days** before deletion. This 90-day minimum ensures that once in cold storage, a backup stays there for the required 90-day cold retention period. For example, if `MoveToColdStorageAfterDays = 30`, then `DeleteAfterDays` must be **> 30+90**, i.e. at least 121 days. If you don’t use cold storage at all, you can set DeleteAfterDays alone (e.g. 7 days, 120 days, etc. as needed).

**Constraints between DeleteAfterDays and MoveToColdStorageAfterDays:** Yes – as noted, AWS Backup enforces that **`DeleteAfterDays > MoveToColdStorageAfterDays + 90`** when both are set. The CloudFormation/Backup service will throw an error if you violate this. You cannot transition a backup to cold storage and delete it sooner than 90 days later. Also, once a backup has been transitioned to cold, that transition setting can’t be changed for that existing recovery point (it’s fixed for that backup).

### Hourly Backups with 1-Hour RPO and 15-Minute RTO

To achieve a **1-hour RPO** using AWS Backup, configure an **hourly backup rule** in your backup plan. You’ve done this with `ScheduleExpression: cron(0 * * * ? *)`, which triggers a backup every hour on the hour. Key recommendations for hourly backups:

* **Backup Window Settings:** Set `StartWindowMinutes` to 60 (as discussed) so that each hourly backup has the full hour to start. You should also set a suitable `CompletionWindowMinutes` (e.g. 60 or 120) to give each job time to finish. This prevents jobs from being canceled prematurely if they run a bit long. Essentially, the backup must start within 60 minutes of its scheduled time (ensuring no overlap with the next run) and then complete within the completion window or be terminated.
* **Retention:** Use a shorter retention for hourly backups (your example uses 7 days which is reasonable). This keeps the number of hourly recovery points manageable. You can complement this with a separate daily backup rule (with longer retention) for long-term archival, which you already have for 120 days. This two-tier strategy (hourly short-term, daily long-term) is a best practice for meeting stringent RPO while controlling costs.
* **Cross-Region DR Copy:** For disaster recovery, enable **cross-region backup copies** for the hourly backups. In your plan, the rule `DailyBackupsWithCrossRegionCopy` is already copying dailies to a secondary region. You should consider doing the same for the hourly backups (or ensure the important data is replicated by another means) so that your most recent backup is available in the DR region. This way, if Region A goes down, you have at most 1 hour of data loss in Region B. Keep in mind that the copy will occur after the backup completes, so there’s a slight delay for cross-region transfer.
* **RPO vs. RTO:** A 1-hour RPO is attainable with hourly backups, but a **15-minute RTO (Recovery Time Objective)** is very aggressive for a backup-restore strategy. Restoring from backups (especially large volumes or databases) can take longer than 15 minutes. To meet a 15-minute RTO, you likely need **active/passive or active/active replication** in addition to backups. For example, use multi-AZ or multi-region database replication, DynamoDB global tables, etc., so that failover is fast. Backups alone are typically used for **backup & restore DR**, which has a longer RTO (hours). So, while your hourly backups give you the data (RPO \~1 hour), consider maintaining warm standby resources for critical systems to achieve \~15 minute recovery. In summary: use AWS Backup for data protection, but use architectures like **pilot-light or warm standby** for quick recovery of applications in a second region.

### Cross-Region Backup Copy Constraints

AWS Backup’s cross-region copy feature (the **CopyActions** in your plan) allows automated copying of recovery points to a secondary region vault. Ensure you account for the following requirements/constraints:

* **Destination Vault & Encryption:** You must have a **backup vault in the destination region** (in your template, `${ApplicationName}-secondary-vault-${Environment}`) to receive the copies. AWS Backup will **encrypt the copied backup using the KMS key of the destination vault**. This happens automatically – even if the source backup was encrypted with a different key, the copy in Region B will be encrypted with the vault’s key in Region B. Make sure the IAM roles used by AWS Backup have permissions to use that KMS key (if it’s customer-managed). Generally, using a customer-managed CMK in the destination vault is recommended, especially for cross-account copies, because AWS-managed keys can’t be used for cross-account copy in some cases (not applicable here if within same account).
* **Lifecycle on Copies:** You can (and should) set a lifecycle (transition to cold, retention) on the copy as well, potentially different from the source. All the same rules apply – e.g. 90-day minimum retention after cold storage on the copied backup. Typically, you might keep the copy as long as the source or longer, depending on compliance needs in DR region. If you omit a lifecycle for the copy, it will inherit default never-expire behavior, so it’s good to define one.
* **Copy Timing:** The copy job will only start after the original backup is **completed** (it’s an asynchronous copy). This means your RPO might have a slight extra lag (the time it takes to copy to secondary region). For faster cross-region protection, ensure your backups aren’t too large (or consider multiple parallel backups for large datasets). Currently, AWS Backup copies are the way to automate cross-region backup, since continuous PITR backups do not automatically replicate cross-region.
* **Resource Type Support:** Nearly all supported AWS Backup resource types can be copied across regions, but **be mindful of service-specific constraints**. For example, when copying Amazon RDS snapshots across regions, the target region must have the same **option group** or engine version if required by that DB – the snapshot copy can fail if an associated option group isn’t present. In fact, AWS notes that you **cannot copy RDS option groups** across regions; you’d need to manually recreate matching option groups in the DR region to successfully use the snapshot. Always consult AWS documentation for any service-specific nuances when planning cross-region restores.

With the above fixes and considerations, your AWS Backup plan should deploy successfully and provide a robust backup strategy. The immediate change is to set `StartWindowMinutes` ≥ 60. After that, you can fine-tune retention and copy rules to meet your 1-hour RPO, and consider supplemental measures (like multi-region replication for databases, etc.) to meet the 15-minute RTO.

## Multi-Region Architecture Best Practices (DR, Security, Monitoring)

Now that your backup configuration is sorted out, let’s address the broader **multi-region disaster recovery, security, and monitoring** aspects of your infrastructure:

### DynamoDB Global Tables in CloudFormation

For a multi-region active-active data layer, **DynamoDB Global Tables** are the recommended approach. In CloudFormation, **global tables are defined as a separate resource type** from a standard DynamoDB table. You should **not** try to embed global table settings in an `AWS::DynamoDB::Table` resource. Instead, use the `AWS::DynamoDB::GlobalTable` resource to create a global table that spans regions.

Key points for DynamoDB global tables (Version 2019.11.21):

* **Single-Stack Deployment:** Define the global table in one region’s stack (one Region acts as “primary” for CloudFormation deployment). You will specify the list of replica regions in the GlobalTable resource’s properties. CloudFormation will then create the table in each region as needed. **Do not deploy the same GlobalTable resource in multiple region stacks** – that will cause errors and is unsupported. Use conditions or a separate stack if you are deploying templates in multiple regions, so that the global table resource is created only once.
* **Separate from Base Table Resource:** If you already have a regular `AWS::DynamoDB::Table` resource defined, note that you **cannot convert** it to a GlobalTable just by changing the resource type. The docs warn that doing so could delete the table. The global table resource will manage the underlying regional tables for you. If you had an existing table and want to globalize it, you’d instead create a new `AWS::DynamoDB::GlobalTable` resource and maybe deprecate the old one (with careful migration). For new deployments, define it as global from the start if it may need multi-region.
* **Important**: Ensure that the same **key schema and provisioned throughput settings** apply to all replicas. With CloudFormation global tables, you configure attributes, key schema, and billing mode in the GlobalTable resource, and it applies to all regions. If using **provisioned** capacity, CloudFormation will require you to configure auto-scaling (via the `WriteProvisionedThroughputSettings` property) for global tables, since you can’t directly set a fixed write capacity on a global table.
* **Streams and TTL:** Streams on a global table are per-region. Also, Time-to-Live (TTL) expiration and other features need to be consistent across regions (the GlobalTable resource will take care of enabling them on all replicas if specified).

By configuring DynamoDB global tables correctly, you’ll achieve multi-region redundancy with **globally replicated data**, which helps meet very low RPO/RTO (often near zero for DynamoDB, since all writes are replicated to other regions within seconds).

### Multi-Region KMS Keys and Secrets Manager Replication

**KMS (Key Management Service):** For encryption keys, AWS KMS supports **multi-Region keys**, which are separate key instances in different regions that share the same key material and ID. Using multi-Region KMS keys is ideal for DR, because you can encrypt data in one region and decrypt in another without re-encryption. Best practices for multi-region KMS keys:

* **Use Multi-Region Customer Managed Keys:** When you create a CMK, you have the option to make it multi-Region. This generates a primary key in one region and lets you **replicate** it to other regions of your choice. Each replica is a full KMS key in that region that is cryptographically identical to the primary. This is great for things like encrypting S3 objects or Secrets Manager secrets in one region and easily decrypting in another during failover.
* **Partition Constraints:** Multi-Region keys can only be replicated within the same AWS partition. You **cannot** replicate a key from a standard AWS region to China or GovCloud, and vice versa. (In other words, keys in `aws` partition regions can replicate among themselves, keys in `aws-cn` can replicate within China regions, but you can’t cross that boundary.) Aside from that, all public AWS regions support multi-Region keys.
* **Permissions:** Make sure the IAM roles in each region (e.g. your application or backup roles) have access to the respective CMK. Replicated keys do **not** automatically copy grants or key policies – you manage each replica’s policy independently (though you can keep them identical).
* **Key Rotation:** It’s generally a security best practice to enable **automatic key rotation** for customer-managed CMKs. AWS KMS can rotate keys annually when enabled. If you do this, each replica key will rotate its material yearly as well (since they share the rotation setting, each one gets new cryptographic material but remains interoperable). This helps meet compliance requirements without impacting your workloads (the key ID remains the same).

**Secrets Manager Multi-Region Replication:** AWS Secrets Manager now supports **multi-region secret replication**, which you should leverage for storing things like credentials, API keys, etc., needed in both primary and DR regions. Key considerations:

* **Enabling Replicas:** You can designate a secret as primary and add **replica regions** for it. Secrets Manager will automatically **propagate the encrypted secret value** to the other regions. This is great for DR – your applications in the secondary region can retrieve the secret locally, and if you rotate the secret, the new value syncs to all replicas.
* **Regional Limits:** Similar to KMS, secret replication must stay within partitions. You can replicate secrets to **any enabled AWS region** in your account, but you **cannot replicate from a commercial region into GovCloud or China** regions, or vice versa. (Those regions are isolated for compliance reasons.) In your case with standard regions, you can freely replicate among them. Just ensure the region is enabled in your account and Secrets Manager is supported there (Secrets Manager is available in all major regions).
* **Access and Encryption:** Each secret replica in a region can be encrypted with a KMS key of that region. By default, it uses the same key as the primary (i.e. the default `aws/secretsmanager` or a custom multi-region CMK if you specified one). Make sure the key policy in each region allows decrypt for the services/principals that will use the secret.
* **Rotation:** You only configure rotation on the **primary secret**. If rotation is turned on, Secrets Manager will rotate the primary and automatically propagate the new secret value to all replicas. You do **not** need to set up separate rotation in each region. This simplifies operations while ensuring all copies stay in sync.

By using multi-region KMS keys for encryption and replicating secrets across regions, you ensure that during a failover, your applications can access the **same encrypted data and secrets** without waiting, and without compromising security.

### Cross-Region S3 Replication Strategy (Without Circular Dependencies)

For S3, you mentioned cross-region replication (CRR) as part of the design. The goal is to replicate S3 bucket data to a secondary region for DR, while avoiding circular dependencies or conflicts. Here are best practices:

* **One-Way vs. Two-Way:** The simplest approach is **one-way replication** – designate one bucket as the source (e.g. the primary region bucket) and replicate to a bucket in the second region. This avoids any loops. If you truly need bi-directional replication (two-way syncing), be very careful to implement it in a way that doesn’t ping-pong objects indefinitely. AWS has features like S3 Multi-Region Access Points with failover and **two-way replication rules** to help in active-active scenarios, but in most cases one-way is simpler. If implementing two-way, you would set rules such that each bucket only replicates objects that *originate* in that region (and objects replicated from the other side are not re-replicated back). S3 embeds metadata on replicated objects (`x-amz-replication-status`) to prevent infinite loops. Still, two-way replication can double your storage and I/O, so only use if necessary for active-active. For a primary->backup DR, one-way CRR is sufficient.
* **CloudFormation Configuration:** When setting up CRR in CloudFormation, you often need to manage IAM roles and bucket policies carefully to avoid circular dependencies in the template. AWS S3 requires a replication IAM role that the source bucket uses to replicate objects. The source bucket’s `ReplicationConfiguration` refers to the role ARN and the destination bucket ARN. To avoid CloudFormation dependency cycles (e.g., the bucket needs the role, and the role policy refers to the bucket), **define the IAM Role and its Policy as separate resources**, and use explicit `DependsOn` where needed. AWS’s documentation shows an example where the role’s policy is in a separate `AWS::IAM::Policy` resource, and the bucket depends on the role, breaking the cycle. In practice:

  * Create the replication role (with trust policy allowing S3 to assume it).
  * Create an IAM policy resource that grants that role permission to `s3:GetReplicationConfiguration`, `s3:ListBucket` on the source bucket, and `s3:ReplicateObject`, `s3:ReplicateDelete`, `s3:GetObjectVersion*` on the source & destination bucket objects. Don’t attach this policy inline in the role definition; instead attach as a separate resource after both buckets exist.
  * On the **source bucket** resource, set the `ReplicationConfiguration` with the `Role: <role ARN>` and the `Rules` (specifying destination bucket ARN, maybe a prefix filter, etc.). Use `DependsOn` to ensure the role is created before the bucket tries to use it.
  * Ensure **Versioning** is enabled on **both** source and destination buckets (versioning is required for replication to work at all).
* **Avoiding Circular *Data* Replication:** If you did configure two-way replication (again, not typically needed unless you want active-active S3), use **prefix or tag-based filters** to prevent the same object from bouncing between buckets. For example, you could set a tag like `{"replicated":"true"}` on objects that are replicas, and configure the replication rules to **exclude** objects with that tag. AWS’s newer two-way replication (with Multi-Region Access Points) handles this for you by only replicating changes in the failover scenario, but if doing manually, plan the logic carefully. In a pure DR scenario, it’s often better to only replicate one direction and treat the second bucket as read-only until a disaster occurs (or use it for archive).
* **Test Failover:** After setting up CRR, periodically **test your replication and failover process**. This includes verifying that new objects appear in the destination bucket and perhaps setting up **S3 Bucket Notifications** or AWS CloudWatch Events to alert on replication failures. For DR, you might also implement **S3 Object Lock** or **Versioning + Lifecycle** so that even in the primary region, deleted data isn’t lost (you have versions or retention until it’s safely in the DR region).

By following these practices, you avoid CloudFormation deployment issues and ensure your S3 data is durably copied to the backup region without unintended side effects.

### Monitoring and Tracing in a Multi-Region Environment

With multi-region infrastructure, it’s crucial to have comprehensive monitoring and tracing across all regions:

* **Amazon CloudWatch:** Use CloudWatch in each region for resource metrics and logs. Set up **CloudWatch Alarms** on key metrics in each region (e.g. DynamoDB replication lag, RDS replica health, EC2 instance status, etc.). For a global view, you can use CloudWatch Dashboards or AWS Console Cross-Region search. You might also consider a central monitoring account with **CloudWatch Metric Streams or EventBridge** to aggregate events from multiple regions. The important part is to ensure you’re collecting logs (via CloudWatch Logs or a SIEM solution) from both regions – this includes application logs, Lambda logs, VPC Flow Logs, etc., as applicable.
* **AWS X-Ray:** Enable X-Ray tracing in your applications to get end-to-end insight into requests as they traverse your microservices or components. In a multi-region setup, X-Ray will record traces per region (X-Ray is regional), but you can use X-Ray Analytics or CloudWatch ServiceLens to visualize performance. Make sure to **instrument your code** (or use X-Ray SDKs/agents) in all regions where your application runs. Also, ensure any AWS Lambda functions have X-Ray active, and EC2/ECS-based apps run the X-Ray daemon. X-Ray will help you pinpoint if latency issues are happening in one region vs another.
* **Synthetic Monitoring & Health Checks:** Consider using Route 53 Health Checks or AWS CloudWatch Synthetics canaries to continuously test your application endpoints from different regions. This can give you an early warning if the primary region is down or slow, triggering your failover processes.
* **CloudTrail & AWS Config:** Enable AWS CloudTrail in each region (and consider cross-region trail aggregation to an S3 bucket) so you have an audit log of all actions. AWS Config can also be enabled in multiple regions to track resource changes and compliance. This is part of “enterprise security patterns” – having audit and change visibility in all regions is important, especially when you have resources like KMS keys, security groups, etc., in multiple locations.
* **Alerts and Incident Response:** Integrate these monitoring tools with an SNS or PagerDuty, etc., to alert your ops team if something goes wrong. For example, set an alarm if **Replication** to the secondary region falls behind or fails (AWS Backup and S3 both provide metrics or events for failures), so you know if your DR copy is at risk.

### Additional Security Best Practices

Finally, consider some security enhancements for a production, multi-region, enterprise setup:

* **KMS Key Management:** We discussed enabling key rotation for KMS CMKs. Also, ensure **least privilege IAM policies** are in place – e.g. the backup vault access policy should allow only the necessary services. Use separate KMS keys for different data classifications if needed (and **alias** them clearly), and consider using AWS KMS **alias rotations** for simplicity when rotating keys.
* **Secrets Manager & Parameter Store:** Use Secrets Manager for secrets (with replication as covered) and Parameter Store for configuration, rather than hard-coding sensitive values. Rotate secrets regularly (Secrets Manager can automate rotation for databases, etc.). Ensure that your DR region’s applications have permissions to read the secret replicas.
* **Network Security:** If you have multi-region deployments, use **VPC peering or Transit Gateway** connections between regions if needed for private connectivity, and ensure security groups/NACLs are properly configured in each region. For truly active-active, consider AWS Global Accelerator or Route 53 latency-based routing to direct users to the closest region, with failover routing in place in case one region goes down.
* **Multi-Region Testing:** Regularly conduct **disaster recovery drills**. Simulate region failover by switching your routing to the secondary region or restoring from backups into the DR region and running your workload there. This will validate that your backups (and global tables, etc.) are working as expected and that you can meet the 15-minute RTO target with your processes.

By implementing these best practices – **fixing the backup plan parameters**, using **global tables** for DynamoDB, leveraging **multi-region KMS keys and secret replication**, setting up **S3 cross-region replication** carefully, and bolstering monitoring and security – you will achieve a robust production-ready infrastructure with multi-region disaster recovery, comprehensive monitoring, and strong security compliance.

**Sources:**

* AWS Backup – Backup rule window requirements
* AWS Backup – Lifecycle cold storage rules
* AWS Backup – Cross-region copy encryption details
* AWS Backup – Cross-region copy RDS option group requirement
* DynamoDB Global Tables – CloudFormation FAQ
* AWS KMS – Multi-Region keys overview and limitations
* AWS Secrets Manager – Multi-region secret replication info
* AWS KMS – Key rotation policy
* Amazon S3 – CloudFormation replication role dependency example


Research on AWS Backup Plan Configuration and Multi‑Region Disaster‑Recovery Architecture
1 Minimum Values for AWS Backup Start and Completion Windows
Start window (StartWindowMinutes). The start window represents the period after a scheduled backup time during which AWS Backup allows a job to start. The AWS SDK documentation explains that if you set this value, it must be at least 60 minutes; during this period AWS Backup retries every 10 minutes until the backup begins
javadoc.io
sdk.amazonaws.com
. The default when omitted is eight hours. Setting a lower value (e.g., 30 minutes) causes CloudFormation to fail with the error shown in the user’s question (“StartWindowMinutes minimum value is: 60 minutes”).

Completion window (CompletionWindowMinutes). This optional window specifies how long after a backup starts AWS Backup will allow the job to run. The SDK documentation clarifies that there is no minimum for this value; AWS Backup simply cancels the job if it does not finish within the specified duration
boto3.amazonaws.com
. However, the completion window begins at the scheduled start time (it does not add to the start window), so it should be long enough to allow the backup to finish.

2 Valid Lifecycle Values (MoveToColdStorageAfterDays and DeleteAfterDays)
AWS Backup lifecycle policies control when backups transition from warm storage to cold storage and when they are deleted. The MoveToColdStorageAfterDays parameter can be any integer ≥ 1 day or omitted to keep backups in warm storage. The DeleteAfterDays parameter specifies the retention period. SDK documentation examples show that these values can range from a few days to many years. In addition:

90‑day cold‑storage rule. AWS mandates that any recovery point moved to cold storage must remain there for at least 90 days. Consequently, the DeleteAfterDays value must be 90 days greater than the MoveToColdStorageAfterDays value
sdk.amazonaws.com
boto3.amazonaws.com
. For example, if a backup transitions to cold storage after 30 days, the minimum retention must be 120 days.

If either parameter is omitted, the backup stays in warm storage until deletion, or it is retained indefinitely when neither value is provided.

This rule also applies to cross‑region copy actions. When copying backups to another region, the retention period of the copy must be at least 90 days longer than the transition period, and once a backup moves to cold storage, you cannot shorten its lifecycle
boto3.amazonaws.com
boto3.amazonaws.com
.

3 Constraints Between Retention and Cold‑Storage Transition
The 90‑day requirement imposes a simple constraint:

text
Copy
DeleteAfterDays – MoveToColdStorageAfterDays ≥ 90
This ensures that recovery points remain in cold storage long enough to satisfy AWS retention requirements. The value of MoveToColdStorageAfterDays can be zero or more days (0 days means “never move to cold storage”), but DeleteAfterDays must still exceed it by at least 90 days. Once a backup has been moved to cold storage, you cannot reduce DeleteAfterDays; you can only extend it or leave it unchanged
sdk.amazonaws.com
.

4 Recommended Configuration for Hourly Backups (1‑hour RPO / 15‑minute RTO)
Achieving aggressive RPO/RTO targets requires more than just adjusting AWS Backup parameters:

Frequency of backups. For transactional data such as RDS or DynamoDB, AWS best practices recommend hourly or continuous backups
n2ws.com
. A 1‑hour RPO with a 15‑minute RTO implies that backups should be taken at least every 15 minutes or that the data service should support point‑in‑time recovery. AWS Backup alone cannot guarantee a 15‑minute recovery if backups are only created hourly; adding service‑native features (e.g., RDS/Aurora automated backups, DynamoDB point‑in‑time recovery) or enabling continuous backup mode is essential.

Start/Completion windows. Set StartWindowMinutes to ≥ 60 minutes and CompletionWindowMinutes to a value comfortably longer than the backup’s expected runtime (for example, 120 minutes). This prevents start‑window errors and ensures the job has enough time to complete
javadoc.io
.

Lifecycle settings. Keep short‑term backups for only a few days to allow quick recovery (e.g., retain hourly backups for 7–14 days and daily backups for longer). Apply the same lifecycle to cross‑region copies, ensuring that retention values satisfy the 90‑day cold‑storage constraint.

Restore procedures. Meeting a 15‑minute RTO requires automated and tested recovery processes. Use AWS Backup restore jobs or CloudFormation hooks to automate restores and regularly test them. Ensure that IAM roles, KMS keys, networking and resource dependencies are correctly configured so that restores succeed quickly.

Cross‑region disaster recovery. Configure copy actions that replicate backups to a secondary region and to another account if required. Apply lifecycle policies to those copies, again meeting the 90‑day rule. Test restoring from the secondary vault to verify cross‑region DR.

5 Cross‑Region Copy Requirements and Service Limitations
KMS encryption. Cross‑region copy actions require customer‑managed KMS keys at the destination; AWS‑managed keys cannot be used for cross‑account or cross‑region copies
repost.aws
.

Unsupported combinations. Certain services (Amazon RDS, Aurora, DocumentDB and Neptune) cannot perform both cross‑region and cross‑account copy in a single copy action. AWS re:Post clarifies that these services allow only one dimension of copying at a time; to achieve cross‑account and cross‑region backup for these services, you must first copy to another account, then to another region (or vice versa)
tylerrussell.dev
repost.aws
.

Lifecycle rules. The 90‑day retention constraint also applies to copy actions
boto3.amazonaws.com
. You must define lifecycle settings for the copied backups; if no lifecycle is defined, the copy inherits the source retention.

IAM role and vault policies. The destination backup vault must allow backup:CopyIntoBackupVault, and the IAM role used for backup must have backup:StartCopy permissions. Without these, cross‑region copies will fail.

6 DynamoDB Global Tables in CloudFormation
An AWS Builder Center article warns that you cannot convert a AWS::DynamoDB::Table resource into a AWS::DynamoDB::GlobalTable by changing its type. Such a change can result in CloudFormation deleting the existing table

builder.aws.com
. Instead, treat global tables as separate resources:

Create a AWS::DynamoDB::GlobalTable resource with a single replica in one region.

After the resource is created, update the stack to add additional replicas in other regions.

To migrate an existing table to a global table, create a new global table with replication and then import data (or cut over) rather than changing the resource type.

7 Regional Limits for Multi‑Region KMS Keys and Secrets Manager Replicas
7.1 Multi‑Region KMS Keys
Key architecture. A multi‑region key set consists of one primary key and one replica per region. Replicas share the same key material but are independent AWS KMS resources with their own policies
policyascode.dev
.

Creation and conversion. You cannot convert an existing single‑region KMS key into a multi‑region key; a new multi‑region key must be created and data re‑encrypted
policyascode.dev
.

Region availability. Multi‑region keys are available in all commercial regions except the China (Beijing) and China (Ningxia) regions
cloudericks.com
. Replicas must be created within the same AWS partition; i.e., you cannot replicate a key across partitions (e.g., from AWS Standard to AWS GovCloud or China)
cloudericks.com
.

Management overhead. Although multi‑region keys share key material, each replica must be managed individually. Key policy changes on the primary propagate to replicas, but attributes such as tags do not
policyascode.dev
.

7.2 Secrets Manager Replication
Replication support. AWS Secrets Manager supports replicating secrets across multiple regions for disaster recovery. Educative articles explain that this feature automatically synchronizes secrets in different regions so applications can access the same credentials even if a region fails
how.dev
. Scaler’s documentation notes that the feature simplifies multi‑region DR by duplicating secrets across various regions
scaler.com
.

Latency. There is no specific SLA for replication latency. An AWS re:Post answer points out that replication is eventually consistent; secret updates are applied to the primary copy first and then propagated to replicas. Applications should handle cases where the latest version is not immediately available in all regions

repost.aws
.

Region availability. Secrets Manager replication is supported in most AWS regions. There are no major restrictions beyond normal regional service availability, but like KMS, replication across partitions (e.g., to China or GovCloud) is not supported.

8 Best Practices for Cross‑Region S3 Replication (Avoiding Circular Dependencies)
S3 Cross‑Region Replication (CRR) and Same‑Region Replication (SRR) replicate new objects from a source bucket to a destination bucket. To avoid circular dependencies and replication loops:

Use unidirectional replication. Define separate replication rules for each direction instead of a single configuration that replicates both ways. Each replication rule should have its own IAM role and target bucket.

Do not replicate replicas. S3 marks replicated objects with the header x‑amz‑replication‑status=REPLICA. Replication rules automatically ignore objects with this status, preventing them from being replicated again. Ensure that your replication configuration does not override this behavior.

Different buckets for logs. AWS documentation on server‑access logs highlights that the source and target buckets should be different to avoid an infinite loop when storing access logs

jayendrapatil.com
. A similar principle applies to replication: the destination bucket should not replicate back to the source unless specifically intended for bi‑directional use.

IAM and encryption. Each replication rule needs an IAM role that permits s3:GetObject on the source and s3:ReplicateObject and s3:ReplicateDelete on the destination. If buckets use KMS encryption, ensure the replication role can use the destination KMS key.

Versioning and object ownership. Enable versioning on both buckets, and ensure that the source bucket owner owns the destination objects. Use the BucketOwnerPreferred setting to preserve ownership if necessary.

9 Outcome for CloudFormation Template
The research reveals why the user’s CloudFormation template fails and how to remedy it:

Correct start window. The hourly rule uses StartWindowMinutes: 30, which is below the documented minimum of 60 minutes and causes the error. Changing this value to 60 or greater resolves the error
javadoc.io
.

Lifecycle constraints. If the plan uses cold storage, ensure DeleteAfterDays is at least 90 days greater than MoveToColdStorageAfterDays for both primary and copy actions
boto3.amazonaws.com
.

Copy action limitations. If the backup plan covers RDS/Aurora/DocumentDB/Neptune, avoid configuring a single copy action that performs both cross‑region and cross‑account operations
tylerrussell.dev
. Instead, configure separate copy actions or rely on service‑specific replication.

DynamoDB Global Tables. Define global tables using AWS::DynamoDB::GlobalTable rather than converting a Table resource

builder.aws.com
.

Multi‑region KMS keys and secrets. Create multi‑region KMS keys (or replicate secrets) in each region to support cross‑region replication. For KMS keys, ensure they are multi‑region keys; single‑region keys cannot be converted
policyascode.dev
.

These adjustments provide a production‑ready, multi‑region backup and disaster‑recovery architecture with proper monitoring and compliance.