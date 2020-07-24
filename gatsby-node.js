
// Create blog pages dynamically
exports.createPages = async ({ graphql, actions }) => {
  const path = require(`path`)
  const { createPage } = actions
  const template = path.resolve(`src/templates/template.js`)
  const home = path.resolve(`src/templates/home.js`)

  var links = []

  for (var level = 0; level < 10; level++) {
    for (var pageNumber = 0; pageNumber < 300; pageNumber++) {
      const pageName = `page-${pageNumber}`
      var pagePath = `/${pageName}`
      for (var i = level; i >= 0; i--) {
        pagePath = `/level-${i}${pagePath}`
      }
      links.push(pagePath)
    }
  }

  links.map(pagePath => {
    createPage({
      path: pagePath,
      component: template,
      context: {
        title: pagePath.split('/').pop(),
        links: links
      }
    })
  })

  createPage({
    path: '/',
    component: home,
    context: {
      links: links
    }
  })

}