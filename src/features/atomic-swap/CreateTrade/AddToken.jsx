import styled, { keyframes } from 'styled-components'
import { UserContainer, ExternalLink } from '../TradeItemStyles'
import { InputItem } from './InputItem'
import {
  Wrap,
  Text,
  Heading,
  Button,
  RemoveBtn,
  Input,
  InputRow,
  OptionSelector,
  TokenImgTest,
} from '../../../components/ReusableStyles'

export const ListWrap = styled.div`
  align-items: center;
  transition: all 0.3s ease-in-out;
  width: 20rem;
  height: 100%;
  margin: 0 1rem;
  padding: 0 1.5rem;

  border-radius: 2rem;
  border: 1px solid #333;
  background-color: #111;
  /* box-shadow: 0 0 10px #444; */
`

export const HeaderWrap = styled.div`
  border-bottom: 1px solid #777;
  display: flex;
  justify-content: center;
`

export const BodyWrap = styled.div`
  /* border-bottom: 1px solid #777; */
  display: block;
  justify-content: left;
`

export const FooterWrap = styled.div`
  display: flex;
  justify-content: center;
  border-top: 1px solid #777;
  padding: 0.8rem 0;
`

export const CreateTradeModal = styled.div`
  align-items: center;
  transition: all 0.3s ease-in-out;
  margin: 0 1rem;
  padding: 1rem 0.5rem 0.5rem 0.5rem;
  border-radius: 2rem;
  border: 1px solid #333;
  background-color: #111;
`

export const ModalFooter = styled.div`
  /* border-top: 1.5px solid #aaa; */
  display: flex;
  justify-content: center;
  padding: 0 0 0.5rem 0;
`

