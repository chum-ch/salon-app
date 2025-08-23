/**
 * Sets an item in sessionStorage. Automatically stringifies objects and arrays.
 * @param {string} key The key to store the data under.
 * @param {*} value The value to store.
 */
const setSessionItem = (key, value) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to sessionStorage:', error);
  }
};

/**
 * Gets an item from sessionStorage and automatically parses it back to an object or array.
 * @param {string} key The key of the item to retrieve.
 * @returns {*} The parsed value, or null if the item doesn't exist.
 */
const getSessionItem = (key) => {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error retrieving from sessionStorage:', error);
    return null;
  }
};

/**
 * Removes a specific item from sessionStorage.
 * @param {string} key The key of the item to remove.
 */
const removeSessionItem = (key) => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from sessionStorage:', error);
  }
};

/**
 * Clears all items from sessionStorage.
 */
const clearSession = () => {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error('Error clearing sessionStorage:', error);
  }
};

export default {
  setSessionItem,
  getSessionItem,
  removeSessionItem,
  clearSession,
};