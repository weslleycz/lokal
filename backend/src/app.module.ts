import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppDataSource } from './database/data-source';
import { AuthModule } from './modules/auth/auth.module';
import { PlantModule } from './modules/plant/plant.module';
import { UserModule } from './modules/user/user.module';
import { RedisModule } from './common/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(AppDataSource.options as any),
    RedisModule,
    UserModule,
    AuthModule,
    PlantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
