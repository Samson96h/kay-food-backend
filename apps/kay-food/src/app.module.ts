import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module  } from '@nestjs/common';
import { join } from 'path';

import { User, Product, Order, Category, SecretCode, MediaFiles, Ingredient, OrderItem, Zone, Admins, Language, ProductTranslate, CategoryTranslate, IngredientTranslate, UserSecurity } from '@app/common/database';
import { jwtConfig, dbConfig, awsConfig, googleClientConfig } from '../../../libs/common/src/configs';
import { faceboockClientConfig } from '@app/common/configs/faceboock-client.config';
import { CategoriesModule } from './resources/categories/categories.module';
import { validationSchema } from '../../../libs/common/src/validation';
import { ProductsModule } from './resources/products/products.module';
import { OrdersModule } from './resources/orders/orders.module';
import { UsersModule } from './resources/users/users.module';
import { ZonesModule } from './resources/zones/zones.module';
import { IDBConfig } from '../../../libs/common/src/models';
import { S3Module } from '@app/common/shared/s3/s3.module';
import { AuthModule } from './resources/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LanguageInterceptor } from '@app/common/interceptors/language.interceptor';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads/'),
      serveRoot: '/public/',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: validationSchema,
      load: [jwtConfig, dbConfig, awsConfig, googleClientConfig, faceboockClientConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService : ConfigService) => {
        const dbConfig: IDBConfig = configService.get("DB_CONFIG") as IDBConfig;
        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          entities: [User, Admins, Product, Order, Category, SecretCode, MediaFiles, Ingredient, OrderItem, Zone, Language, ProductTranslate, CategoryTranslate, IngredientTranslate, UserSecurity],
          synchronize: true,
        }
      }
    }),
    TypeOrmModule.forFeature([User, Product, Order, Category, SecretCode, MediaFiles, Ingredient, OrderItem, Order, Zone, Language, ProductTranslate, CategoryTranslate, IngredientTranslate, UserSecurity]),
    AuthModule,
    OrdersModule,
    ProductsModule,
    CategoriesModule,
    UsersModule,
    ZonesModule,
    S3Module
  ],
  controllers: [AppController],
  providers: [AppService, LanguageInterceptor],
})
export class AppModule  {
  }