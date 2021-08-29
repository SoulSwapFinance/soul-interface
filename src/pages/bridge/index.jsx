import { useActiveWeb3React } from '../../hooks'
import { ethers } from 'ethers'

// import { ChainId } from '@soulswap/sdk'
import Container from '../../components/Container'
import Head from 'next/head'
import { useState, useEffect } from 'react'

import useApproveContract from '../../hooks/useApprove'
import useBridge from '../../hooks/useBridge'
import { Heading, Text, ClickableText, Wrap, Button, Input } from '../../components/ReusableStyles'

export default function Bridge() {
  const { chainId, account } = useActiveWeb3React()

  const AnyswapEthOperaBridgeAddress = '0x5cbe98480a790554403694b98bff71a525907f5d'
  const Ethereum$FTM = '0x4E15361FD6b4BB609Fa63C81A2be19d873717870'

  const { erc20BalanceOf, erc20Approve, erc20Allowance } = useApproveContract()
  const { swapOut } = useBridge()

  const [balance, setBalance] = useState(undefined)
  const [amount, setAmount] = useState('')
  const [approved, setApproved] = useState(false)
  const [tokenSelected, setTokenSelected] = useState(Ethereum$FTM)

  useEffect(() => {
    // fetchBal()
  }, [account, chainId])

  const handleSwapOutApprove = async () => {
    const parsedAmount = ethers.utils.parseUnits(amount.toString())
    if ((await erc20Allowance(tokenSelected, account, AnyswapEthOperaBridgeAddress)) < parsedAmount) {
      await erc20Approve(tokenSelected, AnyswapEthOperaBridgeAddress)
    }
    setApproved(true)
  }

  const handleSwapOut = async () => {
    const swapping = ethers.utils.parseUnits(amount).toString()
    await swapOut(swapping)
  }

  const fetchBal = async () => {
    const bal = await erc20BalanceOf(tokenSelected, account)
    setBalance(bal)
  }

  const handleMax = async () => {
    await fetchBal()
    setAmount(balance)
    document.getElementById('amount').value = Number(ethers.utils.formatUnits(balance)).toFixed(4)
  }

  const handleChange = async () => {
    const value = document.getElementById('amount').value
    if (value === null || value === undefined || value === "") setAmount("")
    else setAmount(ethers.utils.parseUnits(value))
  }

  //   const calculateFee = async () => {}

  return (
    <>
      <Container id="bridge-page">
        <Head>
          <title>Bridge | Soul</title>
          <meta key="description" name="description" content="bridge tokens" />
        </Head>

        <Wrap padding="2rem 6rem 0 6rem" justifyContent="center">
          <Wrap padding="2rem 0 .5rem 0">
            <Heading fontSize="1.5rem" textAlign="center">
              Bridge $FTM from Ethereum to Fantom
            </Heading>
            <Text fontSize=".9rem" padding="0" color="#aaa" textAlign="center">
              Powered By AnySwap Network
            </Text>
          </Wrap>

          <Wrap padding="0">
            <Wrap display="flex" justifyContent="space-between" padding="0">
              <Text padding="0" color="#aaa">
                Balance: {balance}
              </Text>
              <ClickableText padding="0" color="#aaa" onClick={() => handleMax()}>
                MAX
              </ClickableText>
            </Wrap>
            <Input
              textAlign="center"
              id="amount"
              width="100%"
              placeholder="0"
              type="text"
              height="2.5rem"
              onChange={() => handleChange()}
            ></Input>
          </Wrap>

          <Wrap padding="0.5rem 0" display="flex">
            <Button width="100%" onClick={() => (approved ? handleSwapOut() : handleSwapOutApprove())}>
              {approved ? 'Submit' : 'Approve'}
            </Button>
          </Wrap>

          <Text padding=".25rem 0" color="#aaa" textAlign="center" fontSize=".75rem">
            There is a fee of 0.1% that covers the gas on the target blockchain, with a minimum fee of 80 FTM and a
            maximum fee of 800 FTM. The fee is charged by AnySwap, SoulSwap charges no additional fees.
          </Text>

          <Wrap padding=".75rem 0" justifyContent="center">
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
                Estimated Arrival
              </Text>
              <Text padding="0" color="#aaa">
                10-30 mins
              </Text>
            </Wrap>
            <Wrap display="flex" justifyContent="space-between">
              <Text padding="0" color="#aaa">
                2+ million FTM
              </Text>
              <Text padding="0" color="#aaa">
                Up to 12 hrs
              </Text>
            </Wrap>
          </Wrap>
        </Wrap>
      </Container>
    </>
  )
}
