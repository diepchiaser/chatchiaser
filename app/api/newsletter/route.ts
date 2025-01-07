import type { NextApiResponse } from "next"
import client from "@mailchimp/mailchimp_marketing"
import { NextResponse } from "next/server"

export async function POST(req: Request, res: NextApiResponse) {
  try {
    // Parse email from the request body
    const { email } = await req.json()
    if (!email) {
      return res.status(400).json({ error: "Email is required" })
    }

    // Validate environment variables
    const MailchimpKey = process.env.MAILCHIMP_API_KEY
    const MailchimpServer = process.env.MAILCHIMP_API_SERVER || "us9"
    const MailchimpAudience = process.env.MAILCHIMP_AUDIENCE_ID

    if (!MailchimpKey || !MailchimpServer || !MailchimpAudience) {
      return res.status(500).json({ error: "Missing Mailchimp configuration" })
    }

    // Configure Mailchimp client
    client.setConfig({
      apiKey: MailchimpKey,
      server: MailchimpServer
    })

    console.log("Subscribing email:", email)

    // Add the subscriber to the Mailchimp audience
    const response = await client.lists.addListMember(MailchimpAudience, {
      email_address: email,
      status: "subscribed"
    })

    console.log("Mailchimp response:", response)

    // If successful, return a success message
    return NextResponse.json({ message: "Subscription successful" })
  } catch (error: any) {
    console.error("Error subscribing user:", error)
    if (error.response?.body?.title === "Member Exists") {
      return NextResponse.status(201).json({
        error: "Email is already subscribed"
      })
    }
    return NextResponse.status(201).json({ error: "Internal Server Error" })
  }
}
