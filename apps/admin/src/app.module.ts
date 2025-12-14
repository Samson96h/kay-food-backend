import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { User, Product, Order, Category, SecretCode, MediaFiles, Ingredient, OrderItem, Zone, Admins, ProductTranslate, Language, CategoryTranslate, UserSecurity } from '@app/common/database/entities';
import { AdminModule } from './resources/admins/admin.module';
import { IDBConfig } from '@app/common/models';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { awsConfig, dbConfig, googleClientConfig, jwtConfig } from '@app/common/configs';
import { CategoriesModule } from './resources/categories/categories.module';
import { ProductsModule } from './resources/products/products.module';
import { OrdersModule } from './resources/orders/orders.module';
import { ZonesModule } from './resources/zones/zones.module';
import { UsersModule } from './resources/users/users.module';
import { GlobalJwtModule } from './global-jwt.module';
import { IngredientTranslate } from '@app/common/database/entities/ingredient-translate.entity';
import { S3Module } from '@app/common/shared/s3/s3.module';
import { validationSchema } from '@app/common';
import { AppService } from './app.service';
import { faceboockClientConfig } from '@app/common/configs/faceboock-client.config';
import { AppController } from './app.controller';
import { LanguageInterceptor } from '@app/common/interceptors/language.interceptor';

@Module({
  imports: [
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    ZonesModule,
    UsersModule,
    AdminModule,
    GlobalJwtModule,
    S3Module,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads/'),
      serveRoot: '/public/',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationSchema,
      envFilePath: join(__dirname, '../../../../.env'),
      load: [dbConfig, awsConfig, jwtConfig, googleClientConfig, faceboockClientConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const db: IDBConfig | undefined = configService.get<IDBConfig>('DB_CONFIG');
        if (!db) {
          throw new Error('DB_CONFIG not found. Check your .env and dbConfig registration.');
        }
        return {
          type: 'postgres',
          host: db.host,
          port: db.port,
          username: db.username,
          password: db.password,
          database: db.database,
          entities: [
            User,
            Admins,
            Product,
            Order,
            Category,
            SecretCode,
            MediaFiles,
            Ingredient,
            OrderItem,
            Zone,
            ProductTranslate,
            Language,
            CategoryTranslate,
            IngredientTranslate,
            UserSecurity
          ],
          synchronize: true,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
