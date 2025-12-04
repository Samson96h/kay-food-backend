import { Body, Controller, Post, UseGuards} from '@nestjs/common';

import { CreateAuthDTO } from './dto/create-auth.dto';
import { CodeDTO } from './dto/check-code.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '../../../../../libs/common/src/guards';
import { AuthUser } from '@app/common';
import { IRequestUser } from '../users/models/request-user';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login (@Body() dto: CreateAuthDTO) {
    return this.authService.loginOrRegister(dto)
  }

  @UseGuards(AuthGuard)
  @Post('login')
  async confirm(@AuthUser() user: IRequestUser ,@Body() dto: CodeDTO) {
    return this.authService.authentication(user.id,dto);
  }
  
}
