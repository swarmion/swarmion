---
sidebar_position: 4
---

# Configure your CI/CD

## Choose your CI/CD provider

By default, Swarmion uses Github Actions to deploy. However, we have already used GitlabCI and CircleCI to deploy Swarmion projects. This guide will focus on Github Actions.

## Setup the CD authentication

In order to be able to deploy resources on AWS, your CI needs **authentication** and **permissions**. There are two main ways to provide authentication:

- create an IAM user on the target AWS account, retrieve its credentials
- create an IAM role that can be assumed by a trusted party

We strongly recommend the second option, as it will remove the risk of losing long-lived credentials. The Swarmion CI/CD from all starters, uses this method by default.

### With OpenID Connect (OIDC)

If you use Github Actions, we can recommend to follow [these guidelines](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services) to setup OIDC for your pipeline.

If you are using the Swarmion generated CI, once you have created the role, retrieve its ARN and place it in a Github Actions secret named `AWS_ROLE_ARN_PRODUCTION`.

### With an IAM user

You can follow the same procedure as in the [install docs](../getting-started/get-started-on-aws), except:

- DO NOT give that user an "Administrator Access"
- Create a policy with the least privileges as explained in [the next section](#restrict-cd-permissions)
- Instead, attach it the policy or policies that you have created in the previous step
- Save the Access Key Id and Secret Access Key in order to pass them as credentials in your CI

## Restrict CD permissions

Handling permissions for your CI/CD should depend on the authentication choice. When using an IAM user, you should definitely create a custom policy with the least privileges attached to this user. However, if you use OIDC, the risk is far more mitigated, so it is safer to give it admin permissions.

### Create a deploy policy

You can find a sample policy. Please review it before creating it!

<details>
  <summary>Sample policy</summary>
  <p>

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:DeleteRolePolicy",
        "iam:GetRole",
        "iam:GetRolePolicy",
        "iam:ListRoleTags",
        "iam:PassRole",
        "iam:PutRolePolicy",
        "iam:TagPolicy",
        "iam:TagRole",
        "iam:UntagPolicy",
        "iam:UntagRole",
        "s3:DeleteBucket",
        "s3:DeleteObject",
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "apigateway:DELETE",
        "apigateway:PUT",
        "apigateway:POST",
        "apigateway:PATCH",
        "apigateway:GET"
      ],
      "Resource": [
        "arn:aws:apigateway:*::/apis*",
        "arn:aws:apigateway:*::/tags*",
        "arn:aws:apigateway:*::/domainnames",
        "arn:aws:apigateway:*::/domainnames*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:UpdateRoleDescription",
        "iam:CreateServiceLinkedRole",
        "iam:DeleteServiceLinkedRole",
        "iam:GetServiceLinkedRoleDeletionStatus"
      ],
      "Resource": "arn:aws:iam::*:role/aws-service-role/rds.amazonaws.com/AWSServiceRoleForRDS",
      "Condition": {
        "StringLike": {
          "iam:AWSServiceName": "rds.amazonaws.com"
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:UpdateRoleDescription",
        "iam:CreateServiceLinkedRole",
        "iam:DeleteServiceLinkedRole",
        "iam:GetServiceLinkedRoleDeletionStatus"
      ],
      "Resource": "arn:aws:iam::*:role/aws-service-role/ops.apigateway.amazonaws.com/AWSServiceRoleForAPIGateway",
      "Condition": {
        "StringLike": {
          "iam:AWSServiceName": "ops.apigateway.amazonaws.com"
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": "lambda:InvokeFunction",
      "Resource": "arn:aws:lambda:*:*:*-runMigrations"
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudformation:CreateStack",
        "cloudformation:DeleteStack",
        "cloudformation:DescribeStackEvents",
        "cloudformation:DescribeStackResource",
        "cloudformation:DescribeStackResources",
        "cloudformation:DescribeStacks",
        "cloudformation:ListExports",
        "cloudformation:ListStackResources",
        "cloudformation:UpdateStack",
        "cloudformation:ValidateTemplate",
        "cloudfront:CreateCloudFrontOriginAccessIdentity",
        "cloudfront:CreateDistribution",
        "cloudfront:CreateDistributionWithTags",
        "cloudfront:CreateFunction",
        "cloudfront:CreateInvalidation",
        "cloudfront:CreateStreamingDistributionWithTags",
        "cloudfront:DeleteCloudFrontOriginAccessIdentity",
        "cloudfront:DeleteDistribution",
        "cloudfront:DeleteFunction",
        "cloudfront:DescribeFunction",
        "cloudfront:GetCloudFrontOriginAccessIdentity",
        "cloudfront:GetCloudFrontOriginAccessIdentityConfig",
        "cloudfront:GetDistribution",
        "cloudfront:GetDistributionConfig",
        "cloudfront:GetInvalidation",
        "cloudfront:ListCloudFrontOriginAccessIdentities",
        "cloudfront:ListDistributions",
        "cloudfront:ListFunctions",
        "cloudfront:ListInvalidations",
        "cloudfront:ListTagsForResource",
        "cloudfront:PublishFunction",
        "cloudfront:TagResource",
        "cloudfront:UntagResource",
        "cloudfront:UpdateCloudFrontOriginAccessIdentity",
        "cloudfront:UpdateDistribution",
        "cloudfront:UpdateFunction",
        "cognito-idp:CreateUserPool",
        "cognito-idp:CreateUserPoolClient",
        "cognito-idp:CreateUserPoolDomain",
        "cognito-idp:DeleteUserPool",
        "cognito-idp:DeleteUserPoolClient",
        "cognito-idp:DeleteUserPoolDomain",
        "cognito-idp:DescribeUserPool",
        "cognito-idp:DescribeUserPoolClient",
        "cognito-idp:DescribeUserPoolDomain",
        "cognito-idp:ListUserPoolClients",
        "cognito-idp:ListUserPools",
        "cognito-idp:UpdateUserPool",
        "cognito-idp:UpdateUserPoolClient",
        "cognito-idp:UpdateUserPoolDomain",
        "lambda:AddPermission",
        "lambda:CreateFunction",
        "lambda:DeleteFunction",
        "lambda:GetFunction",
        "lambda:GetFunctionConfiguration",
        "lambda:ListVersionsByFunction",
        "lambda:PublishVersion",
        "lambda:RemovePermission",
        "lambda:UpdateFunctionCode",
        "lambda:UpdateFunctionConfiguration",
        "logs:CreateLogGroup",
        "logs:DeleteLogGroup",
        "logs:DescribeLogGroups",
        "rds:AddTagsToResource",
        "rds:CreateDBCluster",
        "rds:CreateDBClusterSnapshot",
        "rds:DeleteDBCluster",
        "rds:DescribeDBClusters",
        "rds:DescribeDBClusterSnapshots",
        "rds:ModifyDBCluster",
        "rds:RemoveTagsFromResource",
        "s3:CreateBucket",
        "s3:DeleteBucket",
        "s3:DeleteBucketPolicy",
        "s3:GetBucketPolicy",
        "s3:GetBucketPolicyStatus",
        "s3:ListBucket",
        "s3:PutBucketPolicy",
        "s3:PutEncryptionConfiguration",
        "secretsmanager:CreateSecret",
        "secretsmanager:DeleteSecret",
        "secretsmanager:GetRandomPassword",
        "secretsmanager:GetSecretValue",
        "secretsmanager:TagResource"
      ],
      "Resource": "*"
    }
  ]
}
```

  </p>
</details>

Then create the policy:

- Go to [the IAM console](https://console.aws.amazon.com/iamv2/home?#/policies);
- Click on "create policy";
- Select the JSON tab;
- Paste the JSON file from the sample policy (or your custom policy);
- Click on "Next: tags", then "Next: review";
- Check that your policy is correct;
- Click on "Create policy".
