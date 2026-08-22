import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UpdatePropertyService } from '../../services/update-property';

@Component({
  selector: 'app-update-property',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './update-property.html',
  styleUrl: './update-property.css',
})
export class UpdateProperty implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(UpdatePropertyService);

  get loading() {
    return this.service.loading();
  }
  submitting = false;

  cities = ['Cairo', 'Alexandria', 'Mansoura'];
  propertyTypes = ['Apartment', 'Villa', 'Commercial'];

  form = this.fb.group({
    id: [0],
    title: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, Validators.required],
    address: ['', Validators.required],
    listingType: ['Sale', Validators.required],
    beds: [0, Validators.required],
    baths: [0, Validators.required],
    sqFt: [0, Validators.required],
    isAvailable: [true],
    cityName: ['', Validators.required],
    propertyTypeName: ['', Validators.required],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/seller/properties']);
      return;
    }

    this.loadProperty(id);
  }

  loadProperty(id: string) {
    this.service.getPropertyById(id).subscribe({
      next: (res: any) => {
        if (res) {
          this.form.patchValue({
            id: res.id,
            title: res.title,
            description: res.description,
            price: res.price,
            address: res.address,
            listingType: res.listingType,
            beds: res.beds,
            baths: res.baths,
            sqFt: res.sqFt,
            isAvailable: res.isAvailable,
            cityName: res.cityName,
            propertyTypeName: res.propertyTypeName,
          });
        }
      },
      error: () => this.router.navigate(['/seller/properties']),
    });
  }

  save() {
    if (this.form.invalid) return;

    this.submitting = true;

    this.service.updateProperty(this.form.value as any).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/seller/properties']);
      },
      error: (err) => {
        this.submitting = false;
        alert(err.error?.message || 'Update failed');
      },
    });
  }
}
