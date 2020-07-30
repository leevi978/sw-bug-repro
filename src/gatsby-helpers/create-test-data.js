async function createTestData(createSourceNode = async () => { }, getNode = async () => { }) {

  const locales = ['no', 'en-US']

  const options = {
    frontPage: {
      quantity: 1,
      type: 'FlamelinkFrontPageContent'
    },

    navbar: {
      quantity: 1,
      type: 'FlamelinkNavbarContent',
      childFlamelinkNavbarContentFieldExtraMenuOptionsItem:
      {
        title: 'test',
        redirectUrl: 'https://trondheim.no'
      }

    },

    pages: {
      quantity: 3,
      type: 'FlamelinkPageContent'
    },

    listingPages: {
      levels: 3,
      quantity: 3,
      type: 'FlamelinkListingPageContent'
    },
  }

  for (var l = 0; l < locales.length; l++) {
    const locale = locales[l]

    // Front page
    for (var i = 0; i < options.frontPage.quantity; i++) {
      const data = {
        flamelink_locale: locale
      }
      createSourceNode(options.frontPage.type, data, `${options.frontPage.type}-${locale}-${i}`)
    }

    // Navbar
    for (var i = 0; i < options.navbar.quantity; i++) {
      const data = {
        flamelink_locale: locale,
        childFlamelinkNavbarContentFieldExtraMenuOptionsItem: locale === 'no' ? options.navbar.childFlamelinkNavbarContentFieldExtraMenuOptionsItem : null
      }
      createSourceNode(options.navbar.type, data, `${options.navbar.type}-${locale}-${i}`)
    }

    // Pages
    for (var i = 0; i < options.pages.quantity; i++) {
      const data = {
        title: `Flamelink page ${i}`,
        slug: `page-${i}`,
        flamelink_locale: locale,
        showInDropMenu: (Math.random() >= 0.2)
      }
      createSourceNode(options.pages.type, data, `${options.pages.type}-${locale}-${i}`)
    }

    // ListingPages

    async function createListingPage(key, level) {
      const parentListingPageId = (level > 0) ? await createListingPage(key, level - 1) : null
      const data = {
        localTitle: `Flamelink listing page local title ${key} level ${level}`,
        navigationTitle: `Flamelink listing page ${key} - level ${level}`,
        slug: `listing-page-${key}-level-${level}`,
        flamelink_locale: locale,
        parentListingPage: parentListingPageId != null ? await getNode(parentListingPageId) : null,
        showInDropMenu: (Math.random() >= 0.4)
      }

      return createSourceNode(options.listingPages.type, data, `${options.listingPages.type}-${locale}-${key}-${level}`)
    }

    for (var i = 0; i < options.listingPages.quantity; i++) {
      await createListingPage(i, options.listingPages.levels)
    }
  }
}

module.exports = { createTestData }