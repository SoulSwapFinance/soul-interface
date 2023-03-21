import React, { ReactNode } from "react"
import Footer from "./Footer"
import Header from "./Header"

const BaseLayout = ({ children }: { children?: ReactNode }) => {
  return (
    <>
      <Header />
        {children}
      <Footer />
    </>
  )
}

export default BaseLayout