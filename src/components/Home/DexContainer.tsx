import { useRef } from "react"
import Image from "next/image"
import { Box, Flex, Grid, Heading, HStack, Text, } from "@chakra-ui/react"
import moneyTransferIcon from "assets/home/money-transfer-icon.svg"
import { useIntersection } from "hooks/useIntersection"
// import dexPreview from "../../../public/dex-preview.png"
// import chartIcon from "../../../public/chart-icon.svg"
// import transactionsIcon from "../../../public/transactions-icon.svg"
// import bicepIcon from "../../../public/bicep-icon.svg"
// import { DexReason } from "./DexReason"

function DexReason({
  index,
  text,
  icon,
  visible,
}: {
  index: number
  text: string
  icon: any
  visible: boolean
}) {
  return (
    <HStack
      spacing={4}
      padding={6}
      bg="gray.900"
      borderRadius="24px"
      borderWidth="1px"
      borderColor="gray.800"
      boxShadow="0px 2px 24px rgba(96, 43, 30, 0.25)"
      opacity={visible ? 1 : 0}
      transform={visible ? "translateY(0)" : "translateY(75px)"}
      transition={`opacity 0.2s ease-in ${
        index * 0.2
      }s, transform 0.4s ease-in ${index * 0.2}s`}
    >
      <Image src={icon} alt="Chart icon" />

      <Text fontSize="18px" fontWeight={700}>
        {text}
      </Text>
    </HStack>
  )
}

function DexContainer() {
  const intersectionRef = useRef(null)
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "0px",
    threshold: 0.2,
  })
  const dexInView =
    intersection !== null && intersection.intersectionRatio >= 0.1

  return (
    <Flex
      as="section"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      marginBottom="144px"
    >
      <Heading
        as="h2"
        fontSize={{ base: "3xl", md: "5xl" }}
        fontWeight={900}
        paddingBottom={"72px"}
        textAlign="center"
        textShadow={"0px 2px 0px rgba(0, 0, 0, 0.25)"}
      >
        Self-Governed, Auto-Rebalancing Crypto Portfolios
      </Heading>

      <Flex width="100%" flexDirection="column" alignItems="center">
        <Box maxWidth="843px">
          {/* <Image src={dexPreview} alt="Dex preview" /> */}
        </Box>

        <Grid
          ref={intersectionRef}
          marginTop="-20%"
          templateRows={{ base: "repeat(4, 1fr)", md: "repeat(2, 1fr)" }}
          templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
          columnGap={8}
          rowGap={6}
        >
          {/* <DexReason
            index={0}
            text="Amplify liquidity mining yield with up to 30% of all AEQ emissions"
            icon={chartIcon}
            visible={dexInView}
          /> */}
          <DexReason
            index={1}
            text="Earn a portion of the swap fees"
            icon={moneyTransferIcon}
            visible={dexInView}
          />
          {/* <DexReason
            index={2}
            text="Vote to direct rewards to your favourite pools"
            icon={transactionsIcon}
            visible={dexInView}
          /> */}
          {/* <DexReason
            index={3}
            text="Flex your voting biceps in protocol governance"
            icon={bicepIcon}
            visible={dexInView}
          /> */}
        </Grid>
      </Flex>
    </Flex>
  )
}

export default DexContainer