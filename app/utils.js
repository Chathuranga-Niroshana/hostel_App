import jwt from 'jsonwebtoken';

export function createToken(payload) {
  const secretKey = process.env.JWT_SECRET; // Get from environment
  if (!secretKey) {
    throw new Error("JWT secret key not found in environment variables.");
  }
  return jwt.sign(payload, secretKey); 
}