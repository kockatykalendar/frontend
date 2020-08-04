import { graphql, useStaticQuery } from "gatsby"
import React from "react"
import EventList from "../components/eventlist"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Calendar from "../components/calendar"

const IndexPage = () => {
  const query = useStaticQuery(graphql`
    query DataQuery {
      allYaml(sort: { fields: date___start }) {
        nodes {
          id
          name
          sciences
          type
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
      <div className="flex overflow-hidden flex-col md:flex-row flex-grow">
        <Calendar />
        <EventList events={query.allYaml.nodes} />
      </div>
    </Layout>
  )
}

export default IndexPage
