import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { SmtpClient } from 'https://deno.land/x/smtp/mod.ts'

const client = new SmtpClient()

serve(async (req) => {
  try {
    const { formData } = await req.json()
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      jobTitle,
      selectedPlan,
      message,
      preferredContact
    } = formData

    // Configure Titan SMTP
    await client.connectTLS({
      hostname: "smtp.titan.email",
      port: 587,
      username: Deno.env.get('TITAN_EMAIL_USERNAME'),
      password: Deno.env.get('TITAN_EMAIL_PASSWORD')
    })

    const fullName = `${firstName} ${lastName}`

    // Send notification to company email
    await client.send({
      from: Deno.env.get('TITAN_EMAIL_USERNAME'),
      to: Deno.env.get('TITAN_EMAIL_USERNAME'),
      subject: `New Contact Form Submission - ${company}`,
      content: `
New Contact Form Submission

Contact Information:
------------------
Name: ${fullName}
Email: ${email}
Phone: ${phone}
Preferred Contact Method: ${preferredContact}

Company Details:
--------------
Company: ${company}
Job Title: ${jobTitle}
Selected Plan: ${selectedPlan}

Message:
--------
${message}
      `,
    })

    // Send confirmation to user
    await client.send({
      from: Deno.env.get('TITAN_EMAIL_USERNAME'),
      to: email,
      subject: "Thank you for contacting Syft",
      content: `
Dear ${firstName},

Thank you for reaching out to Syft. We've received your message and our team will get back to you within 24 hours.

Here's a summary of your submission:
- Company: ${company}
- Selected Plan: ${selectedPlan}
- Preferred Contact Method: ${preferredContact}

We appreciate your interest in Syft and look forward to discussing how we can help you.

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
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}) 