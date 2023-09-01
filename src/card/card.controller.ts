import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UserOn } from '../decorators/user.decorator';
import { User } from '@prisma/client';
import { AuthGuard } from '../guards/auth.guard';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() body: CreateCardDto, @UserOn() userOn: User) {
    try {
      return this.cardService.create(body, userOn.id);
    } catch(error){
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@UserOn() userOn: User) {
    return this.cardService.findAll(userOn.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @UserOn() userOn: User) {
    return this.cardService.findOne(+id, userOn.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @UserOn() userOn: User) {
    return this.cardService.remove(+id, userOn.id);
  }
}
