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
- `.do/app.yaml` - DigitalOcean App Platform configuration
