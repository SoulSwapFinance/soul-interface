import { Disclosure } from "@headlessui/react"
import classNames from "classnames"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { HiOutlineMenu, HiX } from "react-icons/hi"

const navigation = [
  { name: "Dashboard", href: "/underworld/analytics/", current: true },
  { name: "Explore", href: "/underworld/analytics/explore/", current: false },
]

const Header = () => {
  const router = useRouter()
  return (
    <Disclosure as="nav" className="bg-black">
      {({ open }) => (
        <>
          <div className="container px-4 mx-auto">
            <div className="relative flex items-center justify-between py-3">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-primary1-300 hover:text-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <HiX className="block w-6 h-6" aria-hidden="true" />
                  ) : (
                    <HiOutlineMenu
                      className="block w-6 h-6"
                      aria-hidden="true"
                    />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex items-center justify-center flex-1 sm:items-stretch sm:justify-start">
                <div className="flex items-center flex-shrink-0">
                  <Link href="/">
                    <a>
                      <Image
                        width="50px"
                        height="50px"
                        className="w-auto"
                        src="/logo.png"
                        alt="Underworld Market"
                      />
                    </a>
                  </Link>
                </div>
                <div className="hidden mx-auto sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link href={item.href} key={item.name}>
                        <a
                          className={classNames({
                            "border-b-2 transition-colors text-white hover:text-primary1-300 mx-2 py-2 font-medium":
                              true,
                            "border-primary1-400":
                              router.pathname === item.href,
                            "border-transparent": router.pathname !== item.href,
                          })}
                        >
                          {item.name}
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              {/* <div className="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:ml-6">
                <Button rounded="sm">App</Button>
              </div> */}
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames({
                    "text-gray-300 hover:bg-primary1-400 rounded hover:text-white transition-colors":
                      true,
                    "block px-3 py-2 text-base font-medium": true,
                  })}
                >
                  <span
                    className={classNames({
                      "border-b-2": true,
                      "border-primary1-400": router.pathname === item.href,
                      "border-transparent": router.pathname !== item.href,
                    })}
                  >
                    {item.name}
                  </span>
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

export default Header