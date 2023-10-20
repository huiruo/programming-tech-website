import React from 'react'
import Layout from '@theme/Layout'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import styles from './index.module.css';
import clsx from 'clsx';
import Link from '@docusaurus/Link';

/**
 * If you added slug: / to a doc to make it the homepage, you should delete
 * the existing homepage at ./src/pages/index.js, or else there will be two 
 * files mapping to the same route!
 * 
 * https://docusaurus.io/zh-CN/docs/next/docs-introduction
 * https://docusaurus.io/zh-CN/docs/docs-introduction
*/
export function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/start">
            ️Getting Started
          </Link>
        </div>
      </div>
    </header>
  );
}

const Main = () => {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
    </Layout>
  )
}

export default Main