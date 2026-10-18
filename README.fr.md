<div align="center">

<img src="docs/assets/banner-fr.svg" alt="Seatbelt : un développeur senior patient, dans l'IA avec laquelle tu construis. Marche avec Lovable, Bolt, Replit, Claude, Cursor et Codex." width="880">

### Vibe coder should no longer be an insult.
*Vibe-coder ne devrait plus être une insulte.*

Construis avec l'IA comme aujourd'hui. Seatbelt fait s'arrêter l'IA aux moments à risque, les explique avec des mots simples, et garde ton app propre et sûre jusqu'au jour du lancement.

<a href="LICENSE"><img src="https://img.shields.io/badge/licence-MIT-1F6F78?style=for-the-badge" alt="Licence MIT"></a>
<img src="https://img.shields.io/badge/z%C3%A9ro%20code%20%C3%A0%20conna%C3%AEtre-F5C518?style=for-the-badge&labelColor=111111" alt="Zéro code à connaître">
<img src="https://img.shields.io/badge/marche%20sur-14%20outils%20IA-0F3D43?style=for-the-badge" alt="Marche sur 14 outils IA">
<img src="https://img.shields.io/badge/installation-1%20lien-2EA043?style=for-the-badge" alt="Installation en un lien">
<a href="evals/RESULTS.md"><img src="https://img.shields.io/badge/moments%20%C3%A0%20risque%20stopp%C3%A9s-45%2F45-E5484D?style=for-the-badge&labelColor=111111" alt="Moments à risque stoppés : 45 sur 45"></a>

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

## Regarde-le freiner

Tu colles une clé de paiement dans le chat. Sans Seatbelt, l'IA la met dans une page que tout le monde peut lire et continue. Avec Seatbelt, elle se range d'abord sur le côté :

<img src="docs/assets/pause-card-fr.svg" alt="Carte de pause. Tu demandes un bouton de paiement Stripe et colles ta clé secrète. Seatbelt fait une pause : la clé ouvre tout ton compte Stripe et la page est du code que tout le monde peut lire. Option 1, recommandée, 2 minutes : ranger la clé dans tes variables secrètes, ne l'utiliser que côté serveur, puis la remplacer. Option 2 : continuer quand même et noter le risque dans ton carnet." width="880">

Avant la mise en ligne, tu demandes un crash test. Tu obtiens une note par domaine, le fichier et la ligne en preuve, et les trois corrections les moins chères, prêtes à coller :

<img src="docs/assets/crash-test-fr.svg" alt="Tableau de bord crash-test pour notes-app, vérifié par l'IA, 2 sur 7, tamponné NE PAS LANCER. Secrets : F, une clé OpenAI est lisible dans le navigateur. Porte des données : F, tout le monde lit toutes les notes. Portes du serveur : D, tout compte exporte toutes les notes. Paiements : n/a, pas de paiement. Sauvegardes : ?, absent du repo et tableau de bord non collé. Filet de tests : D, aucun test sur la connexion ni l'accès aux notes. Vie privée : B, page trouvée, sans durée de conservation." width="880">

## Comment ça marche

<img src="docs/assets/how-it-works-fr.svg" alt="Quatre étapes sur une route : construis comme d'habitude dans Lovable, Bolt ou Claude ; Seatbelt fait une pause aux moments à risque avec deux choix clairs ; le carnet PROJECT.md suit tout en mots simples ; crash-test note l'app avant le lancement avec preuves et correctifs." width="880">

1. **Tu construis comme d'habitude.** Même outil, mêmes prompts. Seatbelt est un ensemble de consignes que l'IA lit : rien de nouveau à apprendre.
2. **Il freine aux moments à risque,** et seulement là : une nouvelle app sans objectif clair, un nouveau service auquel s'inscrire, un secret dans le code, un changement sur la connexion, les paiements ou les données des utilisateurs, un correctif raté deux fois, un fichier devenu trop gros, une pile de tests inutiles, un changement qui peut effacer tes données, une fonction facturée à l'usage, et le jour du lancement. Tu as deux choix et le coût de chacun.
3. **Le carnet suit tout.** `PROJECT.md` liste ce que fait ton app, où se trouve chaque chose, tes décisions, tes services et les risques acceptés. L'IA le lit en premier, et arrête d'oublier ce que tu as décidé la veille.
4. **Le crash test note ton app** avant que de vrais utilisateurs y touchent, avec une preuve pour chaque note.

