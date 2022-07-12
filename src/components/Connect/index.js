import React from "react";
import cn from "classnames";
import styles from "./Connect.module.sass";
import Icon from "../Icon";

const Connect = ({ className }) => {
  return (
    <div className={cn(className, styles.connect)}>
      <div className={styles.icon}>
        <Icon name="wallet" size="24" />
      </div>
      <div className={styles.info}>
        You need to connect your wallet first to sign messages and send
        transaction to Ethereum network
      </div>
      <div className={styles.btns}>
        <button className={cn("button", styles.button)}>Connect wallet</button>
        <button className={cn("button-stroke", styles.button)}>Cancel</button>
      </div>
    </div>
  );
};

export default Connect;
