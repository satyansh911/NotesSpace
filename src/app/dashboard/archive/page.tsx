import React from 'react';
import { getArchivedNotes } from '@/lib/actions/notes';
import NoteCollection from '@/components/NoteCollection';

export default async function ArchivePage() {
  const notes = await getArchivedNotes();

  return (
    <NoteCollection 
      notes={notes}
      title="Archived Sanctuary"
      description="Past reflections and completed thoughts, preserved for whenever you need them."
      emptyMessage="Your archive is empty. You can archive notes to keep your main workspace clear."
    />
  );
}
