/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import "../styles/layout.css"
import Header from "./header"

type LayoutProps = {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="antialiased max-h-screen h-screen flex flex-col">
      <Header />
      {children}
    </div>
  )
}

export default Layout
