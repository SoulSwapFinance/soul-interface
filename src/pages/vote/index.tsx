import DoubleGlowShadowV2 from '../../components/DoubleGlowShadowV2'
import Container from '../../components/Container'

const Vote = () => {
	return (
    <DoubleGlowShadowV2 opacity="0.6">
        <Container id="charts-page" maxWidth="2xl" className="space-y-4">
          <div className="p-4 space-y-4 rounded bg-dark-900" style={{ zIndex: 1 }}>
            <iframe 
              frameBorder={"none"}
              title={"VOTE"}
              src="https://enchant.soulswap.finance"
              height={ '720' }
              width={"100%"}
            />
	        </div>
        </Container>
      </DoubleGlowShadowV2>

)}

export default Vote