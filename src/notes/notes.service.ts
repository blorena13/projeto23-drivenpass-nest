import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { NotesRepository } from './notes.repository';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) { }

  async create(body: CreateNoteDto, userId: number) {
    if(!body.title || !body.notes) throw new BadRequestException();
    const verifyTitle = await this.notesRepository.getByTitle(body.title, userId);
    if(verifyTitle) throw new ConflictException("This title already exists!");

    return this.notesRepository.createNotes(body, userId);
  }

  findAll(userId: number) {
    return this.notesRepository.findAllUserId(userId);
  }

  async findOne(id: number, userId: number) {
    const credential = await this.notesRepository.findById(id);

    if(!credential) throw new NotFoundException("Notes not found!");
    if(credential.userId !== userId) throw new ForbiddenException("This notes belongs another user!");
    return credential;
  }

  async remove(id: number, userId: number) {
    const credential = await this.notesRepository.findById(id);

    if(!credential) throw new NotFoundException("Notes not found!");
    if(credential.userId !== userId) throw new ForbiddenException("This notes belongs another user!");

    return this.notesRepository.deleteById(id);
  }

  removeByUserId(userId: number){
    return this.notesRepository.deleteByUserId(userId);
  }
}
