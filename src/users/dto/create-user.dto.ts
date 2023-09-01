import { IsEmail, IsNotEmpty, IsStrongPassword, MinLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(10)
    @IsStrongPassword()
    password: string;
}
