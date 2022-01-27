import React, { useEffect } from "react";

import { Connection } from "../../components/Web3Connection/Connection";

import { ContractScan } from "../../constants";

import { VscWarning } from "react-icons/vsc";
import { Wrap, Text, ExternalLink } from "../ReusableStyles";
import styled from "styled-components";

const WarningIcon = styled(VscWarning)`
  color: orange;
  font-size: 1.2rem;
`;

/**
 * contractName: Name of contract
 * constantName: Name of variable in constants - we use this to find the chains associated with it
 */
const UnauditedWarning = ({ contractName, constantName }) => {
  const { network, chainId } = Connection.useContainer();

  useEffect(() => {
    // console.log("scan", ContractScan[network.chainId]);
    // console.log("chainId", network.chainId);
    // console.log('constant', constantName?.[network.chainId])
  }, [chainId]);

  return (
    <Wrap
      padding=".5rem 0"
      display="flex"
      justifyContent="center"
      borderRadius="8px"
      bgColor="#333"
      width="26rem"
    >
      <WarningIcon />
      <Text fontSize=".9rem" color="white">
        {constantName?.[1] !== "" ? (
          <ExternalLink fontSize=".9rem" color="orange">
            {/* {`${ContractScan[network.chainId]}` + `${constantName}`} */}
          </ExternalLink>
        ) : (
          {contractName}
        )}
        &nbsp; has not been audited, yet. Use at your own risk.
      </Text>
    </Wrap>
  );
};

export default UnauditedWarning;
