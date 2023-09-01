import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from "bcrypt";
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {

    private ISSUER = "Driven";
    private AUDIENCE = "user";

    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UsersService){ }

    async signUp(body: SignUpDto) {
        return await this.userService.createUser(body);
    }

    async signIn(body: SignInDto) {
        const { email, password } = body;

        const user = await this.userService.getUserByEmail(email);
        if(!user) throw new UnauthorizedException("Email or password not valid");

        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword) throw new UnauthorizedException("Password not valid");

        return this.createToken(user);
    }
    

    createToken(user: User){
        const { id, email } = user;
        const token = this.jwtService.sign({email}, {
            subject: String(id),
            issuer: this.ISSUER,
            audience: this.AUDIENCE
        });

        return { token };
    }

    checkToken(token: string){
        const data = this.jwtService.verify(token, {
            audience: this.AUDIENCE,
            issuer: this.ISSUER
        });
        return data;
    }
}
