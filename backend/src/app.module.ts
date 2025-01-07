import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SchemasModule } from './schemas/schemas.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [SchemasModule, MongooseModule.forRoot('mongodb://localhost:27017/pharmadirect')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
