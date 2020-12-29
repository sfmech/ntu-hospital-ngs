import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { CustomJwtService } from '../../auth/jwt/jwt.service';
import * as express from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
	constructor(private jwtService: CustomJwtService) {}

	use(request: express.Request, response: express.Response, next: express.NextFunction): any {

		if (this.jwtService.verifyToken(request.cookies['jwt-auth-token']) === undefined) {
      //console.log(request.url)
			//return response.redirect(HttpStatus.FOUND, '/login');
		}

		return next();
	}
}
