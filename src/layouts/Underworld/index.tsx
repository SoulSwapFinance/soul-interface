import Container from 'components/Container'
import Image from 'components/Image'
import Main from 'components/Main'
import NavLink from 'components/NavLink'
import Popups from 'components/Popups'
import Link from 'next/link'
import React, { FC } from 'react'
import { useRouter } from 'next/router'

interface LayoutProps {
  left?: JSX.Element
  right?: JSX.Element
}

const Layout: FC<LayoutProps> = ({ left, children, right }) => {
  const router = useRouter()
  return (
    <>
      <Main>
        <Container className="px-4 py-4 md:py-8 lg:py-12" maxWidth="7xl">
          <div className={`mb-2 grid grid-cols-12 gap-4`}>
            <div className="flex justify-center col-span-12 xl:col-span-3 lg:justify-start">
              <Link href="/borrow">
                <a className="flex justify-center xl:justify-start xl:mx-8">
                  <Image src="/images/underworld/logo.png" alt="Underworld" height={64} width={250} placeholder="empty" />
                </a>
              </Link>
            </div>
          </div>
          <div className="flex items-end col-span-12 xl:col-span-9">
            <nav className="flex items-center justify-between w-full">
              <div className="flex">
                <NavLink href="/lend">
                  <a
                    className={
                      'px-2 sm:px-4 flex items-center font-medium ' +
                      (router.pathname.startsWith('/lend')
                        ? 'text-high-emphesis'
                        : 'text-secondary hover:text-primary')
                    }
                  >
                    <div className="text-base whitespace-nowrap">Lend</div>
                  </a>
                </NavLink>
                <NavLink href="/borrow">
                  <a
                    className={
                      'px-2 sm:px-4 flex items-center font-medium ' +
                      (router.pathname.startsWith('/borrow')
                        ? 'text-high-emphesis'
                        : 'text-secondary hover:text-primary')
                    }
                  >
                    <div className="text-base whitespace-nowrap">Borrow</div>
                  </a>
                </NavLink>
                <NavLink href="/create">
                  <a
                    className={
                      'px-2 sm:px-4 flex items-center font-medium ' +
                      (router.pathname.startsWith('/create')
                        ? 'text-high-emphesis'
                        : 'text-secondary hover:text-primary')
                    }
                  >
                    <div className="text-base whitespace-nowrap">Create</div>
                  </a>
                </NavLink>
              </div>
            </nav>
          </div>
          <div className={`grid grid-cols-12 gap-4 min-h-1/2`}>
            {left && (
              <div className={`hidden xl:block xl:col-span-3`} style={{ maxHeight: '40rem' }}>
                {left}
              </div>
            )}
            <div
              className={`col-span-12 ${right ? 'lg:col-span-8 xl:col-span-6' : 'xl:col-span-9'}`}
              style={{ minHeight: '40rem' }}
            >
              {children}
            </div>
            {right && (
              <div className="col-span-12 lg:col-span-4 xl:col-span-3" style={{ maxHeight: '40rem' }}>
                {right}
              </div>
            )}
          </div>
        </Container>
      </Main>
      <Popups />
    </>
  )
}



export default Layout