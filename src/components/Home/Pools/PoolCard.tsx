// import { ReactNode } from "react"
import {
  Flex,
  GridItem,
  GridItemProps,
  Heading,
  HeadingProps,
  Text,
} from "@chakra-ui/react"
import { PoolImage } from "./PoolImage"

interface PoolCardProps extends GridItemProps {
  index: number
  icon: any
  title: string
  text: string
  visible: boolean
  headingProps?: HeadingProps
}

export function PoolCard({
  index,
  icon,
  title,
  text,
  visible,
  headingProps = {},
  ...props
}: PoolCardProps) {
  return (
    <GridItem
      as={Flex}
      flexDirection="column"
      alignItems="center"
      textAlign="center"
      opacity={visible ? 1 : 0}
      transform={
        visible
          ? "translateX(0)"
          : `translateX(${index % 2 === 0 ? "-" : ""}75px)`
      }
      transition={`opacity 0.2s ease-in ${
        index * 0.2
      }s, transform 0.4s ease-in ${index * 0.2}s`}
      {...props}
    >
      <PoolImage src={icon} alt={title} />
      <Heading
        as="h3"
        paddingTop={4}
        paddingBottom={2}
        fontSize={{ base: "3xl", lg: "4xl" }}
        fontWeight={500}
        {...headingProps}
      >
        {title}
      </Heading>
      <Text>{text}</Text>
    </GridItem>
  )
}