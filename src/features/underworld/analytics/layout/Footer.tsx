import Image from "next/image"
import Link from "next/link"
import { ReactNode } from "react"

// const LinkItem = ({
//   href,
//   children,
// }: {
//   href: string
//   children?: ReactNode
// }) => (
//   <Link href={href}>
//     <a className="inline-block py-3 text-gray-400 hover:text-primary1-300">
//       {children}
//     </a>
//   </Link>
// )

const Footer = () => {
  return (
    <div className="bg-black">
      <div className="container px-4 py-4 mx-auto">
        <div className="grid grid-cols-6 gap-4 py-8 text-white">
          <div className="col-span-6 sm:col-span-1">
            <Link href="underworld/analytics/">
              <a className="flex items-center">
                <Image
                  src="/logo.png"
                  width="40px"
                  height="40px"
                  alt="Underworld Market"
                />
                <span className="ml-2 sm:hidden">Underworld Market</span>
              </a>
            </Link>
          </div>
          {/* <div className="col-span-6 sm:col-span-4">
            <div className="grid grid-cols-2 sm:grid-cols-3">
              <div className="col-span-1 mt-4 sm:mt-0">
                <h4 className="text-lg font-medium">Protocal</h4>
                <ul className="mt-3 text-xs">
                  <li>
                    <LinkItem href="/market">Market</LinkItem>
                  </li>
                  <li>
                    <LinkItem href="/prices">Prices</LinkItem>
                  </li>
                  <li>
                    <LinkItem href="/developers">Developers</LinkItem>
                  </li>
                  <li>
                    <LinkItem href="/docs">Docs</LinkItem>
                  </li>
                </ul>
              </div>
              <div className="col-span-1 mt-4 sm:mt-0">
                <h4 className="text-lg font-medium">Governance</h4>
                <ul className="mt-3 text-xs">
                  <li>
                    <LinkItem href="/overview">Overview</LinkItem>
                  </li>
                  <li>
                    <LinkItem href="/comp">COMP</LinkItem>
                  </li>
                  <li>
                    <LinkItem href="/leaderboard">Leaderboard</LinkItem>
                  </li>
                </ul>
              </div>
              <div className="col-span-1 mt-4 sm:mt-0">
                <h4 className="text-lg font-medium">Community</h4>
                <ul className="mt-3 text-xs">
                  <li>
                    <LinkItem href="/discord">Discord</LinkItem>
                  </li>
                  <li>
                    <LinkItem href="/forum">Forum</LinkItem>
                  </li>
                  <li>
                    <LinkItem href="/grants">Grants</LinkItem>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="hidden col-span-6 text-right sm:block sm:col-span-1">
            <Button rounded="sm">App</Button>
          </div> */}
        </div>
        <div className="pt-6 text-xs border-t border-slate-800 text-slate-400">
          © 2023 Underworld Market
        </div>
      </div>
    </div>
  )
}

export default Footer