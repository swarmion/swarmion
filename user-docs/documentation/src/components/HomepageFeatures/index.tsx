import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  imgSrc: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Built for Scale',
    imgSrc: require('@site/static/img/hive.png').default,
    description: (
      <>
        Swarmion helps you handle changes in your team organization, by clearly
        separating service-specific and shared code.
      </>
    ),
  },
  {
    title: 'Built for Dev Experience',
    imgSrc: require('@site/static/img/bee.png').default,
    description: (
      <>
        Using optimized development tools, Swarmion provides a seamless
        developer experience and makes it easy to collaborate on your scaling
        codebase.
      </>
    ),
  },
  {
    title: 'Built for Stability',
    imgSrc: require('@site/static/img/bee-stable.png').default,
    description: (
      <>
        Using end-to-end typing and validation contracts, Swarmion clearly
        defines interactions between your services and uses them to prevent
        breaking changes.
      </>
    ),
  },
];

const Feature = ({ title, imgSrc, description }: FeatureItem) => {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img className={styles.featureImg} src={imgSrc} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};
const HomepageFeatures = (): JSX.Element => {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomepageFeatures;
