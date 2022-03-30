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
import { useUserInfo } from "hooks/useAPI";
import { useActiveWeb3React } from "hooks/useActiveWeb3React";
import { useLuxorPrice } from "hooks/getPrices";
import { Button } from "components/Button";
import { formatCurrency } from "modals/TokensStatsModal";
import NavLink from "components/NavLink";

export default function Calculator() {
  const { account, chainId } = useActiveWeb3React()

    // const [lumensAmount, setLumensAmount] = useState(trimmedLumensBalance);
    // const [rewardYield, setRewardYield] = useState(trimmedStakingAPY);
    // const [priceAtPurchase, setPriceAtPurchase] = useState(trimMarketPrice);
    // const [futureMarketPrice, setFutureMarketPrice] = useState(trimMarketPrice);
    
    const luxorPrice = useLuxorPrice()
    const trimmedMarketPrice = Number(luxorPrice).toFixed(6);

    const { userInfo } = useUserInfo(account, LUM_ADDRESS[250])
    const lumensBalance = Number(userInfo.balance) / 1e9
    const trimmedLumensBalance = Number(lumensBalance).toString(6);
    const stakingAPY = 100
    const trimmedStakingAPY = Number(stakingAPY).toString(4)

    const [lumensAmount, setLumensAmount] = useState(trimmedLumensBalance);
    // const [stakingAPY, setStakingApy] = useState('100');
    const [rewardYield, setRewardYield] = useState(trimmedStakingAPY);
    const [priceAtPurchase, setPriceAtPurchase] = useState(trimmedMarketPrice);
    const [futureMarketPrice, setFutureMarketPrice] = useState(trimmedMarketPrice);
    const [days, setDays] = useState('15');

    const [rewardsEstimation, setRewardsEstimation] = useState('0');
    const [potentialReturn, setPotentialReturn] = useState('0');


    const calcInitialInvestment = () => {
        const lumens = Number(lumensAmount) || 0;
        const price = parseFloat(priceAtPurchase.toString()) || 0;
        const amount = lumens * Number(price);
        return formatNumber(amount, false, true, 2);
    };

    const calcCurrentWealth = () => {
        const lumens = Number(lumensAmount) || 0;
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
        setRewardsEstimation(Number(newBalance).toFixed(6));
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
    padding: 20px;
    width: 100%;
    `;

    const DataRowValue = styled.p`
        font-family: Montserrat;
        font-size: 14px;
        line-height: 17px;
        color: #FFFFFF;
      `;
    
      const ActionAreaInputWrapTitle = styled.p`
        font-family: Montserrat Medium;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        color: #FFFFFF;
        margin-bottom: 5px;
        margin-left: 10px;
      `;

    return (
        <div className="w-[89%] max-[w-833px] m-auto">
            {/* <Zoom in={true}> */}
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
                  <div className="mt-2 mb-2">
                  <Button variant="filled" color="yellow" size="lg">
                    <NavLink href={'/swap?inputCurrency=&outputCurrency=0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b'}>
                      <a className="block text-md md:text-xl text-black text-bold p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
                      <span>Lumens Balance: {formatNumber(lumensBalance, false, true)} LUM</span>
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
                        <div>
                            <div className="calculator-card-action-area">
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <div className="calculator-card-action-area-inp-wrap text-center">
                                            <ActionAreaInputWrapTitle>Amount (LUM)</ActionAreaInputWrapTitle>
                                            <OutlinedInput
                                                type="number"
                                                placeholder="Amount"
                                                className="bg-grey border border-3 border-yellow hover:border-yellow"
                                                value={lumensAmount}
                                                onChange={e => setLumensAmount(e.target.value)}
                                                labelWidth={0}
                                                endAdornment={
                                                  <InputAdornment position="end">
                                                      <div 
                                                        onClick={() => setLumensAmount(Number(trimmedLumensBalance).toFixed(2))} 
                                                        className="stake-card-action-input-btn">
                                                          <p>Max</p>
                                                      </div>
                                                  </InputAdornment>
                                                }
                                            />
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <div className="calculator-card-action-area-inp-wrap text-center">
                                            <ActionAreaInputWrapTitle>APY (%)</ActionAreaInputWrapTitle>
                                            <OutlinedInput
                                                type="number"
                                                placeholder="Amount"
                                                className="bg-grey border border-3 border-yellow hover:border-yellow"
                                                value={rewardYield}
                                                onChange={e => setRewardYield(e.target.value)}
                                                labelWidth={0}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <div 
                                                          onClick={() => setRewardYield(Number(trimmedStakingAPY).toFixed(2))} 
                                                          className="stake-card-action-input-btn">
                                                            <p>Current</p>
                                                        </div>
                                                    </InputAdornment>
                                                }
                                            />
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <div className="calculator-card-action-area-inp-wrap text-center">
                                            <ActionAreaInputWrapTitle>Purchase Price ($)</ActionAreaInputWrapTitle>
                                            <OutlinedInput
                                                type="number"
                                                placeholder="Amount"
                                                className="bg-grey border border-3 border-yellow hover:border-yellow"
                                                value={priceAtPurchase}
                                                onChange={e => setPriceAtPurchase(e.target.value)}
                                                labelWidth={0}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        {<div 
                                                        onClick={() => setPriceAtPurchase(Number(trimmedMarketPrice).toFixed(2))} 
                                                        className="stake-card-action-input-btn">
                                                            <p>Current</p>
                                                        </div> }
                                                    </InputAdornment>
                                                }
                                            />
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <div className="calculator-card-action-area-inp-wrap text-center">
                                            <ActionAreaInputWrapTitle>Future Price ($)</ActionAreaInputWrapTitle>
                                            <OutlinedInput
                                                type="number"
                                                placeholder="Amount"
                                                className="bg-grey border border-3 border-yellow hover:border-yellow"
                                                value={futureMarketPrice}
                                                onChange={e => setFutureMarketPrice(e.target.value)}
                                                labelWidth={0}
                                                endAdornment={
                                                  <InputAdornment position="end">
                                                      <div onClick={() => setFutureMarketPrice(Number(trimmedMarketPrice).toFixed(2))} 
                                                        className="stake-card-action-input-btn">
                                                          <p>Current</p>
                                                      </div>
                                                  </InputAdornment>
                                                }
                                            />
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                            <div className="calculator-days-slider-wrap mt-4 mb-4">
                                {/* <Slider className="calculator-days-slider" min={1} max={365} value={Number(days)} onChange={(e, newValue: any) => setDays(newValue)} /> */}
                                {['15', '30', '60', '90', '120', '150', '180', '365'].map((multipler, i) => (
                                  <Button
                                    variant="outlined"
                                    size="xs"
                                    color="yellow"
                                    key={i}
                                    onClick={() => {
                                      setDays(multipler)
                                    }}
                                    className="mr-0.5 sm:mr-4 text-md focus:ring-purple"
                                  >
                                    {multipler}
                                  </Button>
                                ))}
                              </div>
                            </div>
                            <div className="flex mt-4 mb-4">
                            <div className="calculator-user-data">
                                <div className="data-row">
                                    <p className="data-row-name">Staked Days</p>
                                      <DataRowValue>
                                      <p className="calculator-days-slider-wrap-title">{`${days} Day${Number(days) >= 1 ? "s" : ""}`}</p>
                                      </DataRowValue>
                                </div>
                                <div className="data-row">
                                    <p className="data-row-name">Initial Investment</p>
                                      <DataRowValue>
                                        {initialInvestment}
                                      </DataRowValue>
                                </div>
                                <div className="data-row">
                                    <p className="data-row-name">Current Wealth</p>
                                    <DataRowValue>
                                      ${calcCurrentWealth()}
                                    </DataRowValue>
                                </div>
                                <div className="data-row">
                                    <p className="data-row-name">LUX Rewards</p>
                                    <DataRowValue>
                                      {rewardsEstimation} LUX
                                    </DataRowValue>
                                </div>
                                <div className="data-row">
                                <p className="data-row-name">Return (ROI)</p>
                                    <DataRowValue>
                                      {potentialReturn}
                                    </DataRowValue>
                                </div>
                                <div className="data-row">
                                    <p className="data-row-name">Lambos</p>
                                    <DataRowValue>
                                      {Math.floor(Number(potentialReturn) / 220000)}
                                    </DataRowValue>
                                </div>
                            </div>
                        </div>
                    </div>
                  </CalculatorCard>
            {/* </Zoom> */}
        </div>
    );
}
