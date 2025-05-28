// Fallback email service using a different method or provider
import { sendWelcomeEmail as primarySendWelcome, sendOrderConfirmationEmail as primarySendOrder } from "./email-utils"

// You can implement alternative email services here
// For example, using a different SMTP provider or email service API

export async function sendWelcomeEmailWithFallback(email: string, name: string) {
  try {
    // Try primary email service first
    const primaryResult = await primarySendWelcome(email, name)

    if (primaryResult.success) {
      return primaryResult
    }

    // If primary fails, you could try alternative methods here
    console.log("Primary email service failed, no fallback configured yet")

    return {
      success: false,
      error: "Primary email service failed and no fallback is configured",
      primaryError: primaryResult.error,
    }
  } catch (error) {
    console.error("Email fallback error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function sendOrderConfirmationEmailWithFallback(orderData: any) {
  try {
    // Try primary email service first
    const primaryResult = await primarySendOrder(orderData)

    if (primaryResult.success) {
      return primaryResult
    }

    // If primary fails, you could try alternative methods here
    console.log("Primary order email service failed, no fallback configured yet")

    return {
      success: false,
      error: "Primary email service failed and no fallback is configured",
      primaryError: primaryResult.error,
    }
  } catch (error) {
    console.error("Order email fallback error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
