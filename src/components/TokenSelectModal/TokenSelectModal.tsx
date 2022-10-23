import React, { useContext, useEffect, useState } from "react";
import Modal from "./Modal";

import { OverlayButton, Typo3 } from "../index";
import Row from "../Row";
import Spacer from "../Spacer";
import Column from "../Column";
import styled, { ThemeContext } from "styled-components";
import TokenBalance from "./TokenBalance";
import ModalTitle from "./ModalTitle";
import ModalContent from "./ModalContent";
import Scrollbar from "../Scrollbar";
import InputTextBox from "./InputTextBox";
import { hexToUnit } from "../../utils/conversion";
import { stickyTokensList } from "features/aggregator/token";
import { FANTOM_NATIVE } from "components/InputCurrency/InputCurrencyBox";

export const compare = (a: any, b: any) => {
  if (a > b) return +1;
  if (a < b) return -1;
  return 0;
};

const TokenSelectModal: React.FC<any> = ({
  onDismiss,
  ftmBalance,
  assets = [],
  setTokenSelected,
  includeNative,
}) => {
  // const { color } = useContext(ThemeContext);
  const allAssets = includeNative
    ? [{ ...FANTOM_NATIVE, balanceOf: ftmBalance }, ...assets]
    : assets;
  const erc20Assets = allAssets?.filter((asset: any) => {
    return asset?.decimals > 0;
  });
  const sortedAssets = [...erc20Assets]
    .filter(
      (asset: any) => !stickyTokensList?.includes(asset?.symbol.toLowerCase())
    )
    .sort(
      (a: any, b: any) =>
        compare(hexToUnit(b.balanceOf), hexToUnit(a.balanceOf)) ||
        compare(a.symbol, b.symbol)
    );
    const stickyAssets = [...erc20Assets].filter((asset: any) =>
    stickyTokensList.includes(asset?.symbol.toLowerCase())
  );

  const [search, setSearch] = useState("");
  const [listAssets, setListAssets] = useState([
    ...stickyAssets,
    ...sortedAssets,
  ]);

  useEffect(() => {
    const filteredAssets = [...stickyAssets, ...sortedAssets].filter(
      (asset: any) => {
        const result = asset?.symbol.toLowerCase().search(search.toLowerCase());
        return result >= 0;
      }
    );

    setListAssets(filteredAssets);
    // setListAssets(['ftm', 'dai', 'usdc', 'soul']);
  }, [search]);

  return (
    <Modal
      style={{ padding: "20px 24px", maxHeight: "80vh" }}
      onDismiss={onDismiss}
    >
      <ModalTitle text="Select Token" />
      <InputTextBox
        text={search}
        setText={setSearch}
        placeholder="Search..."
        small
      />
      <Spacer />
      <ModalContent style={{ padding: "16px 0px" }}>
        <Column>
          <Row
            style={{
              justifyContent: "space-between",
              padding: "0 1rem .5rem 1rem",
            }}
          >
            <Typo3
              style={{
                textAlign: "left",
                width: "8rem",
                color: '#B7BECB',
              }}
            >
              TOKEN NAME
            </Typo3>
            <Typo3
              style={{
                textAlign: "right",
                width: "8rem",
                color: '#B7BECB',
              }}
            >
              BALANCE
            </Typo3>
          </Row>
          <Scrollbar style={{ height: "60vh" }}>
            <Column>
              {listAssets.map((asset: any) => {
                return (
                  <StyledOverlayButton
                    key={"token-select-" + asset?.address}
                    onClick={() => {
                      setTokenSelected(asset);
                      onDismiss();
                    }}
                    style={{ padding: ".8rem" }}
                  >
                    <TokenBalance token={asset} height={'24px'} width={'24px'} imageSize="24px" />
                  </StyledOverlayButton>
                );
              })}
            </Column>
          </Scrollbar>
        </Column>
      </ModalContent>
    </Modal>
  );
};

const StyledOverlayButton = styled(OverlayButton)`
  :hover {
    background-color: ${'#FFFFFF'};
  }
`;

export default TokenSelectModal;