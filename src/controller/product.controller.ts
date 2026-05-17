import type { IncomingMessage, ServerResponse } from 'node:http'
import { insertProduct, readProduct } from '../service/product.service'
import type { IProduct } from '../types/product.type'
import { parseBody } from '../utility/parseBody'
import { sendResponse } from '../utility/sendResponse'

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
    try {
      const products = readProduct()
      return sendResponse(
        200,
        res,
        true,
        'Products retrieved successfully',
        products
      )
    } catch (error) {
      return sendResponse(500, res, false, 'Products fetching failed!', error)
    }
  } else if (method === 'GET' && productId !== null) {
    const products = readProduct()
    const product = products.find((p: IProduct) => p.id === productId)
    if (!product) {
      return sendResponse(404, res, false, 'Product not found')
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
    try {
      const products = readProduct()
      return sendResponse(
        200,
        res,
        true,
        'Products retrieved successfully',
        products
      )
    } catch (error) {
      return sendResponse(500, res, false, 'Products creation failed!', error)
    }
  } else if (method === 'PUT' && productId !== null) {
    const body = await parseBody(req)
    const products = readProduct()

    const index = products.findIndex((p: IProduct) => p.id === productId)
    // console.log(index)
    if (index < 0) return sendResponse(404, res, false, 'product not found')

    products[index] = { id: products[index].id, ...body }
    insertProduct(products)

    try {
      sendResponse(
        201,
        res,
        true,
        'Product updated successfully',
        products[index]
      )
    } catch (error) {
      return sendResponse(500, res, false, 'Something went wrong', error)
    }
  } else if (method === 'DELETE' && productId !== null) {
    const products = readProduct()
    const index = products.findIndex((p: IProduct) => p.id === productId)
    if (index < 0) return sendResponse(404, res, false, 'product not found')

    products.splice(index, 1)
    insertProduct(products)

    try {
      sendResponse(
        200,
        res,
        true,
        'Product deleted successfully',
        products[index]
      )
    } catch (error) {
      return sendResponse(500, res, false, 'Something went wrong', error)
    }
  } else {
    return sendResponse(500, res, false, 'Something went wrong')
  }
}
