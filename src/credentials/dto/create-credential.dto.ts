import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateCredentialDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    @IsUrl()
    url: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    password: string;
}
