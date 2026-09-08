import re

with open('/home/soumya-patnaik/Desktop/BAITHAK-WEB-APP/app/(protected)/notifications/page.jsx', 'r') as f:
    content = f.read()

# Add getIconConfig
content = content.replace(
    "case 'post': return { icon: Star, color: 'text-purple-400', bg: 'bg-purple-400/10' };",
    "case 'post': return { icon: Star, color: 'text-purple-400', bg: 'bg-purple-400/10' };\n      case 'mention': return { icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-400/10' };"
)

# Add renderContent
mention_render = """
      case 'mention': 
        return (
          <>
            <p className="text-sm font-medium text-white/90">
              {actorName} <span className="font-normal text-white/60">mentioned you in a post</span> <span className="text-blue-400">{notification.post?.title}</span>
            </p>
          </>
        );
"""

content = content.replace(
    "switch(notification.type) {\n      case 'post':",
    "switch(notification.type) {" + mention_render + "      case 'post':"
)

with open('/home/soumya-patnaik/Desktop/BAITHAK-WEB-APP/app/(protected)/notifications/page.jsx', 'w') as f:
    f.write(content)
