import '../bootstrap'
import '../styles/index.css'

import { Web3ReactProvider } from '@web3-react/core'
import Dots from 'components/Dots'
import Portals from 'components/Portals'
import { SyncWithRedux } from 'components/SyncWithRedux'
import Web3ReactManager from 'components/Web3ReactManager'
import getLibrary from 'functions/getLibrary'
import { exception, GOOGLE_ANALYTICS_TRACKING_ID, pageview } from 'functions/gtag'
import DefaultLayout from 'layouts/Default'
// import { FantomApiProvider } from "contexts/FantomApiProvider"
import { Analytics } from '@vercel/analytics/react'
import store, { persistor } from 'state'
import ApplicationUpdater from 'state/application/updater'
import ListsUpdater from 'state/lists/updater'
import MulticallUpdater from 'state/multicall/updater'
import TransactionUpdater from 'state/transactions/updater'
import UserUpdater from 'state/user/updater'
// import * as plurals from 'make-plural/plurals'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Script from 'next/script'
import React, { Fragment, useEffect } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { RecoilRoot } from 'recoil'
import { PersistGate } from 'redux-persist/integration/react'
import { GelatoProvider } from 'soulswap-limit-orders-react'
import { useActiveWeb3React } from 'services/web3'
import { ApiDataProvider } from 'contexts/ApiDataProvider'
import ModalProvider from 'contexts/ModalProvider'
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client'
// import { RPC } from 'connectors'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChainId } from 'sdk'

const link = createHttpLink({
  // uri: RPC[250],
  uri: 'https://xapi-nodee.fantom.network/',
  // headers: { authorization: token },  // The token in the auth header will be removed when the cookie approach is working)
});

const client = new ApolloClient({
  cache: new InMemoryCache({ addTypename: true }),
  // uri: "/api",
  link,
  connectToDevTools: process.env.NODE_ENV === "development",
});


const Web3ProviderNetwork = dynamic(() => import('components/Web3ProviderNetwork'), { ssr: false })

if (typeof window !== 'undefined' && !!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = true
}

function MyApp({ Component, pageProps, fallback, err }) {
  const router = useRouter()
  const { locale, events } = router

  useEffect(() => {
    const handleRouteChange = (url) => {
      pageview(url)
    }
    events.on('routeChangeComplete', handleRouteChange)

    const handleError = (error) => {
      exception({
        description: `${error.message} @ ${error.filename}:${error.lineno}:${error.colno}`,
        fatal: true,
      })
    }

    window.addEventListener('error', handleError)

    return () => {
      events.off('routeChangeComplete', handleRouteChange)
      window.removeEventListener('error', handleError)
    }
  }, [events])

  const [queryClient] = React.useState(() => new QueryClient());

  // Allows for conditionally setting a provider to be hoisted per page
  const Provider = Component.Provider || Fragment

  // Allows for conditionally setting a layout to be hoisted per page
  const Layout = Component.Layout || DefaultLayout

  // Allows for conditionally setting a guard to be hoisted per page
  const Guard = Component.Guard || Fragment

  function Gelato({ children }: { children?: React.ReactNode }) {
    const { library, chainId, account } = useActiveWeb3React()
    return (
      <GelatoProvider library={library} chainId={chainId ?? ChainId.FANTOM} account={account ?? undefined}>
        {children}
      </GelatoProvider>
    )
  }

  return (
    <>
      <Head>
        <title>SoulSwap</title>
        <meta name="description" content="SoulSwap is an AMM exchange, part of Soul Protocol, which offers a full suite of DeFi tools." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://soulswap.finance/images/soulswap-cover.png" />
        <meta name="twitter:site" content="@SoulSwapFinance" />
        <meta id="og:image" property="og:image" content="https://soulswap.finance/images/soulswap-cover.png" />
        <meta id="og:image:type" property="og:image:type" content="image/png" />
        <meta id="og:image:type" property="og:image:type" content="630" />
        <meta id="og:image:width" property="og:image:width" content="1200" />
        {/* <meta id="og:description" property="og:description" content="SoulSwap is an AMM exchange, part of Soul Protocol, which offers a full suite of DeFi tools." /> */}
      </Head>

      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ANALYTICS_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <Web3ReactManager>
            <QueryClientProvider client={queryClient}>
              <Hydrate state={pageProps.dehydratedState}>
                <ApiDataProvider>
                  <ApolloProvider client={client}>
                    {/* <FantomApiProvider> */}
                      <ReduxProvider store={store}>
                        <PersistGate loading={<Dots>loading</Dots>} persistor={persistor}>
                          <>
                            <ListsUpdater />
                            <UserUpdater />
                            <ApplicationUpdater />
                            <MulticallUpdater />
                          </>
                          <RecoilRoot>
                            <SyncWithRedux />
                            <Provider>
                              <ModalProvider>
                                <Layout>
                                  <Guard>
                                    <Gelato>
                                      <Component {...pageProps} err={err} />
                                    </Gelato>
                                  </Guard>
                                  <Portals />
                                  <Analytics />
                                </Layout>
                              </ModalProvider>
                            </Provider>
                            <TransactionUpdater />
                          </RecoilRoot>
                        </PersistGate>
                      </ReduxProvider>
                    {/* </FantomApiProvider> */}
                  </ApolloProvider>
                </ApiDataProvider>
              </Hydrate>
            </QueryClientProvider>
          </Web3ReactManager>
        </Web3ProviderNetwork>
      </Web3ReactProvider>
    </>
  )
}

export default MyApp