import { Injectable } from "@nestjs/common";
import { CreateNoteDto } from "./dto/create-note.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class NotesRepository {
  constructor(private readonly prisma: PrismaService) { }
  
  createNotes(body: CreateNoteDto, userId: number) {
    return this.prisma.notes.create({
        data: {...body, userId}
    })
  }
  getByTitle(title: string, userId: any) {
   return this.prisma.notes.findFirst({
    where: {
        title, 
        userId
    }
   })
  }

  findAllUserId(userId: number) {
    return this.prisma.notes.findMany({
        where: {userId}
    })
  }

  findById(id: number) {
    return this.prisma.notes.findFirst({
        where: {id}
    })
  }

  deleteById(id: number) {
    return this.prisma.notes.delete({
        where: {id}
    })
  }

  deleteByUserId(userId: number) {
   return this.prisma.notes.deleteMany({
    where: {userId}
   })
  }

}