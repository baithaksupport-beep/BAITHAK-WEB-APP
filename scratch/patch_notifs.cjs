const fs = require('fs');
const path = '/home/soumya-patnaik/Desktop/BAITHAK-WEB-APP/app/(protected)/notifications/page.jsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes("case 'mention':")) {
  content = content.replace(
    /case 'system': return \{ icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500\/10' \};/,
    "case 'system': return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' };\n      case 'mention': return { icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-400/10' };"
  );
  
  content = content.replace(
    /case 'system':/,
    "case 'mention': \n        return (\n          <>\n            <p className=\"text-sm font-medium text-white/90\">\n              {actorName} <span className=\"font-normal text-white/60\">mentioned you in a post</span> <span className=\"text-blue-400\">{notification.post?.title}</span>\n            </p>\n          </>\n        );\n      case 'system':"
  );

  // We should also check for mention in the types array for 'All' vs 'Mentions' if they exist, 
  // but looking at earlier grep, only system, verification, comment, etc exist.
}

fs.writeFileSync(path, content, 'utf8');
