import Footer from 'components/Footer'
import Header from 'components/Header'
import Main from 'components/Main'
import Popups from 'components/Popups'

// @ts-ignore TYPE NEEDS FIXING
const Layout = ({ children }) => {
  return (
    <div className="z-0 flex flex-col items-center w-full h-full">
      <Header />
      <Main>{children}</Main>
      <Popups />
      <Footer />
    </div>
  )
}

export default Layout