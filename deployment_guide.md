# 🚀 How to Put Your Game Online (GitHub Pages)

Now that your game is finished, it's time to share it with the world! Since you aren't connected to GitHub yet, follow these steps to put your game online for free.

---

## Step 1: Create a GitHub Account
If you don't have one, go to [github.com](https://github.com/join) and sign up. It’s the "Cloud" where coders keep their work!

---

## Step 2: Create a New Repository
1. Log in to GitHub.
2. Click the **"+"** icon in the top-right corner and select **"New repository"**.
3. Name it `pingpong`.
4. Keep it **Public**.
5. Do NOT check "Initialize this repository with a README" (we already have files!).
6. Click **"Create repository"**.

---

## Step 3: Link Your Computer to GitHub
Open your terminal (in VS Code or your folder) and run these commands one by one. 

> [!NOTE]
> Think of this part as "Mailing" your files to the GitHub cloud.

```bash
# 1. Initialize Git in your folder
git init

# 2. Add all your files to the "Waiting Room"
git add .

# 3. Save your changes with a message
git commit -m "My First Ping Pong Game!"

# 4. Tell your computer where the GitHub cloud is
# REPLACE "your-username" with your actual GitHub name!
git remote add origin https://github.com/your-username/pingpong.git

# 5. Push your files to the cloud
git push -u origin main
```

---

## Step 4: Turn on the "Game Console" (GitHub Pages)
Now that your code is on GitHub, we need to tell GitHub to turn it into a website.

1. Go to your repository on GitHub.com.
2. Click the **"Settings"** tab (top menu).
3. On the left sidebar, click **"Pages"**.
4. Under **"Build and deployment"**, look for the **"Branch"** section.
5. Change "None" to **"main"** and click **"Save"**.

---

## 🌍 Step 5: Check Your Site!
Wait about 1-2 minutes. GitHub will show a message at the top of the Pages screen that says:
> *"Your site is live at: https://your-username.github.io/pingpong/"*

Copy that link and send it to your friends! 🥳

---

### ❓ What if I change my code?
If you make the game better (like adding a new color), just run these three commands again:
```bash
git add .
git commit -m "Added a new feature"
git push
```
Your website will update automatically!
