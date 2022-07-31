import React from 'react'
import styled from 'styled-components'

export const TokenSelectOverlay = styled.div`
width: 100vw;
height: 100vh;
position: fixed;
top: 0;
left: 0;
z-index: 1000;
opacity: 0;
transition: opacity 125ms ease;
}
`

export const TokenSelectModal = styled.div`
height: 95vh;
max-height: 768px;
max-width: 28ch;
width: 100%;
position: fixed;
left: 50%;
top: 50%;
overflow: hidden;
transition: transform 100ms ease;
font-family: "Square", sans-serif;
font-size: 18px;
border-radius: 8px;
`