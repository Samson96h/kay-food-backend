import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Language, Languages } from '../database';
import { Repository } from 'typeorm';


@Injectable()
export class LanguageInterceptor implements NestInterceptor {
  private readonly defaultLang = Languages.ENGLISH;

  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();

    let lang =
      request.headers['x-lang'] ||
      request.headers['accept-language'] ||
      this.defaultLang;

    lang = String(lang).toUpperCase();

    const found = await this.languageRepository.findOne({
      where: { name: lang as Languages },
    });

    request.lang = found ? found.name : this.defaultLang;

    return next.handle();
  }
}