Redis Cloud quick start
Redis Cloud

If you're new to Redis Cloud, this quick start helps you get up and running.
You'll learn how to:
Create an account and a free database
Connect to your database
If you already have an account, see Create an Essentials database to create a Free 30 MB Essentials database. Free plans are a type of Essentials plans; this provides an easy upgrade path when you need it.
If you already have a database, see Manage databases.
Create an account 
To create a new account with a free database:
Go to the Sign up page.
There are two options available to get started with Redis Cloud:
Enter your information in the form and select Get Started.
Sign up with Google or Github.
After you enter your information, you should receive an activation email from Redis. Select Activate account to go to the Create your database page in the Redis Cloud console.
You'll go to the create database page with the Free plan selected.

Note:
If you want to create a different type of database, see the following guides:
Create a Redis Flex database
Create an Essentials database
Create a Pro database
Redis will generate a database name for you. If you want to change it, you can do so in the Database name field.

Choose your Cloud vendor and Region.
Select Create database.

When you create your database, there's a brief pause while your request is processed and then the Database details page appears.
In the upper corner, an icon shows the current status of the database. If the icon shows an orange clock, this means your database is still being created and its status is pending.
 
Once the database has been created, it becomes active and the status indicator switches to a green circle containing a checkmark.
When your new database becomes active, you're ready to connect to it.
Connect to a database 
At this point, you're viewing the Configuration details for your new database. Go to the Security section of the page.
To connect to your database, you need your username and password. Each database is protected by a Default user called default and a masked Default user password. Select the eye icon to show or hide the password.

Once you have the username and password, select Connect to open the connection wizard.

The connection wizard provides the following database connection methods:
Redis Insight
redis-cli utility
Redis client for your preferred programming language

Redis Insight 
Redis Insight is a free Redis GUI that lets you visualize your Redis data and learn more about Redis.
You can connect to your database with Redis Insight in two ways:
Open your database in Redis Insight in your browser.
Download and Install Redis Insight on Windows, macOS, and Linux.
Open in your browser 
Note:
Opening your database with Redis Insight in your browser is currently available for some Essentials databases, and will be available to more Essentials databases over time.
If Redis Insight on Redis Cloud is available for your database, select Launch Redis Insight web from the connection wizard to open it.

You can also select Launch from the database page under View and manage data with Redis Insight to open Redis Insight in your browser.

Redis Insight will open in a new tab.
From there, you can:
Select Load sample data to add sample data into your database.
Select Explore to learn how to use Redis.
For more information on how to use Redis Insight in your browser, see Open with Redis Insight on Redis Cloud.
Install and open on your computer 
In the connection wizard, under Redis Insight, select Download to download Redis Insight.
Install Redis Insight.
Once installed, select Open in desktop.
A pop-up asks if you wish to open the link with Redis Insight. Select Open Redis Insight to connect to your database with Redis Insight.
See the Redis Insight docs for more info.
Redis client 
A Redis client is a software library or tool that enables applications to interact with a Redis server. Each client has its own syntax and installation process. For help with a specific client, see the client's documentation.
The connection wizard provides code snippets to connect to your database with the following programming languages:
.NET using NRedisStack
node.js using node-redis
Python using redis-py
Java using Jedis and Lettuce
Go using go-redis
PHP using Predis

See Clients to learn how to connect with the official Redis clients.
See the following guides to get started with different Redis use cases:
Data structure store
Document database
Vector database
RAG with Redis
Redis for AI
redis-cli 
The redis-cli utility is installed when you install Redis. It provides a command-line interface that lets you work with your database using core Redis commands.
To run redis-cli, install Redis Stack on your machine.
See Redis CLI to learn how to use redis-cli.
More info 
Connect your application
Import data
Manage databases
Data persistence
Secure your Redis Cloud database
Back-up databases
Monitor Redis Cloud performance
Continue learning with Redis University 
See the Get started with Redis Cloud learning path for courses.
RATE THIS PAGE
★★★★★
Back to top ↑
Edit this pageCreate an issue
On this page
Create an account
Connect to a database
Redis Insight
Redis client
redis-cli
More info
Continue learning with Redis University
TrustPrivacyTerms of useLegal notices
Use Cases
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
Industries
Financial ServicesGamingHealthcareRetailAll industries
Compare
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
Company
Mission & valuesLeadershipCareersNews
Connect
CommunityEvents & webinarsNews
Partners
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
Support
Professional servicesSupport
         All products         Redis Enterprise         Redis Cloud         Redis Open Source         Redis Insight         Redis Enterprise for K8s         Redis Data Integration         Client Libraries       
ESC

Plan Redis Enterprise Software deployment
Plan a deployment of Redis Enterprise Software.
Redis Enterprise Software

Before installing Redis Enterprise Software, you need to:
Set up your hardware. See Hardware requirements and Persistent and ephemeral node storage for more information.
Choose your deployment platform.
Redis Enterprise Software supports a variety of platforms, including:
Multiple Linux distributions (Ubuntu, Red Hat Enterprise Linux (RHEL), IBM CentOS, Oracle Linux)
Amazon AWS AMI
Docker container (for development and testing only)
Kubernetes
For more details, see Supported platforms.
Open appropriate network ports in the firewall to allow connections to the nodes.
Configure cluster DNS so that cluster nodes can reach each other by DNS names.
By default, the installation process requires an internet connection to install dependencies and synchronize the operating system clock. To learn more, see Offline installation.
Configure different mount points for data and log directories.
Next steps 
After you finish planning your deployment, you can:
Download an installation package.
Prepare to install Redis Enterprise Software.
View installation questions and prepare answers before installation.
RATE THIS PAGE
★★★★★
Back to top ↑
Edit this pageCreate an issue
On this page
Next steps
TrustPrivacyTerms of useLegal notices
Use Cases
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
Industries
Financial ServicesGamingHealthcareRetailAll industries
Compare
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
Company
Mission & valuesLeadershipCareersNews
Connect
CommunityEvents & webinarsNews
Partners
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
Support
Professional servicesSupport
         All products         Redis Enterprise         Redis Cloud         Redis Open Source         Redis Insight         Redis Enterprise for K8s         Redis Data Integration         Client Libraries       
ESC

RAG with Redis
Understand how to use Redis for RAG use cases
What is Retrieval Augmented Generation (RAG)? 
Large Language Models (LLMs) generate human-like text but are limited by the data they were trained on. RAG enhances LLMs by integrating them with external, domain-specific data stored in a Redis vector database.
RAG involves three main steps:
Retrieve: Fetch relevant information from Redis using vector search and filters based on the user query.
Augment: Create a prompt for the LLM, including the user query, relevant context, and additional instructions.
Generate: Return the response generated by the LLM to the user.
RAG enables LLMs to use real-time information, improving the accuracy and relevance of generated content. Redis is ideal for RAG due to its speed, versatility, and familiarity.
The role of Redis in RAG 
Redis provides a robust platform for managing real-time data. It supports the storage and retrieval of vectors, essential for handling large-scale, unstructured data and performing similarity searches. Key features and components of Redis that make it suitable for RAG include:
Vector database: Stores and indexes vector embeddings that semantically represent unstructured data.
Semantic cache: Caches frequently asked questions (FAQs) in a RAG pipeline. Using vector search, Redis retrieves similar previously answered questions, reducing LLM inference costs and latency.
LLM session manager: Stores conversation history between an LLM and a user. Redis fetches recent and relevant portions of the chat history to provide context, improving the quality and accuracy of responses.
High performance and scalability: Known for its low latency and high throughput, Redis is ideal for RAG systems and AI agents requiring rapid data retrieval and generation.
Build a RAG Application with Redis 
To build a RAG application with Redis, follow these general steps:
Set up Redis: Start by setting up a Redis instance and configuring it to handle vector data.
Use a Framework:
Redis Vector Library (RedisVL): RedisVL enhances the development of generative AI applications by efficiently managing vectors and metadata. It allows for storage of vector embeddings and facilitates fast similarity searches, crucial for retrieving relevant information in RAG.
Popular AI frameworks: Redis integrates seamlessly with various AI frameworks and tools. For instance, combining Redis with LangChain or LlamaIndex, libraries for building language models, enables developers to create sophisticated RAG pipelines. These integrations support efficient data management and building real-time LLM chains.
Spring AI and Redis: Using Spring AI with Redis simplifies building RAG applications. Spring AI provides a structured approach to integrating AI capabilities into applications, while Redis handles data management, ensuring the RAG pipeline is efficient and scalable.
Embed and store data: Convert your data into vector embeddings using a suitable model (e.g., BERT, GPT). Store these embeddings in Redis, where they can be quickly retrieved based on vector searches.
Integrate with a generative model: Use a generative AI model that can leverage the retrieved data. The model will use the vectors stored in Redis to augment its generation process, ensuring the output is informed by relevant, up-to-date information.
Query and generate: Implement the query logic to retrieve relevant vectors from Redis based on the input prompt. Feed these vectors into the generative model to produce augmented outputs.
Benefits of Using Redis for RAG 
Efficiency: The in-memory data store of Redis ensures that retrieval operations are performed with minimal latency.
Scalability: Redis scales horizontally, seamlessly handling growing volumes of data and queries.
Flexibility: Redis supports a variety of data structures and integrates with AI frameworks.
In summary, Redis offers a powerful and efficient platform for implementing RAG. Its vector management capabilities, high performance, and seamless integration with AI frameworks make it an ideal choice for enhancing generative AI applications with real-time data retrieval.
Resources 
RAG defined.
RAG overview.
Redis Vector Library (RedisVL) and introductory article.
RAG with Redis and SpringAI
Build a multimodal RAG app with LangChain and Redis
Get hands-on with advanced Redis AI Recipes
Continue learning with Redis University 
See the Vector Advanced Topics course to learn more.
RATE THIS PAGE
★★★★★
Back to top ↑
Edit this pageCreate an issue
On this page
What is Retrieval Augmented Generation (RAG)?
The role of Redis in RAG
Build a RAG Application with Redis
Benefits of Using Redis for RAG
Resources
Continue learning with Redis University
TrustPrivacyTerms of useLegal notices
Use Cases
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
Industries
Financial ServicesGamingHealthcareRetailAll industries
Compare
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
Company
Mission & valuesLeadershipCareersNews
Connect
CommunityEvents & webinarsNews
Partners
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
Support
Professional servicesSupport
         All products         Redis Enterprise         Redis Cloud         Redis Open Source         Redis Insight         Redis Enterprise for K8s         Redis Data Integration         Client Libraries       
ESC

Deploy Redis Enterprise Software for Kubernetes
How to install Redis Enterprise Software for Kubernetes.
Redis Enterprise for Kubernetes

To deploy Redis Enterprise Software for Kubernetes and start your Redis Enterprise cluster (REC), you need to do the following:
Create a new namespace in your Kubernetes cluster.
Download the operator bundle.
Apply the operator bundle and verify it's running.
Create a Redis Enterprise cluster (REC).
This guide works with most supported Kubernetes distributions. If you're using OpenShift, see Redis Enterprise on OpenShift. For details on what is currently supported, see supported distributions.
Prerequisites 
To deploy Redis Enterprise for Kubernetes, you'll need:
Kubernetes cluster in a supported distribution
minimum of three worker nodes
Kubernetes client (kubectl)
access to DockerHub, RedHat Container Catalog, or a private repository that can hold the required images.
If you suspect your file descriptor limits are below 100,000, you must either manually increase limits or Allow automatic resource adjustment. Most major cloud providers and standard container runtime configurations set default file descriptor limits well above the minimum required by Redis Enterprise. In these environments, you can safely run without enabling automatic resource adjustment.
Note:
If you are applying version 7.8.2-6 or above, check if the OS installed on the node is supported.
Create a new namespace 
Important: Each namespace can only contain one Redis Enterprise cluster. Multiple RECs with different operator versions can coexist on the same Kubernetes cluster, as long as they are in separate namespaces.
Throughout this guide, each command is applied to the namespace in which the Redis Enterprise cluster operates.
Create a new namespace
kubectl create namespace <rec-namespace>


