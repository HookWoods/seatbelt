<div align="center">

# Seatbelt

**Vibe coder should no longer be an insult.**
*Vibe-coder ne devrait plus être une insulte.*

Un développeur senior patient, directement dans l'IA avec laquelle tu construis déjà.
Seatbelt garde ton app propre et sûre pendant que tu construis, explique chaque choix risqué avec des mots simples, et te dit si ton app est prête avant la mise en ligne.

<a href="LICENSE"><img src="https://img.shields.io/badge/licence-MIT-1F6F78?style=flat-square" alt="Licence MIT"></a>
<img src="https://img.shields.io/badge/marche%20avec-Lovable%20%C2%B7%20Bolt%20%C2%B7%20Replit%20%C2%B7%20Claude%20%C2%B7%20Cursor%20%C2%B7%20Codex-1F6F78?style=flat-square" alt="Marche avec Lovable, Bolt, Replit, Claude, Cursor, Codex">
<img src="https://img.shields.io/badge/rien%20%C3%A0%20installer-juste%20du%20Markdown-1F6F78?style=flat-square" alt="Rien à installer : des skills en Markdown">

[English](README.md) · [Français](README.fr.md)

</div>

<table>
<tr>
<th width="50%">Ton projet aujourd'hui</th>
<th width="50%">Avec Seatbelt</th>
</tr>
<tr>
<td align="center"><img src="docs/assets/before-frankencar.png" alt="Une voiture de sport assemblée avec des pièces qui ne vont pas ensemble" width="100%"></td>
<td align="center"><img src="docs/assets/after-clean-car.png" alt="La même voiture construite sur un seul design" width="100%"></td>
</tr>
<tr>
<td>Des pièces de plusieurs constructeurs, scotchées ensemble. Elle roule, jusqu'au jour où elle ne roule plus. Chaque prompt ajoute une pièce qui ne va pas avec les autres.</td>
<td>Un seul design. Les pièces s'emboîtent, les freins marchent, et tu sais ce qu'il y a sous le capot.</td>
</tr>
</table>

> "Try to fix 1 thing and break 3 others." (r/lovable)
>
> "You don't have backups, you have hope." (r/vibecoding)

## En action

Tu demandes une fonctionnalité et tu colles une clé dans le chat. Sans Seatbelt, l'IA met la clé dans la page et continue. Avec Seatbelt, elle s'arrête d'abord :

```
Toi : Ajoute un bouton de paiement Stripe. Voici ma clé : sk_live_...

⏸️ Pause : Clé secrète visible
Ce qui se passe : cette clé donne un accès complet à ton compte Stripe, et la page que tu demandes est du code que tout le monde peut lire.
Risque si on continue : quelqu'un peut copier la clé et faire des paiements ou des remboursements à ta place.
1️⃣ Je range la clé dans les variables secrètes du projet et je ne l'utilise que côté serveur, puis je te montre comment la remplacer (2 min, recommandé)
2️⃣ Continuer quand même, et je note le risque dans ton carnet
```

Avant la mise en ligne, demande un crash test :

```
# Certificat crash-test : notes-app, 2026-10-18
⛔ Ne pas mettre en ligne

| # | Contrôle          | Note | Preuve                                                  |
|---|-------------------|------|---------------------------------------------------------|
| 1 | Secrets           | F    | src/lib/ai.js:1 (clé OpenAI lisible dans le navigateur)  |
| 2 | Porte des données | F    | supabase/migrations/001_notes.sql:10 (tout le monde peut lire toutes les notes) |

Résultat : 0/2 contrôles réussis (cette version couvre les contrôles 1 et 2 sur 7)

Les 3 corrections les moins chères
1. « Déplace l'appel à OpenAI dans une fonction serveur qui lit OPENAI_API_KEY dans les secrets du projet... » (5 min)
2. « Remplace la règle "tout le monde peut lire" sur les notes par une règle où chaque utilisateur ne lit que ses propres notes... » (2 min)
3. ...
```

## Pourquoi ce projet

Les outils d'IA permettent à n'importe qui de sortir une app en un week-end, et ces apps marchent. Mais sous le capot, elles restent des prototypes :

