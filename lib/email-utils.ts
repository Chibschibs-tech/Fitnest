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

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number.parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  secure: process.env.EMAIL_SERVER_SECURE === "true",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Welcome to Fitnest.ma!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #015033; color: white; padding: 20px;">
          <h1 style="color: white; text-align: center;">Welcome to Fitnest.ma!</h1>
          <p>Hi ${name},</p>
          <p>Thank you for joining Fitnest.ma! We're excited to help you on your fitness journey with our healthy meal delivery service.</p>
          <p>Your account has been successfully created and you can now:</p>
          <ul>
            <li>Browse our meal plans</li>
            <li>Customize your preferences</li>
            <li>Schedule deliveries</li>
            <li>Track your orders</li>
          </ul>
          <p>Get started by exploring our meal plans and finding the perfect fit for your lifestyle.</p>
          <p>Best regards,<br>The Fitnest.ma Team</p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return { success: false, error: error.message }
  }
}

export async function sendOrderConfirmationEmail(email: string, orderDetails: any) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Order Confirmation - Fitnest.ma",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #015033; color: white; padding: 20px;">
          <h1 style="color: white; text-align: center;">Order Confirmation</h1>
          <p>Thank you for your order!</p>
          <p>Order ID: ${orderDetails.id}</p>
          <p>Total: $${orderDetails.total}</p>
          <p>We'll prepare your meals with care and deliver them fresh to your door.</p>
          <p>Best regards,<br>The Fitnest.ma Team</p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error("Error sending order confirmation email:", error)
    return { success: false, error: error.message }
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
