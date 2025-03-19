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

## Connecting to ElizaOS Backend

The web interface is currently set up with a simulated backend. To connect it to your actual ElizaOS agent:

### 1. Configure the client-direct Plugin

Make sure the `@elizaos/client-direct` plugin is properly configured in your character file:

```json
{
  "name": "Assistant",
  "plugins": [
    "@elizaos/plugin-sql",
    "@elizaos/client-direct"
  ],
  "settings": {
    "client-direct": {
      "enabled": true,
      "port": 3000,
      "cors": true
    },
    "secrets": {}
  },
  "system": "You are a helpful assistant..."
}
```

### 2. Configure Proxy in DigitalOcean

In your DigitalOcean App Platform configuration, add a proxy pass rule to forward requests to the direct client:

```yaml
routes:
  - path: /api/direct
    component:
      name: web
    preserve_path_prefix: true
```

### 3. Test the Connection

Once deployed, you can test if the direct client is properly connected:

```javascript
// From the browser console
fetch('/api/direct/status')
  .then(response => response.json())
  .then(data => console.log(data));
```

### 4. Integration Steps

The project includes a `client-connector.ts` file with utility functions for integrating with the ElizaOS direct client:

- `connectToElizaOSAgent()`: Checks if the direct client is available
- `sendMessageToAgent(message)`: Sends a message to the agent
- `getConversationHistory()`: Retrieves conversation history

To fully integrate:

1. Import these functions in your frontend code
2. Replace the simulated backend with calls to these functions
3. Update the UI to display responses from your ElizaOS agent

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

## Troubleshooting

If you're having trouble connecting to the ElizaOS backend:

1. **Check logs**: Look at the ElizaOS logs to see if the direct client plugin is properly initialized
2. **Verify ports**: Make sure the port specified in your character file is accessible
3. **CORS issues**: If you get CORS errors, make sure CORS is enabled in the client-direct settings
4. **Proxy configuration**: Double-check your DigitalOcean proxy routing configuration
5. **Plugin version**: Ensure you're using a compatible version of the client-direct plugin

## Project Structure

- `src/character.ts` - Custom character definition
- `src/index.ts` - Main application code
- `src/plugin.ts` - Plugin logic
- `src/client-connector.ts` - Utilities for connecting to ElizaOS
- `Dockerfile` - Container definition for deployment
- `.do/app.yaml` - DigitalOcean App Platform configuration