> [!NOTE]
> Les petits changements (une couleur, un texte, une retouche de mise en page) ne déclenchent jamais de pause. Si tu choisis « continuer quand même », il le fait, et note le risque dans ton carnet pour que tu le revoies avant le lancement.

## Ce dont il te protège

| | Sans Seatbelt | Avec Seatbelt |
|---|---|---|
| 🔑 Clés et mots de passe | Collés dans du code que tout le monde peut lire | Rangés dans tes variables secrètes, un contrôle qui refuse tout commit ou push qui en contient une, et on t'explique comment remplacer une clé qui a fuité |
| 🚪 Les données de tes utilisateurs | Un utilisateur peut lire les données de tous les autres | Une règle à la porte des données, testée avec deux comptes |
| 💳 Les paiements | Le prix vient du navigateur, donc il peut être modifié | Le prix est vérifié côté serveur |
| 🔁 Les boucles de correctifs | « J'en corrige un, j'en casse trois » | Un point de sauvegarde avant chaque changement risqué, et un arrêt après deux correctifs ratés |
| 🧱 Le code en vrac | Des copies de la même chose, des fichiers géants, du code « pour plus tard » | Des fichiers courts, une seule version de chaque chose, rien d'inutile |
| 🧪 Les tests | Aucun, ou des centaines qui ne vérifient rien | Les quelques tests qui gardent la connexion, le paiement et les données |
| 🗑️ Tes données enregistrées | « Supprime cette colonne » efface des mois de données, et l'annulation ne les ramène pas | D'abord une copie des données vérifiée, puis des changements par étapes qu'on peut défaire |
| 💸 Factures surprises | Un bouton IA sans limite fait grimper la facture en une nuit | Le prix par usage annoncé, un plafond de dépense et une limite par utilisateur |
| 🚀 Jour du lancement | En ligne avec les clés de test, sans sauvegarde ni page de confidentialité | Une liste de mise en ligne : d'abord les points bloquants, puis ce qu'il faut régler avant d'en parler à beaucoup de monde |
| 🧭 Comprendre son app | « Je paie pour ne pas comprendre ma propre app » | Un carnet en langage simple que tu peux donner à un développeur |

## Installation

Chaque skill est un dossier : `seatbelt` est le coach, `crash-test` est la note. Choisis ton outil.

<details open>
<summary><b>Claude Code, Claude Desktop et Claude.ai</b></summary>

Dans **Plugins**, clique sur **Ajouter**, puis **Ajouter une place de marché**, et entre `HookWoods/seatbelt`. Installe **seatbelt** depuis cette place de marché. Dans Claude Code, tu peux aussi taper :

```bash
/plugin marketplace add HookWoods/seatbelt
/plugin install seatbelt@seatbelt
```

**Extra optionnel pour Claude Code : seatbelt-guard.** Les skills demandent à l'IA de ne pas enregistrer ni envoyer de clé secrète ; cet extra s'en assure. Avant que l'IA lance `git commit` ou `git push`, il regarde ce qui serait enregistré ou envoyé et arrête la commande s'il trouve une clé secrète ou un fichier secret comme `.env`, sans jamais afficher la clé. Il refuse aussi `--no-verify` et tout changement de `core.hooksPath`, les deux façons de sauter les contrôles de git. Contrairement aux skills, qui sont du simple texte, **seatbelt-guard est un petit programme qui tourne sur ton ordinateur** avant chaque commande lancée par l'IA. Il demande Node.js 22 ou plus récent, ne marche que dans Claude Code, et reste éteint tant que tu ne l'installes pas :

```bash
/plugin install seatbelt-guard@seatbelt
```
</details>

<details>
<summary><b>Lovable</b></summary>

1. Paramètres du workspace, **Skills**, **Add from GitHub** (admins du workspace).
2. Colle `https://github.com/HookWoods/seatbelt/tree/main/skills/seatbelt`, puis le même lien qui finit par `crash-test`.
3. Colle les trois lignes ci-dessous dans la **Knowledge** de ton projet.
</details>

<details>
<summary><b>Bolt</b></summary>

1. **Knowledge**, **Skills**, **Import from GitHub**.
2. Importe `https://github.com/HookWoods/seatbelt/tree/main/skills/seatbelt`, puis le lien `crash-test` (Bolt importe un skill à la fois).
3. Colle les trois lignes ci-dessous dans la Knowledge du projet.
</details>

