'use server';

import { createClient } from '@/lib/supabase/server';
import { hash, compare } from 'bcryptjs';
import { encrypt, getSession, setSession, clearSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const supabase = await createClient();

  // Check if user exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (existingUser) {
    return { error: 'User already exists' };
  }

  // Hash password
  const passwordHash = await hash(password, 10);

  // Create user
  const { data: newUser, error: createError } = await supabase
    .from('users')
    .insert([{ email, password_hash: passwordHash }])
    .select()
    .single();

  if (createError || !newUser) {
    return { error: createError?.message || 'Failed to create user' };
  }

  // Create session
  await setSession(newUser.id, newUser.email);

  revalidatePath('/');
  return { success: true };
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const supabase = await createClient();

  // Find user
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (userError || !user) {
    return { error: 'Invalid email or password' };
  }

  // Verify password
  const isValid = await compare(password, user.password_hash);

  if (!isValid) {
    return { error: 'Invalid email or password' };
  }

  // Create session
  await setSession(user.id, user.email);

  revalidatePath('/');
  return { success: true };
}

export async function logout() {
  await clearSession();
  revalidatePath('/');
  redirect('/auth');
}


export async function getMe() {
  const session = await getSession();
  if (!session) return null;
  
  const userId = session.userId || session.user?.id;
  const supabase = await createClient();
  
  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, ai_usage_count')
    .eq('id', userId)
    .maybeSingle();
    
  if (error || !user) return null;
  
  return user;
}
