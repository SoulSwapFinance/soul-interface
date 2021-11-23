import styled, { keyframes } from "styled-components";
import { Button } from "../../components/ReusableStyles";

export const ItemContainer = styled.div`
  display: flex;
  padding-bottom: 1rem;
`;

export const HiddenBtn = styled(Button)`
  margin: ${({ margin }) => (margin ? `${margin}` : `0 .25rem`)};
  width: ${({ width }) => (width ? `${width}` : `8rem`)};
  height: ${({ height }) => (height ? `${height}` : `2.5rem`)};
  font-size: ${({ fontSize }) => (fontSize ? `${fontSize}` : `.9rem`)};
  background-color: ${({ bgColor }) => (bgColor ? `${bgColor}` : `#B026FF`)};
  color: ${({ color }) => (color ? `${color}` : `white`)};
  border: ${({ border }) => (border ? `${border}` : `2px solid #B026FF`)};
  border-radius: 8px;
  outline: none;
  text-decoration: none;
  transition: all 0.4s ease-in-out;

  opacity: 0;
  transform: translateY(10px);
  
  &:hover {
    opacity: 70%;
    cursor: pointer;
  }
`;

export const ItemCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: rgb(18, 18, 18);
  border: 1.5px solid #444;
  border-radius: 24px;
  padding: ${({ padding }) => (padding ? `${padding}` : `.5rem 1rem`)};
  height: 25rem;
  width: 13.75rem;
  color: white;
  scale: 0.88;
  transition: all 0.3s ease-in-out;
  
  @media screen and (max-width: 800px) {
    opacity: 1;
    transform: translateY(0);
  }
  
  &:hover {
    transform: scale(1.02);
    border: 1.5px solid #B026FF;
  }

  &:hover ${HiddenBtn} {
    opacity: 1;
    transform: translateY(0px);
  }
`;

// -------------------
// HEADER
// -------------------

export const HeadingContainer = styled.div`
  border-bottom: 1px solid #777;
  padding: 0.5rem 0;
  display: flex;
  justify-content: center;
`;

export const Heading = styled.h3`
  text-align: center;
`;

// -------------------
// BODY
// -------------------

export const UserContainer = styled.div`
  /* border-bottom: 1px solid #777; */
  display: block;
  justify-content: left;
  padding: 1rem 0 5px 0;
  border-bottom: 1px solid #aaa;
`;

export const UserBlurb = styled.p`
  color: #aaa;
  font-size: 0.6rem;
`;

export const TableContainer = styled.div`
  flex-grow: 0.5; /* always grows to be the full size of the modal (including white space) */
  padding: 0 0;
  overflow: auto; /* scrollbar is only inside of text section */
`;

export const Table = styled.table`
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  border: none;
  
  tr:nth-child(even) {
    /* background-color: gray; */
  }
`;

export const TableHeading = styled.th`
  text-align: left;
  padding: 5px;
  font-size: 0.8rem;
  /* border-bottom: 1px solid #aaa; */

  &#erc {
    width: 10%;
  }

  &#token {
    width: 15%;
  }
`;

export const TableDescription = styled.td`
  text-align: left;
  padding: 5px;
  font-size: 0.7rem;
`;

// -------------------
// FOOTER
// -------------------

export const FooterContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1em;
  padding: 0.8rem 0;
  border-top: 1px solid #777;
`;

export const FooterButton = styled.button`
  margin: 0 0.5rem;
  padding: 0.2rem 0.2rem;
  outline: none;
  text-decoration: none;
  border: none;

  transition: all 0.2s ease-in-out;

  &:hover {
    cursor: pointer;
    background-color: ${({ hoverBg }) =>hoverBg ? `${hoverBg}` : "darkorange"};
    box-shadow: ${({ hoverBoxShadow }) => hoverBoxShadow ? `${hoverBoxShadow}` : `0 0 10px 0 darkorange`};
  }
`;
