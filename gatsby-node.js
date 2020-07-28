
// Create blog pages dynamically
exports.createPages = async ({ graphql, actions }) => {
  const path = require(`path`)
  const { createPage } = actions
  const template = path.resolve(`src/templates/template.js`)
  const home = path.resolve(`src/templates/home.js`)

  var links = []

  for (var level = 0; level < 20; level++) {
    const index = Math.floor(Math.random() * 9)
    for (var pageNumber = 0; pageNumber < 5; pageNumber++) {
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
        links: links.slice(0, 50)
      }
    })
  })

  createPage({
    path: '/',
    component: home,
    context: {
      links: links.slice(0, 50)
    }
  })
}

exports.onPostBuild = async (args, _ref3) => {

  const fs = require('fs')
  const workboxBuild = require('workbox-build');

  // NOTE: This should be run *AFTER* all your assets are built
  // This will return a Promise
  console.log("Building sw...")
  await (workboxBuild.injectManifest({
    swSrc: './static/sw-temp.js',
    swDest: './public/sw-temp.js',
    globDirectory: 'public',
    globPatterns: [
      '**/*',
    ]
  }).then(({ count, size, warnings }) => {
    console.log("Build sw complete.")
    // Optionally, log any warnings and details.
    warnings.forEach(console.warn);
    console.log(`${count} files will be precached, totaling ${size} bytes.`);
  }));

  const { PWAManifest } = await require('./public/sw-temp.js')
  const sw = await fs.readFileSync('public/sw.js', 'utf8')

  var precacheFiles = []
  var discardedFiles = []
  PWAManifest.map(file => {
    if (!sw.includes(`"url": "${file.url}"`)) {
      precacheFiles.push(file)
    }
    else {
      discardedFiles.push(file)
    }
  })

  await fs.writeFileSync('public/sw.js', sw.replace('self.__WB_MANIFEST',
    `[${precacheFiles.map(file => `\n${JSON.stringify(file)}`)}]`))

  console.log(`Discarded files: \n${discardedFiles.map(file => `\n${JSON.stringify(file)}`)}`)

}