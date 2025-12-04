import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { Category, MediaFiles, Product, User } from '../../../../../libs/common/src/database/entities';
import { S3Module } from '@app/common/shared/s3/s3.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';


@Module({
  imports: [TypeOrmModule.forFeature([Category, User, MediaFiles, Product]),
  S3Module],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }
