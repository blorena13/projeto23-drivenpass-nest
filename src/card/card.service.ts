import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { CardRepository } from './card.repository';

@Injectable()
export class CardService {
  constructor(private readonly cardRepository: CardRepository) { }

  async create(body: CreateCardDto, userId: number) {

    if(!body.title || 
      !body.cardNumber || 
      !body.name || 
      !body.securityCode || 
      !body.date || 
      !body.password || 
      !body.isVirtual || 
      !body.type) { throw new BadRequestException();} 

    const verifyTitle = await this.cardRepository.getByTitle(body.title, userId);
    if(verifyTitle) throw new ConflictException("This title already exists!");

    return this.cardRepository.createCard(body, userId);
  }

  findAll(userId: number) {
    return this.cardRepository.findAllByUserId(userId);
  }

 async findOne(id: number, userId: number) {

  const card = await this.cardRepository.findById(id);
  if(!card) throw new NotFoundException("card not found!");
  if(card.userId !== userId) throw new ForbiddenException("This card belongs another user!");

    return card;
  }

  async remove(id: number, userId: number) {
    const card = await this.cardRepository.findById(id);
    if(!card) throw new NotFoundException("card not found!");
    if(card.userId !== userId) throw new ForbiddenException("This card belongs another user!");

    return this.cardRepository.deleteById(id);
  }

  removeByUserId(userId: number){
    return this.cardRepository.deleteByUserId(userId);
  }
}
