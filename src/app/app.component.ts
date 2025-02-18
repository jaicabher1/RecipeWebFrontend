import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';  // Necesario para usar rutas

@Component({
  selector: 'app-root',
  standalone: true,  // Hacemos que este componente sea standalone
  imports: [RouterModule],  // Solo importamos RouterModule si lo necesitas
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'RecipeWebFrontend';
}
