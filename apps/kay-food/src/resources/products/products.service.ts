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


  async findAll() {
    return this.productRepository.find()
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({ where: { id } })
    if (!product) {
      throw new NotFoundException('product not found')
    }
    return product
  }

  
  async getAllIngredient() {
    return this.ingredientRepository.find({relations:["translations"]})
  }

}