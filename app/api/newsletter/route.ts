import type { NextApiResponse } from "next"
import { NextResponse } from "next/server"
import client from "@mailchimp/mailchimp_marketing"

export async function POST(req: Request, res: NextApiResponse) {
  const { email } = await req.json()
  if (!email) {
    return res.status(400).json({ error: "Email is required" })
  }

  const MailchimpKey = process.env.MAILCHIMP_API_KEY
  const MailchimpServer = process.env.MAILCHIMP_API_SERVER
  const MailchimpAudience = process.env.MAILCHIMP_AUDIENCE_ID

  client.setConfig({
    apiKey: MailchimpKey,
    server: MailchimpServer
  })

  console.log(email)

  const response = await client.lists.addListMember(MailchimpAudience, {
    email_address: email,
    status: "subscribed"
  })
  console.log(response)
  if (response.status !== "subscribed") {
    return res.status(400).json({ error: "Failed to subscribe" })
  }
  return NextResponse.json({ message: "Subscribed successfully" })
}
