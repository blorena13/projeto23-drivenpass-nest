import { IsNotEmpty, IsString } from "class-validator";

export class CreateNoteDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    notes: string;
}
