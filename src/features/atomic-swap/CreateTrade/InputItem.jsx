import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ethers } from 'ethers'
import axios from 'axios'

import { Text, Wrap, ExternalLink, TokenImg, TokenImgTest } from 'ReusableStyles'

import useNft from 'hooks/useNft'

export const TokenRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

export const DetailBox = styled.div`
  display: block;
`

export const InputItem = ({ erc, contractAddress, id, amount }) => {
  const { getName, getErc721TokenUri, getErc1155TokenUri } = useNft()

  const [cutContract, setCutContract] = useState()
  const [name, setName] = useState(undefined)
  const [formattedAmount, setFormattedAmount] = useState()
  const [metadata, setMetadata] = useState(undefined)

  const cutAddress = (address) => {
    const stringAddress = address.toString()

    const firstSection = stringAddress.slice(0, 5).concat('...')
    const secondSection = stringAddress.slice(38, 42)

    const cutAddress = firstSection.concat(secondSection)
    return cutAddress
  }

  useEffect(() => {
    // cut address
    const cut = cutAddress(contractAddress)
    setCutContract(cut)

    // format amount
    setFormattedAmount(ethers.utils.formatUnits(amount.toString()))

    // load metadata
    loadMetadata()
  }, [])

  const loadMetadata = async () => {
    let tokenUri

    if (erc === 721 || erc === 1155) {
      if (erc === 721) {
        tokenUri = await getErc721TokenUri(contractAddress, id)
      } else if (erc === 1155) {
        tokenUri = await getErc1155TokenUri(contractAddress, id)
      }
      // get ipfs address
      const axiosMeta = await axios.get(tokenUri)
      // console.log("img", axiosMeta.data.image);

      // get image from the json
      setMetadata(axiosMeta.data.image)
      // console.log("tokenURI", tokenUri);
    }

    const rName = await getName(contractAddress)
    setName(rName)
    // console.log("rName", rName);
  }

  return (
    <TokenRow>
      <Wrap padding={metadata !== undefined ? '0 0 0 .75rem' : '.4rem 0 0 .75rem'} display="flex">
        {metadata !== undefined && <TokenImgTest src={metadata} />}
        {/* <TokenImgTest src={metadata} /> */}
        <DetailBox>
          <Text fontSize="0.9rem">
            <ExternalLink fontSize="0.9rem" href={`https://ftmscan.com/address/${contractAddress}`} target="_blank">
              {name === undefined ? cutContract : name}
            </ExternalLink>
          </Text>
          <Wrap padding="0" display="flex">
            {/* Display ID if NFT */}
            {Number(erc) === 721 || Number(erc) === 1155 ? (
              <Text textAlign="left" fontSize="0.9rem">
                <ExternalLink
                  fontSize="0.9rem"
                  color="#aaa"
                  href={`https://ftmscan.com/token/${contractAddress}?a=${Number(id)}`}
                  target="_blank"
                >
                  #{Number(id)}
                </ExternalLink>
              </Text>
            ) : null}
            {/* Display AMOUNT if Erc20 */}
            {Number(erc) === 20 || Number(erc) === 777 || Number(erc) === 1155 ? (
              <Text textAlign="left" fontSize="0.9rem" color="#aaa">
                {formattedAmount}
              </Text>
            ) : null}
          </Wrap>
        </DetailBox>
      </Wrap>
    </TokenRow>
  )
}