Change the namespace context to make the newly created namespace default for future commands.
kubectl config set-context --current --namespace=<rec-namespace>


You can use an existing namespace as long as it does not contain any existing Redis Enterprise cluster resources. It's best practice to create a new namespace to make sure there are no Redis Enterprise resources that could interfere with the deployment.
Install the operator 
Redis Enterprise for Kubernetes bundle is published as a container image. A list of required images is available in the release notes for each version.
The operator definition and reference materials are available on GitHub. The operator definitions are packaged as a single generic YAML file.
Note:
If you do not pull images from DockerHub or another public registry, you need to use a private container registry.
Download the operator bundle 
Pull the latest version of the operator bundle:
|
If you need a different release, replace VERSION with a specific release tag.
Check version tags listed with the operator releases on GitHub or by using the GitHub API to ensure the version of the bundle is correct.
Deploy the operator bundle 
Apply the operator bundle in your REC namespace:
kubectl apply -f https://raw.githubusercontent.com/RedisLabs/redis-enterprise-k8s-docs/$VERSION/bundle.yaml

You should see a result similar to this:
role.rbac.authorization.k8s.io/redis-enterprise-operator created

serviceaccount/redis-enterprise-operator created

rolebinding.rbac.authorization.k8s.io/redis-enterprise-operator created

customresourcedefinition.apiextensions.k8s.io/redisenterpriseclusters.app.redislabs.com configured

customresourcedefinition.apiextensions.k8s.io/redisenterprisedatabases.app.redislabs.com configured

deployment.apps/redis-enterprise-operator created

Warning:
DO NOT modify or delete the StatefulSet created during the deployment process. Doing so could destroy your Redis Enterprise cluster (REC).
Verify the operator is running 
Check the operator deployment to verify it's running in your namespace:
kubectl get deployment redis-enterprise-operator

You should see a result similar to this:
NAME                        READY   UP-TO-DATE   AVAILABLE   AGE

redis-enterprise-operator   1/1     1            1           0m36s

Create a Redis Enterprise cluster (REC) 
A Redis Enterprise cluster (REC) is created from a RedisEnterpriseCluster custom resource that contains cluster specifications.
The following example creates a minimal Redis Enterprise cluster. See the RedisEnterpriseCluster API reference for more information on the various options available.
Note:
If you suspect your file descriptor limits are below 100,000, you must either manually increase limits or Allow automatic resource adjustment. Most major cloud providers and standard container runtime configurations set default file descriptor limits well above the minimum required by Redis Enterprise. In these environments, you can safely run without enabling automatic resource adjustment.
Create a file that defines a Redis Enterprise cluster with three nodes.
Note:
The REC name (my-rec in this example) cannot be changed after cluster creation.
cat <<EOF > my-rec.yaml


apiVersion: "app.redislabs.com/v1"


kind: "RedisEnterpriseCluster"


metadata:


 name: my-rec


spec:


 nodes: 3


EOF


This will request a cluster with three Redis Enterprise nodes using the default requests (i.e., 2 CPUs and 4GB of memory per node).
To test with a larger configuration, use the example below to add node resources to the spec section of your test cluster (my-rec.yaml).
redisEnterpriseNodeResources:


 limits:


   cpu: 2000m


   memory: 16Gi


 requests:


   cpu: 2000m


   memory: 16Gi


Note:
Each cluster must have at least 3 nodes. Single-node RECs are not supported.
See the Redis Enterprise hardware requirements for more information on sizing Redis Enterprise node resource requests.
Note:
If you enabled automatic resource adjustment in your configuration, this step will trigger the operator to apply elevated capabilities. Ensure your security context allows it.
Apply your custom resource file in the same namespace as my-rec.yaml.
kubectl apply -f my-rec.yaml


You should see a result similar to this:
redisenterprisecluster.app.redislabs.com/my-rec created


You can verify the creation of the cluster with:
kubectl get rec


You should see a result similar to this:
NAME           AGE


my-rec   1m


At this point, the operator will go through the process of creating various services and pod deployments.
You can track the progress by examining the StatefulSet associated with the cluster:
kubectl rollout status sts/my-rec


or by looking at the status of all of the resources in your namespace:
kubectl get all


Enable the admission controller 
The admission controller dynamically validates REDB resources configured by the operator. It is strongly recommended that you use the admission controller on your Redis Enterprise Cluster (REC). The admission controller only needs to be configured once per operator deployment.
As part of the REC creation process, the operator stores the admission controller certificate in a Kubernetes secret called admission-tls. You may have to wait a few minutes after creating your REC to see the secret has been created.
Verify the admission-tls secret exists.
kubectl get secret admission-tls


The output should look similar to
NAME            TYPE     DATA   AGE


admission-tls   Opaque   2      2m43s


Save the certificate to a local environment variable.
CERT=`kubectl get secret admission-tls -o jsonpath='{.data.cert}'`


Create a Kubernetes validating webhook, replacing <namespace> with the namespace where the REC was installed.
The webhook.yaml template can be found in redis-enterprise-k8s-docs/admission
|
Create a patch file for the Kubernetes validating webhook.
cat > modified-webhook.yaml <<EOF


webhooks:


- name: redisenterprise.admission.redislabs


 clientConfig:


  caBundle: $CERT


EOF


Patch the webhook with the certificate.
kubectl patch ValidatingWebhookConfiguration \


   redis-enterprise-admission --patch "$(cat modified-webhook.yaml)"


Limit the webhook to the relevant namespaces 
The operator bundle includes a webhook file. The webhook will intercept requests from all namespaces unless you edit it to target a specific namespace. You can do this by adding the namespaceSelector section to the webhook spec to target a label on the namespace.
Make sure the namespace has a unique namespace-name label.
apiVersion: v1


kind: Namespace


metadata:


  labels:


   namespace-name: example-ns


name: example-ns


Patch the webhook to add the namespaceSelector section.
cat > modified-webhook.yaml <<EOF


webhooks:


- name: redisenterprise.admission.redislabs


 namespaceSelector:


   matchLabels:


     namespace-name: staging


EOF


Apply the patch.
kubectl patch ValidatingWebhookConfiguration \


 redis-enterprise-admission --patch "$(cat modified-webhook.yaml)"


Verify the admission controller is working 
Verify the admission controller is installed correctly by applying an invalid resource. This should force the admission controller to correct it.
kubectl apply -f - << EOF


apiVersion: app.redislabs.com/v1alpha1


kind: RedisEnterpriseDatabase


metadata:


 name: redis-enterprise-database


spec:


 evictionPolicy: illegal


EOF


You should see your request was denied by the admission webhook "redisenterprise.admission.redislabs".
Error from server: error when creating "STDIN": admission webhook "redisenterprise.admission.redislabs" denied the request: eviction_policy: u'illegal' is not one of [u'volatile-lru', u'volatile-ttl', u'volatile-random', u'allkeys-lru', u'allkeys-random', u'noeviction', u'volatile-lfu', u'allkeys-lfu']


Create a Redis Enterprise Database (REDB) 
You can create multiple databases within the same namespace as your REC or in other namespaces.
See manage Redis Enterprise databases for Kubernetes to create a new REDB.
RATE THIS PAGE
★★★★★
Back to top ↑
Edit this pageCreate an issue
On this page
Prerequisites
Create a new namespace
Install the operator
Download the operator bundle
Deploy the operator bundle
Create a Redis Enterprise cluster (REC)
Enable the admission controller
Limit the webhook to the relevant namespaces
Verify the admission controller is working
Create a Redis Enterprise Database (REDB)
TrustPrivacyTerms of useLegal notices
Use Cases
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
Industries
Financial ServicesGamingHealthcareRetailAll industries
Compare
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
Company
Mission & valuesLeadershipCareersNews
Connect
CommunityEvents & webinarsNews
Partners
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
Support
Professional servicesSupport
         All products         Redis Enterprise         Redis Cloud         Redis Open Source         Redis Insight         Redis Enterprise for K8s         Redis Data Integration         Client Libraries       
ESC

Install Redis Enterprise Helm chart
Install Redis Enterprise for Kubernetes version 7.8.6 using Helm charts.
Redis Enterprise for Kubernetes

Helm charts provide a simple way to install the Redis Enterprise for Kubernetes operator in just a few steps. For more information about Helm, go to https://helm.sh/docs/.
Prerequisites 
A supported distribution of Kubernetes.
At least three worker nodes.
Kubernetes client (kubectl).
Helm 3.10 or later or 3.18 for migrating from a non-Helm installation.
If you suspect your file descriptor limits are below 100,000, you must either manually increase limits or Allow automatic resource adjustment. Most major cloud providers and standard container runtime configurations set default file descriptor limits well above the minimum required by Redis Enterprise. In these environments, you can safely run without enabling automatic resource adjustment.
Example values 
The steps below use the following placeholders to indicate command line parameters you must provide:
<repo-name> is the name of the repo holding your Helm chart (example: redis).
<release-name> is the name you give a specific installation of the Helm chart (example: my-redis-enterprise-operator)
<chart-version> is the version of the Helm chart you are installing (example: 7.8.2-2)
<namespace-name> is the name of the new namespace the Redis operator will run in (example: ns1)
<path-to-chart> is the filepath to the Helm chart, if it is stored in a local directory (example: /home/charts/redis-enterprise-operator)
Install 
Add the Redis repository.
helm repo add <repo-name> https://helm.redis.io/


Install the Helm chart into a new namespace.
helm install <release-name> <repo-name>/redis-enterprise-operator \

   --version <chart-version> \

   --namespace <namespace-name> \

   --create-namespace

To install with Openshift, add --set openshift.mode=true.
To monitor the installation add the --debug flag. The installation runs several jobs synchronously and may take a few minutes to complete.
Install from local directory 
Find the latest release on the redis-enterprise-k8s-docs repo and download the tar.gz source code into a local directory.
Install the Helm chart from your local directory.
helm install <release-name> <path-to-chart> \

   --namespace <namespace-name> \

   --create-namespace

To install with Openshift, add --set openshift.mode=true.
To monitor the installation add the --debug flag. The installation runs several jobs synchronously and may take a few minutes to complete.
Specify values during install 
View configurable values with helm show values <repo-name>/redis-enterprise-operator.
Install the Helm chart, overriding specific value defaults using --set.
helm install <operator-name> <repo-name>/redis-enterprise-operator \

   --version <chart-version> \

   --namespace <namespace-name> \

   --create-namespace

   --set <key1>=<value1> \

   --set <key2>=<value2>

Install with values file 
View configurable values with helm show values <repo-name>/redis-enterprise-operator.
Create a YAML file to specify the values you want to configure.
Install the chart with the --values option.
helm install <operator-name> <repo-name>/redis-enterprise-operator \

   --version <chart-version> \

   --namespace <namespace-name> \

   --create-namespace \

   --values <path-to-values-file>

Migrate from a non-Helm installation 
To migrate an existing non-Helm installation of the Redis Enterprise operator to a Helm-based installation:
Upgrade your existing Redis Enterprise operator to match the version of the Helm chart you want to install. Use the same non-Helm method you used for the original installation.
Install the Helm chart adding the --take-ownership flag:
helm install <release-name> <repo-name>/redis-enterprise-operator --take-ownership


The --take-ownership flag is available with Helm versions 3.18 or later.
This flag is only needed for the first installation of the chart. Subsequent upgrades don't require this flag.
Use the helm install command, not helm upgrade.
Delete the old ValidatingWebhookConfiguration object from the previous non-Helm installation:
kubectl delete validatingwebhookconfiguration redis-enterprise-admission


This step is only needed when the admission.limitToNamespace chart value is set to true (the default). In this case, the webhook object installed by the chart is named redis-enterprise-admission-<namespace>, and the original webhook object, named redis-enterprise-admission, becomes redundant. If admission.limitToNamespace is set to false, the webhook installed by the chart is named redis-enterprise-admission, and the existing webhook object is reused.
Upgrade the chart 
To upgrade an existing Helm chart installation:
helm upgrade <release-name> <repo-name>/redis-enterprise-operator --version <chart-version>

