import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { ZERO_ADDRESS, ATOMIC_SWAP_ADDRESS } from 'constants/addresses'
import useAtomicSwap from 'hooks/useAtomicSwap'
import AddToken from './AddToken'

import {
  Text,
  Button,
  Input,
  InputRow,
  CheckBox,
  Wrap,
  OverlayOpacity,
  CenterScreen,
} from 'components/ReusableStyles'

export const TradeInput = styled.div`
  display: flex;
  margin: 1rem 0;
  justify-content: center;
`

export const CreateTrade = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [privTrade, setPrivTrade] = useState(false)
  const [toAddress, setToAddress] = useState(ZERO_ADDRESS)

  const handlePrivTrade = () => {
    setPrivTrade(!privTrade)
    if (!privTrade) {
      document.getElementById('to').value = ''
      setToAddress(ZERO_ADDRESS)
    }
  }

  return (
    <>
      <Button onClick={() => setModalOpen(true)}>Create Trade</Button>
      {modalOpen ? (
        <OverlayOpacity>
          <CenterScreen>
            <Wrap display="flex" justifyContent="right">
              <Button bgColor="#aaa" color="#333" border="1.5px solid" onClick={() => setModalOpen(false)}>
                Close
              </Button>
            </Wrap>

            <Wrap padding="0">
              <Wrap padding="0 2rem">
                <InputRow>
                  <Wrap display="flex">
                    <Wrap padding="0 1rem 0 .6rem">
                      <Wrap display="flex" padding="0">
                        <Text padding="0" fontSize="1rem">
                          Private Trade:
                        </Text>
                        <CheckBox margin="0 0 0 .5rem" type="checkbox" onClick={() => handlePrivTrade()} />
                      </Wrap>

                      <Text padding="0" fontSize="0.65rem" color="#aaa">
                        Only one address can accept
                      </Text>
                    </Wrap>

                    <Input
                      id="to"
                      disabled={privTrade ? false : true}
                      width="22rem"
                      placeholder="0x..."
                      type="text"
                      onChange={() => setToAddress(document.getElementById('to').value)}
                    ></Input>
                  </Wrap>
                </InputRow>
              </Wrap>
              <AddToken to={toAddress} />
            </Wrap>
          </CenterScreen>
        </OverlayOpacity>
      ) : null}
    </>
  )
}
