# LocalGo Frontend

This is the frontend for the LocalGo E-commerce application, built with React and Vite.

## Deployment

This project is configured to be deployed to GitHub Pages.

### Prerequisites

1.  Create a new repository on GitHub.
2.  Do NOT initialize it with a README or .gitignore (we already have them).

### Deploying

1.  Connect your local repository to GitHub:

    ```bash
    git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
    ```

2.  Push your code:

    ```bash
    git push -u origin master
    ```

3.  Deploy to GitHub Pages:
    ```bash
    npm run deploy
    ```

## Backend Note

The Laravel backend for this project (`localgo-backend`) is NOT included in this deployment. It requires a PHP server environment (like Heroku, DigitalOcean, or a VPS) which GitHub Pages does not support. The frontend will load, but API calls will fail without a live backend.
