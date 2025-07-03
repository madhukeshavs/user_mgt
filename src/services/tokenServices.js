import jwt from 'jsonwebtoken';
import BlacklistedToken from '../model/token.model.js';

// Secret key for signing the token
const SECRET_KEY = 'your-secret-key';


export const generateToken = async (userId) => {
    const payload = {
        userId: userId,
        iat: Math.floor(Date.now() / 1000), // Issued at
        nbf: Math.floor(Date.now() / 1000), // Not valid before
        exp: Math.floor(Date.now() / 1000) + 3600 * 24 // Expires in 24 hours
    };
    
    return jwt.sign(payload, SECRET_KEY);
}

export const verifyToken = async (token) => {
    let tokenDecoded = null;
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error("Token verification failed:", err);
            tokenDecoded =  null;
        }
        tokenDecoded =  decoded; // Token is valid, return decoded payload
    });
    return tokenDecoded;
};


export const blacklistToken = async (token, expiresInSeconds) => {
  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
  const blacklisted = await BlacklistedToken.create({ token, expiresAt });
  return blacklisted;
}
