import React from 'react';

const EMOJIS = [
  ['😀','😁','😂','🤣','😃','😄','😅','😆','😉','😊','😋','😎','😍','🥰','😘','😗'],
  ['😙','😚','🙂','🤗','🤩','🤔','🤨','😐','😑','😶','🙄','😏','😣','😥','😮','🤐'],
  ['😯','😪','😫','😴','😌','😛','😜','😝','🤤','😒','😓','😔','😕','🙃','🤑','😲'],
  ['😭','😖','😞','😟','😤','😢','😠','😡','🤬','🤯','😳','🥺','😨','😰','😥','😱'],
  ['👍','👎','👊','✊','🤛','🤜','👏','🙌','🤝','💪','✌','🤞','🖕','🤟','👌','🤌'],
  ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','💔','💕','💗','💖','✨','🔥','⭐','💯'],
  ['🎉','🎊','🎈','🎁','🏆','👑','💰','📚','💡','🔔','🎵','🎶','💣','🔪','🚀','👋'],
  ['😈','👿','👹','👺','💀','☠️','👻','👽','🤖','🎃','😺','😸','😹','😻','🙀','😿'],
];

export function EmojiPicker({ onSelect, onClose }) {
  return (
    <div className="absolute bottom-20 left-0 z-50 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 max-h-72 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Emoji</h3>
        <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">&times;</button>
      </div>
      <div className="space-y-1">
        {EMOJIS.map((row, i) => (
          <div key={i} className="flex gap-1">
            {row.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-lg text-lg transition-colors"
                onClick={() => onSelect(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
