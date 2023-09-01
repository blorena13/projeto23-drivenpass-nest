import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCardDto {

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    cardNumber: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    securityCode: string;

    @IsNotEmpty()
    date: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    isVirtual: boolean;

    @IsNotEmpty()
    type: string;
}
