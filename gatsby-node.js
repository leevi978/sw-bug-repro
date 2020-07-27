
// Create blog pages dynamically
exports.createPages = async ({ graphql, actions }) => {
  const path = require(`path`)
  const { createPage } = actions
  const template = path.resolve(`src/templates/template.js`)
  const home = path.resolve(`src/templates/home.js`)

  var links = []

  for (var level = 0; level < 5; level++) {
    for (var pageNumber = 0; pageNumber < 3; pageNumber++) {
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

exports.onPostBuild = (args, _ref3) => {

  const glob = require('glob')
  const fs = require('fs')
  var _ = require("lodash");
  var path = require("path");
  var getResourcesFromHTML = require("./get-resources-from-html");

  const globs = ['/**/']
  const rootDir = 'public'
  const base = process.cwd() + "/" + rootDir

  var pathPrefix = args.pathPrefix

  function flat(arr) {
    var _ref4;

    return Array.prototype.flat ? arr.flat() : (_ref4 = []).concat.apply(_ref4, arr);
  }

  var s;

  var readStats = function readStats() {
    if (s) {
      return s;
    } else {
      s = JSON.parse(fs.readFileSync(process.cwd() + "/public/webpack.stats.json", "utf-8"));
      return s;
    }
  };

  function getAssetsForChunks(chunks) {
    var files = _.flatten(chunks.map(function (chunk) {
      return readStats().assetsByChunkName[chunk];
    }));

    return _.compact(files);
  }

  var files = getAssetsForChunks([]);

  function getPrecachePages() {

    var precachePages = [];

    globs.forEach(function (page) {
      var matches = glob.sync(base + page);
      matches.forEach(function (path) {
        var isDirectory = fs.lstatSync(path).isDirectory();
        var precachePath;

        if (isDirectory && fs.existsSync(path + "index.html")) {
          precachePath = path + "index.html";
        } else if (path.endsWith(".html")) {
          precachePath = path;
        } else {
          return;
        }

        if (precachePages.indexOf(precachePath) === -1) {
          precachePages.push(precachePath);
        }
      });
    });
    return precachePages
  }
  const precachePages = getPrecachePages()

  var criticalFilePaths = _.uniq(flat(precachePages.map(function (page) {
    return getResourcesFromHTML(page, pathPrefix);
  })));
  console.log(base)

  var alteredBase = base.split('\\').join('/')

  const swAppend = `\n\nprecacheResources = [${precachePages.concat(criticalFilePaths)
    .map(file => `"${file.split('\\').join('/').replace(alteredBase, '')}"`)}]`

  fs.appendFileSync("public/sw.js", swAppend);
}