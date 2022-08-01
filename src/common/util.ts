export const extractTokenFromAuthHeader = (authHeader: string) => {
  return authHeader.substring(7, authHeader.length);
};