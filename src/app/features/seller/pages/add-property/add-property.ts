import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { PropertyService } from '../../services/property-service';
import { AddProperty as AddPropertyModel } from '../../models/add-property';

@Component({
  selector: 'app-add-property',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-property.html',
  styleUrl: './add-property.css',
})
export class AddProperty {
  private propertyService = inject(PropertyService);
  private router = inject(Router);

  previews: string[] = [];
  selectedFiles: File[] = [];
  loading = false;

  cities = ['Cairo', 'Mansoura', 'Alexandria'];

  propertyTypes = ['Apartment', 'Villa', 'Commercial'];

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(1)]],
      address: ['', Validators.required],
      listingType: ['Sale', Validators.required],
      beds: [null, [Validators.required, Validators.min(0)]],
      baths: [null, [Validators.required, Validators.min(0)]],
      sqFt: [null, [Validators.required, Validators.min(1)]],
      cityName: ['', Validators.required],
      propertyTypeName: ['', Validators.required],
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach((file) => {
      this.selectedFiles.push(file);
      this.previews.push(URL.createObjectURL(file));
    });

    input.value = '';
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const property: AddPropertyModel = {
      title: this.form.value.title,
      description: this.form.value.description,
      price: Number(this.form.value.price),
      address: this.form.value.address,
      listingType: this.form.value.listingType,
      beds: Number(this.form.value.beds),
      baths: Number(this.form.value.baths),
      sqFt: Number(this.form.value.sqFt),
      cityName: this.form.value.cityName,
      propertyTypeName: this.form.value.propertyTypeName,
      images: this.selectedFiles,
    };

    this.propertyService.addProperty(property).subscribe({
      next: (res) => {
        this.loading = false;
        this.previews.forEach((p) => URL.revokeObjectURL(p));
        this.router.navigate(['/seller/properties']);
      },

      error: (err) => {
        this.loading = false;
        const errors = err.error?.errors;
        let message = err.error?.title || 'Failed to add property';
        if (errors) {
          const details = Object.entries(errors)
            .map(([key, val]) => `${key}: ${(val as string[]).join(', ')}`)
            .join('\n');
          message += '\n' + details;
        }
        alert(message);
      },
    });
  }
}
