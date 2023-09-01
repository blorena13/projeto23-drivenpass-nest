import { Controller, Get, Post, Body, Param, Delete, UseGuards, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UserOn } from '../decorators/user.decorator';
import { User } from '@prisma/client';
import { AuthGuard } from '../guards/auth.guard';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) { }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() body: CreateNoteDto, @UserOn() userOn: User) {
    try {
      return await this.notesService.create(body, userOn.id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@UserOn() userOn: User) {
    return this.notesService.findAll(userOn.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @UserOn() userOn: User) {
    return this.notesService.findOne(+id, userOn.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @UserOn() userOn: User) {
    return this.notesService.remove(+id, userOn.id);
  }
}
