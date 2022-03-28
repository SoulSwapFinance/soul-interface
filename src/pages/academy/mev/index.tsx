import React from 'react'

const Flashbots = () => {
let screenHeight = screen.height
const frameHeight = `${screenHeight - 132}px`
console.log('screenHeight:%s', screenHeight)
const LINK = 'https://docs.flashbots.net'

return (
			<iframe 
				frameBorder={"none"}
				title={"Flashbots"}
				src={LINK}
				height={frameHeight}
				width={"100%"}
			/>	
	)
}

export default Flashbots;