import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Save, FileCheck2, Bold, Italic, List, ListOrdered } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import api from '../../api/axios';
import Toast from '../common/Toast';

const NoteEditor = ({ clientId, noteId, initialData, onSaved, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || 'Progress Note');
  const [type, setType] = useState(initialData?.type || 'progress');
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialData?.content || '<p>Start writing your clinical note here...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  const handleSave = async (status = 'draft') => {
    if (!editor) return;
    setSaving(true);
    try {
      const htmlContent = editor.getHTML();
      const payload = {
        clientId,
        title,
        type,
        content: htmlContent,
        status,
      };

      let res;
      if (noteId) {
        res = await api.put(`/notes/${noteId}`, payload);
      } else {
        res = await api.post('/notes', payload);
      }

      if (res.data.success) {
        setToastMessage(`Note ${status === 'signed' ? 'signed' : 'saved'} successfully!`);
        setTimeout(() => {
          if (onSaved) onSaved(res.data.note);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setToastMessage('Error saving note');
    } finally {
      setSaving(false);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="bg-bg-card border border-border rounded-xl shadow-sm flex flex-col h-full max-h-[800px]">
      {toastMessage && <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} />}
      
      {/* Editor Header */}
      <div className="p-4 border-b border-border bg-bg-card-elevated flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-4 items-center w-full sm:w-auto">
          <Input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-bold font-serif text-lg border-transparent hover:border-border focus:border-primary"
            placeholder="Note Title"
          />
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            className="bg-bg-main border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="progress">Progress Note</option>
            <option value="intake">Intake</option>
            <option value="treatment_plan">Treatment Plan</option>
            <option value="general">General</option>
          </select>
        </div>

        <div className="flex gap-2">
          {onCancel && <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>}
          <Button variant="outline" size="sm" icon={Save} onClick={() => handleSave('draft')} disabled={saving}>Save Draft</Button>
          <Button variant="primary" size="sm" icon={FileCheck2} onClick={() => handleSave('signed')} disabled={saving}>Sign & Lock</Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-4 py-2 border-b border-border bg-bg-main flex gap-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-slate/10 transition-colors ${editor.isActive('bold') ? 'bg-slate/20 text-ink' : 'text-slate'}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-slate/10 transition-colors ${editor.isActive('italic') ? 'bg-slate/20 text-ink' : 'text-slate'}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-border mx-1 my-auto"></div>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-slate/10 transition-colors ${editor.isActive('bulletList') ? 'bg-slate/20 text-ink' : 'text-slate'}`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-slate/10 transition-colors ${editor.isActive('orderedList') ? 'bg-slate/20 text-ink' : 'text-slate'}`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default NoteEditor;
