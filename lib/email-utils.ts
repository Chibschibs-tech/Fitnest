import nodemailer from "nodemailer"

// Helper function to safely get environmental variables with default values
function getEnv(key: string, defaultValue = ""): string {
  return process.env[key] || defaultValue
}

// Fitnest brand colors
const FITNEST_GREEN = "#015033" // Fitnest brand green
const FITNEST_DARK_GREEN = "#013d28" // Darker shade for buttons hover
const FITNEST_LIGHT_GREEN = "#e6f2ed" // Light green for backgrounds

// Create reusable transporter object using environment variables
const createTransporter = () => {
  const host = getEnv("EMAIL_SERVER_HOST")
  const port = Number(getEnv("EMAIL_SERVER_PORT"))
  const secure = getEnv("EMAIL_SERVER_SECURE") === "true"
  const user = getEnv("EMAIL_SERVER_USER")
  const pass = getEnv("EMAIL_SERVER_PASSWORD")
  const from = getEnv("EMAIL_FROM")

  // Validate essential config
  if (!host || !port || !user || !pass || !from) {
    console.error("Missing essential email configuration", {
      host: host ? "✓" : "✗",
      port: port ? "✓" : "✗",
      user: user ? "✓" : "✗",
      pass: pass ? "✓" : "✗",
      from: from ? "✓" : "✗",
    })
    throw new Error("Email configuration is incomplete. Check your environment variables.")
  }

  console.log("Creating email transporter with config:", {
    host,
    port,
    secure,
    user,
    passwordLength: pass.length || 0,
  })

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    // Add connection timeout to avoid hanging
    connectionTimeout: 5000, // 5 seconds
    // Enable retry mechanism for transient errors
    pool: true,
    maxConnections: 5,
    rateDelta: 1000,
    rateLimit: 5,
    debug: true, // Enable debug output - change to false in production
  })
}

