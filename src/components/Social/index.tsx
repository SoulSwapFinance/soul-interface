import React from 'react'
import { useActiveWeb3React } from 'services/web3'

function SocialWidget(): JSX.Element | null {
  const { chainId } = useActiveWeb3React()

  if (!chainId) return null

  return (
    <iframe 
			frameBorder={"none"}
    		title={"Social"}
    		src="https://embedsocial.com/facebook_album/pro_hashtag/aaaf9d19c72e1539e820678f757585f213e96aa3"
    		// height={ "164px" }
    		height={ "100%" }
    />
  )
}

export default SocialWidget