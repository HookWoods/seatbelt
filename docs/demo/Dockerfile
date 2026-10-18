# Records the README demos with VHS: a scripted terminal, no human at the keyboard.
FROM ghcr.io/charmbracelet/vhs:v0.12.1

RUN apt-get update \
 && apt-get install -y --no-install-recommends nodejs npm \
 && npm install -g @anthropic-ai/claude-code@2.1.299 \
 && rm -rf /var/lib/apt/lists/*

# Two demo projects: a clean notes app for the coach, a flawed one for crash-test.
COPY evals/fixtures/crash-test/notes-clean-1 /demo/notes-app
COPY evals/fixtures/crash-test/notes-flawed-1 /demo/notes-flawed
COPY skills/seatbelt /demo/notes-app/.claude/skills/seatbelt
COPY skills/crash-test /demo/notes-flawed/.claude/skills/crash-test
COPY bootstrap/KNOWLEDGE.md /demo/notes-app/CLAUDE.md
RUN rm -f /demo/*/manifest.json

COPY docs/demo/*.tape /tapes/
WORKDIR /out
ENTRYPOINT ["vhs"]
