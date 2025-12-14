import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { PhotoValidator, FileHelper } from '@app/common/helpers';
import { CreateCategoryDTO, UpdateCategoryDto } from './dto';
import { Category, Language, MediaFiles, Languages } from '@app/common/database'
import { CategoryTranslate } from '@app/common/database/entities/category-translation.entity';
import { S3Service } from '@app/common/shared/s3/s3.service';


@Injectable()
export class CategoriesService {

  constructor(
    private readonly s3Service: S3Service,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(MediaFiles)
    private readonly mediaRepository: Repository<MediaFiles>,
    @InjectRepository(CategoryTranslate)
    private readonly translationRepository: Repository<CategoryTranslate>,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) { }

  async createCategory(dto: CreateCategoryDTO, file?: Express.Multer.File) {
    let parent: Category | undefined;

    if (dto.parentId) {
      const found = await this.categoryRepository.findOne({ where: { id: dto.parentId } });
      if (!found) {
        throw new NotFoundException('Parent category not found');
      }
      parent = found;
    }

    const existing = await this.translationRepository.findOne({
      where: {
        name: dto.nameEn,
        language: { name: Languages.ENGLISH },
      },
      relations: ['language'],
    });

    if (existing) {
      throw new ConflictException('Category name already exists');
    }

    const photoEntities: MediaFiles[] = [];
    if (file) {
      const type = file.originalname.split('.').pop();
      const filePath = `Samson/Categories/${type}/${uuid()}.${file.originalname}`;

      const photoEntity = this.mediaRepository.create({
        path: filePath,
        size: file.size,
      });

      await this.s3Service.putObject(file.buffer, filePath, file.mimetype);

      const savedPhoto = await this.mediaRepository.save(photoEntity);
      photoEntities.push(savedPhoto);
    }

    const category = this.categoryRepository.create({
      parent,
      mediaFiles: photoEntities,
    });
    await this.categoryRepository.save(category);

    const [langEn, langRu, langAm] = await Promise.all([
      this.languageRepository.findOne({ where: { name: Languages.ENGLISH } }),
      this.languageRepository.findOne({ where: { name: Languages.RUSSIAN } }),
      this.languageRepository.findOne({ where: { name: Languages.ARMENIAN } }),
    ]);

    if (!langEn || !langRu || !langAm) {
      throw new NotFoundException('Language records missing in DB');
    }

    const translationData = [
      { name: dto.nameEn, description: dto.descriptionEn, category, language: langEn },
      { name: dto.nameRu, description: dto.descriptionRu, category, language: langRu },
      { name: dto.nameAm, description: dto.descriptionAm, category, language: langAm },
    ];

    const translations = translationData.map(t => this.translationRepository.create(t));
    await this.translationRepository.save(translations);

    return await this.categoryRepository.findOne({
      where: { id: category.id },
      relations: ['translations', 'translations.language', 'mediaFiles', 'parent', 'children'],
    });
  }



  async updateCategory(id: number, dto: UpdateCategoryDto, file?: Express.Multer.File) {
    const category = await this.categoryRepository.findOne({ where: { id }, relations: ['translations', 'translations.language', 'mediaFiles', 'parent', 'children'] },

    );
    if (!category) {
      throw new NotFoundException('Category not found');
    }


    if (file) {
      const type = file.originalname.split('.').pop();
      const filePath = `Samson/Categories/${type}/${uuid()}.${file.originalname}`;

      const photoEntity = this.mediaRepository.create({
        path: filePath,
        size: file.size,
      });
      await this.s3Service.putObject(file.buffer, filePath, file.mimetype);
      const savedPhoto = await this.mediaRepository.save(photoEntity);
      category.mediaFiles = [savedPhoto];
    }

    for (const tr of category.translations) {
      switch (tr.language.name) {
        case Languages.ENGLISH:
          tr.name = dto.nameEn || tr.name;
          tr.description = dto.descriptionEn || tr.description;
          break;
        case Languages.RUSSIAN:
          tr.name = dto.nameRu || tr.name;
          tr.description = dto.descriptionRu || tr.description;
          break;
        case Languages.ARMENIAN:
          tr.name = dto.nameAm || tr.name;
          tr.description = dto.descriptionAm || tr.description;
          break;
      }
    }

    await this.translationRepository.save(category.translations)

    return this.categoryRepository.save(category);
  }



  findAll() {
    return this.categoryRepository.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    await this.categoryRepository.remove(category);
    return { message: 'Category removed successfully' };
  }


}