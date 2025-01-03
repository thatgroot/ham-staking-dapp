import { Flex } from "./flex";

export default function HBox({
  children,
  ...rest
}: Omit<FlexProps, "direction">) {
  return <Flex {...rest}>{children}</Flex>;
}
