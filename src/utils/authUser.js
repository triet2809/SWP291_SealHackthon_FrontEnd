export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('seal_user') || 'null');
  } catch {
    return null;
  }
}

export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'U';
}
