import { getCurrentUser as amplifyGetCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

/**
 * Get current logged-in user details from AWS Cognito
 * @returns {Promise<Object>} User object with details
 */
export const getCurrentUser = async () => {
    try {
        const user = await amplifyGetCurrentUser();
        const session = await fetchAuthSession();

        if (!user || !session.tokens) {
            throw new Error('No authenticated user found');
        }

        // Extract user attributes from token
        const idToken = session.tokens.idToken;
        const payload = idToken.payload;

        return {
            userId: user.userId,
            username: user.username,
            email: payload.email || '',
            name: payload.name || '',
            emailVerified: payload.email_verified || false,
            signInDetails: user.signInDetails,
            tokens: {
                idToken: idToken.toString(),
                accessToken: session.tokens.accessToken.toString(),
            },
        };
    } catch (error) {
        console.error('Error getting current user:', error);
        throw error;
    }
};

/**
 * Get the latest ID token from Amplify session
 * @returns {Promise<string|null>} JWT token or null if not found
 */
export const getToken = async () => {
    try {
        const session = await fetchAuthSession();
        return session.tokens?.idToken?.toString() || null;
    } catch (error) {
        return null;
    }
};

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} True if authenticated, false otherwise
 */
export const isAuthenticated = async () => {
    try {
        const token = getToken();
        if (!token) return false;

        const session = await fetchAuthSession();
        return !!(session.tokens && session.tokens.idToken);
    } catch (error) {
        return false;
    }
};

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
export const signOutUser = async () => {
    try {
        const { signOut } = await import('aws-amplify/auth');
        await signOut();
        localStorage.removeItem('cloudspace_token');
    } catch (error) {
        console.error('Error signing out:', error);
        // Clear local storage even if sign out fails
        localStorage.removeItem('cloudspace_token');
        throw error;
    }
};
