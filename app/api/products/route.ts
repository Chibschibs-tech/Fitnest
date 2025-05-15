import { type NextRequest, NextResponse } from "next/server"
import { getProducts, ensureProductsExist } from "@/lib/db-utils"

export async function GET(request: NextRequest) {
  try {
    // Ensure products exist
    await ensureProductsExist()

    // Get products
    const products = await getProducts()

    return NextResponse.json({
      success: true,
      products,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Initialize the Neon SQL client
    // const sql = neon(process.env.DATABASE_URL!) // This is likely unused now

    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.description || !data.price || !data.category) {
      return NextResponse.json(
        { error: "Missing required fields: name, description, price, and category are required" },
        { status: 400 },
      )
    }

    // Insert the new product using column names without underscores
    // const newProduct = await sql` // This is likely unused now
    //   INSERT INTO products
    //   (name, description, price, saleprice, imageurl, category, tags, nutritionalinfo, stock, isactive)
    //   VALUES
    //   (${data.name}, ${data.description}, ${data.price}, ${data.salePrice || null},
    //    ${data.imageUrl || null}, ${data.category}, ${data.tags || null},
    //    ${data.nutritionalInfo ? JSON.stringify(data.nutritionalInfo) : null}::jsonb,
    //    ${data.stock || 0}, ${data.isActive !== undefined ? data.isActive : true})
    //   RETURNING *
    // `

    // Transform column names for frontend consistency
    // const product = newProduct[0] // This is likely unused now
    // return NextResponse.json(
    //   {
    //     id: product.id,
    //     name: product.name,
    //     description: product.description,
    //     price: product.price,
    //     salePrice:
    //       product.saleprice !== undefined
    //         ? product.saleprice
    //         : product.sale_price !== undefined
    //           ? product.sale_price
    //           : null,
    //     imageUrl:
    //       product.imageurl !== undefined
    //         ? product.imageurl
    //         : product.image_url !== undefined
    //           ? product.image_url
    //           : null,
    //     category: product.category,
    //     tags: product.tags,
    //     nutritionalInfo:
    //       product.nutritionalinfo !== undefined
    //         ? product.nutritionalinfo
    //         : product.nutritional_info !== undefined
    //           ? product.nutritional_info
    //           : null,
    //     stock: product.stock,
    //     isActive:
    //       product.isactive !== undefined
    //         ? product.isactive
    //         : product.is_active !== undefined
    //           ? product.is_active
    //           : true,
    //   },
    //   { status: 201 },
    // )
    return NextResponse.json({ message: "POST request received" }, { status: 200 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
