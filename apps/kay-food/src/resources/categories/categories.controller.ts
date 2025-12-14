import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { AuthGuard, GetLang } from '@app/common';
import { CategoriesService } from './categories.service';
import { IdDTO } from '@app/common';


@UseGuards(AuthGuard)
@Controller('category')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Get()
  findAll(@GetLang() lang: string) {
    return this.categoriesService.findAll(lang);
  }

  @Get(':id')
  findOne(@Param() param: IdDTO, @GetLang() lang: string) {
    return this.categoriesService.findOne(param.id, lang);
  }



}
