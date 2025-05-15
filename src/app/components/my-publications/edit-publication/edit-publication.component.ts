import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicationService } from '../../../services/publication/publication.service';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-publication',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-publication.component.html',
  styleUrl: './edit-publication.component.css'
})
export class EditPublicationComponent implements OnInit {
  publication: any = {};
  selectedFile!: File;

  categoryOptions: string[] = [
    'Desayuno', 'Almuerzo', 'Cena', 'Postre', 'Snack',
    'Vegano', 'Vegetariano', 'Sin Gluten', 'Sin Lactosa'
  ];

  tagOptions: string[] = [
    'Rápido', 'Vegetariano', 'Dulce', 'Fácil', 'Saludable', 'Económico',
    'Internacional', 'Gourmet', 'Tradicional', 'Fiesta', 'Navidad',
    'Halloween', 'San Valentín', 'Verano', 'Invierno', 'Otoño',
    'Primavera', 'Sin Gluten', 'Sin Lactosa', 'Vegano'
  ];

  constructor(
    private route: ActivatedRoute,
    private publicationService: PublicationService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.publicationService.getPublicationById(id).subscribe(response => {
        this.publication = response.publication;
        if (!Array.isArray(this.publication.tags)) {
          this.publication.tags = [];
        }
      });
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onUploadImage(): void {
    if (!this.selectedFile || !this.publication._id) {
      alert('Falta seleccionar archivo o cargar la publicación.');
      return;
    }
    this.publicationService.uploadImagePublication(this.publication._id, this.selectedFile).subscribe({
      next: (res: any) => {
        alert('Imagen subida correctamente');
        this.publication.image = res.image;
      },
      error: err => {
        console.error('Error al subir imagen', err);
        alert('Error al subir imagen');
      }
    });
  }

  onTagToggle(tag: string, isChecked: boolean): void {
    if (isChecked) {
      if (!this.publication.tags.includes(tag)) {
        this.publication.tags.push(tag);
      }
    } else {
      this.publication.tags = this.publication.tags.filter((t: string) => t !== tag);
    }
  }

  onSubmit(): void {
    this.publicationService.updatePublication(this.publication).subscribe({
      next: () => this.router.navigate(['/my-publications']),
      error: err => console.error('Error:', err)
    });
  }

  cancelEdit(): void {
    this.router.navigate(['/my-publications']);
  }
}
