import React from 'react';
import { getFavoriteNotes } from '@/lib/actions/notes';
import NoteCollection from '@/components/NoteCollection';

export default async function FavoritesPage() {
  const notes = await getFavoriteNotes();

  return (
    <NoteCollection 
      notes={notes}
      title="Your Favorites"
      description="The thoughts that resonate most with you, gathered in one sanctuary."
      emptyMessage="You haven't marked any thoughts as favorites yet. Start your journey by starring a note."
    />
  );
}
