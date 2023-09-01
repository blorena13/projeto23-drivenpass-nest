import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { UsersService } from "../users/users.service";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService
    ) { }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const { authorization } = request.headers;

        try{
            const data = this.authService.checkToken((authorization ?? "").split(" ")[1]);
            const user = await this.usersService.getUserById(parseInt(data.sub));
            request.user = user;
            return true;
        } catch(error){
            console.log(error);
            throw new UnauthorizedException();
        }
    }
}