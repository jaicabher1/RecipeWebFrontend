import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicationService } from '../../../services/publication/publication.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-publication',
  imports: [FormsModule],
  templateUrl: './edit-publication.component.html',
  styleUrl: './edit-publication.component.css'
})
export class EditPublicationComponent implements OnInit {
  publication: any = {};

  constructor(private route: ActivatedRoute, private publicationService: PublicationService, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if(id) {
      this.publicationService.getPublicationById(id).subscribe(response => {
        this.publication = response.publication;
      });
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
