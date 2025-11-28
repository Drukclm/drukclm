// In: supabase/functions/create-user/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // kpo_name from the front-end.
 
    const { email, password, name, countryCode, phoneNumber, role, kpo_name } = await req.json()

    // This validation is still correct.
    if (!email || !password || !name || !countryCode || !phoneNumber || !role) {
      throw new Error('Missing required fields')
    }

    const fullPhone = `${countryCode}${phoneNumber}`


    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })
    if (authError) throw new Error(authError.message)


    const { error: profileError } = await adminClient
      .from('Profile')
      .insert({
        auth_id: authData.user.id,
        name,
        email,
        phone: fullPhone,
        country_code: countryCode,
        role,
        //  Add the kpo_name 
        kpo_name: kpo_name,
      })
    if (profileError) throw new Error(profileError.message)

   
    return new Response(JSON.stringify({ message: 'User created successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err: any) {
    console.error('Create user error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})