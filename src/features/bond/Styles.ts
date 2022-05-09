import styled, { keyframes } from "styled-components";
import Link from "next/link";

// Lime : #2de273

export const Container = styled.div`
  align-items: center;
  transition: all 0.3s ease-in-out;
  margin: 0 1rem;
  padding: 1rem 0.5rem 0.5rem 0.5rem;
  border-radius: 2rem;
  border: 2px solid #444;
  background-color: #111;
`;

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

export const InputRow = styled.div`
  display: ${({ display }) => (display ? `${display}` : "block")};
  justify-content: ${({ justifyContent }) => (justifyContent ? `${justifyContent}` : "left")};
  align-items: ${({ alignItems }) => (alignItems ? `${alignItems}` : "left")};;
  border-radius: ${({ borderRadius }) => (borderRadius ? `${borderRadius}` : `8px`)};
  border: ${({ border }) => (border ? `${border}` : '1.5px solid #222')};
  background-color: ${({ bgColor }) => (bgColor ? `${bgColor}` : `#111`)};
  width: ${({ width }) => (width ? `${width}` : "")};
  height: ${({ height }) => (height ? `${height}` : "4rem")};
  max-height: ${({ maxHeight }) => (maxHeight ? `${maxHeight}` : "100%")};
  overflow-y: ${({ overflowY }) => (overflowY ? `${overflowY}` : "auto")};
  margin: ${({ margin }) => (margin ? `${margin}` : "1rem 0")};
  padding: ${({ padding }) => (padding ? `${padding}` : "0.5rem")};
`;

export const Heading = styled.h3`
  padding: ${({ padding }) => (padding ? `${padding}` : "0")};
  margin: ${({ margin }) => (margin ? `${margin}` : "0 0")};
  text-align: ${({ textAlign }) => (textAlign ? `${textAlign}` : `left`)};
  color: ${({ color }) => (color ? `${color}` : `white`)};
  font-size: ${({ fontSize }) => (fontSize ? `${fontSize}` : ``)};
`;

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


export const ClickableText = styled(Text)`
  &:hover {
    opacity: 50%;
    cursor: pointer;
  }
`;

export const ExternalLink = styled.a`
  outline: none;
  text-decoration: none;
  color: ${({ color }) => (color ? `${color}` : "white")};
  border: ${({ border }) => (border ? `${border}` : `none`)};
  font-size: ${({ fontSize }) => (fontSize ? `${fontSize}` : `1rem`)};
  text-align: ${({ textAlign }) => (textAlign ? `${textAlign}` : `left`)};
  padding: ${({ padding }) => (padding ? `${padding}` : "0")};
  margin: ${({ margin }) => (margin ? `${margin}` : "0 0")};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  /* text-shadow: 0 0 1px white; */

  &:hover {
    opacity: 50%;
  }

  &.active {
    border-bottom: 3px solid violet;
  }
`;


export const Button = styled.button`
  margin: ${({ margin }) => (margin ? `${margin}` : `0`)};
  width: ${({ width }) => (width ? `${width}` : `8rem`)};
  height: ${({ height }) => (height ? `${height}` : `2.5rem`)};
  font-size: ${({ fontSize }) => (fontSize ? `${fontSize}` : `.9rem`)};
  background-color: ${({ bgColor }) => (bgColor ? `${bgColor}` : `#3D81DB`)};
  color: ${({ color }) => (color ? `${color}` : `white`)};
  border: ${({ border }) => (border ? `${border}` : `2px solid #3D81DB`)};
  border-radius: 8px;
  outline: none;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    opacity: 70%;
    cursor: pointer;
  }

  &:disabled { 
    cursor: not-allowed;
    opacity: 50%;
  }
`;

export const RemoveBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  outline: none;
  border: none;
  border-radius: 12px;
  height: 1.2rem;
  width: 1.2rem;
  font-size: 0.8rem;
  font-weight: 900;

  background-color: #ea3030;
  transition: all 0.2s ease-in-out;

  &:hover {
    cursor: pointer;
    background-color: ${({ hoverBg }) => (hoverBg ? `${hoverBg}` : "#B485FF")};
    box-shadow: ${({ hoverBoxShadow }) =>
      hoverBoxShadow ? `${hoverBoxShadow}` : `0 0 10px 0 #B485FF`};
  }
