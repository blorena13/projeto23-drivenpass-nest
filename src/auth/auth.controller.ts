import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { AuthService } from "./auth.service";

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  singUp(@Body() body: CreateUserDto) {
    return this.authService.signUp(body);
  }

  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() body: CreateUserDto) {
    return this.authService.signIn(body);
  }

  
}