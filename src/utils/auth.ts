export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('admin_token');
  const expiresAt = localStorage.getItem('admin_token_expires');

  if (!token || !expiresAt) {
    return false;
  }

  const expirationDate = new Date(expiresAt);
  const now = new Date();

  if (now > expirationDate) {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_token_expires');
    return false;
  }

  return true;
};

export const logout = (): void => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_token_expires');
};
