import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { CredentialsRepository } from './credentials.repository';
import Cryptr from 'cryptr';

@Injectable()
export class CredentialsService {
  constructor( private readonly credentialsRepository: CredentialsRepository){ }

  async create(body: CreateCredentialDto, userId: number) {

    const {name, password, title, url} = body;

    const verifyTitle = await this.credentialsRepository.getByTitle(body.title, userId);
    if(verifyTitle) throw new ConflictException();

    return this.credentialsRepository.createCredentials(body, userId);
  }

  findAll(userId: number) {
    return this.credentialsRepository.findAllByUserId(userId);
  }

  async findOne(id: number, userId: number) {
    const credential = await this.credentialsRepository.findById(id);
    
    if(!credential) throw new NotFoundException("Credential not found!");
    if(credential.userId !== userId) throw new ForbiddenException("This credential belongs to another user!");

    return credential;
  }

  async remove(id: number, userId: number) {
    const credential = await this.credentialsRepository.findById(id);
    
    if(!credential) throw new NotFoundException("Credential not found!");
    if(credential.userId !== userId) throw new ForbiddenException("This credential belongs to another user!");

    return this.credentialsRepository.deleteById(id);
  }
}
