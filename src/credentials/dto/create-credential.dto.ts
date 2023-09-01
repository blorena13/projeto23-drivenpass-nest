import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateCredentialDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: "teste", description: "Title for credential."})
    title: string;

    @IsNotEmpty()
    @IsString()
    @IsUrl()
    @ApiProperty({example: "https://www.twitter.com", description: "Url for credential."})
    url: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: "lorena", description: "Username for credential."})
    name: string;

    @IsNotEmpty()
    @ApiProperty({example: "testando", description: "Password for credential."})
    password: string;
}
