import { database } from './shared.js';
import { setup as userRepositorySetup } from './userRepository.js';
import { setup as messageRepositorySetup } from './messageRepository.js';
import { setup as conversationRepository } from './conversationRepository.js';

export const setupAllRepositories = () => {
  userRepositorySetup(database);
  messageRepositorySetup(database);
  conversationRepository(database);
};
