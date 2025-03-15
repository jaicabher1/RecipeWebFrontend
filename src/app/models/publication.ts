import { User } from "./user";

export class Publication {
  constructor(
    public _id?: string,
    public user: string = '',
    public userModel: User  = new User(),
    public title: string = '',
    public category: 'Desayuno' | 'Almuerzo' | 'Cena' | 'Postre' | 'Snack' | 'Vegano' | 'Vegetariano' | 'Sin Gluten' | 'Sin Lactosa' = 'Almuerzo',
    public description: string = '',
    public ingredients: string[] = [],
    public steps: string = '',
    public views: number = 0,
    public tags?: ('Rápido' | 'Vegetariano' | 'Dulce' | 'Fácil' | 'Saludable' | 'Económico' | 'Internacional' | 'Gourmet' | 'Tradicional' | 'Fiesta' | 'Navidad' | 'Halloween' | 'San Valentín' | 'Verano' | 'Invierno' | 'Otoño' | 'Primavera' | 'Sin Gluten' | 'Sin Lactosa' | 'Vegano' | 'Vegetariano')[],
    public difficulty: 'Fácil' | 'Intermedio' | 'Avanzado' = 'Fácil',
    public prepTime: number = 0,
    public image?: string,
    public file?: string,
    public created_at?: Date
  ) {}
}

