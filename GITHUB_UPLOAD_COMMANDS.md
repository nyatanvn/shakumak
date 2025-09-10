# GitHub Upload Commands

## After creating repository on GitHub, run these commands:

```bash
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/shakumak.git

# Ensure you're on the main branch
git branch -M main

# Push your code to GitHub
git push -u origin main
```

## Example with username "johndoe":
```bash
git remote add origin https://github.com/johndoe/shakumak.git
git branch -M main
git push -u origin main
```

## After upload, set up GitHub Pages:
1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" section
4. Under "Source", select "Deploy from a branch"
5. Select "main" branch and "/ (root)" folder
6. Click "Save"
7. Your site will be available at: https://YOUR_USERNAME.github.io/shakumak

## Alternative: Deploy to Vercel (Recommended for Next.js)
1. Go to https://vercel.com
2. Sign up with GitHub account
3. Click "New Project"
4. Import your shakumak repository
5. Deploy with default settings
6. Get custom URL like: https://shakumak-username.vercel.app
