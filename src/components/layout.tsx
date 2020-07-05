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
    <>
      <Header />
      <div className="max-w-screen-lg px-5 py-4 mx-auto">
        <main>{children}</main>
      </div>
    </>
  )
}

export default Layout
