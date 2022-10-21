import React from "react";
import { FormattedValueType } from "utils/account/types";

const FormattedValue: React.FC<{
  formattedValue: FormattedValueType;
  decimals?: number;
  fontSize?: string;
  tokenSymbol?: string;
  currencySymbol?: string;
  fontWeight?: string;
  color?: string;
}> = ({
  formattedValue,
  tokenSymbol,
  currencySymbol,
  fontSize,
  fontWeight,
  color,
}) => {
  const getStyle = () => {
    let style = {} as any;
    fontSize && (style.fontSize = fontSize);
    fontWeight && (style.fontWeight = fontWeight);
    color && (style.color = color);

    return style;
  };
  return (
    <div style={getStyle()}>
      {`${currencySymbol ? currencySymbol : ""}${formattedValue[0]}${
        formattedValue[1] !== ".00" ? formattedValue[1] : ""
      } ${tokenSymbol ? tokenSymbol : ""}`}
    </div>
  );
};

export default FormattedValue;