import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../services/payment-service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './payment-success.html',
  styleUrl: './payment-success.css',
})
export class PaymentSuccess implements OnInit {
  private route = inject(ActivatedRoute);
  private paymentService = inject(PaymentService);

  loading = true;
  success = false;

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');

    if (!sessionId) {
      this.loading = false;
      this.success = false;
      return;
    }

    this.paymentService.success(sessionId).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
      },
      error: () => {
        this.success = false;
        this.loading = false;
      }
    });
  }
}
