import React from "react";

const InputError: React.FC<any> = ({ error, fontSize }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "22px",
        fontSize: fontSize || "14px",
        color: "#F84239",
      }}
    >
      {error}
    </div>
  );
};

export default InputError;