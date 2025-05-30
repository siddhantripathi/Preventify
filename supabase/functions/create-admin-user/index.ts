
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // First create the auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'ayyoobaiyz@gmail.com',
      password: 'adminayyoob',
      email_confirm: true,
      user_metadata: { name: 'Super Admin' }
    });

    if (authError) {
      throw authError;
    }

    // Then create the user profile in public.users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        name: 'superadmin',
        role: 'admin',
        specialization: 'Administration'
      })
      .select()
      .single();

    if (userError) {
      throw userError;
    }

    return new Response(
      JSON.stringify({ message: 'Admin user created successfully', authData, userData }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
