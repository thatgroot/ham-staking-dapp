import React from "react";
import { CSSProperties } from "react";

export const Flex: React.FC<FlexProps> = ({
  as = "div",
  flexDirection = "row",
  alignItems = "stretch",
  justifyContent = "flex-start",
  gap = "0",
  children,
  style,
  ...rest
}) => {
  const Component = as;

  const flexStyle: CSSProperties = {
    display: "flex",
    flexDirection,
    alignItems,
    justifyContent,
    gap,
    ...style,
  };

  return (
    <Component style={flexStyle} {...rest}>
      {children}
    </Component>
  );
};
