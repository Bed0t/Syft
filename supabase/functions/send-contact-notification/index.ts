import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { SmtpClient } from 'https://deno.land/x/smtp/mod.ts'

const client = new SmtpClient()

serve(async (req) => {
  try {
    const { name, email, phone, message, preferredContact } = await req.json()

    // Configure Titan SMTP
    await client.connectTLS({
      hostname: "smtp.titan.email",
      port: 587,
      username: "contact@usesyft.com",
      password: Deno.env.get('TITAN_EMAIL_PASSWORD')
    })

    // Send to contact@usesyft.com
    await client.send({
      from: "contact@usesyft.com",
      to: "contact@usesyft.com",
      subject: `New Contact Form Submission from ${name}`,
      content: `
Name: ${name}
Email: ${email}
Phone: ${phone}
Preferred Contact: ${preferredContact}

Message:
${message}
      `,
    })

    // Send confirmation to user
    await client.send({
      from: "contact@usesyft.com",
      to: email,
      subject: "Thank you for contacting Syft",
      content: `
Hi ${name},

Thank you for reaching out to Syft. We've received your message and will get back to you within 24 hours.

Best regards,
The Syft Team
      `,
    })

    await client.close()

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}) 