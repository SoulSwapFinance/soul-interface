import React, { useContext, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";

const Scrollbar: React.FC<any> = (props) => {
  const barColor = props?.style?.barColor || "#09172E";
  // @ts-ignore
  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      backgroundColor: barColor,
      borderRadius: "8px",
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };

  return (
    <Scrollbars
      renderThumbHorizontal={renderThumb}
      renderThumbVertical={renderThumb}
      {...props}
    />
  );
};

export default Scrollbar;