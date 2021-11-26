import DoubleGlowShadowV2 from '../../components/DoubleGlowShadowV2'
import Container from '../../components/Container'

const Claim = () => {
	return (
    <DoubleGlowShadowV2 opacity="0.6">
        <Container id="charts-page" maxWidth="2xl" className="space-y-4">
          <div className="p-4 space-y-4 rounded bg-dark-900" style={{ zIndex: 1 }}>
            <iframe 
			        frameBorder={"none"}
              src="https://docs.google.com/forms/d/1k5P9JoPgDD_3c6ykB6Oylv0gY0Ov8OAqWdLTUVhzlSI/viewform?embedded=true" 
              width="640" height="2963">
            Loading…
            </iframe>
	        </div>
        </Container>
      </DoubleGlowShadowV2>

)}

export default Claim