import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET(request: NextRequest) {
  try {
    // Initialize the Neon SQL client
    const sql = neon(process.env.DATABASE_URL!)

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const id = searchParams.get("id")

    let productData

    if (id) {
      // Get a specific product by ID
      productData = await sql`
        SELECT * FROM products 
        WHERE id = ${Number.parseInt(id)}
        LIMIT 1
      `

      if (productData.length === 0) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }

      // Transform column names for frontend consistency
      const product = productData[0]
      return NextResponse.json({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        salePrice:
          product.saleprice !== undefined
            ? product.saleprice
            : product.sale_price !== undefined
              ? product.sale_price
              : null,
        imageUrl:
          product.imageurl !== undefined
            ? product.imageurl
            : product.image_url !== undefined
              ? product.image_url
              : null,
        category: product.category,
        tags: product.tags,
        nutritionalInfo:
          product.nutritionalinfo !== undefined
            ? product.nutritionalinfo
            : product.nutritional_info !== undefined
              ? product.nutritional_info
              : null,
        stock: product.stock,
        isActive:
          product.isactive !== undefined
            ? product.isactive
            : product.is_active !== undefined
              ? product.is_active
              : true,
      })
    } else if (category) {
      // Get products by category - without filtering by isactive/is_active
      productData = await sql`
        SELECT * FROM products 
        WHERE category = ${category}
      `
    } else {
      // Get all products - without filtering by isactive/is_active
      productData = await sql`
        SELECT * FROM products
      `
    }

    // Add debugging
    console.log(`Found ${productData.length} products`)
    if (productData.length > 0) {
      console.log("First product structure:", Object.keys(productData[0]))
    }

    // Transform column names for frontend consistency
    const transformedProducts = productData.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      salePrice:
        product.saleprice !== undefined
          ? product.saleprice
          : product.sale_price !== undefined
            ? product.sale_price
            : null,
      imageUrl:
        product.imageurl !== undefined ? product.imageurl : product.image_url !== undefined ? product.image_url : null,
      category: product.category,
      tags: product.tags,
      nutritionalInfo:
        product.nutritionalinfo !== undefined
          ? product.nutritionalinfo
          : product.nutritional_info !== undefined
            ? product.nutritional_info
            : null,
      stock: product.stock,
      isActive:
        product.isactive !== undefined ? product.isactive : product.is_active !== undefined ? product.is_active : true,
    }))

    // Return empty array instead of undefined if no products found
    return NextResponse.json(transformedProducts || [])
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Initialize the Neon SQL client
    const sql = neon(process.env.DATABASE_URL!)

    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.description || !data.price || !data.category) {
      return NextResponse.json(
        { error: "Missing required fields: name, description, price, and category are required" },
        { status: 400 },
      )
    }

    // Insert the new product using column names without underscores
    const newProduct = await sql`
      INSERT INTO products 
      (name, description, price, saleprice, imageurl, category, tags, nutritionalinfo, stock, isactive)
      VALUES 
      (${data.name}, ${data.description}, ${data.price}, ${data.salePrice || null}, 
       ${data.imageUrl || null}, ${data.category}, ${data.tags || null}, 
       ${data.nutritionalInfo ? JSON.stringify(data.nutritionalInfo) : null}::jsonb, 
       ${data.stock || 0}, ${data.isActive !== undefined ? data.isActive : true})
      RETURNING *
    `

    // Transform column names for frontend consistency
    const product = newProduct[0]
    return NextResponse.json(
      {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        salePrice:
          product.saleprice !== undefined
            ? product.saleprice
            : product.sale_price !== undefined
              ? product.sale_price
              : null,
        imageUrl:
          product.imageurl !== undefined
            ? product.imageurl
            : product.image_url !== undefined
              ? product.image_url
              : null,
        category: product.category,
        tags: product.tags,
        nutritionalInfo:
          product.nutritionalinfo !== undefined
            ? product.nutritionalinfo
            : product.nutritional_info !== undefined
              ? product.nutritional_info
              : null,
        stock: product.stock,
        isActive:
          product.isactive !== undefined
            ? product.isactive
            : product.is_active !== undefined
              ? product.is_active
              : true,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
