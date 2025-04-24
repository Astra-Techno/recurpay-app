export const isEmpty = (value) => {
  // Handle null/undefined/false immediately
  if (value === null || value === undefined || value === false)
    return true;

  // Handle strings (including whitespace-only strings)
  if (typeof value === 'string')
    return value.trim() === '';

  // Handle arrays
  if (Array.isArray(value))
    return value.length === 0;

  // Handle objects (but exclude Date, Set, Map, etc.)
  if (typeof value === 'object' && value !== null && value.constructor === Object)
    return Object.keys(value).length === 0;

  // All other cases are not empty
  return false;
};

export function ucfirst(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
}