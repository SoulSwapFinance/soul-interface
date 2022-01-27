import React, { useEffect, useState, useCallback } from 'react'
import { useActiveWeb3React } from 'services/web3'

import useAtomicSwap from './hooks/useAtomicSwap'
import { ZERO_ADDRESS, ATOMIC_SWAP_ADDRESS } from '../../constants/addresses'
import { TradeItem } from './TradeItem'
// import Banner from "../../illustrations/AtomicSwapBanner1.png";

import styled from 'styled-components'
import { Heading, Input, Text, Wrap, OptionSelector, Illustration, Button } from '../../components/ReusableStyles'

export const InfoSection = styled.div`
  border: 1px solid #444;
  border-radius: 8px;
  padding: 0.5rem;
  margin: 0 0.5rem;
  align-items: center;
  justify-content: center;
`

export const ListContainer = styled.div`
  z-index: 1;
  padding: 12px 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  grid-gap: 0 14px;

  justify-content: center;
  align-items: center;

  @media screen and (max-width: 3000px) {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  }

  @media screen and (max-width: 1440px) {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }

  @media screen and (max-width: 1200px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  @media screen and (max-width: 1125px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media screen and (max-width: 815px) {
    grid-template-columns: 1fr 1fr;
  }

  @media screen and (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

export const TradeItemList = () => {
  const { account, chainId } = useActiveWeb3React()

  const [loading, setLoading] = useState(true)
  const [renderFromId, setRenderFromId] = useState(0)

  const [trades, setTrades] = useState([])
  const [tradeList, setTradeList] = useState()
  // const [filteredTrades, setFilteredTrades] = useState([]);

  // const [isPubList, setIsPubList] = useState(true);

  const { viewTotalTrades, viewTrade } = useAtomicSwap()

  // Render trades on mount
  useEffect(() => {
    refresh()
  }, [])

  // -------------------------------
  //  Internals
  // -------------------------------

  // Modularized trade array addition
  const pushTrade = async (i) => {
    const trade = await viewTrade(i)

    if (!trade.inactive) {
      if (trade[2] === account || trade[3] === account || trade[3] === ZERO_ADDRESS) {
        setTrades([
          trades.push({
            id: i,
            user1Details: trade[0],
            user2Details: trade[1],
            user1: trade[2],
            user2: trade[3],
            inactive: trade[4],
            expiry: trade[5],
            totalOffers: trade[6],
          }),
        ])

        console.log('added:', i, 'newlength:', trades.length, 'trades', trades)
      }
    }
  }

  // Modularized component rendering
  const listTrades = async () => {
    // const toRender = trades.splice(0,1);
    // console.log('toRender', toRender)
    const toList = trades.map((trade) => (
      <TradeItem
        key={trade.id}
        tradeId={trade.id}
        user1Details={trade.user1Details}
        user2Details={trade.user2Details}
        creator={trade.user1}
        to={trade.user2}
        expiry={trade.expiry}
        totalOffers={trade.totalOffers}
        trade={trade}
      />
    ))

    setTradeList(toList)
  }

  // -------------------------------
  //  Core
  // -------------------------------

  // Gets the total trade ids
  const fetchTotalTrades = async () => {
    const allTrades = Number(await viewTotalTrades()) - 1
    setRenderFromId(allTrades)
  }

  // Loops + renders trades
  const logTrades = async () => {
    // console.log('startLength:', trades.length)
    setLoading(true)

    for (let i = renderFromId; i !== 0; i--) {
      setRenderFromId(i)

      // console.log('checking:', i)
      if (trades.length === 10) {
        // console.log('trades.length = render.')
        break
      }
      await pushTrade(i)
    }

    // console.log('endLength:', trades.length)

    await listTrades()

    setLoading(false)
  }

  // Load 10 more trades
  const loadMore = async (loadAmount) => {
    let newTrades = []

    for (let i = renderFromId; i !== 0; i--) {
      setRenderFromId(i)
      // console.log('checking:', i)

      // if current array + new array length == amount to display, stop loop
      if (newTrades.length === loadAmount) {
        // console.log('STOP - REACHED DISPLAY COUNT')
        return
      }

      // get trade stats
      const trade = await viewTrade(i)

      // dont render if trade inactive
      if (!trade.inactive) {
        // render only if...
        if (trade[2] === account || trade[3] === account || trade[3] === ZERO_ADDRESS) {
          // put trade stats into new array
          newTrades.push({
            id: i,
            user1Details: trade[0],
            user2Details: trade[1],
            user1: trade[2],
            user2: trade[3],
            inactive: trade[4],
            expiry: trade[5],
            totalOffers: trade[6],
          }),
            console.log(
              'added:',
              i,
              'total length:',
              newTrades.length + newTrades.length,
              'newTrades.length',
              newTrades.length,
              'trades',
              newTrades
            )
        }
      }
    }

    // list new array cards
    const toList = newTrades.map((trade) => (
      <TradeItem
        key={trade.id}
        tradeId={trade.id}
        user1Details={trade.user1Details}
        user2Details={trade.user2Details}
        creator={trade.user1}
        to={trade.user2}
        expiry={trade.expiry}
        totalOffers={trade.totalOffers}
        trade={trade}
      />
    ))

    console.log('loading from', renderFromId)

    // add new cards to existing cards
    setTradeList([...tradeList, toList])
  }

  const refresh = async () => {
    // reset states
    setTrades([])
    setTradeList()

    // log trades
    await fetchTotalTrades()
    await logTrades()
  }

  // -------------------------------
  //  Filters
  // -------------------------------

  // Only render `id`
  const filterById = async (id) => {
    if (undefined || null || '') return

    setLoading(true)

    const allTrades = await viewTotalTrades()

    if (allTrades >= id) {
      // setTimeout(() => {

      // }, 300);
      setTrades([])
      pushTrade(id)
      listTrades()
    }

    setLoading(false)
  }

  // Only render
  const handleFilter = async (filter) => {
    if (filter === 'public') {
      // render all trades
      // trades.filter((trade) => trade.to !== zeroAddress);
    } else if (filter === 'private') {
      // render pending trades for msg.sender
      // trades.filter((trade) => trade.to !== account);
    } else if (filter === 'created') {
      // render all of msg.sender's created trades
    }

    //   sort by new trades first
    //   const newTradesFirst = listing, (trade) => trade.id)
  }

  const check = async () => {
    console.log('trades', trades)
    console.log('tradesLength', trades.length)
  }

  return (
    // <>
    //   {network.chainId !== 4002 ? (
    //     <ConenctToView chains={'4002'}/>
    //   ) : (
    <>
      {/* <Wrap display="flex" justifyContent="center">
        <InfoSection>
        <Text color='#aaa'>Sort:</Text>
        <CheckBox>Decending</CheckBox>
      </InfoSection>
      </Wrap>
      <Wrap display="flex" justifyContent="center">
        <Button onClick={() => setIsPubList(!isPubList)}>
          Show {!isPubList ? `Public` : `Private`} Trades
        </Button>
      </Wrap> */}
      <>
        {/* <Wrap display="flex" justifyContent="center">
          <Illustration width="40rem" src={Banner} />
        </Wrap> */}
        <Wrap display="flex" justifyContent="center">
          {/* <Wrap>
            <Text fontSize=".8rem" padding="0 0 0 .25rem">
              Filter Id:
            </Text>
            <Input
              id="filter_id"
              disabled={false}
              width="5rem"
              placeholder="id..."
              type="number"
              onChange={() =>
                filterById(document.getElementById("filter_id").value)
              }
            />
          </Wrap> */}
          {/* <Wrap>
            <Text fontSize=".8rem" padding="0 0 0 .25rem">
              Filter By:
            </Text>
            <OptionSelector
              placeholder=""
              id="selectFilter"
              onChange={() =>
                handleFilter(document.getElementById("selectFilter").value)
              }
            >
              <option
                disabled
                selected
                value="public"
                style={{ display: "none" }}
              ></option>
              <option value="public">Public Only</option>
              <option value="private">Private Only</option>
              <option value="Pending">Pending Only</option>
              <option value="created">Created Only</option>
            </OptionSelector>
          </Wrap> */}
          <Button onClick={() => refresh()}>Refresh</Button>
        </Wrap>
        {loading ? (
          <Wrap display="flex" justifyContent="center">
            <Text margin="15rem 0" fontSize="2rem" color="white">
              Loading Trades...
            </Text>
          </Wrap>
        ) : (
          <>
            {/* <Wrap padding="0" display="flex">
              <Text>{trades}</Text>
              <Text>{trades.length}</Text>
            </Wrap>
            <Button onClick={() => check()}>Check</Button> */}
            {tradeList ? <ListContainer>{tradeList}</ListContainer> : null}
            {trades.length !== 0 && renderFromId !== 1 && !loading && (
              <>
                <Wrap padding="0 0 .5rem 0" display="flex" justifyContent="center">
                  <Text>Load More</Text>
                </Wrap>
                <Wrap padding="0" display="flex" justifyContent="center">
                  <Wrap padding="0 .5rem">
                    <Button width="2.5rem" onClick={() => loadMore(10)}>
                      10
                    </Button>
                  </Wrap>
                  <Wrap padding="0 .5rem">
                    <Button width="2.5rem" onClick={() => loadMore(25)}>
                      25
                    </Button>
                  </Wrap>
                  <Wrap padding="0 .5rem">
                    <Button width="2.5rem" onClick={() => loadMore(50)}>
                      50
                    </Button>
                  </Wrap>
                </Wrap>
              </>
            )}
          </>
        )}
      </>
    </>
    //   )}
    // </>
  )
}
