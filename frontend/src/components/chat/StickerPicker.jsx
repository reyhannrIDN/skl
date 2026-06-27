import React from 'react';

const STICKERS = [
  { id: 'wave', emoji: '👋', label: 'Wave' },
  { id: 'thumbsup', emoji: '👍', label: 'Thumbs Up' },
  { id: 'clap', emoji: '👏', label: 'Clap' },
  { id: 'heart', emoji: '❤️', label: 'Heart' },
  { id: 'fire', emoji: '🔥', label: 'Fire' },
  { id: 'star', emoji: '⭐', label: 'Star' },
  { id: 'party', emoji: '🎉', label: 'Party' },
  { id: 'rocket', emoji: '🚀', label: 'Rocket' },
  { id: 'check', emoji: '✅', label: 'Check' },
  { id: 'cool', emoji: '😎', label: 'Cool' },
  { id: 'smile', emoji: '😊', label: 'Smile' },
  { id: 'laugh', emoji: '😂', label: 'Laugh' },
  { id: 'cry', emoji: '😭', label: 'Cry' },
  { id: 'angry', emoji: '😡', label: 'Angry' },
  { id: 'love', emoji: '🥰', label: 'Love' },
  { id: 'pray', emoji: '🙏', label: 'Pray' },
  { id: 'muscle', emoji: '💪', label: 'Muscle' },
  { id: 'hundred', emoji: '💯', label: '100' },
  { id: 'clown', emoji: '🤡', label: 'Clown' },
  { id: 'alien', emoji: '👽', label: 'Alien' },
];

export function StickerPicker({ onSelect, onClose }) {
  return (
    <div className="absolute bottom-20 left-12 z-50 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 max-h-72 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Stiker</h3>
        <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">&times;</button>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {STICKERS.map((sticker) => (
          <button
            key={sticker.id}
            type="button"
            className="w-12 h-12 flex items-center justify-center hover:bg-muted rounded-xl text-2xl transition-all hover:scale-110"
            onClick={() => onSelect(sticker.id, sticker.emoji)}
            title={sticker.label}
          >
            {sticker.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