<details>
<summary><b>Replit</b></summary>

Clique sur **Use a skill**, colle `https://github.com/HookWoods/seatbelt/tree/main/skills/seatbelt`, puis fais pareil avec le lien `crash-test`.
</details>

<details>
<summary><b>Gemini CLI</b></summary>

```bash
gemini extensions install https://github.com/HookWoods/seatbelt
```
L'extension charge le coach à chaque session ; pas besoin des trois lignes.
</details>

<details>
<summary><b>GitHub Copilot CLI</b></summary>

```bash
copilot plugin marketplace add HookWoods/seatbelt
copilot plugin install seatbelt@seatbelt
```
</details>

<details>
<summary><b>Kimi Code, Devin, Factory Droid, Qwen Code</b></summary>

```bash
/plugins install https://github.com/HookWoods/seatbelt                                  # Kimi Code (lance le coach à chaque session)
devin plugins install HookWoods/seatbelt                                                  # Devin CLI
droid plugin marketplace add https://github.com/HookWoods/seatbelt && droid plugin install seatbelt@seatbelt   # Factory Droid
qwen extensions install HookWoods/seatbelt                                                # Qwen Code
```
</details>

<details>
<summary><b>Cursor, Codex, OpenCode et tout outil qui lit les dossiers de skills</b></summary>

```bash
npx skills add HookWoods/seatbelt
```
Ou copie les deux dossiers de `skills/` dans `.agents/skills/` de ton projet, puis colle les trois lignes ci-dessous dans `AGENTS.md`.
</details>

**Les trois lignes.** Colle-les dans la Knowledge de ton projet (Lovable, Bolt) ou dans `AGENTS.md` / `CLAUDE.md`, pour que le coach t'accompagne à chaque demande :

```
This project uses Seatbelt.
Use the seatbelt skill for every request in this project.
Read PROJECT.md first if it exists.
```

## Parle-lui

Pas de commande à apprendre. Construis comme d'habitude, et demande avec tes mots quand tu veux quelque chose :

| Tu dis | Tu obtiens |
|---|---|
| « Lance crash-test sur mon app. » | Le tableau de bord ci-dessus, avec les 3 corrections les moins chères |
| « Explique ce que tu viens de changer, en mots simples. » | Une phrase, puis le pourquoi, et le détail seulement si tu le demandes |
| « Quels risques ai-je acceptés jusqu'ici ? » | La liste tirée de ton carnet, avec les dates |
| « Je veux confier ce projet à un développeur. Prépare-le. » | Un résumé de ton carnet : ce que fait l'app, où sont les choses, les secrets par leur nom, les risques acceptés |

Seatbelt répond dans la langue dans laquelle tu écris.

> [!IMPORTANT]
> **Limites, honnêtement.** Les skills sont des consignes que l'IA suit : elles font du bon comportement le choix par défaut, elles ne peuvent pas l'imposer. crash-test indique ce que l'IA a pu vérifier dans tes fichiers et dans ce que tu as collé. Ce n'est ni un audit de sécurité ni une certification, et son badge dit toujours « self-checked ». Les réglages qui n'existent que dans un tableau de bord (règles Supabase, sauvegardes) sont notés « ? » tant que tu ne les as pas collés, et « ? » ne compte jamais comme réussi. crash-test fait sept contrôles sur toute app qu'il peut lire ; pour l'instant, sa fiche de pièges propres à une stack ne couvre que Supabase, les autres stacks ont les contrôles généraux.

## Mesuré, pas seulement décrit

On a envoyé les mêmes demandes à la même IA (Claude Sonnet 5.5 dans Claude Code, effort par défaut), une fois avec Seatbelt et une fois sans, puis on a compté les réponses. Chaque demande a tourné 3 fois des deux côtés, parce qu'une IA ne répond jamais deux fois pareil : les chiffres comptent donc des réponses. Dernier run : 2026-10-18 ([résultats complets et limites](evals/RESULTS.md)).

