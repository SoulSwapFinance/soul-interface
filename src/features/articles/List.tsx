import React, { useEffect, useState } from 'react'
import { ChainId } from 'sdk'
// import PostKey from './Key'
import AutostakeRowRender from './Row'
import { Posts } from './Posts'
import { useActiveWeb3React } from 'services/web3'

const PostList = () => {
  const { chainId } = useActiveWeb3React() // account

  const postList = Posts.map((pool) => (
    <AutostakeRowRender
      key={pool.pid}
      pid={pool.pid}
      stakeToken={pool.lpAddress}
      pool={pool}
    />
  ))
  
  return (
    <>
      {/* <BondHeader/> */}
      {/* <PostKey /> */}
      <>{postList}</>
    </>
  )
}

export default PostList
