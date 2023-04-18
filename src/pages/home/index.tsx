import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Box, Flex, Skeleton } from '@chakra-ui/react'
import Container from 'components/Container'
// import { Hero } from 'components/Hero'
// import { NavBar } from 'components/NavBar'

// const Footer = dynamic(() => import('components/Footer'), {
//   suspense: true,
// })

// const DexContainer = dynamic(() => import('components/Home/DexContainer'), {
//   suspense: true,
// })
// const Pools = dynamic(() => import('components/Home/Pools'), {
//   suspense: true,
// })
// const Ecosystem = dynamic(() => import('components/Home/Ecosystem'), {
//   suspense: true,
// })

function BackgroundVideo() {
  return (
    <Box position='absolute' top={0} left={0} width='100%' height='100vh'>
      <Box
        as='video'
        autoPlay
        loop
        muted
        playsInline
        height='100%'
        objectFit={{ base: 'cover', sm: 'cover' }}
        margin='0 auto'
      >
        <source src='/aeq-video-background.mp4' />
      </Box>
    </Box>
  )
}

const Index = () => (
  <Container 
    // minHeight="100vh" 
    // overflow={"hidden"}
  >
    {/* <NavBar /> */}
    <BackgroundVideo />

    <Flex
      position="relative"
      boxSizing="content-box"
      flexDirection="column"
      paddingX={{ base: 6, md: 8 }}
      paddingBottom={12}
      maxWidth="1110px"
      _after={{
        content: "''",
        position: "absolute",
        bottom: "0",
        width: "100%",
        height: "948px",
        backgroundColor: "#B14F39",
        mixBlendMode: "normal",
        filter: "blur(900px)",
        transform: "translateY(100%)",
      }}
    >
      {/* <Hero /> */}

      <Suspense fallback={<Skeleton />}>
        {/* <DexContainer />
        <Pools />
        <Ecosystem />
        <Footer /> */}
      </Suspense>
    </Flex>
  </Container>
)

export default Index