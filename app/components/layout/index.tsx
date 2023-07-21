import React, { FC, ReactNode } from "react"
import Header from "./Header"

interface Props {
  children: ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <div>
      <Header />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </div>
  )
}

export default Layout