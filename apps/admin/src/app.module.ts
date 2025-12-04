import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { User, Product, Order, Category, SecretCode, MediaFiles, Ingredient, OrderItem, Zone, Admins, ProductTranslate, Language, CategoryTranslate } from '@app/common/database/entities';
import { AdminModule } from './resources/admins/admin.module';
import { IDBConfig } from '@app/common/models';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { awsConfig, dbConfig } from '@app/common/configs';
import { CategoriesModule } from './resources/categories/categories.module';
import { ProductsModule } from './resources/products/products.module';
import { OrdersModule } from './resources/orders/orders.module';
import { ZonesModule } from './resources/zones/zones.module';
import { UsersModule } from './resources/users/users.module';
import { AppController } from 'apps/kay-food/src/app.controller';
import { AppService } from 'apps/kay-food/src/app.service';
import { GlobalJwtModule } from './global-jwt.module';
import { IngredientTranslate } from '@app/common/database/entities/ingredient-translate.entity';
import { S3Module } from '@app/common/shared/s3/s3.module';

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
      envFilePath: join(__dirname, '../../../../.env'),
      load: [dbConfig, awsConfig],
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
            IngredientTranslate
          ],
          synchronize: true,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
