# StoryCruz Films

Next.js + Sanity site for **storycruzfilms.com**.

## Project & Git root

**This folder is the Git repository root.** For everything to work correctly:

- **GitHub Desktop**: Add this folder (File → Add Local Repository → choose `storycruz-films`).
- **Cursor / agents**: Use this folder as the project root so Git and tooling recognize the repo.
- **Terminal**: Run `git` commands from inside this folder.

## Reconnect Git / re-authenticate

If push fails or GitHub asks to sign in again:

1. **GitHub Desktop**  
   - File → Options → Accounts → sign out, then sign in again with your GitHub account.

2. **Terminal (HTTPS)**  
   - macOS: Keychain Access may have an old GitHub password. Remove “github.com” and run `git push` again; Git will prompt for a **Personal Access Token** (Settings → Developer settings → Personal access tokens on GitHub).  
   - Or: `git config credential.helper osxkeychain` then push and enter token when asked.

3. **Terminal (SSH)**  
   - Use an SSH remote: `git remote set-url origin git@github.com:mrquaydelacruz-sys/storycruz-films.git`  
   - Ensure SSH key is added to GitHub and `ssh -T git@github.com` works.

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
