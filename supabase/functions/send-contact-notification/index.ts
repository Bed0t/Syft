import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { SmtpClient } from 'https://deno.land/x/smtp/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    console.log('Received request body:', body)
    
    // Handle both wrapped and unwrapped formData
    const formData = body.formData || body
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

    console.log('Parsed form data:', formData)

    const client = new SmtpClient()

    try {
      // Configure Titan SMTP
      console.log('Connecting to SMTP server...')
      await client.connectTLS({
        hostname: "smtp.titan.email",
        port: 587,
        username: Deno.env.get('TITAN_EMAIL_USERNAME'),
        password: Deno.env.get('TITAN_EMAIL_PASSWORD')
      })
      console.log('Connected to SMTP server successfully')

      const fullName = `${firstName} ${lastName}`

      // Send notification to company email
      console.log('Sending notification email...')
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
      console.log('Notification email sent successfully')

      // Send confirmation to user
      console.log('Sending confirmation email...')
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
      console.log('Confirmation email sent successfully')

      await client.close()
      console.log('SMTP connection closed')

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (smtpError) {
      console.error('SMTP Error:', smtpError)
      throw new Error(`SMTP Error: ${smtpError.message}`)
    } finally {
      try {
        await client.close()
      } catch (closeError) {
        console.error('Error closing SMTP connection:', closeError)
      }
    }
  } catch (error) {
    console.error('Function Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 