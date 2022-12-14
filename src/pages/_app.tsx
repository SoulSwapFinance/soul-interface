import '../bootstrap'
import '../styles/index.css'

import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { remoteLoader } from '@lingui/remote-loader'
import { Web3ReactProvider } from '@web3-react/core'
import Dots from 'components/Dots'
import Portals from 'components/Portals'
import { SyncWithRedux } from 'components/SyncWithRedux'
import Web3ReactManager from 'components/Web3ReactManager'
// import { MultichainExploitAlertModal } from 'features/user/MultichainExploitAlertModal'
import getLibrary from 'functions/getLibrary'
import { exception, GOOGLE_ANALYTICS_TRACKING_ID, pageview } from 'functions/gtag'
import DefaultLayout from 'layouts/Default'
import { FantomApiProvider } from "contexts/FantomApiProvider";
// import { initializeAnalytics, OriginApplication, sendAnalyticsEvent, Trace, user } from '@uniswap/analytics'

import store, { persistor } from 'state'
import ApplicationUpdater from 'state/application/updater'
import ListsUpdater from 'state/lists/updater'
import MulticallUpdater from 'state/multicall/updater'
import TransactionUpdater from 'state/transactions/updater'
import UserUpdater from 'state/user/updater'
import * as plurals from 'make-plural/plurals'
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
import { RPC } from 'connectors'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { CustomUserProperties, EventName, getBrowser, PageName } from '@uniswap/analytics-events'
import { initializeAnalytics, OriginApplication } from '@uniswap/analytics'

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

// Placeholder API key. Actual API key used in the proxy server
const ANALYTICS_DUMMY_KEY = '00000000000000000000000000000000'
const ANALYTICS_PROXY_URL = process.env.REACT_APP_AMPLITUDE_PROXY_URL
const COMMIT_HASH = process.env.REACT_APP_GIT_COMMIT_HASH
initializeAnalytics(ANALYTICS_DUMMY_KEY, OriginApplication.INTERFACE, {
  proxyUrl: ANALYTICS_PROXY_URL,
  defaultEventName: '', // EventName.PAGE_VIEWED,
  commitHash: COMMIT_HASH,
  isProductionEnv: true // isProductionEnv(),
})

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
  
  useEffect(() => {
    async function load(locale) {
      i18n.loadLocaleData(locale, { plurals: plurals[locale?.split('_')[0]] })

      try {
        // Load messages from AWS, use q session param to get latest version from cache
        const res = await fetch(
          `https://raw.githubusercontent.com/sushiswap/translations/master/sushiswap/${locale}.json`
        )
        const remoteMessages = await res.json()

        const messages = remoteLoader({ messages: remoteMessages, format: 'minimal' })
        i18n.load(locale, messages)
      } catch {
        // Load fallback messages
        // const { messages } = await import(`@lingui/loader!./../../locale/${locale}.json?raw-lingui`)
        // i18n.load(locale, messages)
      }

      i18n.activate(locale)
    }

    load(locale)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  // Allows for conditionally setting a provider to be hoisted per page
  const Provider = Component.Provider || Fragment

  // Allows for conditionally setting a layout to be hoisted per page
  const Layout = Component.Layout || DefaultLayout

  // Allows for conditionally setting a guard to be hoisted per page
  const Guard = Component.Guard || Fragment

  function Gelato({ children }: { children?: React.ReactNode }) {
    const { library, chainId, account } = useActiveWeb3React()
    return (
      <GelatoProvider library={library} chainId={chainId} account={account ?? undefined}>
        {children}
      </GelatoProvider>
    )
  }
  return (
    <>
      <Head>Soul</Head>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
      />

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
      {/*@ts-ignore TYPE NEEDS FIXING*/}
      <I18nProvider i18n={i18n} forceRenderOnLocaleChange={false}>
        <Web3ReactProvider getLibrary={getLibrary}>
      <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ApiDataProvider>
          <ApolloProvider client={client}>
          {/*@ts-ignore TYPE NEEDS FIXING*/}
          <FantomApiProvider>
          <Web3ProviderNetwork getLibrary={getLibrary}>
            <Web3ReactManager>
              <ReduxProvider store={store}>
                <PersistGate loading={<Dots>loading</Dots>} persistor={persistor}>
                  <>
                    <ListsUpdater />
                    <UserUpdater />
                    <ApplicationUpdater />
                    <MulticallUpdater />
                  </>
                  {/*@ts-ignore TYPE NEEDS FIXING*/}
                  <RecoilRoot>
                    <SyncWithRedux />
                    <Provider>
                    <ModalProvider>
                      <Layout>
                        <Guard>
                          {/* TODO: Added alert Jan 25. Delete component after a few months. */}
                          {/* <MultichainExploitAlertModal /> */}
                          {/*@ts-ignore TYPE NEEDS FIXING*/}
                          <Gelato>
                            <Component {...pageProps} err={err} />
                          </Gelato>
                        </Guard>
                        <Portals />
                      </Layout>
                      </ModalProvider>
                    </Provider>
                    <TransactionUpdater />
                  </RecoilRoot>
                </PersistGate>
              </ReduxProvider>
            </Web3ReactManager>
          </Web3ProviderNetwork>
          </FantomApiProvider>
          </ApolloProvider>
          </ApiDataProvider>
          </Hydrate>
          </QueryClientProvider>
        </Web3ReactProvider>
      </I18nProvider>
    </>
  )
}

export default MyApp