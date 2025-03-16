import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../../services/publication/publication.service';
import { Publication } from '../../models/publication';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user';
import { RouterLink } from '@angular/router';
import { LikeModalComponent } from './like-modal/like-modal.component';
import { CommentModalComponent } from "./comment-modal/comment-modal.component";

@Component({
  selector: 'app-publication',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, LikeModalComponent, CommentModalComponent],
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.css']
})
export class PublicationComponent implements OnInit {
  publications: any[] = [];
  errorMessage: string | null = null;

  likesMap: Record<string, number> = {};
  commentsMap: Record<string, number> = {};

  // Modal de Likes
  showLikesModal: boolean = false;
  selectedLikes: any[] = [];

  // Modal de Comments
  showCommentsModal: boolean = false;
  selectedComments: any[] = [];
  selectedPublicationId: string = '';

  constructor(
    private publicationService: PublicationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadFollowedPublications();
  }

  loadFollowedPublications(): void {
    this.publicationService.getFollowedPublications().subscribe(
      (response: { publications: Publication[] }) => {
        this.publications = response.publications;

        this.publications.forEach((publication: Publication) => {
          if (publication._id) {
            this.loadNumLikes(publication._id);
            this.loadNumComments(publication._id);
            this.loadUserDetails(publication);
          }
        });
      },
      (error: any) => {
        console.error('Error al cargar publicaciones:', error);
        this.errorMessage = error?.error?.message || 'Error desconocido';
      }
    );
  }

  loadUserDetails(publication: Publication): void {
    this.userService.getUserById(publication.user).subscribe(
      (res: { user: User }) => {
        publication.userModel = res.user;
      },
      (error: any) => {
        console.error('Error al obtener usuario:', error);
        this.errorMessage = error?.error?.message || 'Error desconocido';
      }
    );
  }

  loadNumLikes(publicationId: string): void {
    this.publicationService.getNumLikes(publicationId).subscribe(
      (response: any) => {
        this.likesMap[publicationId] = response?.totalLikes || 0;
        // También almacenamos los usuarios que dieron like si quieres mostrarlos
        this.publications.find(pub => pub._id === publicationId).likesList = response.likes || [];
      },
      (error: any) => {
        console.error('Error en likes:', error);
        this.likesMap[publicationId] = 0;
      }
    );
  }

  loadNumComments(publicationId: string): void {
    this.publicationService.getComments(publicationId).subscribe(
      (response: any) => {
        this.commentsMap[publicationId] = response?.totalComments || 0;
        // También almacenamos los usuarios que comentaron si quieres mostrarlos
        this.publications.find(pub => pub._id === publicationId).commentList = response.comments || [];
      },
      (error: any) => {
        console.error('Error en comentarios:', error);
        this.commentsMap[publicationId] = 0;
      }
    );
  }

  getLikeCount(publicationId: string): number {
    return this.likesMap[publicationId] || 0;
  }

  getCommentCount(publicationId: string): number {
    return this.commentsMap[publicationId] || 0;
  }

  // 👇 Modal de Likes
  openLikesModal(publicationId: string): void {
    const publication = this.publications.find(pub => pub._id === publicationId);
    this.selectedLikes = publication?.likesList || [];
    this.showLikesModal = true;
  }

  closeLikesModal(): void {
    this.showLikesModal = false;
  }

  // 👇 Modal de Comments
  openCommentsModal(publicationId: string): void {
    const publication = this.publications.find(pub => pub._id === publicationId);
    this.selectedPublicationId = publicationId;
    this.selectedComments = publication?.commentList || [];
    this.showCommentsModal = true;
  }

  closeCommentsModal(): void {
    this.showCommentsModal = false;
  }
}
