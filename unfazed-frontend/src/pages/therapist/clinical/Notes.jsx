import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, CheckCircle, FileEdit } from 'lucide-react';
import Sidebar from '../../../components/common/Sidebar';
import Topbar from '../../../components/common/Topbar';
import Button from '../../../components/common/Button';
import api from '../../../api/axios';
import Loader from '../../../components/common/Loader';
import NoteEditor from '../../../components/clinical/NoteEditor';

const Notes = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Editor state
  const [isEditing, setIsEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      fetchNotes(selectedClient._id);
    }
  }, [selectedClient]);

  const fetchClients = async () => {
    try {
      const res = await api.get('/clients');
      if (res.data.success) {
        const list = res.data.data || res.data.clients || [];
        setClients(list);
        if (list.length > 0) {
          setSelectedClient(list[0]);
        } else {
          setLoading(false);
        }
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchNotes = async (clientId) => {
    try {
      setLoading(true);
      const res = await api.get(`/notes/client/${clientId}`);
      if (res.data.success) {
        setNotes(res.data.notes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewNote = () => {
    setCurrentNote(null);
    setIsEditing(true);
  };

  const handleEditNote = (note) => {
    if (note.status === 'signed') return; // cannot edit
    setCurrentNote(note);
    setIsEditing(true);
  };

  const handleNoteSaved = (savedNote) => {
    setIsEditing(false);
    fetchNotes(selectedClient._id);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
          
          {/* Left Column: Client List */}
          <div className="w-full lg:w-72 flex flex-col bg-bg-card border border-border rounded-xl shadow-sm h-[300px] lg:h-full overflow-hidden shrink-0">
            <div className="p-4 border-b border-border bg-bg-card-elevated">
              <h2 className="font-bold text-ink mb-3">Clients</h2>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {clients.map(client => (
                <button
                  key={client._id}
                  onClick={() => { setSelectedClient(client); setIsEditing(false); }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors text-sm ${
                    selectedClient?._id === client._id 
                      ? 'bg-primary/10 text-primary font-bold' 
                      : 'text-ink hover:bg-bg-main'
                  }`}
                >
                  {client.name}
                </button>
              ))}
              {clients.length === 0 && !loading && (
                <div className="text-sm text-slate p-4 text-center">No clients available</div>
              )}
            </div>
          </div>

          {/* Right Column: Notes Area */}
          <div className="flex-1 flex flex-col min-w-0 h-full">
            {selectedClient ? (
              <div className="flex flex-col h-full bg-bg-main rounded-xl">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-4 shrink-0">
                  <div>
                    <h1 className="text-2xl font-serif font-bold text-ink">{selectedClient.name}'s Notes</h1>
                  </div>
                  {!isEditing && (
                    <Button variant="primary" icon={Plus} size="sm" onClick={handleNewNote}>
                      New Note
                    </Button>
                  )}
                </div>

                {/* Content Area */}
                {isEditing ? (
                  <div className="flex-1">
                    <NoteEditor 
                      clientId={selectedClient._id}
                      noteId={currentNote?._id}
                      initialData={currentNote}
                      onSaved={handleNoteSaved}
                      onCancel={() => setIsEditing(false)}
                    />
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {loading ? (
                      <div className="flex justify-center p-12"><Loader /></div>
                    ) : notes.length === 0 ? (
                      <div className="bg-bg-card border border-border rounded-xl p-12 text-center text-slate flex flex-col items-center">
                        <FileText className="w-12 h-12 mb-4 opacity-30" />
                        <p>No notes found for this client.</p>
                      </div>
                    ) : (
                      notes.map(note => (
                        <div key={note._id} className="bg-bg-card border border-border rounded-xl p-5 shadow-sm hover:border-primary/30 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-bold text-ink text-lg">{note.title}</h3>
                              <div className="text-xs text-slate mt-1 flex items-center gap-3">
                                <span className="capitalize">{note.type.replace('_', ' ')} Note</span>
                                <span>•</span>
                                <span>{new Date(note.createdAt).toLocaleString()}</span>
                              </div>
                            </div>
                            <div>
                              {note.status === 'signed' ? (
                                <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-sage/20 text-sage rounded-full">
                                  <CheckCircle className="w-3.5 h-3.5" /> Signed
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-slate/10 text-slate rounded-full">
                                  <FileEdit className="w-3.5 h-3.5" /> Draft
                                </span>
                              )}
                            </div>
                          </div>
                          <div 
                            className="prose prose-sm max-w-none text-slate line-clamp-3 bg-bg-main p-4 rounded-lg"
                            dangerouslySetInnerHTML={{ __html: note.content }}
                          />
                          <div className="mt-4 flex justify-end gap-2">
                            {note.status === 'draft' && (
                              <Button variant="outline" size="sm" onClick={() => handleEditNote(note)}>
                                Edit Draft
                              </Button>
                            )}
                            <Button variant="outline" size="sm">View Full Note</Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-bg-card border border-border rounded-xl">
                <p className="text-slate">Select a client to view their clinical notes.</p>
              </div>
            )}
          </div>

      </div>
    </>
  );
};

export default Notes;
