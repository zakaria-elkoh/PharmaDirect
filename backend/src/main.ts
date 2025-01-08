import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseSeeder } from './database.seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Seed the database
  const seeder = app.get(DatabaseSeeder);
  await seeder.seed();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
