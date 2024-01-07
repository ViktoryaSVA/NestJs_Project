import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { ExpressRequestInterface } from '@app/types/expressRequest.interface';
import { JwtPayload, verify } from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '@app/config';
import { UserService } from '@app/user/user.service';
@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(private readonly userService: UserService) {};

  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      const decoded: JwtPayload = verify(token, JWT_SECRET_KEY) as JwtPayload;
      const user = await this.userService.findById(decoded.id);
      req.user = user;
      next();
    } catch (err) {
      req.user = null;
      next(err);
    }
  }
}