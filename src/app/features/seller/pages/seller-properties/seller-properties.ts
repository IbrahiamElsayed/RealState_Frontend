import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PropertiesService } from '../../services/properties-service';

@Component({
  selector: 'app-seller-properties',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './seller-properties.html',
  styleUrl: './seller-properties.css',
})
export class SellerProperties implements OnInit {
  propertyService = inject(PropertiesService);
  router = inject(Router);

  ngOnInit(): void {
    this.propertyService.getMyProperties();
  }

  editProperty(id: number) {
    this.router.navigate(['/seller/update-property', id]);
  }

  deleteProperty(id: number) {
    const confirmed = confirm('Are you sure you want to delete this property?');
    if (!confirmed) return;

    this.propertyService.deleteProperty(id).subscribe({
      next: () => {
        this.propertyService.properties.update((list) => list.filter((p) => p.id !== id));
      },
      error: () => alert('Delete failed'),
    });
  }
}
