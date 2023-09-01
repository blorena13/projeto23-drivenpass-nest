import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateNoteDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: "testando", description: "Title for notes."})
    title: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: "loves u taylor !", description: "Notes for create a notes."})
    notes: string;
}
