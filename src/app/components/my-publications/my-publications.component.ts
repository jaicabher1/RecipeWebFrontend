import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../../services/publication/publication.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-publications',
  imports: [ CommonModule],
  templateUrl: './my-publications.component.html',
  styleUrl: './my-publications.component.css'
})
export class MyPublicationsComponent implements OnInit {

  publications: any[] = [];

  constructor(private publicationService: PublicationService) {}

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
}
