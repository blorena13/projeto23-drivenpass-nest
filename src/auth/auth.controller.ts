import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Auth')
@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  @ApiOperation({summary: "Create new user."})
  @ApiResponse({status: HttpStatus.CREATED})
  singUp(@Body() body: CreateUserDto) {
    return this.authService.signUp(body);
  }

  @Post('/sign-in')
  @ApiOperation({summary: "Login and create a token."})
  @ApiResponse({status: HttpStatus.OK})
  @HttpCode(HttpStatus.OK)
  signIn(@Body() body: CreateUserDto) {
    return this.authService.signIn(body);
  }

  
}