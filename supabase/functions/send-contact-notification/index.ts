import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Request method:', req.method)
    console.log('Request headers:', Object.fromEntries(req.headers.entries()))
    
    // Check if there's a content-type header and it's JSON
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error(`Unsupported content type: ${contentType}. Expected application/json.`)
    }
    
    // Check if the request has a body
    const contentLength = req.headers.get('content-length');
    if (!contentLength || parseInt(contentLength) === 0) {
      throw new Error('Request body is empty')
    }
    
    // Safely parse the JSON body
    let body;
    try {
      const text = await req.text();
      console.log('Raw request text:', text);
      
      if (!text || text.trim() === '') {
        throw new Error('Empty request body');
      }
      
      body = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error(`Invalid JSON: ${parseError.message}`);
    }
    
    console.log('Raw request body:', JSON.stringify(body, null, 2))
    
    // Handle both wrapped and unwrapped formData
    const formData = body.formData || body;
    console.log('Processed form data:', JSON.stringify(formData, null, 2));

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'company', 'message'];
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

    console.log('Creating SMTP client...')
    const client = new SMTPClient({
      connection: {
        hostname: "smtp.titan.email",
        port: 465,
        tls: true,
        auth: {
          username: username,
          password: password,
        },
      },
      debug: {
        log: true,
      },
    });

    try {
      const fullName = `${firstName} ${lastName}`

      // Send notification to company email
      console.log('Preparing notification email...')
      const notificationEmail = {
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
      };
      console.log('Sending notification email...')
      await client.send(notificationEmail);
      console.log('Notification email sent successfully')

      // Send confirmation to user
      console.log('Preparing confirmation email...')
      const confirmationEmail = {
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
      };
      console.log('Sending confirmation email...')
      await client.send(confirmationEmail);
      console.log('Confirmation email sent successfully')

      console.log('Closing SMTP connection...')
      await client.close()
      console.log('SMTP connection closed')

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (smtpError) {
      console.error('SMTP Error:', {
        message: smtpError.message,
        stack: smtpError.stack,
        name: smtpError.name,
        cause: smtpError.cause
      })
      throw new Error(`SMTP Error: ${smtpError.message}${smtpError.cause ? ` (Cause: ${smtpError.cause})` : ''}`)
    } finally {
      try {
        console.log('Ensuring SMTP connection is closed...')
        await client.close()
        console.log('SMTP connection closed in finally block')
      } catch (closeError) {
        console.error('Error closing SMTP connection:', closeError)
      }
    }
  } catch (error) {
    console.error('Function Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      cause: error.cause
    })
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack,
        type: error.constructor.name,
        cause: error.cause
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 