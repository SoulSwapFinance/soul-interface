import React, { useEffect, useCallback, useState } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import useWeb3 from './useWeb3'
import Button from 'components/Button'
import { useMerkleDistributorContract } from 'hooks/useContract'
import Merkle from 'constants/merkle'
import Input from 'components/Input'
import Modal from 'components/Modal'
import { Box } from 'react-feather'
import Typography from 'components/Typography'
import Container from 'components/Container'

const StyledInput = styled(Input)`
  border-radius: 16px;
  margin-left: auto;
`
const InputWrapper = styled.div`
  position: relative;
  margin-top: 16px;
  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
  }
`
interface ClaimModalProps {
  onDismiss?: () => void
}

const getClaimObjectFromAddress = (address: string) => {
  const keys = Object.keys(Merkle.claims)
  return Merkle.claims[keys.find((key) => key.toLowerCase() === address.toLowerCase())]
}

const ClaimModal: React.FC<ClaimModalProps> = ({ onDismiss }) => {
  const { account } = useWeb3React()
  const web3 = useWeb3()
  const airdropContract = useMerkleDistributorContract()
  const [recipientAddress, setRecipientAddress] = useState('')
  const [isEligible, setIsEligible] = useState(false)
  const [isAirdropClaimed, setIsAirdropClaimed] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const getEligibility = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const address = event.target.value
      setRecipientAddress(address)
      const eligibility = !!getClaimObjectFromAddress(address)
      setIsEligible(eligibility)
      if (eligibility) {
        setError('')
      } else {
        setError('Address has no available claim')
      }
    },
    [setIsEligible, setError],
  )

  const getAirdropStats = useCallback(async () => {
    const claimObject: any = getClaimObjectFromAddress(recipientAddress)
    const isClaimed = await airdropContract.isClaimed(claimObject.index)

    setIsAirdropClaimed(isClaimed)
    if (isClaimed) {
      setError('You have already claimed your airdrop')
    } else {
      setError('')
    }
  }, [recipientAddress, setIsAirdropClaimed, setError, airdropContract])

  const claimAirdrop = useCallback(async () => {
    const claimObject = getClaimObjectFromAddress(recipientAddress)

    const tx = await airdropContract.claim(claimObject.index, recipientAddress, claimObject.amount, claimObject.proof, {
      from: account,
    })
    setMessage('Your transaction has been recorded')
    const receipt = await tx.wait()
    if (receipt.status) {
      setMessage('You have successfully claimed your airdrop')
    } else {
      setError('Transaction was not successful')
    }
  }, [account, recipientAddress, airdropContract, setError, setMessage])

  useEffect(() => {
    const setup = async () => {
      if (!airdropContract) {
        setError('Airdrop not available')
      }
      if (isEligible) {
        await getAirdropStats()
      }
    }
    setup()
  }, [isEligible, getAirdropStats, setError, airdropContract])

  return (
    <Modal onDismiss={onDismiss} isOpen={false}>
      <Container justifyContent="flex-center">
        <Box className="max-width-320px">
          <Typography className="font-14px">
            { 'Enter an address to trigger a SOUL claim. If the address has any claimable SOUL it will be sent to them on submission.' }
          </Typography>
          <InputWrapper>
            <StyledInput
              scale="lg"
              value={recipientAddress}
              placeholder="Recipient Address"
              onChange={getEligibility}
            />
          </InputWrapper>
          <Typography color="red">{error}</Typography>
          <Typography color="green">{message}</Typography>
          <Button className="mt-16" disabled={!isEligible} onClick={claimAirdrop}>
            Claim SOUL
          </Button>
        </Box>
      </Container>
    </Modal>
  )
}

export default ClaimModal