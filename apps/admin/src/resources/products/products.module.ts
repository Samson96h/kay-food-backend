import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { Product, Ingredient, Category, MediaFiles, ProductTranslate, Language } from '../../../../../libs/common/src/database/entities';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { AuthModule } from 'apps/kay-food/src/resources/auth/auth.module';
import { IngredientTranslate } from '@app/common/database/entities/ingredient-translate.entity';
import { S3Module } from '@app/common/shared/s3/s3.module';


@Module({
  imports: [TypeOrmModule.forFeature([Product, MediaFiles, Category, Ingredient, ProductTranslate, Language, IngredientTranslate]),
    AuthModule,S3Module],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }
