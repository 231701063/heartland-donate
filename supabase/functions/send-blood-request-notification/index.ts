import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { donorId, patientName, message } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get donor email
    const { data: donorProfile, error: donorError } = await supabaseAdmin
      .from('profiles')
      .select('email, name')
      .eq('user_id', donorId)
      .single();

    if (donorError || !donorProfile) {
      console.error('Error fetching donor profile:', donorError);
      throw new Error('Could not find donor profile');
    }

    console.log('Sending notification to:', donorProfile.email);
    console.log('From patient:', patientName);
    console.log('Message:', message);

    // TODO: Integrate with Resend or other email service
    // For now, just log the notification
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification would be sent',
        donorEmail: donorProfile.email 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in send-blood-request-notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
