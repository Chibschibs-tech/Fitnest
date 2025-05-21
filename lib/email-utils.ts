import nodemailer from "nodemailer"

// Helper function to safely get environmental variables with default values
function getEnv(key: string, defaultValue = ""): string {
  return process.env[key] || defaultValue
}

// Create reusable transporter object using environment variables
const createTransporter = () => {
  // Use the provided email configuration
  const host = "smtp.gmail.com"
  const port = 587
  const secure = false
  const user = "noreply@fitnest.ma"
  const pass = "lfih nrfi ybfo asud"
  const from = "Fitnest.ma <noreply@fitnest.ma>"

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
      from: "Fitnest.ma <noreply@fitnest.ma>",
      to: email,
      subject: "Welcome to Fitnest.ma!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #4CAF50; padding: 20px; text-align: center;">
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
              <a href="https://fitnest.ma/meal-plans" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Explore Meal Plans</a>
            </div>
            <p style="margin-top: 30px;">Best regards,<br>The Fitnest.ma Team</p>
          </div>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
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

If you have any questions or need assistance, please don't hesitate to contact our support team.

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
    const transporter = createTransporter()
    await verifyTransporter(transporter)

    const mailOptions = {
      from: "Fitnest.ma <noreply@fitnest.ma>",
      to: orderData.email,
      subject: `Order Confirmation #${orderData.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #4CAF50; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Order Confirmation</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #eee;">
            <p>Hello ${orderData.name},</p>
            <p>Thank you for your order! We've received your order and are processing it now.</p>
            <p><strong>Order ID:</strong> ${orderData.orderId}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> ${orderData.total} MAD</p>
            <p>You can track your order status in your account dashboard.</p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://fitnest.ma/dashboard/orders" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Track Your Order</a>
            </div>
            <p style="margin-top: 30px;">Best regards,<br>The Fitnest.ma Team</p>
          </div>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>© ${new Date().getFullYear()} Fitnest.ma. All rights reserved.</p>
            <p>If you have any questions, please contact us at support@fitnest.ma</p>
          </div>
        </div>
      `,
      text: `Order Confirmation #${orderData.orderId}
      
Hello ${orderData.name},

Thank you for your order! We've received your order and are processing it now.

Order ID: ${orderData.orderId}
Order Date: ${new Date().toLocaleDateString()}
Total Amount: ${orderData.total} MAD

You can track your order status in your account dashboard.

Best regards,
The Fitnest.ma Team

© ${new Date().getFullYear()} Fitnest.ma. All rights reserved.
`,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log(`Order confirmation email sent to ${orderData.email}: ${info.messageId}`)
    return { success: true, messageId: info.messageId, response: info.response }
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
    const transporter = createTransporter()
    await verifyTransporter(transporter)

    const mailOptions = {
      from: "Fitnest.ma <noreply@fitnest.ma>",
      to: orderData.email,
      subject: `Delivery Update for Order #${orderData.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #4CAF50; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Delivery Update</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #eee;">
            <p>Hello ${orderData.name},</p>
            <p>We're pleased to inform you that your order #${orderData.orderId} has been ${orderData.status}.</p>
            <p><strong>Order ID:</strong> ${orderData.orderId}</p>
            <p><strong>Status:</strong> ${orderData.status}</p>
            <p><strong>Estimated Delivery:</strong> ${orderData.estimatedDelivery || "As soon as possible"}</p>
            <p>You can track your order status in your account dashboard.</p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://fitnest.ma/dashboard/orders" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Track Your Order</a>
            </div>
            <p style="margin-top: 30px;">Best regards,<br>The Fitnest.ma Team</p>
          </div>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>© ${new Date().getFullYear()} Fitnest.ma. All rights reserved.</p>
            <p>If you have any questions, please contact us at support@fitnest.ma</p>
          </div>
        </div>
      `,
      text: `Delivery Update for Order #${orderData.orderId}
      
Hello ${orderData.name},

We're pleased to inform you that your order #${orderData.orderId} has been ${orderData.status}.

Order ID: ${orderData.orderId}
Status: ${orderData.status}
Estimated Delivery: ${orderData.estimatedDelivery || "As soon as possible"}

You can track your order status in your account dashboard.

Best regards,
The Fitnest.ma Team

© ${new Date().getFullYear()} Fitnest.ma. All rights reserved.
`,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log(`Delivery update email sent to ${orderData.email}: ${info.messageId}`)
    return { success: true, messageId: info.messageId, response: info.response }
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
    // Use the hardcoded values for checking
    const host = "smtp.gmail.com"
    const port = 587
    const user = "noreply@fitnest.ma"
    const pass = "lfih nrfi ybfo asud"
    const from = "Fitnest.ma <noreply@fitnest.ma>"

    if (!host || !port || !user || !pass || !from) {
      return {
        configured: false,
        missing: {
          host: !host,
          port: !port,
          user: !user,
          password: !pass,
          from: !from,
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
