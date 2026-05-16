/**
 * Tests for note filtering and data logic used by the dashboard.
 */

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  is_public: boolean;
  is_deleted: boolean;
  updated_at: string;
}

const mockNotes: Note[] = [
  { id: '1', title: 'Meeting Notes', content: 'Discussed roadmap', tags: ['work', 'planning'], is_public: false, is_deleted: false, updated_at: new Date().toISOString() },
  { id: '2', title: 'Recipe Ideas', content: 'Pasta, salad, soup', tags: ['food'], is_public: true, is_deleted: false, updated_at: new Date().toISOString() },
  { id: '3', title: 'Journal Entry', content: 'Reflections on the week', tags: ['personal'], is_public: false, is_deleted: false, updated_at: new Date().toISOString() },
  { id: '4', title: 'Deleted Draft', content: 'Old stuff', tags: [], is_public: false, is_deleted: true, updated_at: new Date().toISOString() },
];

function filterNotes(notes: Note[], query: string, tag: string | null): Note[] {
  return notes.filter(note => {
    const matchesQuery = !query ||
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.content.toLowerCase().includes(query.toLowerCase());
    const matchesTag = !tag || note.tags.includes(tag);
    return matchesQuery && matchesTag && !note.is_deleted;
  });
}

describe('Note Filtering', () => {
  it('returns all non-deleted notes when no filter is applied', () => {
    const result = filterNotes(mockNotes, '', null);
    expect(result).toHaveLength(3);
    expect(result.every(n => !n.is_deleted)).toBe(true);
  });

  it('filters by title query (case-insensitive)', () => {
    const result = filterNotes(mockNotes, 'meeting', null);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Meeting Notes');
  });

  it('filters by content query', () => {
    const result = filterNotes(mockNotes, 'roadmap', null);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('filters by tag', () => {
    const result = filterNotes(mockNotes, '', 'food');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('combines query and tag filters', () => {
    const result = filterNotes(mockNotes, 'recipe', 'food');
    expect(result).toHaveLength(1);

    const noMatch = filterNotes(mockNotes, 'recipe', 'work');
    expect(noMatch).toHaveLength(0);
  });

  it('excludes deleted notes', () => {
    const result = filterNotes(mockNotes, 'Deleted', null);
    expect(result).toHaveLength(0);
  });

  it('counts public notes correctly', () => {
    const allActive = filterNotes(mockNotes, '', null);
    const publicCount = allActive.filter(n => n.is_public).length;
    expect(publicCount).toBe(1);
  });
});
