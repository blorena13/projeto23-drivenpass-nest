import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsStrongPassword, MinLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({example: "blorena@gmail.com", description: "Email for user."})
    email: string;

    @IsNotEmpty()
    @MinLength(10)
    @IsStrongPassword()
    @ApiProperty({example: "Senh@fort1!", description: "Password for user."})
    password: string;
}
