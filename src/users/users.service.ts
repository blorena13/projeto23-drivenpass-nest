import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) { }

  async createUser(body: CreateUserDto) {
    if (!body.email || !body.password) throw new BadRequestException();
    const { email } = body;
    const existsEmail = await this.usersRepository.getUserByEmail(email);
    if (existsEmail) throw new ConflictException("Email already in use");

    return await this.usersRepository.createUser(body);

  }

  async getUserById(id: number) {
    const user = await this.usersRepository.getById(id);
    if (!user) throw new NotFoundException("User not found!");

    return user;
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.getUserByEmail(email);
  }

  remove(id: number) {
    return this.usersRepository.deleteById(id);
  }
}
