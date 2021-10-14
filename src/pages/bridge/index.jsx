// import Container from '../../components/Container'
import Head from 'next/head'
// import BridgeContainer from '../../features/bridge/BridgeContainer'

// function Bridge() {
//   return (
//     <>
//       <Container id="bridge-page">
//         <Head>
//           <title>Bridge | Soul</title>
//           <meta key="description" name="description" content="bridge tokens" />
//         </Head>

//         <BridgeContainer />
//       </Container>
//     </>
//   )
// }

// export default Bridge

import Container from "../../components/Container";

const Bridge = () => {
	return (
		// <Page title={"Bridge"} networkSensitive={false}> 
    <>
          <Container id="bridge-page">
        <Head>
           <title>Bridge | Soul</title>
           <meta key="description" name="description" content="bridge tokens" />
         </Head>
    <iframe 
        frameBorder={"none"}
    		title={"Bridge"}
    		src="https://bridge.soul.sh"
    		height={"720px"} 
    		width={"100%"} 
    />
       </Container>
       </>
);
};

export default Bridge;
