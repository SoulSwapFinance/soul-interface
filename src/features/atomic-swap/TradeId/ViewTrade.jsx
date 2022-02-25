import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { MaxUint256 } from "@ethersproject/constants";
import { zeroAddress, AtomicSwapAddress } from "../../../constants";

import { Connection } from "../../../components/Web3Connection/Connection";
import ConenctToView from "../../../components/Web3Connection/ConenctToView";
import { cutAddress } from "../../../components/Web3Connection/useConnect";

import useAtomicSwap from "../../../hooks/useAtomicSwap";
import useApproveContract from "../../../hooks/useApprove";

import { ViewItem } from "./ViewItem";

import {
  CenterScreen,
  Heading,
  Text,
  ClickableText,
  Wrap,
  Button,
  Input,
} from "../../../components/ReusableStyles";

import styled, { keyframes } from "styled-components";

const TokenContainer = styled.div`
  padding: 1rem 2rem;
  background-color: #111;
  border: 1px solid white;
  border-radius: 0.5rem;
`;

const ViewTrade = () => {
  const { address } = Connection.useContainer();
  const { asPath, pathname } = useRouter();

  // contract interaction

  const { viewTrade, viewTotalTrades, acceptTrade, cancelTrade } =
    useAtomicSwap();
  const {
    erc20Approve,
    erc20Allowance,
    erc721SetApprovalForAll,
    erc721IsApprovedForAll,
    erc1155SetApprovalForAll,
    erc1155IsApprovedForAll,
  } = useApproveContract();

  // State

  const [tradeId, setTradeId] = useState(undefined);
  const [exists, setExists] = useState(false);
  const [approved, setApproved] = useState(false);
  const [cutTo, setCutTo] = useState("");

  const [trade, setTrade] = useState({
    user1Details: undefined,
    user2Details: undefined,
    user1: undefined,
    user2: undefined,
    inactive: undefined,
    expiry: undefined,
    totalOffers: undefined,
  });

  const [user1TokenList, setUser1TokenList] = useState(undefined);
  const [user2TokenList, setUser2TokenList] = useState(undefined);

  // Core functions

  useEffect(() => {
    getTrade();
  }, []);

  const getSlug = async () => {
    const id = asPath.slice(7);
    setTradeId(id);
  };

  const getTrade = async () => {
    getSlug();

    const totalTrades = Number(await viewTotalTrades());

    if (tradeId > totalTrades) return;
    else setExists(true);

    const mTrade = await viewTrade(tradeId);

    console.log("tradeId", tradeId);
    console.log("totalTrades", totalTrades);
    console.log("mTrade", mTrade);

    setCutTo(await cutAddress(`${trade.user2}`));

    setTrade({
      user1Details: mTrade[0],
      user2Details: mTrade[1],
      user1: mTrade[2],
      user2: mTrade[3],
      inactive: mTrade[4],
      expiry: mTrade[5],
      totalOffers: mTrade[6],
    });

    console.log("trade", trade);

    if (trade.user1Details !== undefined) {
      setUser1TokenList(
        trade.user1Details.map((token, index) => {
          if (token !== undefined) {
            return (
              <ViewItem
                key={`user1-${index}`}
                contractAddress={token.token}
                erc={token.erc}
                id={token.ids[0]}
                amount={token.amounts[0]}
              />
            );
          }
        })
      );
    }

    if (trade.user2Details !== undefined) {
      setUser2TokenList(
        trade.user2Details.map((token, index) => {
          if (token !== undefined) {
            return (
              <ViewItem
                key={`user2-${index}`}
                contractAddress={token.token}
                erc={token.erc}
                id={token.ids[0]}
                amount={token.amounts[0]}
              />
            );
          }
        })
      );
    }
  };

  // Contract interaction

  const handleTx = async () => {
    if (!trade.user2Details[0]) {
      await acceptTrade(tradeId);
    } else if (!approved) {
      for (let i = 0; i < trade.user2Details.length; i++) {
        // console.log("user2Details[i].ercType", user2Details[i].ercType);

        // ERC-20 + ERC-777
        if (
          trade.user2Details[i].ercType === 20 ||
          trade.user2Details[i].ercType === 777
        ) {
          const approvedAmount = await erc20Allowance(
            trade.user2Details[i].token,
            address,
            AtomicSwapAddress[chainId]
          );

          if (approvedAmount < trade.user2Details[i].amounts[0]) {
            const tx = await erc20Approve(
              trade.user2Details[i].token,
              AtomicSwapAddress[chainId],
              MaxUint256
            );
            await tx.wait();
          }
        }
        // ERC-721
        else if (trade.user2Details[i].ercType === 721) {
          const approved = await erc721IsApprovedForAll(
            trade.user2Details[i].token,
            AtomicSwapAddress[chainId],
            true
          );

          if (!approved) {
            const tx = await erc721SetApprovalForAll(
              trade.user2Details[i].token,
              AtomicSwapAddress[chainId],
              true
            );
            await tx.wait();
          }
        }
        // ERC-1155
        else if (trade.user2Details[i].ercType === 1155) {
          const approved = await erc1155IsApprovedForAll(
            trade.user2Details[i].token,
            AtomicSwapAddress[chainId],
            true
          );

          if (!approved) {
            const tx = await erc1155SetApprovalForAll(
              trade.user2Details[i].token,
              AtomicSwapAddress[chainId],
              true
            );
            await tx.wait();
          }
        }
      }
      setApproved(true);
    } else {
      await acceptTrade(tradeId);
    }
  };

  const handleCancelTrade = async () => {
    try {
      await cancelTrade(tradeId);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <CenterScreen>
      <Wrap padding="1rem" display="flex" justifyContent="center">
        <Button onClick={() => getTrade()}>Refresh</Button>
      </Wrap>
      <Wrap border="2px #aaa solid">
        <Wrap display="flex" justifyContent="center">
          <Heading>Trade #{tradeId}</Heading>
        </Wrap>
        <Wrap display="flex" justifyContent="center">
          <Heading>
            To: {trade.user2 === zeroAddress ? `Anyone` : cutTo}
          </Heading>
        </Wrap>
        <Wrap padding="0" display="flex" justifyContent="center">
          {address === zeroAddress && (
            <Wrap display="flex" justifyContent="center">
              <Button onClick={() => handleTx()}>
                {approved ? "ACCEPT" : "APPROVE"}
              </Button>
            </Wrap>
          )}
          {address === trade.user1 && (
            <Button
              border="2px solid #aaa"
              bgColor="#aaa"
              color="black"
              onClick={() => handleCancelTrade()}
            >
              CANCEL
            </Button>
          )}
        </Wrap>
      </Wrap>
      <Wrap padding="0" display="flex" justifyContent="center">
        {exists ? (
          <>
            {/* User1 Tokens */}
            <Wrap padding="1rem 1rem 1rem 0">
              <Heading textAlign="center">You Receive</Heading>
              <TokenContainer>{user1TokenList}</TokenContainer>
            </Wrap>
            {/* User2 Tokens */}
            <Wrap padding="1rem 0 1rem 1rem">
              <Heading textAlign="center">You Lose</Heading>
              <TokenContainer>{user2TokenList}</TokenContainer>
            </Wrap>
          </>
        ) : (
          <Heading>Trade doesn't exist</Heading>
        )}
      </Wrap>
    </CenterScreen>
  );
};

export default ViewTrade;
