

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS - This part is correct
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { auth_id } = await req.json()
    if (!auth_id) throw new Error('auth_id is required')

    //first delete the child
    const { error: profileError } = await adminClient
      .from('Profile')
      .delete()
      .eq('auth_id', auth_id)

   
    if (profileError) throw new Error(profileError.message)


      //then delete the parent
  
    const { error: authError } = await adminClient.auth.admin.deleteUser(auth_id)

    
    if (authError) throw new Error(authError.message)


   
    return new Response(JSON.stringify({ message: 'User deleted successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err: any) {
   
    console.error('Delete user error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})