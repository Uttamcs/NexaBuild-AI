# Deploying NexaBuild AI to Vercel

Follow these steps to deploy your NexaBuild AI application to Vercel:

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. [Git](https://git-scm.com/) installed on your computer
3. [Node.js](https://nodejs.org/) (version 18 or higher)
4. Google AI API key

## Deployment Steps

### 1. Push your code to GitHub

First, create a GitHub repository and push your code:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/nexabuild-ai.git
git push -u origin main
```

### 2. Connect to Vercel

1. Log in to your [Vercel dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: frontend/public
   - Install Command: npm install

### 3. Add Environment Variables

In the Vercel project settings, add the following environment variables:

- `API_KEY`: Your Google AI API key

### 4. Deploy

Click "Deploy" and wait for the deployment to complete.

### 5. Verify Deployment

Once deployed, Vercel will provide you with a URL for your application. Visit the URL to verify that your application is working correctly.

## Troubleshooting

If you encounter any issues:

1. Check the Vercel deployment logs
2. Ensure your API key is correctly set in the environment variables
3. Verify that the API endpoint in the frontend code is correctly pointing to `/api/generate`

## Custom Domain (Optional)

To use a custom domain:

1. Go to your project settings in Vercel
2. Click on "Domains"
3. Add your domain and follow the instructions to configure DNS settings