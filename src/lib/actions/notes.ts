'use server';

import { createClient } from '@/lib/supabase/server';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getNotes() {
  const supabase = await createClient();
  const session = await getSession();
  const userId = session?.userId || session?.user?.id;

  if (!userId) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .eq('is_archived', false)
    .eq('is_deleted', false)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getFavoriteNotes() {
  const supabase = await createClient();
  const session = await getSession();
  const userId = session?.userId || session?.user?.id;

  if (!userId) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .eq('is_favorite', true)
    .eq('is_deleted', false)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getArchivedNotes() {
  const supabase = await createClient();
  const session = await getSession();
  const userId = session?.userId || session?.user?.id;

  if (!userId) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .eq('is_archived', true)
    .eq('is_deleted', false)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getDeletedNotes() {
  const supabase = await createClient();
  const session = await getSession();
  const userId = session?.userId || session?.user?.id;

  if (!userId) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .eq('is_deleted', true)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getSharedNotes() {
  const supabase = await createClient();
  const session = await getSession();
  const userId = session?.userId || session?.user?.id;

  if (!userId) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .eq('is_public', true)
    .eq('is_deleted', false)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getNote(id: string) {
  const supabase = await createClient();
  const session = await getSession();
  const userId = session?.userId || session?.user?.id;

  if (!userId) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createNote(title: string = 'Untitled Note', content: string = '') {
  const supabase = await createClient();
  const session = await getSession();
  const userId = session?.userId || session?.user?.id;

  if (!userId) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('notes')
    .insert([
      { user_id: userId, title, content }
    ])
    .select()
    .maybeSingle();

  if (error) throw error;
  revalidatePath('/dashboard');
  return data;
}

export async function updateNote(id: string, updates: { 
  title?: string; 
  content?: string; 
  is_public?: boolean;
  tags?: string[];
  is_archived?: boolean;
  is_favorite?: boolean;
  summary?: string;
  action_items?: string;
}) {
  const supabase = await createClient();
  const session = await getSession();
  const userId = session?.userId || session?.user?.id;

  if (!userId) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('notes')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .maybeSingle();

  if (error) throw error;
  revalidatePath('/dashboard');
  revalidatePath(`/notes/${id}`);
  return data;
}

export async function deleteNote(id: string) {
  const supabase = await createClient();
  const session = await getSession();
  const userId = session?.userId || session?.user?.id;

  if (!userId) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('notes')
    .update({ is_deleted: true })
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
  revalidatePath('/dashboard');
}

export async function restoreNote(id: string) {
  const supabase = await createClient();
  const session = await getSession();
  const userId = session?.userId || session?.user?.id;

  if (!userId) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('notes')
    .update({ is_deleted: false })
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
  revalidatePath('/dashboard');
}

export async function permanentlyDeleteNote(id: string) {
  const supabase = await createClient();
  const session = await getSession();
  const userId = session?.userId || session?.user?.id;

  if (!userId) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
  revalidatePath('/dashboard');
}

export async function toggleFavorite(id: string, isFavorite: boolean) {
  const supabase = await createClient();
  const session = await getSession();
  const userId = session?.userId || session?.user?.id;

  if (!userId) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('notes')
    .update({ is_favorite: !isFavorite })
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
  revalidatePath('/dashboard');
}

export async function toggleArchive(id: string, isArchived: boolean) {
  const supabase = await createClient();
  const session = await getSession();
  const userId = session?.userId || session?.user?.id;

  if (!userId) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('notes')
    .update({ is_archived: !isArchived })
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
  revalidatePath('/dashboard');
}

export async function getSharedNote(shareId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('notes')
    .select('title, content, updated_at')
    .eq('share_id', shareId)
    .eq('is_public', true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function incrementAiUsage() {
  const supabase = await createClient();
  const session = await getSession();
  const userId = session?.userId || session?.user?.id;

  if (!userId) return;

  // Update the ai_usage_count in the custom users table
  const { data: user } = await supabase
    .from('users')
    .select('ai_usage_count')
    .eq('id', userId)
    .maybeSingle();

  const currentCount = user?.ai_usage_count || 0;

  await supabase
    .from('users')
    .update({ ai_usage_count: currentCount + 1 })
    .eq('id', userId);
}
