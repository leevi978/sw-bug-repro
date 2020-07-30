function resolvePath(node) {

  const rootPath = getRootPath(node.flamelink_locale)
  var path = node.slug

  var parentListingPage = node.parentListingPage
  while (parentListingPage != null) {
    if (parentListingPage.slug != null) {
      path = `${parentListingPage.slug}/${path}`
    }

    parentListingPage = parentListingPage.parentListingPage
  }
  return `${rootPath}${path}`
}

function getRootPath(locale) {
  return locale === 'no' ? '/' : `/${locale.split('-')[0]}/`
}

function resolveMenuData(node) {

  const resolvers = [
    {
      type: 'FlamelinkFrontPageContent',
      resolver: (node) => {
        return {
          title: node.flamelink_locale === 'no' ? 'Hjem' : 'Home',
          slug: '',
          locale: node.flamelink_locale,
          path: getRootPath(node.flamelink_locale)
        }
      }
    },

    {
      type: 'FlamelinkListingPageContent',
      resolver: (node) => {
        return (node.showInDropMenu) ? {
          title: node.navigationTitle,
          slug: node.slug,
          locale: node.flamelink_locale,
          path: resolvePath(node),
        } : null
      }
    },

    {
      type: 'FlamelinkPageContent',
      resolver: (node) => {
        return (node.showInDropMenu) ? {
          title: node.title,
          slug: node.slug,
          locale: node.flamelink_locale,
          path: `${getRootPath(node.flamelink_locale)}${node.slug}`,
        } : null
      }
    },
  ]

  var result = null
  if (node.internal) {
    if (node.internal.type) {
      for (var i = 0; i < resolvers.length; i++) {
        const r = resolvers[i]
        if (r.type === node.internal.type) {
          result = r.resolver(node)
          break;
        }
      }
    }
  }
  return result
}

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest, getNodesByType, getNode }) => {
  const { createNode } = actions

  const { createTestData } = require('./create-test-data')

  async function createSourceNode(type, data, key, parent = null, children = []) {
    const nodeContent = JSON.stringify(data)
    const nodeMeta = {
      id: await createNodeId(key),
      parent: parent,
      children: [],
      internal: {
        type: type,
        mediaType: `text/html`,
        content: nodeContent,
        contentDigest: await createContentDigest(data)
      }
    }
    const node = Object.assign({}, data, nodeMeta)
    await createNode(node)
    return nodeMeta.id
  }

  await createTestData(createSourceNode, getNode)
  console.log("Created test data.")

  var menuDataMap = new Map()
  let [
    frontPage,
    pages,
    listingPages,
    navbar,
  ] = await Promise.all([
    getNodesByType('FlamelinkFrontPageContent'),
    getNodesByType('FlamelinkPageContent'),
    getNodesByType('FlamelinkListingPageContent'),
    getNodesByType('FlamelinkNavbarContent')
  ])

  const result = frontPage.concat(pages).concat(listingPages)

  result.map(node => {
    const locale = node.flamelink_locale
    if (!menuDataMap.has(locale)) {
      menuDataMap.set(locale, new Array())
    }
    const data = resolveMenuData(node)
    if (data != null) {
      menuDataMap.get(locale).push(data)
    }
  })

  Array.from(menuDataMap.keys()).map(locale => {
    const data = {
      locale: locale,
      menuItems: menuDataMap.get(locale)
    }
    createSourceNode('MenuDataContent', data, `${locale}-0`)
  })
}