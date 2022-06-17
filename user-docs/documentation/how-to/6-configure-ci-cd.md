---
sidebar_position: 6
---

# Configure your CI/CD

## Choose the correct IAM policy to give your CI user

In order to restrict the abilities of the ci user on the testing and production environment, you need to create one or many policies to give that user.

You can find a sample policy [here](#sample-policy).

- Go to [the IAM console](https://console.aws.amazon.com/iamv2/home?#/policies);
- Click on "create policy";
- Select the JSON tab;
- Paste the JSON file from the sample policy (or your custom policy);
- Click on "Next: tags", then "Next: review";
- Check that your policy is correct;
- Click on "Create policy".

## Create an IAM user

You can follow the same procedure than in the [install docs](../getting-started/2-get-started-on-aws), except:

- DO NOT give that user an "Administrator Access"
- Instead, attach it the policy or policies that you have created in the previous step;
- Save the Access Key Id and Secret Access Key in order to pass them as credentials in your CI.

## Sample Policy

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
