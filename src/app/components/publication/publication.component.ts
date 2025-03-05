// publication.component.ts
import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../../services/publication/publication.service';
import { Publication } from '../../models/publication';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-publication',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.css']
})
export class PublicationComponent implements OnInit {
  public publications: any[] = [];
  public errorMessage: string | null = null;

  constructor(private publicationService: PublicationService, private userService: UserService) {}

  ngOnInit(): void {
    this.loadFollowedPublications();
  }


  loadFollowedPublications(): void {
    this.publicationService.getFollowedPublications().subscribe(
      (response: { publications: Publication[] }) => {
        this.publications = response.publications;

      },
      (error: any) => {
        console.error('Error en la petición:', error);
        this.errorMessage = error?.error?.message || 'Error desconocido';
      }
    );
  }
}