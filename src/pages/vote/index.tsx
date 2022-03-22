import Typography from '../../components/Typography'
import styled from "styled-components";

// export const ItemBox = styled.div`
//   width: ${({ width }) => (width ? `${width}` : `100px`)};
//   display: grid;
//   justify-content: left;
//   align-items: center;
//   // margin-left: ${({ marginLeft }) => (marginLeft ? `${marginLeft}` : `30px`)};

// `

// const HideOnMobile = styled(ItemBox)`
//   @media screen and (max-width: 900px) {
//     display: none;
//   }
// `;

const Vote = () => {
	return (

		<>
			{/* <Typography variant="hero" className={'md:hidden text-center font-bold mt-5 text-purple'}>
			Requests
		</Typography>
			<div className='sm:flex md:flex w-full h-full'>
				<iframe frameBorder="none"
					title={"Board"}
					height={"100%"}
					width={'99%'}
					src='https://soulswap.hellonext.co/'
					// src='https://board.soulswap.finance/embed/roadmap'
				/>
			<br/>
			<br/>
			<Typography variant="hero" className={'md:hidden text-center font-bold mt-5 text-purple'}>
			Proposals
		</Typography>				 */}
		<iframe
					frameBorder={"none"}
					title={"Vote"}
					src="https://enchant.soulswap.finance"
					height={"900px"}
					width={"99%"}
				/>
			{/* </div> */}
		</>
	);
};

export default Vote;
