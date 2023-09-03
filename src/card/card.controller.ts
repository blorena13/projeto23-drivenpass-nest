import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UserOn } from '../decorators/user.decorator';
import { User } from '@prisma/client';
import { AuthGuard } from '../guards/auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Cards')
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({summary: "Create a card."})
  @ApiResponse({status: HttpStatus.CREATED})
  create(@Body() body: CreateCardDto, @UserOn() userOn: User) {
    try {
      return this.cardService.create(body, userOn.id);
    } catch(error){
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({summary: "Get all user cards."})
  @ApiResponse({status: HttpStatus.OK})
  findAll(@UserOn() userOn: User) {
    return this.cardService.findAll(userOn.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({summary: "Get a specific user cards."})
  @ApiResponse({status: HttpStatus.OK})
  findOne(@Param('id') id: string, @UserOn() userOn: User) {
    return this.cardService.findOne(+id, userOn.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({summary: "Delete a specific user cards."})
  async remove(@Param('id') id: string, @UserOn() userOn: User) {
    return await this.cardService.remove(+id, userOn.id);
  }
}
