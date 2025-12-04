import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { User, MediaFiles } from '@app/common/database/entities';
import { S3Service } from '@app/common/shared/s3/s3.service';
import { UpdateUserDTO } from './dto/update-user.dto';


@Injectable()
export class UsersService {
  constructor(
    private readonly s3Service: S3Service,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(MediaFiles)
    private readonly mediaRepository: Repository<MediaFiles>,

  ) { }


  async updateUsersData(id: number, dto: UpdateUserDTO, files?: Express.Multer.File[]) {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['mediaFiles'], });

    if (!user) {
      throw new NotFoundException('user not found')
    };

    user.firstName = dto.firstName ?? user.firstName;
    user.lastName = dto.lastName ?? user.lastName;
    user.age = dto.age ?? user.age;

    if (files) {
      for (let file of files) {
        const type = file.originalname.split(".").pop()
        const filePath = `Samson/Products/${type}/${uuid()}.${file.originalname}`;

        const photoEntity = this.mediaRepository.create({
          path: filePath,
          size: file.size,
        });

        await this.s3Service.putObject(file.buffer, filePath, file.mimetype);
          const savedPhoto = await this.mediaRepository.save(photoEntity);
          user.mediaFiles.push(savedPhoto);
      }
    }

    return this.userRepository.save(user)
  }

  async findAll() {
    return await this.userRepository.find()
  }

  async removeUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) {
      throw new NotFoundException('user not found')
    }
    await this.userRepository.remove(user)
    return { message: "user Deleted" }
  }

}
