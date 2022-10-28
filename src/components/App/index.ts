// import { type FooterProps, Footer } from './Footer'
import { HeaderProps, Header } from './Header'
import { MainProps, Main } from './Main'
import { NavProps, Nav } from './Nav'
import { NavItem, NavItemProps } from './NavItem'
import { NavItemList, NavItemListProps } from './NavItemList'
import { ShellProps, Shell } from './Shell'

export type AppProps = {
  Header: HeaderProps
  Shell: ShellProps
  Nav: NavProps
  Main: MainProps
  // Footer: FooterProps
  NavItem: NavItemProps
  NavItemList: NavItemListProps
}

export const App = {
  Header,
  Shell,
  Nav,
  NavItem,
  NavItemList,
  Main,
  // Footer,
}

export { AppType } from './Header'
