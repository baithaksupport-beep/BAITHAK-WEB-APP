import re

with open('/home/soumya-patnaik/Desktop/BAITHAK-WEB-APP/components/modals/OpenDiscussionModal.jsx', 'r') as f:
    content = f.read()

# Add states
states_str = r"""
  // Hashtag Autocomplete State
  const [hashtagOptions, setHashtagOptions] = useState([]);
  const [showHashtags, setShowHashtags] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef(null);
  
  // Mention Autocomplete State
  const [mentionOptions, setMentionOptions] = useState([]);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
"""
content = re.sub(
    r'  // Hashtag Autocomplete State\n.*?const textareaRef = useRef\(null\);',
    states_str,
    content,
    flags=re.DOTALL
)

# Update handleContentChange
handle_content_change_str = r"""
  const fetchConnections = async (searchWord) => {
    try {
      if (!user) return;
      const { data: connections } = await supabase
        .from('connections')
        .select('follower_id, following_id')
        .eq('status', 'accepted')
        .or(`follower_id.eq.${user.id},following_id.eq.${user.id}`);
      
      if (!connections || connections.length === 0) {
        setMentionOptions([]);
        return;
      }
      
      const connectionIds = connections.map(c => c.follower_id === user.id ? c.following_id : c.follower_id);
      
      let queryBuilder = supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url')
        .in('id', connectionIds)
        .limit(10);
        
      if (searchWord) {
        queryBuilder = queryBuilder.ilike('username', `${searchWord}%`);
      }
      
      const { data } = await queryBuilder;
      setMentionOptions((data || []).map(u => ({ id: u.username, display_name: u.display_name || u.username, avatar_url: u.avatar_url })));
    } catch (err) {
      console.error(err);
      setMentionOptions([]);
    }
  };

  const handleContentChange = (e) => {
    const val = e.target.value;
    setContent(val);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
    
    const cursor = e.target.selectionStart;
    setCursorPosition(cursor);
    
    const textBeforeCursor = val.slice(0, cursor);
    const hashtagMatch = textBeforeCursor.match(/#(\w*)$/);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    
    if (hashtagMatch) {
      setShowMentions(false);
      const searchWord = hashtagMatch[1].toLowerCase();
      const matches = STANDARD_HASHTAGS.filter(tag => tag.includes(searchWord) && tag !== searchWord).slice(0, 5);
      
      if (matches.length > 0) {
        setHashtagOptions(matches);
        setShowHashtags(true);
      } else {
        setShowHashtags(false);
      }
    } else if (mentionMatch) {
      setShowHashtags(false);
      const searchWord = mentionMatch[1].toLowerCase();
      setMentionQuery(searchWord);
      fetchConnections(searchWord);
      setShowMentions(true);
    } else {
      setShowHashtags(false);
      setShowMentions(false);
    }
  };

  const insertMention = (username) => {
    const textBeforeCursor = content.slice(0, cursorPosition);
    const textAfterCursor = content.slice(cursorPosition);
    const newTextBeforeCursor = textBeforeCursor.replace(/@\w*$/, `@${username} `);
    setContent(newTextBeforeCursor + textAfterCursor);
    setShowMentions(false);
    
    if (textareaRef.current) {
      textareaRef.current.focus();
      setTimeout(() => {
        textareaRef.current.selectionStart = newTextBeforeCursor.length;
        textareaRef.current.selectionEnd = newTextBeforeCursor.length;
      }, 0);
    }
  };
"""

# Re.sub with a function replacement to avoid backslash escaping issues
def replace_func(m):
    return handle_content_change_str.strip()

content = re.sub(
    r'  const handleContentChange = \(e\) => \{.*?    \} else \{\n      setShowHashtags\(false\);\n    \}\n  \};',
    replace_func,
    content,
    flags=re.DOTALL
)

# Fix keyboard listener
content = content.replace(
    "if (isOpen && e.key === 'Escape' && !showHashtags) {",
    "if (isOpen && e.key === 'Escape' && !showHashtags && !showMentions) {"
)

# Insert the popup UI
popup_ui = r"""
            {/* Mention Autocomplete Popup */}
            {showMentions && (
              <div className="absolute z-10 left-0 mt-1 w-auto min-w-[200px] bg-[#1A1B22] border border-white/10 rounded-lg shadow-xl overflow-hidden animate-in fade-in">
                <div className="px-3 py-2 border-b border-white/5 bg-white/5">
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Mentions</span>
                </div>
                <div className="p-1.5 flex flex-col max-h-[200px] overflow-y-auto">
                  {mentionOptions.map(mUser => (
                    <button
                      key={mUser.id}
                      onClick={() => insertMention(mUser.id)}
                      className="text-left px-3 py-2 text-sm text-[#E2E1EB] hover:bg-[#0033A0] hover:text-white rounded transition-colors flex items-center gap-2"
                    >
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-white/10 shrink-0">
                         {mUser.avatar_url ? <img src={mUser.avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px]">👤</div>}
                      </div>
                      <div>
                        <div className="font-bold text-xs">{mUser.display_name}</div>
                        <div className="text-[10px] text-white/50">@{mUser.id}</div>
                      </div>
                    </button>
                  ))}
                  {mentionOptions.length === 0 && (
                     <div className="px-3 py-3 text-xs text-center text-white/50">No mutual connections found.</div>
                  )}
                </div>
              </div>
            )}
"""

content = content.replace(
    "            {/* Hashtag Autocomplete Popup */}",
    popup_ui.strip() + "\n\n            {/* Hashtag Autocomplete Popup */}"
)

# Update placeholder text
content = content.replace(
    'placeholder="Share context, details, or questions... Try typing # to add tags!"',
    'placeholder="Share context, details, or questions... Type @ to mention, # for tags!"'
)

# Send Notification logic inside handleSubmit
notification_logic = r"""
      // Inject into feed
      const formattedPost = {
        ...insertedPost,
        likes: [{ count: 0 }],
        comments: [{ count: 0 }]
      };
      
      // SEND NOTIFICATIONS TO MENTIONED USERS
      const mentionedUsernames = Array.from(new Set(content.match(/@(\w+)/g) || [])).map(m => m.slice(1));
      if (mentionedUsernames.length > 0) {
        const { data: mentionedProfiles } = await supabase.from('profiles').select('id, username').in('username', mentionedUsernames);
        if (mentionedProfiles && mentionedProfiles.length > 0) {
          const notifications = mentionedProfiles.map(p => ({
            user_id: p.id,
            actor_id: user.id,
            type: 'mention',
            post_id: insertedPost.id
          }));
          await supabase.from('notifications').insert(notifications).catch(e => console.error("Mention notif error:", e));
        }
      }

      window.dispatchEvent(new CustomEvent('new_post_created', { detail: formattedPost }));
"""

content = content.replace(
    "      // Inject into feed\n      const formattedPost = {\n        ...insertedPost,\n        likes: [{ count: 0 }],\n        comments: [{ count: 0 }]\n      };\n      window.dispatchEvent(new CustomEvent('new_post_created', { detail: formattedPost }));",
    notification_logic.strip()
)

with open('/home/soumya-patnaik/Desktop/BAITHAK-WEB-APP/components/modals/OpenDiscussionModal.jsx', 'w') as f:
    f.write(content)

