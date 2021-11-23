import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Link from 'next/link'
import { MaxUint256 } from '@ethersproject/constants'
import { ZERO_ADDRESS, ATOMIC_SWAP_ADDRESS, CONTRACT_SCAN } from '../../constants/addresses'

import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'

import useAtomicSwap from './hooks/useAtomicSwap'
import useApproveContract from './hooks/useApprove'

import { Button, ExternalLink, InputRow, Heading, Wrap } from './ReusableStyles'
import { InputItem } from './CreateTrade/InputItem'
import { ItemContainer, ItemCard, UserContainer, UserBlurb, FooterContainer, HiddenBtn } from './TradeItemStyles'

export const TradeItem = ({ tradeId, user1Details, user2Details, creator, to, expiry, totalOffers, trade }) => {
  const { account, chainId } = useActiveWeb3React()
  const { acceptTrade, cancelTrade } = useAtomicSwap()
  const {
    erc20Approve,
    erc20Allowance,
    erc721SetApprovalForAll,
    erc721IsApprovedForAll,
    erc1155SetApprovalForAll,
    erc1155IsApprovedForAll,
  } = useApproveContract()

  const [approved, setApproved] = useState(false)
  const [users, setUsers] = useState(['cutUser1', 'user1', 'cutUser2', 'user2'])

  const cutAddress = (address) => {
    const stringAddress = address.toString()

    const firstSection = stringAddress.slice(0, 5).concat('...')
    const secondSection = stringAddress.slice(38, 42)

    const cutAddress = firstSection.concat(secondSection)
    return cutAddress
  }

  useEffect(() => {
    // console.log("user1Details", trade?.user1Details);
    const cutUser1 = cutAddress(creator)
    const cutUser2 = cutAddress(to)
    setUsers([cutUser1, creator, cutUser2, to])
  }, [])

  const handleTx = async () => {
    if (!user2Details[0]) {
      await acceptTrade(tradeId)
    } else if (!approved) {
      for (let i = 0; i < user2Details.length; i++) {
        // console.log("user2Details[i].ercType", user2Details[i].ercType);

        // ERC-20 + ERC-777
        if (user2Details[i].ercType === 20 || user2Details[i].ercType === 777) {
          const approvedAmount = await erc20Allowance(user2Details[i].token, account, ATOMIC_SWAP_ADDRESS[chainId])

          if (approvedAmount < user2Details[i].amounts[0]) {
            const tx = await erc20Approve(user2Details[i].token, ATOMIC_SWAP_ADDRESS[chainId], MaxUint256)
            await tx.wait()
          }
        }
        // ERC-721
        else if (user2Details[i].ercType === 721) {
          const approved = await erc721IsApprovedForAll(user2Details[i].token, ATOMIC_SWAP_ADDRESS[chainId], true)

          if (!approved) {
            const tx = await erc721SetApprovalForAll(user2Details[i].token, ATOMIC_SWAP_ADDRESS[chainId], true)
            await tx.wait()
          }
        }
        // ERC-1155
        else if (user2Details[i].ercType === 1155) {
          const approved = await erc1155IsApprovedForAll(user2Details[i].token, ATOMIC_SWAP_ADDRESS[chainId], true)

          if (!approved) {
            const tx = await erc1155SetApprovalForAll(user2Details[i].token, ATOMIC_SWAP_ADDRESS[chainId], true)
            await tx.wait()
          }
        }
      }
      setApproved(true)
    } else {
      await acceptTrade(tradeId)
    }
  }

  const handleCancelTrade = async () => {
    try {
      await cancelTrade(tradeId)
    } catch (e) {
      console.warn(e)
    }
  }

  const receiveTokenList = user1Details.map((token) => {
    if (token !== undefined) {
      return (
        <Wrap display="flex" padding=".5rem 0" key={token.tradeId}>
          <InputItem
            key={'lose'.concat(Date.now().toString())}
            contractAddress={token.token}
            erc={token.erc}
            id={token.ids[0]}
            amount={token.amounts[0]}
          />
        </Wrap>
      )
    }
  })

  const loseTokenList = user2Details.map((token) => {
    if (token !== undefined) {
      return (
        <Wrap display="flex" padding=".5rem 0" key={token.tradeId}>
          <InputItem
            key={'receive'.concat(Date.now().toString())}
            contractAddress={token.token}
            erc={token.erc}
            id={token.ids[0]}
            amount={token.amounts[0]}
          />
        </Wrap>
      )
    }
  })

  return (
    <ItemContainer>
      <ItemCard>
        {/* <Link href={`/trade/${tradeId}`}> */}
          <ExternalLink padding="0" opacity="50%">
            <UserContainer>
              <Wrap padding="0 .8rem 0 0" display="flex" justifyContent="space-between">
                <Heading>Receive</Heading>
                <Heading>ID {tradeId}</Heading>
              </Wrap>

              <UserBlurb>
                The tokens you will receive from{' '}
                <ExternalLink fontSize=".55rem" href={`${CONTRACT_SCAN[chainId]}${users[1]}`} target="_blank">
                  {users[0]}
                </ExternalLink>
                .
              </UserBlurb>
            </UserContainer>

            {user1Details[0].token !== ZERO_ADDRESS ? (
              <InputRow padding="auto" justifyContent="center" alignItems="center">
                {receiveTokenList}
              </InputRow>
            ) : (
              <InputRow overflowY="none" display="flex" justifyContent="center" alignItems="center">
                <Heading>NA</Heading>
              </InputRow>
            )}

            <UserContainer>
              <Heading>Lose</Heading>
              <UserBlurb>The tokens you will lose in the trade.</UserBlurb>
            </UserContainer>

            {user2Details[0].token !== ZERO_ADDRESS ? (
              <InputRow padding="auto" justifyContent="center" alignItems="center">
                {loseTokenList}
              </InputRow>
            ) : (
              <InputRow overflowY="none" display="flex" justifyContent="center" alignItems="center">
                <Heading>NA</Heading>
              </InputRow>
            )}
          </ExternalLink>
        {/* </Link> */}

        <FooterContainer>
          {/* TODO: ADD CARD ONCLICK THAT VIEWS TRADE ON NEW PAGE */}
          <HiddenBtn onClick={() => handleTx()}>{approved ? 'ACCEPT' : 'APPROVE'}</HiddenBtn>
          {account === creator && (
            <HiddenBtn border="2px solid #aaa" bgColor="#aaa" color="black" onClick={() => handleCancelTrade()}>
              CANCEL
            </HiddenBtn>
          )}
        </FooterContainer>
      </ItemCard>
    </ItemContainer>
  )
}
