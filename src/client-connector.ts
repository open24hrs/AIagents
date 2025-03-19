import { logger } from '@elizaos/core';

/**
 * This file contains utility functions for connecting our web interface
 * with the ElizaOS backend through the client-direct plugin.
 */

// Response type for message API
interface MessageResponse {
    response?: string;
    error?: string;
}

// Response type for history API
interface HistoryResponse {
    history?: any[];
    error?: string;
}

// Function to send messages to the direct client
export async function connectToElizaOSAgent(): Promise<boolean> {
    try {
        // Check if the direct client is available
        const baseUrl = '/api/direct';
        const response = await fetch(`${baseUrl}/status`);
        if (response.ok) {
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
        const baseUrl = '/api/direct';
        const response = await fetch(`${baseUrl}/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                sender: 'user',
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to send message: ${response.statusText}`);
        }

        const data = await response.json() as MessageResponse;
        return data.response || 'No response from agent';
    } catch (error) {
        logger.error('Error sending message to agent:', error);
        return 'Sorry, there was an error processing your message. Please try again later.';
    }
}

// Function to get conversation history
export async function getConversationHistory(): Promise<any[]> {
    try {
        const baseUrl = '/api/direct';
        const response = await fetch(`${baseUrl}/history`);

        if (!response.ok) {
            throw new Error(`Failed to get history: ${response.statusText}`);
        }

        const data = await response.json() as HistoryResponse;
        return data.history || [];
    } catch (error) {
        logger.error('Error getting conversation history:', error);
        return [];
    }
} 