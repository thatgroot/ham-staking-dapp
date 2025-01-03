import { Flex } from "./flex";

export default function VBox({
  children,
  ...rest
}: Omit<FlexProps, "direction">) {
  return (
    <Flex flexDirection="column" {...rest}>
      {children}
    </Flex>
  );
}
