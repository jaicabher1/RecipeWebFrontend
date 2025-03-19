import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../../services/publication/publication.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-publications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-publications.component.html',
  styleUrl: './my-publications.component.css'
})
export class MyPublicationsComponent implements OnInit {

  publications: any[] = [];
  selectedPublication: any = null;

  creatingPublication = false;
  newPublication: any = {};

  // Opciones válidas para enums
  categoryOptions: string[] = ['Desayuno', 'Almuerzo', 'Cena', 'Postre', 'Snack', 'Vegano', 'Vegetariano', 'Sin Gluten', 'Sin Lactosa'];
  tagOptions: string[] = ['Rápido','Vegetariano','Dulce', 'Fácil', 'Saludable', 'Económico', 'Internacional', 'Gourmet', 'Tradicional', 'Fiesta', 'Navidad', 'Halloween', 'San Valentín', 'Verano', 'Invierno', 'Otoño', 'Primavera','Internacional','Sin Gluten','Sin Lactosa','Vegano','Vegetariano'];

  constructor(private publicationService: PublicationService, private router: Router) { }

  ngOnInit(): void {
    this.loadMyPublications();
  }

  loadMyPublications(): void {
    this.publicationService.getMyPublications().subscribe({
      next: (response: any) => {
        this.publications = response.publications;
      },
      error: (error: any) => {
        console.error('Error in request:', error);
      }
    });
  }

  openDetail(publication: any): void {
    this.selectedPublication = publication;
  }

  closeDetail(): void {
    this.selectedPublication = null;
  }

  editPublication(publication: any): void {
    this.router.navigate(['/edit-publication', publication._id]);
  }

  deletePublication(idPublication: string): void {
    if (confirm('¿Estás seguro de eliminar esta publicación?')) {
      this.publicationService.deletePublication(idPublication).subscribe({
        next: () => {
          alert('Publicación eliminada correctamente.');
          this.closeDetail();
          this.loadMyPublications();
        },
        error: () => alert('Error al eliminar la publicación.')
      });
    }
  }

  openNewPublication(): void {
    this.creatingPublication = true;
    this.newPublication = {
      title: '',
      category: '',
      image: '',
      tags: [],
      ingredients: '',
      description: '',
      steps: '',
      difficulty: 'Fácil',
      prepTime: 0
    };
  }

  closeNewPublication(): void {
    this.creatingPublication = false;
  }

  onTagToggle(tag: string, isChecked: boolean): void {
    if (isChecked) {
      if (!this.newPublication.tags.includes(tag)) {
        this.newPublication.tags.push(tag);
      }
    } else {
      this.newPublication.tags = this.newPublication.tags.filter((t: string) => t !== tag);
    }
  }

  savePublication(): void {
    // Validaciones previas
    if (!this.newPublication.title || !this.newPublication.category || !this.newPublication.description ||
      !this.newPublication.ingredients || !this.newPublication.steps ||
      !this.newPublication.difficulty || !this.newPublication.prepTime) {
      alert('❌ Faltan campos obligatorios');
      return;
    }

    if (!this.categoryOptions.includes(this.newPublication.category)) {
      alert('❌ Categoría no válida');
      return;
    }

    const invalidTags = this.newPublication.tags.filter((tag: string) => !this.tagOptions.includes(tag));
    if (invalidTags.length > 0) {
      alert('❌ Hay tags no válidos: ' + invalidTags.join(', '));
      return;
    }

    // 👉 Convertir tags a string antes de enviar al backend
    const publicationToSend = {
      ...this.newPublication,
      tags: this.newPublication.tags.join(',')
    };

    this.publicationService.savePublication(publicationToSend).subscribe({
      next: () => {
        alert('Publicación guardada correctamente.');
        this.closeNewPublication();
        this.loadMyPublications();
      },
      error: () => alert('Error al guardar la publicación.')
    });
  }
}