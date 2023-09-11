import { useEffect } from 'react'
import { Text } from 'rebass/styled-components'
import styled from 'styled-components'

import { GasStation, MoneyFill } from 'components/Icons'
import { useActiveWeb3React } from 'services/web3'

const GroupButtonReturnTypes = styled.div`
  display: flex;
  border-radius: 999px;
  background: ${({ theme }) => theme.tabBackground};
  padding: 2px;
`

const ButtonReturnType = styled.div<{ active?: boolean }>`
  border-radius: 999px;
  flex: 1;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, active }) => (active ? theme.tabActive : theme.tabBackground)};
  color: ${({ theme, active }) => (active ? theme.text : theme.subText)};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: color 300ms;
`

type Props = {
  isSaveGas: boolean
  setSaveGas: React.Dispatch<React.SetStateAction<boolean>>
}
const TradeTypeSelection: React.FC<Props> = ({ isSaveGas, setSaveGas }) => {
  const { chainId } = useActiveWeb3React()
  useEffect(() => {
    if (chainId) setSaveGas(true)
  }, [setSaveGas])

  return (
    <GroupButtonReturnTypes>
      <ButtonReturnType onClick={() => setSaveGas(false)} active={!isSaveGas} role="button">
        <MoneyFill />
        <Text marginLeft="4px">
          {`Maximum Return`}
        </Text>
      </ButtonReturnType>
      <ButtonReturnType onClick={() => setSaveGas(true)} active={isSaveGas} role="button">
        <GasStation />
        <Text marginLeft="4px">
          {`Lowest Gas`}
        </Text>
      </ButtonReturnType>
    </GroupButtonReturnTypes>
  )
}

export default TradeTypeSelection
