import { format, isValid, parseISO } from 'date-fns';

/**
 * Safely formats a date with validation
 * @param {Date|string|number} date - Date to format
 * @param {string} formatStr - Format string for date-fns
 * @param {string} fallback - Fallback value if date is invalid
 * @returns {string} Formatted date or fallback value
 */
export function safeFormat(date, formatStr = 'MMM d, yyyy', fallback = 'N/A') {
  if (!date) return fallback;
  
  try {
    // Handle string dates (ISO format from API)
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    // Validate the date object
    if (!isValid(dateObj)) {
      return fallback;
    }
    
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Date formatting error:', error);
    return fallback;
  }
}

/**
 * Checks if a value is a valid date
 * @param {any} date - Value to check
 * @returns {boolean} True if valid date
 */
export function isValidDate(date) {
  if (!date) return false;
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj);
  } catch {
    return false;
  }
}