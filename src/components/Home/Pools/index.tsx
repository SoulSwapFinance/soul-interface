import { Flex, Grid, Heading } from "@chakra-ui/react"
import poolsLiquidity from "assets/home/pools-liquidity.svg"
import { PoolCard } from "./PoolCard"
import { useRef } from "react"
import { useIntersection } from "hooks/useIntersection"

function Pools() {
  const intersectionRef = useRef(null)
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "0px",
    threshold: 0.2,
  })
  const inView = intersection !== null && intersection.intersectionRatio >= 0.1

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
        Create Liquidity Pools
      </Heading>

      <Grid
        ref={intersectionRef}
        templateRows={{ base: "repeat(5, 1fr)", md: "repeat(3, 1fr)" }}
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
        columnGap="44px"
        rowGap={14}
      >
        <PoolCard
          colSpan={1}
          index={3}
          icon={poolsLiquidity}
          title="Liquidity Bootstrapping"
          text="Build on our platform with lower initial capital requirements that scale into higher liquidity across time."
          visible={inView}
        />
      </Grid>
    </Flex>
  )
}

export default Pools