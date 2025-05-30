
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

interface User {
  email: string;
  password: string;
  name: string;
  role: 'doctor' | 'mphw' | 'admin';
  specialization?: string;
  locationIds?: string[];
}

const initialUsers: User[] = [
  {
    email: 'doctor@preventify.me',
    password: 'doctor123',
    name: 'Dr. Sharma',
    role: 'doctor',
    specialization: 'General Physician',
    locationIds: ['1'],
  },
  {
    email: 'mphw@preventify.me',
    password: 'mphw123',
    name: 'Anita MPHW',
    role: 'mphw',
    locationIds: ['1'],
  },
  {
    email: 'admin@preventify.me',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    locationIds: ['1', '2'],
  },
];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Create supabase admin client
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  const results = [];
  
  // Create each initial user
  for (const user of initialUsers) {
    try {
      // Check if user already exists
      const { data: existingUsers, error: searchError } = await supabase
        .from('users')
        .select('id')
        .eq('name', user.name)
        
      if (!searchError && existingUsers && existingUsers.length > 0) {
        results.push({
          name: user.name,
          status: 'skipped',
          message: 'User already exists'
        });
        continue;
      }
      
      // Create the user in Supabase Auth
      const { data: { user: newUser }, error: createError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
      })
      
      if (createError || !newUser) {
        results.push({
          name: user.name,
          status: 'error',
          message: createError?.message || 'Failed to create user'
        });
        continue;
      }
      
      // Create user profile
      const { error: profileCreateError } = await supabase
        .from('users')
        .insert({
          id: newUser.id,
          name: user.name,
          role: user.role,
          specialization: user.specialization,
        })
        
      if (profileCreateError) {
        // Attempt to clean up the auth user since profile creation failed
        await supabase.auth.admin.deleteUser(newUser.id)
        
        results.push({
          name: user.name,
          status: 'error',
          message: profileCreateError.message || 'Failed to create user profile'
        });
        continue;
      }
      
      // Add location assignments if provided
      if (user.locationIds && user.locationIds.length > 0) {
        const locationAssignments = user.locationIds.map(locationId => ({
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
      
      results.push({
        name: user.name,
        email: user.email,
        id: newUser.id,
        status: 'success',
        message: 'User created successfully'
      });
      
    } catch (error) {
      results.push({
        name: user.name,
        status: 'error',
        message: error.message || 'An unexpected error occurred'
      });
    }
  }
  
  return new Response(
    JSON.stringify({ results }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  )
})
