import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class SignInDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({example: "blorena@gmail.com", description: "Email for user."})
    email: string;

    @IsNotEmpty()
    @IsStrongPassword()
    @ApiProperty({example: "Senh@fort1!", description: "Password for user."})
    password: string;
}