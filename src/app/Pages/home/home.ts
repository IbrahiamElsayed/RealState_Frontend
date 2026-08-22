import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PropertyHomeService } from '../../services/property-home';
import { Hero } from '../hero/hero';
import { FavoriteService } from '../../services/favorite-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Hero, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  propertyService = inject(PropertyHomeService);
  favoriteService = inject(FavoriteService);

  apiUrl = 'https://localhost:7024';

  ngOnInit(): void {
    this.propertyService.loadHomeProperties();
  }

  toggleFavorite(property: any) {
    property.isFavorite = !property.isFavorite;

    if (property.isFavorite) {
      this.favoriteService.add(property.id).subscribe({
        error: () => (property.isFavorite = false),
      });
    } else {
      this.favoriteService.remove(property.id).subscribe({
        error: () => (property.isFavorite = true),
      });
    }
  }

  getImage(path: string): string {
    return `${this.apiUrl}${path}`;
  }
}
