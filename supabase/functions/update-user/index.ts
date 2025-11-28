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

    const body = await req.json();
    const { auth_id, name, email, password, countryCode, phoneNumber, role, kpo_name } = body;
    console.log(body);
    

    if (!auth_id) {
      throw new Error('auth_id is required to update a user')
    }

    // Only update auth if email or password is provided
    const authUpdateData: { email?: string; password?: string } = {}
    if (email && email.trim() !== "") authUpdateData.email = email
    if (password && password.trim() !== "") authUpdateData.password = password

    if (Object.keys(authUpdateData).length > 0) {
      const { error: authError } = await adminClient.auth.admin.updateUserById(
        auth_id,
        authUpdateData
      )
      if (authError) throw new Error(`Auth update error: ${authError.message}`)
    }

    // Build the profile update object dynamically.
    const profileUpdateData: Record<string, any> = {};
    if (typeof name === 'string' && name.trim() !== '') profileUpdateData.name = name;
    if (typeof email === 'string' && email.trim() !== '') profileUpdateData.email = email;
    if (typeof phoneNumber === 'string' && phoneNumber.trim() !== '') profileUpdateData.phone = phoneNumber;
    if (typeof countryCode === 'string' && countryCode.trim() !== '') profileUpdateData.country_code = countryCode;
    if (typeof role === 'string' && role.trim() !== '') profileUpdateData.role = role;
    if (role === 'kpo' && typeof kpo_name === 'string' && kpo_name.trim() !== '') {
      profileUpdateData.kpo_name = kpo_name;
    }

    

    // Only update the profile if there is at least one field to update
    if (Object.keys(profileUpdateData).length > 0) {
      const { error: profileError } = await adminClient
        .from('Profile')
        .update(profileUpdateData)
        .eq('auth_id', auth_id);

      if (profileError) throw new Error(`Profile update error: ${profileError.message}`);
    }

    return new Response(JSON.stringify({ message: 'User updated successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err: any) {
    console.error('Update user error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})