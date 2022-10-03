import { useActiveWeb3React } from 'services/web3'
import { ethers } from 'ethers'
import { useState, useEffect } from 'react'

import useApproveContract from './useApprove'
import useBridge from './useBridge'
import { Heading, Text, ClickableText, Wrap, Button, Input } from '../../components/ReusableStyles'

export default function BridgeContainer() {
  const { chainId, account } = useActiveWeb3React()

  const AnyswapEthOperaBridgeAddress = '0x5cbe98480a790554403694b98bff71a525907f5d'
  const Ethereum$FTM = '0x4E15361FD6b4BB609Fa63C81A2be19d873717870'

  const [balance, setBalance] = useState(0)
  const [amount, setAmount] = useState('')
  const [approved, setApproved] = useState(false)
  const [tx, setTx] = useState(false)
  const [tokenSelected, setTokenSelected] = useState(Ethereum$FTM)

  const { swapOut } = useBridge()
  const { erc20BalanceOf, erc20Approve, erc20Allowance } = useApproveContract(tokenSelected)

  useEffect(() => {
    if (account && chainId === 1) {
      fetchBal()
    }
  }, [account, chainId])

  /**
   *  Approve tokens for transfer
   */
  const handleSwapOutApprove = async () => {
    if (amount === undefined || amount === null || amount === '') {
      alert('Must enter a number')
      console.warn('Must enter a number')
      return
    }

    const allowance = await erc20Allowance(account, AnyswapEthOperaBridgeAddress)

    if (allowance < amount) {
      const result = await erc20Approve(AnyswapEthOperaBridgeAddress)
      // if Tx is not denied
      if (result.code !== 4001) {
        setTx(true)
        await result.wait()
        setTx(false)
        setApproved(true)
      }
    } else {
      setApproved(true)
    }
  }

  /**
   *  Bridge tokens to target blockchain
   */
  const handleSwapOut = async () => {
    if (amount === undefined || amount === null || amount === '') {
      alert('Must enter a number')
      console.warn('Must enter a number')
      return
    }

    const swapping = amount.toString()

    if (ethers.utils.formatUnits(swapping) < 200) {
      alert('must be 200+ FTM')
      console.warn('must be 200+ FTM')
      return
    }

    if (ethers.utils.formatUnits(swapping) > 10000000) {
      alert('must be less or equal to 10 mil FTM')
      console.warn('must be less or equal to 10 mil FTM')
      return
    }

    const result = await swapOut(swapping, account)

    if (result.code !== 4001) {
      setTx(true)
      await result.wait()
      setTx(false)
      setApproved(false)
    } else {
      return
    }
  }

  /**
   *  Fetch how many tokens the user owns
   */
  const fetchBal = async () => {
    const bal = await erc20BalanceOf(account)
    console.log(bal.toString())
    setBalance(bal.toString())
  }

  /**
   *  Set the input to the total tokens user owns
   */
  const handleMax = async () => {
    await fetchBal()
    setAmount(balance)
    if (balance === null || balance === undefined || balance === '') {
      document.getElementById('amount').value = 0
    } else {
      document.getElementById('amount').value = Number(ethers.utils.formatUnits(balance)).toFixed(4)
    }
  }

  /**
   *  Update state to the input
   */
  const handleChange = async () => {
    const value = document.getElementById('amount').value
    if (value === null || value === undefined || value === '') setAmount('')
    else setAmount(ethers.utils.parseUnits(value))
    setApproved(false)
  }

  //   const calculateFee = async () => {}

  return (
    <>
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
              Balance: {Number(ethers.utils.formatUnits(balance)).toFixed(4)}
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
            type="number"
            height="2.5rem"
            onChange={() => handleChange()}
          ></Input>
        </Wrap>

        <Wrap padding="0.5rem 0" display="flex">
          {amount !== '' ? (
            ethers.utils.formatUnits(amount) <= 10000000 && ethers.utils.formatUnits(amount) >= 200 ? (
              <Button width="100%" onClick={() => (approved ? handleSwapOut() : handleSwapOutApprove())}>
                {approved ? (tx ? 'Submitting...' : 'Submit') : tx ? 'Approving...' : 'Approve'}
              </Button>
            ) : (
              <Button disabled width="100%" onClick={() => (approved ? handleSwapOut() : handleSwapOutApprove())}>
                {approved ? (tx ? 'Submitting...' : 'Submit') : tx ? 'Approving...' : 'Approve'}
              </Button>
            )
          ) : (
            <Button disabled width="100%" onClick={() => (approved ? handleSwapOut() : handleSwapOutApprove())}>
              {approved ? (tx ? 'Submitting...' : 'Submit') : tx ? 'Approving...' : 'Approve'}
            </Button>
          )}
        </Wrap>

        {amount !== undefined || amount !== null ? (
          <>
            {amount === '' ? (
              <Text color="#f13636" textAlign="center" fontSize=".75rem">
                • Entered amount below minimum bridge amount
              </Text>
            ) : (
              ethers.utils.formatUnits(amount) < 200 && (
                <Text color="#f13636" textAlign="center" fontSize=".75rem">
                  • Entered amount below minimum bridge amount
                </Text>
              )
            )}
            {amount === ''
              ? null
              : ethers.utils.formatUnits(amount) > 10000000 && (
                  <Text color="#f13636" textAlign="center" fontSize=".75rem">
                    • Entered amount above maximum bridge amount
                  </Text>
                )}
          </>
        ) : null}

        <Wrap padding=".75rem 0" justifyContent="center">
        <Wrap display="flex" justifyContent="space-between">
            <Text padding="0" color="#aaa">
              Fee
            </Text>
            <Text padding="0" color="#aaa">
              0
            </Text>
          </Wrap>
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
              Normal Estimated Arrival
            </Text>
            <Text padding="0" color="#aaa">
              10-30 mins
            </Text>
          </Wrap>
          <Wrap display="flex" justifyContent="space-between">
            <Text padding="0" color="#aaa">
              2mil+ FTM Estimated Arrival
            </Text>
            <Text padding="0" color="#aaa">
              Up to 12 hrs
            </Text>
          </Wrap>
        </Wrap>
      </Wrap>
    </>
  )
}
