# AWS SDKs and Tools Reference Guide

<!-- This document will contain AWS SDKs and Tools Reference Guide documentation for Parker Flight -->
      Reference Guide
      AWS SDKs and Tools
      Copyright © 2025 Amazon Web Services, Inc. and/or its aﬃliates. All rights reserved.
      AWS SDKs and Tools                                                             Reference Guide
      AWS SDKs and Tools: Reference Guide
      Copyright © 2025 Amazon Web Services, Inc. and/or its aﬃliates. All rights reserved.
      Amazon's trademarks and trade dress may not be used in connection with any product or service 
      that is not Amazon's, in any manner that is likely to cause confusion among customers, or in any 
      manner that disparages or discredits Amazon. All other trademarks not owned by Amazon are 
      the property of their respective owners, who may or may not be aﬃliated with, connected to, or 
      sponsored by Amazon.
     AWS SDKs and Tools                                           Reference Guide
     Table of Contents
     AWS SDKs and Tools Reference Guide........................................................................................... 1
       Developer resources ..................................................................................................................................... 3
         Toolkit telemetry notiﬁcation ............................................................................................................. 3
     Conﬁguration................................................................................................................................... 4
       Shared config and credentials ﬁles................................................................................................. 4
         Proﬁles ....................................................................................................................................................... 5
         Format of the conﬁg ﬁle ....................................................................................................................... 6
         Format of the credentials ﬁle .............................................................................................................. 9
       Location of the shared ﬁles ..................................................................................................................... 10
         Home directory resolution .................................................................................................................. 11
         Change the default location of these ﬁles ...................................................................................... 11
       Environment variables ............................................................................................................................... 13
         How to set environment variables .................................................................................................... 13
         Serverless environment variable setup ............................................................................................ 14
       JVM system properties .............................................................................................................................. 15
         How to set JVM system properties ................................................................................................... 15
     Authentication and access ............................................................................................................ 17
       AWS Builder ID........................................................................................................................................... 19
       IAM Identity Center authentication ........................................................................................................ 19
         Prerequisites ........................................................................................................................................... 20
         Conﬁgure programmatic access using IAM Identity Center ......................................................... 20
         Refreshing portal access sessions ...................................................................................................... 23
         Understand IAM Identity Center authentication ............................................................................ 23
       IAM Roles Anywhere.................................................................................................................................. 27
         Step 1: Conﬁgure IAM Roles Anywhere........................................................................................... 27
         Step 2: Use IAM Roles Anywhere...................................................................................................... 28
       Assume a role............................................................................................................................................. 29
         Assume an IAM role............................................................................................................................. 30
       Assume a role (web) .................................................................................................................................. 31
         Federate with web identity or OpenID Connect ............................................................................ 32
       AWS access keys......................................................................................................................................... 33
         Use short-term credentials ................................................................................................................. 33
         Use long-term credentials .................................................................................................................. 34
         Short-term credentials ......................................................................................................................... 35
                                                                        iii
     AWS SDKs and Tools                                           Reference Guide
         Long-term credentials .......................................................................................................................... 37
       IAM roles for EC2 instances ..................................................................................................................... 40
         Create an IAM role ............................................................................................................................... 40
         Launch an Amazon EC2 instance and specify your IAM role ....................................................... 40
         Connect to the EC2 instance .............................................................................................................. 41
         Run your application on the EC2 instance ...................................................................................... 41
       Trusted identity propagation ................................................................................................................... 42
         Prerequisites for using the TIP plugin .............................................................................................. 42
         To use the TIP plugin in your code ................................................................................................... 43
     Settings reference ......................................................................................................................... 47
       Creating service clients ............................................................................................................................. 47
       Precedence of settings .............................................................................................................................. 47
       Understanding the settings pages of this guide ................................................................................. 48
       Config ﬁle settings list ........................................................................................................................... 50
       Credentials ﬁle settings list ............................................................................................................... 54
       Environment variables list ........................................................................................................................ 54
       JVM system properties list ....................................................................................................................... 59
       Standardized credential providers .......................................................................................................... 62
         Understand the credential provider chain ....................................................................................... 63
         SDK-speciﬁc and tool-speciﬁc credential provider chains ............................................................ 64
         AWS access keys.................................................................................................................................... 65
         Assume role provider ........................................................................................................................... 68
         Container provider ................................................................................................................................ 75
         IAM Identity Center provider .............................................................................................................. 79
         IMDS provider........................................................................................................................................ 85
         Process provider .................................................................................................................................... 90
       Standardized features ............................................................................................................................... 94
         Account-based endpoints.................................................................................................................... 95
         Application ID ........................................................................................................................................ 98
         Amazon EC2 instance metadata...................................................................................................... 100
         Amazon S3 access points.................................................................................................................. 102
         Amazon S3 Multi-Region Access Points ......................................................................................... 105
         AWS Region......................................................................................................................................... 107
         AWS STS Regional endpoints.......................................................................................................... 110
         Data Integrity Protections ................................................................................................................ 115
         Dual-stack and FIPS endpoints ........................................................................................................ 120
                                                                        iv
     AWS SDKs and Tools                                           Reference Guide
         Endpoint discovery ............................................................................................................................. 122
         General conﬁguration ........................................................................................................................ 125
         Host preﬁx injection ........................................................................................................................... 128
         IMDS client ........................................................................................................................................... 132
         Retry behavior ..................................................................................................................................... 135
         Request compression......................................................................................................................... 141
         Service-speciﬁc endpoints ................................................................................................................ 144
         Smart conﬁguration defaults ........................................................................................................... 188
     Common Runtime........................................................................................................................ 194
       CRT dependencies.................................................................................................................................... 195
     Maintenance policy..................................................................................................................... 196
       Overview.................................................................................................................................................... 196
       Versioning .................................................................................................................................................. 196
       SDK major version lifecycle ................................................................................................................... 196
       Dependency lifecycle .............................................................................................................................. 197
       Communication methods....................................................................................................................... 198
     Version lifecycle ........................................................................................................................... 199
     Document history........................................................................................................................ 202
                                                                        v
      AWS SDKs and Tools                                                               Reference Guide
      What is covered in the AWS SDKs and Tools Reference 
      Guide
      Many SDKs and tools share some common functionality, either through shared design 
      speciﬁcations or through a shared library.
      This guide includes information regarding:
      •
        Globally conﬁguring AWS SDKs and tools – How to use the shared config and credentials
        ﬁles or environment variables to conﬁgure your AWS SDKs and tools.
      • Authentication and access using AWS SDKs and tools – Establish how your code or tool 
        authenticates with AWS when you develop with AWS services.
      • AWS SDKs and tools settings reference – Reference for all standardized settings available for 
        authentication and conﬁguration.
      • AWS Common Runtime (CRT) libraries – Overview of the shared AWS Common Runtime (CRT) 
        libraries that are available to almost all SDKs.
      • AWS SDKs and Tools maintenance policy covers the maintenance policy and versioning for AWS 
        Software Development Kits (SDKs) and tools, including Mobile and Internet of Things (IoT) SDKs, 
        and their underlying dependencies.
      This AWS SDKs and Tools Reference Guide is intended to be a base of information that is applicable 
      to multiple SDKs and tools. The speciﬁc guide for the SDK or tool that you are using should be used 
      in addition to any information presented here. The following are the SDK and tools which have 
      relevant sections of material in this guide:
        If you are using:                            This guide's relevant sections for you are:
        • Any SDK or tool                            AWS SDKs and Tools maintenance policy
        • AWS Cloud9                                 Globally conﬁguring AWS SDKs and tools
        • AWS CDK
                                                     Authentication and access using AWS SDKs 
        • AWS Toolkit for Azure DevOps
                                                     and tools
        • AWS Toolkit for JetBrains
                                                     AWS SDKs and Tools maintenance policy
        • AWS Toolkit for Visual Studio
                                                                                                1
      AWS SDKs and Tools                                                               Reference Guide
        If you are using:                            This guide's relevant sections for you are:
        • AWS Toolkit for Visual Studio Code
        • AWS Serverless Application Model
        • AWS CodeArtifact
        • AWS CodeBuild
        • Amazon CodeCatalyst
        • AWS CodeCommit
        • AWS CodeDeploy
        • AWS CodePipeline
        • AWS CLI                                    Globally conﬁguring AWS SDKs and tools
        • AWS SDK for C++
                                                     Authentication and access using AWS SDKs 
        • AWS SDK for Go
                                                     and tools
        • AWS SDK for Java
                                                     AWS SDKs and tools settings reference
        • AWS SDK for JavaScript
        • AWS SDK for Kotlin                         AWS Common Runtime (CRT) libraries
        • AWS SDK for .NET
                                                     AWS SDKs and Tools maintenance policy
        • AWS SDK for PHP
                                                     AWS SDKs and Tools version lifecycle
        • AWS SDK for Python (Boto3)
        • AWS SDK for Ruby
        • AWS SDK for Rust
        • AWS SDK for Swift
        • AWS Tools for Windows PowerShell
      • For an overview of tools that can help you develop applications on AWS, see Tools to Build on 
        AWS.
      • For information on support, see the AWS Knowledge Center.
      • For AWS terminology, see the AWS glossary in the AWS Glossary Reference.
                                                                                                2
      AWS SDKs and Tools                                                               Reference Guide
      Developer resources
      Amazon Q Developer is a generative AI-powered conversational assistant that can help you to 
      understand, build, extend, and operate AWS applications. To accelerate your building on AWS, 
      the model that powers Amazon Q is augmented with high-quality AWS content to produce more 
      complete, actionable, and referenced answers. For more information, see What is Amazon Q 
      Developer? in the Amazon Q Developer User Guide.
      Toolkit telemetry notiﬁcation
      AWS Integrated Development Environment (IDE) Toolkits are plugins and extensions that enable 
      access to AWS services in your IDE. Amazon Q IDE plugins and extensions enable generative AI 
      assistance in your IDE. For detailed information about each of the IDE Toolkits, see the Toolkit User 
      Guides in the preceding table. To learn more about using Amazon Q in your IDE, see the Using 
      Amazon Q in the IDE topic in the Amazon Q developer guide.
      AWS IDE Toolkits and Amazon Q may collect and store client-side telemetry data to inform 
      decisions regarding future AWS Toolkit and Amazon Q releases. The data collected quantiﬁes your 
      usage of the AWS Toolkit and Amazon Q.
      To learn more about the telemetry data collected across all of the AWS IDE Toolkits and Amazon Q, 
      see the commonDeﬁnitions.json document in the aws-toolkit-common Github repository.
      For detailed information about the telemetry data collected by each of the AWS IDE Toolkits and 
      Amazon Q extensions, reference the resource documents in the following AWS Toolkit GitHub 
      repositories:
      • AWS Visual Studio Toolkit with Amazon Q
      • AWS Toolkit for Visual Studio Code and Amazon Q extension for VS Code
      • AWS Toolkit for JetBrains and Amazon Q plugin for JetBrains
      • Amazon Q for Eclipse
      Certain AWS services that are accessible in the AWS Toolkits may collect additional client-side 
      telemetry data. For detailed information about the type of data collected by each individual AWS 
      service, see the AWS Documentation topic for the speciﬁc service you're interested in.
      Developer resources                                                                       3
      AWS SDKs and Tools                                                               Reference Guide
      Globally conﬁguring AWS SDKs and tools
      With AWS SDKs and other AWS developer tools, such as the AWS Command Line Interface (AWS 
      CLI), you can interact with AWS service APIs. Before attempting that, however, you must conﬁgure 
      the SDK or tool with the information that it needs to perform the requested operation.
      This information includes the following items:
      • Credentials information that identiﬁes who is calling the API. The credentials are used to 
        encrypt the request to the AWS servers. Using this information, AWS conﬁrms your identity and 
        can retrieve permissions policies associated with it. Then it can determine what actions you're 
        allowed to perform.
      • Other conﬁguration details that you use to tell the AWS CLI or SDK how to process the request, 
        where to send the request (to which AWS service endpoint), and how to interpret or display the 
        response.
      Each SDK or tool supports multiple sources that you can use to supply the required credential and 
      conﬁguration information. Some sources are unique to the SDK or tool, and you must refer to the 
      documentation for that tool or SDK for the details on how to use that method.
      However, the AWS SDKs and tools support common settings from primary sources beyond the code 
      itself. This section covers the following topics:
      Topics
      • Using shared conﬁg and credentials ﬁles to globally conﬁgure AWS SDKs and tools
      • Finding and changing the location of the shared conﬁg and credentials ﬁles of AWS SDKs and 
        tools
      • Using environment variables to globally conﬁgure AWS SDKs and tools
      • Using JVM system properties to globally conﬁgure AWS SDK for Java and AWS SDK for Kotlin
      Using shared config and credentials ﬁles to globally 
      conﬁgure AWS SDKs and tools
      The shared AWS config and credentials ﬁles are the most common way that you can specify 
      authentication and conﬁguration to an AWS SDK or tool.
                                                                                                4
      Shared config and credentials ﬁles
      AWS SDKs and Tools                                                     Reference Guide
      The shared config and credentials ﬁles contain a set of proﬁles. A proﬁle is a set of 
      conﬁguration settings, in key–value pairs, that is used by AWS SDKs, the AWS Command Line 
      Interface (AWS CLI), and other tools. Conﬁguration values are attached to a proﬁle in order to 
      conﬁgure some aspect of the SDK/tool when that proﬁle is used. These ﬁles are "shared" in that 
      the values take aﬀect for any applications, processes, or SDKs on the local environment for a user.
      Both the shared config and credentials ﬁles are plaintext ﬁles that contain only ASCII 
      characters (UTF-8 encoded). They take the form of what are generally referred to as INI ﬁles.
      Proﬁles
      Settings within the shared config and credentials ﬁles are associated with a speciﬁc proﬁle. 
      Multiple proﬁles can be deﬁned within the ﬁle to create diﬀerent setting conﬁgurations to apply in 
      diﬀerent development environments.
      The [default] proﬁle contains the values that are used by an SDK or tool operation if a speciﬁc 
      named proﬁle is not speciﬁed. You can also create separate proﬁles that you can explicitly 
      reference by name. Each proﬁle can use diﬀerent settings and values as needed by your application 
      and scenario.
          Note
          [default] is simply an unnamed proﬁle. This proﬁle is named default because it is the 
          default proﬁle used by the SDK if the user does not specify a proﬁle. It does not provide 
          inherited default values to other proﬁles. If you set something in the [default] proﬁle 
          and you don't set it in a named proﬁle, then the value isn't set when you use the named 
          proﬁle.
      Set a named proﬁle
      The [default] proﬁle and multiple named proﬁles can exist in the same ﬁle. Use the following 
      setting to select which proﬁle's settings are used by your SDK or tool when running your code. 
      Proﬁles can also be selected within code, or per-command when working with the AWS CLI.
      Conﬁgure this functionality by setting one of the following:
      Proﬁles                                                                        5
      AWS SDKs and Tools                                                               Reference Guide
      AWS_PROFILE - environment variable
         When this environment variable is set to a named proﬁle or "default", all SDK code and AWS CLI 
         commands use the settings in that proﬁle.
         Linux/macOS example of setting environment variables via command line:
           export AWS_PROFILE="my_default_profile_name";
         Windows example of setting environment variables via command line:
           setx AWS_PROFILE "my_default_profile_name"
      aws.profile - JVM system property
         For SDK for Kotlin on the JVM and the SDK for Java 2.x, you can set the aws.profile system 
         property. When the SDK creates a service client, it uses the settings in the named proﬁle unless 
         the setting is overridden in code. The SDK for Java 1.x does not support this system property.
           Note
           If your application is on a server running multiple applications, we recommend you always 
           used named proﬁles rather than the default proﬁle. The default proﬁle is automatically 
           picked up by any AWS application in the environment and is shared amongst them. Thus, if 
           someone else updates the default proﬁle for their application it can unintentionally impact 
           the others. To safeguard against this, deﬁne a named proﬁle in the shared config ﬁle and 
           then use that named proﬁle in your application by setting the named proﬁle in your code. 
           You can use the environment variable or JVM system property to set the named proﬁle if 
           you know that it's scope only aﬀects your application.
      Format of the conﬁg ﬁle
      The config ﬁle is organized into sections. A section is a named collection of settings, and 
      continues until another section deﬁnition line is encountered.
      The config ﬁle is a plaintext ﬁle that uses the following format:
      Format of the conﬁg ﬁle                                                                   6
      AWS SDKs and Tools                                                               Reference Guide
      •
        All entries in a section take the general form of setting-name=value.
      •
        Lines can be commented out by starting the line with a hashtag character (#).
      Section types
      A section deﬁnition is a line that applies a name to a collection of settings. Section deﬁnition lines 
      start and end with square brackets ([ ]). Inside the brackets, there is a section type identiﬁer and a 
      custom name for the section. You can use letters, numbers, hyphens ( - ), and underscores ( _ ), but 
      no spaces.
      Section type: default
      Example section deﬁnition line: [default]
      [default] is the only proﬁle that does not require the profile section identiﬁer.
      The following example shows a basic config ﬁle with a [default] proﬁle. It sets the region
      setting. All settings that follow this line, up until another section deﬁnition is encountered, are part 
      of this proﬁle.
        [default]
        #Full line comment, this text is ignored.
        region = us-east-2
      Section type: profile
      Example section deﬁnition line: [profile dev]
      The profile section deﬁnition line is a named conﬁguration grouping that you can apply for 
      diﬀerent development scenarios. To better understand named proﬁles, see the preceding section 
      on Proﬁles.
      The following example shows a config ﬁle with a profile section deﬁnition line and a 
      named proﬁle called foo. All settings that follow this line, up until another section deﬁnition is 
      encountered, are part of this named proﬁle.
        [profile foo]
        ...settings...
      Format of the conﬁg ﬁle                                                                   7
      AWS SDKs and Tools                                                               Reference Guide
      Some settings have their own nested group of subsettings, such as the s3 setting and subsettings 
      in the following example. Associate the subsettings with the group by indenting them by one or 
      more spaces.
        [profile test]
        region = us-west-2
        s3 = 
            max_concurrent_requests=10 
            max_queue_size=1000
      Section type: sso-session
      Example section deﬁnition line: [sso-session my-sso]
      The sso-session section deﬁnition line names a group of settings that you use to conﬁgure 
      a proﬁle to resolve AWS credentials using AWS IAM Identity Center. For more information on 
      conﬁguring single sign-on authentication, see Using IAM Identity Center to authenticate AWS SDK 
      and tools. A proﬁle is linked to a sso-session section by a key-value pair where sso-session
      is the key and the name of your sso-session section is the value, such as sso-session = 
      <name-of-sso-session-section>.
      The following example conﬁgures a proﬁle that will get short-term AWS credentials for the 
      "SampleRole" IAM role in the "111122223333" account using a token from the "my-sso". The "my-
      sso" sso-session section is referenced in the profile section by name using the sso-session
      key.
        [profile dev]
        sso_session = my-sso
        sso_account_id = 111122223333
        sso_role_name = SampleRole
        [sso-session my-sso]
        sso_region = us-east-1
        sso_start_url = https://my-sso-portal.awsapps.com/start
      Section type: services
      Example section deﬁnition line: [services dev]
      Format of the conﬁg ﬁle                                                                   8
      AWS SDKs and Tools                                                               Reference Guide
           Note
           The services section supports service-speciﬁc endpoint customizations and is only 
           available in SDKs and tools that include this feature. To see if this feature is available for 
           your SDK, see Support by AWS SDKs and tools for service-speciﬁc endpoints.
      The services section deﬁnition line names a group of settings that conﬁgures custom endpoints 
      for AWS service requests. A proﬁle is linked to a services section by a key-value pair where
      services is the key and the name of your services section is the value, such as services = 
      <name-of-services-section>.
      The services section is further separated into subsections by <SERVICE> =  lines, where
      <SERVICE> is the AWS service identiﬁer key. The AWS service identiﬁer is based on the API model's
      serviceId by replacing all spaces with underscores and lowercasing all letters. For a list of all 
      service identiﬁer keys to use in the services section, see Identiﬁers for service-speciﬁc endpoints. 
      The service identiﬁer key is followed by nested settings with each on its own line and indented by 
      two spaces.
      The following example uses a services deﬁnition to conﬁgure the endpoint to use for requests 
      made only to the Amazon DynamoDB service. The "local-dynamodb" services section is 
      referenced in the profile section by name using the services key. The AWS service identiﬁer 
      key is dynamodb. The Amazon DynamoDB service subsection begins on the line dynamodb = . 
      Any immediately following lines that are indented are included in that subsection and apply to that 
      service.
        [profile dev]
        services = local-dynamodb
        [services local-dynamodb]
        dynamodb =  
          endpoint_url = http://localhost:8000
      For more information on custom endpoint conﬁguration, see Service-speciﬁc endpoints.
      Format of the credentials ﬁle
      The rules for the credentials ﬁle are generally identical to those for the config ﬁle, except 
      that proﬁle sections don't begin with the word profile. Use only the proﬁle name itself between 
      Format of the credentials ﬁle                                                             9
      AWS SDKs and Tools                                                               Reference Guide
      square brackets. The following example shows a credentials ﬁle with a named proﬁle section 
      called foo.
        [foo]
        ...credential settings...
      Only the following settings that are considered "secrets" or sensitive can be stored in the
      credentials ﬁle: aws_access_key_id,aws_secret_access_key, and aws_session_token. 
      Although these settings can alternatively be placed in the shared config ﬁle, we recommend 
      that you keep these sensitive values in the separate credentials ﬁle. This way, you can provide 
      separate permissions for each ﬁle, if necessary.
      The following example shows a basic credentials ﬁle with a [default] proﬁle. It sets the
      aws_access_key_id,aws_secret_access_key, and aws_session_token global settings.
        [default]
        aws_access_key_id=AKIAIOSFODNN7EXAMPLE
        aws_secret_access_key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
        aws_session_token=IQoJb3JpZ2luX2IQoJb3JpZ2luX2IQoJb3JpZ2luX2IQoJb3JpZ2luX2IQoJb3JpZVERYLONGSTRINGEXAMPLE
      Regardless of whether you use a named proﬁle or "default" in your credentials ﬁle, any 
      settings here will be combined with any settings from your config ﬁle that uses the same proﬁle 
      name. If there are credentials in both ﬁles for a proﬁle sharing the same name, the keys in the 
      credentials ﬁle take precedence.
      Finding and changing the location of the shared config and
      credentials ﬁles of AWS SDKs and tools
      The shared AWS config and credentials ﬁles are plaintext ﬁles that hold conﬁguration 
      information for the AWS SDKs and tools. The ﬁles reside locally in your environment and used 
      automatically by SDK code or by AWS CLI commands that you run in that environment. For 
      example, on your own computer or when developing on an Amazon Elastic Compute Cloud 
      instance.
      When the SDK or tool runs, it checks for these ﬁles and loads any available conﬁguration settings. 
      If the ﬁles do not already exist, then a basic ﬁle is automatically created by the SDK or tool.
      By default, the ﬁles are in a folder named .aws that is placed in your home or user folder.
      Location of the shared ﬁles                                                              10
      AWS SDKs and Tools                                                               Reference Guide
        Operating system                             Default location and name of ﬁles
        Linux and macOS
                                                     ~/.aws/config
                                                     ~/.aws/credentials
        Windows
                                                     %USERPROFILE%\.aws\config
                                                     %USERPROFILE%\.aws\credentials
      Home directory resolution
      ~ is only used for home directory resolution when it:
      • Starts the path
      •
        Is followed immediately by / or a platform speciﬁc separator. On windows, ~/ and ~\ both 
        resolve to the home directory.
      When determining the home directory, the following variables are checked:
      •
        (All platforms) The HOME environment variable
      •
        (Windows platforms) The USERPROFILE environment variable
      •
        (Windows platforms) The concatenation of HOMEDRIVE and HOMEPATH environment variables 
        ($HOMEDRIVE$HOMEPATH)
      • (Optional per SDK or tool) An SDK or tool-speciﬁc home path resolution function or variable
      When possible, if a user's home directory is speciﬁed at the start of the path (for example,
      ~username/), it is resolved to the requested user name's home directory (for example, /home/
      username/.aws/config).
      Change the default location of these ﬁles
      You can use any of the following to override where these ﬁles are loaded from by the SDK or tool.
      Home directory resolution                                                                11
      AWS SDKs and Tools                                                               Reference Guide
      Use environment variables
      The following environment variables can be set to change the location or name of these ﬁles from 
      the default to a custom value:
      •
        config ﬁle environment variable: AWS_CONFIG_FILE
      •
        credentials ﬁle environment variable: AWS_SHARED_CREDENTIALS_FILE
      Linux/macOS
         You can specify an alternate location by running the following export commands on Linux or 
         macOS.
           $ export AWS_CONFIG_FILE=/some/file/path/on/the/system/config-file-name
           $ export AWS_SHARED_CREDENTIALS_FILE=/some/other/file/path/on/the/system/
           credentials-file-name
      Windows
         You can specify an alternate location by running the following setx commands on Windows.
           C:\> setx AWS_CONFIG_FILE c:\some\file\path\on\the\system\config-file-name
           C:\> setx AWS_SHARED_CREDENTIALS_FILE c:\some\other\file\path\on\the\system
           \credentials-file-name
      For more information on conﬁguring your system using environment variables, see Using 
      environment variables to globally conﬁgure AWS SDKs and tools.
      Use JVM system properties
      For the SDK for Kotlin running on the JVM and for SDK for Java 2.x, you can set the following JVM 
      system properties to change the location or name of these ﬁles from the default to a custom value:
      •
        config ﬁle JVM system property: aws.configFile
      •
        credentials ﬁle environment variable: aws.sharedCredentialsFile
      For instructions on how to set JVM system properties, see the section called “How to set JVM 
      system properties”. The SDK for Java 1.x does not support these system properties.
      Change the default location of these ﬁles                                                12
      AWS SDKs and Tools                                                               Reference Guide
      Using environment variables to globally conﬁgure AWS SDKs 
      and tools
      Environment variables provide another way to specify conﬁguration options and credentials when 
      using AWS SDKs and tools. Environment variables can be useful for scripting or temporarily setting 
      a named proﬁle as the default. For the list of environment variables supported by most SDKs, see
      Environment variables list.
      Precedence of options
      • If you specify a setting by using its environment variable, it overrides any value loaded from a 
        proﬁle in the shared AWS config and credentials ﬁles.
      • If you specify a setting by using a parameter on the AWS CLI command line, it overrides any 
        value from either the corresponding environment variable or a proﬁle in the conﬁguration ﬁle.
      How to set environment variables
      The following examples show how you can conﬁgure environment variables for the default user.
      Linux, macOS, or Unix
           $ export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
           $ export AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
           $ export 
            AWS_SESSION_TOKEN=AQoEXAMPLEH4aoAH0gNCAPy...truncated...zrkuWJOgQs8IZZaIv2BXIa2R4Olgk
           $ export AWS_REGION=us-west-2
         Setting the environment variable changes the value used until the end of your shell session, 
         or until you set the variable to a diﬀerent value. You can make the variables persistent across 
         future sessions by setting them in your shell's startup script.
      Windows Command Prompt
           C:\> setx AWS_ACCESS_KEY_ID AKIAIOSFODNN7EXAMPLE
           C:\> setx AWS_SECRET_ACCESS_KEY wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
           C:\> setx 
            AWS_SESSION_TOKEN AQoEXAMPLEH4aoAH0gNCAPy...truncated...zrkuWJOgQs8IZZaIv2BXIa2R4Olgk
           C:\> setx AWS_REGION us-west-2
      Environment variables                                                                    13
      AWS SDKs and Tools                                                               Reference Guide
         Using set to set an environment variable changes the value used until the end of the current 
         Command Prompt session, or until you set the variable to a diﬀerent value. Using setx to set 
         an environment variable changes the value used in both the current Command Prompt session 
         and all Command Prompt sessions that you create after running the command. It does not
         aﬀect other command shells that are already running at the time you run the command.
      PowerShell
           PS C:\> $Env:AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
           PS C:\> $Env:AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
           PS C:
           \> $Env:AWS_SESSION_TOKEN="AQoEXAMPLEH4aoAH0gNCAPy...truncated...zrkuWJOgQs8IZZaIv2BXIa2R4Olgk"
           PS C:\> $Env:AWS_REGION="us-west-2"
         If you set an environment variable at the PowerShell prompt as shown in the previous 
         examples, it saves the value for only the duration of the current session. To make the 
         environment variable setting persistent across all PowerShell and Command Prompt sessions, 
         store it by using the System application in Control Panel. Alternatively, you can set the variable 
         for all future PowerShell sessions by adding it to your PowerShell proﬁle. See the PowerShell 
         documentation for more information about storing environment variables or persisting them 
         across sessions.
      Serverless environment variable setup
      If you use a serverless architecture for development, you have other options for setting 
      environment variables. Depending on your container, you can use diﬀerent strategies for code 
      running in those containers to see and access environment variables, similar to non-cloud 
      environments.
      For example, with AWS Lambda, you can directly set environment variables. For details, see Using 
      AWS Lambda environment variables in the AWS Lambda Developer Guide.
      In Serverless Framework, you can often set SDK environment variables in the serverless.yml
      ﬁle under the provider key under the environment setting. For information on the
      serverless.yml ﬁle, see General function settings in the Serverless Framework documentation.
      Regardless of which mechanism you use to set container environment variables, there are some 
      that are reserved by the container, such as those documented for Lambda at Deﬁned runtime 
      Serverless environment variable setup                                                    14
      AWS SDKs and Tools                                                               Reference Guide
      environment variables. Always consult the oﬃcial documentation for the container that you're 
      using to determine how environment variables are treated and whether there are any restrictions.
      Using JVM system properties to globally conﬁgure AWS SDK 
      for Java and AWS SDK for Kotlin
      JVM system properties provide another way to specify conﬁguration options and credentials for 
      SDKs that run on the JVM such as the AWS SDK for Java and the AWS SDK for Kotlin. For a list of 
      JVM system properties supported by SDKs, see Settings reference.
      Precedence of options
      • If you specify a setting by using its JVM system property, it overrides any value found in 
        environment variables or loaded from a proﬁle in the shared AWS config and credentials
        ﬁles.
      • If you specify a setting by using its environment variable, it overrides any value loaded from a 
        proﬁle in the shared AWS config and credentials ﬁles.
      How to set JVM system properties
      You can set JVM system properties several ways.
      On the command line
      Set JVM system properties on the command-line when invoking the java command by using the -
      D switch. The following command conﬁgures the AWS Region globally for all service clients unless 
      you explicitly override the value in code.
        java -Daws.region=us-east-1 -jar <your_application.jar> <other_arguments>
      If you need to set multiple JVM system properties, specify the -D switch multiple times.
      With an environment variable
      If you can't access the command line to invoke the JVM to run your application, you can use the
      JAVA_TOOL_OPTIONS environment variable to conﬁgure command-line options. This approach is 
      useful in situations such as running an AWS Lambda function on the Java runtime or running code 
      in an embedded JVM.
      JVM system properties                                                                    15
      AWS SDKs and Tools                                                               Reference Guide
      The following example conﬁgures the AWS Region globally for all service clients unless you 
      explicitly override the value in code.
      Linux, macOS, or Unix
           $ export JAVA_TOOL_OPTIONS="-Daws.region=us-east-1"
         Setting the environment variable changes the value used until the end of your shell session, 
         or until you set the variable to a diﬀerent value. You can make the variables persistent across 
         future sessions by setting them in your shell's startup script.
      Windows Command Prompt
           C:\> setx JAVA_TOOL_OPTIONS -Daws.region=us-east-1
         Using set to set an environment variable changes the value used until the end of the current 
         Command Prompt session, or until you set the variable to a diﬀerent value. Using setx to set 
         an environment variable changes the value used in both the current Command Prompt session 
         and all Command Prompt sessions that you create after running the command. It does not
         aﬀect other command shells that are already running at the time you run the command.
      At runtime
      You can also set JVM system properties at runtime in code by using the System.setProperty
      method as shown in the following example.
        System.setProperty("aws.region", "us-east-1");
           Important
           Set any JVM system properties before you initialize SDK service clients, otherwise service 
           clients may use other values.
      How to set JVM system properties                                                         16
     AWS SDKs and Tools                                           Reference Guide
     Authentication and access using AWS SDKs and tools
     When you develop an AWS SDK application or use AWS tools to use AWS services, you must 
     establish how your code or tool authenticates with AWS. You can conﬁgure programmatic access 
     to AWS resources in diﬀerent ways, depending on the environment the code runs in and the AWS 
     access available to you.
     Authentication options for code running locally (not in AWS)
     • Using IAM Identity Center to authenticate AWS SDK and tools – As a security best practice, we 
       recommend using AWS Organizations with IAM Identity Center to manage access across all your 
       AWS accounts. You can create users in AWS IAM Identity Center, use Microsoft Active Directory, 
       use a SAML 2.0 identity provider (IdP), or individually federate your IdP to AWS accounts. To 
       check if your Region supports IAM Identity Center, see AWS IAM Identity Center endpoints and 
       quotas in the Amazon Web Services General Reference.
     • Using IAM Roles Anywhere to authenticate AWS SDKs and tools – You can use IAM Roles 
       Anywhere to obtain temporary security credentials in IAM for workloads such as servers, 
       containers, and applications that run outside of AWS. To use IAM Roles Anywhere, your 
       workloads must use X.509 certiﬁcates.
     • Assuming a role with AWS credentials to authenticate AWS SDKs and tools – You can assume an 
       IAM role to temporarily access AWS resources that you might not have access to otherwise.
     • Using AWS access keys to authenticate AWS SDKs and tools – Other options that might be less 
       convenient or might increase the security risk to your AWS resources.
     Authentication options for code running within an AWS environment
     If your code runs on AWS, credentials can be made automatically available to your application. For 
     example, if your application is hosted on Amazon Elastic Compute Cloud, and there is an IAM role 
     associated with that resource, the credentials are automatically made available to your application. 
     Likewise, if you use Amazon ECS or Amazon EKS containers, the credentials set for the IAM role can 
     be automatically obtained by the code running inside the container through the SDK's credential 
     provider chain.
     • Using IAM roles to authenticate applications deployed to Amazon EC2 – Use IAM roles to securely 
       run your application on an Amazon EC2 instance.
     • You can programmatically interact with AWS using IAM Identity Center in the following ways:
                                                                        17
      AWS SDKs and Tools                                                              Reference Guide
        • Use AWS CloudShell to run AWS CLI commands from the console.
        • To try cloud-based collaboration space for software development teams, consider using
          Amazon CodeCatalyst.
      Authentication through a web-based identity provider - Mobile or client-based web 
      applications
      If you are creating mobile applications or client-based web applications that require access to AWS, 
      build your app so that it requests temporary AWS security credentials dynamically by using web 
      identity federation.
      With web identity federation, you don't need to create custom sign-in code or manage your own 
      user identities. Instead, app users can sign in using a well-known external identity provider (IdP), 
      such as Login with Amazon, Facebook, Google, or any other OpenID Connect (OIDC)-compatible 
      IdP. They can receive an authentication token, and then exchange that token for temporary security 
      credentials in AWS that map to an IAM role with permissions to use the resources in your AWS 
      account.
      To learn how to conﬁgure this for your SDK or tool, see Assuming a role with web identity or 
      OpenID Connect to authenticate AWS SDKs and tools.
      For mobile applications, consider using Amazon Cognito. Amazon Cognito acts as an identity 
      broker and does much of the federation work for you. For more information, see Using Amazon 
      Cognito for mobile apps in the IAM User Guide.
      More information about access management
      The IAM User Guide has the following information about securely controlling access to AWS 
      resources:
      • IAM Identities (users, user groups, and roles) – Understand the basics of identities in AWS.
      • Security best practices in IAM – Security recommendations to follow when developing AWS 
        applications according to the shared-responsibility model.
      The Amazon Web Services General Reference has foundational basics on the following:
      • Understanding and getting your AWS credentials – Access key options and management 
        practices for both console and programmatic access.
                                                                                              18
      AWS SDKs and Tools                                                              Reference Guide
      IAM Identity Center trusted identity propagation (TIP) plugin to access AWS services
      • Using the TIP plugin to access AWS services – If you are creating an application for Amazon Q 
        Business or other service that supports trusted identity propagation, and are using the AWS 
        SDK for Java or the AWS SDK for JavaScript, you can use the TIP plugin for a streamlined 
        authorization experience.
      AWS Builder ID
      Your AWS Builder ID complements any AWS accounts you might already own or want to create. 
      While an AWS account acts as a container for AWS resources you create and provides a security 
      boundary for those resources, your AWS Builder ID represents you as an individual. You can sign 
      in with your AWS Builder ID to access developer tools and services such as Amazon Q and Amazon 
      CodeCatalyst.
      • Sign in with AWS Builder ID in the AWS Sign-In User Guide – Learn how to create and use an AWS 
        Builder ID and learn what the Builder ID provides.
      • CodeCatalyst concepts - AWS Builder ID in the Amazon CodeCatalyst User Guide – Learn how 
        CodeCatalyst uses an AWS Builder ID.
      Using IAM Identity Center to authenticate AWS SDK and tools
      AWS IAM Identity Center is the recommended method of providing AWS credentials when 
      developing an AWS application on a non-AWS compute service. For example, this would be 
      something like your local development environment. If you are developing on an AWS resource, 
      such as Amazon Elastic Compute Cloud (Amazon EC2) or AWS Cloud9, we recommend getting 
      credentials from that service instead.
      In this tutorial, you establish IAM Identity Center access and will conﬁgure it for your SDK or tool by 
      using the AWS access portal and the AWS CLI.
      • The AWS access portal is the web location where you manually sign in to the IAM 
        Identity Center. The format of the URL is d-xxxxxxxxxx.awsapps.com/startor
        your_subdomain.awsapps.com/start. When signed in to the AWS access portal, you can 
        view AWS accounts and roles that have been conﬁgured for that user. This procedure uses the 
        AWS access portal to get conﬁguration values you need for the SDK/tool authentication process.
      AWS Builder ID                                                                          19
      AWS SDKs and Tools                                                        Reference Guide
      • The AWS CLI is used to conﬁgure your SDK or tool to use IAM Identity Center authentication for 
        API calls made by your code. This one-time process updates your shared AWS config ﬁle, that is 
        then used by your SDK or tool when you run your code.
      Prerequisites
      Before starting this procedure, you should have completed the following:
      • If you do not have an AWS account, sign up for an AWS account.
      • If you haven't enabled IAM Identity Center yet, enable IAM Identity Center by following the 
        instructions in the AWS IAM Identity Center User Guide.
      Conﬁgure programmatic access using IAM Identity Center
      Step 1: Establish access and select appropriate permission set
      Choose one of the following methods to access your AWS credentials.
      I do not have established access through IAM Identity Center
      1.  Add a user and add administrative permissions by following the Conﬁgure user access with the 
          default IAM Identity Center directory procedure in the AWS IAM Identity Center User Guide.
      2.
          The AdministratorAccess permission set should not be used for regular development. 
          Instead, we recommend using the predeﬁned PowerUserAccess permission set, unless your 
          employer has created a custom permission set for this purpose.
          Follow the same Conﬁgure user access with the default IAM Identity Center directory
          procedure again, but this time:
          •
            Instead of creating the Admin team group, create a Dev team group, and substitute this 
            thereafter in the instructions.
          •
            You can use the existing user, but the user must be added to the new Dev team group.
          •
            Instead of creating the AdministratorAccess permission set, create a
            PowerUserAccess permission set, and substitute this thereafter in the instructions.
          When you are done, you should have the following:
      Prerequisites                                                                     20
      AWS SDKs and Tools                                                               Reference Guide
          •
            A Dev team group.
          •
            An attached PowerUserAccess permission set to the Dev team group.
          •
            Your user added to the Dev team group.
      3.
          Exit the portal and sign in again to see your AWS accounts and options for Administrator or
          PowerUserAccess. Select PowerUserAccess when working with your tool/SDK.
      I already have access to AWS through a federated identity provider managed by my employer 
      (such as Microsoft Entra or Okta)
      Sign in to AWS through your identity provider's portal. If your Cloud Administrator has granted 
      you PowerUserAccess (developer) permissions, you see the AWS accounts that you have access 
      to and your permission set. Next to the name of your permission set, you see options to access the 
      accounts manually or programmatically using that permission set.
      Custom implementations might result in diﬀerent experiences, such as diﬀerent permission set 
      names. If you're not sure which permission set to use, contact your IT team for help.
      I already have access to AWS through the AWS access portal managed by my employer
      Sign in to AWS through the AWS access portal. If your Cloud Administrator has granted you
      PowerUserAccess (developer) permissions, you see the AWS accounts that you have access to 
      and your permission set. Next to the name of your permission set, you see options to access the 
      accounts manually or programmatically using that permission set.
      I already have access to AWS through a federated custom identity provider managed by my 
      employer
      Contact your IT team for help.
      Step 2: Conﬁgure SDKs and tools to use IAM Identity Center
      1.  On your development machine, install the latest AWS CLI.
          a.  See Installing or updating the latest version of the AWS CLI in the AWS Command Line 
              Interface User Guide.
          b.  (Optional) To verify that the AWS CLI is working, open a command prompt and run the
              aws --version command.
      Conﬁgure programmatic access using IAM Identity Center                                   21
      AWS SDKs and Tools                                                               Reference Guide
      2.  Sign in to the AWS access portal. Your employer may provide this URL or you may get it in 
          an email following Step 1: Establish access. If not, ﬁnd your AWS access portal URL on the
          Dashboard of https://console.aws.amazon.com/singlesignon/.
          a.  In the AWS access portal, in the Accounts tab, select the individual account to manage. 
              The roles for your user are displayed. Choose Access keys to get credentials for command 
              line or programmatic access for the appropriate permission set. Use the predeﬁned
              PowerUserAccess permission set, or whichever permission set you or your employer has 
              created to apply least-privilege permissions for development.
          b.  In the Get credentials dialog box, choose either MacOS and Linux or Windows, 
              depending on your operating system.
          c.
              Choose the IAM Identity Center credentials method to get the Issuer URL and SSO 
              Region values that you need for the next step. Note: SSO Start URL can be used 
              interchangeably with Issuer URL.
      3.
          In the AWS CLI command prompt, run the aws configure sso command. When prompted, 
          enter the conﬁguration values that you collected in the previous step. For details on this AWS 
          CLI command, see Conﬁgure your proﬁle with the aws configure sso wizard.
          a.
              For the prompt SSO Start URL, enter the value you obtained for Issuer URL.
          b.
              For CLI proﬁle name, we recommend entering default when you are getting started. 
              For information about how to set non-default (named) proﬁles and their associated 
              environment variable, see Proﬁles.
      4.  (Optional) In the AWS CLI command prompt, conﬁrm the active session identity by running 
          the aws sts get-caller-identity command. The response should show the IAM Identity 
          Center permission set that you conﬁgured.
      5.  If you are using an AWS SDK, create an application for your SDK in your development 
          environment.
          a.
              For some SDKs, additional packages such as SSO and SSOOIDC must be added to your 
              application before you can use IAM Identity Center authentication. For details, see your 
              speciﬁc SDK.
          b.
              If you previously conﬁgured access to AWS, review your shared AWS credentials ﬁle for 
              any AWS access keys. You must remove any static credentials before the SDK or tool will 
              use the IAM Identity Center credentials because of the Understand the credential provider 
              chain precedence.
      Conﬁgure programmatic access using IAM Identity Center                                   22
      AWS SDKs and Tools                                                               Reference Guide
      For a deep dive into how the SDKs and tools use and refresh credentials using this conﬁguration, 
      see How IAM Identity Center authentication is resolved for AWS SDKs and tools.
      To conﬁgure IAM Identity Center provider settings directly in the shared config ﬁle, see IAM 
      Identity Center credential provider in this guide.
      Refreshing portal access sessions
      Your access will eventually expire and the SDK or tool will encounter an authentication error. When 
      this expiration occurs depends on your conﬁgured session lengths. To refresh the access portal 
      session again when needed, use the AWS CLI to run the aws sso login command.
      You can extend both the IAM Identity Center access portal session duration and the permission 
      set session duration. This lengthens the amount of time that you can run code before you need to 
      manually sign in again with the AWS CLI. For more information, see the following topics in the AWS 
      IAM Identity Center User Guide:
      • IAM Identity Center session duration – Conﬁgure the duration of your users' AWS access portal 
        sessions
      • Permission set session duration – Set session duration
      How IAM Identity Center authentication is resolved for AWS SDKs and 
      tools
      Relevant IAM Identity Center terms
      The following terms help you understand the process and conﬁguration behind AWS IAM Identity 
      Center. The documentation for AWS SDK APIs uses diﬀerent names than IAM Identity Center for 
      some of these authentication concepts. It's helpful to know both names.
      The following table shows how alternative names relate to each other.
        IAM Identity Center name      SDK API name                  Description
        Identity Center                                             Although AWS Single Sign-
                                      sso
                                                                    On is renamed, the sso API 
                                                                    namespaces will keep their 
      Refreshing portal access sessions                                                        23
      AWS SDKs and Tools                                                               Reference Guide
        IAM Identity Center name      SDK API name                  Description
                                                                    original name for backward 
                                                                    compatibility purposes. For 
                                                                    more information, see IAM 
                                                                    Identity Center rename in the
                                                                    AWS IAM Identity Center User 
                                                                    Guide.
        IAM Identity Center console                                 The console you use to 
                                                                    conﬁgure single sign-on.
        Administrative console
        AWS access portal URL                                       A URL unique to your IAM 
                                                                    Identity Center account, like
                                                                    https://xxx.awsapps. 
                                                                    com/start . You sign 
                                                                    in to this portal using your 
                                                                    IAM Identity Center sign-in 
                                                                    credentials.
        IAM Identity Center Access    Authentication session        Provides a bearer access 
        Portal session                                              token to the caller.
        Permission set session                                      The IAM session that the SDK 
                                                                    uses internally to make the 
                                                                    AWS service calls. In informal 
                                                                    discussions, you might see 
                                                                    this incorrectly referred to as 
                                                                    "role session."
      Understand IAM Identity Center authentication                                            24
       AWS SDKs and Tools                                                                       Reference Guide
         IAM Identity Center name         SDK API name                     Description
         Permission set credentials       AWS credentials                  The credentials the SDK 
                                                                           actually uses for most AWS 
                                          sigv4 credentials
                                                                           service calls (speciﬁcally, all 
                                                                           sigv4 AWS service calls). In 
                                                                           informal discussions, you 
                                                                           might see this incorrectly 
                                                                           referred to as "role credentia 
                                                                           ls."
         IAM Identity Center credentia    SSO credential provider          How you get the credentials, 
         l provider                                                        such as the class or module 
                                                                           providing the functionality.
       Understand SDK credential resolution for AWS services
       The IAM Identity Center API exchanges bearer token credentials for sigv4 credentials. Most 
       AWS services are sigv4 APIs, with a few exceptions like Amazon CodeWhisperer and Amazon 
       CodeCatalyst. The following describes the credential resolution process for supporting most AWS 
       service calls for your application code through AWS IAM Identity Center.
       Start an AWS access portal session
       • Start the process by signing in to the session with your credentials.
         •
            Use the aws sso login command in the AWS Command Line Interface (AWS CLI). This starts 
            a new IAM Identity Center session if you don't already have an active session.
       • When you start a new session, you receive a refresh token and access token from IAM Identity 
         Center. The AWS CLI also updates an SSO cache JSON ﬁle with a new access token and refresh 
         token and makes it available for use by SDKs.
       • If you already have an active session, the AWS CLI command reuses the existing session and will 
         expire whenever the existing session expires. To learn how to set the length of an IAM Identity 
         Center session, see Conﬁgure the duration of your users' AWS access portal sessions in the AWS 
         IAM Identity Center User Guide.
         • The maximum session length has been extended to 90 days to reduce the need for frequent 
            sign-ins.
       Understand IAM Identity Center authentication                                                     25
     AWS SDKs and Tools                                           Reference Guide
     How the SDK gets credentials for AWS service calls
     SDKs provide access to AWS services when you instantiate a client object per service. When the 
     selected proﬁle of the shared AWS config ﬁle is conﬁgured for IAM Identity Center credential 
     resolution, IAM Identity Center is used to resolve credentials for your application.
     • The credential resolution process is completed during runtime when a client is created.
     To retrieve credentials for sigv4 APIs using IAM Identity Center single sign-on, the SDK uses the 
     IAM Identity Center access token to get an IAM session. This IAM session is called a permission set 
     session, and it provides AWS access to the SDK by assuming an IAM role.
     • The permission set session duration is set independently from the IAM Identity Center session 
       duration.
       • To learn how to set the permission set session duration, see Set session duration in the AWS 
        IAM Identity Center User Guide.
     • Be aware that the permission set credentials are also referred to as AWS credentials and sigv4 
       credentials in most AWS SDK API documentation.
     The permission set credentials are returned from a call to getRoleCredentials of the IAM Identity 
     Center API to the SDK. The SDK's client object uses that assumed IAM role to make calls to the 
     AWS service, such as asking Amazon S3 to list the buckets in your account. The client object can 
     continue to operate using those permission set credentials until the permission set session expires.
     Session expiration and refresh
     When using the SSO token provider conﬁguration, the hourly access token obtained from IAM 
     Identity Center is automatically refreshed using the refresh token.
     • If the access token is expired when the SDK tries to use it, the SDK uses the refresh token to 
       try to get a new access token. The IAM Identity Center compares the refresh token to your IAM 
       Identity Center access portal session duration. If the refresh token is not expired, the IAM Identity 
       Center responds with another access token.
     • This access token can be used to either refresh the permission set session of existing clients, or to 
       resolve credentials for new clients.
     Understand IAM Identity Center authentication                      26
     AWS SDKs and Tools                                           Reference Guide
     However, if the IAM Identity Center access portal session is expired, then no new access token is 
     granted. Therefore, the permission set duration cannot be renewed. It will expire (and access will be 
     lost) whenever the cached permission set session length times out for existing clients.
     Any code that creates a new client will fail authentication as soon as the IAM Identity Center 
     session expires. This is because the permission set credentials are not cached. Your code won't be 
     able to create a new client and complete the credential resolution process until you have a valid 
     access token.
     To recap, when the SDK needs new permission set credentials, the SDK ﬁrst checks for any valid, 
     existing credentials and uses those. This applies whether the credentials are for a new client or for 
     an existing client with expired credentials. If credentials aren't found or they're not valid, then the 
     SDK calls the IAM Identity Center API to get new credentials. To call the API, it needs the access 
     token. If the access token is expired, the SDK uses the refresh token to try to get a new access 
     token from the IAM Identity Center service. This token is granted if your IAM Identity Center access 
     portal session is not expired.
     Using IAM Roles Anywhere to authenticate AWS SDKs and tools
     You can use IAM Roles Anywhere to get temporary security credentials in IAM for workloads such 
     as servers, containers, and applications that run outside of AWS. To use IAM Roles Anywhere, your 
     workloads must use X.509 certiﬁcates. Your Cloud Administrator should provide the certiﬁcate and 
     private key needed to conﬁgure IAM Roles Anywhere as your credential provider.
     Step 1: Conﬁgure IAM Roles Anywhere
     IAM Roles Anywhere provides a way to get temporary credentials for a workload or process that 
     runs outside of AWS. A trust anchor is established with the certiﬁcate authority to get temporary 
     credentials for the associated IAM role. The role sets the permissions your workload will have when 
     your code authenticates with IAM Roles Anywhere.
     For steps to set up the trust anchor, IAM role, and IAM Roles Anywhere proﬁle, see Creating a 
     trust anchor and proﬁle in AWS Identity and Access Management Roles Anywhere in the IAM Roles 
     Anywhere User Guide.
     IAM Roles Anywhere                                                 27
      AWS SDKs and Tools                                                               Reference Guide
           Note
           A proﬁle in the IAM Roles Anywhere User Guide refers to a unique concept within the IAM 
           Roles Anywhere service. It's not related to the proﬁles within the shared AWS config ﬁle.
      Step 2: Use IAM Roles Anywhere
      To get temporary security credentials from IAM Roles Anywhere, use the credential helper tool 
      provided by IAM Roles Anywhere. The credential tool implements the signing process for IAM Roles 
      Anywhere.
      For instructions to download the credential helper tool, see Obtaining temporary security 
      credentials from AWS Identity and Access Management Roles Anywhere in the IAM Roles Anywhere 
      User Guide.
      To use temporary security credentials from IAM Roles Anywhere with AWS SDKs and the AWS CLI, 
      you can conﬁgure credential_process setting in the shared AWS config ﬁle. The SDKs and 
      AWS CLI support a process credential provider that uses credential_process to authenticate. 
      The following shows the general structure to set credential_process.
        credential_process = [path to helper tool] [command] [--parameter1 value] [--
        parameter2 value] [...]   
      The credential-process command of the helper tool returns temporary credentials in a 
      standard JSON format that is compatible with the credential_process setting. Note that the 
      command name contains a hyphen but the setting name contains an underscore. The command 
      requires the following parameters:
      •
        private-key – The path to the private key that signed the request.
      •
        certificate – The path to the certiﬁcate.
      •
        role-arn – The ARN of the role to get temporary credentials for.
      •
        profile-arn – The ARN of the proﬁle that provides a mapping for the speciﬁed role.
      •
        trust-anchor-arn – The ARN of the trust anchor used to authenticate.
      Step 2: Use IAM Roles Anywhere                                                           28
      AWS SDKs and Tools                                                               Reference Guide
      Your Cloud Administrator should provide the certiﬁcate and private key. All three ARN values can 
      be copied from the AWS Management Console. The following example shows a shared config ﬁle 
      that conﬁgures retrieving temporary credentials from the helper tool.
        [profile dev]
        credential_process = ./aws_signing_helper credential-process --certificate /
        path/to/certificate --private-key /path/to/private-key --trust-anchor-
        arn arn:aws:rolesanywhere:region:account:trust-anchor/TA_ID --profile-
        arn arn:aws:rolesanywhere:region:account:profile/PROFILE_ID --role-
        arn arn:aws:iam::account:role/ROLE_ID
      For optional parameters and additional helper tool details, see IAM Roles Anywhere Credential 
      Helper on GitHub.
      For details on the SDK conﬁguration setting itself and the process credential provider, see Process 
      credential provider in this guide.
      Assuming a role with AWS credentials to authenticate AWS 
      SDKs and tools
      Assuming a role involves using a set of temporary security credentials to access AWS resources that 
      you might not have access to otherwise. These temporary credentials consist of an access key ID, a 
      secret access key, and a security token. To learn more about AWS Security Token Service (AWS STS) 
      API requests, see Actions in the AWS Security Token Service API Reference.
      To set up your SDK or tool to assume a role, you must ﬁrst create or identify a speciﬁc role to 
      assume. IAM roles are uniquely identiﬁed by a role Amazon Resource Name (ARN). Roles establish 
      trust relationships with another entity. The trusted entity that uses the role might be an AWS 
      service or another AWS account. To learn more about IAM roles, see Using IAM roles in the IAM User 
      Guide.
      After the IAM role is identiﬁed, if you are trusted by that role, you can conﬁgure your SDK or tool to 
      use the permissions that are granted by the role.
           Note
           It is an AWS best practice to use Regional endpoints whenever possible and to conﬁgure 
           your AWS Region.
      Assume a role                                                                            29
      AWS SDKs and Tools                                                               Reference Guide
      Assume an IAM role
      When assuming a role, AWS STS returns a set of temporary security credentials. These credentials 
      are sourced from another proﬁle or from the instance or container that your code is running in. 
      Most commonly this type of assuming a role is used when you have AWS credentials for one 
      account, but your application needs access to resources in another account.
      Step 1: Set up an IAM role
      To set up your SDK or tool to assume a role, you must ﬁrst create or identify a speciﬁc role to 
      assume. IAM roles are uniquely identiﬁed using a role ARN. Roles establish trust relationships with 
      another entity, typically within your account or for cross-account access. To set this up, see Creating 
      IAM roles in the IAM User Guide.
      Step 2: Conﬁgure the SDK or tool
      Conﬁgure the SDK or tool to source credentials from credential_source or source_profile.
      Use credential_source to source credentials from an Amazon ECS container, an Amazon EC2 
      instance, or from environment variables.
      Use source_profile to source credentials from another proﬁle. source_profile also supports 
      role chaining, which is hierarchies of proﬁles where an assumed role is then used to assume 
      another role.
      When you specify this in a proﬁle, the SDK or tool automatically makes the corresponding AWS 
      STS AssumeRole API call for you. To retrieve and use temporary credentials by assuming a role, 
      specify the following conﬁguration values in the shared AWS config ﬁle. For more details on each 
      of these settings, see the Assume role credential provider settings section.
      •
        role_arn - From the IAM role you created in Step 1
      •
        Conﬁgure either source_profile or credential_source
      •
        (Optional) duration_seconds
      •
        (Optional) external_id
      •
        (Optional) mfa_serial
      •
        (Optional) role_session_name
      Assume an IAM role                                                                       30
      AWS SDKs and Tools                                                               Reference Guide
      The following examples show the conﬁguration of both assume role options in a shared config
      ﬁle:
        role_arn = arn:aws:iam::123456789012:role/my-role-name
        source_profile = profile-name-with-user-that-can-assume-role
        role_arn = arn:aws:iam::123456789012:role/my-role-name
        credential_source = Ec2InstanceMetadata
      For details on all assume role credential provider settings, see Assume role credential provider in 
      this guide.
      Assuming a role with web identity or OpenID Connect to 
      authenticate AWS SDKs and tools
      Assuming a role involves using a set of temporary security credentials to access AWS resources that 
      you might not have access to otherwise. These temporary credentials consist of an access key ID, a 
      secret access key, and a security token. To learn more about AWS Security Token Service (AWS STS) 
      API requests, see Actions in the AWS Security Token Service API Reference.
      To set up your SDK or tool to assume a role, you must ﬁrst create or identify a speciﬁc role to 
      assume. IAM roles are uniquely identiﬁed by a role Amazon Resource Name (ARN). Roles establish 
      trust relationships with another entity. The trusted entity that uses the role might be a web 
      identity provider or OpenID Connect(OIDC), or SAML federation. To learn more about IAM roles, see
      Methods to assume a role in the IAM User Guide.
      After the IAM role is conﬁgured in your SDK, if that role is conﬁgured to trust your identity 
      provider, you can further conﬁgure your SDK to assume that role in order to get temporary AWS 
      credentials.
           Note
           It is an AWS best practice to use Regional endpoints whenever possible and to conﬁgure 
           your AWS Region.
      Assume a role (web)                                                                      31
      AWS SDKs and Tools                                                              Reference Guide
      Federate with web identity or OpenID Connect
      You can use the JSON Web Tokens (JWTs) from public identity providers, such as 
      Login With Amazon, Facebook, Google to get temporary AWS credentials using
      AssumeRoleWithWebIdentity. Depending on how they are used, these JWTs may be called 
      ID tokens or access tokens. You may also use JWTs issued from identity providers (IdPs) that are 
      compatible with OIDC's discovery protocol, such as EntraId or PingFederate.
      If you are using Amazon Elastic Kubernetes Service, this feature provides the ability to specify 
      diﬀerent IAM roles for each one of your service accounts in an Amazon EKS cluster. This Kubernetes 
      feature distributes JWTs to your pods which are then used by this credential provider to obtain 
      temporary AWS credentials. For more information on this Amazon EKS conﬁguration, see IAM roles 
      for service accounts in the Amazon EKS User Guide. However, for a simpler option, we recommend 
      you use Amazon EKS Pod Identities instead if your SDK supports it.
      Step 1: Set up an identity provider and IAM role
      To conﬁgure federation with an external IdP, use an IAM identity provider to inform AWS about 
      the external IdP and its conﬁguration. This establishes trust between your AWS account and the 
      external IdP. Before conﬁguring the SDK to use the JSON Web Token (JWT) for authentication, you 
      must ﬁrst set up the identity provider (IdP) and the IAM role used to access it. To set these up, see
      Creating a role for web identity or OpenID Connect Federation (console) in the IAM User Guide.
      Step 2: Conﬁgure the SDK or tool
      Conﬁgure the SDK or tool to use a JSON Web Token (JWT) from AWS STS for authentication.
      When you specify this in a proﬁle, the SDK or tool automatically makes the corresponding AWS STS
      AssumeRoleWithWebIdentity API call for you. To retrieve and use temporary credentials using 
      web identity federation, specify the following conﬁguration values in the shared AWS config ﬁle. 
      For more details on each of these settings, see the Assume role credential provider settings section.
      •
        role_arn - From the IAM role you created in Step 1
      •
        web_identity_token_file - From the external IdP
      •
        (Optional) duration_seconds
      •
        (Optional) role_session_name
      Federate with web identity or OpenID Connect                                            32
      AWS SDKs and Tools                                                               Reference Guide
      The following is an example of a shared config ﬁle conﬁguration to assume a role with web 
      identity:
        [profile web-identity]
        role_arn=arn:aws:iam::123456789012:role/my-role-name
        web_identity_token_file=/path/to/a/token
           Note
           For mobile applications, consider using Amazon Cognito. Amazon Cognito acts as an 
           identity broker and does much of the federation work for you. However, the Amazon 
           Cognito identity provider isn't included in the SDKs and tools core libraries like other 
           identity providers. To access the Amazon Cognito API, include the Amazon Cognito service 
           client in the build or libraries for your SDK or tool. For usage with AWS SDKs, see Code 
           Examples in the Amazon Cognito Developer Guide.
      For details on all assume role credential provider settings, see Assume role credential provider in 
      this guide.
      Using AWS access keys to authenticate AWS SDKs and tools
      Using AWS access keys is an option for authentication when using AWS SDKs and tools.
      Use short-term credentials
      We recommend conﬁguring your SDK or tool to use Using IAM Identity Center to authenticate AWS 
      SDK and tools to use extended session duration options.
      However, to set up the SDK or tool's temporary credentials directly, see Using short-term 
      credentials to authenticate AWS SDKs and tools.
      AWS access keys                                                                          33
      AWS SDKs and Tools                                                               Reference Guide
      Use long-term credentials
           Warning
           To avoid security risks, don't use IAM users for authentication when developing purpose-
           built software or working with real data. Instead, use federation with an identity provider 
           such as AWS IAM Identity Center.
      Manage access across AWS accounts
      As a security best practice, we recommend using AWS Organizations with IAM Identity Center to 
      manage access across all your AWS accounts. For more information, see Security best practices in 
      IAM in the IAM User Guide.
      You can create users in IAM Identity Center, use Microsoft Active Directory, use a SAML 2.0 identity 
      provider (IdP), or individually federate your IdP to AWS accounts. Using one of these approaches, 
      you can provide a single sign-on experience for your users. You can also enforce multi-factor 
      authentication (MFA) and use temporary credentials for AWS account access. This diﬀers from an 
      IAM user, which is a long-term credential that can be shared and which might increase the security 
      risk to your AWS resources.
      Create IAM users for sandbox environments only
      If you're new to AWS, you might create a test IAM user and then use it to run tutorials and explore 
      what AWS has to oﬀer. It's okay to use this type of credential when you're learning, but we 
      recommend that you avoid using it outside of a sandbox environment.
      For the following use cases, it might make sense to get started with IAM users in AWS:
      • Getting started with your AWS SDK or tool and exploring AWS services in a sandbox 
        environment.
      • Running scheduled scripts, jobs, and other automated processes that don't support a human-
        attended sign-in process as part of your learning.
      If you're using IAM users outside of these use cases, then transition to IAM Identity Center or 
      federate your identity provider to AWS accounts as soon as possible. For more information, see
      Identity federation in AWS.
      Use long-term credentials                                                                34
      AWS SDKs and Tools                                                          Reference Guide
      Secure IAM user access keys
      You should rotate IAM user access keys regularly. Follow the guidance in  Rotating access keys in 
      the IAM User Guide. If you believe that you have accidentally shared your IAM user access keys, then 
      rotate your access keys.
      IAM user access keys should be stored in the shared AWS credentials ﬁle on the local machine. 
      Don't store the IAM user access keys in your code. Don't include conﬁguration ﬁles that contain 
      your IAM user access keys inside of any source code management software. External tools, such 
      as the open source project git-secrets, can help you from inadvertently committing sensitive 
      information to a Git repository. For more information, see IAM Identities (users, user groups, and 
      roles) in the IAM User Guide.
      To set up an IAM user to get started, see  Using long-term credentials to authenticate AWS SDKs 
      and tools.
      Using short-term credentials to authenticate AWS SDKs and tools
      We recommend conﬁguring your AWS SDK or tool to use Using IAM Identity Center to authenticate 
      AWS SDK and tools with extended session duration options. However, you can copy and use 
      temporary credentials that are available in the AWS access portal. New credentials will need to be 
      copied when these expire. You can use the temporary credentials in a proﬁle or use them as values 
      for system properties and environment variables.
      Best practice: Instead of manually managing access keys and a token in the credentials ﬁle, we 
      recommend your application uses temporary credentials delivered from:
      • An AWS compute service, such as running your application on Amazon Elastic Compute Cloud or 
        in AWS Lambda.
      • Another option in the credential provider chain, such as Using IAM Identity Center to 
        authenticate AWS SDK and tools.
      • Or use the Process credential provider to retrieve temporary credentials.
      Set up a credentials ﬁle using short-term credentials retrieved from AWS access portal
      1.  Create a shared credentials ﬁle.
      2.  In the credentials ﬁle, paste the following placeholder text until you paste in working 
          temporary credentials.
      Short-term credentials                                                              35
      AWS SDKs and Tools                                                               Reference Guide
            [default]
            aws_access_key_id=<value from AWS access portal>
            aws_secret_access_key=<value from AWS access portal>
            aws_session_token=<value from AWS access portal>
      3.
          Save the ﬁle. The ﬁle ~/.aws/credentials should now exist on your local development 
          system. This ﬁle contains the [default] proﬁle that the SDK or tool uses if a speciﬁc named 
          proﬁle is not speciﬁed.
      4.  Sign in to the AWS access portal.
      5.  Follow these instructions for Manual credential refresh to copy IAM role credentials from the 
          AWS access portal.
          a.  For step 4 in the linked instructions, choose the IAM role name that grants access for your 
              development needs. This role typically has a name like PowerUserAccess or Developer.
          b.  For step 7 in the linked instructions, select the Manually add a proﬁle to your AWS 
              credentials ﬁle option and copy the contents.
      6.
          Paste the copied credentials into your local credentials ﬁle. The generated proﬁle name is 
          not needed if you are using the default proﬁle. Your ﬁle should resemble the following.
            [default]
            aws_access_key_id=AKIAIOSFODNN7EXAMPLE
            aws_secret_access_key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
            aws_session_token=IQoJb3JpZ2luX2IQoJb3JpZ2luX2IQoJb3JpZ2luX2IQoJb3JpZ2luX2IQoJb3JpZVERYLONGSTRINGEXAMPLE
      7.
          Save the credentials ﬁle.
      When the SDK creates a service client, it will access these temporary credentials and use them for 
      each request. The settings for the IAM role chosen in step 5a determine how long the temporary 
      credentials are valid. The maximum duration is twelve hours.
      After the temporary credentials expire, repeat steps 4 through 7.
      Short-term credentials                                                                   36
      AWS SDKs and Tools                                                     Reference Guide
      Using long-term credentials to authenticate AWS SDKs and tools
          Warning
          To avoid security risks, don't use IAM users for authentication when developing purpose-
          built software or working with real data. Instead, use federation with an identity provider 
          such as AWS IAM Identity Center.
      If you use an IAM user to run your code, then the SDK or tool in your development environment 
      authenticates by using long-term IAM user credentials in the shared AWS credentials ﬁle. 
      Review the Security best practices in IAM topic and transition to IAM Identity Center or other 
      temporary credentials as soon as possible.
      Important warnings and guidance for credentials
      Warnings for credentials
      • Do NOT use your account's root credentials to access AWS resources. These credentials provide 
        unrestricted account access and are diﬃcult to revoke.
      • Do NOT put literal access keys or credential information in your application ﬁles. If you do, you 
        create a risk of accidentally exposing your credentials if, for example, you upload the project to a 
        public repository.
      • Do NOT include ﬁles that contain credentials in your project area.
      •
        Be aware that any credentials stored in the shared AWS credentials ﬁle are stored in 
        plaintext.
      Additional guidance for securely managing credentials
      For a general discussion of how to securely manage AWS credentials, see Best practices for 
      managing AWS access keys in the AWS General Reference. In addition to that discussion, consider 
      the following:
      • Use IAM roles for tasks for Amazon Elastic Container Service (Amazon ECS) tasks.
      • Use IAM roles for applications that are running on Amazon EC2 instances.
      Long-term credentials                                                         37
      AWS SDKs and Tools                                                      Reference Guide
      Prerequisites: Create an AWS account
      To use an IAM user to access AWS services, you need an AWS account and AWS credentials.
      1.  Create an account.
          To create an AWS account, see Getting started: Are you a ﬁrst-time AWS user? in the AWS 
          Account Management Reference Guide.
      2.  Create an administrative user.
          Avoid using your root user account (the initial account you create) to access the management 
          console and services. Instead, create an administrative user account, as explained in Create an 
          administrative user in the IAM User Guide.
          After you create the administrative user account and record the login details, be sure to sign 
          out of your root user account and sign back in using the administrative account.
      Neither of these accounts are appropriate for doing development on AWS or for running 
      applications on AWS. As a best practice, you need to create users, permission sets, or service roles 
      that are appropriate for these tasks. For more information, see Apply least-privilege permissions in 
      the IAM User Guide.
      Step 1: Create your IAM user
      •   Create your IAM user by following the Creating IAM users (console) procedure in the IAM User 
          Guide. When creating your IAM user:
          • We recommend you select Provide user access to the AWS Management Console. This 
           allows you to view AWS services related to the code that you are running in a visual 
           environment, such as checking AWS CloudTrail diagnostic logs or uploading ﬁles to Amazon 
           Simple Storage Service, which is helpful when debugging your code.
          • For Set permissions - Permission options, select Attach policies directly for how you want 
           to assign permissions to this user.
           • Most "Getting Started" SDK tutorials use the Amazon S3 service as an example. To provide 
             your application with full access to Amazon S3, select the AmazonS3FullAccess policy 
             to attach to this user.
          • You can ignore the optional steps of that procedure regarding setting permission boundaries 
           or tags.
      Long-term credentials                                                           38
      AWS SDKs and Tools                                                               Reference Guide
      Step 2: Get your access keys
      1.
          In the navigation pane of the IAM console, select Users and then select the User name of the 
          user that you created previously.
      2.  On the user's page, select the Security credentials page. Then, under Access keys, select
          Create access key.
      3.  For Create access key Step 1, choose either Command Line Interface (CLI) or Local code. 
          Both options generate the same type of key to use with both the AWS CLI and the SDKs.
      4.  For Create access key Step 2, enter an optional tag and select Next.
      5.
          For Create access key Step 3, select Download .csv ﬁle to save a .csv ﬁle with your IAM user's 
          access key and secret access key. You need this information for later.
               Warning
               Use appropriate security measures to keep these credentials safe.
      6.  Select Done.
      Step 3: Update the shared credentials ﬁle
      1.
          Create or open the shared AWS credentials ﬁle. This ﬁle is ~/.aws/credentials on 
          Linux and macOS systems, and %USERPROFILE%\.aws\credentials on Windows. For more 
          information, see Location of Credentials Files.
      2.
          Add the following text to the shared credentials ﬁle. Replace the example ID value and 
          example key value with the values in the .csv ﬁle that you downloaded earlier.
            [default]
            aws_access_key_id = AKIAIOSFODNN7EXAMPLE
            aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
      3.  Save the ﬁle.
      The shared credentials ﬁle is the most common way to store credentials. These can also be 
      set as environment variables, see AWS access keys for environment variable names. This is a way 
      to get you started, but we recommend you transition to IAM Identity Center or other temporary 
      Long-term credentials                                                                    39
      AWS SDKs and Tools                                                              Reference Guide
      credentials as soon as possible. After you transition away from using long-term credentials, 
      remember to delete these credentials from the shared credentials ﬁle.
      Using IAM roles to authenticate applications deployed to 
      Amazon EC2
      This example covers setting up an AWS Identity and Access Management role with Amazon S3 
      access to use in your application deployed to an Amazon Elastic Compute Cloud instance.
      In order to run your AWS SDK application on an Amazon Elastic Compute Cloud instance, create an 
      IAM role, and then give your Amazon EC2 instance access to that role. For more information, see
      IAM Roles for Amazon EC2 in the Amazon EC2 User Guide .
      Create an IAM role
      The AWS SDK application that you develop likely accesses at least one AWS service to perform 
      actions. Create an IAM role that grants the required permissions necessary for your application to 
      run.
      This procedure creates a role that grants read-only access to Amazon S3 as an example. Many of 
      the AWS SDK guides have "getting started" tutorials that read from Amazon S3.
      1.  Sign in to the AWS Management Console and open the IAM console at https:// 
          console.aws.amazon.com/iam/.
      2.  In the navigation pane, select Roles, then select Create role.
      3.  For Select trusted entity, under Trusted entity type, choose AWS service.
      4.  Under Use case, choose Amazon EC2, then select Next.
      5.  For Add permissions, select the checkbox for Amazon S3 Read Only Access from the policy 
          list, then select Next.
      6.  Enter a name for the role, then select Create role. Remember this name because you'll need it 
          when you create your Amazon EC2 instance.
      Launch an Amazon EC2 instance and specify your IAM role
      You can create and launch an Amazon EC2 instance using your IAM role by doing the following:
      IAM roles for EC2 instances                                                             40
      AWS SDKs and Tools                                                             Reference Guide
      • Follow Quickly launch an instance in the Amazon EC2 User Guide. However, prior to the ﬁnal 
        submission step, also do the following:
        • Under Advanced details, for IAM Instance proﬁle, choose the role that you created in the 
          previous step.
      With this IAM and Amazon EC2 setup, you can deploy your application to the Amazon EC2 instance 
      and your application will have read access to the Amazon S3 service.
      Connect to the EC2 instance
      Connect to the Amazon EC2 instance so that you can transfer your application to it and then run 
      the application. You'll need the ﬁle that contains the private portion of the key pair you used under
      Key pair (login) when you created your instance; that is, the PEM ﬁle.
      You can do this by following the guidance for your instance type: Connect to your Linux instance
      or Connect to your Windows instance. When you connect, do so in such a way that you can transfer 
      ﬁles from your development machine to your instance.
           Note
           On Linux or macOS terminal, you can use the secure copy command to copy your 
           application. To use scp with a key pair, you can use the following command:
           scp -i path/to/key file/to/copy ec2-user@ec2-xx-xx-xxx-
           xxx.compute.amazonaws.com:~ .
           For more information for Windows, see Transfer ﬁles to Windows instances.
      If you're using an AWS Toolkit, you can often also connect to the instance by using the Toolkit. For 
      more information, see the speciﬁc user guide for the Toolkit you use.
      Run your application on the EC2 instance
      1.  Copy your application ﬁles from your local drive to your Amazon EC2 instance.
      2.  Start the application and verify that it runs with the same results as on your development 
          machine.
      3.  (Optional) Verify that the application uses the credentials provided by the IAM role.
      Connect to the EC2 instance                                                            41
      AWS SDKs and Tools                                                              Reference Guide
          a.  Sign in to the AWS Management Console and open the Amazon EC2 console at https:// 
              console.aws.amazon.com/ec2/.
          b.  Select the instance.
          c.  Choose Actions, Security, and then choose Modify IAM role.
          d.  For IAM role, detach the IAM role by choosing No IAM Role.
          e.  Choose Update IAM role.
          f.  Run the application again and conﬁrm that it returns an authorization error.
      Using the TIP plugin to access AWS services
      Trusted identity propagation (TIP) is a feature of AWS IAM Identity Center that enables 
      administrators of AWS services to grant permissions based on user attributes such as group 
      associations. With trusted identity propagation, identity context is added to an IAM role to identify 
      the user requesting access to AWS resources. This context is propagated to other AWS services.
      Identity context comprises information that AWS services use to make authorization decisions 
      when they receive access requests. This information includes metadata that identiﬁes the requester 
      (for example, an IAM Identity Center user), the AWS service to which access is requested (for 
      example, Amazon Redshift), and the scope of access (for example, read only access). The receiving 
      AWS service uses this context, and any permissions assigned to the user, to authorize access to its 
      resources. For more information, see in the Trusted identity propagation overview in the AWS IAM 
      Identity Center User Guide.
      The TIP plugin can be used with AWS services that support trusted identity propagation. As a 
      reference use case, see Conﬁguring an Amazon Q Business application using AWS IAM Identity 
      Center in the Amazon Q Business User Guide.
           Note
           If you are using Amazon Q Business, see Conﬁguring an Amazon Q Business application 
           using AWS IAM Identity Center for service-speciﬁc instructions.
      Prerequisites for using the TIP plugin
      The following resources are required in order for the plugin to work:
      Trusted identity propagation                                                            42
      AWS SDKs and Tools                                                               Reference Guide
      1. You must be using either the AWS SDK for Java or the AWS SDK for JavaScript.
      2. Verify that the service you are using supports the trusted identity propagation.
         See the Enables trusted identity propagation through IAM Identity Center column of the AWS 
         managed applications that integrate with IAM Identity Center table in the AWS IAM Identity 
         Center User Guide.
      3. Enable IAM Identity Center and trusted identity propagation.
         See TIP prerequisites and considerations in the AWS IAM Identity Center User Guide.
      4. You must have an Identity-Center-integrated application.
         See AWS managed applications or Customer managed applications in the AWS IAM Identity 
         Center User Guide.
      5. You must set up a trusted token issuer (TTI) and connect your service to IAM Identity Center.
         See Prerequisites for trusted token issuers and Tasks for setting up a trusted token issuer in the
         AWS IAM Identity Center User Guide.
      To use the TIP plugin in your code
      1. Create an instance of the trusted identity propagation plugin.
      2. Create a service client instance for interacting with your AWS service and customize the service 
         client by adding the trusted identity propagation plugin.
      The TIP plugin takes the following input parameters:
      •
        webTokenProvider: A function that the customer implements to obtain an OpenID token from 
        their external identity provider.
      •
        accessRoleArn: The IAM role ARN to be assumed by the plugin with the user's identity context 
        to get the identity-enhanced credentials.
      •
        applicationArn: The unique identiﬁer string for the client or application. This value is an 
        application ARN that has OAuth grants conﬁgured.
      •
        applicationRoleArn: (Optional) The IAM role ARN to be assumed with
        AssumeRoleWithWebIdentity so that the OIDC and AWS STS clients can be bootstrapped 
        without a default credentials provider. If this is not provided, the value of the accessRoleArn
        parameter will be used.
      To use the TIP plugin in your code                                                       43
      AWS SDKs and Tools                                                               Reference Guide
      •
        ssoOidcClient: (Optional) An SSO OIDC client, such as SsoOidcClient for Java or client-
        sso-oidc for Javascript, with customer-deﬁned conﬁgurations. If not provided, an OIDC client 
        using default conﬁgurations is instantiated and used.
      •
        stsClient: (Optional) An AWS STS client with customer-deﬁned conﬁgurations, used to assume
        accessRoleArn with the user's identity context. If not provided, an AWS STS client using 
        default conﬁgurations is instantiated and used.
      Java
         To use the TIP plugin in your AWS SDK for Java project, you need to declare it as a dependency 
         in your project's pom.xml ﬁle.
           <dependency>
           <groupId>software.amazon.awsidentity.trustedIdentityPropagation</groupId>
           <artifactId>aws-sdk-java-trustedIdentityPropagation-java-plugin</artifactId> 
              <version>1.0.0</version>
           </dependency>
         In your source code, include the required package statement for
         software.amazon.awssdk.trustedidentitypropagation.
         The following example code shows how to create an instance of the trusted identity 
         propagation plugin and then add the plugin to a service client instance.
         This example uses an S3Client as the chosen AWS service client to show obtaining IAM 
         Identity Center tokens. However, any other AWS service that supports TIP would be similar.
           StsClient client = StsClient.builder() 
               .region(Region.US_EAST_1) 
               .credentialsProvider(AnonymousCredentialsProvider.create()).build();
           TrustedIdentityPropagationPlugin trustedIdentityPropagationPlugin = 
            TrustedIdentityPropagationPlugin.builder() 
               .stsClient(client) 
               .webTokenProvider(() -> idToken) 
               .applicationArn(idcApplicationArn) 
               .accessRoleArn(accessRoleArn) 
               .ssoOidcClient(SsoOidcClient.builder().region(Region.US_EAST_1).build()) 
               .build();
      To use the TIP plugin in your code                                                       44
      AWS SDKs and Tools                                                               Reference Guide
           S3Client s3Client = 
              
            S3Client.builder().region(Region.US_EAST_1).addPlugin(trustedIdentityPropagationPlugin) 
                   .build();
         For additional details and source, see  trusted-identity-propagation-java on GitHub.
      Javascript
         Run the following command to install the TIP authentication plugin package in your AWS SDK 
         for JavaScript project:
           $  npm i @aws-sdk-extension/trusted-identity-propagation
         The ﬁnal package.json should include a dependency similar to the following:
             "dependencies": {
           "@aws-sdk-extension/trusted-identity-propagation": "^1.0.0" 
             },
         In your source code, import the required TrustedIdentityPropagationExtension
         dependency.
         The following example code shows how to create an instance of the trusted identity 
         propagation plugin and then add the plugin to a service client instance.
         This example uses an S3Client as the chosen AWS service client to show obtaining IAM 
         Identity Center tokens. However, any other AWS service that supports TIP would be similar.
           import { S3Client } from "@aws-sdk/client-s3";
           import { TrustedIdentityPropagationExtension } from "@aws-sdk-extension/trusted-
           identity-propagation";
           // Plugin configurations, please refer to the documentation on each of these fields.
           const applicationRoleArn = 'YOUR_APPLICATION_ROLE_ARN';
           const accessRoleArn = 'YOUR_ACCESS_ROLE_ARN';
           const applicationArn = 'YOUR_APPLICATION_ARN';
           const s3Client = new S3Client({ 
            region, 
            extensions: [ 
             TrustedIdentityPropagationExtension.create({ 
      To use the TIP plugin in your code                                                       45
      AWS SDKs and Tools                                                               Reference Guide
              webTokenProvider: async () => { 
               return 'ID_TOKEN_FROM_YOUR_IDENTITY_PROVIDER'; 
              }, 
              applicationRoleArn, 
              accessRoleArn, 
              applicationArn, 
             }), 
            ],
           });
         For additional details and source, see trusted-identity-propagation-js on GitHub.
      To use the TIP plugin in your code                                                       46
      AWS SDKs and Tools                                                             Reference Guide
      AWS SDKs and tools settings reference
      SDKs provide language-speciﬁc APIs for AWS services. They take care of some of the heavy lifting 
      necessary in successfully making API calls, including authentication, retry behavior, and more. To 
      do this, the SDKs have ﬂexible strategies to obtain credentials to use for your requests, to maintain 
      settings to use with each service, and to obtain values to use for global settings.
      You can ﬁnd detailed information about conﬁguration settings in the following sections:
      • AWS SDKs and Tools standardized credential providers – Common credential providers 
        standardized across multiple SDKs.
      • AWS SDKs and Tools standardized features – Common features standardized across multiple 
        SDKs.
      Creating service clients
      To programmatically access AWS services, SDKs use a client class/object for each AWS service. For 
      example, if your application needs to access Amazon EC2, your application creates an Amazon EC2 
      client object to interface with that service. You then use the service client to make requests to that 
      AWS service. In most SDKs, a service client object is immutable, so you must create a new client 
      for each service to which you make requests and for making requests to the same service using a 
      diﬀerent conﬁguration.
      Precedence of settings
      Global settings conﬁgure features, credential providers, and other functionality that are supported 
      by most SDKs and have a broad impact across AWS services. All SDKs have a series of places (or 
      sources) that they check in order to ﬁnd a value for global settings. The following is the setting 
      lookup precedence:
      1. Any explicit setting set in the code or on a service client itself takes precedence over anything 
         else.
         • Some settings can be set on a per-operation basis, and can be changed as needed for each 
           operation that you invoke. For the AWS CLI or AWS Tools for PowerShell, these take the 
           form of per-operation parameters that you enter on the command line. For an SDK, explicit 
      Creating service clients                                                               47
      AWS SDKs and Tools                                                               Reference Guide
           assignments can take the form of a parameter that you set when you instantiate an AWS 
           service client or conﬁguration object, or sometimes when you call an individual API.
      2. Java/Kotlin only: The JVM system property for the setting is checked. If it's set, that value is used 
         to conﬁgure the client.
      3. The environment variable is checked. If it's set, that value is used to conﬁgure the client.
      4.
         The SDK checks the shared credentials ﬁle for the setting. If it's set, the client uses it.
      5.
         The shared config ﬁle for the setting. If the setting is present, the SDK uses it.
         •
           The AWS_PROFILE environment variable or the aws.profile JVM system property can be 
           used to specify which proﬁle that the SDK loads.
      6. Any default value provided by the SDK source code itself is used last.
           Note
           Some SDKs and tools might check in a diﬀerent order. Also, some SDKs and tools support 
           other methods of storing and retrieving parameters. For example, the AWS SDK for .NET 
           supports an additional source called the SDK Store. For more information about providers 
           that are unique to a SDK or tool, see the speciﬁc guide for the SDK or tool that you are 
           using.
      The order determines which methods take precedence and override others. For example, if you set 
      up a proﬁle in the shared config ﬁle, it's only found and used after the SDK or tool checks the 
      other places ﬁrst. This means that if you put a setting in the credentials ﬁle, it is used instead 
      of one found in the config ﬁle. If you conﬁgure an environment variable with a setting and value, 
      it would override that setting in both the credentials and config ﬁles. And ﬁnally, a setting 
      on the individual operation (AWS CLI command-line parameter or API parameter) or in code would 
      override all other values for that one command.
      Understanding the settings pages of this guide
      The pages within the Settings reference section of this guide detail the available settings that 
      can be set through various mechanisms. The tables that follow list the conﬁg and credential 
      ﬁle settings, environment variables, and (for Java and Kotlin SDKs) the JVM settings that can be 
      used outside of your code to conﬁgure the feature. Each linked topic in each list takes you to the 
      corresponding settings page.
      Understanding the settings pages of this guide                                           48
      AWS SDKs and Tools                                                              Reference Guide
      •
        Config ﬁle settings list
      •
        Credentials ﬁle settings list
      • Environment variables list
      • JVM system properties list
      Each credential provider or feature has a page where the settings that are used to conﬁgure that 
      functionality are listed. For each setting, you can often set the value either by adding the setting to 
      a conﬁguration ﬁle, or by setting an environment variable, or (for Java and Kotlin only) by setting a 
      JVM system property. Each setting lists all supported methods of setting the value in a block above 
      the details of the description. Although the precedence varies, the resulting functionality is the 
      same regardless of how you set it.
      The description will include the default value, if any, that takes eﬀect if you do nothing. It also 
      deﬁnes what a valid value is for that setting.
      For example, let's look at a setting from the Request compression feature page.
      The disable_request_compression example setting's information documents the following:
      • There are three equivalent ways to control request compression outside of your codebase. You 
        can either:
        •
          Set it in your conﬁg ﬁle using disable_request_compression
        •
          Set it as an environment variable using AWS_DISABLE_REQUEST_COMPRESSION
        • Or, if you are using the Java or Kotlin SDK, set it as a JVM system property using
          aws.disableRequestCompression
             Note
             There might also be a way to conﬁgure the same functionality directly in your code, but 
             this Reference does not cover this since it is unique to each SDK. If you want to set your 
             conﬁguration in the code itself, see your speciﬁc SDK guide or API reference.
      •
        If you do nothing, the value will default to false.
      •
        The only valid values for this Boolean setting are true and false.
      At the bottom of each feature page there is a Support by AWS SDKs and tools table.
      Understanding the settings pages of this guide                                          49
     AWS SDKs and Tools                                                 Reference Guide
     This table shows whether your SDK supports the settings that are listed on the page. The
     Supported column indicates the support level with the following values:
     •
       Yes – The settings are fully supported by the SDK as written.
     •
       Partial – Some of the settings are supported or the behavior deviates from the description. For
       Partial, an additional note indicates the deviation.
     •
       No – None of the settings are supported. This doesn't make claims as to whether the same 
       functionality might be achieved in code; it only indicates that the listed external conﬁguration 
       settings are not supported.
     Config ﬁle settings list
     The settings listed in the following table can be assigned in the shared AWS config ﬁle. They 
     are global and aﬀect all AWS services. SDKs and tools may also support unique settings and 
     environment variables. To see the settings and environment variables supported by only an 
     individual SDK or tool, see that speciﬁc SDK or tool guide.
       Setting name      Details
                         Account-based endpoints
       account_i 
       d_endpoin 
       t_mode
                         General conﬁguration settings
       api_versions
                         AWS access keys
       aws_acces 
       s_key_id
                         Account-based endpoints
       aws_account_id
                         AWS access keys
       aws_secre 
       t_access_key
                         AWS access keys
       aws_sessi 
       on_token
                         General conﬁguration settings
       ca_bundle
                                                                               50
     Config ﬁle settings list
      AWS SDKs and Tools                                                               Reference Guide
        Setting name          Details
                              Process credential provider
        credentia 
        l_process
                              Assume role credential provider
        credentia 
        l_source
                              Smart conﬁguration defaults
        defaults_mode
                              Host preﬁx injection
        disable_h 
        ost_prefi 
        x_injection
                              Request compression
        disable_r 
        equest_co 
        mpression
                              Assume role credential provider
        duration_ 
        seconds
                              IMDS credential provider
        ec2_metad 
        ata_servi 
        ce_endpoint
                              IMDS credential provider
        ec2_metad 
        ata_servi 
        ce_endpoi 
        nt_mode
                              IMDS credential provider
        ec2_metad 
        ata_v1_di 
        sabled
                              Endpoint discovery
        endpoint_ 
        discovery 
        _enabled
                              Service-speciﬁc endpoints
        endpoint_url
                                                                                               51
      Config ﬁle settings list
      AWS SDKs and Tools                                                               Reference Guide
        Setting name          Details
                              Assume role credential provider
        external_id
                              Service-speciﬁc endpoints
        ignore_co 
        nfigured_ 
        endpoint_urls
                              Retry behavior
        max_attempts
                              Amazon EC2 instance metadata
        metadata_ 
        service_n 
        um_attempts
                              Amazon EC2 instance metadata
        metadata_ 
        service_t 
        imeout
                              Assume role credential provider
        mfa_serial
                              General conﬁguration settings
        output
                              General conﬁguration settings
        parameter 
        _validation
                              AWS Region
        region
                              Data Integrity Protections for Amazon S3
        request_c 
        hecksum_c 
        alculation
                              Request compression
        request_m 
        in_compre 
        ssion_siz 
        e_bytes
                              Data Integrity Protections for Amazon S3
        response_ 
        checksum_ 
        validation
                                                                                               52
      Config ﬁle settings list
      AWS SDKs and Tools                                                               Reference Guide
        Setting name          Details
                              Retry behavior
        retry_mode
                              Assume role credential provider
        role_arn
                              Assume role credential provider
        role_sess 
        ion_name
                              Amazon S3 Multi-Region Access Points
        s3_disabl 
        e_multire 
        gion_acce 
        ss_points
                              Amazon S3 access points
        s3_use_ar 
        n_region
                              Application ID
        sdk_ua_app_id
                              Assume role credential provider
        source_profile
                              IAM Identity Center credential provider
        sso_account_id
                              IAM Identity Center credential provider
        sso_region
                              IAM Identity Center credential provider
        sso_regis 
        tration_scopes
                              IAM Identity Center credential provider
        sso_role_name
                              IAM Identity Center credential provider
        sso_start_url
                              AWS STS Regional endpoints
        sts_regio 
        nal_endpoints
                              Dual-stack and FIPS endpoints
        use_duals 
        tack_endpoint
                              Dual-stack and FIPS endpoints
        use_fips_ 
        endpoint
                                                                                               53
      Config ﬁle settings list
     AWS SDKs and Tools                                                 Reference Guide
       Setting name      Details
                         Assume role credential provider
       web_ident 
       ity_token_file
     Credentials ﬁle settings list
     The settings listed in the following table can be assigned in the shared AWS credentials ﬁle. 
     They are global and aﬀect all AWS services. SDKs and tools may also support unique settings 
     and environment variables. To see the settings and environment variables supported by only an 
     individual SDK or tool, see that speciﬁc SDK or tool guide.
       Setting name      Details
                         AWS access keys
       aws_acces 
       s_key_id
                         AWS access keys
       aws_secre 
       t_access_key
                         AWS access keys
       aws_sessi 
       on_token
     Environment variables list
     Environment variables supported by most SDKs are listed in the following table. They are global 
     and aﬀect all AWS services. SDKs and tools may also support unique settings and environment 
     variables. To see the settings and environment variables supported by only an individual SDK or 
     tool, see that speciﬁc SDK or tool guide.
       Setting name      Details
                         AWS access keys
       AWS_ACCES 
       S_KEY_ID
                         Account-based endpoints
       AWS_ACCOUNT_ID
                                                                               54
     Credentials ﬁle settings list
      AWS SDKs and Tools                                                              Reference Guide
        Setting name          Details
                              Account-based endpoints
        AWS_ACCOU 
        NT_ID_END 
        POINT_MODE
                              General conﬁguration settings
        AWS_CA_BUNDLE
                              Finding and changing the location of the 
        AWS_CONFIG_FILE
                              shared config and credentials  ﬁles of 
                              AWS SDKs and tools
                              Container credential provider
        AWS_CONTA 
        INER_AUTH 
        ORIZATION 
        _TOKEN
                              Container credential provider
        AWS_CONTA 
        INER_AUTH 
        ORIZATION 
        _TOKEN_FILE
                              Container credential provider
        AWS_CONTA 
        INER_CRED 
        ENTIALS_F 
        ULL_URI
                              Container credential provider
        AWS_CONTA 
        INER_CRED 
        ENTIALS_R 
        ELATIVE_URI
                              Smart conﬁguration defaults
        AWS_DEFAU 
        LTS_MODE
      Environment variables list                                                              55
      AWS SDKs and Tools                                                               Reference Guide
        Setting name          Details
                              Host preﬁx injection
        AWS_DISAB 
        LE_HOST_P 
        REFIX_INJ 
        ECTION
                              Request compression
        AWS_DISAB 
        LE_REQUES 
        T_COMPRESSION
                              IMDS credential provider
        AWS_EC2_M 
        ETADATA_D 
        ISABLED
                              IMDS credential provider
        AWS_EC2_M 
        ETADATA_S 
        ERVICE_EN 
        DPOINT
                              IMDS credential provider
        AWS_EC2_M 
        ETADATA_S 
        ERVICE_EN 
        DPOINT_MODE
                              IMDS credential provider
        AWS_EC2_M 
        ETADATA_V 
        1_DISABLED
                              Endpoint discovery
        AWS_ENABL 
        E_ENDPOIN 
        T_DISCOVERY
                              Service-speciﬁc endpoints
        AWS_ENDPO 
        INT_URL
      Environment variables list                                                               56
      AWS SDKs and Tools                                                               Reference Guide
        Setting name          Details
                              Service-speciﬁc endpoints
        AWS_ENDPO 
        INT_URL_< 
        SERVICE>
                              Service-speciﬁc endpoints
        AWS_IGNOR 
        E_CONFIGU 
        RED_ENDPO 
        INT_URLS
                              Retry behavior
        AWS_MAX_A 
        TTEMPTS
                              Amazon EC2 instance metadata
        AWS_METAD 
        ATA_SERVI 
        CE_NUM_AT 
        TEMPTS
                              Amazon EC2 instance metadata
        AWS_METAD 
        ATA_SERVI 
        CE_TIMEOUT
        AWS_PROFILE           Using shared config and credentials
                              ﬁles to globally conﬁgure AWS SDKs and tools
                              AWS Region
        AWS_REGION
                              Data Integrity Protections for Amazon S3
        AWS_REQUE 
        ST_CHECKS 
        UM_CALCULATION
                              Request compression
        AWS_REQUE 
        ST_MIN_CO 
        MPRESSION 
        _SIZE_BYTES
      Environment variables list                                                               57
      AWS SDKs and Tools                                                               Reference Guide
        Setting name          Details
                              Data Integrity Protections for Amazon S3
        AWS_RESPO 
        NSE_CHECK 
        SUM_VALIDATION
                              Retry behavior
        AWS_RETRY_MODE
                              Assume role credential provider
        AWS_ROLE_ARN
                              Assume role credential provider
        AWS_ROLE_ 
        SESSION_NAME
                              Amazon S3 Multi-Region Access Points
        AWS_S3_DI 
        SABLE_MUL 
        TIREGION_ 
        ACCESS_POINTS
                              Amazon S3 access points
        AWS_S3_US 
        E_ARN_REGION
                              Application ID
        AWS_SDK_U 
        A_APP_ID
                              AWS access keys
        AWS_SECRE 
        T_ACCESS_KEY
                              AWS access keys
        AWS_SESSI 
        ON_TOKEN
                              Finding and changing the location of the 
        AWS_SHARE 
                              shared config and credentials  ﬁles of 
        D_CREDENT 
                              AWS SDKs and tools
        IALS_FILE
                              AWS STS Regional endpoints
        AWS_STS_R 
        EGIONAL_E 
        NDPOINTS
      Environment variables list                                                               58
      AWS SDKs and Tools                                                              Reference Guide
        Setting name          Details
                              Dual-stack and FIPS endpoints
        AWS_USE_D 
        UALSTACK_ 
        ENDPOINT
                              Dual-stack and FIPS endpoints
        AWS_USE_F 
        IPS_ENDPOINT
                              Assume role credential provider
        AWS_WEB_I 
        DENTITY_T 
        OKEN_FILE
      JVM system properties list
      You can use the following JVM system properties for the AWS SDK for Java and the AWS SDK 
      for Kotlin (targeting the JVM). See the section called “How to set JVM system properties” for 
      instructions on how to set JVM system properties.
        Setting name          Details
                              AWS access keys
        aws.accessKeyId
                              Account-based endpoints
        aws.accountId
                              Account-based endpoints
        aws.accou 
        ntIdEndpo 
        intMode
                              Finding and changing the location of the 
        aws.configFile
                              shared config and credentials  ﬁles of 
                              AWS SDKs and tools
                              Smart conﬁguration defaults
        aws.defau 
        ltsMode
      JVM system properties list                                                              59
      AWS SDKs and Tools                                                               Reference Guide
        Setting name          Details
                              IMDS credential provider
        aws.disab 
        leEc2Meta 
        dataV1
                              Host preﬁx injection
        aws.disab 
        leHostPre 
        fixInjection
                              Request compression
        aws.disab 
        leRequest 
        Compression
                              IMDS credential provider
        aws.ec2Me 
        tadataSer 
        viceEndpoint
                              IMDS credential provider
        aws.ec2Me 
        tadataSer 
        viceEndpo 
        intMode
                              Endpoint discovery
        aws.endpo 
        intDiscov 
        eryEnabled
                              Service-speciﬁc endpoints
        aws.endpointUrl
                              Service-speciﬁc endpoints
        aws.endpo 
        intUrl<Se 
        rviceName>
                              Service-speciﬁc endpoints
        aws.ignor 
        eConfigur 
        edEndpointUrls
                              Retry behavior
        aws.maxAttempts
      JVM system properties list                                                               60
      AWS SDKs and Tools                                                               Reference Guide
        Setting name          Details
        aws.profile           Using shared config and credentials
                              ﬁles to globally conﬁgure AWS SDKs and tools
                              AWS Region
        aws.region
                              Data Integrity Protections for Amazon S3
        aws.reque 
        stChecksu 
        mCalculation
                              Request compression
        aws.reque 
        stMinComp 
        ressionSi 
        zeBytes
                              Data Integrity Protections for Amazon S3
        aws.respo 
        nseChecks 
        umValidation
                              Retry behavior
        aws.retryMode
                              Assume role credential provider
        aws.roleArn
                              Assume role credential provider
        aws.roleS 
        essionName
                              Amazon S3 Multi-Region Access Points
        aws.s3Dis 
        ableMulti 
        RegionAcc 
        essPoints
                              Amazon S3 access points
        aws.s3Use 
        ArnRegion
                              AWS access keys
        aws.secre 
        tAccessKey
      JVM system properties list                                                               61
      AWS SDKs and Tools                                                              Reference Guide
        Setting name          Details
                              AWS access keys
        aws.sessi 
        onToken
                              Finding and changing the location of the 
        aws.share 
                              shared config and credentials  ﬁles of 
        dCredenti 
                              AWS SDKs and tools
        alsFile
                              Dual-stack and FIPS endpoints
        aws.useDu 
        alstackEn 
        dpoint
                              Dual-stack and FIPS endpoints
        aws.useFi 
        psEndpoint
                              Application ID
        aws.userA 
        gentAppId
                              Assume role credential provider
        aws.webId 
        entityTok 
        enFile
      AWS SDKs and Tools standardized credential providers
      Many credential providers have been standardized to consistent defaults and to work the same way 
      across many SDKs. This consistency increases productivity and clarity when coding across multiple 
      SDKs. All settings can be overridden in code. For details, see your speciﬁc SDK API.
           Important
           Not all SDKs support all providers, or even all aspects within a provider.
      Topics
      • Understand the credential provider chain
      • SDK-speciﬁc and tool-speciﬁc credential provider chains
      Standardized credential providers                                                       62
       AWS SDKs and Tools                                                                         Reference Guide
       • AWS access keys
       • Assume role credential provider
       • Container credential provider
       • IAM Identity Center credential provider
       • IMDS credential provider
       • Process credential provider
       Understand the credential provider chain
       All SDKs have a series of places (or sources) that they check in order to ﬁnd valid credentials to use 
       to make a request to an AWS service. After valid credentials are found, the search is stopped. This 
       systematic search is called the credential provider chain.
       When using one of the standardized credential providers, the AWS SDKs always attempt to renew 
       credentials automatically when they expire. The built-in credential provider chain provides your 
       application with the ability to refresh your credentials regardless of which provider you are using in 
       the chain. No additional code is required for the SDK to do this.
       Although the distinct chain used by each SDK varies, they most often include sources such as the 
       following:
         Credential provider                     Description
         AWS access keys
                                                 AWS access keys for an IAM user (such as AWS_ACCES 
                                                 S_KEY_ID , and AWS_SECRET_ACCESS_KEY             ).
         Federate with web identity or           Sign in using a well-known external identity provider 
         OpenID Connect - Assume role            (IdP), such as Login with Amazon, Facebook, Google, 
         credential provider                     or any other OpenID Connect (OIDC)-compatible IdP. 
                                                 Assume the permissions of an IAM role using a JSON 
                                                 Web Token (JWT) from AWS Security Token Service 
                                                 (AWS STS).
         IAM Identity Center credential          Get credentials from AWS IAM Identity Center.
         provider
       Understand the credential provider chain                                                            63
       AWS SDKs and Tools                                                                     Reference Guide
        Credential provider                     Description
        Assume role credential provider         Get access to other resources by assuming the permissio 
                                                ns of an IAM role. (Retrieve and then use temporary 
                                                credentials for a role).
        Container credential provider           Amazon Elastic Container Service (Amazon ECS) and 
                                                Amazon Elastic Kubernetes Service (Amazon EKS) 
                                                credentials. The container credential provider fetches 
                                                credentials for the customer's containerized application.
        Process credential provider             Custom credential provider. Get your credentials from 
                                                an external source or process, including IAM Roles 
                                                Anywhere.
        IMDS credential provider                Amazon Elastic Compute Cloud (Amazon EC2) instance 
                                                proﬁle credentials. Associate an IAM role with each of 
                                                your EC2 instances. Temporary credentials for that role 
                                                are made available to code running in the instance. 
                                                The credentials are delivered through the Amazon EC2 
                                                metadata service.
       For each step in the chain, there are multiple ways to assign setting values. Setting values that are 
       speciﬁed in code always take precedence. However, there are also Environment variables and the
       Using shared config and credentials ﬁles to globally conﬁgure AWS SDKs and tools. For more 
       information, see Precedence of settings.
       SDK-speciﬁc and tool-speciﬁc credential provider chains
       To go directly to your SDK's or tool's speciﬁc credential provider chain details, choose your SDK or 
       tool from the following:
       • AWS CLI
       • SDK for C++
       • SDK for Go
       • SDK for Java
       • SDK for JavaScript
       SDK-speciﬁc and tool-speciﬁc credential provider chains                                         64
      AWS SDKs and Tools                                                               Reference Guide
      • SDK for Kotlin
      • SDK for .NET
      • SDK for PHP
      • SDK for Python (Boto3)
      • SDK for Ruby
      • SDK for Rust
      • SDK for Swift
      • Tools for PowerShell
      AWS access keys
           Warning
           To avoid security risks, don't use IAM users for authentication when developing purpose-
           built software or working with real data. Instead, use federation with an identity provider 
           such as AWS IAM Identity Center.
      AWS access keys for an IAM user can be used as your AWS credentials. The AWS SDK automatically 
      uses these AWS credentials to sign API requests to AWS, so that your workloads can access 
      your AWS resources and data securely and conveniently. It is recommended to always use the
      aws_session_token so that the credentials are temporary and no longer valid after they expire. 
      Using long-term credentials is not recommended.
           Note
           If AWS becomes unable to refresh these temporary credentials, AWS may extend the 
           validity of the credentials so that your workloads are not impacted.
      The shared AWS credentials ﬁle is the recommended location for storing credentials 
      information because it is safely outside of application source directories and separate from the 
      SDK-speciﬁc settings of the shared config ﬁle.
      To learn more about AWS credentials and using access keys, see AWS security credentials and
      Managing access keys for IAM users in the IAM User Guide.
      AWS access keys                                                                          65
      AWS SDKs and Tools                                                               Reference Guide
      Conﬁgure this functionality by using the following:
      aws_access_key_id - shared AWS config ﬁle setting, aws_access_key_id - shared AWS
      credentials ﬁle setting (recommended method), AWS_ACCESS_KEY_ID - environment 
      variable, aws.accessKeyId - JVM system property: Java/Kotlin only
         Speciﬁes the AWS access key used as part of the credentials to authenticate the user.
      aws_secret_access_key - shared AWS config ﬁle setting, aws_secret_access_key - 
      shared AWS credentials ﬁle setting (recommended method), AWS_SECRET_ACCESS_KEY - 
      environment variable, aws.secretAccessKey - JVM system property: Java/Kotlin only
         Speciﬁes the AWS secret key used as part of the credentials to authenticate the user.
      aws_session_token - shared AWS config ﬁle setting, aws_session_token - shared AWS
      credentials ﬁle setting (recommended method), AWS_SESSION_TOKEN - environment 
      variable, aws.sessionToken - JVM system property: Java/Kotlin only
         Speciﬁes an AWS session token used as part of the credentials to authenticate the user. You 
         receive this value as part of the temporary credentials returned by successful requests to 
         assume a role. A session token is required only if you manually specify temporary security 
         credentials. However, we recommend you always use temporary security credentials instead of 
         long-term credentials. For security recommendations, see Security best practices in IAM.
      For instructions on how to obtain these values, see Using short-term credentials to authenticate 
      AWS SDKs and tools.
      Example of setting these required values in the config or credentials ﬁle:
        [default]
        aws_access_key_id = AKIAIOSFODNN7EXAMPLE
        aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
        aws_session_token = AQoEXAMPLEH4aoAH0gNCAPy...truncated...zrkuWJOgQs8IZZaIv2BXIa2R4Olgk
      Linux/macOS example of setting environment variables via command line:
        export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
        export AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
        export 
         AWS_SESSION_TOKEN=AQoEXAMPLEH4aoAH0gNCAPy...truncated...zrkuWJOgQs8IZZaIv2BXIa2R4Olgk
      AWS access keys                                                                          66
      AWS SDKs and Tools                                                               Reference Guide
      Windows example of setting environment variables via command line:
        setx AWS_ACCESS_KEY_ID AKIAIOSFODNN7EXAMPLE
        setx AWS_SECRET_ACCESS_KEY wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
        setx 
         AWS_SESSION_TOKEN AQoEXAMPLEH4aoAH0gNCAPy...truncated...zrkuWJOgQs8IZZaIv2BXIa2R4Olgk
      Support by AWS SDKs and tools
      The following SDKs support the features and settings described in this topic. Any partial exceptions 
      are noted. Any JVM system property settings are supported by the AWS SDK for Java and the AWS 
      SDK for Kotlin only.
        SDK                          SupNotes or more informationported
        AWS CLI v2                 Yes  
        SDK for C++                Yes
                                        shared config ﬁle not supported.
        SDK for Go V2 (1.x)        Yes  
        SDK for Go 1.x (V1)        Yes
                                        To use shared config ﬁle settings, you must turn on loading 
                                        from the conﬁg ﬁle; see Sessions.
        SDK for Java 2.x           Yes  
        SDK for Java 1.x           Yes  
        SDK for JavaScript 3.x     Yes  
        SDK for JavaScript 2.x     Yes  
        SDK for Kotlin             Yes  
        SDK for .NET 4.x           Yes  
        SDK for .NET 3.x           Yes  
        SDK for PHP 3.x            Yes  
        SDK for Python (Boto3)     Yes  
      AWS access keys                                                                          67
       AWS SDKs and Tools                                                                    Reference Guide
        SDK                            SupNotes or more informationported
        SDK for Ruby 3.x              Yes  
        SDK for Rust                  Yes  
        SDK for Swift                 Yes  
        Tools for PowerShell V5       Yes  
        Tools for PowerShell V4       Yes Environment variables not supported.
       Assume role credential provider
            Note
            For help in understanding the layout of settings pages, or in interpreting the Support by 
            AWS SDKs and tools table that follows, see Understanding the settings pages of this guide.
       Assuming a role involves using a set of temporary security credentials to access AWS resources that 
       you might not have access to otherwise. These temporary credentials consist of an access key ID, a 
       secret access key, and a security token.
       To set up your SDK or tool to assume a role, you must ﬁrst create or identify a speciﬁc role to 
       assume. IAM roles are uniquely identiﬁed by a role Amazon Resource Name (ARN). Roles establish 
       trust relationships with another entity. The trusted entity that uses the role might be an AWS 
       service, another AWS account, a web identity provider or OIDC, or SAML federation.
       After the IAM role is identiﬁed, if you are trusted by that role, you can conﬁgure your SDK or tool to 
       use the permissions that are granted by the role. To do this, use the following settings.
       For guidance on getting started using these settings, see Assuming a role with AWS credentials to 
       authenticate AWS SDKs and tools in this guide.
       Assume role credential provider settings
       Conﬁgure this functionality by using the following:
       Assume role provider                                                                          68
      AWS SDKs and Tools                                                               Reference Guide
      credential_source - shared AWS config ﬁle setting
         Used within Amazon EC2 instances or Amazon Elastic Container Service containers to specify 
         where the SDK or tool can ﬁnd credentials that have permission to assume the role that you 
         specify with the role_arn parameter.
         Default value: None
         Valid values:
         • Environment – Speciﬁes that the SDK or tool is to retrieve source credentials from the 
           environment variables AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.
         • Ec2InstanceMetadata – Speciﬁes that the SDK or tool is to use the IAM role attached to the 
           EC2 instance proﬁle to get source credentials.
         • EcsContainer – Speciﬁes that the SDK or tool is to use the IAM role attached to the ECS 
           container to get source credentials.
         You cannot specify both credential_source and source_profile in the same proﬁle.
         Example of setting this in a config ﬁle to indicate that credentials should be sourced from 
         Amazon EC2:
           credential_source = Ec2InstanceMetadata
           role_arn = arn:aws:iam::123456789012:role/my-role-name
      duration_seconds - shared AWS config ﬁle setting
         Speciﬁes the maximum duration of the role session, in seconds.
         This setting applies only when the proﬁle speciﬁes to assume a role.
         Default value: 3600 seconds (one hour)
         Valid values: The value can range from 900 seconds (15 minutes) up to the maximum session 
         duration setting conﬁgured for the role (which can be a maximum of 43200 seconds, or 12 
         hours). For more information, see View the Maximum Session Duration Setting for a Role in the
         IAM User Guide.
         Example of setting this in a config ﬁle:
           duration_seconds = 43200
      Assume role provider                                                                     69
      AWS SDKs and Tools                                                               Reference Guide
      external_id - shared AWS config ﬁle setting
         Speciﬁes a unique identiﬁer that is used by third parties to assume a role in their customers' 
         accounts.
         This setting applies only when the proﬁle speciﬁes to assume a role and the trust policy for the 
         role requires a value for ExternalId. The value maps to the ExternalId parameter that is 
         passed to the AssumeRole operation when the proﬁle speciﬁes a role.
         Default value: None.
         Valid values: See How to use an External ID When Granting Access to Your AWS Resources to a 
         Third Party in the IAM User Guide.
         Example of setting this in a config ﬁle:
           external_id = unique_value_assigned_by_3rd_party
      mfa_serial - shared AWS config ﬁle setting
         Speciﬁes the identiﬁcation or serial number of a multi-factor authentication (MFA) device that 
         the user must use when assuming a role.
         Required when assuming a role where the trust policy for that role includes a condition 
         that requires MFA authentication. For more information about MFA, see AWS Multi-factor 
         authentication in IAM in the IAM User Guide.
         Default value: None.
         Valid values: The value can be either a serial number for a hardware device (such as
         GAHT12345678), or an Amazon Resource Name (ARN) for a virtual MFA device. The format of 
         the ARN is: arn:aws:iam::account-id:mfa/mfa-device-name
         Example of setting this in a config ﬁle:
         This example assumes a virtual MFA device, called MyMFADevice, that has been created for the 
         account and enabled for a user.
           mfa_serial = arn:aws:iam::123456789012:mfa/MyMFADevice
      Assume role provider                                                                     70
      AWS SDKs and Tools                                                               Reference Guide
      role_arn - shared AWS config ﬁle setting, AWS_ROLE_ARN - environment variable,
      aws.roleArn - JVM system property: Java/Kotlin only
         Speciﬁes the Amazon Resource Name (ARN) of an IAM role that you want to use to perform 
         operations requested using this proﬁle.
         Default value: None.
         Valid values: The value must be the ARN of an IAM role, formatted as follows:
         arn:aws:iam::account-id:role/role-name
         In addition, you must also specify one of the following settings:
         •
           source_profile – To identify another proﬁle to use to ﬁnd credentials that have 
           permission to assume the role in this proﬁle.
         •
           credential_source – To use either credentials identiﬁed by the current environment 
           variables or credentials attached to an Amazon EC2 instance proﬁle, or an Amazon ECS 
           container instance.
         •
           web_identity_token_file – To use public identity providers or any OpenID Connect 
           (OIDC)-compatible identity provider for users who have been authenticated in a mobile or 
           web application.
      role_session_name - shared AWS config ﬁle setting, AWS_ROLE_SESSION_NAME - 
      environment variable, aws.roleSessionName - JVM system property: Java/Kotlin only
         Speciﬁes the name to attach to the role session. This name appears in AWS CloudTrail logs 
         for entries associated with this session, which can be useful when auditing. For details, see
         CloudTrail userIdentity element in the AWS CloudTrail User Guide.
         Default value: An optional parameter. If you don't provide this value, a session name is 
         generated automatically if the proﬁle assumes a role.
         Valid values: Provided to the RoleSessionName parameter when the AWS CLI or AWS API 
         calls the AssumeRole operation (or operations such as the AssumeRoleWithWebIdentity
         operation) on your behalf. The value becomes part of the assumed role user Amazon Resource 
         Name (ARN) that you can query, and shows up as part of the CloudTrail log entries for 
         operations invoked by this proﬁle.
         arn:aws:sts::123456789012:assumed-role/my-role-name/my-role_session_name.
         Example of setting this in a config ﬁle:
      Assume role provider                                                                     71
      AWS SDKs and Tools                                                               Reference Guide
           role_session_name = my-role-session-name
      source_profile - shared AWS config ﬁle setting
         Speciﬁes another proﬁle whose credentials are used to assume the role speciﬁed by the
         role_arn setting in the original proﬁle. To understand how proﬁles are used in the shared 
         AWS config and credentials ﬁles, see Shared config and credentials ﬁles.
         If you specify a proﬁle that is also an assume role proﬁle, each role will be assumed in 
         sequential order to fully resolve the credentials. This chain is stopped when the SDK encounters 
         a proﬁle with credentials. Role chaining limits your AWS CLI or AWS API role session to a 
         maximum of one hour and can't be increased. For more information, see Roles terms and 
         concepts in the IAM User Guide.
         Default value: None.
         Valid values: A text string that consists of the name of a proﬁle deﬁned in the config and
         credentials ﬁles. You must also specify a value for role_arn in the current proﬁle.
         You cannot specify both credential_source and source_profile in the same proﬁle.
         Example of setting this in a conﬁg ﬁle:
           [profile A]
           source_profile = B
           role_arn =  arn:aws:iam::123456789012:role/RoleA
           role_session_name = ProfileARoleSession
                           
           [profile B]
           credential_process = ./aws_signing_helper credential-process --certificate /
           path/to/certificate --private-key /path/to/private-key --trust-anchor-
           arn arn:aws:rolesanywhere:region:account:trust-anchor/TA_ID --profile-
           arn arn:aws:rolesanywhere:region:account:profile/PROFILE_ID --role-arn 
            arn:aws:iam::account:role/ROLE_ID
         In the previous example, the A proﬁle tells the SDK or tool to automatically look up the 
         credentials for the linked B proﬁle. In this case, the B proﬁle uses the credential helper tool 
         provided by Using IAM Roles Anywhere to authenticate AWS SDKs and tools to get credentials 
         for the AWS SDK. Those temporary credentials are then used by your code to access AWS 
         resources. The speciﬁed role must have attached IAM permissions policies that allow the 
      Assume role provider                                                                     72
      AWS SDKs and Tools                                                               Reference Guide
         requested code to run, such as the command, AWS service, or API method. Every action that is 
         taken by proﬁle A has the role session name included in CloudTrail logs.
         For a second example of role chaining, the following conﬁguration can be used if you have 
         an application on an Amazon Elastic Compute Cloud instance, and you want to have that 
         application assume another role.
           [profile A]
           source_profile = B
           role_arn =  arn:aws:iam::123456789012:role/RoleA
           role_session_name = ProfileARoleSession
                           
           [profile B]
           credential_source=Ec2InstanceMetadata
         Proﬁle A will use the credentials from the Amazon EC2 instance to assume the speciﬁed role 
         and will renew the credentials automatically.
      web_identity_token_file - shared AWS config ﬁle setting,
      AWS_WEB_IDENTITY_TOKEN_FILE - environment variable, aws.webIdentityTokenFile - 
      JVM system property: Java/Kotlin only
         Speciﬁes the path to a ﬁle that contains an access token from a supported OAuth 2.0 provider
         or OpenID Connect ID identity provider.
         This setting enables authentication by using web identity federation providers, such as
         Google, Facebook, and Amazon, among many others. The SDK or developer tool loads the 
         contents of this ﬁle and passes it as the WebIdentityToken argument when it calls the
         AssumeRoleWithWebIdentity operation on your behalf.
         Default value: None.
         Valid values: This value must be a path and ﬁle name. The ﬁle must contain an OAuth 2.0 
         access token or an OpenID Connect token that was provided to you by an identity provider. 
         Relative paths are treated as relative to the working directory of the process.
      Assume role provider                                                                     73
      AWS SDKs and Tools                                                               Reference Guide
      Support by AWS SDKs and tools
      The following SDKs support the features and settings described in this topic. Any partial exceptions 
      are noted. Any JVM system property settings are supported by the AWS SDK for Java and the AWS 
      SDK for Kotlin only.
        SDK                          SupNotes or more informationported
        AWS CLI v2                 Yes  
        SDK for C++               Partial
                                        credential_source  not supported. duration_ 
                                        seconds  not supported. mfa_serial  not supported.
        SDK for Go V2 (1.x)        Yes  
        SDK for Go 1.x (V1)        Yes
                                        To use shared config ﬁle settings, you must turn on loading 
                                        from the conﬁg ﬁle; see Sessions.
        SDK for Java 2.x          Partial
                                        mfa_serial  not supported. duration_seconds  not 
                                        supported.
        SDK for Java 1.x          Partial
                                        credential_source  not supported. mfa_serial  not 
                                        supported. JVM system properties not supported.
        SDK for JavaScript 3.x     Yes  
        SDK for JavaScript 2.x    Partial
                                        credential_source  not supported.
        SDK for Kotlin             Yes  
        SDK for .NET 4.x           Yes  
        SDK for .NET 3.x           Yes  
        SDK for PHP 3.x            Yes  
        SDK for Python (Boto3)     Yes  
        SDK for Ruby 3.x           Yes  
        SDK for Rust               Yes  
      Assume role provider                                                                     74
       AWS SDKs and Tools                                                                    Reference Guide
        SDK                            SupNotes or more informationported
        SDK for Swift                 Yes  
        Tools for PowerShell V5       Yes  
        Tools for PowerShell V4       Yes  
       Container credential provider
            Note
            For help in understanding the layout of settings pages, or in interpreting the Support by 
            AWS SDKs and tools table that follows, see Understanding the settings pages of this guide.
       The container credential provider fetches credentials for customer's containerized application. 
       This credential provider is useful for Amazon Elastic Container Service (Amazon ECS) and Amazon 
       Elastic Kubernetes Service (Amazon EKS) customers. SDKs attempt to load credentials from the 
       speciﬁed HTTP endpoint through a GET request.
       If you use Amazon ECS, we recommend you use a task IAM Role for improved credential 
       isolation, authorization, and auditability. When conﬁgured, Amazon ECS sets the
       AWS_CONTAINER_CREDENTIALS_RELATIVE_URI environment variable that the SDKs and tools 
       use to obtain credentials. To conﬁgure Amazon ECS for this functionality, see Task IAM role in the
       Amazon Elastic Container Service Developer Guide.
       If you use Amazon EKS, we recommend you use Amazon EKS Pod Identity for improved 
       credential isolation, least privilege, auditability, independent operation, reusability, 
       and scalability. Both your Pod and an IAM role are associated with a Kubernetes service 
       account to manage credentials for your applications. To learn more on Amazon EKS 
       Pod Identity, see Amazon EKS Pod Identities in the Amazon EKS User Guide. When 
       conﬁgured, Amazon EKS sets the AWS_CONTAINER_CREDENTIALS_FULL_URI and
       AWS_CONTAINER_AUTHORIZATION_TOKEN_FILE environment variables that the SDKs and tools 
       use to obtain credentials. For setup information, see Setting up the Amazon EKS Pod Identity 
       Agent in the Amazon EKS User Guide or Amazon EKS Pod Identity simpliﬁes IAM permissions for 
       applications on Amazon EKS clusters at the AWS Blog website.
       Container provider                                                                            75
      AWS SDKs and Tools                                                               Reference Guide
      Conﬁgure this functionality by using the following:
      AWS_CONTAINER_CREDENTIALS_FULL_URI - environment variable
         Speciﬁes the full HTTP URL endpoint for the SDK to use when making a request for credentials. 
         This includes both the scheme and the host.
         Default value: None.
         Valid values: Valid URI.
         Note: This setting is an alternative to AWS_CONTAINER_CREDENTIALS_RELATIVE_URI and will 
         only be used if AWS_CONTAINER_CREDENTIALS_RELATIVE_URI is not set.
         Linux/macOS example of setting environment variables via command line:
           export AWS_CONTAINER_CREDENTIALS_FULL_URI=http://localhost/get-credentials
         or
           export AWS_CONTAINER_CREDENTIALS_FULL_URI=http://localhost:8080/get-credentials
      AWS_CONTAINER_CREDENTIALS_RELATIVE_URI - environment variable
         Speciﬁes the relative HTTP URL endpoint for the SDK to use when making a request for 
         credentials. The value is appended to the default Amazon ECS hostname of 169.254.170.2.
         Default value: None.
         Valid values: Valid relative URI.
         Linux/macOS example of setting environment variables via command line:
           export AWS_CONTAINER_CREDENTIALS_RELATIVE_URI=/get-credentials?a=1
      AWS_CONTAINER_AUTHORIZATION_TOKEN - environment variable
         Speciﬁes an authorization token in plain text. If this variable is set, the SDK will set the 
         Authorization header on the HTTP request with the environment variable's value.
         Default value: None.
         Valid values: String.
      Container provider                                                                       76
      AWS SDKs and Tools                                                               Reference Guide
         Note: This setting is an alternative to AWS_CONTAINER_AUTHORIZATION_TOKEN_FILE and will 
         only be used if AWS_CONTAINER_AUTHORIZATION_TOKEN_FILE is not set.
         Linux/macOS example of setting environment variables via command line:
           export AWS_CONTAINER_CREDENTIALS_FULL_URI=http://localhost/get-credential
           export AWS_CONTAINER_AUTHORIZATION_TOKEN=Basic abcd
      AWS_CONTAINER_AUTHORIZATION_TOKEN_FILE - environment variable
         Speciﬁes an absolute ﬁle path to a ﬁle that contains the authorization token in plain text.
         Default value: None.
         Valid values: String.
         Linux/macOS example of setting environment variables via command line:
           export AWS_CONTAINER_CREDENTIALS_FULL_URI=http://localhost/get-credential
           export AWS_CONTAINER_AUTHORIZATION_TOKEN_FILE=/path/to/token
      Support by AWS SDKs and tools
      The following SDKs support the features and settings described in this topic. Any partial exceptions 
      are noted. Any JVM system property settings are supported by the AWS SDK for Java and the AWS 
      SDK for Kotlin only.
        SDK                          SupNotes or more informationported
        AWS CLI v2                 Yes  
        SDK for C++                Yes  
        SDK for Go V2 (1.x)        Yes  
        SDK for Go 1.x (V1)        Yes  
        SDK for Java 2.x           Yes
                                        When Lambda SnapStart is activated, AWS_CONTA 
                                        INER_CREDENTIALS_FULL_URI         and AWS_CONTA 
      Container provider                                                                       77
      AWS SDKs and Tools                                                               Reference Guide
        SDK                          SupNotes or more informationported
                                        INER_AUTHORIZATION_TOKEN         are automatically used 
                                        for authentication.
        SDK for Java 1.x           Yes
                                        When Lambda SnapStart is activated, AWS_CONTA 
                                        INER_CREDENTIALS_FULL_URI         and AWS_CONTA 
                                        INER_AUTHORIZATION_TOKEN         are automatically used 
                                        for authentication.
        SDK for JavaScript 3.x     Yes  
        SDK for JavaScript 2.x     Yes  
        SDK for Kotlin             Yes  
        SDK for .NET 4.x           Yes
                                        When Lambda SnapStart is activated, AWS_CONTA 
                                        INER_CREDENTIALS_FULL_URI         and AWS_CONTA 
                                        INER_AUTHORIZATION_TOKEN         are automatically used 
                                        for authentication.
        SDK for .NET 3.x           Yes
                                        When Lambda SnapStart is activated, AWS_CONTA 
                                        INER_CREDENTIALS_FULL_URI         and AWS_CONTA 
                                        INER_AUTHORIZATION_TOKEN         are automatically used 
                                        for authentication.
        SDK for PHP 3.x            Yes  
        SDK for Python (Boto3)     Yes
                                        When Lambda SnapStart is activated, AWS_CONTA 
                                        INER_CREDENTIALS_FULL_URI         and AWS_CONTA 
                                        INER_AUTHORIZATION_TOKEN         are automatically used 
                                        for authentication.
        SDK for Ruby 3.x           Yes  
        SDK for Rust               Yes  
        SDK for Swift              Yes  
        Tools for PowerShell V5    Yes  
      Container provider                                                                       78
       AWS SDKs and Tools                                                                    Reference Guide
        SDK                            SupNotes or more informationported
        Tools for PowerShell V4       Yes  
       IAM Identity Center credential provider
            Note
            For help in understanding the layout of settings pages, or in interpreting the Support by 
            AWS SDKs and tools table that follows, see Understanding the settings pages of this guide.
       This authentication mechanism uses AWS IAM Identity Center to get single sign-on (SSO) access to 
       AWS services for your code.
            Note
            In the AWS SDK API documentation, the IAM Identity Center credential provider is called 
            the SSO credential provider.
       After you enable IAM Identity Center, you deﬁne a proﬁle for its settings in your shared AWS
       config ﬁle. This proﬁle is used to connect to the IAM Identity Center access portal. When a user 
       successfully authenticates with IAM Identity Center, the portal returns short-term credentials for 
       the IAM role associated with that user. To learn how the SDK gets temporary credentials from the 
       conﬁguration and uses them for AWS service requests, see How IAM Identity Center authentication 
       is resolved for AWS SDKs and tools.
       There are two ways to conﬁgure IAM Identity Center through the config ﬁle:
       • (Recommended) SSO token provider conﬁguration – Extended session durations. Includes 
         support for custom session durations.
       • Legacy non-refreshable conﬁguration – Uses a ﬁxed, eight-hour session.
       In both conﬁgurations, you need to sign in again when your session expires.
       The following two guides contain additional information about IAM Identity Center:
       IAM Identity Center provider                                                                  79
      AWS SDKs and Tools                                                               Reference Guide
      • AWS IAM Identity Center User Guide
      • AWS IAM Identity Center Portal API Reference
      For a deep dive on how the SDKs and tools use and refresh credentials using this conﬁguration, see
      How IAM Identity Center authentication is resolved for AWS SDKs and tools.
      Prerequisites
      You must ﬁrst enable IAM Identity Center. For details about enabling IAM Identity Center 
      authentication, see Enabling AWS IAM Identity Center in the AWS IAM Identity Center User Guide.
           Note
           Alternatively, for complete prerequisites and the necessary shared config ﬁle 
           conﬁguration that is detailed on this page, see the guided instructions for setting up Using 
           IAM Identity Center to authenticate AWS SDK and tools.
      SSO token provider conﬁguration
      When you use the SSO token provider conﬁguration, your AWS SDK or tool automatically refreshes 
      your session up to your extended session period. For more information on session duration and 
      maximum duration, see Conﬁgure the session duration of the AWS access portal and IAM Identity 
      Center integrated applications in the AWS IAM Identity Center User Guide.
      The sso-session section of the config ﬁle is used to group conﬁguration variables for acquiring 
      SSO access tokens, which can then be used to acquire AWS credentials. For more details on this 
      section within a config ﬁle, see Format of the conﬁg ﬁle.
      The following shared config ﬁle example conﬁgures the SDK or tool using a dev proﬁle to 
      request IAM Identity Center credentials.
        [profile dev]
        sso_session = my-sso
        sso_account_id = 111122223333
        sso_role_name = SampleRole
        [sso-session my-sso]
      IAM Identity Center provider                                                             80
      AWS SDKs and Tools                                                               Reference Guide
        sso_region = us-east-1
        sso_start_url = https://my-sso-portal.awsapps.com/start
        sso_registration_scopes = sso:account:access
      The previous examples shows that you deﬁne an sso-session section and associate it to 
      a proﬁle. Typically, sso_account_id and sso_role_name must be set in the profile
      section so that the SDK can request AWS credentials. sso_region, sso_start_url, and
      sso_registration_scopes must be set within the sso-session section.
      sso_account_id and sso_role_name aren't required for all scenarios of SSO token 
      conﬁguration. If your application only uses AWS services that support bearer authentication, 
      then traditional AWS credentials are not needed. Bearer authentication is an HTTP authentication 
      scheme that uses security tokens called bearer tokens. In this scenario, sso_account_id and
      sso_role_name aren't required. See the individual AWS service guide to determine if the service 
      supports bearer token authorization.
      Registration scopes are conﬁgured as part of an sso-session. Scope is a mechanism in 
      OAuth 2.0 to limit an application's access to a user's account. The previous example sets
      sso_registration_scopes to provide necessary access for listing accounts and roles.
      The following example shows how you can reuse the same sso-session conﬁguration across 
      multiple proﬁles.
        [profile dev]
        sso_session = my-sso
        sso_account_id = 111122223333
        sso_role_name = SampleRole
        [profile prod]
        sso_session = my-sso
        sso_account_id = 111122223333
        sso_role_name = SampleRole2
        [sso-session my-sso]
        sso_region = us-east-1
        sso_start_url = https://my-sso-portal.awsapps.com/start
        sso_registration_scopes = sso:account:access
      The authentication token is cached to disk under the ~/.aws/sso/cache directory with a ﬁle 
      name based on the session name.
      IAM Identity Center provider                                                             81
      AWS SDKs and Tools                                                               Reference Guide
      Legacy non-refreshable conﬁguration
      Automated token refresh isn't supported using the legacy non-refreshable conﬁguration. We 
      recommend using the SSO token provider conﬁguration instead.
      To use the legacy non-refreshable conﬁguration, you must specify the following settings within 
      your proﬁle:
      •
        sso_start_url
      •
        sso_region
      •
        sso_account_id
      •
        sso_role_name
      You specify the user portal for a proﬁle with the sso_start_url and sso_region settings. You 
      specify permissions with the sso_account_id and sso_role_name settings.
      The following example sets the four required values in the config ﬁle.
        [profile my-sso-profile]
        sso_start_url = https://my-sso-portal.awsapps.com/start
        sso_region = us-west-2
        sso_account_id = 111122223333
        sso_role_name = SSOReadOnlyRole
      The authentication token is cached to disk under the ~/.aws/sso/cache directory with a ﬁle 
      name based on the sso_start_url.
      IAM Identity Center credential provider settings
      Conﬁgure this functionality by using the following:
      sso_start_url - shared AWS config ﬁle setting
         The URL that points to your organization's IAM Identity Center issuer URL or access portal URL. 
         For more information, see Using the AWS access portal in the AWS IAM Identity Center User 
         Guide.
         To ﬁnd this value, open the IAM Identity Center console, view the Dashboard, ﬁnd AWS access 
         portal URL.
      IAM Identity Center provider                                                             82
      AWS SDKs and Tools                                                              Reference Guide
         • Alternatively, starting with version 2.22.0 of the AWS CLI, you can instead use the value for
           AWS Issuer URL.
      sso_region - shared AWS config ﬁle setting
         The AWS Region that contains your IAM Identity Center portal host; that is, the Region you 
         selected before enabling IAM Identity Center. This is independent from your default AWS 
         Region, and can be diﬀerent.
         For a complete list of the AWS Regions and their codes, see Regional Endpoints in the Amazon 
         Web Services General Reference. To ﬁnd this value, open the IAM Identity Center console, view 
         the Dashboard, and ﬁnd Region.
      sso_account_id - shared AWS config ﬁle setting
         The numeric ID of the AWS account that was added through the AWS Organizations service to 
         use for authentication.
         To see the list of available accounts, go to the IAM Identity Center console and open the AWS 
         accounts page. You can also see the list of available accounts using the ListAccounts API 
         method in the AWS IAM Identity Center Portal API Reference. For example, you can call the AWS 
         CLI method list-accounts.
      sso_role_name - shared AWS config ﬁle setting
         The name of a permission set provisioned as an IAM role that deﬁnes the user's resulting 
         permissions. The role must exist in the AWS account speciﬁed by sso_account_id. Use the 
         role name, not the role Amazon Resource Name (ARN).
         Permission sets have IAM policies and custom permissions policies attached to them and deﬁne 
         the level of access that users have to their assigned AWS accounts.
         To see the list of available permission sets per AWS account, go to the IAM Identity Center 
         console and open the AWS accounts page. Choose the correct permission set name listed 
         in the AWS accounts table. You can also see the list of available permission sets using the
         ListAccountRoles API method in the AWS IAM Identity Center Portal API Reference. For example, 
         you can call the AWS CLI method list-account-roles.
      sso_registration_scopes - shared AWS config ﬁle setting
         A comma-delimited list of valid scope strings to be authorized for the sso-session. An 
         application can request one or more scopes, and the access token issued to the application is 
         limited to the scopes granted. A minimum scope of sso:account:access must be granted 
      IAM Identity Center provider                                                            83
      AWS SDKs and Tools                                                               Reference Guide
         to get a refresh token back from the IAM Identity Center service. For the list of available access 
         scope options, see Access scopes in the AWS IAM Identity Center User Guide.
         These scopes deﬁne the permissions requested to be authorized for the registered OIDC client 
         and access tokens retrieved by the client. Scopes authorize access to IAM Identity Center bearer 
         token authorized endpoints.
         This setting doesn't apply to the legacy non-refreshable conﬁguration. Tokens issued using the 
         legacy conﬁguration are limited to scope sso:account:access implicitly.
      Support by AWS SDKs and tools
      The following SDKs support the features and settings described in this topic. Any partial exceptions 
      are noted. Any JVM system property settings are supported by the AWS SDK for Java and the AWS 
      SDK for Kotlin only.
        SDK                          SupNotes or more informationported
        AWS CLI v2                 Yes  
        SDK for C++                Yes  
        SDK for Go V2 (1.x)        Yes  
        SDK for Go 1.x (V1)        Yes
                                        To use shared config ﬁle settings, you must turn on loading 
                                        from the conﬁg ﬁle; see Sessions.
        SDK for Java 2.x           Yes
                                        Conﬁguration values also supported in credentials  ﬁle.
        SDK for Java 1.x            No  
        SDK for JavaScript 3.x     Yes  
        SDK for JavaScript 2.x     Yes  
        SDK for Kotlin             Yes  
        SDK for .NET 4.x           Yes  
        SDK for .NET 3.x           Yes  
      IAM Identity Center provider                                                             84
       AWS SDKs and Tools                                                                 Reference Guide
        SDK                           SupNotes or more informationported
        SDK for PHP 3.x              Yes  
        SDK for Python (Boto3)       Yes  
        SDK for Ruby 3.x             Yes  
        SDK for Rust               PartialLegacy non-refreshable conﬁguration only.
        SDK for Swift                Yes  
        Tools for PowerShell V5      Yes  
        Tools for PowerShell V4      Yes  
       IMDS credential provider
            Note
            For help in understanding the layout of settings pages, or in interpreting the Support by 
            AWS SDKs and tools table that follows, see Understanding the settings pages of this guide.
       Instance Metadata Service (IMDS) provides data about your instance that you can use to conﬁgure 
       or manage the running instance. For more information about the data available, see Work with 
       instance metadata in the Amazon EC2 User Guide. Amazon EC2 provides a local endpoint available 
       to instances that can provide various bits of information to the instance. If the instance has a role 
       attached, it can provide a set of credentials that are valid for that role. The SDKs can use that 
       endpoint to resolve credentials as part of their default credential provider chain. Instance Metadata 
       Service Version 2 (IMDSv2), a more secure version of IMDS that uses a session token, is used by 
       default. If that fails due to a non-retryable condition (HTTP error codes 403, 404, 405), IMDSv1 is 
       used as a fallback.
       Conﬁgure this functionality by using the following:
       IMDS provider                                                                               85
      AWS SDKs and Tools                                                               Reference Guide
      AWS_EC2_METADATA_DISABLED - environment variable
         Whether or not to attempt to use Amazon EC2 Instance Metadata Service (IMDS) to obtain 
         credentials.
         Default value: false.
         Valid values:
         •
           true – Do not use IMDS to obtain credentials.
         •
           false – Use IMDS to obtain credentials.
      ec2_metadata_v1_disabled - shared AWS config ﬁle setting,
      AWS_EC2_METADATA_V1_DISABLED - environment variable, aws.disableEc2MetadataV1 - 
      JVM system property: Java/Kotlin only
         Whether or not to use Instance Metadata Service Version 1 (IMDSv1) as a fallback if IMDSv2 
         fails.
              Note
              New SDKs don't support IMDSv1 and, thus, don't support this setting. For details, see 
              table Support by AWS SDKs and tools.
         Default value: false.
         Valid values:
         •
           true – Do not use IMDSv1 as a fallback.
         •
           false – Use IMDSv1 as a fallback.
      ec2_metadata_service_endpoint - shared AWS config ﬁle setting,
      AWS_EC2_METADATA_SERVICE_ENDPOINT - environment variable,
      aws.ec2MetadataServiceEndpoint - JVM system property: Java/Kotlin only
         The endpoint of IMDS. This value overrides the default location that AWS SDKs and tools will 
         search for Amazon EC2 instance metadata.
         Default value: If ec2_metadata_service_endpoint_mode equals IPv4, then default 
         endpoint is http://169.254.169.254. If ec2_metadata_service_endpoint_mode
         equals IPv6, then default endpoint is http://[fd00:ec2::254].
      IMDS provider                                                                            86
      AWS SDKs and Tools                                                               Reference Guide
         Valid values: Valid URI.
      ec2_metadata_service_endpoint_mode - shared AWS config ﬁle setting,
      AWS_EC2_METADATA_SERVICE_ENDPOINT_MODE - environment variable,
      aws.ec2MetadataServiceEndpointMode - JVM system property: Java/Kotlin only
         The endpoint mode of IMDS.
         Default value:IPv4.
         Valid values: IPv4, IPv6.
           Note
           The IMDS credential provider is a part of the Understand the credential provider chain. 
           However, the IMDS credential provider is only checked after several other providers that are 
           in this series. Therefore, if you want your program use this provider's credentials, you must 
           remove other valid credential providers from your conﬁguration or use a diﬀerent proﬁle. 
           Alternatively, instead of relying on the credential provider chain to automatically discover 
           which provider returns valid credentials, specify the use of the IMDS credential provider in 
           code. You can specify credential sources directly when you create service clients.
      Security for IMDS credentials
      By default, when the AWS SDK is not conﬁgured with valid credentials the SDK will attempt to use 
      the Amazon EC2 Instance Metadata Service (IMDS) to retrieve credentials for an AWS role. This 
      behavior can be disabled by setting the AWS_EC2_METADATA_DISABLED environment variable to
      true. This prevents unnecessary network activity and enhances security on untrusted networks 
      where the Amazon EC2 Instance Metadata Service may be impersonated.
           Note
           AWS SDK clients conﬁgured with valid credentials will never use IMDS to retrieve 
           credentials, regardless of any of these settings.
      IMDS provider                                                                            87
      AWS SDKs and Tools                                                               Reference Guide
      Disabling use of Amazon EC2 IMDS credentials
      How you set this environment variable depends on what operating system is in use as well as 
      whether or not you want the change to be persistent.
      Linux and macOS
      Customers using Linux or macOS can set this environment variable with the following command:
        $ export AWS_EC2_METADATA_DISABLED=true
      If you want this setting to be persistent across multiple shell sessions and system restarts, you can 
      add the above command to your shell proﬁle ﬁle, such as .bash_profile, .zsh_profile, or
      .profile.
      Windows
      Customers using Windows can set this environment variable with the following command:
        $ set AWS_EC2_METADATA_DISABLED=true
      If you want this setting to be persistent across multiple shell sessions and system restarts can use 
      the following command instead:
        $ setx AWS_EC2_METADATA_DISABLED=true
           Note
           The setx command does not apply the value to the current shell session, so you will need to 
           reload or reopen the shell for the change to take eﬀect.
      Support by AWS SDKs and tools
      The following SDKs support the features and settings described in this topic. Any partial exceptions 
      are noted. Any JVM system property settings are supported by the AWS SDK for Java and the AWS 
      SDK for Kotlin only.
      IMDS provider                                                                            88
      AWS SDKs and Tools                                                               Reference Guide
        SDK                          SupNotes or more informationported
        AWS CLI v2                 Yes  
        SDK for C++                Yes  
        SDK for Go V2 (1.x)        Yes  
        SDK for Go 1.x (V1)        Yes
                                        To use shared config ﬁle settings, you must turn on loading 
                                        from the conﬁg ﬁle; see Sessions.
        SDK for Java 2.x           Yes  
        SDK for Java 1.x          Partial
                                        JVM system properties: Use com.amazonaws.sdk. 
                                        disableEc2MetadataV1        instead of aws.disab 
                                        leEc2MetadataV1 ; aws.ec2MetadataSer 
                                        viceEndpoint  and aws.ec2MetadataSer 
                                        viceEndpointMode  not supported.
        SDK for JavaScript 3.x     Yes  
        SDK for JavaScript 2.x     Yes  
        SDK for Kotlin             Yes Does not use IMDSv1 fallback.
        SDK for .NET 4.x           Yes  
        SDK for .NET 3.x           Yes  
        SDK for PHP 3.x            Yes  
        SDK for Python (Boto3)     Yes  
        SDK for Ruby 3.x           Yes  
        SDK for Rust               Yes Does not use IMDSv1 fallback.
        SDK for Swift              Yes  
      IMDS provider                                                                            89
       AWS SDKs and Tools                                                                    Reference Guide
        SDK                            SupNotes or more informationported
        Tools for PowerShell V5       Yes You can disable IMDSv1 fallback explicitly in code using
                                          [Amazon.Util.EC2InstanceMetadata]::E 
                                          C2MetadataV1Disabled = $true            .
        Tools for PowerShell V4       Yes You can disable IMDSv1 fallback explicitly in code using
                                          [Amazon.Util.EC2InstanceMetadata]::E 
                                          C2MetadataV1Disabled = $true            .
       Process credential provider
            Note
            For help in understanding the layout of settings pages, or in interpreting the Support by 
            AWS SDKs and tools table that follows, see Understanding the settings pages of this guide.
       SDKs provide a way to extend the credential provider chain for custom use cases. This provider can 
       be used to provide custom implementations, such as retrieving credentials from an on-premises 
       credentials store or integrating with your on-premises identify provider.
       For example, IAM Roles Anywhere uses credential_process to get temporary credentials on 
       behalf of your application. To conﬁgure credential_process for this use, see Using IAM Roles 
       Anywhere to authenticate AWS SDKs and tools.
            Note
            The following describes a method of sourcing credentials from an external process and 
            might be used if you are running software outside of AWS. If you are building on an 
            AWS compute resource, use other credential providers. If using this option, you should 
            make sure that the conﬁg ﬁle is as locked down as possible using security best practices 
            for your operating system. Conﬁrm that your custom credential tool does not write any 
            secret information to StdErr, because the SDKs and AWS CLI can capture and log such 
            information, potentially exposing it to unauthorized users.
       Process provider                                                                              90
      AWS SDKs and Tools                                                          Reference Guide
      Conﬁgure this functionality by using the following:
      credential_process - shared AWS config ﬁle setting
         Speciﬁes an external command that the SDK or tool runs on your behalf to generate or retrieve 
         authentication credentials to use. The setting speciﬁes the name of a program/command 
         that the SDK will invoke. When the SDK invokes the process, it waits for the process to write 
         JSON data to stdout. The custom provider must return information in a speciﬁc format. That 
         information contains the credentials that the SDK or tool can use to authenticate you.
           Note
           The process credential provider is a part of the Understand the credential provider chain. 
           However, the process credential provider is only checked after several other providers that 
           are in this series. Therefore, if you want your program use this provider's credentials, you 
           must remove other valid credential providers from your conﬁguration or use a diﬀerent 
           proﬁle. Alternatively, instead of relying on the credential provider chain to automatically 
           discover which provider returns valid credentials, specify the use of the process credential 
           provider in code. You can specify credential sources directly when you create service clients.
      Specifying the path to the credentials program
      The setting's value is a string that contains a path to a program that the SDK or development tool 
      runs on your behalf:
      • The path and ﬁle name can consist of only these characters: A-Z, a-z, 0-9, hyphen ( - ), 
        underscore ( _ ), period ( . ), forward slash ( / ), backslash ( \ ), and space.
      • If the path or ﬁle name contains a space, surround the complete path and ﬁle name with double-
        quotation marks (" ").
      • If a parameter name or a parameter value contains a space, surround that element with double-
        quotation marks (" "). Surround only the name or value, not the pair.
      •
        Don't include any environment variables in the strings. For example, don't include $HOME or
        %USERPROFILE%.
      •
        Don't specify the home folder as ~. * You must specify either the full path or a base ﬁle name. If 
        there is a base ﬁle name, the system attempts to ﬁnd the program within folders speciﬁed by the
        PATH environment variable. The path varies depending on the operating system:
      Process provider                                                                    91
      AWS SDKs and Tools                                                               Reference Guide
        The following example shows setting credential_process in the shared config ﬁle on Linux/
        macOS.
          credential_process = "/path/to/credentials.sh" parameterWithoutSpaces "parameter with 
           spaces"
        The following example shows setting credential_process in the shared config ﬁle on Windows.
          credential_process = "C:\Path\To\credentials.cmd" parameterWithoutSpaces "parameter 
           with spaces"
      • Can be speciﬁed within a dedicated proﬁle:
          [profile cred_process]  
          credential_process = /Users/username/process.sh 
          region = us-east-1
      Valid output from the credentials program
      The SDK runs the command as speciﬁed in the proﬁle and then reads data from the standard 
      output stream. The command you specify, whether a script or binary program, must generate JSON 
      output on STDOUT that matches the following syntax.
        { 
            "Version": 1, 
            "AccessKeyId": "an AWS access key", 
            "SecretAccessKey": "your AWS secret access key", 
            "SessionToken": "the AWS session token for temporary credentials",  
            "Expiration": "RFC3339 timestamp for when the credentials expire"
        }   
           Note
           As of this writing, the Version key must be set to 1. This might increment over time as the 
           structure evolves.
      Process provider                                                                         92
      AWS SDKs and Tools                                                               Reference Guide
      The Expiration key is an RFC3339 formatted timestamp. If the Expiration key isn't present 
      in the tool's output, the SDK assumes that the credentials are long-term credentials that 
      don't refresh. Otherwise, the credentials are considered temporary credentials, and they are 
      automatically refreshed by rerunning the credential_process command before the credentials 
      expire.
           Note
           The SDK does not cache external process credentials the way it does assume-role 
           credentials. If caching is required, you must implement it in the external process.
      The external process can return a non-zero return code to indicate that an error occurred while 
      retrieving the credentials.
      Support by AWS SDKs and tools
      The following SDKs support the features and settings described in this topic. Any partial exceptions 
      are noted. Any JVM system property settings are supported by the AWS SDK for Java and the AWS 
      SDK for Kotlin only.
        SDK                          SupNotes or more informationported
        AWS CLI v2                 Yes  
        SDK for C++                Yes  
        SDK for Go V2 (1.x)        Yes  
        SDK for Go 1.x (V1)        Yes
                                        To use shared config ﬁle settings, you must turn on loading 
                                        from the conﬁg ﬁle; see Sessions.
        SDK for Java 2.x           Yes  
        SDK for Java 1.x           Yes  
        SDK for JavaScript 3.x     Yes  
        SDK for JavaScript 2.x     Yes  
      Process provider                                                                         93
       AWS SDKs and Tools                                                                 Reference Guide
        SDK                           SupNotes or more informationported
        SDK for Kotlin               Yes  
        SDK for .NET 4.x             Yes  
        SDK for .NET 3.x             Yes  
        SDK for PHP 3.x              Yes  
        SDK for Python (Boto3)       Yes  
        SDK for Ruby 3.x             Yes  
        SDK for Rust                 Yes  
        SDK for Swift                Yes  
        Tools for PowerShell V5      Yes  
        Tools for PowerShell V4      Yes  
       AWS SDKs and Tools standardized features
       Many features have been standardized to consistent defaults and to work the same way across 
       many SDKs. This consistency increases productivity and clarity when coding across multiple SDKs. 
       All settings can be overridden in code, see your speciﬁc SDK API for details.
            Important
            Not all SDKs support all features, or even all aspects within a feature.
       Topics
       • Account-based endpoints
       • Application ID
       • Amazon EC2 instance metadata
       • Amazon S3 access points
       Standardized features                                                                       94
      AWS SDKs and Tools                                                               Reference Guide
      • Amazon S3 Multi-Region Access Points
      • AWS Region
      • AWS STS Regional endpoints
      • Data Integrity Protections for Amazon S3
      • Dual-stack and FIPS endpoints
      • Endpoint discovery
      • General conﬁguration settings
      • Host preﬁx injection
      • IMDS client
      • Retry behavior
      • Request compression
      • Service-speciﬁc endpoints
      • Smart conﬁguration defaults
      Account-based endpoints
           Note
           For help in understanding the layout of settings pages, or in interpreting the Support by 
           AWS SDKs and tools table that follows, see Understanding the settings pages of this guide.
      Account-based endpoints help ensure high performance and scalability by using your AWS account 
      ID to route requests for services that support this feature. When you use an AWS SDK and service 
      that support account-based endpoints, the SDK client constructs and uses an account-based 
      endpoint rather than a regional endpoint. If the account ID isn't visible to the SDK client, the client 
      will use the regional endpoint. Account-based endpoints take the form of https://<account-
      id>.ddb.<region>.amazonaws.com, where <account-id> and <region> are your AWS 
      account ID and AWS Region.
      Conﬁgure this functionality by using the following:
      Account-based endpoints                                                                  95
        AWS SDKs and Tools                                                                                    Reference Guide
        aws_account_id - shared AWS config ﬁle setting, AWS_ACCOUNT_ID - environment variable,
        aws.accountId - JVM system property: Java/Kotlin only
            The AWS account ID. Used for account-based endpoint routing. An AWS account ID has a format 
            like 111122223333.
            Account-based endpoint routing provides better request performance for some services.
        account_id_endpoint_mode - shared AWS config ﬁle setting,
        AWS_ACCOUNT_ID_ENDPOINT_MODE - environment variable, aws.accountIdEndpointMode - 
        JVM system property: Java/Kotlin only
            This setting is used to turn oﬀ account-based endpoint routing if necessary, and bypass 
            account-based rules.
            Default value: preferred
            Valid values:
            •
               preferred – The endpoint should include account ID if available.
            •
               disabled – A resolved endpoint doesn't include account ID.
            •
               required – The endpoint must include account ID. If the account ID isn't available, the SDK 
               throws an error.
        Support by AWS SDKs and tools
        The following SDKs support the features and settings described in this topic. Any partial exceptions 
        are noted. Any JVM system property settings are supported by the AWS SDK for Java and the AWS 
        SDK for Kotlin only.
          SDK                        SuppoRretleedased    Notes or more information
                                            in SDK 
                                            version
          AWS CLI v2                 Yes    2.25.0         
          AWS CLI v1                 Yes    1.38.0         
          SDK for C++                No                    
          SDK for Go V2 (1.x)        Yes    v1.35.0        
        Account-based endpoints                                                                                          96
        AWS SDKs and Tools                                                                                    Reference Guide
          SDK                        SuppoRretleedased    Notes or more information
                                            in SDK 
                                            version
          SDK for Go 1.x (V1)        No                    
          SDK for Java 2.x           Yes    v2.28.4        
          SDK for Java 1.x           Yes    v1.12.771      
          SDK for JavaScript         Yes    v3.656.0       
          3.x
          SDK for JavaScript         No                    
          2.x
          SDK for Kotlin             Yes    v1.3.37        
          SDK for .NET 4.x           Yes    4.0.0          
          SDK for .NET 3.x           No                    
          SDK for PHP 3.x            Yes    v3.318.0       
          SDK for Python             Yes    1.37.0         
          (Boto3)
          SDK for Ruby 3.x           Yes    v1.123.0       
          SDK for Rust               No                    
          SDK for Swift              Yes    1.2.0          
          Tools for PowerShel        No                    
          l V5
          Tools for PowerShel        No                    
          l V4
        Account-based endpoints                                                                                          97
      AWS SDKs and Tools                                                               Reference Guide
      Application ID
           Note
           For help in understanding the layout of settings pages, or in interpreting the Support by 
           AWS SDKs and tools table that follows, see Understanding the settings pages of this guide.
      A single AWS account can be used by multiple customer applications to make calls to AWS services. 
      Application ID provides a way for customers to identify which source application made a set 
      of calls using an AWS account. AWS SDKs and services don't use or interpret this value other 
      than to surface it back in customer communications. For example, this value can be included in 
      operational emails or in the AWS Health Dashboard to uniquely identify which of your applications 
      is associated with the notiﬁcation.
      Conﬁgure this functionality by using the following:
      sdk_ua_app_id - shared AWS config ﬁle setting, AWS_SDK_UA_APP_ID - environment 
      variable, aws.userAgentAppId - JVM system property: Java/Kotlin only
         This setting is a unique string you assign to your application to identify which of your 
         applications within a particular AWS account makes calls to AWS.
         Default value: None
         Valid values: String with maximum length of 50. Letters, numbers and the following special 
         characters are allowed: !,$,%,&,*,+,-,.,,,^,_,`,|,~.
      Example of setting this value in the config ﬁle:
        [default]
        sdk_ua_app_id=ABCDEF
      Linux/macOS example of setting environment variables via command line:
        export AWS_SDK_UA_APP_ID=ABCDEF
        export AWS_SDK_UA_APP_ID="ABC DEF"
      Windows example of setting environment variables via command line:
      Application ID                                                                           98
      AWS SDKs and Tools                                                               Reference Guide
        setx AWS_SDK_UA_APP_ID ABCDEF
        setx AWS_SDK_UA_APP_ID="ABC DEF"
      If you include symbols that have a special meaning to the shell being used, escape the value as 
      appropriate.
      Support by AWS SDKs and tools
      The following SDKs support the features and settings described in this topic. Any partial exceptions 
      are noted. Any JVM system property settings are supported by the AWS SDK for Java and the AWS 
      SDK for Kotlin only.
        SDK                          SupNotes or more informationported
        AWS CLI v2                 Yes  
        SDK for C++                Yes
                                        shared config ﬁle not supported.
        SDK for Go V2 (1.x)        Yes  
        SDK for Go 1.x (V1)         No  
        SDK for Java 2.x          Partial
                                        Shared config ﬁle setting not supported; environment 
                                        variable not supported.
        SDK for Java 1.x            No  
        SDK for JavaScript 3.x     Yes  
        SDK for JavaScript 2.x      No  
        SDK for Kotlin             Yes  
        SDK for .NET 4.x           Yes  
        SDK for .NET 3.x           Yes  
        SDK for PHP 3.x            Yes  
        SDK for Python (Boto3)     Yes  
      Application ID                                                                           99
      AWS SDKs and Tools                                                         Reference Guide
       SDK                        SupNotes or more informationported
       SDK for Ruby 3.x          Yes  
       SDK for Rust              Yes  
       SDK for Swift             No  
       Tools for PowerShell V5   No  
       Tools for PowerShell V4   No  
      Amazon EC2 instance metadata
           Note
           For help in understanding the layout of settings pages, or in interpreting the Support by 
           AWS SDKs and tools table that follows, see Understanding the settings pages of this guide.
      Amazon EC2 provides a service on instances called the Instance Metadata Service (IMDS). To learn 
      more about this service, see Work with instance metadata in the Amazon EC2 User Guide. When 
      attempting to retrieve credentials on an Amazon EC2 instance that has been conﬁgured with an 
      IAM role, the connection to the instance metadata service is adjustable.
      Conﬁgure this functionality by using the following:
      metadata_service_num_attempts - shared AWS config ﬁle setting,
      AWS_METADATA_SERVICE_NUM_ATTEMPTS - environment variable
         This setting speciﬁes the number of total attempts to make before giving up when attempting 
         to retrieve data from the instance metadata service.
         Default value: 1
         Valid values: Number greater than or equal to 1.
      Amazon EC2 instance metadata                                                      100
      AWS SDKs and Tools                                                               Reference Guide
      metadata_service_timeout - shared AWS config ﬁle setting,
      AWS_METADATA_SERVICE_TIMEOUT - environment variable
         Speciﬁes the number of seconds before timing out when attempting to retrieve data from the 
         instance metadata service.
         Default value: 1
         Valid values: Number greater than or equal to 1.
      Example of setting these values in the config ﬁle:
        [default]
        metadata_service_num_attempts=10
        metadata_service_timeout=10
      Linux/macOS example of setting environment variables via command line:
        export AWS_METADATA_SERVICE_NUM_ATTEMPTS=10
        export AWS_METADATA_SERVICE_TIMEOUT=10
      Windows example of setting environment variables via command line:
        setx AWS_METADATA_SERVICE_NUM_ATTEMPTS 10
        setx AWS_METADATA_SERVICE_TIMEOUT 10
      Support by AWS SDKs and tools
      The following SDKs support the features and settings described in this topic. Any partial exceptions 
      are noted. Any JVM system property settings are supported by the AWS SDK for Java and the AWS 
      SDK for Kotlin only.
        SDK                          SupNotes or more informationported
        AWS CLI v2                 Yes  
        SDK for C++                 No  
      Amazon EC2 instance metadata                                                            101
      AWS SDKs and Tools                                                     Reference Guide
       SDK                       SupNotes or more informationported
       SDK for Go V2 (1.x)      No  
       SDK for Go 1.x (V1)      No  
       SDK for Java 2.x       Partial
                                   Only AWS_METADATA_SERVICE_TIMEOUT      is supported.
       SDK for Java 1.x       Partial
                                   Only AWS_METADATA_SERVICE_TIMEOUT      is supported.
       SDK for JavaScript 3.x   No  
       SDK for JavaScript 2.x   No  
       SDK for Kotlin           No  
       SDK for .NET 4.x         No  
       SDK for .NET 3.x         No  
       SDK for PHP 3.x          Yes  
       SDK for Python (Boto3)   Yes  
       SDK for Ruby 3.x         No  
       SDK for Rust             No  
       SDK for Swift            No  
       Tools for PowerShell V5  No  
       Tools for PowerShell V4  No  
      Amazon S3 access points
          Note
          For help in understanding the layout of settings pages, or in interpreting the Support by 
          AWS SDKs and tools table that follows, see Understanding the settings pages of this guide.
      Amazon S3 access points                                                       102
      AWS SDKs and Tools                                                               Reference Guide
      The Amazon S3 service provides access points as an alternative way to interact with Amazon S3 
      buckets. Access points have unique policies and conﬁgurations that can be applied to them instead 
      of directly to the bucket. With AWS SDKs, you can use access point Amazon Resource Names (ARNs) 
      in the bucket ﬁeld for API operations instead of specifying the bucket name explicitly. They are 
      used for speciﬁc operations such as using an access point ARN with GetObject to fetch an object 
      from a bucket, or using an access point ARN with PutObject to add an object to a bucket.
      To learn more about Amazon S3 access points and ARNs, see Using access points in the Amazon S3 
      User Guide.
      Conﬁgure this functionality by using the following:
      s3_use_arn_region - shared AWS config ﬁle setting, AWS_S3_USE_ARN_REGION - 
      environment variable, aws.s3UseArnRegion - JVM system property: Java/Kotlin only, To 
      conﬁgure value directly in code, consult your speciﬁc SDK directly.
         This setting controls whether the SDK uses the access point ARN AWS Region to construct the 
         Regional endpoint for the request. The SDK validates that the ARN AWS Region is served by the 
         same AWS partition as the client's conﬁgured AWS Region to prevent cross-partition calls that 
         most likely will fail. If multiply deﬁned, the code-conﬁgured setting takes precedence, followed 
         by the environment variable setting.
         Default value: false
         Valid values:
         •
           true – The SDK uses the ARN's AWS Region when constructing the endpoint instead of the 
           client's conﬁgured AWS Region. Exception: If the client's conﬁgured AWS Region is a FIPS AWS 
           Region, then it must match the ARN's AWS Region. Otherwise, an error will result.
         •
           false – The SDK uses the client's conﬁgured AWS Region when constructing the endpoint.
      Support by AWS SDKs and tools
      The following SDKs support the features and settings described in this topic. Any partial exceptions 
      are noted. Any JVM system property settings are supported by the AWS SDK for Java and the AWS 
      SDK for Kotlin only.
      Amazon S3 access points                                                                 103
      AWS SDKs and Tools                                                               Reference Guide
        SDK                          SupNotes or more informationported
        AWS CLI v2                 Yes  
        SDK for C++                Yes  
        SDK for Go V2 (1.x)        Yes  
        SDK for Go 1.x (V1)        Yes
                                        To use shared config ﬁle settings, you must turn on loading 
                                        from the conﬁg ﬁle; see Sessions.
        SDK for Java 2.x           Yes  
        SDK for Java 1.x           Yes JVM system property not supported.
        SDK for JavaScript 3.x     Yes  
        SDK for JavaScript 2.x     Yes  
        SDK for Kotlin             Yes  
        SDK for .NET 4.x           Yes  
        SDK for .NET 3.x           Yes
                                        Doesn't follow standard precedence; shared config ﬁle 
                                        value takes precedence over environment variable.
        SDK for PHP 3.x            Yes  
        SDK for Python (Boto3)     Yes  
        SDK for Ruby 3.x           Yes  
        SDK for Rust                No  
        SDK for Swift               No  
        Tools for PowerShell V5    Yes
                                        Doesn't follow standard precedence; shared config ﬁle 
                                        value takes precedence over environment variable.
        Tools for PowerShell V4    Yes
                                        Doesn't follow standard precedence; shared config ﬁle 
                                        value takes precedence over environment variable.
      Amazon S3 access points                                                                 104
      AWS SDKs and Tools                                                          Reference Guide
      Amazon S3 Multi-Region Access Points
           Note
           For help in understanding the layout of settings pages, or in interpreting the Support by 
           AWS SDKs and tools table that follows, see Understanding the settings pages of this guide.
      Amazon S3 Multi-Region Access Points provide a global endpoint that applications can use to fulﬁll 
      requests from Amazon S3 buckets located in multiple AWS Regions. You can use Multi-Region 
      Access Points to build multi-Region applications with the same architecture used in a single Region, 
      and then run those applications anywhere in the world.
      To learn more about Multi-Region Access Points, see Multi-Region Access Points in Amazon S3 in 
      the Amazon S3 User Guide.
      To learn more about Multi-Region Access Point Amazon Resource Names (ARNs), see Making 
      requests using a Multi-Region Access Point in the Amazon S3 User Guide.
      To learn more about creating Multi-Region Access Points, see Managing Multi-Region Access Points
      in the Amazon S3 User Guide.
      The SigV4A algorithm is the signing implementation used to sign the global Region requests. This 
      algorithm is obtained by the SDK through a dependency on the AWS Common Runtime (CRT) 
      libraries.
      Conﬁgure this functionality by using the following:
      s3_disable_multiregion_access_points - shared AWS config ﬁle setting,
      AWS_S3_DISABLE_MULTIREGION_ACCESS_POINTS - environment variable,
      aws.s3DisableMultiRegionAccessPoints - JVM system property: Java/Kotlin only, To 
      conﬁgure value directly in code, consult your speciﬁc SDK directly.
         This setting controls whether the SDK potentially attempts cross-Region requests. If multiply 
         deﬁned, the code-conﬁgured setting takes precedence, followed by the environment variable 
         setting.
         Default value: false
         Valid values:
      Amazon S3 Multi-Region Access Points                                                105
      AWS SDKs and Tools                                                     Reference Guide
        •
          true – Stops the use of cross-Region requests.
        •
          false – Enables cross-Region requests using Multi-Region Access Points.
      Support by AWS SDKs and tools
      The following SDKs support the features and settings described in this topic. Any partial exceptions 
      are noted. Any JVM system property settings are supported by the AWS SDK for Java and the AWS 
      SDK for Kotlin only.
       SDK                       SupNotes or more informationported
       AWS CLI v2              Yes  
       SDK for C++             Yes  
       SDK for Go V2 (1.x)     Yes  
       SDK for Go 1.x (V1)      No  
       SDK for Java 2.x        Yes  
       SDK for Java 1.x         No  
       SDK for JavaScript 3.x  Yes  
       SDK for JavaScript 2.x   No  
       SDK for Kotlin          Yes  
       SDK for .NET 4.x        Yes  
       SDK for .NET 3.x        Yes  
       SDK for PHP 3.x         Yes  
       SDK for Python (Boto3)  Yes  
       SDK for Ruby 3.x        Yes  
       SDK for Rust            Yes  
      Amazon S3 Multi-Region Access Points                                         106
      AWS SDKs and Tools                                                     Reference Guide
       SDK                       SupNotes or more informationported
       SDK for Swift            No  
       Tools for PowerShell V5  Yes  
       Tools for PowerShell V4  Yes  
      AWS Region
          Note
          For help in understanding the layout of settings pages, or in interpreting the Support by 
          AWS SDKs and tools table that follows, see Understanding the settings pages of this guide.
      AWS Regions are an important concept to understand when working with AWS services.
      With AWS Regions, you can access AWS services that physically reside in a speciﬁc geographic 
      area. This can be useful to keep your data and applications running close to where you and your 
      users will access them. Regions provide fault tolerance, stability, and resilience, and can also reduce 
      latency. With Regions, you can create redundant resources that remain available and unaﬀected by 
      a Regional outage.
      Most AWS service requests are associated with a particular geographic region. The resources that 
      you create in one Region do not exist in any other Region unless you explicitly use a replication 
      feature oﬀered by an AWS service. For example, Amazon S3 and Amazon EC2 support cross-Region 
      replication. Some services, such as IAM, do not have Regional resources.
      The AWS General Reference contains information on the following:
      • To understand the relationship between Regions and endpoints, and to view a list of existing 
        Regional endpoints, see AWS service endpoints.
      • To view the current list of all supported Regions and endpoints for each AWS service, see Service 
        endpoints and quotas.
      Creating service clients
      AWS Region                                                                    107
      AWS SDKs and Tools                                                               Reference Guide
      To programmatically access AWS services, SDKs use a client class/object for each AWS service. 
      If your application needs to access Amazon EC2, for example, your application would create an 
      Amazon EC2 client object to interface with that service.
      If no Region is explicitly speciﬁed for the client in the code itself, the client defaults to using the 
      Region that is set through the following region setting. However, the active Region for a client 
      can be explicitly set for any individual client object. Setting the Region in this way takes precedence 
      over any global setting for that particular service client. The alternative Region is speciﬁed during 
      instantiation of that client, speciﬁc to your SDK (check your speciﬁc SDK Guide or your SDK's code 
      base).
      Conﬁgure this functionality by using the following:
      region - shared AWS config ﬁle setting, AWS_REGION - environment variable, aws.region - 
      JVM system property: Java/Kotlin only
         Speciﬁes the default AWS Region to use for AWS requests. This Region is used for SDK service 
         requests that aren't provided with a speciﬁc Region to use.
         Default value: None. You must specify this value explicitly.
         Valid values:
         • Any of the Region codes available for the chosen service, as listed in AWS service endpoints in 
           the AWS General Reference. For example, the value us-east-1 sets the endpoint to the AWS 
           Region US East (N. Virginia).
         •
           aws-global speciﬁes the global endpoint for services that support a separate global 
           endpoint in addition to Regional endpoints, such as AWS Security Token Service (AWS STS) 
           and Amazon Simple Storage Service (Amazon S3).
      Example of setting this value in the config ﬁle:
        [default]
        region = us-west-2
      Linux/macOS example of setting environment variables via command line:
        export AWS_REGION=us-west-2
      Windows example of setting environment variables via command line:
      AWS Region                                                                              108
      AWS SDKs and Tools                                                               Reference Guide
        setx AWS_REGION us-west-2
      Most SDKs have a "conﬁguration" object that is available for setting the default Region from within 
      the application code. For details, see your speciﬁc AWS SDK developer guide.
      Support by AWS SDKs and tools
      The following SDKs support the features and settings described in this topic. Any partial exceptions 
      are noted. Any JVM system property settings are supported by the AWS SDK for Java and the AWS 
      SDK for Kotlin only.
        SDK                          SupNotes or more informationported
        AWS CLI v2                 Yes
                                        AWS CLI v2 uses any value in AWS_REGION  before any value 
                                        in AWS_DEFAULT_REGION      (both variables are checked).
        AWS CLI v1                 Yes
                                        AWS CLI v1 uses environment variable named AWS_DEFAU 
                                        LT_REGION  for this purpose.
        SDK for C++                Yes  
        SDK for Go V2 (1.x)        Yes  
        SDK for Go 1.x (V1)        Yes
                                        To use shared config ﬁle settings, you must turn on loading 
                                        from the conﬁg ﬁle; see Sessions.
        SDK for Java 2.x           Yes  
        SDK for Java 1.x           Yes  
        SDK for JavaScript 3.x     Yes  
        SDK for JavaScript 2.x     Yes  
        SDK for Kotlin             Yes  
        SDK for .NET 4.x           Yes  
        SDK for .NET 3.x           Yes  
      AWS Region                                                                              109
       AWS SDKs and Tools                                                                 Reference Guide
        SDK                           SupNotes or more informationported
        SDK for PHP 3.x              Yes  
        SDK for Python (Boto3)       Yes
                                         This SDK uses environment variable named AWS_DEFAU 
                                         LT_REGION  for this purpose.
        SDK for Ruby 3.x             Yes  
        SDK for Rust                 Yes  
        SDK for Swift                Yes  
        Tools for PowerShell V5      Yes  
        Tools for PowerShell V4      Yes  
       AWS STS Regional endpoints
            Note
            For help in understanding the layout of settings pages, or in interpreting the Support by 
            AWS SDKs and tools table that follows, see Understanding the settings pages of this guide.
       AWS Security Token Service (AWS STS) is available both as a global and Regional 
       service. Some of AWS SDKs and CLIs use the global service endpoint (https://
       sts.amazonaws.com) by default, while some use the Regional service endpoints (https://
       sts.{region_identifier}.{partition_domain}). In Regions that are enabled by default, 
       requests to the AWS STS global endpoint are automatically served in the same Region where 
       the request originates. In opt-in Regions, requests to the AWS STS global endpoint are served 
       by a single AWS Region, US East (N. Virginia). For more information on AWS STS endpoints, see
       Endpoints in the AWS Security Token Service API Reference or Manage AWS STS in an AWS Region in 
       the AWS Identity and Access Management User Guide.
       It is an AWS best practice to use Regional endpoints whenever possible and to conﬁgure your AWS 
       Region. Customers in partitions other than commercial must use Regional endpoints. Not all SDKs 
       AWS STS Regional endpoints                                                                 110
      AWS SDKs and Tools                                                              Reference Guide
      and tools support this setting, but all have deﬁned behavior around global and Regional endpoints. 
      See the following section for more information.
           Note
           AWS has made changes to the AWS Security Token Service (AWS STS) global endpoint 
           (https://sts.amazonaws.com) in Regions enabled by default to enhance its resiliency 
           and performance. AWS STS requests to the global endpoint are automatically served in 
           the same AWS Region as your workloads. These changes will not be deployed to opt-in 
           Regions. We recommend that you use the appropriate AWS STS regional endpoints. For 
           more information, see AWS STS global endpoint changes in the AWS Identity and Access 
           Management User Guide.
      For SDKs and tools that support this setting, customers can conﬁgure the functionality by using the 
      following:
      sts_regional_endpoints - shared AWS config ﬁle setting,
      AWS_STS_REGIONAL_ENDPOINTS - environment variable
         This setting speciﬁes how the SDK or tool determines the AWS service endpoint that it uses to 
         talk to the AWS Security Token Service (AWS STS).
         Default value: legacy
              Note
              All new SDK major versions releasing after July 2022 will default to regional. New 
              SDK major versions might remove this setting and use regional behavior. To reduce 
              future impact regarding this change, we recommend you start using regional in your 
              application when possible.
         Valid values:   (Recommended value: regional)
         •
           legacy – Uses the global AWS STS endpoint, sts.amazonaws.com.
         •
           regional – The SDK or tool always uses the AWS STS endpoint for the currently conﬁgured 
           Region. For example, if the client is conﬁgured to use us-west-2, all calls to AWS STS are 
           made to the Regional endpoint sts.us-west-2.amazonaws.com, instead of the global
      AWS STS Regional endpoints                                                             111
      AWS SDKs and Tools                                                               Reference Guide
           sts.amazonaws.com endpoint. To send a request to the global endpoint while this setting is 
           enabled, you can set the Region to aws-global.
         Example of setting these values in the config ﬁle:
           [default]
           sts_regional_endpoints = regional
         Linux/macOS example of setting environment variables via command line:
           export AWS_STS_REGIONAL_ENDPOINTS=regional
         Windows example of setting environment variables via command line:
           setx AWS_STS_REGIONAL_ENDPOINTS regional
      Support by AWS SDKs and tools
           Note
           It is an AWS best practice to use Regional endpoints whenever possible and to conﬁgure 
           your AWS Region.
      The table that follows summarizes, for your SDK or tool:
      •
        Supports setting: Whether the shared config ﬁle variable and environment variable for STS 
        Regional endpoints are supported.
      • Default setting value: The default value of the setting if it is supported.
      • Default service client target STS Endpoint: What default endpoint is used by the client even if 
        the setting to change it is not available.
      • Service client fallback behavior: What the SDK does when it is supposed to use a Regional 
        endpoint but no Region has been conﬁgured. This is the behavior regardless of if it is using a 
        Regional endpoint because of a default or because regional has been selected by the setting.
      The table also uses the following values:
      AWS STS Regional endpoints                                                              112
            AWS SDKs and Tools                                                                                                                                    Reference Guide
            •
               Global endpoint: https://sts.amazonaws.com.
            • Regional endpoint: Based on the conﬁgured AWS Region used by your application.
            •
               us-east-1 (Regional): Uses the us-east-1 Region endpoint but with longer session tokens 
               than typical global requests.
              SDK                         SuDefault pports              Default                     Service                    Notes or more information
                                          sestettintigng                service                     client 
                                             value                      client                      fallback 
                                                                        target STS                  behavior
                                                                        Endpoint
              AWS CLI v2               NoN/A                            Regional                    Global                      
                                                                        endpoint                    endpoint
              AWS CLI v1               Yes                              Global                      Global                      
                                             legacy
                                                                        endpoint                    endpoint
              SDK for C++              NoN/A                            Regional                                                
                                                                                                    us-east-1
                                                                        endpoint
                                                                                                    (Regional)
              SDK for Go               NoN/A                            Regional                    Request                     
              V2 (1.x)                                                  endpoint                    failure
              SDK for Go               Yes                              Global                      Global 
                                             legacy                                                                            To use shared config ﬁle 
              1.x (V1)                                                  endpoint                    endpoint
                                                                                                                               settings, you must turn on 
                                                                                                                               loading from the conﬁg ﬁle; 
                                                                                                                               see Sessions.
              SDK for Java  NoN/A                                       Regional                    Request                    If no Region is conﬁgure 
              2.x                                                       endpoint                    failure
                                                                                                                               d, the AssumeRole  and
                                                                                                                               AssumeRoleWithWebI 
                                                                                                                               dentity  will use the global 
                                                                                                                               STS endpoint.
              SDK for Java  Yes                                         Global                      Global                      
                                             legacy
              1.x                                                       endpoint                    endpoint
            AWS STS Regional endpoints                                                                                                                                          113
            AWS SDKs and Tools                                                                                                                                    Reference Guide
              SDK                         SuDefault pports              Default                     Service                    Notes or more information
                                          sestettintigng                service                     client 
                                             value                      client                      fallback 
                                                                        target STS                  behavior
                                                                        Endpoint
              SDK for                  NoN/A                            Regional                    Request                     
              JavaScript                                                endpoint                    failure
              3.x
              SDK for                  Yes                              Global                      Global                      
                                             legacy
              JavaScript                                                endpoint                    endpoint
              2.x
              SDK for                  NoN/A                            Regional                    Global                      
              Kotlin                                                    endpoint                    endpoint
              SDK for .NET  NoN/A                                       Regional                                                
                                                                                                    us-east-1
              4.x                                                       endpoint
                                                                                                    (Regional)
              SDK for .NET  Yes                                         Global                      Global                      
                                             legacy
              3.x                                                       endpoint                    endpoint
              SDK for PHP  Yes                                          Global                      Request                     
                                             legacy
              3.x                                                       endpoint                    failure
              SDK for                  Yes                              Global                      Global                      
                                             legacy
              Python                                                    endpoint                    endpoint
              (Boto3)
              SDK for Ruby  Yes                                         Regional                    Request                     
                                             regional
              3.x                                                       endpoint                    failure
              SDK for Rust             NoN/A                            Regional                    Request                     
                                                                        endpoint                    failure
              SDK for Swift NoN/A                                       Regional                    Request                     
                                                                        endpoint                    failure
            AWS STS Regional endpoints                                                                                                                                          114
            AWS SDKs and Tools                                                                                                                                    Reference Guide
              SDK                         SuDefault pports              Default                     Service                    Notes or more information
                                          sestettintigng                service                     client 
                                             value                      client                      fallback 
                                                                        target STS                  behavior
                                                                        Endpoint
              Tools for                Yes                              Global                      Global                      
                                             legacy
              PowerShell                                                endpoint                    endpoint
              V5
              Tools for                Yes                              Global                      Global                      
                                             legacy
              PowerShell                                                endpoint                    endpoint
              V4
            Data Integrity Protections for Amazon S3
                     Note
                     For help in understanding the layout of settings pages, or in interpreting the Support by 
                     AWS SDKs and tools table that follows, see Understanding the settings pages of this guide.
            For some time, AWS SDKs have supported data integrity checks when uploading data to or 
            downloading data from Amazon Simple Storage Service. Previously, these checks were opt-
            in. Now, we've enabled these checks by default, using CRC-based algorithms such as CRC32 or 
            CRC64NVME. Although each SDK or tool has a default algorithm, you can choose a diﬀerent 
            algorithm. You can also continue to still manually supply a pre-calculated checksum for uploads 
            if you want. Consistent behavior across uploads, multipart uploads, downloads, and encryption 
            modes simpliﬁes client-side integrity checks.
            The latest versions of our AWS SDKs and AWS CLI automatically calculate a cyclic redundancy 
            check (CRC)-based checksum for each upload and sends it to Amazon S3. Amazon S3 
            independently calculates a checksum on the server side and validates it against the provided 
            value before durably storing the object and its checksum in the object's metadata. By storing 
            the checksum in the metadata alongside the object, when the object is downloaded, the same 
            checksum can be automatically returned and used to validate downloads as well. You can also 
            verify the checksum stored in the object's metadata at any time.
            Data Integrity Protections                                                                                                                                          115
      AWS SDKs and Tools                                                          Reference Guide
      To learn more about checksum operations, multipart uploads, or the list of supported checksum 
      algorithms, see Checking object integrity in Amazon S3 in the Amazon Simple Storage Service User 
      Guide.
      Multipart uploads:
      Amazon S3 also provides developers with consistent full object checksums across single part and 
      multipart uploads.
      When uploading ﬁles in multiple parts, the SDKs calculate checksums for each part. Amazon 
      S3 uses these checksums to verify the integrity of each part through the UploadPart API. 
      Additionally, Amazon S3 validates the entire ﬁle's size and checksum when you call the
      CompleteMultipartUpload API.
      If your SDK has an Amazon S3 Transfer Manager to assist with multipart uploads, the checksums 
      are validated for the parts using the SDK-speciﬁc default algorithm found in the Support by AWS 
      SDKs and tools table. You can opt-in to a full object checksum by setting setting checksum_type
      to FULL_OBJECT or by choosing to use the CRC64NVME algorithm.
      If you are using an older version of SDK or AWS CLI:
      If your application uses a version prior to December 2024 of the SDK or tool, Amazon S3 still 
      computes a CRC64NVME checksum on new objects and stores it in the object metadata for future 
      reference. You can later compare the stored CRC with a CRC computed on your side and verify 
      the network transmission was correct. Also, you can still manually extend the integrity protection 
      by providing your own precomputed checksums with your PutObject or UploadPart requests, 
      which is the standard technique for addressing this in older versions.
      Conﬁgure this functionality by using the following:
      request_checksum_calculation - shared AWS config ﬁle setting,
      AWS_REQUEST_CHECKSUM_CALCULATION - environment variable,
      aws.requestChecksumCalculation - JVM system property: Java/Kotlin only
         By default, users are opted-in to calculating a request checksum when sending a request. The 
         user can choose any of the available checksum algorithms as a part of building the request. 
         Otherwise, an SDK-speciﬁc default algorithm is used. See the Support by AWS SDKs and tools
         table for the default algorithm for each SDK or tool.
         Default value: WHEN_SUPPORTED
      Data Integrity Protections                                                          116
      AWS SDKs and Tools                                                          Reference Guide
         Valid values:
         •
           WHEN_SUPPORTED – Checksum validation is performed on all response payloads when 
           supported by the API operation, such as data transfers to Amazon S3.
         •
           WHEN_REQUIRED – Checksum validation is performed only when required by the API 
           operation.
      response_checksum_validation - shared AWS config ﬁle setting,
      AWS_RESPONSE_CHECKSUM_VALIDATION - environment variable,
      aws.responseChecksumValidation - JVM system property: Java/Kotlin only
         By default, users are opted-in to a response checksum validation when sending a request. A 
         checksum is calculated for the response payload and compared against the checksum response 
         header. If checksum validation fails, an error is raised to the user when the payload is read.
         The checksum response header also indicates the algorithm for the checksum. The Amazon S3 
         client attempts to validate response checksums for all Amazon S3 API operations that support 
         checksums. However, if the SDK has not implemented the speciﬁed checksum algorithm then 
         this validation is skipped.
         Default value: WHEN_SUPPORTED
         Valid values:
         •
           WHEN_SUPPORTED – Checksum validation is performed on all response payloads when 
           supported by the API operation, such as data transfers to Amazon S3.
         •
           WHEN_REQUIRED – Checksum validation is performed only when supported by the API 
           operation and the caller has explicitly enabled checksum for the operation. For example, 
           when the Amazon S3 GetObject API is called and the ChecksumMode parameter is set to 
           enabled.
      Support by AWS SDKs and tools
      The following SDKs support the features and settings described in this topic. Any partial exceptions 
      are noted. Any JVM system property settings are supported by the AWS SDK for Java and the AWS 
      SDK for Kotlin only.
      Data Integrity Protections                                                          117
      AWS SDKs and Tools                                                              Reference Guide
           Note
           In the following table, 'CRT' refers to the AWS Common Runtime (CRT) libraries and might 
           require adding an additional dependency to your project.
        SDK             SupporDefault ted      Supported checksum     Notes or more informati 
                               checksum        algorithms             on
                               algorithm
        AWS CLI v2       Yes   CRC64NVME       CRC64NVME, CRC32,      For AWS CLI v1, the 
                                               CRC32C, SHA1,          default algorithm and the 
                                               SHA256                 supported algorithms will 
                                                                      be identical to Python 
                                                                      (Boto3).
        SDK for C++      Yes   CRC64NVME       CRC64NVME, CRC32,       
                                               CRC32C, SHA1, 
                                               SHA256
        SDK for Go V2    Yes   CRC32           CRC64NVME, CRC32,       
        (1.x)                                  CRC32C, SHA1, 
                                               SHA256
        SDK for Go 1.x   No                                            
        (V1)
        SDK for Java     Yes   CRC32           CRC64NVME (via CRT      
        2.x                                    only), CRC32, CRC32C, 
                                               SHA1, SHA256
        SDK for Java     No                                            
        1.x
        SDK for          Yes   CRC32           CRC32, CRC32C,          
        JavaScript 3.x                         SHA1, SHA256
      Data Integrity Protections                                                             118
           AWS SDKs and Tools                                                                                                                      Reference Guide
             SDK                         SupporDefault ted                       Supported checksum                     Notes or more informati 
                                                    checksum                     algorithms                             on
                                                    algorithm
             SDK for                       No                                                                            
             JavaScript 2.x
             SDK for Kotlin               Yes       CRC32                        CRC32, CRC32C,                          
                                                                                 SHA1, SHA256
             SDK for .NET                 Yes       CRC32                        CRC32, CRC32C,                          
             4.x                                                                 SHA1, SHA256
             SDK for .NET                 Yes       CRC32                        CRC32, CRC32C,                          
             3.x                                                                 SHA1, SHA256
             SDK for PHP                  Yes       CRC32                        CRC32, CRC32C (via 
                                                                                                                        awscrt extension is 
             3.x                                                                 CRT only), SHA1, 
                                                                                                                        required in order to use 
                                                                                 SHA256
                                                                                                                        CRC32C.
             SDK for Python               Yes       CRC32                        CRC64NVME (via CRT                      
             (Boto3)                                                             only), CRC32, CRC32C 
                                                                                 (via CRT only), SHA1, 
                                                                                 SHA256
             SDK for Ruby                 Yes       CRC32                        CRC64NVME (via CRT                      
             3.x                                                                 only), CRC32, CRC32C 
                                                                                 (via CRT only), SHA1, 
                                                                                 SHA256
             SDK for Rust                 Yes       CRC32                        CRC64NVME, CRC32,                       
                                                                                 CRC32C, SHA1, 
                                                                                 SHA256
             SDK for Swift                Yes       CRC32                        CRC64NVME, CRC32,                      CRT dependency required 
                                                                                 CRC32C, SHA1,                          for all algorithms.
                                                                                 SHA256
           Data Integrity Protections                                                                                                                           119
           AWS SDKs and Tools                                                                                                                      Reference Guide
             SDK                         SupporDefault ted                       Supported checksum                     Notes or more informati 
                                                    checksum                     algorithms                             on
                                                    algorithm
             Tools for                    Yes       CRC32                        CRC32, CRC32C,                          
             PowerShell V5                                                       SHA1, SHA256
             Tools for                    Yes       CRC32                        CRC32, CRC32C,                          
             PowerShell V4                                                       SHA1, SHA256
           Dual-stack and FIPS endpoints
                   Note
                   For help in understanding the layout of settings pages, or in interpreting the Support by 
                   AWS SDKs and tools table that follows, see Understanding the settings pages of this guide.
           Conﬁgure this functionality by using the following:
           use_dualstack_endpoint - shared AWS config ﬁle setting,
           AWS_USE_DUALSTACK_ENDPOINT - environment variable, aws.useDualstackEndpoint - JVM 
           system property: Java/Kotlin only
                Turns on or oﬀ whether the SDK will send requests to dual-stack endpoints. To learn more 
                about dual-stack endpoints, which support both IPv4 and IPv6 traﬃc, see Using Amazon S3 
                dual-stack endpoints in the Amazon Simple Storage Service User Guide. Dual-stack endpoints are 
                available for some services in some regions.
                Default value: false
                Valid values:
                •
                   true – The SDK or tool will attempt to use dual-stack endpoints to make network requests. If 
                   a dual-stack endpoint does not exist for the service and/or AWS Region, the request will fail.
                •
                   false – The SDK or tool will not use dual-stack endpoints to make network requests.
           Dual-stack and FIPS endpoints                                                                                                                        120
      AWS SDKs and Tools                                                               Reference Guide
      use_fips_endpoint - shared AWS config ﬁle setting, AWS_USE_FIPS_ENDPOINT - 
      environment variable, aws.useFipsEndpoint - JVM system property: Java/Kotlin only
         Turns on or oﬀ whether the SDK or tool will send requests to FIPS-compliant endpoints. 
         The Federal Information Processing Standards (FIPS) are a set of US Government security 
         requirements for data and its encryption. Government agencies, partners, and those wanting 
         to do business with the federal government are required to adhere to FIPS guidelines. Unlike 
         standard AWS endpoints, FIPS endpoints use a TLS software library that complies with FIPS 
         140-2. If this setting is enabled and a FIPS endpoint does not exist for the service in your AWS 
         Region, the AWS call may fail. Service-speciﬁc endpoints and the --endpoint-url option for 
         the AWS Command Line Interface override this setting.
         To learn more about other ways to specify FIPS endpoints by AWS Region, see FIPS Endpoints 
         by Service. For more information on Amazon Elastic Compute Cloud service endpoints, see
         Dual-stack (IPv4 and IPv6) endpoints in the Amazon EC2 API Reference.
         Default value: false
         Valid values:
         •
           true – The SDK or tool will send requests to FIPS-compliant endpoints.
         •
           false – The SDK or tool will not send requests to FIPS-compliant endpoints.
      Support by AWS SDKs and tools
      The following SDKs support the features and settings described in this topic. Any partial exceptions 
      are noted. Any JVM system property settings are supported by the AWS SDK for Java and the AWS 
      SDK for Kotlin only.
        SDK                          SupNotes or more informationported
        AWS CLI v2                 Yes  
        SDK for C++                Yes  
        SDK for Go V2 (1.x)        Yes  
        SDK for Go 1.x (V1)        Yes
                                        To use shared config ﬁle settings, you must turn on loading 
                                        from the conﬁg ﬁle; see Sessions.
      Dual-stack and FIPS endpoints                                                           121
      AWS SDKs and Tools                                                     Reference Guide
       SDK                       SupNotes or more informationported
       SDK for Java 2.x         Yes  
       SDK for Java 1.x         No  
       SDK for JavaScript 3.x   Yes  
       SDK for JavaScript 2.x   Yes  
       SDK for Kotlin           Yes  
       SDK for .NET 4.x         Yes  
       SDK for .NET 3.x         Yes  
       SDK for PHP 3.x          Yes  
       SDK for Python (Boto3)   Yes  
       SDK for Ruby 3.x         Yes  
       SDK for Rust             Yes  
       SDK for Swift            Yes  
       Tools for PowerShell V5  Yes  
       Tools for PowerShell V4  Yes  
      Endpoint discovery
          Note
          For help in understanding the layout of settings pages, or in interpreting the Support by 
          AWS SDKs and tools table that follows, see Understanding the settings pages of this guide.
      SDKs use endpoint discovery to access service endpoints (URLs to access various resources), 
      while still maintaining ﬂexibility for AWS to alter URLs as needed. This way, your code can 
      Endpoint discovery                                                            122
      AWS SDKs and Tools                                                           Reference Guide
      automatically detect new endpoints. There are no ﬁxed endpoints for some services. Instead, you 
      get the available endpoints during runtime by making a request to get the endpoints ﬁrst. After 
      retrieving the available endpoints, the code then uses the endpoint to access other operations. 
      For example, for Amazon Timestream, the SDK makes a DescribeEndpoints request to retrieve 
      the available endpoints, and then uses those endpoints to complete speciﬁc operations such as
      CreateDatabase or CreateTable.
      Conﬁgure this functionality by using the following:
      endpoint_discovery_enabled - shared AWS config ﬁle setting,
      AWS_ENABLE_ENDPOINT_DISCOVERY - environment variable,
      aws.endpointDiscoveryEnabled - JVM system property: Java/Kotlin only, To conﬁgure 
      value directly in code, consult your speciﬁc SDK directly.
         Turns on or oﬀ endpoint discovery for DynamoDB.
         Endpoint discovery is required in Timestream and optional in Amazon DynamoDB. This 
         setting defaults to either true or false depending on whether the service requires endpoint 
         discovery. Timestream requests default to true, and Amazon DynamoDB requests default to
         false.
         Valid values:
         •
           true – The SDK should automatically attempt to discover an endpoint for services where 
           endpoint discovery is optional.
         •
           false – The SDK should not automatically attempt to discover an endpoint for services 
           where endpoint discovery is optional.
      Support by AWS SDKs and tools
      The following SDKs support the features and settings described in this topic. Any partial exceptions 
      are noted. Any JVM system property settings are supported by the AWS SDK for Java and the AWS 
      SDK for Kotlin only.
        SDK                        SupNotes or more informationported
        AWS CLI v2                Yes  
        SDK for C++               Yes  
      Endpoint discovery                                                                  123
      AWS SDKs and Tools                                                               Reference Guide
        SDK                          SupNotes or more informationported
        SDK for Go V2 (1.x)        Yes  
        SDK for Go 1.x (V1)        Yes
                                        To use shared config ﬁle settings, you must turn on loading 
                                        from the conﬁg ﬁle; see Sessions.
        SDK for Java 2.x           Yes
                                        The SDK for Java 2.x uses AWS_ENDPOINT_DISCO 
                                        VERY_ENABLED  for the environment variable name.
        SDK for Java 1.x          PartialJVM system property not supported.
        SDK for JavaScript 3.x     Yes  
        SDK for JavaScript 2.x     Yes  
        SDK for Kotlin             Yes  
        SDK for .NET 4.x           Yes  
        SDK for .NET 3.x           Yes  
        SDK for PHP 3.x            Yes  
        SDK for Python (Boto3)     Yes  
        SDK for Ruby 3.x           Yes  
        SDK for Rust              PartialSupported for Timestream only.
        SDK for Swift               No  
        Tools for PowerShell V5    Yes  
        Tools for PowerShell V4    Yes  
      Endpoint discovery                                                                      124
      AWS SDKs and Tools                                                               Reference Guide
      General conﬁguration settings
           Note
           For help in understanding the layout of settings pages, or in interpreting the Support by 
           AWS SDKs and tools table that follows, see Understanding the settings pages of this guide.
      SDKs support some general settings that conﬁgure overall SDK behaviors.
      Conﬁgure this functionality by using the following:
      api_versions - shared AWS config ﬁle setting
         Some AWS services maintain multiple API versions to support backward compatibility. By 
         default, SDK and AWS CLI operations use the latest available API version. To require a speciﬁc 
         API version to use for your requests, include the api_versions setting in your proﬁle.
         Default value: None. (Latest API version is used by the SDK.)
         Valid values: This is a nested setting that's followed by one or more indented lines that each 
         identify one AWS service and the API version to use. See the documentation for the AWS service 
         to understand which API versions are available.
         The example sets a speciﬁc API version for two AWS services in the config ﬁle. These API 
         versions are used only for commands that run under the proﬁle that contains these settings. 
         Commands for any other service use the latest version of that service's API.
           api_versions = 
               ec2 = 2015-03-01
               cloudfront = 2015-09-017
      ca_bundle - shared AWS config ﬁle setting, AWS_CA_BUNDLE - environment variable
         Speciﬁes the path to a custom certiﬁcate bundle (a ﬁle with a .pem extension) to use when 
         establishing SSL/TLS connections.
         Default value: none
      General conﬁguration                                                                    125
      AWS SDKs and Tools                                                               Reference Guide
         Valid values: Specify either the full path or a base ﬁle name. If there is a base ﬁle name, 
         the system attempts to ﬁnd the program within folders speciﬁed by the PATH environment 
         variable.
         Example of setting this value in the config ﬁle:
           [default]
           ca_bundle = dev/apps/ca-certs/cabundle-2019mar05.pem
         Due to diﬀerences in how operating systems handle paths and escaping of path characters, the 
         following is an example of setting this value in the config ﬁle on Windows:
           [default]
           ca_bundle = C:\\Users\\username\\.aws\\aws-custom-bundle.pem
         Linux/macOS example of setting environment variables via command line:
           export AWS_CA_BUNDLE=/dev/apps/ca-certs/cabundle-2019mar05.pem
         Windows example of setting environment variables via command line:
           setx AWS_CA_BUNDLE C:\dev\apps\ca-certs\cabundle-2019mar05.pem
      output - shared AWS config ﬁle setting
         Speciﬁes how results are formatted in the AWS CLI and other AWS SDKs and tools.
         Default value: json
         Valid values:
         •
           json – The output is formatted as a JSON string.
         •
           yaml – The output is formatted as a YAML string.
         •
           yaml-stream – The output is streamed and formatted as a YAML string. Streaming allows 
           for faster handling of large data types.
         •
           text – The output is formatted as multiple lines of tab-separated string values. This can be 
           useful to pass the output to a text processor, like grep, sed, or awk.
         •
           table – The output is formatted as a table using the characters +|- to form the cell borders. 
           It typically presents the information in a "human-friendly" format that is much easier to read 
           than the others, but not as programmatically useful.
      General conﬁguration                                                                    126
      AWS SDKs and Tools                                                          Reference Guide
      parameter_validation - shared AWS config ﬁle setting
         Speciﬁes whether the SDK or tool attempts to validate command line parameters before 
         sending them to the AWS service endpoint.
         Default value: true
         Valid values:
         •
           true – The default. The SDK or tool performs client-side validation of command line 
           parameters. This helps the SDK or tool conﬁrm that parameters are valid, and catches some 
           errors. The SDK or tool can reject requests that aren't valid before sending requests to the 
           AWS service endpoint.
         •
           false – The SDK or tool doesn't validate command line parameters before sending them to 
           the AWS service endpoint. The AWS service endpoint is responsible for validating all requests 
           and rejecting requests that aren't valid.
      Support by AWS SDKs and tools
      The following SDKs support the features and settings described in this topic. Any partial exceptions 
      are noted. Any JVM system property settings are supported by the AWS SDK for Java and the AWS 
      SDK for Kotlin only.
       SDK                         SupNotes or more informationported
       AWS CLI v2               Partial
                                      api_versions  not supported.
       SDK for C++                Yes  
       SDK for Go V2 (1.x)      Partial
                                      api_versions  and parameter_validation       not 
                                      supported.
       SDK for Go 1.x (V1)      Partial
                                      api_versions  and parameter_validation       not 
                                      supported. To use shared config ﬁle settings, you must turn 
                                      on loading from the conﬁg ﬁle; see Sessions.
       SDK for Java 2.x           No  
       SDK for Java 1.x           No  
      General conﬁguration                                                                127
       AWS SDKs and Tools                                                                        Reference Guide
         SDK                             SupNotes or more informationported
         SDK for JavaScript 3.x         Yes  
         SDK for JavaScript 2.x         Yes  
         SDK for Kotlin                 No  
         SDK for .NET 4.x               No  
         SDK for .NET 3.x               No  
         SDK for PHP 3.x                Yes  
         SDK for Python (Boto3)         Yes  
         SDK for Ruby 3.x               Yes  
         SDK for Rust                   No  
         SDK for Swift                  No  
         Tools for PowerShell V5        No  
         Tools for PowerShell V4        No  
       Host preﬁx injection
             Note
             For help in understanding the layout of settings pages, or in interpreting the Support by 
             AWS SDKs and tools table that follows, see Understanding the settings pages of this guide.
       Host preﬁx injection is a feature where AWS SDKs automatically prepend a preﬁx to the hostname 
       of service endpoints for certain API operations. This preﬁx can be either a static string or a dynamic 
       value that includes data from your request parameters.
       For example, when using Amazon Simple Storage Service to perform actions on Amazon S3 objects 
       or buckets, the SDK replaces your bucket name and AWS account ID in the ﬁnal API endpoint.
       Host preﬁx injection                                                                              128
      AWS SDKs and Tools                                                               Reference Guide
      While this behavior is required for normal AWS service endpoints, it can cause problems when 
      using custom endpoints such as VPC endpoints or local testing tools. In these cases, you might 
      need to disable host preﬁx injection.
      Conﬁgure this functionality by using the following:
      disable_host_prefix_injection - shared AWS config ﬁle setting,
      AWS_DISABLE_HOST_PREFIX_INJECTION - environment variable,
      aws.disableHostPrefixInjection - JVM system property: Java/Kotlin only
         This setting controls whether the SDK or tool will modify the endpoint hostname by prepending 
         a host preﬁx as deﬁned in your SDK's client object or variable.
         Default value: false
         Valid values:
         •
           true – Disable host preﬁx injection. The SDK will not modify the endpoint hostname.
         •
           false – Enable host preﬁx injection. The SDK will prepend the host preﬁx to the endpoint 
           hostname.
      Example of setting this value in the config ﬁle:
        [default]
        disable_host_prefix_injection = true
      Linux/macOS example of setting environment variables via command line:
        export AWS_DISABLE_HOST_PREFIX_INJECTION=true
      Windows example of setting environment variables via command line:
        setx AWS_DISABLE_HOST_PREFIX_INJECTION true
      Examples of host preﬁx injection
      The following table of examples show how SDKs modify the ﬁnal endpoint when host preﬁx 
      injection is enabled and disabled.
      Host preﬁx injection                                                                    129
       AWS SDKs and Tools                                                                Reference Guide
       • Host preﬁx: The template of the host preﬁx property string set on the SDK's client object or 
         variable in code.
       • Inputs: Additional inputs set on the SDK's client object or variable in code.
       • Client endpoint: The client's derived endpoint.
       • Setting value: Resolved value for the previous setting.
       • Resulting endpoint: The resulting endpoint the SDK client uses to make the API call.
        Host preﬁx        Inputs             Client endpoint    Setting value     Resulting 
                                                                                  endpoint
        "data."           {}                 "https://          false             "https:// 
                                             service.u                            data.service.us-
                                             s-west-2.                            west-2.amaz 
                                             amazonaws                            onaws.com"
                                             .com"
        "{Bucket}-        Bucket: "amzn-     "https://          false             "https://amzn-
        {AccountId}."     s3-demo-buck       service.u                            s3-demo-bucke 
                          et1", AccountId    s-west-2.                            t1-123456 
                          :"1234567          amazonaws                            789012.se 
                          89012"             .com"                                rvice.us- 
                                                                                  west-2.am 
                                                                                  azonaws.com"
        "data."           {}                 "https://          true              "https:// 
                                             override.                            override. 
                                             us-west-2                            us-west-2 
                                             .amazonaw                            .amazonaw 
                                             s.com" (as                           s.com"
                                             an override 
                                             endpoint)
       Host preﬁx injection                                                                      130
      AWS SDKs and Tools                                                              Reference Guide
      Support by AWS SDKs and tools
      The following SDKs support the features and settings described in this topic. Any partial exceptions 
      are noted. Any JVM system property settings are supported by the AWS SDK for Java and the AWS 
      SDK for Kotlin only.
        SDK                         SupNotes or more informationported
        AWS CLI v2                 Yes  
        SDK for C++                No Setting not supported, but can be conﬁgured in code on the 
                                       client using: enableHostPrefixInjection     .
        SDK for Go V2 (1.x)        No Can be disabled using middleware.
        SDK for Go 1.x (V1)        No  
        SDK for Java 2.x           No Setting not supported, but can be conﬁgured in code on 
                                       the client using: SdkAdvancedClientOption.DIS 
                                       ABLE_HOST_PREFIX_INJECTION         .
        SDK for Java 1.x           No Setting not supported, but can be conﬁgured in code on the 
                                       client using: withDisableHostPrefixInjection       .
        SDK for JavaScript 3.x     No Setting not supported, but can be conﬁgured in code on the 
                                       client using: disableHostPrefix .
        SDK for JavaScript 2.x     No Setting not supported, but can be conﬁgured in code on the 
                                       client using: hostPrefixEnabled .
        SDK for Kotlin             No  
        SDK for .NET 4.x           No Setting not supported, but can be conﬁgured in code on the 
                                       client using: DisableHostPrefixInjection     .
        SDK for .NET 3.x           No Setting not supported, but can be conﬁgured in code on the 
                                       client using: DisableHostPrefixInjection     .
        SDK for PHP 3.x            No Setting not supported, but can be conﬁgured in code on the 
                                       client using: disable_host_prefix_injection       .
      Host preﬁx injection                                                                   131
       AWS SDKs and Tools                                                                 Reference Guide
        SDK                           SupNotes or more informationported
        SDK for Python (Boto3)       Yes
                                         Can be conﬁgured in code on the client using: inject_ho 
                                         st_prefix .
        SDK for Ruby 3.x             No Setting not supported, but can be conﬁgured in code on the 
                                         client using: disable_host_prefix_injection         .
        SDK for Rust                 No  
        SDK for Swift                No  
        Tools for PowerShell V5      No Setting not supported, but can be included in speciﬁc 
                                         cmdlets using parameter -ClientConfig @{Disable 
                                         HostPrefixInjection = $true}           .
        Tools for PowerShell V4      No Setting not supported, but can be included in speciﬁc 
                                         cmdlets using parameter -ClientConfig @{Disable 
                                         HostPrefixInjection = $true}           .
       IMDS client
            Note
            For help in understanding the layout of settings pages, or in interpreting the Support by 
            AWS SDKs and tools table that follows, see Understanding the settings pages of this guide.
       SDKs implement an Instance Metadata Service Version 2 (IMDSv2) client using session-oriented 
       requests. For more information on IMDSv2, see Use IMDSv2 in the Amazon EC2 User Guide. The 
       IMDS client is conﬁgurable via a client conﬁguration object available in the SDK code base.
       Conﬁgure this functionality by using the following:
       retries - client conﬁguration object member
          The number of additional retry attempts for any failed request.
          Default value: 3
       IMDS client                                                                                132
      AWS SDKs and Tools                                                               Reference Guide
         Valid values: Number greater than 0.
      port - client conﬁguration object member
         The port for the endpoint.
         Default value: 80
         Valid values: Number.
      token_ttl - client conﬁguration object member
         The TTL of the token.
         Default value: 21,600 seconds (6 hours, the maximum time allotted).
         Valid values: Number.
      endpoint - client conﬁguration object member
         The endpoint of IMDS.
         Default value: If endpoint_mode equals IPv4, then default endpoint is
         http://169.254.169.254. If endpoint_mode equals IPv6, then default endpoint is
         http://[fd00:ec2::254].
         Valid values: Valid URI.
      The following options are supported by most SDKs. See your speciﬁc SDK code base for details.
      endpoint_mode - client conﬁguration object member
         The endpoint mode of IMDS.
         Default value: IPv4
         Valid values: IPv4, IPv6
      http_open_timeout - client conﬁguration object member (name may vary)
         The number of seconds to wait for the connection to open.
         Default value: 1 second.
      IMDS client                                                                             133
      AWS SDKs and Tools                                                              Reference Guide
         Valid values: Number greater than 0.
      http_read_timeout - client conﬁguration object member (name may vary)
         The number of seconds for one chunk of data to be read.
         Default value: 1 second.
         Valid values: Number greater than 0.
      http_debug_output - client conﬁguration object member (name may vary)
         Sets an output stream for debugging.
         Default value: None.
         Valid values: A valid I/O stream, like STDOUT.
      backoff - client conﬁguration object member (name may vary)
         The number of seconds to sleep in between retries or a customer provided backoﬀ function to 
         call. This overrides the default exponential backoﬀ strategy.
         Default value: Varies by SDK.
         Valid values: Varies by SDK. Can be either a numeric value or a call out to a custom function.
      Support by AWS SDKs and tools
      The following SDKs support the features and settings described in this topic. Any partial exceptions 
      are noted. Any JVM system property settings are supported by the AWS SDK for Java and the AWS 
      SDK for Kotlin only.
        SDK                         SupNotes or more informationported
        AWS CLI v2                 Yes  
        SDK for C++                No  
        SDK for Go V2 (1.x)        Yes  
        SDK for Go 1.x (V1)        Yes  
      IMDS client                                                                            134
       AWS SDKs and Tools                                                                        Reference Guide
         SDK                             SupNotes or more informationported
         SDK for Java 2.x               Yes  
         SDK for Java 1.x               Yes  
         SDK for JavaScript 3.x         Yes  
         SDK for JavaScript 2.x         Yes  
         SDK for Kotlin                 No  
         SDK for .NET 4.x               Yes  
         SDK for .NET 3.x               Yes  
         SDK for PHP 3.x                Yes  
         SDK for Python (Boto3)         Yes  
         SDK for Ruby 3.x               Yes  
         SDK for Rust                   Yes  
         SDK for Swift                  Yes  
         Tools for PowerShell V5        Yes  
         Tools for PowerShell V4        Yes  
       Retry behavior
             Note
             For help in understanding the layout of settings pages, or in interpreting the Support by 
             AWS SDKs and tools table that follows, see Understanding the settings pages of this guide.
       Retry behavior includes settings regarding how the SDKs attempt to recover from failures resulting 
       from requests made to AWS services.
       Retry behavior                                                                                    135
      AWS SDKs and Tools                                                              Reference Guide
      Conﬁgure this functionality by using the following:
      retry_mode - shared AWS config ﬁle setting, AWS_RETRY_MODE - environment variable,
      aws.retryMode - JVM system property: Java/Kotlin only
         Speciﬁes how the SDK or developer tool attempts retries.
         Default value: This value is speciﬁc to your SDK. Check your speciﬁc SDK guide or your SDK's 
         code base for its default retry_mode.
         Valid values:
         •
           standard – (Recommended) The recommended set of retry rules across AWS SDKs. This 
           mode includes a standard set of errors that are retried, and automatically adjusts the number 
           of retries to maximize availability and stability. This mode is safe for use in multi-tenant 
           applications. The default maximum number of attempts with this mode is three, unless
           max_attempts is explicitly conﬁgured.
         •
           adaptive – A retry mode, appropriate only for specialized use-cases, that includes the 
           functionality of standard mode as well as automatic client-side rate limiting. This retry mode 
           is not recommended for multi-tenant applications, unless you take care to isolate application 
           tenants. See Choosing between standard and adaptive retry modes for more information. 
           This mode is experimental and it might change behavior in the future.
         •
           legacy – (Not Recommended) Speciﬁc to your SDK (check your speciﬁc SDK guide or your 
           SDK's code base).
      max_attempts - shared AWS config ﬁle setting, AWS_MAX_ATTEMPTS - environment variable,
      aws.maxAttempts - JVM system property: Java/Kotlin only
         Speciﬁes the maximum number attempts to make on a request.
         Default value: If this value is not speciﬁed, its default depends on the value of the retry_mode
         setting:
         •
           If retry_mode is legacy – Uses a default value speciﬁc to your SDK (check your speciﬁc SDK 
           guide or your SDK's code base for max_attempts default).
         •
           If retry_mode is standard – Makes three attempts.
         •
           If retry_mode is adaptive – Makes three attempts.
         Valid values: Number greater than 0.
      Retry behavior                                                                         136
       AWS SDKs and Tools                                                                      Reference Guide
       Choosing between standard and adaptive retry modes
       We recommend you use the standard retry mode unless you are certain that your usage is better 
       suited for adaptive.
             Note
             The adaptive mode assumes that you are pooling clients based on the scope at which the 
             backend service may throttle requests. If you don't do this, throttles in one resource could 
             delay requests for an unrelated resource if you are using the same client for both resources.
         Standard                                         Adaptive
         Application use-cases: All.                      Application use-cases:
                                                          1. Not sensitive to latency.
                                                          2. Client only accesses a single resource, or, 
                                                             you are providing logic to pool your clients 
                                                             separately by the service resource that is 
                                                             being accessed.
         Supports circuit-breaking to prevent the SDK     Supports circuit-breaking to prevent the SDK 
         from retrying during outages.                    from retrying during outages.
         Uses jittered exponential backoﬀ in the event    Uses dynamic backoﬀ durations to attempt 
         of failures.                                     to minimize the number of failed requests, 
                                                          in exchange for the potential for increased 
                                                          latency.
         Never delays the ﬁrst request attempt, only      Can throttle or delay the initial request 
         the retries.                                     attempt.
       If you choose to use adaptive mode, your application must construct clients that are designed 
       around each resource that might be throttled. A resource, in this case, is ﬁner-tuned than just 
       thinking of each AWS service. AWS services can have additional dimensions that they use to 
       throttle requests. Let's use the Amazon DynamoDB service as an example. DynamoDB uses AWS 
       Retry behavior                                                                                  137
      AWS SDKs and Tools                                                               Reference Guide
      Region plus the table being accessed to throttle requests. This means that one table that your code 
      is accessing might be throttled more than others. If your code used the same client to access all 
      the tables, and requests to one of those tables is throttled, then adaptive retry mode will reduce 
      the request rate for all tables. Your code should be designed to have one client per Region-and-
      table pair. If you experience unexpected latency when using adaptive mode, see the speciﬁc AWS 
      documentation guide for the service you are using.
      Retry mode implementation details
      The AWS SDKs make use of token buckets to decide whether a request should be retried and (in 
      the case of the adaptive retry mode) how quickly requests should be sent. Two token buckets are 
      used by the SDK: a retry token bucket and a request rate token bucket.
      • The retry token bucket is used to determine whether the SDK should temporarily disable retries 
        in order to protect the upstream and downstream services during outages. Tokens are acquired 
        from the bucket before retries are attempted, and tokens are returned to the bucket when 
        requests succeed. If the bucket is empty when a retry is attempted, the SDK will not retry the 
        request.
      •
        The request rate token bucket is used only in the adaptive retry mode to determine the rate at 
        which to send requests. Tokens are acquired from the bucket before a request is sent, and tokens 
        are returned to the bucket at a dynamically-determined rate based on throttling responses 
        returned by the service.
      Following is the high-level pseudocode for both the standard and adaptive retry modes:
        MakeSDKRequest() { 
          attempts = 0 
          loop { 
            GetSendToken() 
            response = SendHTTPRequest() 
            RequestBookkeeping(response) 
            if not Retryable(response) 
              return response 
            attempts += 1 
            if attempts >= MAX_ATTEMPTS: 
              return response 
            if not HasRetryQuota(response) 
              return response 
            delay = ExponentialBackoff(attempts) 
            sleep(delay) 
      Retry behavior                                                                          138
      AWS SDKs and Tools                                                               Reference Guide
          }
        }
      Following are more details about the components used in the pseudocode:
      GetSendToken:
      This step is only used in adaptive retry mode. This step acquires a token from the request rate 
      token bucket. If a token is not available, it will wait for one to become available. Your SDK might 
      have conﬁguration options available to fail the request instead of wait. Tokens in the bucket are 
      reﬁlled at a rate that is determined dynamically, based on the number of throttling responses 
      received by the client.
      SendHTTPRequest:
      This step sends the request to AWS. Most AWS SDKs use an HTTP library that uses connection 
      pools to reuse an existing connection when making an HTTP request. Generally, connections are 
      reused if a request failed due to throttling errors but not if a request fails due to a transient error.
      RequestBookkeeping:
      Tokens are added to the token bucket if the request is successful. For adaptive retry mode only, 
      the ﬁll rate of the request rate token bucket is updated based on the type of response received.
      Retryable:
      This step determines whether a response can be retried based on the following:
      • The HTTP status code.
      • The error code returned from the service.
      • Connection errors, deﬁned as any error received by the SDK in which an HTTP response from the 
        service is not received.
      Transient errors (HTTP status codes 400, 408, 500, 502, 503, and 504) and throttling errors (HTTP 
      status codes 400, 403, 429, 502, 503, and 509) can all potentially be retried. SDK retry behavior is 
      determined in combination with error codes or other data from the service.
      MAX_ATTEMPTS:
      The default number of maximum attempts is set by the retry_mode setting, unless overridden by 
      the max_attempts setting.
      Retry behavior                                                                          139
      AWS SDKs and Tools                                                               Reference Guide
      HasRetryQuota
      This step acquires a token from the retry token bucket. If the retry token bucket is empty, the 
      request will not be retried.
      ExponentialBackoff
      For an error that can be retried, the retry delay is calculated using truncated exponential backoﬀ. 
      The SDKs use truncated binary exponential backoﬀ with jitter. The following algorithm shows how 
      the amount of time to sleep, in seconds, is deﬁned for a response for request i:
        seconds_to_sleep_i = min(b*r^i, MAX_BACKOFF)
      In the preceding algorithm, the following values apply:
      b = random number within the range of: 0 <= b <= 1
      r = 2
      MAX_BACKOFF = 20 seconds for most SDKs. See your speciﬁc SDK guide or source code for 
      conﬁrmation.
      Support by AWS SDKs and tools
      The following SDKs support the features and settings described in this topic. Any partial exceptions 
      are noted. Any JVM system property settings are supported by the AWS SDK for Java and the AWS 
      SDK for Kotlin only.
        SDK                          SupNotes or more informationported
        AWS CLI v2                 Yes  
        SDK for C++                Yes  
        SDK for Go V2 (1.x)        Yes  
        SDK for Go 1.x (V1)         No  
        SDK for Java 2.x           Yes  
      Retry behavior                                                                          140
      AWS SDKs and Tools                                                               Reference Guide
        SDK                          SupNotes or more informationported
        SDK for Java 1.x           Yes
                                        JVM system properties: use com.amazonaws.sdk. 
                                        maxAttempts  instead of aws.maxAttempts ; use
                                        com.amazonaws.sdk.retryMode          instead of
                                        aws.retryMode .
        SDK for JavaScript 3.x     Yes  
        SDK for JavaScript 2.x      No Supports a maximum number of retries, exponential backoﬀ 
                                        with jitter, and an option for a custom method for retry 
                                        backoﬀ.
        SDK for Kotlin             Yes  
        SDK for .NET 4.x           Yes  
        SDK for .NET 3.x           Yes  
        SDK for PHP 3.x            Yes  
        SDK for Python (Boto3)     Yes  
        SDK for Ruby 3.x           Yes  
        SDK for Rust               Yes  
        SDK for Swift              Yes  
        Tools for PowerShell V5    Yes  
        Tools for PowerShell V4    Yes  
      Request compression
           Note
           For help in understanding the layout of settings pages, or in interpreting the Support by 
           AWS SDKs and tools table that follows, see Understanding the settings pages of this guide.
      Request compression                                                                     141
      AWS SDKs and Tools                                                          Reference Guide
      AWS SDKs and tools can automatically compress payloads when sending requests to AWS services 
      that support receiving compressed payloads. Compressing the payload on the client prior to 
      sending it to a service may reduce the overall number of requests and bandwidth required to 
      send data to the service, as well as reduce unsuccessful requests due to service limitations on the 
      payload size. For compression, the SDK or tool selects an encoding algorithm that is supported by 
      both the service and the SDK. However, the current list of possible encodings consists only of gzip, 
      but it may expand in the future.
      Request compression can be especially useful if your application is using Amazon CloudWatch. 
      CloudWatch is a monitoring and observability service that collects monitoring and operational 
      data in the form of logs, metrics, and events. One example of a service operation that supports 
      compression is CloudWatch's PutMetricDataAPI method.
      Conﬁgure this functionality by using the following:
      disable_request_compression - shared AWS config ﬁle setting,
      AWS_DISABLE_REQUEST_COMPRESSION - environment variable,
      aws.disableRequestCompression - JVM system property: Java/Kotlin only
         Turns on or oﬀ whether the SDK or tool will compress a payload prior to sending a request.
         Default value: false
         Valid values:
         •
           true – Turn oﬀ request compression.
         •
           false – Use request compression when possible.
      request_min_compression_size_bytes - shared AWS config ﬁle setting,
      AWS_REQUEST_MIN_COMPRESSION_SIZE_BYTES - environment variable,
      aws.requestMinCompressionSizeBytes - JVM system property: Java/Kotlin only
         Sets the minimum size in bytes of the request body that the SDK or tool should compress. Small 
         payloads may become longer when compressed, thus, there is a lower limit where it makes 
         sense to perform compression. This value is inclusive, a request size greater than or equal to the 
         value is compressed.
         Default value: 10240 bytes
         Valid values: Integer value between 0 and 10485760 bytes inclusive.
      Request compression                                                                 142
      AWS SDKs and Tools                                                     Reference Guide
      Support by AWS SDKs and tools
      The following SDKs support the features and settings described in this topic. Any partial exceptions 
      are noted. Any JVM system property settings are supported by the AWS SDK for Java and the AWS 
      SDK for Kotlin only.
       SDK                       SupNotes or more informationported
       AWS CLI v2              Yes  
       SDK for C++             Yes  
       SDK for Go V2 (1.x)     Yes  
       SDK for Go 1.x (V1)      No  
       SDK for Java 2.x        Yes  
       SDK for Java 1.x         No  
       SDK for JavaScript 3.x  Yes  
       SDK for JavaScript 2.x   No  
       SDK for Kotlin          Yes  
       SDK for .NET 4.x        Yes  
       SDK for .NET 3.x        Yes  
       SDK for PHP 3.x         Yes  
       SDK for Python (Boto3)  Yes  
       SDK for Ruby 3.x        Yes  
       SDK for Rust            Yes  
       SDK for Swift            No  
       Tools for PowerShell V5 Yes  
      Request compression                                                          143
       AWS SDKs and Tools                                                                    Reference Guide
        SDK                            SupNotes or more informationported
        Tools for PowerShell V4       Yes  
       Service-speciﬁc endpoints
            Note
            For help in understanding the layout of settings pages, or in interpreting the Support by 
            AWS SDKs and tools table that follows, see Understanding the settings pages of this guide.
       Service-speciﬁc endpoint conﬁguration provides the option to use an endpoint of your choosing 
       for API requests and to have that choice persist. These settings provide ﬂexibility to support 
       local endpoints, VPC endpoints, and third-party local AWS development environments. Diﬀerent 
       endpoints can be used for testing and production environments. You can specify an endpoint URL 
       for individual AWS services.
       Conﬁgure this functionality by using the following:
       endpoint_url - shared AWS config ﬁle setting, AWS_ENDPOINT_URL - environment variable,
       aws.endpointUrl - JVM system property: Java/Kotlin only
          When speciﬁed directly within a proﬁle or as an environment variable, this setting speciﬁes the 
          endpoint that is used for all service requests. This endpoint is overridden by any conﬁgured 
          service-speciﬁc endpoint.
          You can also use this setting within a services section of a shared AWS config ﬁle to 
          set a custom endpoint for a speciﬁc service. For a list of all service identiﬁer keys to use for 
          subsections within the services section, see Identiﬁers for service-speciﬁc endpoints.
          Default value: none
          Valid values: A URL including the scheme and host for the endpoint. The URL can optionally 
          contain a path component that contains one or more path segments.
       Service-speciﬁc endpoints                                                                     144
      AWS SDKs and Tools                                                               Reference Guide
      AWS_ENDPOINT_URL_<SERVICE> - environment variable, aws.endpointUrl<ServiceName> - 
      JVM system property: Java/Kotlin only
         AWS_ENDPOINT_URL_<SERVICE>, where <SERVICE> is the AWS service identiﬁer, sets a 
         custom endpoint for a speciﬁc service. For a list of all service-speciﬁc environment variables, see
         Identiﬁers for service-speciﬁc endpoints.
         This service-speciﬁc endpoint overrides any global endpoint set in AWS_ENDPOINT_URL.
         Default value: none
         Valid values: A URL including the scheme and host for the endpoint. The URL can optionally 
         contain a path component that contains one or more path segments.
      ignore_configured_endpoint_urls - shared AWS config ﬁle setting,
      AWS_IGNORE_CONFIGURED_ENDPOINT_URLS - environment variable,
      aws.ignoreConfiguredEndpointUrls - JVM system property: Java/Kotlin only
         This setting is used to ignore all custom endpoints conﬁgurations.
         Note that any explicit endpoint set in the code or on a service client itself is used regardless of 
         this setting. For example, including the --endpoint-url command line parameter with an 
         AWS CLI command or passing an endpoint URL into a client constructor will always take eﬀect.
         Default value: false
         Valid values:
         •
           true – The SDK or tool does not read any custom conﬁguration options from the shared
           config ﬁle or from environment variables for setting an endpoint URL.
         •
           false – The SDK or tool uses any available user-provided endpoints from the shared config
           ﬁle or from environment variables.
      Conﬁgure endpoints using environment variables
      To route requests for all services to a custom endpoint URL, set the AWS_ENDPOINT_URL global 
      environment variable.
        export AWS_ENDPOINT_URL=http://localhost:4567
      Service-speciﬁc endpoints                                                               145
      AWS SDKs and Tools                                                               Reference Guide
      To route requests for a speciﬁc AWS service to a custom endpoint URL, use the
      AWS_ENDPOINT_URL_<SERVICE> environment variable. Amazon DynamoDB has a
      serviceId of DynamoDB. For this service, the endpoint URL environment variable is
      AWS_ENDPOINT_URL_DYNAMODB. This endpoint takes precedence over the global endpoint set in
      AWS_ENDPOINT_URL for this service.
        export AWS_ENDPOINT_URL_DYNAMODB=http://localhost:5678
      As another example, AWS Elastic Beanstalk has a serviceId of Elastic Beanstalk. The 
      AWS service identiﬁer is based on the API model's serviceId by replacing all spaces with 
      underscores and uppercasing all letters. To set the endpoint for this service, the corresponding 
      environment variable is AWS_ENDPOINT_URL_ELASTIC_BEANSTALK. For a list of all service-
      speciﬁc environment variables, see Identiﬁers for service-speciﬁc endpoints.
        export AWS_ENDPOINT_URL_ELASTIC_BEANSTALK=http://localhost:5567
      Conﬁgure endpoints using the shared config ﬁle
      In the shared config ﬁle, endpoint_url is used in diﬀerent places for diﬀerent functionality.
      •
        endpoint_url speciﬁed directly within a profile makes that endpoint the global endpoint.
      •
        endpoint_url nested under a service identiﬁer key within a services section makes that 
        endpoint apply to requests made only to that service. For details on deﬁning a services section 
        in your shared config ﬁle, see Format of the conﬁg ﬁle.
      The following example uses a services deﬁnition to conﬁgure a service-speciﬁc endpoint URL to 
      be used for Amazon S3 and a custom global endpoint to be used for all other services:
        [profile dev-s3-specific-and-global]
        endpoint_url = http://localhost:1234
        services = s3-specific
        [services s3-specific]
        s3 =  
          endpoint_url = https://play.min.io:9000
      A single proﬁle can conﬁgure endpoints for multiple services. This example shows how to set 
      the service-speciﬁc endpoint URLs for Amazon S3 and AWS Elastic Beanstalk in the same proﬁle. 
      Service-speciﬁc endpoints                                                               146
      AWS SDKs and Tools                                                               Reference Guide
      AWS Elastic Beanstalk has a serviceId of Elastic Beanstalk. The AWS service identiﬁer is 
      based on the API model's serviceId by replacing all spaces with underscores and lowercasing all 
      letters. Thus, the service identiﬁer key becomes elastic_beanstalk and settings for this service 
      begin on the line elastic_beanstalk = . For a list of all service identiﬁer keys to use in the
      services section, see Identiﬁers for service-speciﬁc endpoints.
        [services testing-s3-and-eb]
        s3 =  
          endpoint_url = http://localhost:4567
        elastic_beanstalk =  
          endpoint_url = http://localhost:8000
        [profile dev]
        services = testing-s3-and-eb
      The service conﬁguration section can be used from multiple proﬁles. For example, two proﬁles can 
      use the same services deﬁnition while altering other proﬁle properties:
        [services testing-s3]
        s3 =  
          endpoint_url = https://localhost:4567
        [profile testing-json]
        output = json
        services = testing-s3
        [profile testing-text]
        output = text
        services = testing-s3
      Conﬁgure endpoints in proﬁles using role-based credentials
      If your proﬁle has role-based credentials conﬁgured through a source_profile parameter for 
      IAM assume role functionality, the SDK only uses service conﬁgurations for the speciﬁed proﬁle. It 
      does not use proﬁles that are role chained to it. For example, using the following shared config
      ﬁle:
        [profile A]
        credential_source = Ec2InstanceMetadata
        endpoint_url = https://profile-a-endpoint.aws/
      Service-speciﬁc endpoints                                                               147
      AWS SDKs and Tools                                                               Reference Guide
        [profile B]
        source_profile = A
        role_arn = arn:aws:iam::123456789012:role/roleB
        services = profileB
        [services profileB]
        ec2 =  
          endpoint_url = https://profile-b-ec2-endpoint.aws
      If you use proﬁle B and make a call in your code to Amazon EC2, the endpoint resolves as
      https://profile-b-ec2-endpoint.aws. If your code makes a request to any other service, 
      the endpoint resolution will not follow any custom logic. The endpoint does not resolve to 
      the global endpoint deﬁned in proﬁle A. For a global endpoint to take eﬀect for proﬁle B, 
      you would need to set endpoint_url directly within proﬁle B. For more information on the
      source_profile setting, see Assume role credential provider.
      Precedence of settings
      The settings for this feature can be used at the same time but only one value will take priority per 
      service. For API calls made to a given AWS service, the following order is used to select a value:
      1. Any explicit setting set in the code or on a service client itself takes precedence over anything 
         else.
         •
           For the AWS CLI, this is the value provided by the --endpoint-url command line parameter. 
           For an SDK, explicit assignments can take the form of a parameter that you set when you 
           instantiate an AWS service client or conﬁguration object.
      2. The value provided by a service-speciﬁc environment variable such as
         AWS_ENDPOINT_URL_DYNAMODB.
      3.
         The value provided by the AWS_ENDPOINT_URL global endpoint environment variable.
      4.
         The value provided by the endpoint_url setting nested under a service identiﬁer key within a
         services section of the shared config ﬁle.
      5.
         The value provided by the endpoint_url setting speciﬁed directly within a profile of the 
         shared config ﬁle.
      6. Any default endpoint URL for the respective AWS service is used last.
      Service-speciﬁc endpoints                                                               148
      AWS SDKs and Tools                                                     Reference Guide
      Support by AWS SDKs and tools
      The following SDKs support the features and settings described in this topic. Any partial exceptions 
      are noted. Any JVM system property settings are supported by the AWS SDK for Java and the AWS 
      SDK for Kotlin only.
       SDK                       SupNotes or more informationported
       AWS CLI v2              Yes  
       SDK for C++              No  
       SDK for Go V2 (1.x)     Yes  
       SDK for Go 1.x (V1)      No  
       SDK for Java 2.x        Yes  
       SDK for Java 1.x         No  
       SDK for JavaScript 3.x  Yes  
       SDK for JavaScript 2.x   No  
       SDK for Kotlin          Yes  
       SDK for .NET 4.x        Yes  
       SDK for .NET 3.x        Yes  
       SDK for PHP 3.x         Yes  
       SDK for Python (Boto3)  Yes  
       SDK for Ruby 3.x        Yes  
       SDK for Rust            Yes  
       SDK for Swift           Yes  
       Tools for PowerShell V5 Yes  
      Service-speciﬁc endpoints                                                    149
       AWS SDKs and Tools                                                                    Reference Guide
        SDK                            SupNotes or more informationported
        Tools for PowerShell V4       Yes  
       Identiﬁers for service-speciﬁc endpoints
       For information on how and where to use the identiﬁers in the following table, see Service-speciﬁc 
       endpoints.
                                       Service 
        serviceId                         AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                       identiﬁe 
                                       r 
                                       key 
                                       for 
                                       shared 
                                       AWS
                                       config
                                       ﬁle
        AccessAnalyzer                 accessana AWS_ENDPOINT_URL_ACCESSANALYZER
                                       lyzer
        Account                        accountAWS_ENDPOINT_URL_ACCOUNT
        ACM                            acmAWS_ENDPOINT_URL_ACM
        ACM PCA                        acm_pcaAWS_ENDPOINT_URL_ACM_PCA
        Alexa For Business             alexa_for AWS_ENDPOINT_URL_ALEXA_FOR_BUSINESS
                                       _business
        amp                            ampAWS_ENDPOINT_URL_AMP
        Amplify                        amplifyAWS_ENDPOINT_URL_AMPLIFY
        AmplifyBackend                 amplifyba AWS_ENDPOINT_URL_AMPLIFYBACKEND
                                       ckend
       Service-speciﬁc endpoints                                                                     150
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        AmplifyUIBuilder             amplifyui AWS_ENDPOINT_URL_AMPLIFYUIBUILDER
                                     builder
        API Gateway                  api_gatew AWS_ENDPOINT_URL_API_GATEWAY
                                     ay
        ApiGatewayManageme           apigatewa AWS_ENDPOINT_URL_APIGATEWAYMANAGEMENTAPI
        ntApi                        ymanageme 
                                     ntapi
        ApiGatewayV2                 apigatewa AWS_ENDPOINT_URL_APIGATEWAYV2
                                     yv2
        AppConfig                    appconfigAWS_ENDPOINT_URL_APPCONFIG
        AppConfigData                appconfig AWS_ENDPOINT_URL_APPCONFIGDATA
                                     data
        AppFabric                    appfabricAWS_ENDPOINT_URL_APPFABRIC
        Appflow                      appflowAWS_ENDPOINT_URL_APPFLOW
        AppIntegrations              appintegr AWS_ENDPOINT_URL_APPINTEGRATIONS
                                     ations
      Service-speciﬁc endpoints                                                               151
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        Application Auto             applicati AWS_ENDPOINT_URL_APPLICATION_AUTO_SCALING
        Scaling                      on_auto_s 
                                     caling
        Application Insights         applicati AWS_ENDPOINT_URL_APPLICATION_INSIGHTS
                                     on_insigh 
                                     ts
        ApplicationCostPro           applicati AWS_ENDPOINT_URL_APPLICATIONCOSTPROFILER
        filer                        oncostpro 
                                     filer
        App Mesh                     app_meshAWS_ENDPOINT_URL_APP_MESH
        AppRunner                    apprunnerAWS_ENDPOINT_URL_APPRUNNER
        AppStream                    appstreamAWS_ENDPOINT_URL_APPSTREAM
        AppSync                      appsyncAWS_ENDPOINT_URL_APPSYNC
        ARC Zonal Shift              arc_zonal AWS_ENDPOINT_URL_ARC_ZONAL_SHIFT
                                     _shift
        Artifact                     artifactAWS_ENDPOINT_URL_ARTIFACT
        Athena                       athenaAWS_ENDPOINT_URL_ATHENA
      Service-speciﬁc endpoints                                                               152
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        AuditManager                 auditmana AWS_ENDPOINT_URL_AUDITMANAGER
                                     ger
        Auto Scaling                 auto_scal AWS_ENDPOINT_URL_AUTO_SCALING
                                     ing
        Auto Scaling Plans           auto_scal AWS_ENDPOINT_URL_AUTO_SCALING_PLANS
                                     ing_plans
        b2bi                         b2biAWS_ENDPOINT_URL_B2BI
        Backup                       backupAWS_ENDPOINT_URL_BACKUP
        Backup Gateway               backup_ga AWS_ENDPOINT_URL_BACKUP_GATEWAY
                                     teway
        BackupStorage                backupsto AWS_ENDPOINT_URL_BACKUPSTORAGE
                                     rage
        Batch                        batchAWS_ENDPOINT_URL_BATCH
        BCM Data Exports             bcm_data_ AWS_ENDPOINT_URL_BCM_DATA_EXPORTS
                                     exports
        Bedrock                      bedrockAWS_ENDPOINT_URL_BEDROCK
        Bedrock Agent                bedrock_a AWS_ENDPOINT_URL_BEDROCK_AGENT
                                     gent
      Service-speciﬁc endpoints                                                               153
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        Bedrock Agent Runtime        bedrock_a AWS_ENDPOINT_URL_BEDROCK_AGENT_RUNTIME
                                     gent_runt 
                                     ime
        Bedrock Runtime              bedrock_r AWS_ENDPOINT_URL_BEDROCK_RUNTIME
                                     untime
        billingconductor             billingco AWS_ENDPOINT_URL_BILLINGCONDUCTOR
                                     nductor
        Braket                       braketAWS_ENDPOINT_URL_BRAKET
        Budgets                      budgetsAWS_ENDPOINT_URL_BUDGETS
        Cost Explorer                cost_expl AWS_ENDPOINT_URL_COST_EXPLORER
                                     orer
        chatbot                      chatbotAWS_ENDPOINT_URL_CHATBOT
        Chime                        chimeAWS_ENDPOINT_URL_CHIME
        Chime SDK Identity           chime_sdk AWS_ENDPOINT_URL_CHIME_SDK_IDENTITY
                                     _identity
        Chime SDK Media              chime_sdk AWS_ENDPOINT_URL_CHIME_SDK_MEDIA_PIPELINES
        Pipelines                    _media_pi 
                                     pelines
      Service-speciﬁc endpoints                                                               154
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        Chime SDK Meetings           chime_sdk AWS_ENDPOINT_URL_CHIME_SDK_MEETINGS
                                     _meetings
        Chime SDK Messaging          chime_sdk AWS_ENDPOINT_URL_CHIME_SDK_MESSAGING
                                     _messagin 
                                     g
        Chime SDK Voice              chime_sdk AWS_ENDPOINT_URL_CHIME_SDK_VOICE
                                     _voice
        CleanRooms                   cleanroom AWS_ENDPOINT_URL_CLEANROOMS
                                     s
        CleanRoomsML                 cleanroom AWS_ENDPOINT_URL_CLEANROOMSML
                                     sml
        Cloud9                       cloud9AWS_ENDPOINT_URL_CLOUD9
        CloudControl                 cloudcont AWS_ENDPOINT_URL_CLOUDCONTROL
                                     rol
        CloudDirectory               clouddire AWS_ENDPOINT_URL_CLOUDDIRECTORY
                                     ctory
        CloudFormation               cloudform AWS_ENDPOINT_URL_CLOUDFORMATION
                                     ation
      Service-speciﬁc endpoints                                                               155
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        CloudFront                   cloudfron AWS_ENDPOINT_URL_CLOUDFRONT
                                     t
        CloudFront KeyValueS         cloudfron AWS_ENDPOINT_URL_CLOUDFRONT_KEYVALUESTORE
        tore                         t_keyvalu 
                                     estore
        CloudHSM                     cloudhsmAWS_ENDPOINT_URL_CLOUDHSM
        CloudHSM V2                  cloudhsm_ AWS_ENDPOINT_URL_CLOUDHSM_V2
                                     v2
        CloudSearch                  cloudsear AWS_ENDPOINT_URL_CLOUDSEARCH
                                     ch
        CloudSearch Domain           cloudsear AWS_ENDPOINT_URL_CLOUDSEARCH_DOMAIN
                                     ch_domain
        CloudTrail                   cloudtrai AWS_ENDPOINT_URL_CLOUDTRAIL
                                     l
        CloudTrail Data              cloudtrai AWS_ENDPOINT_URL_CLOUDTRAIL_DATA
                                     l_data
        CloudWatch                   cloudwatc AWS_ENDPOINT_URL_CLOUDWATCH
                                     h
      Service-speciﬁc endpoints                                                               156
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        codeartifact                 codeartif AWS_ENDPOINT_URL_CODEARTIFACT
                                     act
        CodeBuild                    codebuildAWS_ENDPOINT_URL_CODEBUILD
        CodeCatalyst                 codecatal AWS_ENDPOINT_URL_CODECATALYST
                                     yst
        CodeCommit                   codecommi AWS_ENDPOINT_URL_CODECOMMIT
                                     t
        CodeDeploy                   codedeplo AWS_ENDPOINT_URL_CODEDEPLOY
                                     y
        CodeGuru Reviewer            codeguru_ AWS_ENDPOINT_URL_CODEGURU_REVIEWER
                                     reviewer
        CodeGuru Security            codeguru_ AWS_ENDPOINT_URL_CODEGURU_SECURITY
                                     security
        CodeGuruProfiler             codegurup AWS_ENDPOINT_URL_CODEGURUPROFILER
                                     rofiler
        CodePipeline                 codepipel AWS_ENDPOINT_URL_CODEPIPELINE
                                     ine
        CodeStar                     codestarAWS_ENDPOINT_URL_CODESTAR
      Service-speciﬁc endpoints                                                               157
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        CodeStar connections         codestar_ AWS_ENDPOINT_URL_CODESTAR_CONNECTIONS
                                     connectio 
                                     ns
        codestar notificat           codestar_ AWS_ENDPOINT_URL_CODESTAR_NOTIFICATIONS
        ions                         notificat 
                                     ions
        Cognito Identity             cognito_i AWS_ENDPOINT_URL_COGNITO_IDENTITY
                                     dentity
        Cognito Identity             cognito_i AWS_ENDPOINT_URL_COGNITO_IDENTITY_PROVIDER
        Provider                     dentity_p 
                                     rovider
        Cognito Sync                 cognito_s AWS_ENDPOINT_URL_COGNITO_SYNC
                                     ync
        Comprehend                   comprehen AWS_ENDPOINT_URL_COMPREHEND
                                     d
        ComprehendMedical            comprehen AWS_ENDPOINT_URL_COMPREHENDMEDICAL
                                     dmedical
        Compute Optimizer            compute_o AWS_ENDPOINT_URL_COMPUTE_OPTIMIZER
                                     ptimizer
      Service-speciﬁc endpoints                                                               158
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        Config Service               config_se AWS_ENDPOINT_URL_CONFIG_SERVICE
                                     rvice
        Connect                      connectAWS_ENDPOINT_URL_CONNECT
        Connect Contact Lens         connect_c AWS_ENDPOINT_URL_CONNECT_CONTACT_LENS
                                     ontact_le 
                                     ns
        ConnectCampaigns             connectca AWS_ENDPOINT_URL_CONNECTCAMPAIGNS
                                     mpaigns
        ConnectCases                 connectca AWS_ENDPOINT_URL_CONNECTCASES
                                     ses
        ConnectParticipant           connectpa AWS_ENDPOINT_URL_CONNECTPARTICIPANT
                                     rticipant
        ControlTower                 controlto AWS_ENDPOINT_URL_CONTROLTOWER
                                     wer
        Cost Optimization Hub        cost_opti AWS_ENDPOINT_URL_COST_OPTIMIZATION_HUB
                                     mization_ 
                                     hub
      Service-speciﬁc endpoints                                                               159
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        Cost and Usage Report        cost_and_ AWS_ENDPOINT_URL_COST_AND_USAGE_REPO 
        Service                      usage_rep RT_SERVICE
                                     ort_servi 
                                     ce
        Customer Profiles            customer_ AWS_ENDPOINT_URL_CUSTOMER_PROFILES
                                     profiles
        DataBrew                     databrewAWS_ENDPOINT_URL_DATABREW
        DataExchange                 dataexcha AWS_ENDPOINT_URL_DATAEXCHANGE
                                     nge
        Data Pipeline                data_pipe AWS_ENDPOINT_URL_DATA_PIPELINE
                                     line
        DataSync                     datasyncAWS_ENDPOINT_URL_DATASYNC
        DataZone                     datazoneAWS_ENDPOINT_URL_DATAZONE
        DAX                          daxAWS_ENDPOINT_URL_DAX
        Detective                    detectiveAWS_ENDPOINT_URL_DETECTIVE
        Device Farm                  device_fa AWS_ENDPOINT_URL_DEVICE_FARM
                                     rm
      Service-speciﬁc endpoints                                                               160
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        DevOps Guru                  devops_gu AWS_ENDPOINT_URL_DEVOPS_GURU
                                     ru
        Direct Connect               direct_co AWS_ENDPOINT_URL_DIRECT_CONNECT
                                     nnect
        Application Discovery        applicati AWS_ENDPOINT_URL_APPLICATION_DISCOVE 
        Service                      on_discov RY_SERVICE
                                     ery_servi 
                                     ce
        DLM                          dlmAWS_ENDPOINT_URL_DLM
        Database Migration           database_ AWS_ENDPOINT_URL_DATABASE_MIGRATION_ 
        Service                      migration SERVICE
                                     _service
        DocDB                        docdbAWS_ENDPOINT_URL_DOCDB
        DocDB Elastic                docdb_ela AWS_ENDPOINT_URL_DOCDB_ELASTIC
                                     stic
        drs                          drsAWS_ENDPOINT_URL_DRS
        Directory Service            directory AWS_ENDPOINT_URL_DIRECTORY_SERVICE
                                     _service
        DynamoDB                     dynamodbAWS_ENDPOINT_URL_DYNAMODB
      Service-speciﬁc endpoints                                                               161
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        DynamoDB Streams             dynamodb_ AWS_ENDPOINT_URL_DYNAMODB_STREAMS
                                     streams
        EBS                          ebsAWS_ENDPOINT_URL_EBS
        EC2                          ec2AWS_ENDPOINT_URL_EC2
        EC2 Instance Connect         ec2_insta AWS_ENDPOINT_URL_EC2_INSTANCE_CONNECT
                                     nce_conne 
                                     ct
        ECR                          ecrAWS_ENDPOINT_URL_ECR
        ECR PUBLIC                   ecr_publi AWS_ENDPOINT_URL_ECR_PUBLIC
                                     c
        ECS                          ecsAWS_ENDPOINT_URL_ECS
        EFS                          efsAWS_ENDPOINT_URL_EFS
        EKS                          eksAWS_ENDPOINT_URL_EKS
        EKS Auth                     eks_authAWS_ENDPOINT_URL_EKS_AUTH
        Elastic Inference            elastic_i AWS_ENDPOINT_URL_ELASTIC_INFERENCE
                                     nference
        ElastiCache                  elasticac AWS_ENDPOINT_URL_ELASTICACHE
                                     he
      Service-speciﬁc endpoints                                                               162
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        Elastic Beanstalk            elastic_b AWS_ENDPOINT_URL_ELASTIC_BEANSTALK
                                     eanstalk
        Elastic Transcoder           elastic_t AWS_ENDPOINT_URL_ELASTIC_TRANSCODER
                                     ranscoder
        Elastic Load Balancing       elastic_l AWS_ENDPOINT_URL_ELASTIC_LOAD_BALANCING
                                     oad_balan 
                                     cing
        Elastic Load Balancing  elastic_l AWS_ENDPOINT_URL_ELASTIC_LOAD_BALANCING_V2
        v2                           oad_balan 
                                     cing_v2
        EMR                          emrAWS_ENDPOINT_URL_EMR
        EMR containers               emr_conta AWS_ENDPOINT_URL_EMR_CONTAINERS
                                     iners
        EMR Serverless               emr_serve AWS_ENDPOINT_URL_EMR_SERVERLESS
                                     rless
        EntityResolution             entityres AWS_ENDPOINT_URL_ENTITYRESOLUTION
                                     olution
      Service-speciﬁc endpoints                                                               163
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        Elasticsearch Service        elasticse AWS_ENDPOINT_URL_ELASTICSEARCH_SERVICE
                                     arch_serv 
                                     ice
        EventBridge                  eventbrid AWS_ENDPOINT_URL_EVENTBRIDGE
                                     ge
        Evidently                    evidentlyAWS_ENDPOINT_URL_EVIDENTLY
        finspace                     finspaceAWS_ENDPOINT_URL_FINSPACE
        finspace data                finspace_ AWS_ENDPOINT_URL_FINSPACE_DATA
                                     data
        Firehose                     firehoseAWS_ENDPOINT_URL_FIREHOSE
        fis                          fisAWS_ENDPOINT_URL_FIS
        FMS                          fmsAWS_ENDPOINT_URL_FMS
        forecast                     forecastAWS_ENDPOINT_URL_FORECAST
        forecastquery                forecastq AWS_ENDPOINT_URL_FORECASTQUERY
                                     uery
        FraudDetector                frauddete AWS_ENDPOINT_URL_FRAUDDETECTOR
                                     ctor
      Service-speciﬁc endpoints                                                               164
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        FreeTier                     freetierAWS_ENDPOINT_URL_FREETIER
        FSx                          fsxAWS_ENDPOINT_URL_FSX
        GameLift                     gameliftAWS_ENDPOINT_URL_GAMELIFT
        Glacier                      glacierAWS_ENDPOINT_URL_GLACIER
        Global Accelerator           global_ac AWS_ENDPOINT_URL_GLOBAL_ACCELERATOR
                                     celerator
        Glue                         glueAWS_ENDPOINT_URL_GLUE
        grafana                      grafanaAWS_ENDPOINT_URL_GRAFANA
        Greengrass                   greengras AWS_ENDPOINT_URL_GREENGRASS
                                     s
        GreengrassV2                 greengras AWS_ENDPOINT_URL_GREENGRASSV2
                                     sv2
        GroundStation                groundsta AWS_ENDPOINT_URL_GROUNDSTATION
                                     tion
        GuardDuty                    guarddutyAWS_ENDPOINT_URL_GUARDDUTY
        Health                       healthAWS_ENDPOINT_URL_HEALTH
      Service-speciﬁc endpoints                                                               165
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        HealthLake                   healthlak AWS_ENDPOINT_URL_HEALTHLAKE
                                     e
        Honeycode                    honeycodeAWS_ENDPOINT_URL_HONEYCODE
        IAM                          iamAWS_ENDPOINT_URL_IAM
        identitystore                identitys AWS_ENDPOINT_URL_IDENTITYSTORE
                                     tore
        imagebuilder                 imagebuil AWS_ENDPOINT_URL_IMAGEBUILDER
                                     der
        ImportExport                 importexp AWS_ENDPOINT_URL_IMPORTEXPORT
                                     ort
        Inspector                    inspectorAWS_ENDPOINT_URL_INSPECTOR
        Inspector Scan               inspector AWS_ENDPOINT_URL_INSPECTOR_SCAN
                                     _scan
        Inspector2                   inspector AWS_ENDPOINT_URL_INSPECTOR2
                                     2
        InternetMonitor              internetm AWS_ENDPOINT_URL_INTERNETMONITOR
                                     onitor
      Service-speciﬁc endpoints                                                               166
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        IoT                          iotAWS_ENDPOINT_URL_IOT
        IoT Data Plane               iot_data_ AWS_ENDPOINT_URL_IOT_DATA_PLANE
                                     plane
        IoT Jobs Data Plane          iot_jobs_ AWS_ENDPOINT_URL_IOT_JOBS_DATA_PLANE
                                     data_plan 
                                     e
        IoT 1Click Devices           iot_1clic AWS_ENDPOINT_URL_IOT_1CLICK_DEVICES_ 
        Service                      k_devices SERVICE
                                     _service
        IoT 1Click Projects          iot_1clic AWS_ENDPOINT_URL_IOT_1CLICK_PROJECTS
                                     k_project 
                                     s
        IoTAnalytics                 iotanalyt AWS_ENDPOINT_URL_IOTANALYTICS
                                     ics
        IotDeviceAdvisor             iotdevice AWS_ENDPOINT_URL_IOTDEVICEADVISOR
                                     advisor
        IoT Events                   iot_event AWS_ENDPOINT_URL_IOT_EVENTS
                                     s
        IoT Events Data              iot_event AWS_ENDPOINT_URL_IOT_EVENTS_DATA
                                     s_data
      Service-speciﬁc endpoints                                                               167
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        IoTFleetHub                  iotfleeth AWS_ENDPOINT_URL_IOTFLEETHUB
                                     ub
        IoTFleetWise                 iotfleetw AWS_ENDPOINT_URL_IOTFLEETWISE
                                     ise
        IoTSecureTunneling           iotsecure AWS_ENDPOINT_URL_IOTSECURETUNNELING
                                     tunneling
        IoTSiteWise                  iotsitewi AWS_ENDPOINT_URL_IOTSITEWISE
                                     se
        IoTThingsGraph               iotthings AWS_ENDPOINT_URL_IOTTHINGSGRAPH
                                     graph
        IoTTwinMaker                 iottwinma AWS_ENDPOINT_URL_IOTTWINMAKER
                                     ker
        IoT Wireless                 iot_wirel AWS_ENDPOINT_URL_IOT_WIRELESS
                                     ess
        ivs                          ivsAWS_ENDPOINT_URL_IVS
        IVS RealTime                 ivs_realt AWS_ENDPOINT_URL_IVS_REALTIME
                                     ime
        ivschat                      ivschatAWS_ENDPOINT_URL_IVSCHAT
      Service-speciﬁc endpoints                                                               168
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        Kafka                        kafkaAWS_ENDPOINT_URL_KAFKA
        KafkaConnect                 kafkaconn AWS_ENDPOINT_URL_KAFKACONNECT
                                     ect
        kendra                       kendraAWS_ENDPOINT_URL_KENDRA
        Kendra Ranking               kendra_ra AWS_ENDPOINT_URL_KENDRA_RANKING
                                     nking
        Keyspaces                    keyspacesAWS_ENDPOINT_URL_KEYSPACES
        Kinesis                      kinesisAWS_ENDPOINT_URL_KINESIS
        Kinesis Video Archived  kinesis_v AWS_ENDPOINT_URL_KINESIS_VIDEO_ARCHI 
        Media                        ideo_arch VED_MEDIA
                                     ived_medi 
                                     a
        Kinesis Video Media          kinesis_v AWS_ENDPOINT_URL_KINESIS_VIDEO_MEDIA
                                     ideo_medi 
                                     a
        Kinesis Video                kinesis_v AWS_ENDPOINT_URL_KINESIS_VIDEO_SIGNALING
        Signaling                    ideo_sign 
                                     aling
      Service-speciﬁc endpoints                                                               169
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        Kinesis Video WebRTC         kinesis_v AWS_ENDPOINT_URL_KINESIS_VIDEO_WEBRT 
        Storage                      ideo_webr C_STORAGE
                                     tc_storag 
                                     e
        Kinesis Analytics            kinesis_a AWS_ENDPOINT_URL_KINESIS_ANALYTICS
                                     nalytics
        Kinesis Analytics V2         kinesis_a AWS_ENDPOINT_URL_KINESIS_ANALYTICS_V2
                                     nalytics_ 
                                     v2
        Kinesis Video                kinesis_v AWS_ENDPOINT_URL_KINESIS_VIDEO
                                     ideo
        KMS                          kmsAWS_ENDPOINT_URL_KMS
        LakeFormation                lakeforma AWS_ENDPOINT_URL_LAKEFORMATION
                                     tion
        Lambda                       lambdaAWS_ENDPOINT_URL_LAMBDA
        Launch Wizard                launch_wi AWS_ENDPOINT_URL_LAUNCH_WIZARD
                                     zard
        Lex Model Building           lex_model AWS_ENDPOINT_URL_LEX_MODEL_BUILDING_ 
        Service                      _building SERVICE
                                     _service
      Service-speciﬁc endpoints                                                               170
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        Lex Runtime Service          lex_runti AWS_ENDPOINT_URL_LEX_RUNTIME_SERVICE
                                     me_servic 
                                     e
        Lex Models V2                lex_model AWS_ENDPOINT_URL_LEX_MODELS_V2
                                     s_v2
        Lex Runtime V2               lex_runti AWS_ENDPOINT_URL_LEX_RUNTIME_V2
                                     me_v2
        License Manager              license_m AWS_ENDPOINT_URL_LICENSE_MANAGER
                                     anager
        License Manager Linux        license_m AWS_ENDPOINT_URL_LICENSE_MANAGER_LIN 
        Subscriptions                anager_li UX_SUBSCRIPTIONS
                                     nux_subsc 
                                     riptions
        License Manager User         license_m AWS_ENDPOINT_URL_LICENSE_MANAGER_USE 
        Subscriptions                anager_us R_SUBSCRIPTIONS
                                     er_subscr 
                                     iptions
        Lightsail                    lightsailAWS_ENDPOINT_URL_LIGHTSAIL
        Location                     locationAWS_ENDPOINT_URL_LOCATION
      Service-speciﬁc endpoints                                                               171
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        CloudWatch Logs              cloudwatc AWS_ENDPOINT_URL_CLOUDWATCH_LOGS
                                     h_logs
        LookoutEquipment             lookouteq AWS_ENDPOINT_URL_LOOKOUTEQUIPMENT
                                     uipment
        LookoutMetrics               lookoutme AWS_ENDPOINT_URL_LOOKOUTMETRICS
                                     trics
        LookoutVision                lookoutvi AWS_ENDPOINT_URL_LOOKOUTVISION
                                     sion
        m2                           m2AWS_ENDPOINT_URL_M2
        Machine Learning             machine_l AWS_ENDPOINT_URL_MACHINE_LEARNING
                                     earning
        Macie2                       macie2AWS_ENDPOINT_URL_MACIE2
        ManagedBlockchain            managedbl AWS_ENDPOINT_URL_MANAGEDBLOCKCHAIN
                                     ockchain
        ManagedBlockchain            managedbl AWS_ENDPOINT_URL_MANAGEDBLOCKCHAIN_QUERY
        Query                        ockchain_ 
                                     query
        Marketplace Agreement        marketpla AWS_ENDPOINT_URL_MARKETPLACE_AGREEMENT
                                     ce_agreem 
                                     ent
      Service-speciﬁc endpoints                                                               172
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        Marketplace Catalog          marketpla AWS_ENDPOINT_URL_MARKETPLACE_CATALOG
                                     ce_catalo 
                                     g
        Marketplace Deploymen        marketpla AWS_ENDPOINT_URL_MARKETPLACE_DEPLOYMENT
        t                            ce_deploy 
                                     ment
        Marketplace Entitleme        marketpla AWS_ENDPOINT_URL_MARKETPLACE_ENTITLE 
        nt Service                   ce_entitl MENT_SERVICE
                                     ement_ser 
                                     vice
        Marketplace Commerce         marketpla AWS_ENDPOINT_URL_MARKETPLACE_COMMERC 
        Analytics                    ce_commer E_ANALYTICS
                                     ce_analyt 
                                     ics
        MediaConnect                 mediaconn AWS_ENDPOINT_URL_MEDIACONNECT
                                     ect
        MediaConvert                 mediaconv AWS_ENDPOINT_URL_MEDIACONVERT
                                     ert
        MediaLive                    medialiveAWS_ENDPOINT_URL_MEDIALIVE
      Service-speciﬁc endpoints                                                               173
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        MediaPackage                 mediapack AWS_ENDPOINT_URL_MEDIAPACKAGE
                                     age
        MediaPackage Vod             mediapack AWS_ENDPOINT_URL_MEDIAPACKAGE_VOD
                                     age_vod
        MediaPackageV2               mediapack AWS_ENDPOINT_URL_MEDIAPACKAGEV2
                                     agev2
        MediaStore                   mediastor AWS_ENDPOINT_URL_MEDIASTORE
                                     e
        MediaStore Data              mediastor AWS_ENDPOINT_URL_MEDIASTORE_DATA
                                     e_data
        MediaTailor                  mediatail AWS_ENDPOINT_URL_MEDIATAILOR
                                     or
        Medical Imaging              medical_i AWS_ENDPOINT_URL_MEDICAL_IMAGING
                                     maging
        MemoryDB                     memorydbAWS_ENDPOINT_URL_MEMORYDB
        Marketplace Metering         marketpla AWS_ENDPOINT_URL_MARKETPLACE_METERING
                                     ce_meteri 
                                     ng
        Migration Hub                migration AWS_ENDPOINT_URL_MIGRATION_HUB
                                     _hub
      Service-speciﬁc endpoints                                                               174
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        mgn                          mgnAWS_ENDPOINT_URL_MGN
        Migration Hub Refactor  migration AWS_ENDPOINT_URL_MIGRATION_HUB_REFAC 
        Spaces                       _hub_refa TOR_SPACES
                                     ctor_spac 
                                     es
        MigrationHub Config          migration AWS_ENDPOINT_URL_MIGRATIONHUB_CONFIG
                                     hub_confi 
                                     g
        MigrationHubOrches           migration AWS_ENDPOINT_URL_MIGRATIONHUBORCHESTRATOR
        trator                       huborches 
                                     trator
        MigrationHubStrategy         migration AWS_ENDPOINT_URL_MIGRATIONHUBSTRATEGY
                                     hubstrate 
                                     gy
        Mobile                       mobileAWS_ENDPOINT_URL_MOBILE
        mq                           mqAWS_ENDPOINT_URL_MQ
        MTurk                        mturkAWS_ENDPOINT_URL_MTURK
        MWAA                         mwaaAWS_ENDPOINT_URL_MWAA
        Neptune                      neptuneAWS_ENDPOINT_URL_NEPTUNE
      Service-speciﬁc endpoints                                                               175
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        Neptune Graph                neptune_g AWS_ENDPOINT_URL_NEPTUNE_GRAPH
                                     raph
        neptunedata                  neptuneda AWS_ENDPOINT_URL_NEPTUNEDATA
                                     ta
        Network Firewall             network_f AWS_ENDPOINT_URL_NETWORK_FIREWALL
                                     irewall
        NetworkManager               networkma AWS_ENDPOINT_URL_NETWORKMANAGER
                                     nager
        NetworkMonitor               networkmo AWS_ENDPOINT_URL_NETWORKMONITOR
                                     nitor
        nimble                       nimbleAWS_ENDPOINT_URL_NIMBLE
        OAM                          oamAWS_ENDPOINT_URL_OAM
        Omics                        omicsAWS_ENDPOINT_URL_OMICS
        OpenSearch                   opensearc AWS_ENDPOINT_URL_OPENSEARCH
                                     h
        OpenSearchServerless         opensearc AWS_ENDPOINT_URL_OPENSEARCHSERVERLESS
                                     hserverle 
                                     ss
        OpsWorks                     opsworksAWS_ENDPOINT_URL_OPSWORKS
      Service-speciﬁc endpoints                                                               176
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        OpsWorksCM                   opsworksc AWS_ENDPOINT_URL_OPSWORKSCM
                                     m
        Organizations                organizat AWS_ENDPOINT_URL_ORGANIZATIONS
                                     ions
        OSIS                         osisAWS_ENDPOINT_URL_OSIS
        Outposts                     outpostsAWS_ENDPOINT_URL_OUTPOSTS
        p8data                       p8dataAWS_ENDPOINT_URL_P8DATA
        p8data                       p8dataAWS_ENDPOINT_URL_P8DATA
        Panorama                     panoramaAWS_ENDPOINT_URL_PANORAMA
        Payment Cryptography         payment_c AWS_ENDPOINT_URL_PAYMENT_CRYPTOGRAPHY
                                     ryptograp 
                                     hy
        Payment Cryptography         payment_c AWS_ENDPOINT_URL_PAYMENT_CRYPTOGRAPHY_DATA
        Data                         ryptograp 
                                     hy_data
        Pca Connector Ad             pca_conne AWS_ENDPOINT_URL_PCA_CONNECTOR_AD
                                     ctor_ad
        Personalize                  personali AWS_ENDPOINT_URL_PERSONALIZE
                                     ze
      Service-speciﬁc endpoints                                                               177
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        Personalize Events           personali AWS_ENDPOINT_URL_PERSONALIZE_EVENTS
                                     ze_events
        Personalize Runtime          personali AWS_ENDPOINT_URL_PERSONALIZE_RUNTIME
                                     ze_runtim 
                                     e
        PI                           piAWS_ENDPOINT_URL_PI
        Pinpoint                     pinpointAWS_ENDPOINT_URL_PINPOINT
        Pinpoint Email               pinpoint_ AWS_ENDPOINT_URL_PINPOINT_EMAIL
                                     email
        Pinpoint SMS Voice           pinpoint_ AWS_ENDPOINT_URL_PINPOINT_SMS_VOICE
                                     sms_voice
        Pinpoint SMS Voice V2        pinpoint_ AWS_ENDPOINT_URL_PINPOINT_SMS_VOICE_V2
                                     sms_voice 
                                     _v2
        Pipes                        pipesAWS_ENDPOINT_URL_PIPES
        Polly                        pollyAWS_ENDPOINT_URL_POLLY
        Pricing                      pricingAWS_ENDPOINT_URL_PRICING
      Service-speciﬁc endpoints                                                               178
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        PrivateNetworks              privatene AWS_ENDPOINT_URL_PRIVATENETWORKS
                                     tworks
        Proton                       protonAWS_ENDPOINT_URL_PROTON
        QBusiness                    qbusinessAWS_ENDPOINT_URL_QBUSINESS
        QConnect                     qconnectAWS_ENDPOINT_URL_QCONNECT
        QLDB                         qldbAWS_ENDPOINT_URL_QLDB
        QLDB Session                 qldb_sess AWS_ENDPOINT_URL_QLDB_SESSION
                                     ion
        QuickSight                   quicksigh AWS_ENDPOINT_URL_QUICKSIGHT
                                     t
        RAM                          ramAWS_ENDPOINT_URL_RAM
        rbin                         rbinAWS_ENDPOINT_URL_RBIN
        RDS                          rdsAWS_ENDPOINT_URL_RDS
        RDS Data                     rds_dataAWS_ENDPOINT_URL_RDS_DATA
        Redshift                     redshiftAWS_ENDPOINT_URL_REDSHIFT
        Redshift Data                redshift_ AWS_ENDPOINT_URL_REDSHIFT_DATA
                                     data
      Service-speciﬁc endpoints                                                               179
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        Redshift Serverless          redshift_ AWS_ENDPOINT_URL_REDSHIFT_SERVERLESS
                                     serverles 
                                     s
        Rekognition                  rekogniti AWS_ENDPOINT_URL_REKOGNITION
                                     on
        repostspace                  repostspa AWS_ENDPOINT_URL_REPOSTSPACE
                                     ce
        resiliencehub                resilienc AWS_ENDPOINT_URL_RESILIENCEHUB
                                     ehub
        Resource Explorer 2          resource_ AWS_ENDPOINT_URL_RESOURCE_EXPLORER_2
                                     explorer_ 
                                     2
        Resource Groups              resource_ AWS_ENDPOINT_URL_RESOURCE_GROUPS
                                     groups
        Resource Groups              resource_ AWS_ENDPOINT_URL_RESOURCE_GROUPS_TAG 
        Tagging API                  groups_ta GING_API
                                     gging_api
        RoboMaker                    robomakerAWS_ENDPOINT_URL_ROBOMAKER
      Service-speciﬁc endpoints                                                               180
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        RolesAnywhere                rolesanyw AWS_ENDPOINT_URL_ROLESANYWHERE
                                     here
        Route 53                     route_53AWS_ENDPOINT_URL_ROUTE_53
        Route53 Recovery             route53_r AWS_ENDPOINT_URL_ROUTE53_RECOVERY_CLUSTER
        Cluster                      ecovery_c 
                                     luster
        Route53 Recovery             route53_r AWS_ENDPOINT_URL_ROUTE53_RECOVERY_CO 
        Control Config               ecovery_c NTROL_CONFIG
                                     ontrol_co 
                                     nfig
        Route53 Recovery             route53_r AWS_ENDPOINT_URL_ROUTE53_RECOVERY_RE 
        Readiness                    ecovery_r ADINESS
                                     eadiness
        Route 53 Domains             route_53_ AWS_ENDPOINT_URL_ROUTE_53_DOMAINS
                                     domains
        Route53Resolver              route53re AWS_ENDPOINT_URL_ROUTE53RESOLVER
                                     solver
        RUM                          rumAWS_ENDPOINT_URL_RUM
        S3                           s3AWS_ENDPOINT_URL_S3
      Service-speciﬁc endpoints                                                               181
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        S3 Control                   s3_contro AWS_ENDPOINT_URL_S3_CONTROL
                                     l
        S3Outposts                   s3outpost AWS_ENDPOINT_URL_S3OUTPOSTS
                                     s
        SageMaker                    sagemakerAWS_ENDPOINT_URL_SAGEMAKER
        SageMaker A2I Runtime        sagemaker AWS_ENDPOINT_URL_SAGEMAKER_A2I_RUNTIME
                                     _a2i_runt 
                                     ime
        Sagemaker Edge               sagemaker AWS_ENDPOINT_URL_SAGEMAKER_EDGE
                                     _edge
        SageMaker FeatureSt          sagemaker AWS_ENDPOINT_URL_SAGEMAKER_FEATUREST 
        ore Runtime                  _features ORE_RUNTIME
                                     tore_runt 
                                     ime
        SageMaker Geospatial         sagemaker AWS_ENDPOINT_URL_SAGEMAKER_GEOSPATIAL
                                     _geospati 
                                     al
        SageMaker Metrics            sagemaker AWS_ENDPOINT_URL_SAGEMAKER_METRICS
                                     _metrics
      Service-speciﬁc endpoints                                                               182
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        SageMaker Runtime            sagemaker AWS_ENDPOINT_URL_SAGEMAKER_RUNTIME
                                     _runtime
        savingsplans                 savingspl AWS_ENDPOINT_URL_SAVINGSPLANS
                                     ans
        Scheduler                    schedulerAWS_ENDPOINT_URL_SCHEDULER
        schemas                      schemasAWS_ENDPOINT_URL_SCHEMAS
        SimpleDB                     simpledbAWS_ENDPOINT_URL_SIMPLEDB
        Secrets Manager              secrets_m AWS_ENDPOINT_URL_SECRETS_MANAGER
                                     anager
        SecurityHub                  securityh AWS_ENDPOINT_URL_SECURITYHUB
                                     ub
        SecurityLake                 securityl AWS_ENDPOINT_URL_SECURITYLAKE
                                     ake
        ServerlessApplicat           serverles AWS_ENDPOINT_URL_SERVERLESSAPPLICATI 
        ionRepository                sapplicat ONREPOSITORY
                                     ionreposi 
                                     tory
        Service Quotas               service_q AWS_ENDPOINT_URL_SERVICE_QUOTAS
                                     uotas
      Service-speciﬁc endpoints                                                               183
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        Service Catalog              service_c AWS_ENDPOINT_URL_SERVICE_CATALOG
                                     atalog
        Service Catalog              service_c AWS_ENDPOINT_URL_SERVICE_CATALOG_APP 
        AppRegistry                  atalog_ap REGISTRY
                                     pregistry
        ServiceDiscovery             servicedi AWS_ENDPOINT_URL_SERVICEDISCOVERY
                                     scovery
        SES                          sesAWS_ENDPOINT_URL_SES
        SESv2                        sesv2AWS_ENDPOINT_URL_SESV2
        Shield                       shieldAWS_ENDPOINT_URL_SHIELD
        signer                       signerAWS_ENDPOINT_URL_SIGNER
        SimSpaceWeaver               simspacew AWS_ENDPOINT_URL_SIMSPACEWEAVER
                                     eaver
        SMS                          smsAWS_ENDPOINT_URL_SMS
        Snow Device Managemen        snow_devi AWS_ENDPOINT_URL_SNOW_DEVICE_MANAGEMENT
        t                            ce_manage 
                                     ment
        Snowball                     snowballAWS_ENDPOINT_URL_SNOWBALL
      Service-speciﬁc endpoints                                                               184
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        SNS                          snsAWS_ENDPOINT_URL_SNS
        SQS                          sqsAWS_ENDPOINT_URL_SQS
        SSM                          ssmAWS_ENDPOINT_URL_SSM
        SSM Contacts                 ssm_conta AWS_ENDPOINT_URL_SSM_CONTACTS
                                     cts
        SSM Incidents                ssm_incid AWS_ENDPOINT_URL_SSM_INCIDENTS
                                     ents
        Ssm Sap                      ssm_sapAWS_ENDPOINT_URL_SSM_SAP
        SSO                          ssoAWS_ENDPOINT_URL_SSO
        SSO Admin                    sso_adminAWS_ENDPOINT_URL_SSO_ADMIN
        SSO OIDC                     sso_oidcAWS_ENDPOINT_URL_SSO_OIDC
        SFN                          sfnAWS_ENDPOINT_URL_SFN
        Storage Gateway              storage_g AWS_ENDPOINT_URL_STORAGE_GATEWAY
                                     ateway
        STS                          stsAWS_ENDPOINT_URL_STS
        SupplyChain                  supplycha AWS_ENDPOINT_URL_SUPPLYCHAIN
                                     in
      Service-speciﬁc endpoints                                                               185
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        Support                      supportAWS_ENDPOINT_URL_SUPPORT
        Support App                  support_a AWS_ENDPOINT_URL_SUPPORT_APP
                                     pp
        SWF                          swfAWS_ENDPOINT_URL_SWF
        synthetics                   synthetic AWS_ENDPOINT_URL_SYNTHETICS
                                     s
        Textract                     textractAWS_ENDPOINT_URL_TEXTRACT
        Timestream InfluxDB          timestrea AWS_ENDPOINT_URL_TIMESTREAM_INFLUXDB
                                     m_influxd 
                                     b
        Timestream Query             timestrea AWS_ENDPOINT_URL_TIMESTREAM_QUERY
                                     m_query
        Timestream Write             timestrea AWS_ENDPOINT_URL_TIMESTREAM_WRITE
                                     m_write
        tnb                          tnbAWS_ENDPOINT_URL_TNB
        Transcribe                   transcrib AWS_ENDPOINT_URL_TRANSCRIBE
                                     e
        Transfer                     transferAWS_ENDPOINT_URL_TRANSFER
      Service-speciﬁc endpoints                                                               186
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        Translate                    translateAWS_ENDPOINT_URL_TRANSLATE
        TrustedAdvisor               trustedad AWS_ENDPOINT_URL_TRUSTEDADVISOR
                                     visor
        VerifiedPermissions          verifiedp AWS_ENDPOINT_URL_VERIFIEDPERMISSIONS
                                     ermission 
                                     s
        Voice ID                     voice_idAWS_ENDPOINT_URL_VOICE_ID
        VPC Lattice                  vpc_latti AWS_ENDPOINT_URL_VPC_LATTICE
                                     ce
        WAF                          wafAWS_ENDPOINT_URL_WAF
        WAF Regional                 waf_regio AWS_ENDPOINT_URL_WAF_REGIONAL
                                     nal
        WAFV2                        wafv2AWS_ENDPOINT_URL_WAFV2
        WellArchitected              wellarchi AWS_ENDPOINT_URL_WELLARCHITECTED
                                     tected
        Wisdom                       wisdomAWS_ENDPOINT_URL_WISDOM
        WorkDocs                     workdocsAWS_ENDPOINT_URL_WORKDOCS
      Service-speciﬁc endpoints                                                               187
      AWS SDKs and Tools                                                               Reference Guide
                                     Service 
        serviceId                       AWS_ENDPOINT_URL_<SERVICE>  environment variable
                                     identiﬁe 
                                     r 
                                     key 
                                     for 
                                     shared 
                                     AWS
                                     config
                                     ﬁle
        WorkLink                     worklinkAWS_ENDPOINT_URL_WORKLINK
        WorkMail                     workmailAWS_ENDPOINT_URL_WORKMAIL
        WorkMailMessageFlow          workmailm AWS_ENDPOINT_URL_WORKMAILMESSAGEFLOW
                                     essageflo 
                                     w
        WorkSpaces                   workspace AWS_ENDPOINT_URL_WORKSPACES
                                     s
        WorkSpaces Thin              workspace AWS_ENDPOINT_URL_WORKSPACES_THIN_CLIENT
        Client                       s_thin_cl 
                                     ient
        WorkSpaces Web               workspace AWS_ENDPOINT_URL_WORKSPACES_WEB
                                     s_web
        XRay                         xrayAWS_ENDPOINT_URL_XRAY
      Smart conﬁguration defaults
           Note
           For help in understanding the layout of settings pages, or in interpreting the Support by 
           AWS SDKs and tools table that follows, see Understanding the settings pages of this guide.
      Smart conﬁguration defaults                                                             188
      AWS SDKs and Tools                                                               Reference Guide
      With the smart conﬁguration defaults feature, AWS SDKs can provide predeﬁned, optimized 
      default values for other conﬁguration settings.
      Conﬁgure this functionality by using the following:
      defaults_mode - shared AWS config ﬁle setting, AWS_DEFAULTS_MODE - environment 
      variable, aws.defaultsMode - JVM system property: Java/Kotlin only
         With this setting, you can choose a mode that aligns with your application architecture, which 
         then provides optimized default values for your application. If an AWS SDK setting has a value 
         explicitly set, then that value always takes precedence. If an AWS SDK setting does not have a 
         value explicitly set, and defaults_mode is not equal to legacy, then this feature can provide 
         diﬀerent default values for various settings optimized for your application. Settings may include 
         the following: HTTP communication settings, retry behavior, service Regional endpoint settings, 
         and, potentially, any SDK-related conﬁguration. Customers who use this feature can get new 
         conﬁguration defaults tailored to common usage scenarios. If your defaults_mode is not 
         equal to legacy, we recommend performing tests of your application when you upgrade the 
         SDK, because the default values provided might change as best practices evolve.
         Default value: legacy
         Note: New major versions of SDKs will default to standard.
         Valid values:
         •
           legacy – Provides default settings that vary by SDK and existed before establishment of
           defaults_mode.
         •
           standard – Provides the latest recommended default values that should be safe to run in 
           most scenarios.
         •
           in-region – Builds on the standard mode and includes optimization tailored for 
           applications that call AWS services from within the same AWS Region.
         •
           cross-region – Builds on the standard mode and includes optimization tailored for 
           applications that call AWS services in a diﬀerent Region.
         •
           mobile – Builds on the standard mode and includes optimization tailored for mobile 
           applications.
         •
           auto – Builds on the standard mode and includes experimental features. The SDK attempts 
           to discover the runtime environment to determine the appropriate settings automatically. 
           The auto detection is heuristics-based and does not provide 100% accuracy. If the runtime 
      Smart conﬁguration defaults                                                             189
      AWS SDKs and Tools                                                               Reference Guide
           environment can't be determined, standard mode is used. The auto detection might 
           query instance metadata, which might introduce latency. If startup latency is critical to your 
           application, we recommend choosing an explicit defaults_mode instead.
         Example of setting this value in the config ﬁle:
           [default]
           defaults_mode = standard
         The following parameters might be optimized based on the selection of defaults_mode:
         •
           retryMode – Speciﬁes how the SDK attempts retries. See Retry behavior.
         •
           stsRegionalEndpoints – Speciﬁes how the SDK determines the AWS service endpoint 
           that it uses to talk to the AWS Security Token Service (AWS STS). See AWS STS Regional 
           endpoints.
         •
           s3UsEast1RegionalEndpoints – Speciﬁes how the SDK determines the AWS service 
           endpoint that it uses to talk to the Amazon S3 for the us-east-1 Region.
         •
           connectTimeoutInMillis – After making an initial connection attempt on a socket, the 
           amount of time before timing out. If the client does not receive a completion of the connect 
           handshake, the client gives up and fails the operation.
         •
           tlsNegotiationTimeoutInMillis – The maximum amount of time that a TLS handshake 
           can take from the time the CLIENT HELLO message is sent to the time the client and server 
           have fully negotiated ciphers and exchanged keys.
      The default value for each setting changes depending on the defaults_mode selected for your 
      application. These values are currently set as follows (subject to change):
        Parameter
                       standard mode                 in-region      cross-reg      mobile
                                                     mode                          mode
                                                                    ion  mode
        retryMode      standard                      standard       standard       standard
        stsRegion      regional                      regional       regional       regional
        alEndpoin 
        ts
      Smart conﬁguration defaults                                                             190
      AWS SDKs and Tools                                                               Reference Guide
        Parameter
                       standard mode                 in-region      cross-reg      mobile
                                                     mode                          mode
                                                                    ion  mode
        s3UsEast1      regional                      regional       regional       regional
        RegionalE 
        ndpoints
                       3100                          1100           3100           30000
        connectTi 
        meoutInMi 
        llis
                       3100                          1100           3100           30000
        tlsNegoti 
        ationTime 
        outInMill 
        is
      For example, if the defaults_mode you selected was standard, then the value of
      standard would be assigned for retry_mode (from the valid retry_mode options) and 
      the value of regional would be assigned for stsRegionalEndpoints (from the valid
      stsRegionalEndpoints options).
      Support by AWS SDKs and tools
      The following SDKs support the features and settings described in this topic. Any partial exceptions 
      are noted. Any JVM system property settings are supported by the AWS SDK for Java and the AWS 
      SDK for Kotlin only.
        SDK                           Supported                     Notes or more information
        AWS CLI v2                                No                 
        SDK for C++                               Yes               Parameters not optimized:
                                                                    stsRegionalEndpoints ,
                                                                    s3UsEast1RegionalE 
                                                                    ndpoints , tlsNegoti 
                                                                    ationTimeoutInMill 
                                                                    is .
      Smart conﬁguration defaults                                                             191
      AWS SDKs and Tools                                                               Reference Guide
        SDK                           Supported                     Notes or more information
        SDK for Go V2 (1.x)                       Yes               Parameters not optimized:
                                                                    retryMode , stsRegion 
                                                                    alEndpoints    ,
                                                                    s3UsEast1RegionalE 
                                                                    ndpoints .
        SDK for Go 1.x (V1)                       No                 
        SDK for Java 2.x                          Yes               Parameters not optimized:
                                                                    stsRegionalEndpoints .
        SDK for Java 1.x                          No                 
        SDK for JavaScript 3.x                    Yes               Parameters not optimized:
                                                                    stsRegionalEndpoints ,
                                                                    s3UsEast1RegionalE 
                                                                    ndpoints , tlsNegoti 
                                                                    ationTimeoutInMill 
                                                                    is . connectTi 
                                                                    meoutInMillis      is called
                                                                    connectionTimeout .
        SDK for JavaScript 2.x                    No                 
        SDK for Kotlin                            No                 
        SDK for .NET 4.x                          Yes               Parameters not optimized 
                                                                    : connectTimeoutInMi 
                                                                    llis , tlsNegoti 
                                                                    ationTimeoutInMill 
                                                                    is .
      Smart conﬁguration defaults                                                             192
      AWS SDKs and Tools                                                               Reference Guide
        SDK                           Supported                     Notes or more information
        SDK for .NET 3.x                          Yes               Parameters not optimized 
                                                                    : connectTimeoutInMi 
                                                                    llis , tlsNegoti 
                                                                    ationTimeoutInMill 
                                                                    is .
        SDK for PHP 3.x                           Yes               Parameters not optimized 
                                                                    : tlsNegotiationTime 
                                                                    outInMillis    .
        SDK for Python (Boto3)                    Yes               Parameters not optimized 
                                                                    : tlsNegotiationTime 
                                                                    outInMillis    .
        SDK for Ruby 3.x                          Yes
        SDK for Rust                              No                 
        SDK for Swift                             No                 
        Tools for PowerShell V5                   Yes               Parameters not optimized 
                                                                    : connectTimeoutInMi 
                                                                    llis , tlsNegoti 
                                                                    ationTimeoutInMill 
                                                                    is .
        Tools for PowerShell V4                   Yes               Parameters not optimized 
                                                                    : connectTimeoutInMi 
                                                                    llis , tlsNegoti 
                                                                    ationTimeoutInMill 
                                                                    is .
      Smart conﬁguration defaults                                                             193
      AWS SDKs and Tools                                                               Reference Guide
      AWS Common Runtime (CRT) libraries
      The AWS Common Runtime (CRT) libraries are a base library of the SDKs. The CRT is a modular 
      family of independent packages, written in C. Each package provides good performance and 
      minimal footprint for diﬀerent required functionalities. These functionalities are common and 
      shared across all SDKs providing better code reuse, optimization, and accuracy. The packages are:
      •
        awslabs/aws-c-auth: AWS client-side authentication (standard credential providers and 
        signing (sigv4))
      •
        awslabs/aws-c-cal: Cryptographic primitive types, hashes (MD5, SHA256, SHA256 HMAC), 
        signers, AES
      •
        awslabs/aws-c-common: Basic data structures, threading/synchronization primitive types, 
        buﬀer management, stdlib-related functions
      •
        awslabs/aws-c-compression: Compression algorithms (Huﬀman encoding/decoding)
      •
        awslabs/aws-c-event-stream: Event stream message processing (headers, prelude, payload, 
        crc/trailer), remote procedure call (RPC) implementation over event streams
      •
        awslabs/aws-c-http: C99 implementation of the HTTP/1.1 and HTTP/2 speciﬁcations
      •
        awslabs/aws-c-io: Sockets (TCP, UDP), DNS, pipes, event loops, channels, SSL/TLS
      •
        awslabs/aws-c-iot: C99 implementation of AWS IoT cloud services integration with devices
      •
        awslabs/aws-c-mqtt: Standard, lightweight messaging protocol for the Internet of Things 
        (IoT)
      •
        awslabs/aws-c-s3: C99 library implementation for communicating with the Amazon S3 
        service, designed for maximizing throughput on high bandwidth Amazon EC2 instances
      •
        awslabs/aws-c-sdkutils: A utilities library for parsing and managing AWS proﬁles
      •
        awslabs/aws-checksums: Cross-platform hardware-accelerated CRC32c and CRC32 with 
        fallback to eﬃcient software implementations
      •
        awslabs/aws-lc: General-purpose cryptographic library maintained by the AWS Cryptography 
        team for AWS and their customers, based on code from the Google BoringSSL project and the 
        OpenSSL project
      •
        awslabs/s2n: C99 implementation of the TLS/SSL protocols, designed to be small and fast 
        with security as a priority
      The CRT is available through all SDKs except Go and Rust.
                                                                                              194
     AWS SDKs and Tools                                           Reference Guide
     CRT dependencies
     The CRT libraries form a complex net of relationships and dependencies. Knowing these 
     relationships is helpful if you need to build the CRT directly from source. However, most users 
     access CRT functionality through their language SDK (such as AWS SDK for C++ or AWS SDK for 
     Java) or their language IoT device SDK (such as AWS IoT SDK for C++ or AWS IoT SDK for Java). 
     In the following diagram, the Language CRT Bindings box refers to the package wrapping the 
     CRT libraries for a speciﬁc language SDK. This is a collection of packages of the form aws-crt-*, 
     where '*' is an SDK language (such as aws-crt-cpp or aws-crt-java).
     The following is an illustration of the hierarchical dependencies of the CRT libraries.
     CRT dependencies                                                  195
     AWS SDKs and Tools                                           Reference Guide
     AWS SDKs and Tools maintenance policy
     Overview
     This document outlines the maintenance policy for AWS Software Development Kits (SDKs) and 
     Tools, including Mobile and IoT SDKs, and their underlying dependencies. AWS regularly provides 
     the AWS SDKs and Tools with updates that may contain support for new or updated AWS APIs, new 
     features, enhancements, bug ﬁxes, security patches, or documentation updates. Updates may also 
     address changes with dependencies, language runtimes, and operating systems. AWS SDK releases 
     are published to package managers (e.g. Maven, NuGet, PyPI), and are available as source code on 
     GitHub.
     We recommend users to stay up-to-date with SDK releases to keep up with the latest features, 
     security updates, and underlying dependencies. Continued use of an unsupported SDK version is 
     not recommended and is done at the user's discretion.
     Versioning
     The AWS SDK release versions are in the form of X.Y.Z where X represents the major version. 
     Increasing the major version of an SDK indicates that this SDK underwent signiﬁcant and 
     substantial changes to support new idioms and patterns in the language. Major versions are 
     introduced when public interfaces (e.g. classes, methods, types, etc.), behaviors, or semantics have 
     changed. Applications need to be updated in order for them to work with the newest SDK version. 
     It is important to update major versions carefully and in accordance with the upgrade guidelines 
     provided by AWS.
     SDK major version lifecycle
     The lifecycle for major SDKs and Tools versions consists of 5 phases, which are outlined below.
     • Developer Preview (Phase 0) - During this phase, SDKs are not supported, should not be used 
       in production environments, and are meant for early access and feedback purposes only. It is 
       possible for future releases to introduce breaking changes. Once AWS identiﬁes a release to be 
       a stable product, it may mark it as a Release Candidate. Release Candidates are ready for GA 
       release unless signiﬁcant bugs emerge, and will receive full AWS support.
     Overview                                                          196
      AWS SDKs and Tools                                                               Reference Guide
      • General Availability (GA) (Phase 1) - During this phase, SDKs are fully supported. AWS will provide 
        regular SDK releases that include support for new services, API updates for existing services, 
        as well as bug and security ﬁxes. For Tools, AWS will provide regular releases that include new 
        feature updates and bug ﬁxes. AWS will support the GA version of an SDK for at least 24 months.
      • Maintenance Announcement (Phase 2) - AWS will make a public announcement at least 6 months 
        before an SDK enters maintenance mode. During this period, the SDK will continue to be fully 
        supported. Typically, maintenance mode is announced at the same time as the next major 
        version is transitioned to GA.
      • Maintenance (Phase 3) - During the maintenance mode, AWS limits SDK releases to address 
        critical bug ﬁxes and security issues only. An SDK will not receive API updates for new or existing 
        services, or be updated to support new regions. Maintenance mode has a default duration of 12 
        months, unless otherwise speciﬁed.
      • End-of-Support (Phase 4) - When an SDK reaches end-of support, it will no longer receive 
        updates or releases. Previously published releases will continue to be available via public 
        package managers and the code will remain on GitHub. The GitHub repository may be archived. 
        Use of an SDK which has reached end-of-support is done at the user's discretion. We recommend 
        users upgrade to the new major version.
      The following is a visual illustration of the SDK major version lifecycle. Please note that the timelines 
      shown below are illustrative and not binding.
      Dependency lifecycle
      Most AWS SDKs have underlying dependencies, such as language runtimes, operating systems, 
      or third party libraries and frameworks. These dependencies are typically tied to the language 
      community or the vendor who owns that particular component. Each community or vendor 
      publishes their own end-of-support schedule for their product.
      The following terms are used to classify underlying third party dependencies:
      • Operating System (OS): Examples include Amazon Linux AMI, Amazon Linux 2, Windows 2008, 
        Windows 2012, Windows 2016, etc.
      • Language Runtime:  Examples include Java 7, Java 8, Java 11, .NET Core, .NET Standard, .NET 
        PCL, etc.
      • Third party Library / Framework: Examples include OpenSSL, .NET Framework 4.5, Java EE, etc.
      Dependency lifecycle                                                                    197
      AWS SDKs and Tools                                                               Reference Guide
      Our policy is to continue supporting SDK dependencies for at least 6 months after the community 
      or vendor ends support for the dependency. This policy, however, could vary depending on the 
      speciﬁc dependency.
           Note
           AWS reserves the right to stop support for an underlying dependency without increasing 
           the major SDK version
      Communication methods
      Maintenance announcements are communicated in several ways:
      • An email announcement is sent to aﬀected accounts, announcing our plans to end support for 
        the speciﬁc SDK version. The email will outline the path to end-of-support, specify the campaign 
        timelines, and provide upgrade guidance.
      • AWS SDK documentation, such as API reference documentation, user guides, SDK product 
        marketing pages, and GitHub readme(s) are updated to indicate the campaign timeline and 
        provide guidance on upgrading aﬀected applications.
      • An AWS blog post is published that outlines the path to end-of-support, as well as reiterates the 
        campaign timelines.
      • Deprecation warnings are added to the SDKs, outlining the path to end-of-support and linking to 
        the SDK documentation.
      To see the list of available major versions of AWS SDKs and Tools and where they are in their 
      maintenance lifecycle, see Version lifecycle.
      Communication methods                                                                   198
       AWS SDKs and Tools                                                                          Reference Guide
       AWS SDKs and Tools version lifecycle
       The table below shows the list of available AWS Software Development Kit (SDK) major versions 
       and where they are in the maintenance lifecycle with associated timelines. For detailed information 
       on the lifecycle for the major versions of AWS SDKs and Tools and their underlying dependencies, 
       see Maintenance policy.
         SDK                  Major version       Current Phase        General             Notes
                                                                       Availability 
                                                                       Date
         AWS CLI              1.x                 General Availabil    9/2/2013             
                                                  ity
         AWS CLI              2.x                 General Availabil    2/10/2020            
                                                  ity
         SDK for C++          1.x                 General Availabil    9/2/2015             
                                                  ity
         SDK for Go V2        V2 1.x              General Availabil    1/19/2021            
                                                  ity
         SDK for Go           1.x                 Maintenance          11/19/2015          See announcem 
                                                                                           ent for details 
                                                                                           and dates
         SDK for Java         1.x                 Maintenance          3/25/2010           See announcem 
                                                                                           ent for details 
                                                                                           and dates
         SDK for Java         2.x                 General Availabil    11/20/2018           
                                                  ity
         SDK for              1.x                 End-of-Support       5/6/2013             
         JavaScript
                                                                                                            199
       AWS SDKs and Tools                                                                          Reference Guide
         SDK                  Major version       Current Phase        General             Notes
                                                                       Availability 
                                                                       Date
         SDK for              2.x                 Maintenance          6/19/2014           See announcem 
         JavaScript                                                                        ent for details 
                                                                                           and dates
         SDK for              3.x                 General Availabil    12/15/2020           
         JavaScript                               ity
         SDK for Kotlin       1.x                 General Availabil    11/27/2023           
                                                  ity
         SDK for .NET         1.x                 End-of-Support       11/2009              
         SDK for .NET         2.x                 End-of-Support       11/8/2013            
         SDK for .NET         3.x                 General Availabil    7/28/2015            
                                                  ity
         SDK for .NET         4.x                 General Availabil    4/28/2025            
                                                  ity
         SDK for PHP          2.x                 End-of-Support       11/2/2012            
         SDK for PHP          3.x                 General Availabil    5/27/2015            
                                                  ity
         SDK for Python       1.x                 End-of-Support       7/13/2011            
         (Boto2)
         SDK for Python       1.x                 General Availabil    6/22/2015            
         (Boto3)                                  ity
         SDK for Python       1.x                 General Availabil    6/22/2015            
         (Botocore)                               ity
         SDK for Ruby         1.x                 End-of-Support       7/14/2011            
                                                                                                            200
       AWS SDKs and Tools                                                                          Reference Guide
         SDK                  Major version       Current Phase        General             Notes
                                                                       Availability 
                                                                       Date
         SDK for Ruby         2.x                 End-of-Support       2/15/2015            
         SDK for Ruby         3.x                 General Availabil    8/29/2017            
                                                  ity
         SDK for Rust         1.x                 General Availabil    11/27/2023           
                                                  ity
         SDK for Swift        1.x                 General Availabil    9/17/2024            
                                                  ity
         Tools for            2.x                 End-of-Support       11/8/2013            
         PowerShell
         Tools for            3.x                 End-of-Support       7/29/2015            
         PowerShell
         Tools for            4.x                 General Availabil    11/21/2019           
         PowerShell                               ity
         Tools for            5.x                 General Availabil    6/23/2025            
         PowerShell                               ity
       Searching for an SDK or tool not mentioned? Encryption SDKs, IoT Device SDKs, and Mobile SDKs, 
       for example, are not included in this guide. To ﬁnd documentation on these other tools, see Tools 
       to Build on AWS.
                                                                                                            201
       AWS SDKs and Tools                                                                    Reference Guide
       Document history for AWS SDKs and Tools Reference 
       Guide
       The following table describes important additions and updates to the AWS SDKs and Tools 
       Reference Guide. For notiﬁcation about updates to this documentation, you can subscribe to the 
       RSS feed.
        Change                           Description                     Date
        Adding new version of Tools      Adding latest version of Tools  June 23, 2025
        for PowerShell                   for PowerShell support to all 
                                         Setting reference Compatibi 
                                         lity with AWS SDKs tables. 
                                         Added Host preﬁx injection 
                                         feature.
        Page title updates               More titles, table titles,      March 5, 2025
                                         abstracts, and SEO updates.
        Page title updates               Updating content to use more    February 24, 2025
                                         descriptive titles.
        Adding Swift SDK to Settings     Adding Swift SDK support        September 17, 2024
        reference                        to all Setting reference 
                                         Compatibility with AWS SDKs 
                                         tables.
        SDK for Java 1.x system          Add details about supported     May 30, 2024
        properties                       JVM system conﬁguration 
                                         settings by the AWS SDK for 
                                         Java 1.x.
        Settings updates                 Add JVM system conﬁgura         March 27, 2024
                                         tion settings.
                                                                                                      202
       AWS SDKs and Tools                                                                    Reference Guide
        Compatibility table updates      Updates to compatibility for    February 20, 2024
                                         SDK support, updates to IAM 
                                         Identity Center procedures.
        Container credential update.     Adding support for Amazon       December 29, 2023
        IMDS update.                     EKS. Adding setting to disable 
                                         IMDSv1 fallback.
        Request compression              Adding settings for request     December 27, 2023
                                         compression feature.
        Compatibility tables             Compatibility tables for SDK    December 10, 2023
                                         and tool features updated to 
                                         include SDK for Kotlin, SDK 
                                         for Rust, and AWS Tools for 
                                         PowerShell.
        Authentication updates           Updates to supported            July 1, 2023
                                         methods of authentication for 
                                         SDKs and tools.
        IAM best practices updates       Updated guide to align          February 27, 2023
                                         with the IAM best practices 
                                         . For more information, see
                                         Security best practices in IAM.
        SSO updates                      Updates to SSO credentia        November 19, 2022
                                         ls for the new SSO token 
                                         conﬁguration.
        Settings updates                 Updates to support table for    November 17, 2022
                                         General conﬁguration and 
                                         for Amazon S3 Multi-Region 
                                         Access Points.
                                                                                                      203
       AWS SDKs and Tools                                                                        Reference Guide
         Settings updates                 Updates to clarity of IMDS        November 4, 2022
                                          client and IMDS credentia 
                                          ls. Updates to Environment 
                                          variables.
         Updating welcome page            Announcing Amazon                 September 22, 2022
                                          CodeWhisperer.
         Service name change for          Updates to reﬂect that AWS        July 26, 2022
         single sign-on                   SSO is now referred to as AWS 
                                          IAM Identity Center.
         Settings update                  Minor updates to conﬁg ﬁle        June 15, 2022
                                          details and to supported 
                                          settings.
         Update                           Massive update of almost all      February 1, 2022
                                          parts of this guide.
         Initial release                  The ﬁrst release of this guide    March 13, 2020
                                          is released to the public.
                                                                                                         204
