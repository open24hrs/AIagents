import {
  logger,
  type Character,
  type IAgentRuntime,
  type Project,
  type ProjectAgent,
} from '@elizaos/core';
import dotenv from 'dotenv';
import express from 'express';
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

// Create a simple health check endpoint for DigitalOcean App Platform
if (process.env.NODE_ENV === 'production') {
  const app = express();
  const PORT = process.env.PORT || 8080;

  app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

  app.listen(PORT, () => {
    logger.info(`Health check server listening on port ${PORT}`);
  });
}

const initCharacter = ({ runtime }: { runtime: IAgentRuntime }) => {
  logger.info('Initializing character');
  logger.info('Name: ', character.name);
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