You can also upgrade from a local directory:
helm upgrade <release-name> <path-to-chart>

For example, to upgrade a chart with the release name my-redis-enterprise from the chart's root directory:
helm upgrade my-redis-enterprise .

To upgrade with OpenShift, add --set openshift.mode=true.
The upgrade process automatically updates the operator and its components, including the Custom Resource Definitions (CRDs). The CRDs are versioned and update only if the new version is higher than the existing version.
After you upgrade the operator, you might need to upgrade your Redis Enterprise clusters, depending on the Redis software version bundled with the operator. For detailed information about the upgrade process, see Redis Enterprise for Kubernetes upgrade documentation.
For more information and options when upgrading charts, see helm upgrade.
Uninstall 
Delete any custom resources managed by the operator. See Delete custom resources for detailed steps. You must delete custom resources in the correct order to avoid errors.
Uninstall the Helm chart.
helm uninstall <release-name>

This removes all Kubernetes resources associated with the chart and deletes the release.
Note:
Custom Resource Definitions (CRDs) installed by the chart are not removed during chart uninstallation. To remove them manually after uninstalling the chart, run kubectl delete crds -l app=redis-enterprise.
Known limitations 
The steps for creating the RedisEnterpriseCluster (REC) and other custom resources remain the same.
The chart doesn't include configuration options for multiple namespaces, rack-awareness, and Vault integration. The steps for configuring these options remain the same.
The chart has had limited testing in advanced setups, including Active-Active configurations, air-gapped deployments, and IPv6/dual-stack environments.
RATE THIS PAGE
★★★★★
Back to top ↑
Edit this pageCreate an issue
On this page
Prerequisites
Example values
Install
Install from local directory
Specify values during install
Install with values file
Migrate from a non-Helm installation
Upgrade the chart
Uninstall
Known limitations
TrustPrivacyTerms of useLegal notices
Use Cases
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
Industries
Financial ServicesGamingHealthcareRetailAll industries
Compare
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
Company
Mission & valuesLeadershipCareersNews
Connect
CommunityEvents & webinarsNews
Partners
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
Support
Professional servicesSupport
         All products         Redis Enterprise         Redis Cloud         Redis Open Source         Redis Insight         Redis Enterprise for K8s         Redis Data Integration         Client Libraries       
ESC

Install on AWS EC2
How to install Redis Insight on AWS EC2
Redis Insight

This tutorial shows you how to install Redis Insight on an AWS EC2 instance and manage ElastiCache Redis instances using Redis Insight. To complete this tutorial you must have access to the AWS Console and permissions to launch EC2 instances.
Step 1: Launch EC2 Instance 
Next, launch an EC2 instance.
Navigate to EC2 under AWS Console.
Click Launch Instance.
Choose 64-bit Amazon Linux AMI.
Choose at least a t2.medium instance. The size of the instance depends on the memory used by your ElastiCache instance that you want to analyze.
Under Configure Instance:
Choose the VPC that has your ElastiCache instances.
Choose a subnet that has network access to your ElastiCache instances.
Ensure that your EC2 instance has a public IP Address.
Assign the IAM role that you created in Step 1.
Under the storage section, allocate at least 100 GiB storage.
Under security group, ensure that:
Incoming traffic is allowed on port 5540
Incoming traffic is allowed on port 22 only during installation
Review and launch the ec2 instance.
Step 2: Verify permissions and connectivity 
Next, verify that the EC2 instance has the required IAM permissions and can connect to ElastiCache Redis instances.
SSH into the newly launched EC2 instance.
Open a command prompt.
Run the command aws s3 ls. This should list all S3 buckets.
If the aws command cannot be found, make sure your EC2 instance is based of Amazon Linux.
Next, find the hostname of the ElastiCache instance you want to analyze and run the command echo info | nc <redis host> 6379.
If you see some details about the ElastiCache Redis instance, you can proceed to the next step.
If you cannot connect to redis, you should review your VPC, subnet, and security group settings.
Step 3: Install Docker on EC2 
Next, install Docker on the EC2 instance. Run the following commands:
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user
Log out and log back in again to pick up the new docker group permissions.
To verify, run docker ps. You should see some output without having to run sudo.
Step 4: Run Redis Insight in the Docker container 
Finally, install Redis Insight using one of the options described below.
If you do not want to persist your Redis Insight data:
docker run -d --name redisinsight -p 5540:5540 redis/redisinsight:latest

If you want to persist your Redis Insight data, first attach the Docker volume to the /data path and then run the following command:
docker run -d --name redisinsight -p 5540:5540 redis/redisinsight:latest -v redisinsight:/data

If the previous command returns a permission error, ensure that the user with ID = 1000 has the necessary permission to access the volume provided (redisinsight in the command above).
Find the IP Address of your EC2 instances and launch your browser at http://<EC2 IP Address>:5540. Accept the EULA and start using Redis Insight.
Redis Insight also provides a health check endpoint at http://<EC2 IP Address>:5540/api/health/ to monitor the health of the running container.
Summary 
In this guide, we installed Redis Insight on an AWS EC2 instance running Docker. As a next step, you should add an ElastiCache Redis Instance and then run the memory analysis.
RATE THIS PAGE
★★★★★
Back to top ↑
Edit this pageCreate an issue
On this page
Step 1: Launch EC2 Instance
Step 2: Verify permissions and connectivity
Step 3: Install Docker on EC2
Step 4: Run Redis Insight in the Docker container
Summary
TrustPrivacyTerms of useLegal notices
Use Cases
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
Industries
Financial ServicesGamingHealthcareRetailAll industries
Compare
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
Company
Mission & valuesLeadershipCareersNews
Connect
CommunityEvents & webinarsNews
Partners
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
Support
Professional servicesSupport
         All products         Redis Enterprise         Redis Cloud         Redis Open Source         Redis Insight         Redis Enterprise for K8s         Redis Data Integration         Client Libraries       
ESC

nstall on Docker
How to install Redis Insight on Docker
Redis Insight

This tutorial shows how to install Redis Insight on Docker so you can use Redis Insight in development. See a separate guide for installing Redis Insight on AWS.
Install Docker 
The first step is to install Docker for your operating system.
Run Redis Insight Docker image 
You can install Redis Insight using one of the options described below.
If you do not want to persist your Redis Insight data:
docker run -d --name redisinsight -p 5540:5540 redis/redisinsight:latest

If you want to persist your Redis Insight data, first attach the Docker volume to the /data path and then run the following command:
docker run -d --name redisinsight -p 5540:5540 redis/redisinsight:latest -v redisinsight:/data

If the previous command returns a permission error, ensure that the user with ID = 1000 has the necessary permissions to access the volume provided (redisinsight in the command above).
Next, point your browser to http://localhost:5540.
Redis Insight also provides a health check endpoint at http://localhost:5540/api/health/ to monitor the health of the running container.
RATE THIS PAGE
★★★★★
Back to top ↑
Edit this pageCreate an issue
On this page
Install Docker
Run Redis Insight Docker image
TrustPrivacyTerms of useLegal notices
Use Cases
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
Industries
Financial ServicesGamingHealthcareRetailAll industries
Compare
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
Company
Mission & valuesLeadershipCareersNews
Connect
CommunityEvents & webinarsNews
Partners
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
Support
Professional servicesSupport
         All products         Redis Enterprise         Redis Cloud         Redis Open Source         Redis Insight         Redis Enterprise for K8s         Redis Data Integration         Client Libraries       
ESC

nstall on Kubernetes
How to install Redis Insight on Kubernetes
Redis Insight

This tutorial shows how to install Redis Insight on Kubernetes (K8s). This is an easy way to use Redis Insight with a Redis Enterprise K8s deployment.
Create the Redis Insight deployment and service 
Below is an annotated YAML file that will create a Redis Insight deployment and a service in a K8s cluster.
Create a new file named redisinsight.yaml with the content below.
# Redis Insight service with name 'redisinsight-service'

apiVersion: v1

kind: Service

metadata:

 name: redisinsight-service      # name should not be 'redisinsight'

                                  # since the service creates

                                  # environment variables that

                                  # conflicts with redisinsight

                                  # application's environment

                                  # variables `RI_APP_HOST` and

                                  # `RI_APP_PORT`

spec:

 type: LoadBalancer

 ports:

   - port: 80

     targetPort: 5540

 selector:

   app: redisinsight

---

# Redis Insight deployment with name 'redisinsight'

apiVersion: apps/v1

kind: Deployment

metadata:

 name: redisinsight #deployment name

 labels:

   app: redisinsight #deployment label

spec:

 replicas: 1 #a single replica pod

 selector:

   matchLabels:

     app: redisinsight #which pods is the deployment managing, as defined by the pod template

 template: #pod template

   metadata:

     labels:

       app: redisinsight #label for pod/s

   spec:

     containers:



     - name:  redisinsight #Container name (DNS_LABEL, unique)

       image: redis/redisinsight:latest #repo/image

       imagePullPolicy: IfNotPresent #Installs the latest Redis Insight version

       volumeMounts:

       - name: redisinsight #Pod volumes to mount into the container's filesystem. Cannot be updated.

         mountPath: /data

       ports:

       - containerPort: 5540 #exposed container port and protocol

         protocol: TCP

     volumes:

     - name: redisinsight

       emptyDir: {} # node-ephemeral volume https://kubernetes.io/docs/concepts/storage/volumes/#emptydir

Create the Redis Insight deployment and service:
kubectl apply -f redisinsight.yaml

Once the deployment and service are successfully applied and complete, access Redis Insight. This can be accomplished by using the <external-ip> of the service we created to reach Redis Insight.
$ kubectl get svc redisinsight-service

NAME                   CLUSTER-IP       EXTERNAL-IP      PORT(S)         AGE

redisinsight-service   <cluster-ip>     <external-ip>    80:32143/TCP    1m

If you are using minikube, run minikube list to list the service and access Redis Insight at http://<minikube-ip>:<minikube-service-port>.
$ minikube list
|-------------|----------------------|--------------|---------------------------------------------|
|  NAMESPACE  |         NAME         | TARGET PORT  |           URL                               |
|-------------|----------------------|--------------|---------------------------------------------|
| default     | kubernetes           | No node port |                                             |
| default     | redisinsight-service |           80 | http://<minikube-ip>:<minikubeservice-port> |
| kube-system | kube-dns             | No node port |                                             |
|-------------|----------------------|--------------|---------------------------------------------|

Create the Redis Insight deployment with persistant storage 
Below is an annotated YAML file that will create a Redis Insight deployment in a K8s cluster. It will assign a peristent volume created from a volume claim template. Write access to the container is configured in an init container. When using deployments with persistent writeable volumes, it's best to set the strategy to Recreate. Otherwise you may find yourself with two pods trying to use the same volume.
Create a new file redisinsight.yaml with the content below.
# Redis Insight service with name 'redisinsight-service'

apiVersion: v1

kind: Service

metadata:

 name: redisinsight-service      # name should not be 'redisinsight'

                                  # since the service creates

                                  # environment variables that

                                  # conflicts with redisinsight

                                  # application's environment

                                  # variables `RI_APP_HOST` and

                                  # `RI_APP_PORT`

spec:

 type: LoadBalancer

 ports:

   - port: 80

     targetPort: 5540

 selector:

   app: redisinsight

---

apiVersion: v1

kind: PersistentVolumeClaim

metadata:

 name: redisinsight-pv-claim

 labels:

   app: redisinsight

spec:

 accessModes:

   - ReadWriteOnce

 resources:

   requests:

     storage: 2Gi

 storageClassName: default

---

# Redis Insight deployment with name 'redisinsight'

apiVersion: apps/v1

kind: Deployment

metadata:

 name: redisinsight #deployment name

 labels:

   app: redisinsight #deployment label

