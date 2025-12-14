import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { ProductsService } from './products.service';
import { AuthGuard, GetLang } from '@app/common'
import { IdDTO } from '@app/common';


@UseGuards(AuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get('ingredient')
  async getAllIngredients(@GetLang() lang: string) {
    return this.productsService.getAllIngredient(lang)
  }

  @Get()
  async findAll(@GetLang() lang: string) {
    return this.productsService.findAll(lang);
  }

  @Get(':id')
  async findOne(@Param() param: IdDTO, @GetLang() lang: string) {
    return this.productsService.findOne(param.id, lang);
  }

}
