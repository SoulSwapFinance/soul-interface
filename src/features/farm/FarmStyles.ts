import { linearGradient } from 'polished'
import styled from 'styled-components'

export const FlexText = styled.div`
  display: flex;
  justify-content: space-between;
`

// ---------------------
//  Row Section
// ---------------------

export const FarmContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr;
`

export const FarmRow = styled.div`
  background-color: #222;
  margin: 4px;
  border-radius: 8px;
  padding: 5px 15px;
  border: 1px solid #333;
  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 75%;
    cursor: pointer;
  }
`

export const FarmContentWrapper = styled.div`
  display: flex;
  justify-content: left;

  &:last-child {
    justify-content: space-between;
  }
`

export const FarmItemBox = styled.div`
  width: ${({ width }) => (width ? `${width}` : `100px`)};
  display: grid;
  justify-content: left;
  align-items: center;
  margin-left: ${({ marginLeft }) => (marginLeft ? `${marginLeft}` : `30px`)};

  @media screen and (max-width: 600px) {
    display: ${({ desktopOnly }) => (desktopOnly ? `none` : '')};
  }
`

export const FarmItemHeading = styled.p`
  font-weight: normal;
  font-size: 0.8rem;
  color: white;
  align-items: center;
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
  margin: 4px;
`

export const DetailsWrapper = styled.div`
  display: flex;
  background-color: #222;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  width: 100%;
  padding: 5px 10px;

  @media screen and (max-width: 600px) {
    display: block;
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
  padding: ${({ padding }) => (padding ? padding : '0')};
  margin: ${({ margin }) => (margin ? margin : '0.5rem 0 0.5rem 0')};
  outline: 0;
  border: none;
  border-radius: 0.25em;
  font-size: 1rem;
  padding: 0.5em;
  transition: all 0.2s ease-in-out;
  background: ${({ primaryColour }) => (primaryColour ? primaryColour : '#3D81DB')};
  color: ${({ color }) => (color ? color : 'white')};

  &:hover {
    opacity: 70%;
    cursor: pointer;
  }

  &:focus {
    border-color: ${({ hoverColour }) => (hoverColour ? hoverColour : '#3D81DB')};
  }

  &:disabled { 
    cursor: not-allowed;
    opacity: 50%;
  }
`
