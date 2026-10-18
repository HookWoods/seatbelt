# Firebase footguns

Detect: `firebase` or `firebase-admin` in `package.json`, `firebase.json`, `firestore.rules`, `storage.rules`, `initializeApp(` with an `apiKey`.

## Secrets (check 1)
- The web config (`apiKey`, `authDomain`, `projectId`, `appId`) is public by design. Do not flag it.
- A service account key is a secret: a JSON file with `"type": "service_account"` and `"private_key"`, often named `serviceAccountKey.json` or `*-firebase-adminsdk-*.json`. It gives full admin access. It must never be committed or shipped to the browser.

## Data door (check 2)
For Firebase, the data door is the security rules in `firestore.rules`, `storage.rules` and, for the older Realtime Database, `database.rules.json`.
- `allow read, write: if true;` opens the data to everyone. Grade F.
- Test-mode rules (`allow read, write: if request.time < timestamp.date(...)`) are open to everyone until that date. Grade F.
- `allow read, write: if request.auth != null;` on users' data lets every logged-in user read and change everyone's data. Grade D.
- Good rules compare the logged-in user with the owner: `request.auth.uid == resource.data.ownerId` for reads and deletes, `request.resource.data.ownerId == request.auth.uid` for creates, and both for updates, so nobody can create a document in someone else's name or hand theirs to another user. An update rule that checks only the old owner grades C.
- Storage rules should keep users' files under a folder named with their id: `match /users/{uid}/{file} { allow read, write: if request.auth.uid == uid; }`.
- If the rules are not in the repo, ask the user once to paste what the Rules tab of their Firestore database (and of Storage) shows. Without it, grade "?".

## Server doors (check 3)
- The Admin SDK (`firebase-admin`) ignores the security rules. Code that uses it must do its own login and permission checks.
- Callable Cloud Functions must check `request.auth` (or `context.auth` in older code) and refuse when it is missing. HTTP functions must verify the ID token with `admin.auth().verifyIdToken`.
- Admin roles belong in custom claims or a document only admins can write, never in a field users can edit on their own profile.

## Backups and privacy (checks 5 and 7)
- Firestore backups are not on by default: scheduled backups or point-in-time recovery must be turned on per database. Ask the user what their database's backups page shows.
- Deleting a user in Authentication does not delete their Firestore documents or Storage files. Account deletion must remove them too.
