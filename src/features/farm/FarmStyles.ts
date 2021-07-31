import styled from 'styled-components'

// ---------------------
//  Row Section
// ---------------------

export const FarmContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr;
`

export const FarmRow = styled.div`
  background-color: HSL(267, 30%, 20%);
  margin: 4px;
  border-radius: 8px;
  padding: 5px 15px;
`

export const FarmContentWrapper = styled.div`
  display: flex;
`

export const FarmItemBox = styled.div`
  width: ${({ width }) => (width ? `${width}` : `100px`)};
  display: grid;
  justify-content: left;
  align-items: center;
  margin-left: ${({ marginLeft }) => (marginLeft ? `${marginLeft}` : `30px`)};
`

export const FarmItemHeading = styled.p`
  font-weight: normal;
  font-size: 0.8rem;
  color: white;
`

export const FarmItem = styled.h2`
  font-size: 1.5rem;
  color: white;
`

export const TokenPairBox = styled.div`
  width: 150px;
  display: flex;
  justify-content: left;
  align-items: center;
`

export const TokenPair = styled.a`
  overflow-wrap: break-word;
  font-size: 1.2rem;
  color: white;
`

export const ShowBtnWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const ShowBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
  border: none;
  color: white;
  font-size: 1rem;
  background-color: transparent;

  &:hover,
  &:active {
    text-shadow: 0 0 5px white;
  }
`

// ---------------------
//  Dropdown Section
// ---------------------

export const DetailsContainer = styled.div`
  margin: 4px;
`

export const DetailsWrapper = styled.div`
  display: flex;
  background-color: HSL(267, 30%, 30%);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  width: 100%;
  padding: 5px 10px;
`

export const FunctionBox = styled.div`
  padding: 10px;
  width: ${({ width }) => (width ? `${width}` : `100%`)};
`

export const Input = styled.input`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0.25rem;
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 0.5em;
  border-radius: 0.2em;
  background-color: #675c6e;
  color: white;

  &:focus {
    border-color: white;
    /* y axis, x axis, blur, spread, colour */
    /* box-shadow: 0 0 10px 0 white; */
    outline: 0;
  }
`

export const SubmitButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0.5rem 0.25rem 0 0.25rem;
  outline: 0;
  border: none;
  border-radius: 0.25em;
  font-size: 1rem;
  padding: 0.5em;
  transition: all 0.2s ease-in-out;
  background: ${({ primaryColour }) => (primaryColour ? primaryColour : 'white')};
  color: black;

  &:hover {
    border-color: ${({ hoverColour }) => (hoverColour ? hoverColour : 'violet')};
    box-shadow: ${({ hoverColour }) => (hoverColour ? `0 0 10px 0 ${hoverColour}` : '0 0 10px 0 violet')};
    background-color: ${({ hoverColour }) => (hoverColour ? hoverColour : 'violet')};
    cursor: pointer;
  }

  &:focus {
    border-color: ${({ hoverColour }) => (hoverColour ? hoverColour : 'violet')};
  }

  &:disabled {
    cursor: auto;
    opacity: 80%;
  }
`
