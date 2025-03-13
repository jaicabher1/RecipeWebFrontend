import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../../services/publication/publication.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-publications',
  imports: [ CommonModule],
  templateUrl: './my-publications.component.html',
  styleUrl: './my-publications.component.css'
})
export class MyPublicationsComponent implements OnInit {

  publications: any[] = [];
  selectedPublication: any = null;

  constructor(private publicationService: PublicationService, private router: Router) {}

  ngOnInit(): void {
    this.loadMyPublications();
  }

  loadMyPublications(): void {
    this.publicationService.getMyPublications().subscribe(
      (response: any) => {
        this.publications = response.publications;
      },
      (error: any) => {
        console.error('Error in request:', error);
      }
    );
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
}
