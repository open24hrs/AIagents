import {
  logger,
  type Character,
  type IAgentRuntime,
  type Project,
  type ProjectAgent,
} from '@elizaos/core';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import starterPlugin from './plugin';
import myCharacter from './character';
dotenv.config({ path: '../../.env' });

/**
 * Represents the default character (Eliza) with her specific attributes and behaviors.
 * Eliza responds to messages relevant to the community manager, offers help when asked, and stays focused on her job.
 * She interacts with users in a concise, direct, and helpful manner, using humor and silence effectively.
 * Eliza's responses are geared towards resolving issues, offering guidance, and maintaining a positive community environment.
 */
export const character = myCharacter;

// Reference to the runtime that will be set during initialization
let agentRuntime: IAgentRuntime | null = null;

// Create an Express server for both health checks and serving the web client
const app = express();
const PORT = process.env.PORT || 8080;

// Parse JSON request bodies
app.use(express.json());

// Health check endpoint for DigitalOcean App Platform
const healthCheckHandler = (req: express.Request, res: express.Response): void => {
  res.status(200).send('OK');
};
app.get('/health', healthCheckHandler);

// API endpoint to send messages to the ElizaOS assistant
const messageHandler = (req: express.Request, res: express.Response): void => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Invalid message format' });
      return;
    }

    // Generate a message ID and timestamp
    const messageId = Date.now().toString();
    const timestamp = new Date().toISOString();

    // Log the message
    logger.info(`Message received (${messageId}): ${message}`);

    // Return immediate acknowledgment with a temporary response
    res.json({
      message: `I received your message and am processing it now.`,
      messageId,
      timestamp,
    });
  } catch (error) {
    logger.error('Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
};
app.post('/api/message', messageHandler);

// API endpoint to check for message responses
const responseHandler = (req: express.Request, res: express.Response): void => {
  const { messageId } = req.params;

  // In a real implementation, this would interact with the ElizaOS agent
  // through the client-direct plugin

  // For demonstration purposes, we'll simulate a response
  res.json({
    message: `This is a simulated response for message ${messageId}. In a production environment, this would be handled by the ElizaOS agent through the client-direct plugin.`,
    complete: true,
  });
};
app.get('/api/response/:messageId', responseHandler);

// Root route - serve the web client UI
const rootHandler = (req: express.Request, res: express.Response): void => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ElizaOS Assistant</title>
      <style>
        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: #f5f5f5;
        }
        header {
          background-color: #3f51b5;
          color: white;
          padding: 1rem;
          text-align: center;
        }
        main {
          flex: 1;
          padding: 1rem;
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
        }
        .chat-container {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          height: 70vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }
        .input-area {
          display: flex;
          padding: 0.5rem;
          border-top: 1px solid #eee;
        }
        input {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-right: 0.5rem;
        }
        button {
          background-color: #3f51b5;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 0.75rem 1rem;
          cursor: pointer;
        }
        .message {
          margin-bottom: 1rem;
          padding: 0.75rem;
          border-radius: 4px;
          max-width: 80%;
        }
        .user {
          background-color: #e3f2fd;
          margin-left: auto;
        }
        .assistant {
          background-color: #f1f1f1;
          margin-right: auto;
        }
        .loading {
          display: flex;
          justify-content: center;
          margin: 1rem 0;
        }
        .loading span {
          width: 10px;
          height: 10px;
          margin: 0 5px;
          background-color: #3f51b5;
          border-radius: 50%;
          display: inline-block;
          animation: bounce 1.5s infinite ease-in-out both;
        }
        .loading span:nth-child(1) { animation-delay: -0.3s; }
        .loading span:nth-child(2) { animation-delay: -0.15s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        .setup-guide {
          background-color: #fff3cd;
          border: 1px solid #ffeeba;
          color: #856404;
          padding: 1rem;
          margin-top: 1rem;
          border-radius: 4px;
        }
        code {
          background-color: #f8f9fa;
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
          font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }
      </style>
    </head>
    <body>
      <header>
        <h1>ElizaOS Assistant</h1>
      </header>
      <main>
        <div class="chat-container">
          <div class="messages" id="messages">
            <div class="message assistant">
              <p>Hello! I'm your ElizaOS assistant. How can I help you today?</p>
            </div>
          </div>
          <div class="input-area">
            <input type="text" id="user-input" placeholder="Type your message...">
            <button id="send-btn">Send</button>
          </div>
        </div>
        
        <div class="setup-guide">
          <h3>Integration Guide</h3>
          <p>This is a simple web interface for ElizaOS. To fully integrate it with your ElizaOS agent:</p>
          <ol>
            <li>Make sure the <code>@elizaos/client-direct</code> plugin is installed and configured</li>
            <li>Configure the ElizaOS agent to expose API endpoints for web clients</li>
            <li>Update the frontend JavaScript to connect to the ElizaOS API endpoints</li>
          </ol>
          <p>Check the ElizaOS documentation for more details.</p>
        </div>
      </main>
      <script>
        const messagesContainer = document.getElementById('messages');
        const userInput = document.getElementById('user-input');
        const sendBtn = document.getElementById('send-btn');
        
        // Add event listeners
        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') sendMessage();
        });
        
        // Test if direct client is available
        async function checkDirectClientStatus() {
          try {
            const response = await fetch('/api/direct/status');
            if (response.ok) {
              console.log('ElizaOS direct client is available');
              addMessage('Direct client is available. You can now chat with the ElizaOS agent.', 'system');
              return true;
            } else {
              console.error('Direct client not available');
              addMessage('Direct client is not available. Using simulated responses.', 'system');
              return false;
            }
          } catch (error) {
            console.error('Error connecting to direct client:', error);
            addMessage('Could not connect to ElizaOS agent. Using simulated responses.', 'system');
            return false;
          }
        }
        
        async function sendMessage() {
          const message = userInput.value.trim();
          if (!message) return;
          
          // Add user message to chat
          addMessage(message, 'user');
          userInput.value = '';
          
          // Show loading indicator
          const loadingDiv = document.createElement('div');
          loadingDiv.className = 'loading';
          for (let i = 0; i < 3; i++) {
            const span = document.createElement('span');
            loadingDiv.appendChild(span);
          }
          messagesContainer.appendChild(loadingDiv);
          
          try {
            // Try to send to direct client first
            let responseText = null;
            
            try {
              // Send to the ElizaOS direct client
              const directResponse = await fetch('/api/direct/message', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  message: message,
                  sender: 'user'
                }),
              });
              
              if (directResponse.ok) {
                const data = await directResponse.json();
                responseText = data.response || data.text || data.message;
              }
            } catch (directError) {
              console.log('Direct client unavailable, falling back to simulated response');
            }
            
            // Remove loading indicator
            if (messagesContainer.contains(loadingDiv)) {
              messagesContainer.removeChild(loadingDiv);
            }
            
            // If direct client failed, use our simulated response
            if (!responseText) {
              const response = await fetch('/api/message', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
              });
              
              if (!response.ok) {
                throw new Error('Failed to get response');
              }
              
              const data = await response.json();
              
              // Show initial response
              addMessage(data.message, 'assistant');
              
              // Poll for the actual response if we received a messageId
              if (data.messageId) {
                pollForResponse(data.messageId);
              }
            } else {
              // Add the direct client response
              addMessage(responseText, 'assistant');
            }
          } catch (error) {
            // Remove loading indicator
            if (messagesContainer.contains(loadingDiv)) {
              messagesContainer.removeChild(loadingDiv);
            }
            
            // Show error message
            addMessage("Sorry, I couldn't process your message. Please try again later.", 'assistant');
            console.error('Error:', error);
          }
        }
        
        async function pollForResponse(messageId) {
          try {
            // Check for response
            const response = await fetch('/api/response/' + messageId);
            
            if (!response.ok) {
              throw new Error('Failed to get response');
            }
            
            const data = await response.json();
            
            if (data.complete) {
              // Remove loading indicator
              if (messagesContainer.contains(loadingDiv)) {
                messagesContainer.removeChild(loadingDiv);
              }
              
              // Add the response to the chat
              addMessage(data.message, 'assistant');
            } else {
              // Continue polling
              setTimeout(() => pollForResponse(messageId), 1000);
            }
          } catch (error) {
            console.error('Error polling for response:', error);
            
            // Remove loading indicator
            if (messagesContainer.contains(loadingDiv)) {
              messagesContainer.removeChild(loadingDiv);
            }
          }
        }
        
        function addMessage(text, sender) {
          const messageDiv = document.createElement('div');
          messageDiv.classList.add('message', sender);
          
          const paragraph = document.createElement('p');
          paragraph.textContent = text;
          
          messageDiv.appendChild(paragraph);
          messagesContainer.appendChild(messageDiv);
          
          // Scroll to bottom
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
        // Check direct client status on page load
        checkDirectClientStatus();
      </script>
    </body>
    </html>
  `);
};
app.get('/', rootHandler);

// Start the server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

const initCharacter = ({ runtime }: { runtime: IAgentRuntime }) => {
  logger.info('Initializing character');
  logger.info('Name: ', character.name);

  // Store the runtime for later use
  agentRuntime = runtime;
};

export const projectAgent: ProjectAgent = {
  character,
  init: async (runtime: IAgentRuntime) => await initCharacter({ runtime }),
  plugins: [starterPlugin],
};
const project: Project = {
  agents: [projectAgent],
};

export default project;
