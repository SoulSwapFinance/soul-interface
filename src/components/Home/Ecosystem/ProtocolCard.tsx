import { Flex, Heading, Link, Text } from "@chakra-ui/react"
import Image from "next/image"

interface ProtocolCardProps {
  image: any
  title: string
  text: string
  link: string
}

function ProtocolCard({ image, title, text, link }: ProtocolCardProps) {
  return (
    <Flex
      flex={1}
      flexDirection="column"
      overflow="hidden"
      borderRadius="29px"
      bg="gray.900"
    >
      <Image src={image} alt={title} layout="responsive" />

      <Flex flex={1} flexDirection="column" paddingY={8} paddingX={6}>
        <Heading
          as="h4"
          fontSize={{ base: "3xl", md: "4xl" }}
          paddingBottom={2}
        >
          {title}
        </Heading>
        <Text flex={1} paddingBottom={9}>
          {text}
        </Text>

        <Link href={link} isExternal color="purple">
          Discover
          {/* <ArrowForwardIcon marginLeft={4} fill="purple" /> */}
        </Link>
      </Flex>
    </Flex>
  )
}

export default ProtocolCard