import styled from 'styled-components'

export const FlexText = styled.div`
  display: flex;
  justify-content: space-between;
`
export const FlexSocialText = styled.div`
  display: flex;
  justify-content: centered;
`
export const Wrap = styled.div`
  width: ${({ width }) => (width ? `${width}` : "")};
  height: ${({ height }) => (height ? `${height}` : "")};
  margin: ${({ margin }) => (margin ? `${margin}` : "0 0")};
  padding: ${({ padding }) => (padding ? `${padding}` : "0.25rem 0.5rem")};
  display: ${({ display }) => (display ? `${display}` : "block")};
  justify-content: ${({ justifyContent }) => (justifyContent ? `${justifyContent}` : "center")};
  align-items: ${({ alignItems }) => (alignItems ? `${alignItems}` : "center")};
  overflow: ${({ overflow }) => (overflow ? `${overflow}` : "")}; /* Auto = scrollbar is only inside of text section */
  background-color: ${({ bgColor }) => (bgColor ? `${bgColor}` : ``)};
  border: ${({ border }) => (border ? `${border}` : ``)};
  border-bottom: ${({ borderBot }) => (borderBot ? `${borderBot}` : ``)};;
  border-radius: ${({ borderRadius }) => (borderRadius ? `${borderRadius}` : ``)};
`;

export const Text = styled.p`
  padding: ${({ padding }) => (padding ? `${padding}` : "0 0.25rem")};
  margin: ${({ margin }) => (margin ? `${margin}` : "0 0")};
  color: ${({ color }) => (color ? `${color}` : `white`)};
  font-size: ${({ fontSize }) => (fontSize ? `${fontSize}` : `1rem`)};
  font-weight: ${({ fontWeight }) => (fontWeight ? `${fontWeight}` : ``)};
  text-align: ${({ textAlign }) => (textAlign ? `${textAlign}` : `center`)};
`;

// ---------------------
//  Row Section
// ---------------------

export const StakeContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr;
`

export const Row = styled.div`
  background-color: #18191A;
  padding: ${({ padding }) => (padding ? `${padding}` : `.25rem 0rem`)};
  margin: ${({ width }) => (width ? `${width}` : `2px`)};
  width: 55rem;
  border-radius: 18px;
  border: 2px solid #18191A; // original .8px solid #333;
  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 75%;
    cursor: pointer;
    border: 2px solid #F36FFE;
  }

  @media screen and (max-width: 900px) {
      width: 32rem;
      padding: auto;
    }

  @media screen and (max-width: 720px) {
      width: 22rem;
      padding: auto;
    }

  @media screen and (max-width: 400px) {
      width: 20rem;
    }
  `

export const StakeContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 1rem 0 0;

  &:last-child {
    justify-content: space-between;
  }

  @media screen and (max-width: 720px) {
    padding: 0;
  }
`

export const StakeItemBox = styled.div`
  width: ${({ width }) => (width ? `${width}` : `100px`)};
  display: grid;
  justify-content: center;
  align-items: center;

`

export const StakeItemHeading = styled.p`
  font-weight: normal;
  font-size: 0.8rem;
  color: white;
  align-items: center;
`

export const StakeItem = styled.h2`
  font-size: 1.5rem;
  color: white;
`

export const TokenPairBox = styled.div`
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const TokenPair = styled.a`
  overflow-wrap: break-wordWRA;
  font-size: 1.2rem;
  color: white;

  transition: all 0.2s ease-in-out;

  &:hover {
    color: #3D81DB;
    opacity: 75%;
    cursor: pointer;
  }
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

  &:hover, &:active {
    color: #3D81DB;
    opacity: 75%;
    cursor: pointer;
  }
`

// ---------------------
//  Dropdown Section
// ---------------------

export const DetailsContainer = styled.div`
  margin: 2px;
  width: 55rem;

  @media screen and (max-width: 900px) {
    width: auto;
  }
`

export const DetailsWrapper = styled.div`
  display: flex;
  background-color: #18191A;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  width: 55rem;
  padding: 5px 10px;

  @media screen and (max-width: 3200px) {
    display: block;
    width: 55rem
  }

  @media screen and (max-width: 900px) {
    display: block;
    width: 32rem
  }

  @media screen and (max-width: 720px) {
    display: block;
    width: 28rem
  }

  @media screen and (max-width: 400px) {
    width: 20rem;
  }
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
  margin: 0.25rem 0 0.25rem;
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 0.5em;
  border-radius: 0.2em;
  background-color: #333;
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
  height: ${({ height }) => (height ? height : '')};
  padding: ${({ padding }) => (padding ? padding : '0')};
  margin: ${({ margin }) => (margin ? margin : '0.5rem 0 0.5rem 0')};
  outline: 0;
  border: none;
  border-radius: 0.25em;
  font-size: 1rem;
  padding: 0.5em;
  transition: all 0.2s ease-in-out;
  background: ${({ primaryColour }) => (primaryColour ? primaryColour : '#F36FFE')};
  color: ${({ color }) => (color ? color : 'white')};

  &:hover {
    opacity: 70%;
    cursor: pointer;
  }

  &:focus {
    border-color: ${({ hoverColour }) => (hoverColour ? hoverColour : '#F36FFE')};
  }

  &:disabled { 
    cursor: not-allowed;
    opacity: 50%;
  }
`
