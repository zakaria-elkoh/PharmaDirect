import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PharmacyModule } from './pharmacy/pharmacy.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/pharmadirect'),
    PharmacyModule,
  ],
})
export class AppModule {}
