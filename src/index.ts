import * as dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import path from 'path';

// Load environment variables
dotenv.config();

// Create an Express server for the web interface
const app = express();
const PORT = process.env.PORT || 8080;

// Parse JSON request bodies
app.use(express.json());

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).send('OK');
});

// API endpoint to send messages to the AI agent
app.post('/api/message', async (req: Request, res: Response) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== 'string') {
            res.status(400).json({ error: 'Invalid message format' });
            return;
        }

        // Generate a message ID and timestamp
        const messageId = Date.now().toString();
        const timestamp = new Date().toISOString();

        // Here we would integrate with Google's API
        // For now, we'll return a simple response
        res.json({
            messageId,
            timestamp,
            response: `I received your message: "${message}". The Google API integration will be implemented here.`
        });
    } catch (error) {
        console.error('Error processing message:', error);
        res.status(500).json({ error: 'Failed to process message' });
    }
});

// Serve the web interface
app.get('/', (_req: Request, res: Response) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AI Agent Chat Interface</title>
            <style>
                body {
                    font-family: system-ui, -apple-system, sans-serif;
                    margin: 0;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                }
                .chat-container {
                    max-width: 800px;
                    margin: 0 auto;
                    width: 100%;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
                .messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    min-height: 400px;
                }
                .input-area {
                    display: flex;
                    gap: 10px;
                }
                input {
                    flex: 1;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }
                button {
                    padding: 10px 20px;
                    background: #0066cc;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                button:hover {
                    background: #0052a3;
                }
                .message {
                    margin-bottom: 10px;
                    padding: 10px;
                    border-radius: 4px;
                }
                .user-message {
                    background: #e3f2fd;
                    margin-left: 20%;
                }
                .agent-message {
                    background: #f5f5f5;
                    margin-right: 20%;
                }
            </style>
        </head>
        <body>
            <div class="chat-container">
                <h1>AI Agent Chat Interface</h1>
                <div class="messages" id="messages">
                    <div class="message agent-message">
                        Hello! I'm your AI agent. How can I help you today?
                    </div>
                </div>
                <div class="input-area">
                    <input type="text" id="messageInput" placeholder="Type your message...">
                    <button onclick="sendMessage()">Send</button>
                </div>
            </div>
            <script>
                const messagesContainer = document.getElementById('messages');
                const messageInput = document.getElementById('messageInput');

                async function sendMessage() {
                    const message = messageInput.value.trim();
                    if (!message) return;

                    // Add user message
                    addMessage(message, 'user');
                    messageInput.value = '';

                    try {
                        const response = await fetch('/api/message', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ message })
                        });

                        const data = await response.json();
                        
                        if (response.ok) {
                            addMessage(data.response, 'agent');
                        } else {
                            addMessage('Sorry, there was an error processing your message.', 'agent');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        addMessage('Sorry, there was an error processing your message.', 'agent');
                    }
                }

                function addMessage(text, sender) {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = \`message \${sender}-message\`;
                    messageDiv.textContent = text;
                    messagesContainer.appendChild(messageDiv);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }

                // Handle Enter key
                messageInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        sendMessage();
                    }
                });
            </script>
        </body>
        </html>
    `);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to access the chat interface`);
});
