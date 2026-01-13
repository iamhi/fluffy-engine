import { database } from './shared.js';
import { setup as userRepositorySetup } from './userRepository.js';

export const setupAllRepositories = () => {
  userRepositorySetup(database);
};
