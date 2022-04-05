import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Built for Scale',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Swarmion helps you handle changes in your team organization, by clearly
        separating service-specific and shared code.
      </>
    ),
  },
  {
    title: 'Built for Dev Experience',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
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
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Using end-to-end typing and validation contracts, Swarmion clearly
        defines interactions between your services and uses them to prevent
        breaking changes.
      </>
    ),
  },
];

const Feature = ({ title, Svg, description }: FeatureItem) => {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
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
