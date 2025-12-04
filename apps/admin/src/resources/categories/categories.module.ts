import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { AuthModule } from 'apps/kay-food/src/resources/auth/auth.module';
import { Category, CategoryTranslate, Language, MediaFiles, User } from '@app/common/database';
import { CategoriesController } from './categories.controller'; 
import { CategoriesService } from './categories.service';
import { S3Module } from '@app/common/shared/s3/s3.module';


@Module({
  imports: [TypeOrmModule.forFeature([Category, User, MediaFiles, CategoryTranslate, Language]),AuthModule, S3Module],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule { }
