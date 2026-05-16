import React from 'react';
import { getSharedNotes } from '@/lib/actions/notes';
import NoteCollection from '@/components/NoteCollection';

export default async function SharedPage() {
  const notes = await getSharedNotes();

  return (
    <NoteCollection 
      notes={notes}
      title="Shared Resonance"
      description="Reflections you've opened to the world. Notes here are accessible via their unique share links."
      emptyMessage="You haven't shared any notes yet. Make a note public to see it here."
    />
  );
}
