/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  /* Your site config here */
  plugins: [
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Offisielt nettsted for Trondheim`,
        short_name: `Trondheim.no`,
        start_url: `/`,
        lang: `no`,
        background_color: `#f7f0eb`,
        theme_color: `#000000`,
        display: `standalone`,
        scope: '/',
        cache_busting_mode: 'none',
        icons: [
          {
            src: `/logo-192.png`,
            sizes: `192x192`,
            type: `image/png`,
          },
          {
            src: `/logo-512.png`,
            sizes: `512x512`,
            type: `image/png`,
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        cacheId: `gatsby-plugin-offline`,
        precachePages: ['/*'],
        workboxConfig: {
          maximumFileSizeToCacheInBytes: 100000000
        },
        appendScript: require.resolve(`./src/sw.js`),
      },
    },
  ],
}