// Verify transporter before sending
const verifyTransporter = async (transporter: nodemailer.Transporter) => {
  try {
    await transporter.verify()
    console.log("Transporter verification successful")
    return true
  } catch (error) {
    console.error("Transporter verification failed:", error)
    throw error
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    console.log(`Attempting to send welcome email to ${email} for user ${name}`)

    // Create and verify transporter
    const transporter = createTransporter()
    await verifyTransporter(transporter)

    const firstName = name.split(" ")[0]

    const mailOptions = {
      from: getEnv("EMAIL_FROM"),
      to: email,
      subject: "Welcome to Fitnest.ma!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: ${FITNEST_GREEN}; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Welcome to Fitnest.ma</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #eee;">
            <p>Hello ${firstName},</p>
            <p>Thank you for joining Fitnest.ma! We're excited to have you as part of our community.</p>
            <p>With your new account, you can:</p>
            <ul>
              <li>Browse and order from our meal plans</li>
              <li>Shop for healthy products in our Express Shop</li>
              <li>Track your orders and deliveries</li>
              <li>Customize your meal preferences</li>
            </ul>
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://fitnest.ma/meal-plans" style="background-color: ${FITNEST_GREEN}; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Explore Meal Plans</a>
            </div>
            <p style="margin-top: 30px;">Best regards,<br>The Fitnest.ma Team</p>
          </div>
          <div style="background-color: ${FITNEST_LIGHT_GREEN}; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>© ${new Date().getFullYear()} Fitnest.ma. All rights reserved.</p>
            <p>If you have any questions, please contact us at support@fitnest.ma</p>
          </div>
        </div>
      `,
      // Add text alternative for better deliverability and accessibility
      text: `Welcome to Fitnest.ma!
      
Hello ${firstName},

Thank you for joining Fitnest.ma! We're excited to have you as part of our community.

With your new account, you can:
- Browse and order from our meal plans
- Shop for healthy products in our Express Shop
- Track your orders and deliveries
- Customize your meal preferences

If you have any questions or need assistance, please contact our support team.

Best regards,
The Fitnest.ma Team

© ${new Date().getFullYear()} Fitnest.ma. All rights reserved.
`,
    }

    console.log("Sending welcome email with options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    })

    // Implement retry mechanism for transient errors
    let retries = 0
    const maxRetries = 3

    while (retries < maxRetries) {
      try {
        const info = await transporter.sendMail(mailOptions)
        console.log(`Welcome email sent to ${email}: ${info.messageId}`)
        console.log("Full email sending response:", info)
        return { success: true, messageId: info.messageId, response: info.response }
      } catch (error) {
        retries++
        if (retries >= maxRetries) {
          throw error
        }
        console.log(`Retrying email send (${retries}/${maxRetries}) after error:`, error)
        // Wait before retry with exponential backoff
        await new Promise((resolve) => setTimeout(resolve, 1000 * retries))
      }
    }

    // This should not be reached due to the throw in the catch block above
    return { success: false, error: "Failed after maximum retries" }
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      details: error,
    }
  }
}

export async function sendOrderConfirmationEmail(orderData: any) {
  try {
    const { customerName, customerEmail, orderId, totalAmount, items = [], deliveryAddress } = orderData

    if (!customerEmail || !orderId) {
      console.error("Cannot send order confirmation: missing required fields")
      return { success: false, error: "Missing required fields" }
    }

    // Create and verify transporter
    const transporter = createTransporter()
    await verifyTransporter(transporter)

    const firstName = customerName?.split(" ")[0] || "Customer"
    const formattedTotal = (totalAmount / 100).toFixed(2)

    // Format items for display
    let itemsHtml = ""
    let itemsText = ""

    if (Array.isArray(items) && items.length > 0) {
      itemsHtml = items
        .map((item) => {
          const price = item.price ? (item.price / 100).toFixed(2) : "0.00"
          return `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name || "Product"}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity || 1}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${price} MAD</td>
          </tr>
        `
        })
        .join("")

      itemsText = items
        .map((item) => {
          const price = item.price ? (item.price / 100).toFixed(2) : "0.00"
          return `${item.name || "Product"} x ${item.quantity || 1} - ${price} MAD`
        })
        .join("\n")
    } else {
      // Handle meal plan orders
      itemsHtml = `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">Meal Plan Subscription</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">1</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formattedTotal} MAD</td>
        </tr>
      `
      itemsText = `Meal Plan Subscription - ${formattedTotal} MAD`
    }

    const mailOptions = {
      from: getEnv("EMAIL_FROM"),
      to: customerEmail,
      subject: `Fitnest.ma Order Confirmation #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: ${FITNEST_GREEN}; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Order Confirmation</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #eee;">
            <p>Hello ${firstName},</p>
            <p>Thank you for your order! We've received your payment and are processing your order now.</p>
            
            <div style="background-color: ${FITNEST_LIGHT_GREEN}; padding: 15px; margin: 20px 0; border-radius: 4px;">
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
            
            ${
              deliveryAddress
                ? `
            <h3>Delivery Address</h3>
            <p>${deliveryAddress}</p>
            `
                : ""
            }
            
            <p>We'll notify you when your order ships. You can also check your order status anytime by visiting your account dashboard.</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://fitnest.ma/orders" style="background-color: ${FITNEST_GREEN}; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Your Orders</a>
            </div>
            
            <p style="margin-top: 30px;">Thank you for choosing Fitnest.ma!</p>
            <p>Best regards,<br>The Fitnest.ma Team</p>
          </div>
          <div style="background-color: ${FITNEST_LIGHT_GREEN}; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>© ${new Date().getFullYear()} Fitnest.ma. All rights reserved.</p>
            <p>If you have any questions, please contact us at support@fitnest.ma</p>
          </div>
        </div>
      `,
      text: `Order Confirmation #${orderId}
      
Hello ${firstName},

Thank you for your order! We've received your payment and are processing your order now.

ORDER SUMMARY
Order ID: ${orderId}
Date: ${new Date().toLocaleDateString()}
Total: ${formattedTotal} MAD

ITEMS
${itemsText}

${
  deliveryAddress
    ? `DELIVERY ADDRESS
${deliveryAddress}

`
    : ""
}
We'll notify you when your order ships. You can also check your order status anytime by visiting your account dashboard.

Thank you for choosing Fitnest.ma!

Best regards,
The Fitnest.ma Team

