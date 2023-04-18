import Image, { ImageProps } from "next/image"
import { Flex } from "@chakra-ui/react"
import gradient from "assets/home/pools-gradient.svg"

const IMAGE_SIZE = "64px"

export function PoolImage(props: ImageProps) {
  return (
    <Flex position="relative" alignItems="center" justifyContent="center">
      <Flex
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-40%, -40%)"
        alignItems="center"
        justifyContent="center"
      >
        <Image 
            src={gradient}
            alt="Gradient" 
            layout="fixed" 
        />
      </Flex>
      <Image {...props} 
        layout="fixed"
        width={IMAGE_SIZE}
        height={IMAGE_SIZE}
        alt={""}
      />
    </Flex>
  )
}