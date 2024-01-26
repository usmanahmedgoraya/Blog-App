import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogController } from './blog/blog.controller';
import { BlogModule } from './blog/blog.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true
  }), MongooseModule.forRoot(process.env.MONGO_URI), BlogModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
