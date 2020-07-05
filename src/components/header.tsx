import { graphql, Link, useStaticQuery } from "gatsby"
import React from "react"

const Header = () => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <header className="bg-blue-400 mb-6">
      <div className="max-w-screen-lg px-5 py-4 mx-auto">
        <h1 className="mb-0 text-3xl font-bold">
          <Link className="text-white no-underline" to="/">
            {data.site.siteMetadata.title}
          </Link>
        </h1>
      </div>
    </header>
  )
}

export default Header
