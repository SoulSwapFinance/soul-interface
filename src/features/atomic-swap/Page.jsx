import React from 'react'
import styled from 'styled-components'

export const PageContainer = styled.div`
    margin: 5vh 30vh;
    /* background-color: #141314; */ // use to look at box

    @media screen and (max-width: 600px) {
        margin: 1rem 1rem;
        display: flex;
        justify-content: center;
  }
`

const Page = ({ children }) => {
    return (
        <PageContainer>
            {children}
        </PageContainer>
    )
}

export default Page
