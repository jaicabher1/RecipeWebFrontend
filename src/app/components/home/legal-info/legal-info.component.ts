import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-legal-info',
  imports: [],
  templateUrl: './legal-info.component.html',
  styleUrl: './legal-info.component.css'
})
export class LegalInfoComponent implements OnInit {

  showTerms: boolean = false;
  showPrivacy: boolean = false;
  contactoEmail: string = 'contacto@recipejaime.com';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const type = this.route.snapshot.paramMap.get('type');
    if (type === 'terms') {
      this.showTerms = true;
    } else if (type === 'privacy') {
      this.showPrivacy = true;
    }
  }

}
