import constanceVariable from "./constanceVariable";

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

/**
 * Converts a Date object to a local ISO-like string with a dynamic timezone offset.
 * Format: YYYY-MM-DDTHH:mm:ss+HH:mm
 * @param {Date} date The Date object to convert.
 * @param {returnType} 'ISO_STR || OBJ_DATE' The type to be return Object or String, default String
 * @returns {string} The formatted date string.
 */
const getLocalISOStr = (targetDate, returnType) => {
  const date = new Date(targetDate);
  // Helper to ensure numbers have a leading zero if needed
  const pad = (num) => num.toString().padStart(2, "0");
  // Get local date and time components
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  // Get the timezone offset in minutes from UTC. The sign is inverted.
  const offsetMinutes = -date.getTimezoneOffset();

  // Calculate the offset's hours and minutes
  const offsetSign = offsetMinutes >= 0 ? "+" : "-";
  const offsetHours = pad(Math.floor(Math.abs(offsetMinutes) / 60));
  const offsetMinutesPart = pad(Math.abs(offsetMinutes) % 60);

  // Combine all parts into the final string
  const isoStr = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${offsetHours}:${offsetMinutesPart}`;
  return returnType === constanceVariable.ReturnDateType.ISO_STR ? isoStr: date;
};
export default {
  setSessionItem,
  getSessionItem,
  removeSessionItem,
  clearSession,
  getLocalISOStr,
};