import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class DeleteDto {

    @IsNotEmpty()
    @ApiProperty({example: "Senh@fort1!", description: "Password for user."})
    password: string;
}