- Sur 1 645 apps Lovable analysées en 2025, 170 laissaient les données de leurs utilisateurs lisibles par n'importe qui (CVE-2025-48757).
- Un développeur dont le métier est de nettoyer des apps construites par IA retrouve les sept mêmes problèmes presque partout : des clés dans le code, une sécurité seulement à l'écran, des utilisateurs qui lisent les données des autres, aucun suivi des erreurs, des sauvegardes jamais testées, des prix venus du navigateur, et des fonctionnalités qui s'écrasent entre elles sans prévenir.
- Les développeurs refusent de reprendre ces projets, et un marché payant du « nettoyage de vibe code » est apparu.

La plupart des outils qui s'attaquent au problème sont des scanners pour développeurs : ils passent à la fin et parlent jargon. Seatbelt agit pendant que tu construis, dans l'outil que tu utilises déjà, avec des mots que tu comprends.

## Ce que tu obtiens

| Skill | Ce qu'il fait |
|---|---|
| `seatbelt` | Le coach. Applique les bonnes pratiques par défaut, fait une pause aux moments à risque avec deux choix clairs, explique chaque choix par son coût, son risque ou sa durée, et tient `PROJECT.md`, un carnet de ton app en langage simple. |
| `crash-test` | La note de préparation. Vérifie ton app domaine par domaine, note chacun de A à F avec le fichier et la ligne en preuve, donne les 3 corrections les moins chères sous forme de prompts à coller, et garde un historique pour voir la note monter. |

### Quand le coach fait une pause

| Moment | Ce qui se passe |
|---|---|
| Une clé ou un mot de passe apparaît dans le chat ou dans le code | Il range la clé en lieu sûr et t'explique comment la remplacer. |
| Un changement touche la connexion, le paiement ou les données de tes utilisateurs | Il fait d'abord un point de sauvegarde, change une seule chose, puis vérifie que tout marche encore. |
| Le même problème a résisté à deux correctifs | Il arrête de deviner, dit ce qu'il pense être la cause, et revient au dernier point de sauvegarde. |
| Un fichier devient trop gros, ou la même chose existe en double | Il propose de découper le fichier ou de garder une seule version. |
| Tu demandes « des tests pour tout » | Il écrit les quelques tests qui comptent, pas des centaines qui ne vérifient rien. |

Les petits changements (texte, couleurs, mise en page) ne déclenchent jamais de pause. Si tu dis « continuer quand même », il le fait, et note le risque dans ton carnet pour que tu le revoies avant la mise en ligne.

### Ce qu'il fait sans demander

- Garde des fonctions et des fichiers courts, et n'écrit pas de code « pour plus tard ».
- Réutilise ce qui existe au lieu d'en créer une deuxième version.
- Vérifie les données là où elles entrent dans l'app, et ne cache jamais une erreur derrière une fausse valeur.
- Donne à chaque écran un état de chargement, un état vide et un état d'erreur.
- Lance le formateur, le linter et le vérificateur de types standards de ton langage.
- Relit ses propres changements avant de dire « fini », et te dit ce qu'il a retiré.

### Le carnet

`PROJECT.md` se trouve à la racine de ton projet. L'IA le lit en premier à chaque session, et arrête donc d'oublier ce que tu as décidé la veille. Il contient ce que fait l'app, où se trouve chaque chose, tes décisions, les services que tu paies, les noms de tes secrets (jamais leurs valeurs), les risques acceptés et l'historique des crash tests. Donne-le à un développeur, il comprend ton projet en cinq minutes.

## Installation

Chaque skill est un dossier. Installe `seatbelt` d'abord, et ajoute `crash-test` quand tu veux la note.

### Lovable
1. Ouvre les paramètres du workspace, puis **Skills**, puis **Add from GitHub** (réservé aux admins du workspace).
2. Colle `https://github.com/HookWoods/seatbelt/tree/main/skills/seatbelt`, puis recommence avec `.../skills/crash-test`.
3. Ouvre la **Knowledge** de ton projet et colle les trois lignes ci-dessous.

### Bolt
1. Ouvre **Knowledge**, puis **Skills**, puis **Import from GitHub**.
2. Importe `https://github.com/HookWoods/seatbelt/tree/main/skills/seatbelt`, puis `.../skills/crash-test` (Bolt importe un skill à la fois).
3. Colle les trois lignes ci-dessous dans la Knowledge du projet.

### Replit
1. Clique sur **Use a skill** et colle `https://github.com/HookWoods/seatbelt/tree/main/skills/seatbelt`.
2. Recommence avec `.../skills/crash-test`.

### Claude Code
```bash
/plugin marketplace add HookWoods/seatbelt
/plugin install seatbelt@seatbelt
```

