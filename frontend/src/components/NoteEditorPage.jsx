import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Sparkles,
  Lightbulb,
  ShieldCheck,
  Tag,
  X,
  FileText,
} from 'lucide-react';
import { noteService } from '../services/noteService';
import { showToast } from '../utils/toast';
import { GenerateTitleModal } from './ai/GenerateTitleModal';
import { WritingHelpModal } from './ai/WritingHelpModal';
import { VerifyContentPanel } from './ai/VerifyContentPanel';
import { DEFAULT_THEME_ID } from '../constants/colorThemes';

export const NoteEditorPage = ({
  mode = 'create',
  workspaceId,
  workspaceName,
  colorTheme = DEFAULT_THEME_ID,
  note,
  onSaved,
  onCancel,
}) => {
  const isEdit = mode === 'edit' && note?._id;

  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState(note?.tags?.join(', ') || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showTagInput, setShowTagInput] = useState(Boolean(note?.tags?.length));
  const [wordCount, setWordCount] = useState(0);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [showWritingHelp, setShowWritingHelp] = useState(false);
  const [showVerifyPanel, setShowVerifyPanel] = useState(false);

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter((w) => w.length > 0).length;
    setWordCount(words);
  }, [content]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleApplyFix = (item) => {
    const lines = content.split('\n');
    const lineIndex = (item.lineNumber || 1) - 1;

    if (lineIndex >= 0 && lineIndex < lines.length) {
      const currentLine = lines[lineIndex];
      if (currentLine.includes(item.problematicLine)) {
        lines[lineIndex] = currentLine.replace(item.problematicLine, item.suggestedFix);
      } else {
        lines[lineIndex] = item.suggestedFix;
      }
      setContent(lines.join('\n'));
      return;
    }

    if (content.includes(item.problematicLine)) {
      setContent(content.replace(item.problematicLine, item.suggestedFix));
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Please add a title to your note');
      return;
    }

    setSaving(true);
    setError('');

    const tagsArray = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    try {
      let savedNote;
      if (isEdit) {
        const response = await noteService.updateNote(note._id, {
          title: title.trim(),
          content,
          tags: tagsArray,
        });
        savedNote = response.note;
        showToast.success('Note updated successfully');
      } else {
        const response = await noteService.createNote({
          title: title.trim(),
          content,
          workspaceId,
          tags: tagsArray,
          colorTheme: colorTheme || DEFAULT_THEME_ID,
        });
        savedNote = response.note;
        showToast.success('Note created successfully');
      }

      if (onSaved) {
        onSaved(savedNote);
      }
    } catch (err) {
      const msg = err.message || `Failed to ${isEdit ? 'update' : 'save'} note`;
      setError(msg);
      showToast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-gradient-to-br from-bg-main to-gray-200">
      <div className="bg-bg-surface border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-gray-100 rounded-lg transition-all"
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-center gap-2 text-sm">
              <FileText size={16} className="text-accent" />
              <span className="text-gray-400">Workspace:</span>
              <span className="font-semibold text-accent">{workspaceName}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded-md">
              {wordCount} words
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent to-accent/80 text-white rounded-lg text-sm font-semibold hover:shadow-md disabled:opacity-60 transition-all"
              onClick={handleSave}
              disabled={saving}
            >
              <Save size={16} />
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Save Note'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 px-6 py-3 border-b border-red-300 text-sm text-center">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">
          <div>
            <input
              type="text"
              className="w-full text-4xl font-bold text-text-primary border-none bg-transparent outline-none mb-4 leading-tight"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note Title"
              autoFocus={!isEdit}
            />
            <div className="inline-flex flex-col gap-3 rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-cyan-700" />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-700">
                  AI tools
                </span>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-accent to-cyan-600 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all"
                onClick={() => setShowTitleModal(true)}
              >
                <Sparkles size={16} />
                AI Generate Title
              </button>
            </div>
          </div>

          <div className="relative min-h-[320px]">
            <textarea
              className="w-full min-h-[320px] text-base leading-relaxed text-gray-700 border-none bg-bg-surface outline-none resize-none p-6 rounded-xl font-sans shadow-sm"
              value={content}
              onChange={handleContentChange}
              placeholder="Start writing your note here..."
            />
            <div className="absolute bottom-4 right-4 flex flex-col gap-3 bg-bg-surface/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-cyan-100 min-w-[180px]">
              <div className="flex items-center justify-between gap-2 px-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-700">
                  AI assist
                </span>
                <span className="inline-flex items-center rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-bold text-cyan-700">
                  Live
                </span>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-950 border border-amber-200 rounded-lg text-xs font-semibold hover:shadow-md hover:border-amber-300 transition-all"
                onClick={() => setShowWritingHelp(true)}
              >
                <Lightbulb size={14} />
                AI Writing Help
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-950 border border-emerald-200 rounded-lg text-xs font-semibold hover:shadow-md hover:border-emerald-300 transition-all"
                onClick={() => setShowVerifyPanel(true)}
              >
                <ShieldCheck size={14} />
                AI Verify Content
              </button>
            </div>
          </div>

          <div className="bg-bg-surface p-4 rounded-xl shadow-sm">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-text-secondary border border-gray-200 rounded-md text-xs font-medium hover:bg-gray-200 transition-all"
              onClick={() => setShowTagInput(!showTagInput)}
            >
              <Tag size={14} />
              {showTagInput ? 'Hide Tags' : 'Add Tags'}
            </button>
            {showTagInput && (
              <div className="mt-3 flex flex-col gap-2">
                <input
                  type="text"
                  className="input w-full text-sm"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Add tags separated by commas"
                />
              </div>
            )}
            {tags && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.split(',').map((tag, idx) => {
                  const trimmedTag = tag.trim();
                  return trimmedTag ? (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-medium"
                    >
                      {trimmedTag}
                      <button
                        type="button"
                        className="hover:text-indigo-900"
                        onClick={() => {
                          setTags(
                            tags
                              .split(',')
                              .filter((_, i) => i !== idx)
                              .join(',')
                          );
                        }}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <GenerateTitleModal
        isOpen={showTitleModal}
        onClose={() => setShowTitleModal(false)}
        onTitleGenerated={setTitle}
        noteContent={content}
      />
      <WritingHelpModal
        isOpen={showWritingHelp}
        onClose={() => setShowWritingHelp(false)}
        content={content}
        onAccept={setContent}
      />
      <VerifyContentPanel
        isOpen={showVerifyPanel}
        onClose={() => setShowVerifyPanel(false)}
        content={content}
        onApplyFix={handleApplyFix}
      />
    </div>
  );
};
