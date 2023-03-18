import styled from 'styled-components'
import { Button } from 'components/Button'

export const Text = styled.p`
  padding: ${({ padding }) => (padding ? `${padding}` : "0 0.5rem")};
  margin: ${({ margin }) => (margin ? `${margin}` : "0")};
  color: ${({ color }) => (color ? `${color}` : `white`)};
  font-size: ${({ fontSize }) => (fontSize ? `${fontSize}` : `1rem`)};
  font-weight: ${({ fontWeight }) => (fontWeight ? `${fontWeight}` : ``)};
  text-align: ${({ textAlign }) => (textAlign ? `${textAlign}` : `left`)};
`;

export const Wrap = styled.div`
  width: ${({ width }) => (width ? `${width}` : "")};
  height: ${({ height }) => (height ? `${height}` : "")};
  margin: ${({ margin }) => (margin ? `${margin}` : "0 0")};
  padding: ${({ padding }) => (padding ? `${padding}` : "0.25rem 0.25rem")};
  display: ${({ display }) => (display ? `${display}` : "block")};
  justify-content: ${({ justifyContent }) => (justifyContent ? `${justifyContent}` : "center")};
  align-items: ${({ alignItems }) => (alignItems ? `${alignItems}` : "center")};;
  overflow: ${({ overflow }) => (overflow ? `${overflow}` : "")}; /* Auto = scrollbar is only inside of text section */
  background-color: ${({ bgColor }) => (bgColor ? `${bgColor}` : ``)};
  border: ${({ border }) => (border ? `${border}` : ``)};
  border-bottom: ${({ borderBot }) => (borderBot ? `${borderBot}` : ``)};;
  border-radius: ${({ borderRadius }) => (borderRadius ? `${borderRadius}` : ``)};
`;

export const SubmitButton = styled(Button)`
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
  background: ${({ primaryColor }) => (primaryColor ? primaryColor : '#F36FFE')};
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


/// --------------------- ///

export const FunctionBox = styled.div`
  padding: 0px;
  width: ${({ width }) => (width ? `${width}` : `100%`)};
`

// FARM //


export const FarmItem = styled.h2`
  font-size: 1.5rem;
  color: white;
`

export const FarmItemBox = styled.div`
  width: ${({ width }) => (width ? `${width}` : `100px`)};
  display: grid;
  justify-content: center;
  align-items: center;
`

export const FarmContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0 0 0;

  &:last-child {
    justify-content: space-between;
  }

  @media screen and (max-width: 720px) {
    padding: 0 0rem 0 0;
  }
`

export const FarmContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr;
`