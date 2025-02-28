import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
Deno.serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      status: 200
    });
  }
  if (req.method === 'POST') {
    const { name, email, message } = await req.json();
    // Create a Supabase client
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_ANON_KEY'));
    // Insert the contact form submission into the database
    const { data, error } = await supabaseClient.from('contact_submissions').insert([
      {
        name,
        email,
        message
      }
    ]);
    if (error) {
      return new Response(JSON.stringify({
        error: error.message
      }), {
        headers: {
          'Content-Type': 'application/json'
        },
        status: 400
      });
    }
    // Here you can add code to send an email notification
    // For example, using a third-party email service
    return new Response(JSON.stringify({
      message: 'Submission successful!'
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 200
    });
  }
  return new Response('Method not allowed', {
    status: 405
  });
});
