/* eslint-disable @next/next/link-passhref */

import Head from 'next/head'
import React, { useCallback, useState } from 'react'
import { t } from '@lingui/macro'
import { formatNumberScale } from '../../functions'
import { ButtonError } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import { AutoRow } from '../../components/Row'
import DoubleGlowShadowV2 from '../../components/DoubleGlowShadowV2'
import SoulLogo from '../../components/SoulLogo'
import Container from '../../components/Container'
import Typography from '../../components/Typography'
import { i18n } from '@lingui/core'
import Image from '../../components/Image'
import { useActiveWeb3React } from 'services/web3'
import Web3Connect from '../../components/Web3Connect'
import { Loader } from 'react-feather'
import { useETHBalances } from '../../state/wallet/hooks'
import axios from 'axios'
import ReCAPTCHA from 'react-google-recaptcha'
import { FAUCET_ADDRESS } from '../../constants'

export default function Faucet(): JSX.Element {
  const { chainId, account, library } = useActiveWeb3React()
  const [token, setToken] = useState('')
  const tokenBalance = useETHBalances([FAUCET_ADDRESS[chainId | 250]])
  const [pendingTx, setPendingTx] = useState(false)
  const [requested, setRequested] = useState(false)
  const [faucetResult, setFaucetResult] = useState({ status: 200, message: null })
  const recaptchaRef: any = React.createRef()

  const onReCAPTCHAChange = async (captchaCode) => {
    if (!captchaCode) {
      return
    }

    setPendingTx(true)

    try {
      const faucetResponse = await axios.post('/api/faucet', { address: account, 'g-recaptcha-response': captchaCode })
      if (faucetResponse.data) {
        setFaucetResult(faucetResponse.data)
        if (faucetResponse.data.status == 200) {
          setRequested(true)
        } else if (faucetResponse.data.message.indexOf('daily limit') >= 0) {
          setRequested(true)
        }
      }
    } catch (err) {
      setFaucetResult({ status: 400, message: 'Failed to send the request to the server.' })
    } finally {
      setPendingTx(false)
    }
  }

  const handleRequest = useCallback(async () => {
    recaptchaRef.current.execute()
  }, [recaptchaRef])

  return (
    <>
      <Head>
        <title>Faucet | Soul</title>
        <meta key="description" name="description" content="Fantom Faucet" />
      </Head>

      <SoulLogo />

      <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        sitekey={'6LeaGV4cAAAAAE2HKmub-Ilnb7raS1JfhdfhfrP1'}
        onChange={onReCAPTCHAChange}
      />

      <Container maxWidth="2xl" className="space-y-6">
        <DoubleGlowShadowV2 opacity="0.6">
          <div className="p-4 space-y-4 rounded bg-dark-900" style={{ zIndex: 1 }}>
            <div className="p-4 mb-3 space-y-3 text-center">
              <Typography component="h1" variant="h2">
                {i18n._(t`Fantom Faucet`)}
              </Typography>
              <Typography component="h1" variant="base">
                A Faucet is a tool that provides a small amount of FTM for users that used the bridge to start using Soul Protocol without having to
                buy FTM somewhere else.
              </Typography>
            </div>
            <div className="flex flex-1 justify-center text-center items-center mt-8 mb-12">
              <Image src="/images/faucet/fantom-faucet.png" alt="Soul" width={150} height={150} />
            </div>
            <div className="p-4 mb-3 space-y-1 text-center">
              <Typography component="h1" variant="base">
                Faucet Balance:{' '}
                {formatNumberScale(tokenBalance[FAUCET_ADDRESS[chainId | 250]]?.toSignificant(4, undefined, 2) ?? 0, false)} FTM
              </Typography>
              <Typography component="h1" variant="base">
                Faucet Address: {FAUCET_ADDRESS}
              </Typography>
            </div>

            <AutoColumn gap={'md'}>
              <div className={'flex items-center w-full'}>
                {!account ? (
                  <Web3Connect size="lg" color="gradient" className="w-full" />
                ) : (
                  <ButtonError
                    className="font-bold text-light"
                    onClick={handleRequest}
                    style={{
                      width: '100%',
                    }}
                    disabled={pendingTx || requested}
                  >
                    {pendingTx ? (
                      <div>
                        <AutoRow gap="6px" justify="center" align="center">
                          Requesting <Loader stroke="white" />
                        </AutoRow>
                      </div>
                    ) : (
                      i18n._(t`Give me some FTM`)
                    )}
                  </ButtonError>
                )}
              </div>
            </AutoColumn>
            <div className="p-4 mb-3 space-y-3 text-center">
              {faucetResult?.message && (
                <Typography
                  component="h1"
                  variant="base"
                  className={`${faucetResult?.status == 200 ? 'text-green' : 'text-red'}`}
                >
                  {faucetResult?.message}
                </Typography>
              )}
            </div>
          </div>
        </DoubleGlowShadowV2>
      </Container>
    </>
  )
}
