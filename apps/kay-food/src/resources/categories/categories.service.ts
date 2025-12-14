import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Category } from '@app/common/database';


@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }


  async findAll(lang: string) {
    const categories = await this.categoryRepository.find({
      relations: ['translations',
        'translations.language',
        'mediaFiles', 'children'],
    });

    return categories.map(c => ({
      ...c,
      translations: c.translations.find(t => t.language.name === lang),
    }));

  }


  async findOne(id: number, lang: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['translations',
        'translations.language',
        'mediaFiles', 'children'],
    });

    if (!category) {
      throw new NotFoundException('category not found');
    }

    const translation = category.translations.find(t => t.language.name === lang);

    return {
      ...category,
      translations: translation,
    };
  }


}