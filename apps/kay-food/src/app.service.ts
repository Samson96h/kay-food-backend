import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User, UserSecurity, MediaFiles, userStatus } from '@app/common/database';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(UserSecurity)
    private readonly securityRepository: Repository<UserSecurity>,

    @InjectRepository(MediaFiles)
    private readonly mediaRepository: Repository<MediaFiles>,

    private readonly jwtService: JwtService,
  ) {}

  async oauthLogin(req) {
    if (!req.user) {
      return { message: 'No user from OAuth provider' };
    }

    const { facebookId, email, firstName, lastName, picture } = req.user;

    let user: User | null = null;

    if (facebookId) {
      user = await this.userRepository.findOne({
        where: { facebookId },
        relations: ['security', 'mediaFiles'],
      });
    }

    if (!user && email) {
      user = await this.userRepository.findOne({
        where: { email },
        relations: ['security', 'mediaFiles'],
      });
    }

    if (!user) {
      user = this.userRepository.create({
        firstName,
        lastName,
        email: email || null,
        facebookId: facebookId || null,
        status: userStatus.ACTIVE,
      });

      await this.userRepository.save(user);

      const security = this.securityRepository.create({ user });
      await this.securityRepository.save(security);
      user.security = security;

      if (picture) {
        const media = this.mediaRepository.create({
          path: picture,
          size: 0,
          meta: { provider: 'oauth' },
        });

        await this.mediaRepository.save(media);

        user.mediaFiles = [media];
        await this.userRepository.save(user);
      }
    }

    const payload = {
      sub: user.id,
      email,
      firstName,
      lastName,
    };

    const jwt = this.jwtService.sign(payload, { expiresIn: '1d' });

    return {
      message: 'User logged in via OAuth provider',
      user,
      jwt,
    };
  }
}
