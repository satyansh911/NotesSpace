import React from 'react';
import { getDeletedNotes } from '@/lib/actions/notes';
import NoteCollection from '@/components/NoteCollection';

export default async function TrashPage() {
  const notes = await getDeletedNotes();

  return (
    <NoteCollection 
      notes={notes}
      title="Trash"
      description="Thoughts you've let go. They'll wait here until you decide to restore or release them forever."
      emptyMessage="The trash is currently empty. No thoughts have been let go yet."
    />
  );
}
