import { CfnOutput, Duration, RemovalPolicy } from 'aws-cdk-lib';
import {
  AllowedMethods,
  Distribution,
  OriginAccessIdentity,
  SecurityPolicyProtocol,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { CanonicalUserPrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import {
  BlockPublicAccess,
  Bucket,
  BucketEncryption,
} from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import {
  Certificate,
  CertificateValidation,
} from 'aws-cdk-lib/aws-certificatemanager';
import { Construct } from 'constructs';

import { defaultStage, getAppStage } from './utils/getAppStage';
import { getDomainNames } from './utils/getDomainNames';

export class StaticSite extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const stage = getAppStage(this);

    const cloudfrontOAI = new OriginAccessIdentity(this, 'cloudfront-OAI');

    const siteBucket = new Bucket(this, 'SiteBucket', {
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy:
        stage === defaultStage ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
      autoDeleteObjects: stage === defaultStage ? true : false,
      enforceSSL: true,
      encryption: BucketEncryption.S3_MANAGED,
    });

    siteBucket.addToResourcePolicy(
      new PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [siteBucket.arnForObjects('*')],
        principals: [
          new CanonicalUserPrincipal(
            cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId,
          ),
        ],
      }),
    );

    const domainNames = getDomainNames(stage);

    const certificate =
      domainNames.length === 0
        ? undefined
        : new Certificate(this, 'Certificate', {
            domainName: '*.swarmion.dev',
            validation: CertificateValidation.fromDns(),
          });

    const distribution = new Distribution(this, 'SiteDistribution', {
      defaultRootObject: 'index.html',
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
      domainNames,
      certificate,
      defaultBehavior: {
        origin: new S3Origin(siteBucket, {
          originAccessIdentity: cloudfrontOAI,
        }),
        compress: true,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      errorResponses: [
        {
          httpStatus: 403,
          ttl: Duration.seconds(0),
          responsePagePath: '/index.html',
          responseHttpStatus: 200,
        },
      ],
    });

    new BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [Source.asset('./build')],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    new CfnOutput(this, 'StaticSiteDomain', {
      value: distribution.distributionDomainName,
    });
  }
}
