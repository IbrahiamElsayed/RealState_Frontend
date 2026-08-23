import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '../../services/favorite-service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorite.html',
  styleUrl: './favorite.css',
})
export class Favorite implements OnInit {
  favoriteService = inject(FavoriteService);

  favorites: any[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.isLoading = true;
    this.favoriteService.getByUser().subscribe({
      next: (res: any) => {
        this.favorites = res ?? [];
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  remove(propertyId: number) {
    this.favoriteService.remove(propertyId).subscribe({
      next: () => {
        this.favorites = this.favorites.filter((x: any) => x.propertyId !== propertyId);
      },
    });
  }
}