spec:

 replicas: 1 #a single replica pod

 strategy:

   type: Recreate

 selector:

   matchLabels:

     app: redisinsight #which pods is the deployment managing, as defined by the pod template

 template: #pod template

   metadata:

     labels:

       app: redisinsight #label for pod/s

   spec:

     volumes:

       - name: redisinsight

         persistentVolumeClaim:

           claimName: redisinsight-pv-claim

     initContainers:

       - name: init

         image: busybox

         command:

           - /bin/sh

           - '-c'

           - |

             chown -R 1000 /data

         resources: {}

         volumeMounts:

           - name: redisinsight

             mountPath: /data

         terminationMessagePath: /dev/termination-log

         terminationMessagePolicy: File

     containers:

       - name:  redisinsight #Container name (DNS_LABEL, unique)

         image: redis/redisinsight:latest #repo/image

         imagePullPolicy: IfNotPresent #Always pull image

         volumeMounts:

         - name: redisinsight #Pod volumes to mount into the container's filesystem. Cannot be updated.

           mountPath: /data

         ports:

         - containerPort: 5540 #exposed container port and protocol

           protocol: TCP

Create the Redis Insight deployment and service.
kubectl apply -f redisinsight.yaml

Create the Redis Insight deployment without a service. 
Below is an annotated YAML file that will create a Redis Insight deployment in a K8s cluster.
Create a new file redisinsight.yaml with the content below
apiVersion: apps/v1

kind: Deployment

metadata:

 name: redisinsight # deployment name

 labels:

   app: redisinsight # deployment label

spec:

 replicas: 1 # a single replica pod

 selector:

   matchLabels:

     app: redisinsight # which pods is the deployment managing, as defined by the pod template

 template: # pod template

   metadata:

     labels:

       app: redisinsight # label for pod/s

   spec:

     containers:

     - name: redisinsight # Container name (DNS_LABEL, unique)

       image: redis/redisinsight:latest # repo/image

       imagePullPolicy: IfNotPresent # Always pull image

       env:

         # If there's a service named 'redisinsight' that exposes the

         # deployment, we manually set `RI_APP_HOST` and

         # `RI_APP_PORT` to override the service environment

         # variables.

         - name: RI_APP_HOST

           value: "0.0.0.0"

         - name: RI_APP_PORT

           value: "5540"

       volumeMounts:

       - name: redisinsight # Pod volumes to mount into the container's filesystem. Cannot be updated.

         mountPath: /data

       ports:

       - containerPort: 5540 # exposed container port and protocol

         protocol: TCP

       livenessProbe: # Probe to check container health

         httpGet:

           path: /healthcheck/ # exposed RI endpoint for healthcheck

           port: 5540 # exposed container port

         initialDelaySeconds: 5 # number of seconds to wait after the container starts to perform liveness probe

         periodSeconds: 5 # period in seconds after which liveness probe is performed

         failureThreshold: 1 # number of liveness probe failures after which container restarts

     volumes:

     - name: redisinsight

       emptyDir: {} # node-ephemeral volume https://kubernetes.io/docs/concepts/storage/volumes/#emptydir

Create the Redis Insight deployment
kubectl apply -f redisinsight.yaml

Note:
If the deployment will be exposed by a service whose name is 'redisinsight', set RI_APP_HOST and RI_APP_PORT environment variables to override the environment variables created by the service.
Run Redis Insight 
Once the deployment has been successfully applied and the deployment is complete, access Redis Insight. This can be accomplished by exposing the deployment as a K8s Service or by using port forwarding, as in the example below:
kubectl port-forward deployment/redisinsight 5540

Open your browser and point to http://localhost:5540
RATE THIS PAGE
★★★★★
Back to top ↑
Edit this pageCreate an issue
On this page
Create the Redis Insight deployment and service
Create the Redis Insight deployment with persistant storage
Create the Redis Insight deployment without a service.
Run Redis Insight
TrustPrivacyTerms of useLegal notices
Use Cases
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
Industries
Financial ServicesGamingHealthcareRetailAll industries
Compare
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
Company
Mission & valuesLeadershipCareersNews
Connect
CommunityEvents & webinarsNews
Partners
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
Support
Professional servicesSupport
         All products         Redis Enterprise         Redis Cloud         Redis Open Source         Redis Insight         Redis Enterprise for K8s         Redis Data Integration         Client Libraries       
ESC

Quickstart
Get started with a simple pipeline example
In this tutorial you will learn how to install RDI and set up a pipeline to ingest live data from a PostgreSQL database into a Redis database.
Prerequisites 
A Redis Enterprise database that will serve as the pipeline target. The dataset that will be ingested is quite small in size, so a single shard database should be enough. RDI also needs to maintain its own database on the cluster to store state information. This requires Redis Enterprise v6.4 or greater.
Redis Insight to edit your pipeline
A virtual machine (VM) with one of the following operating systems:


RHEL 8 or 9
Ubuntu 20.04, 22.04, or 24.04
Overview 
The following diagram shows the structure of the pipeline we will create (see the architecture overview to learn how the pipeline works):

Here, the RDI collector tracks changes in PostgreSQL and writes them to streams in the RDI database in Redis. The stream processor then reads data records from the RDI database streams, processes them, and writes them to the target.
Install PostgreSQL 
We provide a Docker image for an example PostgreSQL database that we will use for the tutorial. Follow the instructions on our Github page to download the image and start serving the database. The database, which is called chinook, has the schema and data for an imaginary online music store and is already set up for the RDI collector to use.
Install RDI 
Install RDI using the instructions in the VM installation guide.
RDI will create the pipeline template for your chosen source database type at /opt/rdi/config. You will need this pathname later when you prepare the pipeline for deployment (see Prepare the pipeline below).
At the end of the installation, RDI CLI will prompt you to set the access secrets for both the source PostgreSQL database and the target Redis database. RDI needs these to run the pipeline.
Use the Redis Enterprise Cluster Manager UI to create the RDI database with the following requirements:
Redis Enterprise v6.4 or greater for the cluster.
For production, 250MB RAM with one primary and one replica is recommended, but for the quickstart or for development, 125MB and a single shard is sufficient.
If you are deploying RDI for a production environment then secure this database with a password and TLS.
Set the database's eviction policy to noeviction. Note that you can't set this using rladmin, so you must either do it using the admin UI or with the following REST API command:
curl -v -k -d '{"eviction_policy": "noeviction"}' \


 -u '<USERNAME>:<PASSWORD>' \


 -H "Content-Type: application/json" \


 -X PUT https://<CLUSTER_FQDN>:9443/v1/bdbs/<BDB_UID>


Set the database's data persistence to AOF - fsync every 1 sec. Note that you can't set this using rladmin, so you must either do it using the admin UI or with the following REST API commands:
curl -v -k -d '{"data_persistence":"aof"}' \


 -u '<USERNAME>:<PASSWORD>' \


 -H "Content-Type: application/json" 


 -X PUT https://<CLUSTER_FQDN>:9443/v1/bdbs/<BDB_UID>


curl -v -k -d '{"aof_policy":"appendfsync-every-sec"}' \


 -u '<USERNAME>:<PASSWORD>' \


 -H "Content-Type: application/json" \


 -X PUT https://<CLUSTER_FQDN>:9443/v1/bdbs/<BDB_UID>


Ensure that the RDI database is not clustered. RDI will not work correctly if the RDI database is clustered (but note that the target database can be clustered without any problems).
If the Database clustering option is checked when you create the RDI database (as shown below), you must uncheck it before proceeding.

You can check if your RDI database is clustered from its Configuration tab in the Redis Enterprise console. The Database clustering option should be set to None, as shown in the following screenshot:

If you find the database has been clustered by mistake, you must create a new database with clustering disabled before continuing with the RDI installation.
Prepare the pipeline 
During the installation, RDI placed the pipeline templates at /opt/rdi/config. If you go to that folder and run the ll command, you will see the pipeline configuration file, config.yaml, and the jobs folder (see the page about Pipelines for more information). Use Redis Insight to open the config.yaml file and then edit the following settings:
Set the host to localhost and the port to 5432.
Under tables, specify the Track table from the source database.
Add the details of your target database to the target section.
At this point, the pipeline is ready to deploy.
Create a context (optional) 
To manage and inspect RDI, you can use the redis-di CLI command, which has several subcommands for different purposes. Most of these commands require you to pass at least two options, --rdi-host and --rdi-port, to specify the host and port of your RDI installation. You can avoid typing these options repeatedly by saving the information in a context.
When you activate a context, the saved values of --rdi-host, --rdi-port, and a few other options are passed automatically whenever you use redis-di. If you have more than one RDI installation, you can create a context for each of them and select the one you want to be active using its unique name.
To create a context, use the redis-di add-context command:
redis-di add-context --rdi-host <host> --rdi-port <port> <unique-context-name>

These options are required but there are also a few others you can save, such as TLS credentials, if you are using them (see the reference page for details). When you have created a context, use redis-di set-context to activate it:
redis-di set-context <context name>

There are also subcommands to list and delete contexts.
Deploy the pipeline 
You can use Redis Insight to deploy the pipeline by adding a connection to the RDI API endpoint (which has the same hostname or IP address as your RDI VM and uses the default HTTPS port 443) and then clicking the Deploy button. You can also deploy it with the following command:
redis-di deploy --dir <path to pipeline folder>

where the path is the one you supplied earlier during the installation. (You may also need to supply --rdi-host and --rdi-port options if you are not using a context as described above.) RDI first validates your pipeline and then deploys it if the configuration is correct.
Once the pipeline is running, you can use Redis Insight to view the data flow using the pipeline metrics. You can also connect to your target database to see the keys that RDI has written there.
See Deploy a pipeline for more information about deployment settings.
View RDI's response to data changes 
Once the pipeline has loaded a snapshot of all the existing data from the source, it enters change data capture (CDC) mode (see the architecture overview and the ingest pipeline lifecycle for more information ).
To see the RDI pipeline working in CDC mode:
Create a simulated load on the source database (see Generating load on the database to learn how to do this).
Run redis-di status --live to see the flow of records.
Use Redis Insight to look at the data in the target database.
RATE THIS PAGE
★★★★★
Back to top ↑
Edit this pageCreate an issue
On this page
Prerequisites
Overview
Install PostgreSQL
Install RDI
Prepare the pipeline
Create a context (optional)
Deploy the pipeline
View RDI's response to data changes
TrustPrivacyTerms of useLegal notices
Use Cases
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
Industries
Financial ServicesGamingHealthcareRetailAll industries
Compare
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
Company
Mission & valuesLeadershipCareersNews
Connect
CommunityEvents & webinarsNews
Partners
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
Support
Professional servicesSupport
         All products         Redis Enterprise         Redis Cloud         Redis Open Source         Redis Insight         Redis Enterprise for K8s         Redis Data Integration         Client Libraries       
ESC

RIOT
Redis Input/Output Tools
Redis Input/Output Tools (RIOT) is a command-line utility designed to help you get data in and out of Redis.
It supports many different sources and targets:
Files (CSV, JSON, XML)
Data generators (Redis data structures, Faker)
Relational databases
Redis itself (snapshot and live replication)
Full documentation is available at redis.github.io/riot
Prometheus and Grafana with Redis Enterprise Software
Use Prometheus and Grafana to collect and visualize Redis Enterprise Software metrics.
You can use Prometheus and Grafana to collect and visualize your Redis Enterprise Software metrics.
Metrics are exposed at the cluster, node, database, shard, and proxy levels.
Prometheus is an open source systems monitoring and alerting toolkit that aggregates metrics from different sources.
Grafana is an open source metrics visualization tool that processes Prometheus data.
You can use Prometheus and Grafana to:
Collect and display metrics not available in the admin console
Set up automatic alerts for node or cluster events
Display Redis Enterprise Software metrics alongside data from other systems

In each cluster, the metrics_exporter process exposes Prometheus metrics on port 8070. Redis Enterprise version 7.8.2 introduces a preview of the new metrics stream engine that exposes the v2 Prometheus scraping endpoint at https://<IP>:8070/v2.
Quick start 
To get started with Prometheus and Grafana:
Create a directory called 'prometheus' on your local machine.
Within that directory, create a configuration file called prometheus.yml.
Add the following contents to the configuration file and replace <cluster_name> with your Redis Enterprise cluster's FQDN:
Note:
We recommend running Prometheus in Docker only for development and testing.
global:


 scrape_interval: 15s


 evaluation_interval: 15s





