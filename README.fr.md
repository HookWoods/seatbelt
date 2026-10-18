# Seatbelt

**Vibe coder should no longer be an insult.**
*Vibe-coder ne devrait plus être une insulte.*

Seatbelt transforme l'IA avec laquelle tu construis en développeur senior patient. Elle applique les bonnes pratiques par défaut, fait une pause aux moments à risque pour les expliquer en mots simples, tient un carnet de ton projet, et note à quel point ton app est prête avant la mise en ligne.

> "Try to fix 1 thing and break 3 others." (r/lovable)
> "You don't have backups, you have hope." (r/vibecoding)

## Ton projet ne devrait pas ressembler à ça

![Une supercar assemblée avec des pièces de plusieurs marques qui ne vont pas ensemble](docs/assets/before-frankencar.png)

Des pièces de cinq constructeurs différents, boulonnées ensemble. Elle roule, jusqu'au jour où elle ne roule plus. La plupart des apps construites avec l'IA ressemblent à ça sous le capot, parce que chaque prompt ajoute une pièce qui ne va pas avec les autres.

## Avec Seatbelt, voici la vision finale

![Une voiture propre et complète, d'une seule marque](docs/assets/after-clean-car.png)

La même voiture construite sur un seul design : les pièces s'emboîtent et les freins marchent.

## Ce que tu obtiens
- `seatbelt` (coach) : s'arrête avant les changements risqués (un secret dans ton code, la connexion, les paiements, les données des utilisateurs, un correctif raté deux fois, trop de tests) et te donne deux choix : l'option sûre, ou continuer quand même. Explique tout sans jargon. Tient `PROJECT.md`, un carnet de ton app en langage simple.
- `crash-test` : note ton app contrôle par contrôle (v0.1 : les secrets et la porte des données pour les apps Supabase), avec les preuves, les 3 corrections les moins chères sous forme de prompts à coller, et un badge « self-checked ».

## Installation
Chaque skill est un dossier. Colle l'URL GitHub du dossier (l'URL de ce dépôt suivie de `/tree/main/skills/seatbelt` ou `/tree/main/skills/crash-test`) :
- `Lovable` : paramètres du workspace > Skills > ajouter depuis GitHub (admins du workspace).
- `Bolt` : Knowledge > Skills > importer depuis GitHub (un skill par import).
- `Replit` : « Use a skill » > colle l'URL.
- `Claude Code` : `/plugin marketplace add <ce dépôt>` puis `/plugin install seatbelt@seatbelt`.
- `Cursor, Copilot, Codex, Gemini CLI, OpenCode` : copie `skills/*` dans `.agents/skills/` de ton projet.

Ensuite colle les 3 lignes de `bootstrap/KNOWLEDGE.md` dans la Knowledge de ton projet (Lovable, Bolt) ou dans `AGENTS.md` / `CLAUDE.md`, pour que le coach soit utilisé à chaque demande.

## Honnêteté
Les skills sont des consignes que l'IA suit ; ils ne peuvent pas la forcer. crash-test indique ce que l'IA a pu vérifier dans tes fichiers. Ce n'est ni un audit de sécurité ni une certification. Le benchmark qui mesure les deux skills se trouve dans `evals/`.

## Licence
MIT
