module.exports = {
  siteMetadata: {
    title: `Kockatý kalendár`,
    description: `Kalendár matematických, fyzikálnych a informatických súťaží a podujatí pre základné a stredné školy.`,
    author: `Trojsten`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: "gatsby-transformer-yaml",
      options: {
        typeName: "Yaml",
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "eventFiles",
        path: "./data/data/",
        ignore: [`**/\.*`], // ignore files starting with a dot
      },
    },
    "gatsby-plugin-postcss",
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