### Claude.ai et Claude Desktop
Télécharge ce dépôt en ZIP, compresse le dossier `skills/seatbelt` seul, puis importe-le dans **Paramètres**, **Fonctionnalités**, **Skills**. Fais pareil pour `skills/crash-test`.

### Cursor, GitHub Copilot, Codex, Gemini CLI, OpenCode
```bash
npx skills add HookWoods/seatbelt
```
Ou copie les deux dossiers de `skills/` dans `.agents/skills/` de ton projet.

### Les trois lignes
Colle ceci dans la Knowledge de ton projet (Lovable, Bolt) ou dans `AGENTS.md` / `CLAUDE.md`, pour que le coach soit utilisé à chaque demande :

```
This project uses Seatbelt.
Use the seatbelt skill for every request in this project.
Read PROJECT.md first if it exists.
```

## Utilisation

Pas de commande à apprendre. Construis comme d'habitude, le coach intervient quand ça compte. Quelques demandes possibles :

- « Lance crash-test sur mon app. »
- « Explique ce que tu viens de changer, en mots simples. »
- « Mets à jour mon carnet. »
- « Quels risques ai-je acceptés jusqu'ici ? »
- « Je veux confier ce projet à un développeur. Prépare-le. »

Seatbelt répond dans la langue dans laquelle tu écris.

## Limites, honnêtement

- Les skills sont des consignes que l'IA suit. Elles font du bon comportement le choix par défaut, mais ne peuvent pas l'imposer.
- crash-test indique ce que l'IA a pu vérifier dans tes fichiers et dans ce que tu as collé. Ce n'est ni un audit de sécurité ni une certification, et le badge dit toujours « self-checked ».
- Certains réglages n'existent que dans tes tableaux de bord (par exemple les règles et les sauvegardes Supabase). crash-test te donne les clics exacts ou la requête à lancer, et note « ? » tant que tu n'as pas collé le résultat. « ? » ne compte jamais comme réussi.
- Cette première version note les secrets et la porte des données pour les apps Supabase. Les contrôles côté serveur, les paiements, les sauvegardes, le filet de tests et la vie privée arrivent ensuite.

## Benchmark

Les deux skills sont mesurés, pas seulement décrits. `evals/` contient six petites apps Supabase (trois avec des failles plantées, trois versions propres) et dix scénarios pour le coach, dont des demandes en français et des demandes qui ne doivent pas déclencher de pause. Le lanceur fait tourner un vrai agent avec et sans Seatbelt, et compte les failles trouvées, les fausses alertes, les pauses au bon moment et les pauses sur des demandes banales.

```bash
npm run eval -- crash-test --runs 3
npm run eval -- coach --runs 3
SEATBELT_NO_SKILLS=1 npm run eval -- coach --runs 3   # même run sans Seatbelt
```

## FAQ

**Faut-il savoir coder ?** Non, c'est tout l'intérêt. Seatbelt explique chaque choix par ce qu'il coûte, ce qui peut mal tourner ou le temps qu'il prend.

**Est-ce que ça va me ralentir ?** Il ne fait une pause qu'aux moments listés plus haut, une fois par message au maximum, et jamais deux fois pour la même chose dans une session. Les petits changements passent directement.

**Est-ce que ça consomme plus de tokens ?** Seul le fichier principal, court, est chargé à chaque demande. Les fiches détaillées ne se chargent qu'au moment où elles servent. Et le carnet évite à l'IA d'explorer tout ton projet à chaque session.

**Je peux l'utiliser sur un projet existant ?** Oui. Le coach crée le carnet après son premier vrai changement, et crash-test marche sur tout projet dont il peut lire les fichiers.

**Mes données sont-elles envoyées quelque part ?** Non. Seatbelt est du texte lu par l'outil d'IA que tu utilises déjà. Pas de serveur, rien à lancer.

## Contribuer

Améliorer la formulation des skills vaut autant que du code. Avant d'ouvrir une pull request :

```bash
npm test          # tests du contenu, du scoring et du lanceur (Node 22+, aucune dépendance)
npm run validate  # limites des plateformes : nom, longueur de la description, taille des fichiers
```

Les nouveaux contrôles crash-test vont dans `skills/crash-test/checks/`, les nouvelles stacks dans `skills/crash-test/stacks/`, chacun avec une app de test dans `evals/fixtures/` qui prouve que le contrôle trouve la faille et reste silencieux sur la version propre.

## Licence

MIT
