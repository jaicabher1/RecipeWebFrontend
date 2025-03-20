import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../../../services/publication/publication.service';
import Chart from 'chart.js/auto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.css'],
  imports: [CommonModule]
})
export class DashboardsComponent implements OnInit {
  publications: any[] = [];
  groupedPublications: { [key: string]: any[] } = {};
  categories: string[] = [];
  years: number[] = [];
  selectedCategory: string = 'all';
  selectedYear: string = 'all';
  chart: any;

  constructor(private publicationService: PublicationService) {}

  ngOnInit() {
    this.loadPublications();
  }

  loadPublications() {
    const currentUserId = '679e6ea7da2a548f69091e91'; // Cambia esto por el ID del usuario actual
    this.publicationService.getMyPublications(currentUserId).subscribe({
      next: (response: any) => {
        this.publications = response.publications;
        this.extractCategories();
        this.extractYears();
        this.groupPublicationsByMonth();
        this.createBarChart();
      },
      error: (error: any) => {
        console.error('Error in request:', error);
      }
    });
  }

  extractCategories() {
    const uniqueCategories = new Set<string>();
    this.publications.forEach(pub => uniqueCategories.add(pub.category));
    this.categories = Array.from(uniqueCategories);
  }

  extractYears() {
    const uniqueYears = new Set<number>();
    this.publications.forEach(pub => {
      const year = new Date(pub.created_at).getFullYear();
      uniqueYears.add(year);
    });
    this.years = Array.from(uniqueYears).sort((a, b) => b - a); // Ordenar de más reciente a más antiguo
  }

  groupPublicationsByMonth() {
    this.groupedPublications = this.publications.reduce((acc: any, pub: any) => {
      const pubYear = new Date(pub.created_at).getFullYear().toString();
      if (
        (this.selectedCategory === 'all' || pub.category === this.selectedCategory) &&
        (this.selectedYear === 'all' || pubYear === this.selectedYear)
      ) {
        const monthYear = new Date(pub.created_at).toLocaleString('es-ES', { month: 'long', year: 'numeric' });
        if (!acc[monthYear]) {
          acc[monthYear] = [];
        }
        acc[monthYear].push(pub);
      }
      return acc;
    }, {});
  
    // Ordenar las fechas
    const sortedKeys = Object.keys(this.groupedPublications).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA.getTime() - dateB.getTime();
    });
  
    // Crear un nuevo objeto ordenado
    const sortedGroupedPublications: { [key: string]: any[] } = {};
    sortedKeys.forEach(key => {
      sortedGroupedPublications[key] = this.groupedPublications[key];
    });
  
    this.groupedPublications = sortedGroupedPublications;
  }

  createBarChart() {
    const labels = Object.keys(this.groupedPublications);
    const data = labels.map(label => this.groupedPublications[label].length);

    const ctx = document.getElementById('MyChart') as HTMLCanvasElement;
    if (this.chart) {
      this.chart.destroy(); // Destruye el gráfico anterior si existe
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Publicaciones',
          data: data,
          backgroundColor: 'rgba(128, 0, 255, 0.6)',
          borderColor: 'rgba(128, 0, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: '#e0e0e0'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#333',
              font: {
                size: 14
              }
            }
          }
        }
      }
    });
  }

  onCategoryChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCategory = selectElement.value;
    this.updateChart();
  }

  onYearChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedYear = selectElement.value;
    this.updateChart();
  }

  updateChart() {
    this.groupPublicationsByMonth();
    this.createBarChart();
  }
}