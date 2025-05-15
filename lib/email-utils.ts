import nodemailer from "nodemailer"

// Create reusable transporter using environment variables
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    secure: process.env.EMAIL_SERVER_SECURE === "true",
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })
}

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const transporter = createTransporter()

    const firstName = name.split(" ")[0]

    const mailOptions = {
      from: process.env.EMAIL_FROM,
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
    }

    const info = await transporter.sendMail(mailOptions)
    console.log(`Welcome email sent to ${email}: ${info.messageId}`)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return { success: false, error }
  }
}

export async function sendOrderConfirmationEmail(orderData: any) {
  try {
    const transporter = createTransporter()

    const firstName = orderData.customer.name.split(" ")[0]

    // Format currency
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("fr-MA", {
        style: "currency",
        currency: "MAD",
        minimumFractionDigits: 2,
      }).format(amount)
    }

    // Format date
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }

    // Generate items HTML
    const itemsHtml = orderData.items
      .map(
        (item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.price)}</td>
      </tr>
    `,
      )
      .join("")

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: orderData.customer.email,
      subject: `Your Fitnest.ma Order #${orderData.id} Confirmation`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #4CAF50; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Order Confirmation</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #eee;">
            <p>Hello ${firstName},</p>
            <p>Thank you for your order! We've received your order and are processing it now.</p>
            
            <div style="background-color: #f9f9f9; border: 1px solid #eee; padding: 15px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #333;">Order Summary</h2>
              <p><strong>Order Number:</strong> #${orderData.id}</p>
              <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Delivery Address:</strong> ${orderData.shipping.address}</p>
              <p><strong>Estimated Delivery:</strong> ${formatDate(orderData.shipping.deliveryDate)}</p>
            </div>
            
            <h3>Order Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f5f5f5;">
                  <th style="padding: 10px; text-align: left;">Item</th>
                  <th style="padding: 10px; text-align: center;">Quantity</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Subtotal:</td>
                  <td style="padding: 10px; text-align: right;">${formatCurrency(orderData.subtotal)}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Shipping:</td>
                  <td style="padding: 10px; text-align: right;">${orderData.shipping === 0 ? "Free" : formatCurrency(orderData.shipping)}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
                  <td style="padding: 10px; text-align: right; font-weight: bold;">${formatCurrency(orderData.total)}</td>
                </tr>
              </tfoot>
            </table>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://fitnest.ma/dashboard/orders/${orderData.id}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Track Your Order</a>
            </div>
            
            <p style="margin-top: 30px;">Thank you for choosing Fitnest.ma!</p>
            <p>Best regards,<br>The Fitnest.ma Team</p>
          </div>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>© ${new Date().getFullYear()} Fitnest.ma. All rights reserved.</p>
            <p>If you have any questions about your order, please contact us at support@fitnest.ma</p>
          </div>
        </div>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log(`Order confirmation email sent to ${orderData.customer.email}: ${info.messageId}`)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending order confirmation email:", error)
    return { success: false, error }
  }
}

export async function sendDeliveryUpdateEmail(orderData: any) {
  try {
    const transporter = createTransporter()

    const firstName = orderData.customer.firstName

    // Format date
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }

    // Format time
    const formatTime = (dateString: string) => {
      return new Date(dateString).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: orderData.customer.email,
      subject: `Your Fitnest.ma Order #${orderData.id} is Being Prepared`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #4CAF50; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Your Order is Being Prepared</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #eee;">
            <p>Hello ${firstName},</p>
            <p>Great news! Your order #${orderData.id} is now being prepared and will be delivered soon.</p>
            
            <div style="background-color: #f9f9f9; border: 1px solid #eee; padding: 15px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #333;">Delivery Details</h2>
              <p><strong>Order Number:</strong> #${orderData.id}</p>
              <p><strong>Delivery Address:</strong> ${orderData.shipping.address}</p>
              <p><strong>Estimated Delivery:</strong> ${formatDate(orderData.shipping.deliveryDate)} between ${formatTime(orderData.shipping.deliveryDate)} and ${formatTime(new Date(new Date(orderData.shipping.deliveryDate).getTime() + 2 * 60 * 60 * 1000).toISOString())}</p>
            </div>
            
            <p>Our delivery team will contact you shortly before arrival. Please ensure someone is available to receive your order.</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://fitnest.ma/dashboard/orders/${orderData.id}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Track Your Order</a>
            </div>
            
            <p style="margin-top: 30px;">Thank you for choosing Fitnest.ma!</p>
            <p>Best regards,<br>The Fitnest.ma Team</p>
          </div>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>© ${new Date().getFullYear()} Fitnest.ma. All rights reserved.</p>
            <p>If you have any questions about your delivery, please contact us at support@fitnest.ma</p>
          </div>
        </div>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log(`Delivery update email sent to ${orderData.customer.email}: ${info.messageId}`)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending delivery update email:", error)
    return { success: false, error }
  }
}
