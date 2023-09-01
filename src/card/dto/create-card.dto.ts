import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCardDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: "teste", description: "Title for card."})
    title: string;

    @IsNotEmpty()
    @ApiProperty({example: "5301 3161 6374 2070", description: "Card Number."})
    cardNumber: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: "lorena", description: "Card name."})
    name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: "250", description: "Card security code."})
    securityCode: string;

    @IsNotEmpty()
    @ApiProperty({example: "02/25", description: "Expiration date."})
    date: string;

    @IsNotEmpty()
    @ApiProperty({example: "senha1", description: "Card password."})
    password: string;

    @IsNotEmpty()
    @ApiProperty({example: "true", description: "Check if card is virtual or not."})
    isVirtual: boolean;

    @IsNotEmpty()
    @ApiProperty({example: "crédito", description: "If card is debit, credit or both."})
    type: string;
}
