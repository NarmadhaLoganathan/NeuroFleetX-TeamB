import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

export const getTokenExpirationTime = (token) => {
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000; // Convert to milliseconds
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const getRemainingTokenTime = (token) => {
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) return 0;
  
  return expirationTime - Date.now();
};