import { Body, Controller, Get, HttpStatus, Post, Request, Response, UseGuards } from "@nestjs/common";
import { CustomJwtService } from "./jwt.service";


@Controller('auth')
export class JwtController {
    constructor(
        private jwtService: CustomJwtService
    ){}
    
    @Get('login')
    async login(@Request() req,@Response() res) {
       
        //console.log(req.user)
        //return this.jwtService.sign(req.user);
    }

    @Post('login')
    async loginSign(@Body() body, @Response() res) {
        const user = await this.jwtService.login(body.data, res);
        res.status(HttpStatus.OK).json([user]);
        return  res.send();
    }
}