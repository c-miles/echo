/**
 * Room name generation is handled server-side.
 * This file contains only validation utilities.
 */

/**
 * Validates if a string matches the expected room name format
 */
export const isValidRoomNameFormat = (name: string): boolean => {
  // Matches: word-word-word (3+ chars each, lowercase letters only)
  const roomNamePattern = /^[a-z]{3,}-[a-z]{3,}-[a-z]{3,}$/;
  return roomNamePattern.test(name);
};