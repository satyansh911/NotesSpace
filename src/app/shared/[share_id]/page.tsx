import React from 'react';
import { getSharedNote } from '@/lib/actions/notes';
import { notFound } from 'next/navigation';
import SharedNoteContent from './SharedNoteContent';

export default async function SharedNotePage({ params }: { params: Promise<{ share_id: string }> }) {
  const { share_id } = await params;
  let note;
  try {
    note = await getSharedNote(share_id);
  } catch {
    return notFound();
  }

  if (!note) {
    return notFound();
  }

  return <SharedNoteContent note={note} />;
}
