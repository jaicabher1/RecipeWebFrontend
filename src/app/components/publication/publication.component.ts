// publication.component.ts
import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../../services/publication/publication.service';
import { Publication } from '../../models/publication';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-publication',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
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
        // Cambiar valor user de publications por el name de user
        this.publications.forEach((publication: Publication) => {
          this.userService.getUserById(publication.user).subscribe(
            (response: { user: User }) => {
              console.log('response:', response);
              publication.userModel = response.user; 
            },
            (error: any) => {
              console.error('Error en la petición:', error);
              this.errorMessage = error?.error?.message || 'Error desconocido';
            }
          );
        });
      },
      (error: any) => {
        console.error('Error en la petición:', error);
        this.errorMessage = error?.error?.message || 'Error desconocido';
      }
    );
  }
}