© ${new Date().getFullYear()} Fitnest.ma. All rights reserved.
`,
    }

    // Implement retry mechanism for transient errors
    let retries = 0
    const maxRetries = 3

    while (retries < maxRetries) {
      try {
        const info = await transporter.sendMail(mailOptions)
        console.log(`Order confirmation email sent to ${customerEmail}: ${info.messageId}`)
        return { success: true, messageId: info.messageId }
      } catch (error) {
        retries++
        if (retries >= maxRetries) {
          throw error
        }
        console.log(`Retrying email send (${retries}/${maxRetries}) after error:`, error)
        // Wait before retry with exponential backoff
        await new Promise((resolve) => setTimeout(resolve, 1000 * retries))
      }
    }

    return { success: false, error: "Failed after maximum retries" }
  } catch (error) {
    console.error("Error sending order confirmation email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      details: error,
    }
  }
}

export async function sendDeliveryUpdateEmail(orderData: any) {
  try {
    const { email, name, orderId, status } = orderData

    if (!email || !orderId || !status) {
      console.error("Cannot send delivery update: missing required fields")
      return { success: false, error: "Missing required fields" }
    }

    // Create and verify transporter
    const transporter = createTransporter()
    await verifyTransporter(transporter)

    const firstName = name?.split(" ")[0] || "Customer"

    // Customize message based on status
    let statusMessage = ""
    let statusTitle = ""

    switch (status.toLowerCase()) {
      case "shipped":
        statusTitle = "Your Order Has Shipped!"
        statusMessage = "Great news! Your order is on its way to you."
        break
      case "delivered":
        statusTitle = "Your Order Has Been Delivered!"
        statusMessage = "Your order has been delivered. We hope you enjoy it!"
        break
      case "processing":
        statusTitle = "Your Order is Being Prepared"
        statusMessage = "We're currently preparing your order and will ship it soon."
        break
      default:
        statusTitle = "Order Status Update"
        statusMessage = `Your order status has been updated to: ${status}`
    }

    const mailOptions = {
      from: getEnv("EMAIL_FROM"),
      to: email,
      subject: `${statusTitle} - Fitnest.ma Order #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: ${FITNEST_GREEN}; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">${statusTitle}</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #eee;">
            <p>Hello ${firstName},</p>
            <p>${statusMessage}</p>
            
            <div style="background-color: ${FITNEST_LIGHT_GREEN}; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <h2 style="margin-top: 0;">Order Details</h2>
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Status:</strong> ${status}</p>
              <p><strong>Updated:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://fitnest.ma/orders" style="background-color: ${FITNEST_GREEN}; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Track Your Order</a>
            </div>
            
            <p style="margin-top: 30px;">Thank you for choosing Fitnest.ma!</p>
            <p>Best regards,<br>The Fitnest.ma Team</p>
          </div>
          <div style="background-color: ${FITNEST_LIGHT_GREEN}; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>© ${new Date().getFullYear()} Fitnest.ma. All rights reserved.</p>
            <p>If you have any questions, please contact us at support@fitnest.ma</p>
          </div>
        </div>
      `,
      text: `${statusTitle} - Order #${orderId}
      
Hello ${firstName},

${statusMessage}

ORDER DETAILS
Order ID: ${orderId}
Status: ${status}
Updated: ${new Date().toLocaleDateString()}

You can track your order at: https://fitnest.ma/orders

Thank you for choosing Fitnest.ma!

Best regards,
The Fitnest.ma Team

© ${new Date().getFullYear()} Fitnest.ma. All rights reserved.
`,
    }

    // Implement retry mechanism for transient errors
    let retries = 0
    const maxRetries = 3

    while (retries < maxRetries) {
      try {
        const info = await transporter.sendMail(mailOptions)
        console.log(`Delivery update email sent to ${email}: ${info.messageId}`)
        return { success: true, messageId: info.messageId }
      } catch (error) {
        retries++
        if (retries >= maxRetries) {
          throw error
        }
        console.log(`Retrying email send (${retries}/${maxRetries}) after error:`, error)
        // Wait before retry with exponential backoff
        await new Promise((resolve) => setTimeout(resolve, 1000 * retries))
      }
    }

    return { success: false, error: "Failed after maximum retries" }
  } catch (error) {
    console.error("Error sending delivery update email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      details: error,
    }
  }
}

// Helper function to check if emails can be sent
export async function checkEmailConfig() {
  try {
    // Validate environment variables
    const host = getEnv("EMAIL_SERVER_HOST")
    const port = getEnv("EMAIL_SERVER_PORT")
    const user = getEnv("EMAIL_SERVER_USER")
    const pass = getEnv("EMAIL_SERVER_PASSWORD")
    const from = getEnv("EMAIL_FROM")

    if (!host || !port || !user || !pass || !from) {
      return {
        configured: false,
        missing: {
          host: !host,
          port: !port,
          user: !user,
          password: !pass,
          from: from,
        },
      }
    }

    // Create transporter but don't verify connection
    // This makes the function faster while still checking config
    return { configured: true }
  } catch (error) {
    return {
      configured: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
