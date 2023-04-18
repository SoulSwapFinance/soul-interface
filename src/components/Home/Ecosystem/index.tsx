import { Flex, Heading, Stack } from "@chakra-ui/react"
// import luxorBg from "assets/home/luxor-bg.png"
import ProtocolCard from "./ProtocolCard"

function Ecosystem() {
  return (
    <Flex
      as="section"
      zIndex={1}
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
        Featured Ecosystem Protocols
      </Heading>

      <Stack direction={{ base: "column", sm: "row" }} spacing={6}>
        <ProtocolCard
          image={'https://raw.githubusercontent.com/soulswapfinance/assets/prod/blockchains/fantom/assets/0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b/logo.png'}
          title="Luxor Money"
          text="Reserve Currency with Asset-Backing."
          link={'https://soul.sh/luxor/dashboard'}
        />
      </Stack>
    </Flex>
  )
}

export default Ecosystem