export const Jaw = styled.img`
  height: ${({ height }) => (height ? `${height}` : ``)};
  width: ${({ width }) => (width ? `${width}` : ``)};
  padding: ${({ padding }) => (padding ? `${padding}` : ``)};
  outline: none;
  z-index: 9999;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

// ----------------------------------------------------------------------------
//  FUNCTIONALITY
// ----------------------------------------------------------------------------

import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

import { ZERO_ADDRESS, ATOMIC_SWAP_ADDRESS } from '../../../constants/addresses'

import useApproveContract from '../hooks/useApprove'
import useAtomicSwap from '../hooks/useAtomicSwap'

// To do:
// - If add multiple ids, display separate tokens in token list

const AddToken = ({ to }) => {
  const { account, chainId } = useActiveWeb3React()
  const { createTrade } = useAtomicSwap()
  const {
    erc20Approve,
    erc20Allowance,
    erc721Approve,
    erc721GetApproved,
    erc721SetApprovalForAll,
    erc721IsApprovedForAll,
    erc1155SetApprovalForAll,
    erc1155IsApprovedForAll,
  } = useApproveContract()

  const [approved, setApproved] = useState(false)
  const [erc, setErc] = useState()

  const [loseTokens, setLoseTokens] = useState([])
  const [receiveTokens, setReceiveTokens] = useState([])

  const [jaw, setJaw] = useState({
    active: 'opened',
    status: ['opened', 'closing', 'closed', 'opening'],
  })

  const [section, setSection] = useState({
    position: 0,
    // erc, address, amount
    20: [0, 0, 0],
    777: [0, 0, 0],
    // erc, address, id
    721: [0, 0, 0],
    // erc, address, amount, id
    1155: [0, 0, 0, 0],
  })

  const loseTokenList = loseTokens.map((token, index) => {
    return (
      <Wrap display="flex" padding=".5rem 0" key={index}>
        <InputItem key={index} contractAddress={token[0]} erc={token[1]} id={token[2][0]} amount={token[3][0]} />
        <RemoveBtn margin="0 .5rem 0 0" onClick={() => handleRemove(true, token, index)}>
          X
        </RemoveBtn>
      </Wrap>
    )
  })

  const receiveTokenList = receiveTokens.map((token, index) => {
    return (
      <Wrap display="flex" padding=".5rem 0" key={index}>
        <InputItem key={index} contractAddress={token[0]} erc={token[1]} id={token[2][0]} amount={token[3][0]} />
        <RemoveBtn margin="0 .5rem 0 0" onClick={() => handleRemove(false, token, index)}>
          X
        </RemoveBtn>
      </Wrap>
    )
  })

  const handleErcSelection = () => {
    const selectErc = document.getElementById('selectErc')
    const ercSelected = selectErc.options[selectErc.selectedIndex].value
    setErc(ercSelected)
  }

  const handleRemove = (user1, rToken, rIndex) => {
    if (user1) {
      const newLose = loseTokens.filter((token, index) => index !== rIndex)
      setLoseTokens(newLose)
    } else {
      setReceiveTokens(receiveTokens.filter((token, index) => index !== rIndex))
    }
  }

  const handleAdd = async (lose) => {
    // set erc type
    const selectErc = document.getElementById('selectErc')
    const ercInput = selectErc.options[selectErc.selectedIndex].value
    if (ercInput != 20 && ercInput != 777 && ercInput != 721 && ercInput != 1155) {
      console.warn("Add Token: erc isn't set")
      handleReset()
      return
    }

    // set contract
    const contract = document.getElementById('contractAddress')
    const contractInput = contract.value
    if (contractInput.length != 42) {
      console.warn("Add Token: address isn't 42 characters")
      handleReset()
      return
    }

    // set id
    const ids = document.getElementById('ids')
    const idsInput = [ids.value]
    console.log('idsInput', idsInput)

    // set amount
    const amounts = document.getElementById('amounts')
    const amountsInput = [ethers.utils.parseUnits(amounts.value)]

    if (lose) {
      setLoseTokens([...loseTokens, [contractInput, ercInput, idsInput, amountsInput]])
    } else {
      setReceiveTokens([...receiveTokens, [contractInput, ercInput, idsInput, amountsInput]])
    }

    handleReset()
  }

  // Clears the input fields
  const handleReset = () => {
    const contract = document.getElementById('contractAddress')
    contract.value = ''

    const amounts = document.getElementById('amounts')
    amounts.value = 0

    const ids = document.getElementById('ids')
    ids.value = 0
  }

  const handleTx = async () => {
    // if sending no lose tokens, send blank struct
    if (!loseTokens[0]) {
      await createTrade(to, 0, [[ZERO_ADDRESS, 0, [0], [0]]], receiveTokens, {
        value: 0,
      })
    } else if (!approved) {
      // loop through struct array + approve all tokens
      for (let i = 0; i < loseTokens.length; i++) {
        // console.log("erc type input:", loseTokens[i][1]);

        // ERC-20 + ERC-777
        if (loseTokens[i][1] === '20' || loseTokens[i][1] === '777') {
          const approvedAmount = await erc20Allowance(loseTokens[i][0], account, ATOMIC_SWAP_ADDRESS[chainId])

          // loseTokens[tokenNumber][amount][amount position 0] > approved amount
          if (loseTokens[i][3][0] > approvedAmount) {
            // approve max uint for loseToken[i] account
            const tx = await erc20Approve(loseTokens[i][0], ATOMIC_SWAP_ADDRESS[chainId])
            await tx.wait()
          }
        }

        // ERC-721
        else if (loseTokens[i][1] === '721') {
          // check if id is approved
          const approved = await erc721IsApprovedForAll(loseTokens[i][0], account, ATOMIC_SWAP_ADDRESS[chainId])

          // if not approved, approve id
          if (!approved) {
            const tx = await erc721SetApprovalForAll(loseTokens[i][0], ATOMIC_SWAP_ADDRESS[chainId], true)
          }
        }

        // ERC-1155
        else if (loseTokens[i][1] === '1155') {
          const approved = await erc1155IsApprovedForAll(loseTokens[i][0], ATOMIC_SWAP_ADDRESS[chainId], true)

          if (!approved) {
            const tx = await erc1155SetApprovalForAll(loseTokens[i][0], ATOMIC_SWAP_ADDRESS[chainId], true)
            await tx.wait()
          }
        }
      }
      setApproved(true)
    } else {
      // otherwise, if no receive token
      if (!receiveTokens[0]) {
        // create trade w/ blank receive
        await createTrade(to, 0, loseTokens, [[ZERO_ADDRESS, 0, [0], [0]]], {
          value: 0,
        })
      } else {
        // else, create trade w/ stored token value(s)
        await createTrade(to, 0, loseTokens, receiveTokens, { value: 0 })
      }
    }
  }

  return (
    <Wrap display="flex">
      {/* <Jaw
        height='80rem'
        src={"/images/illustrations/AtomicSwap/static-open.png"}
      /> */}
      {/* <CreateTradeModal> */}
      {/* <Wrap margin="0" padding="0 0.5rem">
          <InputRow height="100%">
            {section.position === 0 && (
              <Wrap>
                <Text fontSize=".8rem" padding="0 0 2.5px 0">
                  Token Type:
                </Text>
                <OptionSelector
                  placeholder="Erc"
                  id="selectErc"
                  onChange={() => handleErcSelection()}
                  required
                >
                  <option
                    disabled
                    selected
                    value=""
                    style={{ display: "none" }}
                  ></option>
                  <option value="20">ERC-20</option>
                  <option value="777">ERC-777</option>
                  <option value="721">ERC-721</option>
                  <option value="1155">ERC-1155</option>
                </OptionSelector>
              </Wrap>
            )}
            {section.position === 1 && (
              <Wrap>
                <Text fontSize=".8rem" padding="0 0 2.5px 0">
                  Contract Address:
                </Text>
                <Input
                  required
                  type="text"
                  placeholder="0x..."
                  id="contractAddress"
                ></Input>
              </Wrap>
            )}
            {section.position === 2 && (section[20] || section[777] || section[1155]) && (
            <Wrap>
              <Text fontSize=".8rem" padding="0 0 2.5px 0">
                Amount:
              </Text>
              <Input
                disabled={erc === "721" ? true : false}
                value={erc === "721" ? 0 : undefined}
                required
                type="number"
                min="0"
                placeholder="0"
                id="amounts"
              ></Input>
            </Wrap>
            )}
            
            {section.position === 3 && (section[721] || section[1155]) && (
            <Wrap>
              <Text fontSize=".8rem" padding="0 0 2.5px 0">
                Id:
              </Text>
              <Input
                disabled={erc === "20" || erc === "777" ? true : false}
                value={erc === "20" || erc === "777" ? 0 : undefined}
                required
                type="number"
                min="0"
                placeholder="0"
                id="ids"
              ></Input>
            </Wrap>
            )}

          </InputRow>

          <ModalFooter>
            <Button
              width="100%"
              bgColor="#aaa"
              color="#333"
              border="1.5px solid"
              onClick={() => handleAdd(true)}
            >
              Lose
            </Button>
            <Button width="100%" onClick={() => handleAdd(false)}>
              Receive
            </Button>
          </ModalFooter>
        </Wrap> */}
      {/* </CreateTradeModal> */}

      <CreateTradeModal>
        <Wrap margin="0" padding="0 0.5rem">
          <Heading textAlign="center" fontSize="1.25rem">
            Add Token
          </Heading>
          <InputRow height="100%">
            <Wrap>
              <Text fontSize=".8rem" padding="0 0 2.5px 0">
                Token Type:
              </Text>
              <OptionSelector placeholder="Erc" id="selectErc" onChange={() => handleErcSelection()} required>
                <option disabled selected value="" style={{ display: 'none' }}></option>
                <option value="20">ERC-20</option>
                <option value="777">ERC-777</option>
                <option value="721">ERC-721</option>
                <option value="1155">ERC-1155</option>
              </OptionSelector>
            </Wrap>
            <Wrap>
              <Text fontSize=".8rem" padding="0 0 2.5px 0">
                Contract Address:
              </Text>
              <Input required type="text" placeholder="0x..." id="contractAddress"></Input>
            </Wrap>
            <Wrap>
              <Text fontSize=".8rem" padding="0 0 2.5px 0">
                Amount:
              </Text>
              <Input
                disabled={erc === '721' ? true : false}
                value={erc === '721' ? 0 : undefined}
                required
                type="number"
                min="0"
                placeholder="0"
                id="amounts"
              ></Input>
            </Wrap>
            <Wrap>
              <Text fontSize=".8rem" padding="0 0 2.5px 0">
                Id:
              </Text>
              <Input
                disabled={erc === '20' || erc === '777' ? true : false}
                value={erc === '20' || erc === '777' ? 0 : undefined}
                required
                type="number"
                min="0"
                placeholder="0"
                id="ids"
              ></Input>
            </Wrap>
          </InputRow>
          <ModalFooter>
            <Button width="100%" bgColor="#aaa" color="#333" border="1.5px solid" onClick={() => handleAdd(true)}>
              Lose
            </Button>
            <Button width="100%" onClick={() => handleAdd(false)}>
              Receive
            </Button>
          </ModalFooter>
        </Wrap>
      </CreateTradeModal>

      <ListWrap>
        <UserContainer>
          <Heading>You Receive</Heading>
          {/* {to.length === 42 && to !== ZERO_ADDRESS ? (
            <Text padding="0" color="#aaa" fontSize="0.7rem">
              The tokens you will receive from&nbsp;
              <ExternalLink
                fontSize=".55rem"
                href={`https://testnet.ftmscan.com/address/${to}`}
                target="_blank"
              >
                {to.slice(0, 6) + "..." + to.slice(-4)}
              </ExternalLink>
              .
            </Text>
          ) : ( */}
          <Text padding="0" color="#aaa" fontSize="0.7rem">
            These are the tokens you will receive in this trade.
          </Text>
          {/* )} */}
        </UserContainer>

        {receiveTokenList[0] ? (
          <InputRow padding="auto" justifyContent="center" alignItems="center">
            {receiveTokenList}
          </InputRow>
        ) : (
          <InputRow overflowY="none" display="flex" justifyContent="center" alignItems="center">
            <Heading textAlign="center">NA</Heading>
          </InputRow>
        )}

        <UserContainer>
          <Heading>You Lose</Heading>
          <Text padding="0" color="#aaa" fontSize="0.7rem">
            These are the tokens you will lose in this trade.
          </Text>
        </UserContainer>

        {loseTokenList[0] ? (
          <InputRow padding="auto" justifyContent="center" alignItems="center">
            {loseTokenList}
          </InputRow>
        ) : (
          <InputRow overflowY="none" display="flex" justifyContent="center" alignItems="center">
            <Heading textAlign="center">NA</Heading>
          </InputRow>
        )}

        <FooterWrap>
          <Button
            disabled={!loseTokenList[0] && !receiveTokenList[0] ? true : false}
            width="100%"
            onClick={() => handleTx()}
          >
            {!approved && loseTokenList[0] ? 'Approve All' : 'Confirm'}
          </Button>
        </FooterWrap>
      </ListWrap>
    </Wrap>
  )
}

export default AddToken
