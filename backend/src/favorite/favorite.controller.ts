import { Controller, Post, Delete, Get, Param, Body } from '@nestjs/common';
import { FavoriteService } from './favorite.service';

@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}


  @Post(':userId')
  async addFavorite(
    @Param('userId') userId: string,
    @Body('pharmacyId') pharmacyId: string,
  ) {
    return this.favoriteService.addFavorite(userId, pharmacyId);
  }


  @Delete(':userId/:pharmacyId')
  async removeFavorite(
    @Param('userId') userId: string,
    @Param('pharmacyId') pharmacyId: string,
  ) {
    return this.favoriteService.removeFavorite(userId, pharmacyId);
  }


  @Get(':userId')
  async getUserFavorites(@Param('userId') userId: string) {
    return this.favoriteService.getUserFavorites(userId);
  }
}