`;


export const OptionSelector = styled.select`
  height: 2rem;
  width: ${({ width }) => (width ? `${width}` : `100%`)};
  padding: 0 0.5rem;
  background-color: #444;
  border: none;
  border-radius: 8px;
  color: white;
  outline: none;

  &:focus {
    border: 1.5px solid #367fd2;
  }
`;


export const FlexText = styled.div`
  display: flex;
  justify-content: space-between;
`
export const FlexSocialText = styled.div`
  display: flex;
  justify-content: centered;
`


// ---------------------
//  Row Section
// ---------------------

export const BondContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr;
`

export const Row = styled.div`
  background-color: #18191A;
  padding: ${({ padding }) => (padding ? `${padding}` : `0.25rem 0rem`)};
  margin: ${({ width }) => (width ? `${width}` : `2px`)};
  width: 42rem;
  border-radius: 18px;
  border: 2px solid #18191A; // original .8px solid #333;
  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 75%;
    cursor: pointer;
    border: 2px solid #EE82EE;
  }

  @media screen and (max-width: 1200px) {
      width: 42rem;
      padding: auto;
    }

  @media screen and (max-width: 900px) {
      width: 42rem;
      padding: auto;
    }

  @media screen and (max-width: 720px) {
      width: 36rem;
      padding: auto;
    }

    @media screen and (max-width: 600px) {
      width: 32rem;
      padding: auto;
    }

    @media screen and (max-width: 500px) {
      width: 25rem;
      padding: auto;
    }

  @media screen and (max-width: 400px) {
      width: 24rem;
    }
  `

export const BondContentWrapper = styled.div`
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

export const BondItemBox = styled.div`
  width: ${({ width }) => (width ? `${width}` : `100px`)};
  display: grid;
  justify-content: between;
  align-items: center;

`

export const BondItemHeading = styled.p`
  font-weight: normal;
  font-size: 0.8rem;
  color: white;
  align-items: center;
`

export const BondItem = styled.h2`
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
  width: 42rem;

  @media screen and (max-width: 900px) {
    width: auto;
  }
`

export const DetailsWrapper = styled.div`
  display: flex;
  background-color: #18191A;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  width: 42rem;
  padding: 1px 1px;

  @media screen and (max-width: 1200px) {
    display: block;
    width: 42rem
  }

  @media screen and (max-width: 900px) {
    display: block;
    width: 42rem
  }

  @media screen and (max-width: 720px) {
    display: block;
    width: 36rem;
  }
  @media screen and (max-width: 600px) {
    display: block;
    width: 32rem;
  }
  @media screen and (max-width: 500px) {
    display: block;
    width: 25rem;
  }

@media screen and (max-width: 400px) {
    width: 24rem;
  }
`

export const FunctionBox = styled.div`
  padding: 10px;
  width: ${({ width }) => (width ? `${width}` : `100%`)};
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
  background: ${({ primaryColor }) => (primaryColor ? primaryColor : '#EE82EE')};
  color: ${({ color }) => (color ? color : 'white')};

  &:hover {
    opacity: 70%;
    cursor: pointer;
  }

  &:focus {
    border-color: ${({ hoverColour }) => (hoverColour ? hoverColour : '#EE82EE')};
  }

  &:disabled { 
    cursor: not-allowed;
    opacity: 50%;
  }
`

export const CheckBox = styled.input`
  width: 16px;
  height: 16px;
  background-color: #092c3e;
  cursor: pointer;
  overflow: hidden;
  border: none;
  outline: none;
  text-decoration: none;
  margin: ${({ margin }) => (margin ? `${margin}` : `0 0`)};
`;

export const CenterScreen = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const OverlayOpacity = styled.div`
  position: fixed;
  /* background opacity settings */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 99;
`;

export const MobileIcon = styled.div`
  display: none;

  // only display past max-width threshold
  @media screen and (max-width: 1200px) {
    display: flex;
    align-items: center;
    font-size: 1.8rem;
    cursor: pointer;
    color: #fff;
    padding: .25rem 0 0 1rem;
  }
`;