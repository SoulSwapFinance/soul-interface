import React from "react";
import cn from "classnames";
import Image from 'next/image'
import styles from "./Player.module.sass";
import Icons from "../Icons";

const Player = ({ className, item }) => {
  return (
    <div className={cn(styles.player, className)}>
      <div className={styles.preview}>
        <Image
          // srcSet={`${item.image2x} 2x`}
          src={item.image}
          alt="Video preview"
        />
        <div className={styles.control}>
          <button className={cn(styles.button, styles.play)}>
            <Icons name="play" size="24" />
          </button>
          <div className={styles.line}>
            <div className={styles.progress} style={{ width: "20%" }}></div>
          </div>
          <div className={styles.time}>2:20</div>
          <button className={styles.button}>
            <Icons name="volume" size="24" />
          </button>
          <button className={styles.button}>
            <Icons name="full-screen" size="24" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Player;
