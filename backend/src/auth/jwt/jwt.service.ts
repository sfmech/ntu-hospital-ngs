import { HttpStatus, Injectable, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User as UserEntity } from 'src/database/ngs-builder/entities/user.entity';
import { User } from 'src/next-generation-sequencing/models/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class CustomJwtService {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        private jwtService: JwtService
    ) { }

    async login(loginUser:User, @Res() response,): Promise<string>{

        const user = await this.userRepository.findOne({ where: {
            userName: loginUser.userName,
            password: loginUser.password
        },});

        if(user !== undefined ){
            const token = this.sign({...user});
            response.cookie("jwt-auth-token", token, {
                secure: false,
                sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'none',
                expires: new Date(Date.now() + 259200000),
            });
            response.cookie("user-role", user.userRole, {
                secure: false,
                sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'none',
                expires: new Date(Date.now() + 259200000),
            });
            response.cookie("user-name", user.userName, {
                secure: false,
                sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'none',
                expires: new Date(Date.now() + 259200000),
            });
            return user.userRole;
        }

        return "";

    }

    sign(payload: any): string {
        return this.jwtService.sign(payload);
    }

    verifyToken(token: string | undefined): any | undefined {
        if (!token) {
            return undefined;
        }

        return this.jwtService.verify(token);
    }
}
