import React, { useEffect, useState } from "react";
// import "./calculator.scss";
// import { useSelector, useDispatch } from "react-redux";
import { Grid, InputAdornment, OutlinedInput, Zoom, Slider } from "@material-ui/core";
// import { IReduxState } from "../../store/slices/state.interface";
// import { trim } from "../../helpers";
// import { Skeleton } from "@material-ui/lab";
import { formatNumber } from "functions";
import styled from 'styled-components'
import { LUM_ADDRESS } from "sdk";
import { useLuxorInfo, useLuxorUserInfo, useUserInfo } from "hooks/useAPI";
import { useActiveWeb3React } from "hooks/useActiveWeb3React";
import { useLuxorPrice, useWrappedBtcPrice } from "hooks/getPrices";
import { Button } from "components/Button";
import { formatCurrency } from "modals/TokensStatsModal";
import NavLink from "components/NavLink";
import { useTokenContract } from "hooks/useTokenContract";
import { useLumensContract } from "hooks/useContract";

export default function Calculator() {
  const { account, chainId } = useActiveWeb3React()
    const luxorPrice = useLuxorPrice()
    const btcPrice = useWrappedBtcPrice()
    const trimmedMarketPrice = Number(luxorPrice).toFixed(6);

    const { userInfo } = useUserInfo(account, LUM_ADDRESS[250])
    const { luxorUserInfo } = useLuxorUserInfo(account)
    const circulatingLumens = useLuxorInfo().luxorInfo.circulatingLumens
    const lumensBalance = Number(userInfo.balance) / 1e9
    const trimmedLumensBalance = Number(lumensBalance).toFixed(6);
    const stakingReward = luxorUserInfo.distribute;
    const stakingRebase = Number(stakingReward) / Number(circulatingLumens);
    const stakingAPY = (Math.pow(1 + stakingRebase, 365 * 3) - 1) * 100
    const trimmedStakingAPY = Number(stakingAPY).toFixed(4)

    const [lumensAmount, setLumensAmount] = useState(trimmedLumensBalance);
    const [rewardYield, setRewardYield] = useState(trimmedStakingAPY);
    const [priceAtPurchase, setPriceAtPurchase] = useState(trimmedMarketPrice);
    const [futureMarketPrice, setFutureMarketPrice] = useState(trimmedMarketPrice);
    const [days, setDays] = useState('30');

    const [rewardsEstimation, setRewardsEstimation] = useState('0');
    const [potentialReturn, setPotentialReturn] = useState('0');

    const calcInitialInvestment = () => {
        const lumens = Number(lumensAmount) || Number(trimmedLumensBalance);
        const price = parseFloat(priceAtPurchase.toString()) || Number(trimmedMarketPrice);
        const amount = lumens * Number(price);
        return formatNumber(amount, false, true, 2);
    };

    const calcCurrentWealth = () => {
        const lumens = Number(lumensAmount) || Number(trimmedLumensBalance);
        const price = parseFloat(trimmedMarketPrice.toString());
        const amount = lumens * price;
        return formatNumber(amount, false, false, 2);
    };

    const [initialInvestment, setInitialInvestment] = useState(calcInitialInvestment());

    useEffect(() => {
        const newInitialInvestment = calcInitialInvestment();
        setInitialInvestment(newInitialInvestment);
    }, [lumensAmount, priceAtPurchase]);

    const calcNewBalance = () => {
        let value = parseFloat(rewardYield.toString()) / 100;
        value = Math.pow(value - 1, 1 / (365 * 3)) - 1 || 0;
        let balance = Number(lumensAmount);
        for (let i = 0; i < Number(days) * 3; i++) {
            balance += balance * value;
        }
        return balance;
    };

    useEffect(() => {
        const newBalance = calcNewBalance();
        setRewardsEstimation(Number(newBalance).toFixed(2));
        const newPotentialReturn = newBalance * (parseFloat(futureMarketPrice.toString()) || 0);
        setPotentialReturn(Number(newPotentialReturn).toFixed(2));
    }, [days, rewardYield, futureMarketPrice, lumensAmount]);


    // STYLE ///
    const CalculatorCard = styled.div`
      position: relative;
      z-index: 2;

      @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
          background: rgba(36, 39, 41, 0.1);
          backdrop-filter: blur(40px);
      }

      /* slightly transparent fallback for Firefox (not supporting backdrop-filter) */
      @supports not ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
          background: #181B1C;
      }

      border-radius: 10px;
      padding: 6px;
      width: 100%;
    `;
    
  const ActionAreaInputWrapTitle = styled.div`
    font-family: Montserrat Medium;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    color: #F5C600;
    margin-bottom: 5px;
    margin-left: 10px;
  `;

  const ActionAreaInputWrap = styled.div`
    width: 100%;
    background: rgba(255, 255, 255, 0.2);
    border: 4px solid rgba(255, 243, 0, 0.2);
    border-radius: 10px;
    outline: none;
  `;

  const ActionInputButton = styled.div`
    cursor: pointer;
    p{
      font-family: Montserrat SemiBold;
      font-weight: 600;
      font-size: 16px;
      color: #494949;
      // color: #5C5C5C;
    }
  `;

  const CalculatorUserData = styled.div`
    justify-content: center;
    margin: auto;
    padding: 0 5px;
    margin-top: 30px;
  `;

  const DataRow = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 4px 0px;
  `;
  
  const DataRowName = styled.p`
      font-family: Montserrat Medium;
      font-style: normal;
      font-weight: 500;
      font-size: 20px;
      color: #FFFFFF;
  `;
  
  const DataRowValue = styled.p`
      font-family: Montserrat;
      font-size: 20px;
      line-height: 32px;
      color: #FFFFFF;
  }`;

    return (
        <div className="w-[95%] max-w-[1200px] mt-2 lg:mt-4 m-auto">
                <CalculatorCard>
                  <div className="mt-2 mb-2">
                  <Button variant="filled" color="yellow" size="lg">
                    <NavLink href={'/swap?inputCurrency=&outputCurrency=0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b'}>
                      <a className="block text-md md:text-xl text-black text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                      <span>Market Price: ${Number(luxorPrice).toFixed(2)}</span>
                      </a>
                    </NavLink>
                  </Button>
                  </div>
                  <div className="flex ml-2 mr-2 mb-4 gap-1 items-center justify-center">
                  <Button variant="filled" color="yellow" size="lg">
                    <NavLink href={'/luxor/dashboard'}>
                      <a className="block text-md md:text-xl text-black text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                      <span> Data </span>
                      </a>
                    </NavLink>
                  </Button>
                  <Button variant="filled" color="yellow" size="lg">
                    <NavLink href={'/luxor/bonds'}>
                      <a className="block text-md md:text-xl text-black text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                      <span> Bonds </span>
                      </a>
                    </NavLink>
                  </Button>
                  <Button variant="filled" color="yellow" size="lg">
                    <NavLink href={'/luxor/wrap'}>
                      <a className="block text-md md:text-xl text-black text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                      <span> Wrap </span>
                      </a>
                    </NavLink>
                  </Button>
                  <Button variant="filled" color="yellow" size="lg">
                    <NavLink href={'/luxor/stake'}>
                      <a className="block text-md md:text-xl text-black text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                      <span> Stake </span>
                      </a>
                    </NavLink>
                  </Button>
                </div>
              </CalculatorCard>
              <CalculatorCard>
                <div className="calculator-card-area">
                      <div className="mt-[12px]">
                          <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <ActionAreaInputWrapTitle className="text-center">Lumens Amount</ActionAreaInputWrapTitle>
                                  <ActionAreaInputWrap>
                                      <OutlinedInput
                                          type="number"
                                          placeholder="Amount"
                                          className="bg-darkGrey w-full hover:bg-grey border border-3 border-yellow hover:border-yellow"
                                          value={lumensAmount}
                                          onChange={e => setLumensAmount(e.target.value)}
                                          labelWidth={0}
                                          endAdornment={
                                            <InputAdornment position="end">
                                                <ActionInputButton 
                                                  onClick={() => setLumensAmount(Number(trimmedLumensBalance).toFixed(2))} >
                                                    <p>MAX</p>
                                                </ActionInputButton>
                                            </InputAdornment>
                                          }
                                      />
                                </ActionAreaInputWrap>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                  <ActionAreaInputWrapTitle className="text-center">Annual (%) Yield</ActionAreaInputWrapTitle>
                                    <ActionAreaInputWrap>
                                        <OutlinedInput
                                            type="number"
                                            placeholder="Amount"
                                            className="bg-darkGrey w-full hover:bg-grey border border-3 border-yellow hover:border-yellow"
                                            value={rewardYield}
                                            onChange={e => setRewardYield(e.target.value)}
                                            labelWidth={0}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <ActionInputButton 
                                                      onClick={() => setRewardYield(Number(trimmedStakingAPY).toFixed(2))}>
                                                        <p>CURRENT</p>
                                                    </ActionInputButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </ActionAreaInputWrap>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                  <ActionAreaInputWrapTitle className="text-center">Purchase ($) Price</ActionAreaInputWrapTitle>
                                    <ActionAreaInputWrap>
                                        <OutlinedInput
                                            type="number"
                                            placeholder="Amount"
                                            className="bg-darkGrey w-full hover:bg-grey border border-3 border-yellow hover:border-yellow"
                                            value={priceAtPurchase}
                                            onChange={e => setPriceAtPurchase(e.target.value)}
                                            labelWidth={0}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <ActionInputButton 
                                                    onClick={() => setPriceAtPurchase(Number(trimmedMarketPrice).toFixed(2))} 
                                                    className="stake-card-action-input-btn text-sm">
                                                        <p>CURRENT</p>
                                                    </ActionInputButton>
                                                </InputAdornment>
                                            }
                                        />
                                  </ActionAreaInputWrap>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <ActionAreaInputWrapTitle className="text-center">Future ($) Price</ActionAreaInputWrapTitle>
                                  <ActionAreaInputWrap>
                                      <OutlinedInput
                                          type="number"
                                          placeholder="Amount"
                                          className="bg-darkGrey w-full hover:bg-grey border border-3 border-yellow hover:border-yellow"
                                          value={futureMarketPrice}
                                          onChange={e => setFutureMarketPrice(e.target.value)}
                                          labelWidth={0}
                                          endAdornment={
                                            <InputAdornment position="end">
                                                <ActionInputButton onClick={() => setFutureMarketPrice(Number(trimmedMarketPrice).toFixed(2))} 
                                                  className="stake-card-action-input-btn text-sm"
                                                  >
                                                    <p>CURRENT</p>
                                                </ActionInputButton>
                                            </InputAdornment>
                                          }
                                      />
                                </ActionAreaInputWrap>
                              </Grid>
                          </Grid>
                      </div>
                      </div>
                      <CalculatorUserData>
                      <div className="grid p-6 lg:p-16 w-full grid-cols-1 mt-4 mb-4 bg-dark-1200 border border-1 border-yellow hover:border-gold">
                      <div className="mb-4 text-center">
                          {/* <Slider className="calculator-days-slider" min={1} max={365} value={Number(days)} onChange={(e, newValue: any) => setDays(newValue)} /> */}
                          {['30', '90', '180', '365'].map((multipler, i) => (
                            <Button
                              variant="outlined"
                              size="xs"
                              color="yellow"
                              key={i}
                              onClick={() => {
                                setDays(multipler)
                              }}
                              className="mr-0.5 sm:mr-4 text-md border border-yellow hover:border-gold focus:ring-yellow"
                            >
                              {multipler} DAYS
                            </Button>
                          ))}
                        </div>
                          <DataRow>
                              <DataRowName>Days Staked</DataRowName>
                                <DataRowValue>
                                <p className="calculator-days-slider-wrap-title">{`${days} Day${Number(days) >= 1 ? "s" : ""}`}</p>
                                </DataRowValue>
                          </DataRow>
                          <DataRow>
                              <DataRowName>Initial Investment</DataRowName>
                              {/* <div> */}
                                <DataRowValue>
                                  ${initialInvestment}
                                </DataRowValue>
                              {/* </div> */}
                          </DataRow>
                          <DataRow>
                              <DataRowName>Current Wealth</DataRowName>
                              <DataRowValue>
                                ${calcCurrentWealth()}
                              </DataRowValue>
                          </DataRow>
                          <DataRow>
                              <DataRowName>Total Rewards</DataRowName>
                              <DataRowValue>
                                {formatNumber(rewardsEstimation)} LUX
                              </DataRowValue>
                          </DataRow>
                          <DataRow>
                          <DataRowName>Realized Return</DataRowName>
                              <DataRowValue>
                                {formatCurrency(Number(potentialReturn), 2)}
                              </DataRowValue>
                          </DataRow>
                          <DataRow>
                              <DataRowName>Yellow Lambos</DataRowName>
                              <DataRowValue>
                                {Math.floor(Number(potentialReturn) / 220000)}
                              </DataRowValue>
                          </DataRow>
                          <DataRow>
                              <DataRowName>Orange Bitcoins</DataRowName>
                              <DataRowValue>
                                {Math.floor(Number(potentialReturn) / btcPrice)}
                              </DataRowValue>
                          </DataRow>
                    </div>
                      </CalculatorUserData>
              </CalculatorCard>
            </div>
    );
}
