import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateProductDto, CreateProductDto, CreateIngredientDTO } from './dto';
import { Product, Ingredient, Category, MediaFiles } from '@app/common/database';
import { FileHelper, PhotoValidator } from '@app/common/helpers';
import { ProductTranslate } from '@app/common/database/entities/product-translation.entity';
import { Languages } from '@app/common/database/enums/languages-enum';
import { Language } from '@app/common/database/entities/languages-entity';
import { IngredientTranslate } from '@app/common/database/entities/ingredient-translate.entity';
import { v4 as uuid } from 'uuid';
import { S3Service } from '@app/common/shared/s3/s3.service';


@Injectable()
export class ProductsService {

  constructor(
    private readonly s3Service: S3Service,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(MediaFiles)
    private readonly mediaRepository: Repository<MediaFiles>,
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
    @InjectRepository(IngredientTranslate)
    private readonly IngredientTranslationRepository: Repository<IngredientTranslate>,
    @InjectRepository(ProductTranslate)
    private readonly ProductTranslationRepository: Repository<ProductTranslate>,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) { }

  async create(dto: CreateProductDto, files?: Express.Multer.File[]) {
    const existEnName = await this.ProductTranslationRepository.findOne({
      where: {
        name: dto.productNameEn,
        language: { name: Languages.ENGLISH },
      },
      relations: ['language'],
    });

    if (existEnName) {
      throw new ConflictException('Product name already exists');
    }

    const category = await this.categoryRepository.findOne({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const photoEntities: MediaFiles[] = [];
    if (files?.length) {
      for (const file of files) {
        const type = file.originalname.split('.').pop();
        const filePath = `Samson/Products/${type}/${uuid()}.${file.originalname}`;

        const photoEntity = this.mediaRepository.create({
          path: filePath,
          size: file.size,
        });

        await this.s3Service.putObject(file.buffer, filePath, file.mimetype);
        photoEntities.push(photoEntity);
      }
    }

      const product = this.productRepository.create({
        weight: dto.weight,
        price: dto.price,
        categoryId: category,
        mediaFiles: photoEntities,
      });

      await this.productRepository.save(product);

      const [langEn, langRu, langAm] = await Promise.all([
        this.languageRepository.findOne({ where: { name: Languages.ENGLISH } }),
        this.languageRepository.findOne({ where: { name: Languages.RUSSIAN } }),
        this.languageRepository.findOne({ where: { name: Languages.ARMENIAN } }),
      ]);

      if (!langEn || !langRu || !langAm) {
        throw new NotFoundException('Language records missing in DB');
      }

      const translationData = [
        { name: dto.productNameEn, description: dto.descriptionEn, product, language: langEn },
        { name: dto.productNameRu, description: dto.descriptionRu, product, language: langRu },
        { name: dto.productNameAm, description: dto.descriptionAm, product, language: langAm },
      ];

      const translations = translationData.map(t => this.ProductTranslationRepository.create(t));
      await this.ProductTranslationRepository.save(translations);

      return await this.productRepository.findOne({
        where: { id: product.id },
        relations: ['translations', 'translations.language', 'mediaFiles', 'categoryId'],
      });
    }

  async updateProductData(id: number, updateDto: UpdateProductDto, files ?: Express.Multer.File[]) {
      const product = await this.productRepository.findOne({
        where: { id },
        relations: ['mediaFiles'],
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const translations = await this.ProductTranslationRepository.find({
        where: { product: { id } },
        relations: ['language'],
      });

      for (const tr of translations) {
        switch (tr.language.name) {
          case Languages.ENGLISH:
            tr.name = updateDto.productNameEn || tr.name;
            tr.description = updateDto.descriptionEn || tr.description;
            break;
          case Languages.RUSSIAN:
            tr.name = updateDto.productNameRu || tr.name;
            tr.description = updateDto.descriptionRu || tr.description;
            break;
          case Languages.ARMENIAN:
            tr.name = updateDto.productNameAm || tr.name;
            tr.description = updateDto.descriptionAm || tr.description;
            break;
        }
      }

      await this.ProductTranslationRepository.save(translations);

      product.weight = updateDto.weight ?? product.weight;
      product.price = updateDto.price ?? product.price;

      if (updateDto.categoryId) {
        const newCategory = await this.categoryRepository.findOne({
          where: { id: updateDto.categoryId },
        });
        if (!newCategory) {
          throw new NotFoundException('Category not found');
        }
        product.categoryId = newCategory;
      }

      if (files?.length) {
        for (const file of files) {
        const type = file.originalname.split('.').pop();
        const filePath = `Samson/Products/${type}/${uuid()}.${file.originalname}`;

        const photoEntity = this.mediaRepository.create({
          path: filePath,
          size: file.size,
        });

          await this.s3Service.putObject(file.buffer, filePath, file.mimetype);
          const savedPhoto = await this.mediaRepository.save(photoEntity);
          product.mediaFiles.push(savedPhoto);
        }
        
      }

      await this.productRepository.save(product);
      return await this.productRepository.findOne({
        where: { id: product.id },
        relations: ['translations', 'translations.language', 'mediaFiles', 'categoryId'],
      });
    }

  async findAll() {
      return this.productRepository.find({
        relations: ['translations', 'translations.language', 'mediaFiles', 'categoryId'],
      });
    }

  async findOne(id: number) {
      const product = await this.productRepository.findOne({
        where: { id },
        relations: ['translations', 'translations.language', 'mediaFiles', 'categoryId'],
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      return product;
    }

  async removeProduct(id: number) {
      const result = await this.productRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Not found this product');
      }
      return { message: 'Product successfully deleted' };
    }

async addIngredient(dto: CreateIngredientDTO) {
      const existing = await this.IngredientTranslationRepository.findOne({
        where: {
          name: dto.nameEn,
          language: { name: Languages.ENGLISH },
        },
        relations: ['language'],
      });

      if (existing) {
        throw new ConflictException('This ingredient name already exists');
      }

      const ingredient = this.ingredientRepository.create({
        price: dto.price,
        translations: [],
      });

      const enTranslate = this.IngredientTranslationRepository.create({
        name: dto.nameEn,
        language: { name: Languages.ENGLISH },
        ingredient: ingredient,
      });

      const ruTranslate = this.IngredientTranslationRepository.create({
        name: dto.nameRu,
        language: { name: Languages.RUSSIAN },
        ingredient: ingredient,
      });

      ingredient.translations = [enTranslate, ruTranslate];
      return await this.ingredientRepository.save(ingredient);
    }


  async removeIngedient(id: number) {
      const existing = await this.ingredientRepository.findOne({
        where: { id }
      })
      if (!existing) throw new NotFoundException('ingredient not found')

      await this.ingredientRepository.delete(existing)

      return { message: 'Product successfully deleted' };
    }

  async getAllIngredient() {
      return this.ingredientRepository.find({ relations: ["translations"] })
    }
  }
