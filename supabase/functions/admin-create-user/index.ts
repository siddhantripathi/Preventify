
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  role: 'doctor' | 'mphw' | 'admin';
  specialization?: string;
  locationIds?: string[];
}

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

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const { email, password, name, role, specialization, locationIds } = await req.json() as CreateUserRequest
    
    // Create supabase admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get the requesting user
    const authorization = req.headers.get('Authorization')
    if (!authorization) {
      return new Response(JSON.stringify({ error: 'Not authorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    
    const token = authorization.replace('Bearer ', '')
    const { data: { user: callerUser }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !callerUser) {
      return new Response(JSON.stringify({ error: 'Not authorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    
    // Check if calling user is an admin
    const { data: callerProfile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', callerUser.id)
      .single()
      
    if (profileError || !callerProfile || callerProfile.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Unauthorized: Only admins can create users' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    
    // Create the user in Supabase Auth
    const { data: { user: newUser }, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })
    
    if (createError || !newUser) {
      console.error('User creation error:', createError);
      return new Response(
        JSON.stringify({ error: createError?.message || 'Failed to create user' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }
    
    // Create user profile
    const { error: profileCreateError } = await supabase
      .from('users')
      .insert({
        id: newUser.id,
        name,
        role,
        specialization,
      })
      
    if (profileCreateError) {
      console.error('Profile creation error:', profileCreateError);
      
      // Attempt to clean up the auth user since profile creation failed
      await supabase.auth.admin.deleteUser(newUser.id)
      
      return new Response(
        JSON.stringify({ error: profileCreateError.message || 'Failed to create user profile' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }
    
    // Add location assignments if provided
    if (locationIds && locationIds.length > 0) {
      const locationAssignments = locationIds.map(locationId => ({
        user_id: newUser.id,
        location_id: locationId,
      }))
      
      const { error: locationError } = await supabase
        .from('user_locations')
        .insert(locationAssignments)
        
      if (locationError) {
        console.error('Error assigning locations:', locationError)
        // Continue even if location assignment fails
      }
    }
    
    return new Response(
      JSON.stringify({ 
        id: newUser.id, 
        email: newUser.email,
        name,
        role,
        message: 'User created successfully' 
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
