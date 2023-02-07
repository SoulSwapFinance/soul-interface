import React from 'react'
import { Wrap } from 'components/ReusableStyles'
import DoubleGlowShadowV2 from 'components/DoubleGlowShadowV2'
import Container from 'components/Container'
import Head from 'next/head'
import FarmList from 'features/defarms/List'
import Image from 'next/image'
import { Feature } from 'enums'
import NetworkGuard from 'guards/Network'

const Defarms = () => {
  return (
    <Wrap padding='1rem 0 0 0' justifyContent="center">
      <DoubleGlowShadowV2 opacity="0.6">
        <Container id="farm-page">
          <Head>
            <title>DeFarms | Soul</title>
            <meta key="description" name="description" content="Farm" />
            <Image src="https://giphy.com/embed/kPCDnjRGh7POYS4Z5P" width={480} height={480} alt={'egg gif with tokens'} />
          </Head>
            <FarmList />
            <div className="grid grid-cols-2 mt-2">
              {/* <iframe src="https://giphy.com/embed/kPCDnjRGh7POYS4Z5P" width="100%" height="240" allowFullScreen></iframe>
            <iframe src="https://giphy.com/embed/nPquUiVkV4K9j26fB3" width="100%" height="240" allowFullScreen></iframe> */}
            </div>
        </Container>
      </DoubleGlowShadowV2>
    </Wrap>
  )
}

export default Defarms

Defarms.Guard = NetworkGuard(Feature.DEFARM)
