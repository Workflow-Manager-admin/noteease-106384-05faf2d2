import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Note model for the NoteEase main container.
 */
interface Note {
  id: number;
  title: string;
  content: string;
  pinned: boolean;
  archived: boolean;
  tags: string[];
  created: Date;
  updated: Date;
}

/**
 * Category colors for tag display.
 */
const CATEGORY_COLORS: string[] = [
  '#d21959', // Primary pink
  '#997a7a', // Accent
  '#4CAF50', // Green
  '#2196F3', // Blue
  '#FF9800', // Orange
  '#9C27B0', // Purple
];

/**
 * PUBLIC_INTERFACE
 * Make NoteeaseMainComponent a standalone Angular component, importing necessary modules.
 */
@Component({
  selector: 'app-noteease-main',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './noteease-main.component.html',
  styleUrls: ['./noteease-main.component.css']
})
export class NoteeaseMainComponent {
  notes: Note[] = [];
  searchQuery: string = '';
  showEditor: boolean = false;
  editNote: Note | null = null;   // The note being edited, or null for new note
  categoryColorMap: { [tag: string]: string } = {};

  constructor() {
    // Demo data for the UI.
    this.notes = [
      {
        id: 1,
        title: "Quick Note",
        content: "Buy groceries: eggs, bread, and milk.",
        pinned: false,
        archived: false,
        tags: ["Personal", "Shopping"],
        created: new Date(),
        updated: new Date(),
      },
      {
        id: 2,
        title: "Project Ideas",
        content: "Finish NoteEase MVP. Add markdown support.",
        pinned: true,
        archived: false,
        tags: ["Work", "Ideas"],
        created: new Date(),
        updated: new Date(),
      },
      {
        id: 3,
        title: "Archived",
        content: "This note is archived.",
        pinned: false,
        archived: true,
        tags: ["Old", "Misc"],
        created: new Date(),
        updated: new Date()
      }
    ];
    this.generateColorMap();
  }

  /**
   * Generates a color map for the tags/categories for consistent label coloring.
   */
  generateColorMap() {
    const tags = new Set<string>();
    this.notes.forEach(note => note.tags.forEach(tag => tags.add(tag)));
    let i = 0;
    for(const tag of tags) {
      this.categoryColorMap[tag] = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
      i++;
    }
  }

  /**
   * Handles the search input and filters notes by title or content.
   */
  // PUBLIC_INTERFACE
  get filteredNotes(): Note[] {
    const query = this.searchQuery.trim().toLowerCase();
    let res = this.notes.filter(note =>
      !note.archived && (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      note.tags.join(' ').toLowerCase().includes(query)
    ));
    // Pinned on top
    res = [...res.filter(n => n.pinned), ...res.filter(n => !n.pinned)];
    return res;
  }

  /**
   * Handles search bar input.
   */
  // PUBLIC_INTERFACE
  onSearchInput(event: any) {
    this.searchQuery = event.target.value;
  }

  /**
   * Open the editor for creating a new note.
   */
  // PUBLIC_INTERFACE
  openNewNote() {
    this.editNote = {
      id: Date.now(),
      title: '',
      content: '',
      pinned: false,
      archived: false,
      tags: [],
      created: new Date(),
      updated: new Date()
    };
    this.showEditor = true;
  }

  /**
   * Open the editor to edit an existing note.
   */
  // PUBLIC_INTERFACE
  editExistingNote(note: Note) {
    this.editNote = { ...note };
    this.showEditor = true;
  }

  /**
   * Save the note (create or update).
   */
  // PUBLIC_INTERFACE
  saveNote(note: Note) {
    if (note.id && this.notes.some(n => n.id === note.id)) {
      // Update
      const idx = this.notes.findIndex(n => n.id === note.id);
      note.updated = new Date();
      this.notes[idx] = { ...note };
    } else {
      // Create
      this.notes.push({ ...note });
      this.generateColorMap();
    }
    this.showEditor = false;
    this.editNote = null;
  }

  /**
   * Delete a note.
   */
  // PUBLIC_INTERFACE
  deleteNote(note: Note) {
    this.notes = this.notes.filter(n => n.id !== note.id);
    this.generateColorMap();
  }

  /**
   * Archive/Unarchive a note.
   */
  // PUBLIC_INTERFACE
  toggleArchive(note: Note) {
    note.archived = !note.archived;
    this.showEditor = false;
    this.editNote = null;
  }

  /**
   * Pin/Unpin a note.
   */
  // PUBLIC_INTERFACE
  togglePin(note: Note) {
    note.pinned = !note.pinned;
  }

  /**
   * Add tag/category to note in editor.
   */
  // PUBLIC_INTERFACE
  addTagToEditNote(tagInput: HTMLInputElement) {
    const tag = tagInput.value.trim();
    if (
      tag !== '' &&
      this.editNote &&
      !this.editNote.tags.includes(tag)
    ) {
      this.editNote.tags.push(tag);
      if (!this.categoryColorMap[tag]) {
        // Add color for new tag
        const currTags = Object.keys(this.categoryColorMap).length;
        this.categoryColorMap[tag] = CATEGORY_COLORS[currTags % CATEGORY_COLORS.length];
      }
    }
    tagInput.value = '';
  }

  /**
   * Remove a tag from edit note.
   */
  // PUBLIC_INTERFACE
  removeTagFromEditNote(idx: number) {
    if (this.editNote) {
      this.editNote.tags.splice(idx, 1);
    }
  }

  /**
   * Cancel note editor
   */
  // PUBLIC_INTERFACE
  cancelEdit() {
    this.showEditor = false;
    this.editNote = null;
  }

  // PUBLIC_INTERFACE
  trackByNoteId(index: number, note: Note): number {
    return note.id;
  }

  // PUBLIC_INTERFACE
  get modalHeading(): string {
    if (!this.editNote) return '';
    const isEdit = this.editNote.id && this.notes.some(n => n.id === this.editNote?.id);
    return isEdit ? 'Edit Note' : 'New Note';
  }
}
