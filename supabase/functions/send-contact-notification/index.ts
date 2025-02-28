import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

// Define CORS headers for preflight requests and responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

// Helper to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
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
    
    // Validate email format
    if (!isValidEmail(formData.email)) {
      throw new Error('Invalid email format')
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
      await client.close();
      
      // Return success response with CORS headers
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      throw new Error(`Failed to send email: ${emailError.message}`);
    }

  } catch (err) {
    console.error('Function error:', err);
    
    // Return error response with CORS headers
    return new Response(JSON.stringify({
      error: err.message || 'An unexpected error occurred'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}) 