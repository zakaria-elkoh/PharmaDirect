import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PharmacyService } from './pharmacy.service';
import { PharmacyController } from './pharmacy.controller';
import { Pharmacy, PharmacySchema } from './schema/pharmacy.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pharmacy.name, schema: PharmacySchema },
    ]),
  ],
  providers: [PharmacyService],
  controllers: [PharmacyController],
})
export class PharmacyModule {}
