import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admins } from '@app/common/database/entities';
import { CreateAdminDTO } from './dto/create-admin.dto';
import { IAuthEnticationResponse } from './models/authentication-response';
import { AdminLoginDTO } from './dto/admin-login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admins)
    private readonly adminRepo: Repository<Admins>,

    private readonly jwtService: JwtService,

    private readonly configService: ConfigService,
  ) {}

  async addAdmin(createAdmin: CreateAdminDTO): Promise<Admins> {
    const existing = await this.adminRepo.findOne({
      where: { name: createAdmin.adminName }
    });

    if (existing) {
      throw new BadRequestException('Admin with this name already exists');
    }

    const admin = this.adminRepo.create({
      name: createAdmin.adminName,
      email: createAdmin.email,
      password: await bcrypt.hash(createAdmin.password, 12),
    });

    return this.adminRepo.save(admin);
  }

  async adminLogin(login: AdminLoginDTO): Promise<IAuthEnticationResponse> {
    const admin = await this.adminRepo.findOne({
      where: { name: login.name }
    });

    if (!admin) {
      throw new BadRequestException('Invalid admin credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      login.password,
      admin.password
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid admin credentials');
    }

    const secret = this.configService.get<string>('JWT_ADMIN_SECRET');

    const accessToken = this.jwtService.sign(
      { sub: admin.id, name: admin.name },
      {
        secret,
        expiresIn: '1d',
      },
    );

    return {
      accessToken,
      message: 'Authentication successful',
    };
  }

  findAll() {
    return this.adminRepo.find();
  }
}
