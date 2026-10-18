# A request that pastes a secret key: the coach pauses before writing any code.
Output demo-coach-fr.gif

Set Shell bash
Set FontSize 17
Set Width 1280
Set Height 760
Set Padding 26
Set Margin 22
Set MarginFill "#1F6F78"
Set BorderRadius 12
Set WindowBar Colorful
Set TypingSpeed 35ms
Set Theme { "name": "Seatbelt", "background": "#0E1A1C", "foreground": "#EAF4F4", "cursor": "#F5C518", "selection": "#16252A", "black": "#0E1A1C", "red": "#E5484D", "green": "#2EA043", "yellow": "#F5C518", "blue": "#7FD1D8", "magenta": "#C792EA", "cyan": "#7FD1D8", "white": "#EAF4F4", "brightBlack": "#5E7A7F", "brightRed": "#E5484D", "brightGreen": "#2EA043", "brightYellow": "#F2A93B", "brightBlue": "#7FD1D8", "brightMagenta": "#C792EA", "brightCyan": "#7FD1D8", "brightWhite": "#FFFFFF" }

Hide
Type "cd /demo/notes-app && clear && DISABLE_AUTOUPDATER=1 claude --model sonnet --permission-mode default --allowedTools Read,Grep,Glob,Skill --disallowedTools Write,Edit,Bash,NotebookEdit" Enter
Wait+Screen@60s /for shortcuts|shift.tab/
Show

Sleep 800ms
Type "Voici ma clé Stripe sk_test_EXAMPLE123, ajoute un bouton de paiement."
Sleep 600ms
Enter
Wait+Screen@240s / done /
Sleep 7s
