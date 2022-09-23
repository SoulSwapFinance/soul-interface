import React from 'react'

const Telegraph = () => {
let screenHeight = screen.height
const frameHeight = `${screenHeight - 132}px`
// console.log('screenHeight:%s', screenHeight)
const LINK = 'https://cointelegraph.com'

return (
			<iframe 
				frameBorder={"none"}
				title={"Telegraph"}
				src={LINK}
				height={frameHeight}
				width={"100%"}
			/>
	)
}

export default Telegraph;