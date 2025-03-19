# ElizaOS Assistant

A custom ElizaOS assistant configured for deployment on DigitalOcean App Platform.

## Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Build the project:
   ```
   npm run build
   ```

3. Start the project:
   ```
   npm start
   ```

The web client will be available at http://localhost:3000.

## Process Management with PM2

The project is configured to use PM2 for process management in production. PM2 ensures your application runs continuously and handles automatic restarts if the process crashes.

### Running with PM2 locally

1. Install PM2 globally:
   ```
   npm install -g pm2
   ```

2. Start the application using PM2:
   ```
   pm2 start ecosystem.config.js
   ```

3. Check status:
   ```
   pm2 status
   ```

4. View logs:
   ```
   pm2 logs eliza-assistant
   ```

5. Stop the application:
   ```
   pm2 stop eliza-assistant
   ```

In production, the application uses `pm2-runtime` which is optimized for containerized environments.

## Deploying to DigitalOcean App Platform

### Option 1: Deploy with App Platform UI

1. Push this project to GitHub.
2. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps).
3. Click "Create App" and select your GitHub repository.
4. Select the "Dockerfile" deployment method.
5. Configure the environment variables if needed.
6. Deploy the app.

### Option 2: Deploy with doctl CLI

1. Install the [DigitalOcean CLI (doctl)](https://docs.digitalocean.com/reference/doctl/how-to/install/).
2. Authenticate with your API token:
   ```
   doctl auth init
   ```

3. Deploy using the app spec:
   ```
   doctl apps create --spec .do/app.yaml
   ```

## Project Structure

- `src/character.ts` - Custom character definition
- `src/index.ts` - Main application code
- `src/plugin.ts` - Plugin logic
- `Dockerfile` - Container definition for deployment
- `ecosystem.config.js` - PM2 process manager configuration
- `.do/app.yaml` - DigitalOcean App Platform configuration
