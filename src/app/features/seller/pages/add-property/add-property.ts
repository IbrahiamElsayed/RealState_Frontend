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

  private static readonly MAX_IMAGES = 10;
  private static readonly MAX_FILE_SIZE_MB = 5;
  private static readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  previews: string[] = [];
  selectedFiles: File[] = [];
  uploadErrors: string[] = [];
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

    this.uploadErrors = [];

    for (const file of Array.from(input.files)) {
      if (!AddProperty.ALLOWED_TYPES.includes(file.type)) {
        this.uploadErrors.push(`"${file.name}" is not a supported image (JPG, PNG, GIF, WEBP).`);
        continue;
      }

      if (file.size > AddProperty.MAX_FILE_SIZE_MB * 1024 * 1024) {
        this.uploadErrors.push(`"${file.name}" exceeds the ${AddProperty.MAX_FILE_SIZE_MB}MB size limit.`);
        continue;
      }

      if (this.selectedFiles.length >= AddProperty.MAX_IMAGES) {
        this.uploadErrors.push(`You can upload up to ${AddProperty.MAX_IMAGES} images.`);
        break;
      }

      this.selectedFiles.push(file);
      this.previews.push(URL.createObjectURL(file));
    }

    input.value = '';
  }

  removeImage(index: number) {
    if (index < 0 || index >= this.selectedFiles.length) return;

    URL.revokeObjectURL(this.previews[index]);
    this.selectedFiles.splice(index, 1);
    this.previews.splice(index, 1);
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
        this.previews = [];
        this.selectedFiles = [];
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
