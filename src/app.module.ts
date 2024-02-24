import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './module/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING), UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
