import { t } from '@lingui/macro'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft } from 'react-feather'
import { Box, Flex, Text } from 'rebass'
import styled from 'styled-components'
import Image from 'components/Image'
import Checkbox from 'components/Checkbox/CheckboxV2'
import { ELASTIC_NOT_SUPPORTED, soulswapDexes } from 'constants/dexes'
import { useActiveWeb3React } from 'services/web3'
import useDebounce from 'hooks/useDebounce'
import { useAllDexes, useExcludeDexes } from 'state/customizeDexes/hooks'

import SearchBar from './SearchBar'

type Props = {
  onBack: () => void
}

const BackIconWrapper = styled(ArrowLeft)`
  height: 20px;
  width: 20px;
  margin-right: 10px;
  cursor: pointer;
  path {
    stroke: ${({ theme }) => theme.text} !important;
  }
`

const BackText = styled.span`
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`

const SourceList = styled.div`
  width: 100%;
  height: 300px;
  max-height: 300px;
  overflow-y: scroll;
  overflow-x: hidden;

  display: flex;
  flex-direction: column;
  row-gap: 24px;

  /* width */
  ::-webkit-scrollbar {
    display: unset;
    width: 8px;
    border-radius: 999px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 999px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.disableText};
    border-radius: 999px;
  }
`

const Source = styled.div`
  width: 100%;
  height: 32px;

  display: flex;
  align-items: center;
  column-gap: 16px;
  padding: 12px;
`

const ImageWrapper = styled.div`
  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;

  img {
    width: 100%;
    height: auto;
  }
`

const SourceName = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.text};
`

const LiquiditySourceHeader = styled.div`
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  background: ${({ theme }) => theme.tableHeader};
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 500;
  padding: 12px;
  color: ${({ theme }) => theme.subText};
  display: flex;
  gap: 1rem;
  align-items: center;
`

const LiquiditySourcesPanel: React.FC<Props> = ({ onBack }) => {
  const [searchText, setSearchText] = useState('')
  const debouncedSearchText = useDebounce(searchText.toLowerCase(), 200).trim()
  const { chainId } = useActiveWeb3React()

  const dexes = useAllDexes()
  const [excludeDexes, setExcludeDexes] = useExcludeDexes()

  const checkAllRef = useRef<HTMLInputElement>(null)
  const kyberSwapRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const selectedDexes = dexes?.filter(item => !excludeDexes.includes(item.id)) || []

    if (!checkAllRef.current) return

    if (selectedDexes.length === dexes?.length) {
      checkAllRef.current.checked = true
      checkAllRef.current.indeterminate = false
    } else if (!selectedDexes.length) {
      checkAllRef.current.checked = false
      checkAllRef.current.indeterminate = false
    } else if (selectedDexes.length < (dexes?.length || 0)) {
      checkAllRef.current.checked = false
      checkAllRef.current.indeterminate = true
    }
  }, [excludeDexes, dexes])

  const ssDexes = useMemo(
    () => soulswapDexes.filter(item => (ELASTIC_NOT_SUPPORTED[chainId || 1] ? item.id !== 'soulswap' : true)),
    // () => soulswapDexes.filter(item => (ELASTIC_NOT_SUPPORTED[chainId || 1] ? item.id !== 'kyberswapv2' : true)),
    [chainId],
  )

  useEffect(() => {
    if (!kyberSwapRef.current) return
    const ssDexesId = ssDexes.map(i => i.id)
    if (ssDexesId.every(item => excludeDexes.includes(item))) {
      kyberSwapRef.current.checked = false
      kyberSwapRef.current.indeterminate = false
    } else if (ssDexesId.some(item => excludeDexes.includes(item))) {
      kyberSwapRef.current.checked = false
      kyberSwapRef.current.indeterminate = true
    } else {
      kyberSwapRef.current.checked = true
      kyberSwapRef.current.indeterminate = false
    }
  }, [excludeDexes, ssDexes])

  const handleToggleDex = (id: string) => {
    const isExclude = excludeDexes.find(item => item === id)
    if (isExclude) {
      setExcludeDexes(excludeDexes.filter(item => item !== id))
    } else {
      setExcludeDexes([...excludeDexes, id])
    }
  }

  return (
    <Box width="100%">
      <Flex
        width={'100%'}
        flexDirection={'column'}
        sx={{
          rowGap: '20px',
        }}
      >
        <Flex
          alignItems="center"
          sx={{
            // this is to make the arrow stay exactly where it stays in Swap panel
            marginTop: '5px',
          }}
        >
          <BackIconWrapper onClick={onBack}></BackIconWrapper>
          <BackText>{t`Liquidity Sources`}</BackText>
        </Flex>

        <SearchBar text={searchText} setText={setSearchText} />

        <LiquiditySourceHeader>
          <Checkbox
            type="checkbox"
            ref={checkAllRef}
            onChange={e => {
              if (!e.currentTarget.checked) {
                setExcludeDexes(dexes?.map(item => item.id) || [])
              } else {
                setExcludeDexes([])
              }
            }}
          />
          <Text>
            Liquidity Sources
          </Text>
        </LiquiditySourceHeader>

        <SourceList>
          {!!ssDexes.filter(item => item.name.toLowerCase().includes(debouncedSearchText)).length && (
            <>
              <Source>
                <Checkbox
                  type="checkbox"
                  ref={kyberSwapRef}
                  checked={!ssDexes.map(i => i.id).every(item => excludeDexes.includes(item))}
                  onChange={e => {
                    if (e.target.checked) {
                      setExcludeDexes(excludeDexes.filter(item => !item.includes('kyberswap')))
                    } else {
                      const newData = [
                        ...excludeDexes.filter(item => !item.includes('kyberswap')),
                        ...ssDexes.map(item => item.id),
                      ]
                      setExcludeDexes(newData)
                    }
                  }}
                />
                <ImageWrapper>
                  <Image src="https://kyberswap.com/favicon.ico" alt="ks logo" />
                </ImageWrapper>
                <SourceName>Kyberswap - All</SourceName>
              </Source>

              {ssDexes
                .filter(item => item.name.toLowerCase().includes(debouncedSearchText))
                .map(({ name, logoURL, id }) => {
                  return (
                    <Source key={name} style={{ padding: '12px 48px' }}>
                      <Checkbox
                        type="checkbox"
                        checked={!excludeDexes.includes(id)}
                        onChange={() => handleToggleDex(id)}
                      />

                      <ImageWrapper>
                        <Image src={logoURL} alt="" />
                      </ImageWrapper>

                      <SourceName>{name}</SourceName>
                    </Source>
                  )
                })}
            </>
          )}
          {dexes
            ?.filter(item => !item.id.includes('kyberswap') && item.name.toLowerCase().includes(debouncedSearchText))
            .map(({ name, logoURL, id }) => (
              <Source key={name}>
                <Checkbox type="checkbox" checked={!excludeDexes.includes(id)} onChange={() => handleToggleDex(id)} />

                <ImageWrapper>
                  <Image src={logoURL} alt="" />
                </ImageWrapper>

                <SourceName>{name}</SourceName>
              </Source>
            ))}
        </SourceList>
      </Flex>
    </Box>
  )
}

export default LiquiditySourcesPanel
