import { logger } from '@elizaos/core';
import { DirectClient } from '@elizaos/client-direct';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize the DirectClient with configuration
const elizaClient = new DirectClient({
    apiKey: process.env.ELIZAOS_API_KEY || '',
    endpoint: process.env.ELIZAOS_ENDPOINT || '',
    model: process.env.ELIZAOS_MODEL || '',
    google: {
        apiKey: process.env.GOOGLE_API_KEY || '',
        projectId: process.env.GOOGLE_PROJECT_ID || '',
        region: process.env.GOOGLE_REGION || ''
    }
});

/**
 * This file contains utility functions for connecting our web interface
 * with the ElizaOS backend through the client-direct plugin.
 */

// Response type for message API
interface MessageResponse {
    success: boolean;
    message?: string;
    error?: string;
}

// Function to send messages to the direct client
export async function connectToElizaOSAgent(): Promise<boolean> {
    try {
        const status = await elizaClient.getStatus();
        if (status.connected) {
            logger.info('Direct client is available');
            return true;
        } else {
            logger.warn('Direct client is not available');
            return false;
        }
    } catch (error) {
        logger.error('Error connecting to direct client:', error);
        return false;
    }
}

// Function to send a message to the ElizaOS agent
export async function sendMessageToAgent(message: string): Promise<string> {
    try {
        const response = await elizaClient.send({
            content: message,
            role: 'user',
            useGoogleApi: true
        });

        if (!response.success) {
            throw new Error(response.error || 'Failed to send message');
        }

        return response.content || 'No response from agent';
    } catch (error) {
        logger.error('Error sending message to agent:', error);
        return 'Sorry, there was an error processing your message. Please try again later.';
    }
}

// Function to get conversation history
export async function getConversationHistory(): Promise<any[]> {
    try {
        const history = await elizaClient.getHistory();
        return history.messages || [];
    } catch (error) {
        logger.error('Error getting conversation history:', error);
        return [];
    }
} 