import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../../services/publication/publication.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { Observable } from 'rxjs';

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
  creatorPublications: boolean = false;

  creatingPublication = false;
  newPublication: any = {};

  selectedFile!: File;

  categoryOptions: string[] = ['Desayuno', 'Almuerzo', 'Cena', 'Postre', 'Snack', 'Vegano', 'Vegetariano', 'Sin Gluten', 'Sin Lactosa'];
  tagOptions: string[] = ['Rápido','Vegetariano','Dulce', 'Fácil', 'Saludable', 'Económico', 'Internacional', 'Gourmet', 'Tradicional', 'Fiesta', 'Navidad', 'Halloween', 'San Valentín', 'Verano', 'Invierno', 'Otoño', 'Primavera','Internacional','Sin Gluten','Sin Lactosa','Vegano'];

  constructor(
    private route: ActivatedRoute,
    private publicationService: PublicationService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadMyPublications();
  }

  getImageUrl(imageName: string): string {
    if (!imageName) return 'assets/recipes/default-image.jpg';
    return `http://localhost:3800/api/get-image-pub/${imageName}`;
  }

  loadMyPublications(): void {
    const id = this.route.snapshot.paramMap.get('userId');
    const userId = id === null ? this.userService.getMyUser()?._id : id;
    this.creatorPublications = id === null;

    this.publicationService.getMyPublications(userId).subscribe({
      next: (response: any) => {
        this.publications = response.publications;
      },
      error: (error: any) => {
        console.error('Error al cargar publicaciones:', error);
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
      prepTime: 0,
    };
  }

  closeNewPublication(): void {
    this.creatingPublication = false;
    this.selectedFile = undefined!;
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

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  savePublication(): void {
    // Validaciones
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
      alert('❌ Tags inválidos: ' + invalidTags.join(', '));
      return;
    }

    const publicationToSend = {
      ...this.newPublication,
      tags: this.newPublication.tags.join(',')
    };

    this.publicationService.savePublication(publicationToSend).subscribe({
      next: (res: any) => {
        const createdId = res.publication._id;

        // Subir imagen si se ha seleccionado
        if (this.selectedFile) {
          const token = this.userService.getToken();
          this.publicationService.uploadImagePublication(createdId, this.selectedFile).subscribe({
            next: () => {
              alert('Publicación y imagen guardadas correctamente.');
              this.closeNewPublication();
              this.loadMyPublications();
            },
            error: () => {
              alert('Publicación creada pero error al subir imagen.');
              this.closeNewPublication();
              this.loadMyPublications();
            }
          });
        } else {
          alert('Publicación guardada sin imagen.');
          this.closeNewPublication();
          this.loadMyPublications();
        }
      },
      error: () => alert('Error al guardar la publicación.')
    });
  }
}
