import { CfnOutput, Duration, RemovalPolicy } from 'aws-cdk-lib';
import {
  Certificate,
  CertificateValidation,
} from 'aws-cdk-lib/aws-certificatemanager';
import {
  AllowedMethods,
  Distribution,
  SecurityPolicyProtocol,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import {
  BlockPublicAccess,
  Bucket,
  BucketEncryption,
} from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

import { defaultStage, getAppStage } from './utils/getAppStage';
import { getDomainNames } from './utils/getDomainNames';

export class StaticSite extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const stage = getAppStage(this);

    const siteBucket = new Bucket(this, 'SiteBucket', {
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy:
        stage === defaultStage ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
      autoDeleteObjects: stage === defaultStage ? true : false,
      enforceSSL: true,
      encryption: BucketEncryption.S3_MANAGED,
    });

    const domainNames = getDomainNames(stage);

    const certificate = (() => {
      if (domainNames.length === 0) {
        return;
      }

      const [mainDomainName, ...alternateDomainNames] = domainNames;

      return new Certificate(this, 'CertificateApex', {
        domainName: mainDomainName,
        subjectAlternativeNames: alternateDomainNames,
        validation: CertificateValidation.fromDns(),
      });
    })();

    const distribution = new Distribution(this, 'SiteDistribution', {
      defaultRootObject: 'index.html',
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
      domainNames,
      certificate,
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(siteBucket),
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
