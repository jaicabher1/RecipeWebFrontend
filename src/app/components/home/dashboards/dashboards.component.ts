import { Component, OnInit } from '@angular/core';
import { PublicationService } from '../../../services/publication/publication.service';
import Chart from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user/user.service';

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

  following: any[] = []; // Cambiado a array para manejar los datos directamente
  followers: any[] = []; // Cambiado a array para manejar los datos directamente
  followersChart: any;

  constructor(private publicationService: PublicationService, private userService: UserService) { }

  ngOnInit() {
    this.loadPublications();
  }

  loadPublications() {
    const currentUserId = this.userService.getMyUser()?._id;
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

    this.userService.getFollowers(currentUserId).subscribe({
      next: (response: any) => {
        this.followers = response.follows; // Asigna el array directamente
        this.createFollowersChart();
      }
    });

    this.userService.getFollowings(currentUserId).subscribe({
      next: (response: any) => {
        this.following = response.follows; // Asigna el array directamente
        this.createFollowersChart();
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
    var labels = Object.keys(this.groupedPublications);
    var data = labels.map(label => this.groupedPublications[label].length);

    var ctx = document.getElementById('MyChart') as HTMLCanvasElement;
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

  createFollowersChart() {
    // Obtener todos los años posibles (desde el año mínimo hasta el año máximo)
    const allYears = this.getAllYears([...this.followers, ...this.following]);
  
    // Procesar los datos de seguidores y seguidos
    const followersData = this.processFollowersData(this.followers, allYears);
    const followingData = this.processFollowersData(this.following, allYears);
  
    // Combinar las etiquetas de followersData y followingData
    const combinedLabels = [...new Set([...followersData.labels, ...followingData.labels])].sort();
    
    const ctx = document.getElementById('FollowersChart') as HTMLCanvasElement;
    if (this.followersChart) {
      this.followersChart.destroy(); // Destruye el gráfico anterior si existe
    }
  
    this.followersChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: combinedLabels, // Usa las etiquetas combinadas
        datasets: [
          {
            label: 'Seguidores',
            data: followersData.data, // Usa los datos de seguidores ajustados
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            fill: false
          },
          {
            label: 'Seguidos',
            data: followingData.data, // Usa los datos de seguidos ajustados
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            fill: false
          }
        ]
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
            type: 'category', // Asegúrate de que el eje x sea de tipo 'category'
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

  processFollowersData(data: any[], allYears: number[]): { labels: string[], data: number[] } {
    // Verifica si los datos son un array
    if (Array.isArray(data)) {
      let yearCounts: { [key: number]: number } = {};
  
      // Itera sobre el array
      data.forEach((item: any) => {
        // Verifica que 'createdAt' esté presente y sea una fecha válida
        if (item.createdAt) {
          const date = new Date(item.createdAt);
          if (!isNaN(date.getTime())) { // Verifica si la fecha es válida
            const year = date.getFullYear();
            if (!yearCounts[year]) {
              yearCounts[year] = 0;
            }
            yearCounts[year]++;
          } else {
            console.error('Fecha inválida en el registro:', item);
          }
        } else {
          console.error('El campo "createdAt" no está presente en el registro:', item);
        }
      });
  
      // Asegurarse de que todos los años tengan un valor (incluso si es 0)
      allYears.forEach(year => {
        if (!yearCounts[year]) {
          yearCounts[year] = 0; // Si no hay registros para este año, establecer el valor en 0
        }
      });
  
      // Genera las etiquetas (años) y los datos (cantidad de seguidores/seguidos por año)
      const labels = Object.keys(yearCounts).sort();
      const counts = labels.map(year => yearCounts[parseInt(year)]);
  
      return { labels, data: counts };
    } else {
      console.error('Los datos no son un array:', data);
      return { labels: [], data: [] };
    }
  }
  
  // Método para obtener todos los años posibles (desde el año mínimo hasta el año máximo)
  getAllYears(data: any[]): number[] {
    const years = new Set<number>();
  
    // Obtener el año mínimo y máximo de los datos
    data.forEach((item: any) => {
      if (item.createdAt) {
        const date = new Date(item.createdAt);
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          years.add(year);
        }
      }
    });
  
    // Si no hay datos, devolver un array vacío
    if (years.size === 0) {
      return [];
    }
  
    // Obtener el año mínimo y máximo
    const minYear = Math.min(...Array.from(years));
    const maxYear = Math.max(...Array.from(years));
  
    // Generar un array con todos los años desde el mínimo hasta el máximo
    const allYears = [];
    for (let year = minYear; year <= maxYear; year++) {
      allYears.push(year);
    }
  
    return allYears;
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