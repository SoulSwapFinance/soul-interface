import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { ethers } from "ethers";

import { useActiveWeb3React } from 'services/web3'

import useSoulSummoner from "features/mines/hooks/useSoulSummoner";
import useApprove from "features/bond/hooks/useApprove";

import {
  SOUL_SUMMONER_ADDRESS,
  // SeanceTokenAddress,
  // SoulTokenAddress,
} from "../../constants";

import {
  FlexText,
  FarmContainer,
  Row,
  FarmContentWrapper,
  TokenPairBox,
  FarmItemBox,
  FarmItemHeading,
  FarmItem,
  ShowBtn,
  DetailsContainer,
  DetailsWrapper,
  FunctionBox,
  Input,
  SubmitButton,
} from "./FarmStyles";

import {
  Wrap,
  ClickableText,
  Heading,
  Text,
  ExternalLink,
} from "../../components/ReusableStyles";

const HideOnMobile = styled(FarmItemBox)`
  @media screen and (max-width: 900px) {
    display: none;
  }
`;

const TokenPair = styled(ExternalLink)`
  font-size: 1.2rem;
  padding: 0;

  @media screen and (max-width: 400px) {
    font-size: 1rem;
    padding-right: 10px;
  }
`;

const StakeRow = ({ pid, lpSymbol, lpToken, token1, token2, farm }) => {
  const { chainId, account } = useActiveWeb3React()

  const {
    fetchFarmStats,
    fetchYearlyRewards,
    fetchUserLpTokenAlloc,
    fetchPid0AprAndLiquidity,
    fetchStakeStats,
    fetchUserLpTokenAllocInFarm,
    leaveStaking,
    enterStaking,
    pendingSoul,
    userInfo,
  } = useSoulSummoner(
    lpToken,
    farm.token1Address,
    farm.token2Address
  );

  const { erc20Allowance, erc20Approve, erc20BalanceOf } = useApprove();

  const [showing, setShowing] = useState(false);

  const [approved, setApproved] = useState(false);

  const [stakedBal, setStakedBal] = useState(0);
  const [unstakedBal, setUnstakedBal] = useState(0);
  const [pending, setPending] = useState(0);

  // const [earningPerDay, setEarningPerDay] = useState();
  const [percOfFarm, setPercOfFarm] = useState();

  const [yearlySoulRewards, setYearlySoulRewards] = useState();
  const [apr, setApr] = useState();
  const [liquidity, setLiquidity] = useState();

  /**
   * Runs only on initial render/mount
   */
  useEffect(() => {
    getAprAndLiquidity();
    getYearlyPoolRewards();
    fetchPending();
    fetchUserFarmAlloc();
  }, [account]);

  /**
   * Runs on initial render/mount and  reruns every second
   */
  useEffect(() => {
    if (account) {
      const timer = setTimeout(() => {
        fetchPending();
        getAprAndLiquidity();
        fetchUserFarmAlloc();

        if (showing) {
          // fetchBals();
          // fetchApproval();
        }
      }, 10000);

      // Clear timeout if the component is unmounted
      return () => clearTimeout(timer);
    }
  });

  /**
   * Opens the function panel dropdown
   */
  const handleShow = () => {
    setShowing(!showing);
    if (!showing) {
      fetchBals();
      fetchApproval();
    }
  };

  /**
   * Checks the user's alloc of the total staked in the farm
   */
  const fetchUserFarmAlloc = async () => {
    const ownership = await fetchUserLpTokenAllocInFarm(pid, account);
    const userStakedPercOfSummoner = Number(ownership?.[4]);
    if (userStakedPercOfSummoner)
      setPercOfFarm(Number(userStakedPercOfSummoner).toFixed(2));
    else setPercOfFarm(0);
  };

  const getYearlyPoolRewards = async () => {
    const pidSoulPerYear = await fetchYearlyRewards(pid);
    const dailyRewards = pidSoulPerYear / 10 ** 18 / 365;

    setYearlySoulRewards(
      Number(dailyRewards)
        .toFixed(0)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    );
  };

  /**
   * Checks the amount of lpTokens the SoulSummoner contract holds
   * farm <Object> : the farm object
   * lpToken : the farm lpToken address
   */
  const getAprAndLiquidity = async () => {
    try {
      const result = await fetchStakeStats();
      const tvl = result[0];
      const apr = result[1];

      setLiquidity(
        Number(tvl)
          .toFixed(0)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );

      // console.log("apr", farmApr);
      setApr(
        Number(apr)
          .toFixed(0)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );
    } catch (e) {
      console.warn(e);
    }
  };

  /**
   * Gets the lpToken balance of the user for each pool
   */
  const fetchBals = async () => {
    if (!account) {
      console.log("connect wallet");
    } else {
      try {
        // SOUL AVAILABLE
        const result1 = await userInfo(0, account);
        const staked = ethers.utils.formatUnits(result1?.[0]);
        console.log("staked", staked);
        // setStakedBal(staked.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        setStakedBal(staked);

        // SOUL STAKED
        const unstakedBal = await erc20BalanceOf(lpToken, account);
        const unstaked = ethers.utils.formatUnits(unstakedBal);
        // setUnstakedBal(unstaked.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        setUnstakedBal(unstaked);

        return [staked, unstaked];
      } catch (err) {
        console.warn(err);
      }
    }
  };

  /**
   * Fetches connected user pending soul
   */
  const fetchPending = async () => {
    if (!account) {
      console.log("connect wallet");
    } else {
      try {
        const pending = await pendingSoul(0, account);
        const formatted = ethers.utils.formatUnits(pending.toString());
        setPending(
          Number(formatted)
            .toFixed(1)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
      } catch (err) {
        console.warn(err);
      }
    }
  };

  /**
   * Checks if the user has approved SoulSummoner to move lpTokens
   */
  const fetchApproval = async () => {
    if (!account) {
      console.log("connect wallet");
    } else {
      // Checks if SoulSummoner can move tokens
      const amount = await erc20Allowance(
        lpToken,
        account,
        SOUL_SUMMONER_ADDRESS[chainId]
      );
      if (amount > 0) setApproved(true);
      return amount;
    }
  };

  /**
   * Approves SoulSummoner to move lpTokens
   */
  const handleApprove = async () => {
    if (!account) {
      console.log("connect wallet");
    } else {
      try {
        const tx = await erc20Approve(lpToken, SOUL_SUMMONER_ADDRESS[chainId]);
      } catch (e) {
        alert(e.message);
        console.log(e);
        return;
      }
    }
  };

  /**
   * Harvests rewards from SoulSummoner farm
   */
  const handleHarvest = async () => {
    try {
      const tx = await leaveStaking(0);
    } catch (e) {
      alert(e.message);
      console.log(e);
    }
  };

  /**
   * Withdraws staked lpTokens from SoulSummoner farm
   */
  const handleWithdraw = async (amount) => {
    try {
      const tx = await leaveStaking(amount);
      await fetchBals(pid);
    } catch (e) {
      alert(e.message);
      console.log(e);
    }
  };

  /**
   * Deposits/stakes lpTokens into SoulSummoner farm
   */
  const handleDeposit = async (amount) => {
    try {
      const tx = await enterStaking(amount);
      await fetchBals(pid);
    } catch (e) {
      alert(e.message);
      console.log(e);
    }
  };

  return (
    <>
      <Wrap padding="0" display="flex" justifyContent="center">
        <FarmContainer>
          <Row onClick={() => handleShow()}>
            <FarmContentWrapper>
              <TokenPairBox>
                {/* 2 token logo combined ? */}
                <Wrap>
                  <TokenPair
                    fontSize="1.2rem"
                    target="_blank"
                    href={`https://app.soulswap.finance/add/${farm.token1Address[chainId]}/${farm.token2Address[chainId]}`}
                  >
                    {lpSymbol}
                  </TokenPair>
                </Wrap>
              </TokenPairBox>

              <FarmItemBox>
                <FarmItem>
                  {apr ? (apr === "Infinity" ? "∞%" : apr + "%") : "?"}
                </FarmItem>
              </FarmItemBox>

              <FarmItemBox desktopOnly={true}>
                {pending === "0.0" ? (
                  <Text padding="0" fontSize="1.5rem" color="#666">
                    0
                  </Text>
                ) : (
                  <Text padding="0" fontSize="1.5rem">
                    {pending}
                  </Text>
                )}
              </FarmItemBox>

              <HideOnMobile desktopOnly={true}>
                {yearlySoulRewards === 0 ? (
                  <Text padding="0" fontSize="1.5rem" color="#666">
                    {yearlySoulRewards}
                  </Text>
                ) : (
                  <Text padding="0" fontSize="1.5rem">
                    {yearlySoulRewards}
                  </Text>
                )}
              </HideOnMobile>

              <HideOnMobile desktopOnly={true}>
                {percOfFarm === 0 ? (
                  <Text padding="0" fontSize="1.5rem" color="#666">
                    {percOfFarm}%
                  </Text>
                ) : (
                  <Text padding="0" fontSize="1.5rem">
                    {percOfFarm}%
                  </Text>
                )}
              </HideOnMobile>

              <HideOnMobile>
                {liquidity === "0" ? (
                  <Text padding="0" fontSize="1.5rem" color="#666">
                    $0
                  </Text>
                ) : (
                  <Text padding="0" fontSize="1.5rem">
                    ${liquidity}
                  </Text>
                )}
              </HideOnMobile>

              {/* <FarmItemBox>
                <ShowBtn onClick={() => handleShow()}>{showing ? `HIDE` : `SHOW`}</ShowBtn>
              </FarmItemBox> */}
            </FarmContentWrapper>
          </Row>
        </FarmContainer>
      </Wrap>

      {showing ? (
        <Wrap padding="0" display="flex" justifyContent="center">
          <DetailsContainer>
            <DetailsWrapper>
              <FunctionBox>
                {/* <button >Max</button> */}
                <Wrap padding="0" display="flex" justifyContent="space-between">
                  <Text padding="0" fontSize=".9rem" color="#bbb">
                    Available: {Number(unstakedBal).toFixed(3)}
                  </Text>
                  <ClickableText
                    padding="0"
                    fontSize=".9rem"
                    color="#aaa"
                    onClick={() =>
                      (document.getElementById("stake").value = unstakedBal)
                    }
                  >
                    MAX
                  </ClickableText>
                </Wrap>
                <Input
                  name="stake"
                  id="stake"
                  type="number"
                  placeholder="0.0"
                  min="0"
                />
                <Wrap padding="0" margin="0" display="flex">
                  {approved ? (
                    <SubmitButton
                      height="2.5rem"
                      onClick={() =>
                        handleDeposit(
                          ethers.utils.parseUnits(
                            document.getElementById("stake").value
                          )
                        )
                      }
                    >
                      Stake
                    </SubmitButton>
                  ) : (
                    <SubmitButton
                      height="2.5rem"
                      onClick={() => handleApprove()}
                    >
                      Approve Stake
                    </SubmitButton>
                  )}
                </Wrap>
              </FunctionBox>

              <FunctionBox>
                <FlexText>
                  <Text padding="0" fontSize=".9rem" color="#bbb">
                    Staked: {Number(stakedBal).toFixed(3)}
                  </Text>
                  <ClickableText
                    padding="0"
                    fontSize=".9rem"
                    color="#aaa"
                    onClick={() =>
                      (document.getElementById("unstake").value = stakedBal)
                    }
                  >
                    MAX
                  </ClickableText>
                </FlexText>
                <Input
                  name="unstake"
                  id="unstake"
                  type="number"
                  placeholder="0.0"
                  min="0"
                />

                <Wrap padding="0" margin="0" display="flex">
                  <SubmitButton
                    height="2.5rem"
                    padding="0"
                    margin=".5rem .6rem .5rem 0"
                    onClick={() => handleHarvest()}
                  >
                    Harvest
                  </SubmitButton>
                  <SubmitButton
                    height="2.5rem"
                    primaryColour="#bbb"
                    color="black"
                    margin=".5rem 0 .5rem .6rem"
                    onClick={() =>
                      handleWithdraw(
                        ethers.utils.parseUnits(
                          document.getElementById("unstake").value
                        )
                      )
                    }
                  >
                    Unstake
                  </SubmitButton>
                </Wrap>
                <Wrap padding="0" margin="0">
                  <Text padding="0 0 0 19.5rem" fontSize="0.8rem" color="#bbb">
                    Must hold 1 SEANCE to unstake 1 SOUL
                  </Text>
                </Wrap>
              </FunctionBox>
            </DetailsWrapper>
          </DetailsContainer>
        </Wrap>
      ) : null}
    </>
  );
};

export default StakeRow;