| Ce qu'on a vérifié | Avec Seatbelt | Sans |
|---|:---:|:---:|
| **🛑 Elle s'arrête avant un changement risqué**<br>15 demandes risquées, comme « ajoute la connexion Google », « efface la base de données », « mets-le en ligne sur mon domaine », ou un message avec une clé secrète collée dedans. L'IA s'est-elle arrêtée pour proposer une option sûre **avant** de toucher à quoi que ce soit ? | **45 / 45**<br>réponses arrêtées | 0 / 45 |
| **🤫 Elle ne dérange pas pour rien**<br>8 demandes sans risque, comme « agrandis le titre », « corrige une faute » ou « ajoute une barre de recherche ». Un bon coach n'interrompt pas pour ça. *Plus c'est bas, mieux c'est.* | **0 / 24**<br>arrêts inutiles | 0 / 24 |
| **🔐 Elle protège tes clés quand tu envoies ton code**<br>« Mets mon projet sur GitHub », et la même demande en français pour GitLab. L'IA a-t-elle mis en place un contrôle qui refuse d'envoyer une clé secrète ? | **6 / 6**<br>réponses qui l'ont fait | 0 / 6 |
| **💬 Elle parle ta langue, pas du jargon**<br>Des mots techniques comme « RLS », « webhook » ou « migration » utilisés sans mots simples pour les expliquer. *Plus c'est bas, mieux c'est.* | **12**<br>sur 69 réponses | 52<br>sur 69 réponses |
| **🔎 crash-test trouve les vrais problèmes**<br>8 petites apps de test avec des problèmes plantés, au moins une par contrôle : une clé d'admin laissée dans le code, une base de données que tout le monde peut lire, un prix que l'acheteur peut changer, un déploiement qui efface les données, des tests qui ne vérifient rien, un mot de passe écrit dans les logs... La note les a-t-elle tous repérés ? | **33 / 33**<br>problèmes trouvés | pas d'équivalent |
| **🐺 crash-test ne crie pas au loup**<br>8 copies propres des mêmes apps, problèmes corrigés. A-t-il recalé l'une d'elles à tort ? *Plus c'est bas, mieux c'est.* | **0 / 30**<br>fausses alertes | pas d'équivalent |

Les apps et les demandes de test sont dans `evals/` : 16 petites apps Supabase et 23 demandes qui couvrent chaque moment de pause, dont trois en français. Tout le monde peut les relancer avec les commandes ci-dessous.

```bash
npm run eval -- crash-test --runs 3 --jobs 12
npm run eval -- coach --runs 3 --jobs 12   # environ 2 minutes
SEATBELT_NO_SKILLS=1 npm run eval -- coach --runs 3   # le même run sans Seatbelt
```

## FAQ

<details>
<summary><b>Faut-il savoir coder ?</b></summary>

Non, c'est tout l'intérêt. Chaque choix est expliqué par ce qu'il coûte, ce qui peut mal tourner ou le temps qu'il prend.
</details>

<details>
<summary><b>Est-ce que ça va me ralentir ?</b></summary>

Il ne fait une pause qu'aux moments à risque, une fois par message au maximum, et jamais deux fois pour la même chose dans une session.
</details>

<details>
<summary><b>Est-ce que ça consomme plus de tokens ?</b></summary>

Seul un fichier principal court est chargé à chaque demande ; les fiches détaillées ne se chargent qu'au moment où elles servent. Et le carnet évite à l'IA d'explorer tout ton projet à chaque session.
</details>

<details>
<summary><b>Je peux l'ajouter à un projet déjà commencé ?</b></summary>

Oui. Le coach écrit le carnet après son premier vrai changement, et crash-test marche sur tout projet dont il peut lire les fichiers.
</details>

<details>
<summary><b>Mon code ou mes données sont-ils envoyés quelque part ?</b></summary>

Non. Seatbelt est du texte lu par l'outil d'IA que tu utilises déjà. Pas de serveur, rien à lancer. Seule exception : l'extra optionnel seatbelt-guard pour Claude Code, un petit programme qui tourne sur ton ordinateur si tu l'installes ; il lit l'historique git de ton projet et n'envoie rien nulle part.
</details>

## Contribuer

Améliorer la formulation des skills vaut autant que du code. Avant d'ouvrir une pull request :

```bash
npm test          # tests du contenu, du scoring et du lanceur (Node 22+, aucune dépendance)
npm run validate  # limites des plateformes : nom, longueur de la description, taille des fichiers
npm run guard     # pas d'instructions cachées ; un nouveau domaine ou une commande demande l'accord d'un mainteneur
```

Les nouveaux contrôles crash-test vont dans `skills/crash-test/checks/`, les nouvelles stacks dans `skills/crash-test/stacks/`, chacun avec une app de test dans `evals/fixtures/` qui prouve que le contrôle trouve la faille et reste silencieux sur la version propre.

## Licence

MIT
