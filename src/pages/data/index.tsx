import React, { useMemo, useRef, useState } from 'react'
import Container from 'components/Container'
import Typography from 'components/Typography'
import { useTokenInfo, useTotalSupply, useUnderworldPairInfo, } from 'hooks/useAPI'
import { useUnderworldPairAPI } from 'hooks/useUnderworldAPI'
import { useWeb3React } from '@web3-react/core'
import { formatNumber, formatPercent } from 'functions/format'
import { ChainId, SOUL_ADDRESS, UNDERWORLD_PAIRS } from 'sdk'
// import { getPrice } from 'hooks/useParaswap'
import styled from 'styled-components'
import { Button } from 'components/Button'
import { getChainColorCode } from 'constants/chains'
// import { useTokenBalances } from 'services/api/hooks'
// import { ChainId } from 'sdk'
// import capitalize from 'lodash/capitalize'
// import { Column } from 'components/Column'
// import { Columns } from 'react-feather'
// import Table from '@mui/material/Table';
// import { TableHead, TableRow } from '@material-ui/core'
import DataTable from 'components/DataTable'
import { Columns, createData } from 'features/data/Columns'

export default function Data() {
  const { chainId, account } = useWeb3React()
  // const { tokenInfo } = useTokenInfo(SOUL_ADDRESS[ChainId.FANTOM])
  const addresses = UNDERWORLD_PAIRS[chainId || 250]
  const name = (i) => useUnderworldPairAPI(addresses[i])[0]
  const symbol = (i) => useUnderworldPairAPI(addresses[i])[1]
  const decimals = (i) => useUnderworldPairAPI(addresses[i])[2]
  const asset = (i) => useUnderworldPairAPI(addresses[i])[3]
  const collateral = (i) => useUnderworldPairAPI(addresses[i])[4]

  const price = (i) => Number(useUnderworldPairAPI(addresses[i])[5] / 1E18)
  const utilization = (i) => formatPercent(useUnderworldPairAPI(addresses[i])[6] * 100 / 1E18)
  const supplyAPR = (i) => formatPercent(useUnderworldPairAPI(addresses[i])[7] * 100 / 1E18)
  const borrowAPR = (i) => formatPercent(useUnderworldPairAPI(addresses[i])[8] * 100 / 1E18)
  const aElastic = (i) => formatNumber(useUnderworldPairAPI(addresses[i])[9])
  // const aBase = (i) => formatNumber(useUnderworldPairAPI(addresses[i])[10])
  const bElastic = (i) => formatNumber(useUnderworldPairAPI(addresses[i])[11])
  // const bBase = (i) => formatNumber(useUnderworldPairAPI(addresses[i])[12])

  const rows = [
      createData(asset(0), formatNumber(price(0), true, true), utilization(0), supplyAPR(0), borrowAPR(0), aElastic(0), bElastic(0)),
      createData(asset(1), formatNumber(price(1), true, true), utilization(1), supplyAPR(1), borrowAPR(1), aElastic(1), bElastic(1)),
      createData(asset(2), formatNumber(price(2) / 1E10, true, true), utilization(2), supplyAPR(2), borrowAPR(2), aElastic(2), bElastic(2)),
      // createData(asset(3), price(3), utilization(3), supplyAPR(3), borrowAPR(3), aElastic(0), bElastic(0)),
      // createData(asset(4), price(4), utilization(4), supplyAPR(4), borrowAPR(4), aElastic(0), bElastic(0)),
      createData(asset(5), formatNumber(price(5), true, true), utilization(5), supplyAPR(5), borrowAPR(5), aElastic(5), bElastic(5)),
      // createData(asset(6), price(6), utilization(6), supplyAPR(6), borrowAPR(6), aElastic(0), bElastic(0)),
    ];

  // const [asset, setAsset] = useState(a0)
  // console.log('asset:%s', asset)
  return (
    <Container id="chains-page" className="py-4 space-y-6 md:py-8 lg:py-12" maxWidth="6xl">
      <div className="w-full max-w-6xl mx-auto">
        <Typography component="h1" variant="h1" className="w-full text-center mb-4">
          Underworld Assets Details (Stable Pairs)
        </Typography>

        {/* <Typography component="h3" variant="h3" className="w-full text-center mb-4">
          <div className="grid gap-3 grid-row-2 m-3 mt-6 bg-dark-900 p-2 rounded">
            <label>Choose Underworld Asset </label>
          </div>
        </Typography> */}

        {/* <div className="grid ml-2 mr-2 grid-cols gap-2">

          <Button variant="filled" className="font-bold" color={getChainColorCode(chainId)} onClick={() => setAddress(a0)}>
            {name} {aElastic} {aBase}
          </Button>

          <Button variant="filled" className="font-bold" color={getChainColorCode(chainId)} onClick={() => setAddress(a1)}>
            {t1}
          </Button>

          <Button variant="filled" className="font-bold" color={getChainColorCode(chainId)} onClick={() => setAddress(a2)}>
            {t2}
          </Button>

          <Button variant="filled" className="font-bold" color={getChainColorCode(chainId)} onClick={() => setAddress(a3)}>
            {t3}
          </Button>
        </div> */}
      </div>
      

      <DataTable rows={rows} columns={Columns}/>
      

{/* 
      <TableHead>
        <TableRow />
        <TableRow />
    </TableHead> */}
      {/* <div className="flex flex-cols-4 ml-2 mr-2 justify-center gap-6">
        <div className="grid grid-cols gap-4">
          <Typography className="font-bold text-sm sm:text-md">
            {t0} Market
          </Typography>
          <Typography className="text-sm sm:text-md">
            {b0} Borrowed
          </Typography>
          <Typography className="text-sm sm:text-md">
            {s0} Supply
          </Typography>
        </div>
        <div className="grid grid-cols gap-4">
          <Typography className="font-bold text-sm sm:text-md">
            {t1} Market
          </Typography>
          <Typography className="text-sm sm:text-md">
            {b1} Borrowed
          </Typography>
          <Typography className="text-sm sm:text-md">
            {s1} Supply
          </Typography>
        </div>
        <div className="grid grid-cols gap-4">
          <Typography className="font-bold text-sm sm:text-md">
            {t2} Market
          </Typography>
          <Typography className="text-sm sm:text-md">
            {b2} Borrowed
          </Typography>
          <Typography className="text-sm sm:text-md">
            {s2} Supply
          </Typography>
        </div>
        <div className="grid grid-cols gap-4">
          <Typography className="font-bold text-sm sm:text-md">
            {t3} Market
          </Typography>
          <Typography className="text-sm sm:text-md">
            {b3} Borrowed
          </Typography>
          <Typography className="text-sm sm:text-md">
            {s3} Supply
          </Typography>
        </div>
      </div> */}
    </Container>
  )
}
