import React from 'react'
import { useActiveWeb3React } from 'services/web3'
// import { NETWORK_ICON } from 'config/networks'
// import NetworkModel from 'modals/NetworkModal'
// import { useNetworkModalToggle } from 'state/application/hooks'
// import Image from 'next/image'

function SocialWidget(): JSX.Element | null {
  const { chainId } = useActiveWeb3React()
  // const toggleNetworkModal = useNetworkModalToggle()

  if (!chainId) return null

  return (
    // <div className="flex whitespace-wrap border">
    <iframe 
			frameBorder={"none"}
    		title={"Social"}
    		src="https://embedsocial.com/facebook_album/pro_hashtag/aaaf9d19c72e1539e820678f757585f213e96aa3"
    		// src="https://embedsocial.com/facebook_album/pro_hashtag/2793184d0463c350498fbe595265306b3f2666a4"
    		height={"100%"}
    		// width={"100%"}
    />
    // </div>
    // <div
    //   className="flex items-center rounded border-2 border-dark-800 hover:border-dark-700 bg-dark-1000 hover:bg-dark-900 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto"
    //   onClick={() => toggleNetworkModal()}
    // >
    //   <div className="grid items-center grid-flow-col items-center justify-center bg-dark-1000 h-[36px] w-[36px] text-sm rounded pointer-events-auto auto-cols-max text-secondary">
    //     <Image src={NETWORK_ICON[chainId]} alt="Switch Network" className="rounded-md" width="22px" height="22px" />
    //   </div>
    //   <NetworkModel />
    // </div>
  )
}

export default SocialWidget