# Attach these labels to any time series or alerts when communicating with


# external systems (federation, remote storage, Alertmanager).


 external_labels:


   monitor: "prometheus-stack-monitor"





# Load and evaluate rules in this file every 'evaluation_interval' seconds.


#rule_files:


# - "first.rules"


# - "second.rules"





scrape_configs:


# scrape Prometheus itself


 - job_name: prometheus


   scrape_interval: 10s


   scrape_timeout: 5s


   static_configs:


     - targets: ["localhost:9090"]





# scrape Redis Enterprise


 - job_name: redis-enterprise


   scrape_interval: 30s


   scrape_timeout: 30s


   metrics_path: / # For v2, use /v2


   scheme: https


   tls_config:


     insecure_skip_verify: true


   static_configs:


     - targets: ["<cluster_name>:8070"]


Set up your Prometheus and Grafana servers. To set up Prometheus and Grafana on Docker:
Create a docker-compose.yml file:
version: '3'


services:


   prometheus-server:


       image: prom/prometheus


       ports:


           - 9090:9090


       volumes:


           - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml





   grafana-ui:


       image: grafana/grafana


       ports:


           - 3000:3000


       environment:


           - GF_SECURITY_ADMIN_PASSWORD=secret


       links:


           - prometheus-server:prometheus


To start the containers, run:
$ docker compose up -d


To check that all of the containers are up, run: docker ps
In your browser, sign in to Prometheus at http://localhost:9090 to make sure the server is running.
Select Status and then Targets to check that Prometheus is collecting data from your Redis Enterprise cluster.

If Prometheus is connected to the cluster, you can type node_up in the Expression field on the Prometheus home page to see the cluster metrics.
Configure the Grafana datasource:
Sign in to Grafana. If you installed Grafana locally, go to http://localhost:3000 and sign in with:
Username: admin
Password: secret
In the Grafana configuration menu, select Data Sources.
Select Add data source.
Select Prometheus from the list of data source types.

Enter the Prometheus configuration information:
Name: redis-enterprise
URL: http://<your prometheus server name>:9090

Note:
If the network port is not accessible to the Grafana server, select the Browser option from the Access menu.
In a testing environment, you can select Skip TLS verification.
Add dashboards for cluster, database, node, and shard metrics. To add preconfigured dashboards:
In the Grafana dashboards menu, select Manage.
Click Import.
Upload one or more Grafana dashboards.
Grafana dashboards for Redis Enterprise 
Redis publishes four preconfigured dashboards for Redis Enterprise and Grafana:
The cluster status dashboard provides an overview of your Redis Enterprise clusters.
The database status dashboard displays specific database metrics, including latency, memory usage, ops/second, and key count.
The node metrics dashboard provides metrics for each of the nodes hosting your cluster.
The shard metrics dashboard displays metrics for the individual Redis processes running on your cluster nodes
The Active-Active dashboard displays metrics specific to Active-Active databases.
These dashboards are open source. For additional dashboard options, or to file an issue, see the Redis Enterprise observability Github repository.
For more information about configuring Grafana dashboards, see the Grafana documentation.
Redis Enterprise Software observability and monitoring guidance
Using monitoring and observability with Redis Enterprise
Prometheus metrics v1
V1 metrics available to Prometheus.
Transition from Prometheus v1 to Prometheus v2
Transition from v1 metrics to v2 PromQL equivalents.
Prometheus metrics v2 preview
V2 metrics available to Prometheus as of Redis Enterprise Software version 7.8.2.
RATE THIS PAGE
★★★★★
Back to top ↑
Edit this pageCreate an issue
On this page
Quick start
Grafana dashboards for Redis Enterprise
TrustPrivacyTerms of useLegal notices
Use Cases
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
Industries
Financial ServicesGamingHealthcareRetailAll industries
Compare
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
Company
Mission & valuesLeadershipCareersNews
Connect
CommunityEvents & webinarsNews
Partners
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
Support
Professional servicesSupport
         All products         Redis Enterprise         Redis Cloud         Redis Open Source         Redis Insight         Redis Enterprise for K8s         Redis Data Integration         Client Libraries       
ESC

Client tools
Tools to interact with a Redis server
You can use several tools to connect to a Redis server, to manage it and interact with the data:
The redis-cli command line tool
Redis Insight (a graphical user interface tool)
The Redis VSCode extension
Redis command line interface (CLI) 
The Redis command line interface (also known as redis-cli) is a terminal program that sends commands to and reads replies from the Redis server. It has the following two main modes:
An interactive Read Eval Print Loop (REPL) mode where the user types Redis commands and receives replies.
A command mode where redis-cli is executed with additional arguments, and the reply is printed to the standard output.
Redis Insight 
Redis Insight combines a graphical user interface with Redis CLI to let you work with any Redis deployment. You can visually browse and interact with data, take advantage of diagnostic tools, learn by example, and much more. Best of all, Redis Insight is free.
Download Redis Insight.
Redis VSCode extension 
Redis for VS Code is an extension that allows you to connect to your Redis databases from within Microsoft Visual Studio Code. After connecting to a database, you can view, add, modify, and delete keys, and interact with your Redis databases using a Redis Insight like UI and also a built-in CLI interface.
RATE THIS PAGE
★★★★★
Back to top ↑
Edit this pageCreate an issue
On this page
Redis command line interface (CLI)
Redis Insight
Redis VSCode extension
TrustPrivacyTerms of useLegal notices
Use Cases
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
Industries
Financial ServicesGamingHealthcareRetailAll industries
Compare
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
Company
Mission & valuesLeadershipCareersNews
Connect
CommunityEvents & webinarsNews
Partners
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
Support
Professional servicesSupport
         All products         Redis Enterprise         Redis Cloud         Redis Open Source         Redis Insight         Redis Enterprise for K8s         Redis Data Integration         Client Libraries       
ESC

Redis CLI
Overview of redis-cli, the Redis command line interface
In interactive mode, redis-cli has basic line editing capabilities to provide a familiar typing experience.
To launch the program in special modes, you can use several options, including:
Simulate a replica and print the replication stream it receives from the primary.
Check the latency of a Redis server and display statistics.
Request ASCII-art spectrogram of latency samples and frequencies.
This topic covers the different aspects of redis-cli, starting from the simplest and ending with the more advanced features.
Command line usage 
To run a Redis command and return a standard output at the terminal, include the command to execute as separate arguments of redis-cli:
$ redis-cli INCR mycounter
(integer) 7

The reply of the command is "7". Since Redis replies are typed (strings, arrays, integers, nil, errors, etc.), you see the type of the reply between parentheses. This additional information may not be ideal when the output of redis-cli must be used as input of another command or redirected into a file.
redis-cli only shows additional information for human readability when it detects the standard output is a tty, or terminal. For all other outputs it will auto-enable the raw output mode, as in the following example:
$ redis-cli INCR mycounter > /tmp/output.txt
$ cat /tmp/output.txt
8

Note that (integer) is omitted from the output because redis-cli detects the output is no longer written to the terminal. You can force raw output even on the terminal with the --raw option:
$ redis-cli --raw INCR mycounter
9

