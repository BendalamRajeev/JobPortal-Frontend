
/**
 * Format a date value properly, handling both Date objects and strings
 * @param dateValue Date value to format
 * @returns Formatted date string
 */
export const formatDate = (dateValue: Date | string): string => {
  if (!dateValue) return 'Unknown date';
  
  if (dateValue instanceof Date) {
    return dateValue.toLocaleDateString();
  }
  
  // If it's a string, try to convert it to a Date
  try {
    return new Date(dateValue).toLocaleDateString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};
