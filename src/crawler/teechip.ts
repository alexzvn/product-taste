const shortCode = (code: string) => {
  const [, short] = /.*?-.*?-.*?-(.*?)-.*$/g.exec(code)

  return short
}

export default class TeeChip {

  async fetchVias() {
    const finder = /window.__INITIAL_STATE__ = (.*);/m

    const body = await (await fetch(window.location.href)).text()

    const [, initial] = finder.exec(body)

    return JSON.parse(initial).vias
  }

  getDesign (colors: Array<any>) {

    return colors.reduce((carry: any, item: any) => {
      carry[item.name] = {
        available: false,
        name: item.name,
        hex: item.hex,
        mockup: item.image,
        sizes: item.sizes
      }

      return carry
    }, {})
  }

  makeRawInfo (vias: any) {
    let product: any = {}

    for (const [code, data] of Object.entries(vias.Product.docs.code)) {
      const doc = (data as any).doc

      product[code] = {
        _id: doc._id,
        code: code,
        name: doc.name,
        type: doc.type,
        basePrice: Math.round(doc.TCPMinRetailPrice),

        category: doc.category,
        tags: doc.tags,

        designs: this.getDesign(doc.colors)
      }
    }

    return product
  }

  mergeInfo (vias: any) {
    const productInfo: any = this.makeRawInfo(vias)

    for (const [code, data] of Object.entries(vias.RetailProduct.docs.code)) {
      const doc     = (data as any).doc

      const design = {
        ...productInfo[shortCode(code)].designs[doc.color],
        available: true,
        slug: code,
        names: doc.names,
        price: Math.round(doc.price),
        images: doc.images.map((img: any) => {
          return {
            name: img.name,
            id: img.id,
            url: `${img.prefix}/regular.jpg`
          }
        })
      }

      productInfo[shortCode(code)].designs[doc.color] = design
    }

    return productInfo
  }

  merge (vias: any) {
    const products = Object.values(this.mergeInfo(vias));

    return products.map((product: any) => {
      return { ...product, designs: Object.values(product.designs) }
    })
  }

  commonName (products: Array<any>) {
    let commonDesign: any = {};

    products.forEach((product: any) => {
      product.designs.forEach((design: any) => {
        if (design.names && design.names.design ) {
          if (commonDesign[design.names.design]) {
            commonDesign[design.names.design] += 1
          } else {
            commonDesign[design.names.design] = 1
          }
        }
      });
    });

    const sortable = Object.entries(commonDesign)
      .sort(([, a],[,b]) => (b as any) - (a as any))

    return sortable[0][0]
  }

  async make () {
    const vias = await this.fetchVias()

    let products: Array<any> = this.merge(vias)

    const design: string = this.commonName(products)

    products = products.map(product => {
      product.designs = product.designs.reduce((carry: Array<any>, item: any) => {
        if (!item.names || !item.names.design || item.names.design !== design) {
          return carry
        }

        carry.push(item)

        return carry
      }, [])

      return product
    })

    return products
  }
}
