import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'News & Events',
    Svg: require('@site/static/img/home/post.svg').default,
    description: (
      <>
        Create and share your news and events with the student community
        of Centrale Nantes!
      </>
    ),
  },
  {
    title: 'Groups',
    Svg: require('@site/static/img/home/club.svg').default,
    description: (
      <>
        Create a group for your club, association, roommate or more, and
        customize it!
      </>
    ),
  },
  {
    title: 'Roommates Map',
    Svg: require('@site/static/img/home/roommates.svg').default,
    description: (
      <>
        Find all the roommates of the school on this map,
        and discover your predecessors!
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
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
}

export default function HomepageFeatures() {
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
}
