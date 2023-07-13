import React from 'react'

import NavLink from '../../components/NavLink'
import Typography from 'components/Typography'

interface SidebarProps {
  items: {
    text: string
    href: string
  }[]
}

const Sidebar = ({ items }: SidebarProps) => {
  return (
    <div className="mt-4 space-y-4">
      {items.map((item, i) => (
        <NavLink key={i} href={item.href} activeClassName="font-bold text-high-emphesis bg-dark-800">
          <Typography className="flex items-center px-1 py-3 border-transparent rounded hover:bg-dark-900">
            <div className="ml-5">{item.text}</div>
          </Typography>
        </NavLink>
      ))}
    </div>
  )
}

export default Sidebar