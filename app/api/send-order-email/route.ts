import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

// Create reusable transporter object using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT || "587"),
  secure: process.env.EMAIL_SERVER_SECURE === "true",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { orderId, customerName, customerEmail, totalAmount, items = [] } = data

    if (!customerEmail || !orderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const firstName = customerName?.split(" ")[0] || "Customer"
    const formattedTotal = typeof totalAmount === "number" ? totalAmount.toFixed(2) : "0.00"

    // Format items for display
    let itemsHtml = ""

    if (Array.isArray(items) && items.length > 0) {
      itemsHtml = items
        .map((item) => {
          const price = item.price ? item.price.toFixed(2) : "0.00"
          return `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name || "Product"}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity || 1}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${price} MAD</td>
          </tr>
        `
        })
        .join("")
    } else {
      // Handle meal plan orders
      itemsHtml = `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">Meal Plan Subscription</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">1</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formattedTotal} MAD</td>
        </tr>
      `
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: customerEmail,
      subject: `Fitnest.ma Order Confirmation #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #015033; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Order Confirmation</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #eee;">
            <p>Hello ${firstName},</p>
            <p>Thank you for your order! We've received your payment and are processing your order now.</p>
            
            <div style="background-color: #e6f2ed; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <h2 style="margin-top: 0;">Order Summary</h2>
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Total:</strong> ${formattedTotal} MAD</p>
            </div>
            
            <h3>Items</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f5f5f5;">
                  <th style="padding: 10px; text-align: left;">Item</th>
                  <th style="padding: 10px; text-align: center;">Qty</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
                  <td style="padding: 10px; text-align: right; font-weight: bold;">${formattedTotal} MAD</td>
                </tr>
              </tfoot>
            </table>
            
            <p>We'll notify you when your order ships. You can also check your order status anytime by visiting your account dashboard.</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://fitnest.ma/orders" style="background-color: #015033; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Your Orders</a>
            </div>
            
            <p style="margin-top: 30px;">Thank you for choosing Fitnest.ma!</p>
            <p>Best regards,<br>The Fitnest.ma Team</p>
          </div>
          <div style="background-color: #e6f2ed; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>© ${new Date().getFullYear()} Fitnest.ma. All rights reserved.</p>
            <p>If you have any questions, please contact us at support@fitnest.ma</p>
          </div>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
