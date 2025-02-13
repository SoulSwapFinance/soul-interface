import React, { useState } from "react";
import styled from "styled-components/macro";
import { TYPE, CloseIcon, ExternalLink } from "../../theme";
import { ButtonEmpty } from "../Button";
import Modal from "../Modal/DefaultModal";
import OutlineCard from "../Card";
import Card from "../Card";
import { RowBetween, AutoRow } from "../Row";
import { AutoColumn } from "../Column";
import { CurrencyLogo } from "../CurrencyLogo";
import { Currency, Token } from "sdk";
import { useUnsupportedTokens } from "../../hooks/Tokens";
// import { ExplorerDataType, getExplorerLink } from "../../utils/getExplorerLink";
import { getExplorerLink } from "functions/explorer";
import { useActiveWeb3React } from "services/web3";

const DetailsFooter = styled.div<{ show: boolean }>`
  padding-top: calc(16px + 2rem);
  padding-bottom: 20px;
  margin-top: -2rem;
  width: 100%;
  max-width: 400px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  color: ${({ theme }) => theme.text2};
  background-color: ${({ theme }) => theme.advancedBG};
  z-index: -1;

  transform: ${({ show }) => (show ? "translateY(0%)" : "translateY(-100%)")};
  transition: transform 300ms ease-in-out;
  text-align: center;
`;

const AddressText = styled(TYPE.Blue)`
  font-size: 12px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 10px;
`}
`;

const UnsupportedCurrencyFooter = ({
  show,
  currencies,
}: {
  show: boolean;
  currencies: (Currency | undefined)[];
}) => {
  const { chainId } = useActiveWeb3React();
  const [showDetails, setShowDetails] = useState(false);

  const tokens =
    chainId && currencies
      ? currencies.map((currency) => {
          return currency?.wrapped;
        })
      : [];

  const unsupportedTokens: {
    [address: string]: Token;
  } = useUnsupportedTokens();

  return (
    <DetailsFooter show={show}>
      <Modal isOpen={showDetails} onDismiss={() => setShowDetails(false)}>
        <Card 
          // padding="2rem"
          >
          <AutoColumn gap="lg">
            <RowBetween>
              <TYPE.MediumHeader>Unsupported Assets</TYPE.MediumHeader>
              <CloseIcon onClick={() => setShowDetails(false)} />
            </RowBetween>
            {tokens.map((token) => {
              return (
                token &&
                unsupportedTokens &&
                Object.keys(unsupportedTokens).includes(token.address) && (
                  <OutlineCard key={token.address?.concat("not-supported")}>
                    <AutoColumn gap="10px">
                      <AutoRow gap="5px" align="center">
                        <CurrencyLogo currency={token} size={24} />
                        <TYPE.Body fontWeight={500}>{token.symbol}</TYPE.Body>
                      </AutoRow>
                      {chainId && (
                        <ExternalLink
                          href={getExplorerLink(
                            chainId,
                            token.address,
                            "address"
                            // ExplorerDataType.ADDRESS
                          )}
                        >
                          <AddressText>{token.address}</AddressText>
                        </ExternalLink>
                      )}
                    </AutoColumn>
                  </OutlineCard>
                )
              );
            })}
            <AutoColumn gap="lg">
              <TYPE.Body fontWeight={500}>
                Some assets are not available through this interface because
                they may not work well with the smart contracts or we are unable
                to allow trading for legal reasons.
              </TYPE.Body>
            </AutoColumn>
          </AutoColumn>
        </Card>
      </Modal>
      <ButtonEmpty padding={"0"} onClick={() => setShowDetails(true)}>
        <TYPE.Blue>Read more about unsupported assets</TYPE.Blue>
      </ButtonEmpty>
    </DetailsFooter>
  );
}

export default UnsupportedCurrencyFooter
