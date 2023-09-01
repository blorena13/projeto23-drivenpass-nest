import { Controller, Get, Post, Body, Param, Delete, UseGuards, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UserOn } from '../decorators/user.decorator';
import { User } from '@prisma/client';
import { AuthGuard } from '../guards/auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) { }

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({summary: "Create a note."})
  @ApiResponse({status: HttpStatus.CREATED})
  async create(@Body() body: CreateNoteDto, @UserOn() userOn: User) {
    try {
      return await this.notesService.create(body, userOn.id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({summary: "Get all user notes."})
  @ApiResponse({status: HttpStatus.OK})
  findAll(@UserOn() userOn: User) {
    return this.notesService.findAll(userOn.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({summary: "Get a specific user notes."})
  @ApiResponse({status: HttpStatus.OK})
  findOne(@Param('id') id: string, @UserOn() userOn: User) {
    return this.notesService.findOne(+id, userOn.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({summary: "Delete a specific user notes."})
  remove(@Param('id') id: string, @UserOn() userOn: User) {
    return this.notesService.remove(+id, userOn.id);
  }
}