You can force human readable output when writing to a file or in pipe to other commands by using --no-raw.
String quoting and escaping 
When redis-cli parses a command, whitespace characters automatically delimit the arguments. In interactive mode, a newline sends the command for parsing and execution. To input string values that contain whitespaces or non-printable characters, you can use quoted and escaped strings.
Quoted string values are enclosed in double (") or single (') quotation marks. Escape sequences are used to put nonprintable characters in character and string literals.
An escape sequence contains a backslash (\) symbol followed by one of the escape sequence characters.
Doubly-quoted strings support the following escape sequences:
\" - double-quote
\n - newline
\r - carriage return
\t - horizontal tab
\b - backspace
\a - alert
\\ - backslash
\xhh - any ASCII character represented by a hexadecimal number (hh)
Single quotes assume the string is literal, and allow only the following escape sequences:
\' - single quote
\\ - backslash
For example, to return Hello World on two lines:
127.0.0.1:6379> SET mykey "Hello\nWorld"
OK
127.0.0.1:6379> GET mykey
Hello
World

When you input strings that contain single or double quotes, as you might in passwords, for example, escape the string, like so:
127.0.0.1:6379> AUTH some_admin_user ">^8T>6Na{u|jp>+v\"55\@_;OU(OR]7mbAYGqsfyu48(j'%hQH7;v*f1H${*gD(Se'"

Host, port, password, and database 
By default, redis-cli connects to the server at the address 127.0.0.1 with port 6379. You can change the port using several command line options. To specify a different host name or an IP address, use the -h option. In order to set a different port, use -p.
$ redis-cli -h redis15.localnet.org -p 6390 PING
PONG

If your instance is password protected, the -a <password> option will perform authentication saving the need of explicitly using the AUTH command:
$ redis-cli -a myUnguessablePazzzzzword123 PING
PONG

NOTE: For security reasons, provide the password to redis-cli automatically via the REDISCLI_AUTH environment variable.
Finally, it's possible to send a command that operates on a database number other than the default number zero by using the -n <dbnum> option:
$ redis-cli FLUSHALL
OK
$ redis-cli -n 1 INCR a
(integer) 1
$ redis-cli -n 1 INCR a
(integer) 2
$ redis-cli -n 2 INCR a
(integer) 1

Some or all of this information can also be provided by using the -u <uri> option and the URI pattern redis://user:password@host:port/dbnum:
$ redis-cli -u redis://LJenkins:p%40ssw0rd@redis-16379.hosted.com:16379/0 PING
PONG

NOTE: User, password and dbnum are optional. For authentication without a username, use username default. For TLS, use the scheme rediss.
You can use the -4 or -6 argument to set a preference for IPv4 or IPv6, respectively, for DNS lookups.
SSL/TLS 
By default, redis-cli uses a plain TCP connection to connect to Redis. You may enable SSL/TLS using the --tls option, along with --cacert or --cacertdir to configure a trusted root certificate bundle or directory.
If the target server requires authentication using a client side certificate, you can specify a certificate and a corresponding private key using --cert and --key.
Get input from other programs 
There are two ways you can use redis-cli in order to receive input from other commands via the standard input. One is to use the target payload as the last argument from stdin. For example, in order to set the Redis key net_services to the content of the file /etc/services from a local file system, use the -x option:
$ redis-cli -x SET net_services < /etc/services
OK
$ redis-cli GETRANGE net_services 0 50
"#\n# Network services, Internet style\n#\n# Note that "

In the first line of the above session, redis-cli was executed with the -x option and a file was redirected to the CLI's standard input as the value to satisfy the SET net_services command phrase. This is useful for scripting.
A different approach is to feed redis-cli a sequence of commands written in a text file:
$ cat /tmp/commands.txt
SET item:3374 100
INCR item:3374
APPEND item:3374 xxx
GET item:3374
$ cat /tmp/commands.txt | redis-cli
OK
(integer) 101
(integer) 6
"101xxx"

All the commands in commands.txt are executed consecutively by redis-cli as if they were typed by the user in interactive mode. Strings can be quoted inside the file if needed, so that it's possible to have single arguments with spaces, newlines, or other special characters:
$ cat /tmp/commands.txt
SET arg_example "This is a single argument"
STRLEN arg_example
$ cat /tmp/commands.txt | redis-cli
OK
(integer) 25

Continuously run the same command 
It is possible to execute a single command a specified number of times with a user-selected pause between executions. This is useful in different contexts - for example when we want to continuously monitor some key content or INFO field output, or when we want to simulate some recurring write event, such as pushing a new item into a list every 5 seconds.
This feature is controlled by two options: -r <count> and -i <delay>. The -r option states how many times to run a command and -i sets the delay between the different command calls in seconds (with the ability to specify values such as 0.1 to represent 100 milliseconds).
By default the interval (or delay) is set to 0, so commands are just executed ASAP:
$ redis-cli -r 5 INCR counter_value
(integer) 1
(integer) 2
(integer) 3
(integer) 4
(integer) 5

To run the same command indefinitely, use -1 as the count value. To monitor over time the RSS memory size it's possible to use the following command:
$ redis-cli -r -1 -i 1 INFO | grep rss_human
used_memory_rss_human:2.71M
used_memory_rss_human:2.73M
used_memory_rss_human:2.73M
used_memory_rss_human:2.73M
... a new line will be printed each second ...

Mass insertion of data using redis-cli 
Mass insertion using redis-cli is covered in a separate page as it is a worthwhile topic itself. Please refer to our mass insertion guide.
CSV output 
A CSV (Comma Separated Values) output feature exists within redis-cli to export data from Redis to an external program.
$ redis-cli LPUSH mylist a b c d
(integer) 4
$ redis-cli --csv LRANGE mylist 0 -1
"d","c","b","a"

Note that the --csv flag will only work on a single command, not the entirety of a DB as an export.
Run Lua scripts 
The redis-cli has extensive support for using the debugging facility of Lua scripting, available with Redis 3.2 onwards. For this feature, refer to the Redis Lua debugger documentation.
Even without using the debugger, redis-cli can be used to run scripts from a file as an argument:
$ cat /tmp/script.lua
return redis.call('SET',KEYS[1],ARGV[1])
$ redis-cli --eval /tmp/script.lua location:hastings:temp , 23
OK

The Redis EVAL command takes the list of keys the script uses, and the other non key arguments, as different arrays. When calling EVAL you provide the number of keys as a number.
When calling redis-cli with the --eval option above, there is no need to specify the number of keys explicitly. Instead it uses the convention of separating keys and arguments with a comma. This is why in the above call you see location:hastings:temp , 23 as arguments.
So location:hastings:temp will populate the KEYS array, and 23 the ARGV array.
The --eval option is useful when writing simple scripts. For more complex work, the Lua debugger is recommended. It is possible to mix the two approaches, since the debugger can also execute scripts from an external file.
Interactive mode 
We have explored how to use the Redis CLI as a command line program. This is useful for scripts and certain types of testing, however most people will spend the majority of time in redis-cli using its interactive mode.
In interactive mode the user types Redis commands at the prompt. The command is sent to the server, processed, and the reply is parsed back and rendered into a simpler form to read.
Nothing special is needed for running the redis-cli in interactive mode - just execute it without any arguments
$ redis-cli
127.0.0.1:6379> PING
PONG

The string 127.0.0.1:6379> is the prompt. It displays the connected Redis server instance's hostname and port.
The prompt updates as the connected server changes or when operating on a database different from the database number zero:
127.0.0.1:6379> SELECT 2
OK
127.0.0.1:6379[2]> DBSIZE
(integer) 1
127.0.0.1:6379[2]> SELECT 0
OK
127.0.0.1:6379> DBSIZE
(integer) 503

Handle connections and reconnections 
Using the CONNECT command in interactive mode makes it possible to connect to a different instance, by specifying the hostname and port we want to connect to:
127.0.0.1:6379> CONNECT metal 6379
metal:6379> PING
PONG

As you can see the prompt changes accordingly when connecting to a different server instance. If a connection is attempted to an instance that is unreachable, the redis-cli goes into disconnected mode and attempts to reconnect with each new command:
127.0.0.1:6379> CONNECT 127.0.0.1 9999
Could not connect to Redis at 127.0.0.1:9999: Connection refused
not connected> PING
Could not connect to Redis at 127.0.0.1:9999: Connection refused
not connected> PING
Could not connect to Redis at 127.0.0.1:9999: Connection refused

Generally after a disconnection is detected, redis-cli always attempts to reconnect transparently; if the attempt fails, it shows the error and enters the disconnected state. The following is an example of disconnection and reconnection:
127.0.0.1:6379> INFO SERVER
Could not connect to Redis at 127.0.0.1:6379: Connection refused
not connected> PING
PONG
127.0.0.1:6379> 
(now we are connected again)

When a reconnection is performed, redis-cli automatically re-selects the last database number selected. However, all other states about the connection is lost, such as within a MULTI/EXEC transaction:
$ redis-cli
127.0.0.1:6379> MULTI
OK
127.0.0.1:6379> PING
QUEUED

( here the server is manually restarted )

127.0.0.1:6379> EXEC
(error) ERR EXEC without MULTI

This is usually not an issue when using the redis-cli in interactive mode for testing, but this limitation should be known.
Use the -t <timeout> option to specify server timeout in seconds.
Editing, history, completion and hints 
Because redis-cli uses the linenoise line editing library, it always has line editing capabilities, without depending on libreadline or other optional libraries.
Command execution history can be accessed in order to avoid retyping commands by pressing the arrow keys (up and down). The history is preserved between restarts of the CLI, in a file named .rediscli_history inside the user home directory, as specified by the HOME environment variable. It is possible to use a different history filename by setting the REDISCLI_HISTFILE environment variable, and disable it by setting it to /dev/null.
The redis-cli client is also able to perform command-name completion by pressing the TAB key, as in the following example:
127.0.0.1:6379> Z<TAB>
127.0.0.1:6379> ZADD<TAB>
127.0.0.1:6379> ZCARD<TAB>

Once Redis command name has been entered at the prompt, the redis-cli will display syntax hints. Like command history, this behavior can be turned on and off via the redis-cli preferences.
Reverse history searches, such as CTRL-R in terminals, is supported.
Preferences 
There are two ways to customize redis-cli behavior. The file .redisclirc in the home directory is loaded by the CLI on startup. You can override the file's default location by setting the REDISCLI_RCFILE environment variable to an alternative path. Preferences can also be set during a CLI session, in which case they will last only the duration of the session.
To set preferences, use the special :set command. The following preferences can be set, either by typing the command in the CLI or adding it to the .redisclirc file:
:set hints - enables syntax hints
:set nohints - disables syntax hints
Run the same command N times 
It is possible to run the same command multiple times in interactive mode by prefixing the command name by a number:
127.0.0.1:6379> 5 INCR mycounter
(integer) 1
(integer) 2
(integer) 3
(integer) 4
(integer) 5

Show online help for Redis commands 
redis-cli provides online help for most Redis commands, using the HELP command. The command can be used in two forms:
HELP @<category> shows all the commands about a given category. The categories are:
@generic
@string
@list
@set
@sorted_set
@hash
@pubsub
@transactions
@connection
@server
@scripting
@hyperloglog
@cluster
@geo
@stream
HELP <commandname> shows specific help for the command given as argument.
For example in order to show help for the PFADD command, use:
127.0.0.1:6379> HELP PFADD

PFADD key element [element ...]
summary: Adds the specified elements to the specified HyperLogLog.
since: 2.8.9

Note that HELP supports TAB completion as well.
Clear the terminal screen 
Using the CLEAR command in interactive mode clears the terminal's screen.
Special modes of operation 
So far we saw two main modes of redis-cli.
Command line execution of Redis commands.
Interactive "REPL" usage.
The CLI performs other auxiliary tasks related to Redis that are explained in the next sections:
Monitoring tool to show continuous stats about a Redis server.
Scanning a Redis database for very large keys.
Key space scanner with pattern matching.
Acting as a Pub/Sub client to subscribe to channels.
Monitoring the commands executed into a Redis instance.
Checking the latency of a Redis server in different ways.
Checking the scheduler latency of the local computer.
Transferring RDB backups from a remote Redis server locally.
Acting as a Redis replica for showing what a replica receives.
Simulating LRU workloads for showing stats about keys hits.
A client for the Lua debugger.
Continuous stats mode 
Continuous stats mode is probably one of the lesser known yet very useful features of redis-cli to monitor Redis instances in real time. To enable this mode, the --stat option is used. The output is very clear about the behavior of the CLI in this mode:
$ redis-cli --stat
------- data ------ --------------------- load -------------------- - child -
keys       mem      clients blocked requests            connections
506        1015.00K 1       0       24 (+0)             7
506        1015.00K 1       0       25 (+1)             7
506        3.40M    51      0       60461 (+60436)      57
506        3.40M    51      0       146425 (+85964)     107
507        3.40M    51      0       233844 (+87419)     157
507        3.40M    51      0       321715 (+87871)     207
508        3.40M    51      0       408642 (+86927)     257
508        3.40M    51      0       497038 (+88396)     257

In this mode a new line is printed every second with useful information and differences of request values between old data points. Memory usage, client connection counts, and various other statistics about the connected Redis database can be easily understood with this auxiliary redis-cli tool.
The -i <interval> option in this case works as a modifier in order to change the frequency at which new lines are emitted. The default is one second.
Scan for big keys and memory usage 
Big keys 
In this special mode, redis-cli works as a key space analyzer. It scans the dataset for big keys, but also provides information about the data types that the data set consists of. This mode is enabled with the --bigkeys option, and produces verbose output:
$ redis-cli --bigkeys

# Scanning the entire keyspace to find biggest keys as well as
# average sizes per key type.  You can use -i 0.1 to sleep 0.1 sec
# per 100 SCAN commands (not usually needed).

100.00% ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Keys sampled: 55

-------- summary -------

Total key length in bytes is 495 (avg len 9.00)

Biggest   list found "bikes:finished" has 1 items
Biggest string found "all_bikes" has 36 bytes
Biggest   hash found "bike:1:stats" has 3 fields
Biggest stream found "race:france" has 4 entries
Biggest    set found "bikes:racing:france" has 3 members
Biggest   zset found "racer_scores" has 8 members

1 lists with 1 items (01.82% of keys, avg size 1.00)
16 strings with 149 bytes (29.09% of keys, avg size 9.31)
1 MBbloomCFs with 0 ? (01.82% of keys, avg size 0.00)
1 hashs with 3 fields (01.82% of keys, avg size 3.00)
3 streams with 8 entries (05.45% of keys, avg size 2.67)
2 TDIS-TYPEs with 0 ? (03.64% of keys, avg size 0.00)
1 TopK-TYPEs with 0 ? (01.82% of keys, avg size 0.00)
2 sets with 5 members (03.64% of keys, avg size 2.50)
1 CMSk-TYPEs with 0 ? (01.82% of keys, avg size 0.00)
2 zsets with 11 members (03.64% of keys, avg size 5.50)
25 ReJSON-RLs with 0 ? (45.45% of keys, avg size 0.00)

In the first part of the output, each new key larger than the previous larger key (of the same type) encountered is reported. The summary section provides general stats about the data inside the Redis instance.
The program uses the SCAN command, so it can be executed against a busy server without impacting the operations, however the -i option can be used in order to throttle the scanning process of the specified fraction of second for each SCAN command.
For example, -i 0.01 will slow down the program execution considerably, but will also reduce the load on the server to a negligible amount.
Note that the summary also reports in a cleaner form the biggest keys found for each time. The initial output is just to provide some interesting info ASAP if running against a very large data set.
The --bigkeys option now works on cluster replicas.
Memory usage 
Similar to the --bigkeys option, --memkeys allows you to scan the entire keyspace to find biggest keys as well as the average sizes per key type.
$ redis-cli --memkeys

# Scanning the entire keyspace to find biggest keys as well as
# average sizes per key type.  You can use -i 0.1 to sleep 0.1 sec
# per 100 SCAN commands (not usually needed).

100.00% ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Keys sampled: 55

-------- summary -------

Total key length in bytes is 495 (avg len 9.00)

Biggest   list found "bikes:finished" has 104 bytes
Biggest string found "all_bikes" has 120 bytes
Biggest MBbloomCF found "bikes:models" has 1048680 bytes
Biggest   hash found "bike:1:stats" has 104 bytes
Biggest stream found "race:italy" has 7172 bytes
Biggest TDIS-TYPE found "bikes:sales" has 9832 bytes
Biggest TopK-TYPE found "bikes:keywords" has 114256 bytes
Biggest    set found "bikes:racing:france" has 120 bytes
Biggest CMSk-TYPE found "bikes:profit" has 144056 bytes
Biggest   zset found "racer_scores" has 168 bytes
Biggest ReJSON-RL found "bikes:inventory" has 4865 bytes

1 lists with 104 bytes (01.82% of keys, avg size 104.00)
16 strings with 1360 bytes (29.09% of keys, avg size 85.00)
1 MBbloomCFs with 1048680 bytes (01.82% of keys, avg size 1048680.00)
1 hashs with 104 bytes (01.82% of keys, avg size 104.00)
3 streams with 16960 bytes (05.45% of keys, avg size 5653.33)
2 TDIS-TYPEs with 19648 bytes (03.64% of keys, avg size 9824.00)
1 TopK-TYPEs with 114256 bytes (01.82% of keys, avg size 114256.00)
2 sets with 208 bytes (03.64% of keys, avg size 104.00)
1 CMSk-TYPEs with 144056 bytes (01.82% of keys, avg size 144056.00)
2 zsets with 304 bytes (03.64% of keys, avg size 152.00)
25 ReJSON-RLs with 15748 bytes (45.45% of keys, avg size 629.92)

The --memkeys option now works on cluster replicas.
Combine --bigkeys and --memkeys 
You can use the --keystats and --keystats-samples options to combine --memkeys and --bigkeys with additional distribution data.
$ redis-cli --keystats

# Scanning the entire keyspace to find the biggest keys and distribution information.
# Use -i 0.1 to sleep 0.1 sec per 100 SCAN commands (not usually needed).
# Use --cursor <n> to start the scan at the cursor <n> (usually after a Ctrl-C).
# Use --top <n> to display <n> top key sizes (default is 10).
# Ctrl-C to stop the scan.

100.00% ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
Keys sampled: 55
Keys size:    1.30M

--- Top 10 key sizes ---
  1    1.00M MBbloomCF  "bikes:models"
  2  140.68K CMSk-TYPE  "bikes:profit"
  3  111.58K TopK-TYPE  "bikes:keywords"
  4    9.60K TDIS-TYPE  "bikes:sales"
  5    9.59K TDIS-TYPE  "racer_ages"
  6    7.00K stream     "race:italy"
  7    4.92K stream     "race:france"
  8    4.75K ReJSON-RL  "bikes:inventory"
  9    4.64K stream     "race:usa"
 10    1.26K ReJSON-RL  "bicycle:7"

--- Top size per type ---
list       bikes:finished is 104B
string     all_bikes is 120B
MBbloomCF  bikes:models is 1.00M
hash       bike:1:stats is 104B
stream     race:italy is 7.00K
TDIS-TYPE  bikes:sales is 9.60K
TopK-TYPE  bikes:keywords is 111.58K
set        bikes:racing:france is 120B
CMSk-TYPE  bikes:profit is 140.68K
zset       racer_scores is 168B
ReJSON-RL  bikes:inventory is 4.75K

--- Top length and cardinality per type ---
list       bikes:finished has 1 items
string     all_bikes has 36B
hash       bike:1:stats has 3 fields
stream     race:france has 4 entries
set        bikes:racing:france has 3 members
zset       racer_scores has 8 members

Key size Percentile Total keys
-------- ---------- -----------
     64B    0.0000%           3
    239B   50.0000%          28
    763B   75.0000%          42
   4.92K   87.5000%          49
   9.60K   93.7500%          52
 140.69K   96.8750%          54
   1.00M  100.0000%          55
Note: 0.01% size precision, Mean: 24.17K, StdDeviation: 138.12K

Key name length Percentile Total keys
--------------- ---------- -----------
            19B  100.0000%          55
Total key length is 495B (9B avg)

Type        Total keys  Keys % Tot size Avg size  Total length/card Avg ln/card
--------- ------------ ------- -------- -------- ------------------ -----------
list                 1   1.82%     104B     104B            1 items        1.00
string              16  29.09%    1.33K      85B               149B          9B
MBbloomCF            1   1.82%    1.00M    1.00M                 -           - 
hash                 1   1.82%     104B     104B           3 fields        3.00
stream               3   5.45%   16.56K    5.52K          8 entries        2.67
TDIS-TYPE            2   3.64%   19.19K    9.59K                 -           - 
TopK-TYPE            1   1.82%  111.58K  111.58K                 -           - 
set                  2   3.64%     208B     104B          5 members        2.50
CMSk-TYPE            1   1.82%  140.68K  140.68K                 -           - 
zset                 2   3.64%     304B     152B         11 members        5.50
ReJSON-RL           25  45.45%   15.38K     629B                 -           - 

Get a list of keys 
It is also possible to scan the key space, again in a way that does not block the Redis server (which does happen when you use a command like KEYS *), and print all the key names, or filter them for specific patterns. This mode, like the --bigkeys option, uses the SCAN command, so keys may be reported multiple times if the dataset is changing, but no key would ever be missing, if that key was present since the start of the iteration. Because of the command that it uses this option is called --scan.
$ redis-cli --scan | head -10
key-419
key-71
key-236
key-50
key-38
key-458
key-453
key-499
key-446
key-371

Note that head -10 is used in order to print only the first ten lines of the output.
Scanning is able to use the underlying pattern matching capability of the SCAN command with the --pattern option.
$ redis-cli --scan --pattern '*-11*'
key-114
key-117
key-118
key-113
key-115
key-112
key-119
key-11
key-111
key-110
key-116

Piping the output through the wc command can be used to count specific kind of objects, by key name:
$ redis-cli --scan --pattern 'user:*' | wc -l
3829433

You can use -i 0.01 to add a delay between calls to the SCAN command. This will make the command slower but will significantly reduce load on the server.
Pub/sub mode 
The CLI is able to publish messages in Redis Pub/Sub channels using the PUBLISH command. Subscribing to channels in order to receive messages is different - the terminal is blocked and waits for messages, so this is implemented as a special mode in redis-cli. Unlike other special modes this mode is not enabled by using a special option, but simply by using the SUBSCRIBE or PSUBSCRIBE command, which are available in interactive or command mode:
$ redis-cli PSUBSCRIBE '*'
Reading messages... (press Ctrl-C to quit)
1) "PSUBSCRIBE"
2) "*"
3) (integer) 1

