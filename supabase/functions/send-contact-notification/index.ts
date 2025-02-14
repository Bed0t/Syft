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
    console.log('Request method:', req.method)
    console.log('Request headers:', Object.fromEntries(req.headers.entries()))
    
    const body = await req.json()
    console.log('Raw request body:', JSON.stringify(body, null, 2))
    
    // Handle both wrapped and unwrapped formData
    const formData = body.formData || body
    console.log('Processed form data:', JSON.stringify(formData, null, 2))

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'company', 'message']
    for (const field of requiredFields) {
      if (!formData[field]) {
        throw new Error(`Missing required field: ${field}`)
      }
    }

    // Log environment variables (without showing actual values)
    const username = Deno.env.get('TITAN_EMAIL_USERNAME')
    const password = Deno.env.get('TITAN_EMAIL_PASSWORD')
    
    console.log('Environment variables present:', {
      TITAN_EMAIL_USERNAME: !!username,
      TITAN_EMAIL_PASSWORD: !!password
    })

    if (!username || !password) {
      throw new Error('Missing email configuration')
    }

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

    const client = new SmtpClient()

    try {
      // Configure Titan SMTP with correct settings from Titan documentation
      console.log('Connecting to SMTP server...')
      await client.connectTLS({
        hostname: "smtp.titan.email",
        port: 465,  // Correct port from Titan documentation
        username: username,
        password: password,
        tls: true,
        secure: true  // Required for port 465 SSL/TLS
      })
      console.log('Connected to SMTP server successfully')

      const fullName = `${firstName} ${lastName}`

      // Send notification to company email
      console.log('Sending notification email...')
      const notificationResult = await client.send({
        from: username,
        to: username,
        subject: `New Contact Form Submission - ${company}`,
        content: `
New Contact Form Submission

Contact Information:
------------------
Name: ${fullName}
Email: ${email}
Phone: ${phone || 'Not provided'}
Preferred Contact Method: ${preferredContact}

Company Details:
--------------
Company: ${company}
Job Title: ${jobTitle || 'Not provided'}
Selected Plan: ${selectedPlan || 'Not specified'}

Message:
--------
${message}
        `,
      })
      console.log('Notification email sent successfully:', notificationResult)

      // Send confirmation to user
      console.log('Sending confirmation email...')
      const confirmationResult = await client.send({
        from: username,
        to: email,
        subject: "Thank you for contacting Syft",
        content: `
Dear ${firstName},

Thank you for reaching out to Syft. We've received your message and our team will get back to you within 24 hours.

Here's a summary of your submission:
- Company: ${company}
- Selected Plan: ${selectedPlan || 'Not specified'}
- Preferred Contact Method: ${preferredContact}

We appreciate your interest in Syft and look forward to discussing how we can help you.

Best regards,
The Syft Team
        `,
      })
      console.log('Confirmation email sent successfully:', confirmationResult)

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
        details: error.stack,
        type: error.constructor.name
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 