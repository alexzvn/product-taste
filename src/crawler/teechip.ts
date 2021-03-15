/**
 * Contain all current products data
 */
const vias = (window as any).__INITIAL_STATE__.vias

const shortCode = (code: string) => {
  const [, short] = /.*?-.*?-.*?-(.*?)-.*$/g.exec(code)

  return short
}

const exampleItem = [{
  _id: "587d0d90f43ea40e13382dc2",
  code: "TC1000",
  name: "Phone Case",
  type: "case",
  basePrice: 1560,

  category: 'case',

  tags: {
    size: ['case'],
    product: ['case'],
    department: ['accessories']
  },

  designs: [
    {
      slug: 'abc-xyz-abc',
      color: 'White',
      hex: 'FFFFFF',
      price: 1235,
      mockup: "url://image",
      names: {
        product: "Classic T-Shirt",
        design: "I asked god to make me a Better Men he sent me kid"
      },
      sizes: [
        { name: "sml", outOfStock: false },
        { name: "med", outOfStock: false },
        { name: "lrg", outOfStock: false },
        { name: "xlg", outOfStock: false },
        { name: "xxl", outOfStock: false }
      ],
      images: [{ name: 'abc 123', id: 'abc-123', url: 'url://image.jpg' }]
    }
  ],
}]

export default class TeeChip {

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

  makeRawInfo () {
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

  mergeInfo () {
    const productInfo: any = this.makeRawInfo()

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

  merge () {
    const products = Object.values(this.mergeInfo());

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

  make () {
    let products: Array<any> = this.merge()

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