The reading messages message shows that we entered Pub/Sub mode. When another client publishes some message in some channel, such as with the command redis-cli PUBLISH mychannel mymessage, the CLI in Pub/Sub mode will show something such as:
1) "pmessage"
2) "*"
3) "mychannel"
4) "mymessage"

This is very useful for debugging Pub/Sub issues. To exit the Pub/Sub mode just process CTRL-C.
Monitor commands executed in Redis 
Similarly to the Pub/Sub mode, the monitoring mode is entered automatically once you use the MONITOR command. All commands received by the active Redis instance will be printed to the standard output:
$ redis-cli MONITOR
OK
1460100081.165665 [0 127.0.0.1:51706] "set" "shipment:8000736522714:status" "sorting"
1460100083.053365 [0 127.0.0.1:51707] "get" "shipment:8000736522714:status"

Note that it is possible to pipe the output, so you can monitor for specific patterns using tools such as grep.
Monitor the latency of Redis instances 
Redis is often used in contexts where latency is very critical. Latency involves multiple moving parts within the application, from the client library to the network stack, to the Redis instance itself.
The redis-cli has multiple facilities for studying the latency of a Redis instance and understanding the latency's maximum, average and distribution.
The basic latency-checking tool is the --latency option. Using this option the CLI runs a loop where the PING command is sent to the Redis instance and the time to receive a reply is measured. This happens 100 times per second, and stats are updated in a real time in the console:
$ redis-cli --latency
min: 0, max: 1, avg: 0.19 (427 samples)

The stats are provided in milliseconds. Usually, the average latency of a very fast instance tends to be overestimated a bit because of the latency due to the kernel scheduler of the system running redis-cli itself, so the average latency of 0.19 above may easily be 0.01 or less. However this is usually not a big problem, since most developers are interested in events of a few milliseconds or more.
Sometimes it is useful to study how the maximum and average latencies evolve during time. The --latency-history option is used for that purpose: it works exactly like --latency, but every 15 seconds (by default) a new sampling session is started from scratch:
$ redis-cli --latency-history
min: 0, max: 1, avg: 0.14 (1314 samples) -- 15.01 seconds range
min: 0, max: 1, avg: 0.18 (1299 samples) -- 15.00 seconds range
min: 0, max: 1, avg: 0.20 (113 samples)^C

Sampling sessions' length can be changed with the -i <interval> option.
The most advanced latency study tool, but also the most complex to interpret for non-experienced users, is the ability to use color terminals to show a spectrum of latencies. You'll see a colored output that indicates the different percentages of samples, and different ASCII characters that indicate different latency figures. This mode is enabled using the --latency-dist option:
$ redis-cli --latency-dist
(output not displayed, requires a color terminal, try it!)

There is another pretty unusual latency tool implemented inside redis-cli. It does not check the latency of a Redis instance, but the latency of the computer running redis-cli. This latency is intrinsic to the kernel scheduler, the hypervisor in case of virtualized instances, and so forth.
Redis calls it intrinsic latency because it's mostly opaque to the programmer. If the Redis instance has high latency regardless of all the obvious things that may be the source cause, it's worth to check what's the best your system can do by running redis-cli in this special mode directly in the system you are running Redis servers on.
By measuring the intrinsic latency, you know that this is the baseline, and Redis cannot outdo your system. In order to run the CLI in this mode, use the --intrinsic-latency <test-time>. Note that the test time is in seconds and dictates how long the test should run.
$ ./redis-cli --intrinsic-latency 5
Max latency so far: 1 microseconds.
Max latency so far: 7 microseconds.
Max latency so far: 9 microseconds.
Max latency so far: 11 microseconds.
Max latency so far: 13 microseconds.
Max latency so far: 15 microseconds.
Max latency so far: 34 microseconds.
Max latency so far: 82 microseconds.
Max latency so far: 586 microseconds.
Max latency so far: 739 microseconds.

65433042 total runs (avg latency: 0.0764 microseconds / 764.14 nanoseconds per run).
Worst run took 9671x longer than the average latency.

IMPORTANT: this command must be executed on the computer that runs the Redis server instance, not on a different host. It does not connect to a Redis instance and performs the test locally.
In the above case, the system cannot do better than 739 microseconds of worst case latency, so one can expect certain queries to occasionally run less than 1 millisecond.
Remote backups of RDB files 
During a Redis replication's first synchronization, the primary and the replica exchange the whole data set in the form of an RDB file. This feature is exploited by redis-cli in order to provide a remote backup facility that allows a transfer of an RDB file from any Redis instance to the local computer running redis-cli. To use this mode, call the CLI with the --rdb <dest-filename> option:
$ redis-cli --rdb /tmp/dump.rdb
SYNC sent to master, writing 13256 bytes to '/tmp/dump.rdb'
Transfer finished with success.

This is a simple but effective way to ensure disaster recovery RDB backups exist of your Redis instance. When using this options in scripts or cron jobs, make sure to check the return value of the command. If it is non zero, an error occurred as in the following example:
$ redis-cli --rdb /tmp/dump.rdb
SYNC with master failed: -ERR Can't SYNC while not connected with my master
$ echo $?
1

Replica mode 
The replica mode of the CLI is an advanced feature useful for Redis developers and for debugging operations. It allows for the inspection of the content a primary sends to its replicas in the replication stream in order to propagate the writes to its replicas. The option name is simply --replica. The following is a working example:
$ redis-cli --replica
SYNC with master, discarding 13256 bytes of bulk transfer...
SYNC done. Logging commands from master.
"PING"
"SELECT","0"
"SET","last_name","Enigk"
"PING"
"INCR","mycounter"

