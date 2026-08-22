import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PropertyDetailsService } from '../../services/property-details-service';
import { PaymentService } from '../../services/payment-service';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './property-details.html',
  styleUrl: './property-details.css',
})
export class PropertyDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  propertyService = inject(PropertyDetailsService);
  private paymentService = inject(PaymentService);

  isProcessingPayment = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.propertyService.loadPropertyById(id);
    }
  }

  sendMessage(ownerId?: string) {
    if (ownerId) {
      this.router.navigate(['/message', ownerId]);
    } else {
      this.router.navigate(['/message']);
    }
  }

  reserveProperty(propertyId: number): void {
    if (this.isProcessingPayment) return;
    this.isProcessingPayment = true;

    this.paymentService.checkout(propertyId).subscribe({
      next: (response) => {
        window.location.href = response.checkoutUrl;
      },
      error: () => {
        this.isProcessingPayment = false;
        alert('Unable to create payment session');
      },
    });
  }
}
