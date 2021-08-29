import { useActiveWeb3React } from '../../hooks'
import { ethers } from "ethers";

import { ChainId } from '@soulswap/sdk'
import Container from '../../components/Container'
import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'

import useApproveContract from './useApprove'
import useBridge from './useBridge'
import { Heading, Text, Wrap, Button, Input } from "./reusableStyles";
import { Ethereum$FTM, AnyswapEthOperaBridgeAddress } from './constants';

export default function Farm(): JSX.Element {
  const { chainId, account } = useActiveWeb3React()
    
  const router = useRouter()

  const { erc20Approve, erc20Allowance } = useApproveContract();
  const { swapOut } = useBridge();

  const [amount, setAmount] = useState("");
  const [approved, setApproved] = useState(false)

  const handleSwapOutApprove = async (amount) => {
    const parsedAmount = ethers.utils.parseUnits(amount).toString();
    if (
      (await erc20Allowance(
        Ethereum$FTM,
        account,
        AnyswapEthOperaBridgeAddress
      )) < parsedAmount
    ) {
      await erc20Approve(
        Ethereum$FTM,
        AnyswapEthOperaBridgeAddress,
        parsedAmount
      );
    }
    setApproved(true);
  };

  const handleSwapOut = async (amount) => {
    const parsedAmount = ethers.utils.parseUnits(amount).toString();
    console.log("parsed", parsedAmount);

    await swapOut(parsedAmount, account);
    (document.getElementById("amount") as HTMLInputElement).value = "";
  };

  return (
    <Container id="bridge-page" className="grid h-full grid-cols-4 py-4 mx-auto md:py-8 lg:py-12 gap-9" maxWidth="7xl">
      <Head>
        <title>Bridge | Soul</title>
        <meta key="description" name="description" content="bridge tokens" />
      </Head>
      <Wrap justifyContent="center">
      <Heading>Bridge from Ethereum to Fantom</Heading>
      <Text padding='0' color='#aaa'>0.1% fee (i.e., 200 ftm - 80 ftm fee) </Text>
      <Wrap padding="0" display="flex">
        <Input
          id="amount"
          width="22rem"
          placeholder="0"
          type="text"
          height="2.5rem"
          onChange={() => setAmount((document.getElementById("amount") as HTMLInputElement).value)}
        ></Input>
        <Button
          onClick={() =>
            approved ? handleSwapOut(amount) : handleSwapOutApprove(amount)
          }
        >
          {approved ? "Submit" : "Approve"}
        </Button>
      </Wrap>
    </Wrap>
      
    </Container>
  )
}
