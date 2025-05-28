"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export default function EmailCompleteTestPage() {
  const [diagnostic, setDiagnostic] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [testEmail, setTestEmail] = useState("")
  const [testResult, setTestResult] = useState<any>(null)

  const runDiagnostic = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/email-complete-diagnostic")
      const data = await response.json()
      setDiagnostic(data)
    } catch (error) {
      console.error("Diagnostic failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const testWelcomeEmail = async () => {
    if (!testEmail) return

    setLoading(true)
    try {
      const response = await fetch("/api/test-welcome-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail, name: "Test User" }),
      })
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({ success: false, error: "Network error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Complete Email System Test</h1>

      <Card>
        <CardHeader>
          <CardTitle>Email Configuration Diagnostic</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={runDiagnostic} disabled={loading}>
            {loading ? "Running..." : "Run Complete Diagnostic"}
          </Button>

          {diagnostic && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Environment Variables</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(diagnostic.environment).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-mono text-sm">{key}:</span>
                      <Badge variant={value ? "default" : "destructive"}>{value ? "SET" : "MISSING"}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Configuration Status</h3>
                <Alert>
                  <AlertDescription>
                    Status: {diagnostic.configCheck?.configured ? "✅ Configured" : "❌ Not Configured"}
                  </AlertDescription>
                </Alert>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Email Test Result</h3>
                <Alert variant={diagnostic.emailTest?.success ? "default" : "destructive"}>
                  <AlertDescription>
                    {diagnostic.emailTest?.success ? "✅ Email test successful" : `❌ ${diagnostic.emailTest?.error}`}
                  </AlertDescription>
                </Alert>
              </div>

              {diagnostic.recommendations?.missingVars?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Missing Variables</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {diagnostic.recommendations.missingVars.map((varName: string) => (
                      <li key={varName} className="text-red-600">
                        {varName}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Welcome Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter test email address"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
            />
            <Button onClick={testWelcomeEmail} disabled={loading || !testEmail}>
              Send Test Email
            </Button>
          </div>

          {testResult && (
            <Alert variant={testResult.success ? "default" : "destructive"}>
              <AlertDescription>
                {testResult.success
                  ? `✅ Test email sent successfully! Message ID: ${testResult.messageId}`
                  : `❌ Failed: ${testResult.error}`}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Setup Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Required Environment Variables:</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm mt-2">
                {`EMAIL_SERVER_HOST=your-smtp-server.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_SECURE=false
EMAIL_SERVER_USER=your-email@domain.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@fitnest.ma`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold">Popular SMTP Providers:</h4>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>
                  <strong>Gmail:</strong> smtp.gmail.com:587 (use App Password)
                </li>
                <li>
                  <strong>Outlook:</strong> smtp.office365.com:587
                </li>
                <li>
                  <strong>SendGrid:</strong> smtp.sendgrid.net:587
                </li>
                <li>
                  <strong>Mailgun:</strong> smtp.mailgun.org:587
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
