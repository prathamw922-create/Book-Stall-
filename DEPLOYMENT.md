# Deployment Guide for BookStall MERN E-Commerce

This guide outlines the steps to deploy the BookStall web application to a production environment.

## Prerequisites
- Server (e.g., VPS on DigitalOcean, AWS EC2, or platforms like Vercel/Render)
- MongoDB Atlas account and cluster
- Node.js (v18+) and npm installed on your deployment server
- PM2 (Process Manager for Node.js) installed globally on your server: `npm install -g pm2`

## 1. Backend Deployment

1. **Clone the repository** to your server.
2. Navigate to the `server` directory: `cd "Book Store/server"`
3. **Install dependencies**: `npm install`
4. **Environment Variables**:
   - Create a `.env` file based on `.env.example`.
   - Update `MONGODB_URI` with your production MongoDB Atlas connection string.
   - Set a strong, secure `JWT_SECRET`.
   - Ensure `NODE_ENV=production`.
   - Update `CLIENT_URL` to match your production frontend URL (e.g., `https://bookstall.com`).
5. **Start Server**: 
   ```bash
   pm2 start server.js --name "bookstall-api"
   pm2 save
   ```
6. **Reverse Proxy (Nginx/Apache)**:
   - Configure a reverse proxy to map your domain (e.g., `api.bookstall.com`) to the Node server running on port `5000` (or whatever `PORT` you specified).

## 2. Frontend Deployment

### Option A: Deploying alongside the backend (Single Server Setup)

1. Navigate to the `client` directory: `cd "Book Store/client"`
2. **Install dependencies**: `npm install`
3. **Configure Environment**:
   - Create a `.env` file in the client directory.
   - Set `VITE_API_URL` to your production backend API URL (e.g., `https://api.bookstall.com/api`).
4. **Build the application**:
   ```bash
   npm run build
   ```
5. **Serve the build**:
   - You can serve the static files in the `dist` folder using Nginx, Apache, or any static file server.
   - Make sure your web server is configured to handle React Router client-side routing by redirecting all traffic to `index.html`. For Nginx:
     ```nginx
     location / {
       try_files $uri /index.html;
     }
     ```

### Option B: Deploying to Vercel/Netlify (Recommended for Frontend)

1. Push your repository to GitHub.
2. Import the project into Vercel or Netlify.
3. Set the **Root Directory** to `client` (or `"Book Store/client"` depending on your repo structure).
4. Set the **Build Command** to `npm run build`.
5. Set the **Output Directory** to `dist`.
6. Add the environment variable `VITE_API_URL` pointing to your deployed backend API.
7. Deploy.

## Security Checklist Before Go-Live
- [ ] Change the default Admin password via the MongoDB database or a secure endpoint if you utilized the seed script.
- [ ] Ensure MongoDB Network Access is restricted (e.g., only allowing your backend server's IP).
- [ ] Implement HTTPS/SSL certificates (e.g., Let's Encrypt via Certbot) on both your frontend and backend domains.
- [ ] Ensure `NODE_ENV=production` is set so error details are obscured from users.
- [ ] Securely manage and rotate your `JWT_SECRET`.
