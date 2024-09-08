import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { HomeModule } from './home/home.module';
import { User } from './user/entities/user.entity';
import { Home } from './home/entities/home.entity';
import { UserHomeRelation } from './home/entities/user-home.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, Home, UserHomeRelation],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    UserModule, 
    HomeModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
