import React from 'react'

const Guide = () => {
let screenHeight = screen.height
const frameHeight = `${screenHeight - 132}px`
console.log('screenHeight:%s', screenHeight)
const LINK = 'https://devpill-me-pearl.vercel.app'

return (
			<iframe 
				frameBorder={"none"}
				title={"Guide"}
				src={LINK}
				height={frameHeight}
				width={"100%"}
			/>	
	)
}

export default Guide;