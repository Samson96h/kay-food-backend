import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Ingredient, Product } from '@app/common/database';


@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>
  ) { }


  async findAll(lang: string) {
    const products = await this.productRepository.find({
      relations: ['translations',
        'translations.language',
        'mediaFiles',
        'categoryId',],
    });

    return products.map(p => ({
      ...p,
      translations: p.translations.find(t => t.language.name === lang),
    }));
  }


  async findOne(id: number, lang: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['translations',
        'translations.language',
        'mediaFiles',
        'categoryId',],
    });

    if (!product) throw new NotFoundException('product not found');

    return {
      ...product,
      translations: product.translations.find(t => t.language.name === lang),
    };

  }



  async getAllIngredient(lang: string) {
    const ingredients = await this.ingredientRepository.find({
      relations: ['translations',
        'translations.language']
    })
    return ingredients.map(i => ({
      ...i,
      translations: i.translations.find(t => t.language.name === lang)
    }))
  }

}