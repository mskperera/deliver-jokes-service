// src/middlewares/auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1]; // Bearer token

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      // Verify token using secret key from environment variables
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req['user'] = decoded; // Attach user info to the request object
      next(); // Proceed to the next middleware
    } catch (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
  }
}
