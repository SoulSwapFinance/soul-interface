import React from 'react'
import Container from 'components/Container'
import Head from 'next/head'
import Typography from 'components/Typography'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import QuestionHelper from 'components/QuestionHelper'
import BondItem from 'features/luxor/BondItem'
// import useLuxorBonds from 'hooks/useBonds'
import { formatNumber } from 'functions'
import { useLuxorPrice } from 'hooks/getPrices'
import { useLuxTVL } from 'hooks/useV2Pairs'
// import { useActiveWeb3React } from 'services/web3'

export default function Bonds() {
  // const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  // const { data } = useLuxorBonds()
  const luxorPrice = useLuxorPrice()
  const luxInfo = useLuxTVL()

  let luxTvl = luxInfo?.reduce((previousValue, currentValue) => {
    return previousValue + currentValue?.tvl
  }, 0)

  return (
    <Container id="bonds-page" className="grid h-full grid-cols-3 py-4 mx-auto md:py-8 lg:py-13 gap-6" maxWidth="5xl">
      <Head>
        <title>Bonds | Soul</title>
        <meta key="description" name="description" />
      </Head>
      <div className={'space-y-6 col-span-4 lg:col-span-3'}>
        <div className="flex justify-center gap-x-6 gap-y-1 px-4">
          <div className="flex flex-col mr-4">
            <Typography
              className="flex gap-1 items-center"
            //   fontFamily={'medium'}
            //   textColor={'text-black-40 dark:text-black-50'}
            >
              {i18n._(t`Treasury Balance`)}
              <QuestionHelper
                // width={'small'}
                text={<div className="flex flex-col space-y-2">The amount of Protocol Owned Liquidity (POL).</div>}
              />
            </Typography>
            <Typography variant={'h3'}
            // lineHeight={32} 
            // fontFamily={'medium'} textColor={'text-accent'}
            >
              <Typography variant="sm" className="flex items-center py-0.5">
                {`Protocol Liquidity`}
              </Typography>
                { luxTvl ? luxTvl : 0 }
            </Typography>
          </div>
          <div className="flex flex-col">
            <Typography
              className="flex gap-1 items-center text-black-40 dark:text-black-50"
              fontFamily={'medium'}
            // className={'text-black-40 dark:text-black-50'}
            >
              {i18n._(t`LUX Market Price`)}
              <QuestionHelper
                // width={'small'}
                text={
                  <div className="flex flex-col space-y-2">
                    The current exchange price at which LUX can be bought or sold.
                  </div>
                }
              />
            </Typography>
            <Typography variant={'h3'}
              lineHeight={32} fontFamily={'medium'}
              className={'text-accent'}
            >
              {formatNumber(luxorPrice, true)}
            </Typography>
          </div>
        </div>
        {
          // data
          // ?.filter((bond) => !bond.d || process.env.NODE_ENV === 'development')
          // .map((bond, index) => (
          <BondItem bond={'0xCf994423b39A6991e82443a8011Bf6749e19434b'} />
          // key={index} 
          // bond={bond} 
          // />
          // ))
        }
      </div>
    </Container>
  )
}

// const Luxor = () => {
// 	return (
//       <iframe 
// 			frameBorder={"none"}
//     		title={"LUXOR"}
//     		src="https://app.luxor.money"
//     		height={"100%" }
//     		width={"100%"}
//     />
// 	);
// };

// export default Luxor;
