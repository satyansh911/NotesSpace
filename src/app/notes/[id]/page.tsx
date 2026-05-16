import React from 'react';
import { getNote } from '@/lib/actions/notes';
import { redirect } from 'next/navigation';
import NoteEditor from './NoteEditor';

export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const note = await getNote(id);
    if (!note) {
      redirect('/dashboard');
    }
    return <NoteEditor initialNote={note} />;
  } catch (error) {
    console.error('Failed to load note:', error);
    redirect('/dashboard');
  }
}