The command begins by discarding the RDB file of the first synchronization and then logs each command received in CSV format.
If you think some of the commands are not replicated correctly in your replicas this is a good way to check what's happening, and also useful information in order to improve the bug report.
Perform an LRU simulation 
Redis is often used as a cache with LRU eviction. Depending on the number of keys and the amount of memory allocated for the cache (specified via the maxmemory directive), the amount of cache hits and misses will change. Sometimes, simulating the rate of hits is very useful to correctly provision your cache.
The redis-cli has a special mode where it performs a simulation of GET and SET operations, using an 80-20% power law distribution in the requests pattern. This means that 20% of keys will be requested 80% of times, which is a common distribution in caching scenarios.
Theoretically, given the distribution of the requests and the Redis memory overhead, it should be possible to compute the hit rate analytically with a mathematical formula. However, Redis can be configured with different LRU settings (number of samples) and LRU's implementation, which is approximated in Redis, changes a lot between different versions. Similarly the amount of memory per key may change between versions. That is why this tool was built: its main motivation was for testing the quality of Redis' LRU implementation, but now is also useful for testing how a given version behaves with the settings originally intended for deployment.
To use this mode, specify the amount of keys in the test and configure a sensible maxmemory setting as a first attempt.
IMPORTANT NOTE: Configuring the maxmemory setting in the Redis configuration is crucial: if there is no cap to the maximum memory usage, the hit will eventually be 100% since all the keys can be stored in memory. If too many keys are specified with maximum memory, eventually all of the computer RAM will be used. It is also needed to configure an appropriate maxmemory policy; most of the time allkeys-lru is selected.
In the following example there is a configured a memory limit of 100MB and an LRU simulation using 10 million keys.
WARNING: the test uses pipelining and will stress the server, don't use it with production instances.
$ ./redis-cli --lru-test 10000000
156000 Gets/sec | Hits: 4552 (2.92%) | Misses: 151448 (97.08%)
153750 Gets/sec | Hits: 12906 (8.39%) | Misses: 140844 (91.61%)
159250 Gets/sec | Hits: 21811 (13.70%) | Misses: 137439 (86.30%)
151000 Gets/sec | Hits: 27615 (18.29%) | Misses: 123385 (81.71%)
145000 Gets/sec | Hits: 32791 (22.61%) | Misses: 112209 (77.39%)
157750 Gets/sec | Hits: 42178 (26.74%) | Misses: 115572 (73.26%)
154500 Gets/sec | Hits: 47418 (30.69%) | Misses: 107082 (69.31%)
151250 Gets/sec | Hits: 51636 (34.14%) | Misses: 99614 (65.86%)

The program shows stats every second. In the first seconds the cache starts to be populated. The misses rate later stabilizes into the actual figure that can be expected:
120750 Gets/sec | Hits: 48774 (40.39%) | Misses: 71976 (59.61%)
122500 Gets/sec | Hits: 49052 (40.04%) | Misses: 73448 (59.96%)
127000 Gets/sec | Hits: 50870 (40.06%) | Misses: 76130 (59.94%)
124250 Gets/sec | Hits: 50147 (40.36%) | Misses: 74103 (59.64%)

A miss rate of 59% may not be acceptable for certain use cases therefor 100MB of memory is not enough. Observe an example using a half gigabyte of memory. After several minutes the output stabilizes to the following figures:
140000 Gets/sec | Hits: 135376 (96.70%) | Misses: 4624 (3.30%)
141250 Gets/sec | Hits: 136523 (96.65%) | Misses: 4727 (3.35%)
140250 Gets/sec | Hits: 135457 (96.58%) | Misses: 4793 (3.42%)
140500 Gets/sec | Hits: 135947 (96.76%) | Misses: 4553 (3.24%)

With 500MB there is sufficient space for the key quantity (10 million) and distribution (80-20 style).
RATE THIS PAGE
★★★★★
Back to top ↑
Edit this pageCreate an issue
On this page
Command line usage
String quoting and escaping
Host, port, password, and database
SSL/TLS
Get input from other programs
Continuously run the same command
Mass insertion of data using redis-cli
CSV output
Run Lua scripts
Interactive mode
Handle connections and reconnections
Editing, history, completion and hints
Preferences
Run the same command N times
Show online help for Redis commands
Clear the terminal screen
Special modes of operation
Continuous stats mode
Scan for big keys and memory usage
Big keys
Memory usage
Combine --bigkeys and --memkeys
Get a list of keys
Pub/sub mode
Monitor commands executed in Redis
Monitor the latency of Redis instances
Remote backups of RDB files
Replica mode
Perform an LRU simulation
TrustPrivacyTerms of useLegal notices
Use Cases
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
Industries
Financial ServicesGamingHealthcareRetailAll industries
Compare
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
Company
Mission & valuesLeadershipCareersNews
Connect
CommunityEvents & webinarsNews
Partners
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
Support
Professional servicesSupport
         All products         Redis Enterprise         Redis Cloud         Redis Open Source         Redis Insight         Redis Enterprise for K8s         Redis Data Integration         Client Libraries       
ESC

node-redis guide (JavaScript)
Connect your Node.js/JavaScript application to a Redis database
node-redis is the Redis client for Node.js/JavaScript. The sections below explain how to install node-redis and connect your application to a Redis database.
node-redis requires a running Redis server. See here for Redis Open Source installation instructions.
You can also access Redis with an object-mapping client interface. See RedisOM for Node.js for more information.
Install 
To install node-redis, run:
npm install redis

Connect and test 
Connect to localhost on port 6379.
import { createClient } from 'redis';



const client = createClient();



client.on('error', err => console.log('Redis Client Error', err));



await client.connect();

Store and retrieve a simple string.
await client.set('key', 'value');

const value = await client.get('key');

Store and retrieve a map.
await client.hSet('user-session:123', {

   name: 'John',

   surname: 'Smith',

   company: 'Redis',

   age: 29

})



let userSession = await client.hGetAll('user-session:123');

console.log(JSON.stringify(userSession, null, 2));

/*

{

 "surname": "Smith",

 "name": "John",

 "company": "Redis",

 "age": "29"

}

*/

To connect to a different host or port, use a connection string in the format redis[s]://[[username][:password]@][host][:port][/db-number]:
createClient({

 url: 'redis://alice:foobared@awesome.redis.server:6380'

});

To check if the client is connected and ready to send commands, use client.isReady, which returns a Boolean. client.isOpen is also available. This returns true when the client's underlying socket is open, and false when it isn't (for example, when the client is still connecting or reconnecting after a network error).
More information 
The node-redis website has more examples. The Github repository also has useful information, including a guide to the connection configuration options you can use.
See also the other pages in this section for more information and examples:
Connect to the server
Connect your Node.js application to a Redis database
Connect to Azure Managed Redis
Learn how to authenticate to an Azure Managed Redis (AMR) database
Index and query documents
Learn how to use the Redis Query Engine with JSON and hash documents.
Index and query vectors
Learn how to index and query vector embeddings with Redis
Pipelines and transactions
Learn how to use Redis pipelines and transactions
Probabilistic data types
Learn how to use approximate calculations with Redis.
Production usage
Get your Node.js app ready for production
Migrate from ioredis
Discover the differences between ioredis and node-redis.
RATE THIS PAGE
★★★★★
Back to top ↑
Edit this pageCreate an issue
On this page
Install
Connect and test
More information
TrustPrivacyTerms of useLegal notices
Use Cases
Vector databaseFeature storesSemantic cacheCachingNoSQL databaseLeaderboardsData deduplicationMessagingAuthentication token storageFast-data ingestQuery cachingAll solutions
Industries
Financial ServicesGamingHealthcareRetailAll industries
Compare
Redis vs ElasticacheRedis vs MemcachedRedis vs Memory StoreRedis vs Source Available
Company
Mission & valuesLeadershipCareersNews
Connect
CommunityEvents & webinarsNews
Partners
Amazon Web ServicesGoogle CloudMicrosoft AzureAll partners
Support
Professional servicesSupport
         All products         Redis Enterprise         Redis Cloud         Redis Open Source         Redis Insight         Redis Enterprise for K8s         Redis Data Integration         Client Libraries       
ESC


data integration
Redis Data Integration
Redis Data Integration keeps Redis in sync with the primary database in near real time.
Learn more →
Read more
tool
Redis Insight
Redis Insight is a powerful tool for visualizing and optimizing data in Redis.
Learn more →
Read more
service
Redis MCP
Redis MCP server lets MCP clients access the features of Redis.
Learn more →
Read more
library
Python client for Redis
redis-py is a Python library for Redis.
Learn more →
Read more
library
RedisVL
RedisVL provides a powerful, dedicated Python client library for using Redis as a vector database. Leverage Redis's speed, reliability, and vector-based semantic search capabilities to supercharge your application.
Learn more →
Read more
data migration
RIOT
Redis Input/Output Tools (RIOT) is a command-line utility designed to help you get data in and out of Redis.
Learn more →
Read more
library
Java client for Redis
jedis is a Java library for Redis.
Learn more →
Read more
library
Java client for Redis
Lettuce is a Java library for Redis.
Learn more →
Read more
library
Node.js client for Redis
node-redis is a Node.js client library for Redis.
Learn more →
Read more
library
C#/.NET client for Redis
NRedisStack is a C#/.NET library for Redis.
Learn more →
Read more
data integration
Write-behind (preview)
Redis Data Integration keeps Redis in sync with the primary database in near real time.
Learn more →
Read more
cloud service
Amazon Bedrock
With Amazon Bedrock, users can access foundational AI models from a variety of vendors through a single API, streamlining the process of leveraging generative artificial intelligence.
Learn more →
Read more
provisioning
Pulumi provider for Redis Cloud
With the Redis Cloud Resource Provider you can provision Redis Cloud resources by using the programming language of your choice.
Learn more →
Read more
provisioning
Terraform provider for Redis Cloud
The Redis Cloud Terraform provider allows you to provision and manage Redis Cloud resources.
Learn more →
Read more
observability
Prometheus and Grafana with Redis Enterprise Software
You can use Prometheus and Grafana to collect and visualize your Redis Enterprise Software metrics.
Learn more →
Read more
observability
Prometheus and Grafana with Redis Cloud
You can use Prometheus and Grafana to collect and visualize your Redis Cloud metrics.
Learn more →
Read more
observability
Datadog with Redis Cloud
To collect, view, and monitor metrics data from your databases and other cluster components, you can connect Datadog to your Redis Cloud cluster using the Redis Datadog Integration.
Learn more →
Read more
observability
Datadog with Redis Enterprise
To collect, view, and monitor metrics data from your databases and other cluster components, you can connect Datadog to your Redis Enterprise cluster using the Redis Datadog Integration.
Learn more →
Read more
observability
Dynatrace with Redis Cloud
To collect, view, and monitor metrics data from your databases and other cluster components, you can connect Dynatrace to your Redis Cloud cluster using the Redis Dynatrace Integration.
Learn more →
Read more
observability
Dynatrace with Redis Enterprise
To collect, view, and monitor metrics data from your databases and other cluster components, you can connect Dynatrace to your Redis Enterprise cluster using the Redis Dynatrace Integration.
Learn more →
Read more
observability
Nagios with Redis Enterprise
This Nagios plugin enables you to monitor the status of Redis Enterprise related components and alerts.
Learn more →
Read more
observability
New Relic with Redis Cloud
To collect, view, and monitor metrics data from your databases and other cluster components, you can connect New Relic to your Redis Cloud cluster using the Redis New Relic Integration.
Learn more →
Read more
observability
New Relic with Redis Enterprise
To collect, view, and monitor metrics data from your databases and other cluster components, you can connect New Relic to your Redis Enterprise cluster using the Redis New Relic Integration.
Learn more →
Read more
observability
Uptrace with Redis Enterprise
To collect, view, and monitor metrics data from your databases and other cluster components, you can connect Uptrace to your Redis Enterprise cluster using OpenTelemetry Collector.
Learn more →
Read more
data integration
Confluent with Redis Cloud
The Redis Sink connector for Confluent Cloud allows you to send data from Confluent Cloud to your Redis Cloud database.
Learn more →
Read more
framework
Spring Data Redis
Spring Data Redis implements the Spring framework's cache abstraction for Redis, which allows you to plug Redis into your Spring application with minimal effort.
Learn more →
Read more
library
RedisOM for .NET
Redis OM for .NET is an object-mapping library for Redis.
Learn more →
Read more
library
RedisOM for Java
The Redis OM for Java library is based on the Spring framework and provides object-mapping abstractions.
Learn more →
Read more
library
RedisOM for Node.js
Redis OM for Node.js is an object-mapping library for Redis.
Learn more →
Read more
library
RedisOM for Python
Redis OM for Python is an object-mapping library for Redis.
Learn more →

