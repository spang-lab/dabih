import React from 'react';
import styles from './Spinner.module.css';

export default function Spinner() {
  const classes = `
    ${styles.loader}
    bg-main-mid
  `;
  return <div className={classes} />;
}
