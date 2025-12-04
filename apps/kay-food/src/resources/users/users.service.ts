import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User, MediaFiles, Product } from '@app/common/database';
import { UpdateUserDTO } from './dto/update-user.dto';
import { v4 as uuid } from 'uuid';
import { S3Service } from '@app/common/shared/s3/s3.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly s3Service: S3Service,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(MediaFiles)
    private readonly mediaRepository: Repository<MediaFiles>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  async updateUsersData(id: number, dto: UpdateUserDTO, files?: Express.Multer.File[]) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['mediaFiles'],
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    user.firstName = dto.firstName ?? user.firstName;
    user.lastName = dto.lastName ?? user.lastName;
    user.age = dto.age ?? user.age;

    const newMedia: MediaFiles[] = [];

    if (files?.length) {
      for (const file of files) {
        const ext = file.originalname.split('.').pop();
        const filePath = `Samson/Users/${ext}/${uuid()}.${ext}`;

        await this.s3Service.putObject(file.buffer, filePath, file.mimetype);

        const media = this.mediaRepository.create({
          path: filePath,
          size: file.size,
        });

        newMedia.push(media);
      }

      user.mediaFiles.push(...newMedia);
    }

    await this.mediaRepository.save(newMedia);

    return this.userRepository.save(user);
  }



  async addFavorite(userId: number, productId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });
    if (!user) throw new NotFoundException('User not found');

    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    if (user.favorites.find((e) => e.id === product.id)) {
      return user;
    }
    user.favorites.push(product);
    return await this.userRepository.save(user);

  }

  async getFavorites(userId: number): Promise<Product[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });

    if (user && user.favorites) {
      return user.favorites;
    } else {
      return [];
    }

  }

  async removeFavorite(userId: number, productId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });
    if (!user) {
      throw new NotFoundException('User not found')
    };

    user.favorites = user.favorites.filter((e) => e.id !== productId);

    return await this.userRepository.save(user);
  }

}
