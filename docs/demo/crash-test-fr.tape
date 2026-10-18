# crash-test on an app with an admin key in its browser code and an open database rule.
Output demo-crash-test-fr.gif

Set Shell bash
Set FontSize 14
Set Width 1280
Set Height 1240
Set Padding 26
Set Margin 22
Set MarginFill "#1F6F78"
Set BorderRadius 12
Set WindowBar Colorful
Set TypingSpeed 35ms
Set Theme { "name": "Seatbelt", "background": "#0E1A1C", "foreground": "#EAF4F4", "cursor": "#F5C518", "selection": "#16252A", "black": "#0E1A1C", "red": "#E5484D", "green": "#2EA043", "yellow": "#F5C518", "blue": "#7FD1D8", "magenta": "#C792EA", "cyan": "#7FD1D8", "white": "#EAF4F4", "brightBlack": "#5E7A7F", "brightRed": "#E5484D", "brightGreen": "#2EA043", "brightYellow": "#F2A93B", "brightBlue": "#7FD1D8", "brightMagenta": "#C792EA", "brightCyan": "#7FD1D8", "brightWhite": "#FFFFFF" }

Hide
Type "cd /demo/notes-flawed && clear && DISABLE_AUTOUPDATER=1 claude --model sonnet --permission-mode default --allowedTools Read,Grep,Glob,Skill,Write --disallowedTools Edit,Bash,NotebookEdit" Enter
Wait+Screen@60s /for shortcuts|shift.tab/
Show

Sleep 800ms
Type "Lance crash-test sur cette app. Fais court. Je ne peux rien coller depuis les tableaux de bord pour l'instant."
Sleep 600ms
Enter
# Show the first file reads, skip the minutes of analysis, then show the certificate.
Sleep 12s
Hide
Wait+Screen@420s / done /
Sleep 2s
Show
Sleep 10s
