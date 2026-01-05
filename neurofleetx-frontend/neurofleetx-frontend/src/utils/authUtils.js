import { jwtDecode } from 'jwt-decode';

/**
 * Retrieves the user ID from the stored JWT token.
 * Looks for 'jwtToken' in localStorage, parses it, decodes the token,
 * and extracts the 'userId' claim.
 * @returns {string|number|null} The user ID if found, otherwise null.
 */
const getUserIdFromStorage = () => {
    try {
        const stored = localStorage.getItem("jwtToken");
        if (!stored) return null;

        const parsed = JSON.parse(stored);
        if (!parsed.token) return null;

        const decoded = jwtDecode(parsed.token);
        return decoded.userId || null;
    } catch (error) {
        console.error("Error retrieving user ID from storage:", error);
        return null;
    }
};

export default getUserIdFromStorage;
