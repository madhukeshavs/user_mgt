import BlacklistedToken from "../model/token.model.js";
import { generateResponse } from "../services/responseGenerator.js";
import { verifyToken } from "../services/tokenServices.js";

const authenticateToken = async(req, res, next) =>{
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <token>

  if (!token) return res.status(401).json(generateResponse(401, "Access token is required", null));

  let tokenStatus = await verifyToken(token);
  if (!tokenStatus) return res.status(403).json(generateResponse(403, "Invalid or expired token", null));

  let tokenBlacklist = await BlacklistedToken.findOne({ token });
  if (tokenBlacklist) return res.status(403).json(generateResponse(403, "Token is blacklisted", null));

  // If token is valid, decode it to get user information
  req.userId = tokenStatus?.userId || null;;
  next();
}

export default authenticateToken;
