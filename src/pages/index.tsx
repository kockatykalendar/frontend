import { graphql, useStaticQuery } from "gatsby"
import React from "react"
import EventList from "../components/eventlist"
import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = () => {
  const query = useStaticQuery(graphql`
    query DataQuery {
      allYaml(sort: { fields: date___start }) {
        nodes {
          id
          name
          sciences
          date {
            start
            end
            text
          }
          contestants {
            min
            max
          }
          places
          organizers
          link
        }
      }
    }
  `)

  return (
    <Layout>
      <SEO title="Home" />
      <EventList events={query.allYaml.nodes} />
    </Layout>
  )
}

export default IndexPage
