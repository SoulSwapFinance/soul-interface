import { useActiveWeb3React } from '../../hooks'
import { ethers } from 'ethers'

import { ChainId } from '@soulswap/sdk'
import Container from '../../components/Container'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import useApproveContract from './useApprove'
import useBridge from './useBridge'
import { Heading, Text, Wrap, Button, Input } from './reusableStyles'
import { Ethereum$FTM, AnyswapEthOperaBridgeAddress } from './constants'

export default function Farm(): JSX.Element {
  const { chainId, account } = useActiveWeb3React()

  const router = useRouter()

  const { erc20Approve, erc20Allowance } = useApproveContract()
  const { swapOut } = useBridge()

  const [balance, setBalance] = useState(undefined)
  const [amount, setAmount] = useState('')
  const [approved, setApproved] = useState(false)

  const handleSwapOutApprove = async (amount) => {
    const parsedAmount = ethers.utils.parseUnits(amount).toString()
    if ((await erc20Allowance(Ethereum$FTM, account, AnyswapEthOperaBridgeAddress)) < parsedAmount) {
      await erc20Approve(Ethereum$FTM, AnyswapEthOperaBridgeAddress, parsedAmount)
    }
    setApproved(true)
  }

  const handleSwapOut = async (amount) => {
    const parsedAmount = ethers.utils.parseUnits(amount).toString()
    console.log('parsed', parsedAmount)

    await swapOut(parsedAmount, account)
    ;(document.getElementById('amount') as HTMLInputElement).value = ''
  }

  const handleMax = async () => {

  }

  const calculateFee = async () => {
      
  }

  return (
    <>
      <Container id="bridge-page">
        <Head>
          <title>Bridge | Soul</title>
          <meta key="description" name="description" content="bridge tokens" />
        </Head>
        <Wrap padding="2rem 6rem 0 6rem" alignItems='center' justifyContent="center">
          <Wrap padding="2rem 0" >
            <Heading fontSize="1.5rem" textAlign="center">
              Bridge $FTM from Ethereum to Fantom
            </Heading>
            <Text padding="0" color="#aaa" textAlign="center">
              Powered By AnySwap Network
            </Text>
          </Wrap>

          <Wrap padding="0" display="flex">
            <Input
              id="amount"
              width="100%"
              placeholder="0"
              type="text"
              height="2.5rem"
              onChange={() => setAmount((document.getElementById('amount') as HTMLInputElement).value)}
            ></Input>
          </Wrap>
          <Wrap padding="0.5rem 0" display="flex">
            <Button width="100%" onClick={() => (approved ? handleSwapOut(amount) : handleSwapOutApprove(amount))}>
              {approved ? 'Submit' : 'Approve'}
            </Button>
          </Wrap>
          <Text padding=".5rem 0" color="#aaa" textAlign="center">
            There is a fee of 0.1%, with a minimum fee of 80 FTM and a maximum fee of 800 FTM. The fee is charged by
            AnySwap, SoulSwap charges no additional fees.
          </Text>

          <Wrap padding="2rem 3rem" justifyContent="center">
            <Wrap display="flex" justifyContent="space-between">
              <Text padding="0" color="#aaa">
                Max Bridge Amount
              </Text>
              <Text padding="0" color="#aaa">
                10,000,000 FTM
              </Text>
            </Wrap>

            <Wrap display="flex" justifyContent="space-between">
              <Text padding="0" color="#aaa">
                Min Bridge Amount
              </Text>
              <Text padding="0" color="#aaa">
                200 FTM
              </Text>
            </Wrap>

            <Wrap display="flex" justifyContent="space-between">
              <Text padding="0" color="#aaa">
                Fee
              </Text>
              <Text padding="0" color="#aaa">
                80 FTM
              </Text>
            </Wrap>
          </Wrap>
        </Wrap>
      </Container>
    </>
  )
}
