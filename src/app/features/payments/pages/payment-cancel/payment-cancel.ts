import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-cancel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './payment-cancel.html',
  styleUrl: './payment-cancel.css',
})
export class PaymentCancel {}
