import type { IncomingMessage, ServerResponse } from 'node:http'
import { insertProduct, readProduct } from '../service/product.service'
import type { IProduct } from '../types/product.type'
import { parseBody } from '../utility/parseBody'

export const productController = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const url = req.url
  const method = req.method

  const urlParts = url?.split('/')
  // console.log(urlParts)
  const productId =
    urlParts && urlParts[1] === 'products' ? Number(urlParts[2]) : null
  // console.log(productId)

  //get all products
  if (url === '/products' && method === 'GET') {
    const products = readProduct()
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(
      JSON.stringify({
        message: 'This route is for Product route',
        data: { products }
      })
    )
  } else if (method === 'GET' && productId !== null) {
    const products = readProduct()
    const product = products.find((p: IProduct) => p.id === productId)
    if (!product) {
      res.writeHead(404, { 'content-type': 'application/json' })
      res.end(
        JSON.stringify({
          message: 'Product not found',
          data: product
        })
      )
    }
    // console.log(product)
    // return product
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(
      JSON.stringify({
        message: 'Product retrieved successfully',
        data: product
      })
    )
  } else if (method === 'POST' && url === '/products') {
    const body = await parseBody(req)
    const id = Date.now() as number
    const products = readProduct()
    const createdProduct = {
      id,
      ...body
    }
    products.push(createdProduct)
    insertProduct(products)
    res.writeHead(201, {
      'content-type': 'application/json'
    })
    res.end(
      JSON.stringify({
        message: 'Product created successfully',
        data: products
      })
    )
  } else if (method === 'PUT' && productId !== null) {
    const body = await parseBody(req)
    const products = readProduct()

    const index = products.findIndex((p: IProduct) => p.id === productId)
    // console.log(index)
    if (index < 0) {
      res.writeHead(404, {
        'content-type': 'application/json'
      })
      res.end(
        JSON.stringify({
          message: 'Product not found',
          data: null
        })
      )
    }

    products[index] = { id: products[index].id, ...body }
    insertProduct(products)
    res.writeHead(201, {
      'content-type': 'application/json'
    })
    res.end(
      JSON.stringify({
        message: 'Product updated successfully',
        data: products[index]
      })
    )
  } else if (method === 'DELETE' && productId !== null) {
    const products = readProduct()
    const index = products.findIndex((p: IProduct) => p.id === productId)
    if (index < 0) {
      res.writeHead(404, {
        'content-type': 'application/json'
      })
      res.end(
        JSON.stringify({
          message: 'Product not found',
          data: null
        })
      )
    }
    products.splice(index, 1)
    insertProduct(products)
    res.writeHead(404, {
      'content-type': 'application/json'
    })
    res.end(
      JSON.stringify({
        message: 'Product deleted successfully',
        data: null
      })
    )
  } else {
    res.writeHead(404, { 'content-type': 'application/json' })
    res.end(
      JSON.stringify({
        message: 'Product not found'
      })
    )
  }
}
