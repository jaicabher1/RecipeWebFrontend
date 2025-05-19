import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DashboardsComponent } from './dashboards.component';
import { PublicationService } from '../../../services/publication/publication.service';
import { UserService } from '../../../services/user/user.service';
import { of } from 'rxjs';
import { User } from '../../../models/user';

describe('DashboardsComponent', () => {
  let component: DashboardsComponent;
  let fixture: ComponentFixture<DashboardsComponent>;
  let publicationServiceSpy: jasmine.SpyObj<PublicationService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockPublications = [
    { category: 'Postre', created_at: '2023-01-15T00:00:00Z' },
    { category: 'Cena', created_at: '2023-02-15T00:00:00Z' },
    { category: 'Cena', created_at: '2024-01-01T00:00:00Z' }
  ];

  const mockUser = new User(
    '123',             // _id
    'John',            // name
    'Doe',             // surname
    'john@test.com',   // email
    'johndoe',         // nick
    '12345678',        // password
    'ROLE_USER',       // role
    '', '', false, '', ''
  );

  beforeEach(async () => {
    publicationServiceSpy = jasmine.createSpyObj('PublicationService', ['getMyPublications']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getMyUser', 'getFollowers', 'getFollowings']);

    await TestBed.configureTestingModule({
      imports: [DashboardsComponent],
      providers: [
        { provide: PublicationService, useValue: publicationServiceSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardsComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('extractCategories debe llenar las categorías únicas', () => {
    component.publications = mockPublications;
    component.extractCategories();

    expect(component.categories).toContain('Postre');
    expect(component.categories).toContain('Cena');
  });

  it('extractYears debe obtener los años únicos ordenados', () => {
    component.publications = mockPublications;
    component.extractYears();

    expect(component.years).toEqual([2024, 2023]);
  });

  it('groupPublicationsByMonth debe agrupar correctamente por mes y año', () => {
    component.publications = mockPublications;
    component.selectedCategory = 'all';
    component.selectedYear = 'all';

    component.groupPublicationsByMonth();

    const keys = Object.keys(component.groupedPublications);
    expect(keys.length).toBeGreaterThan(0);
  });

  it('getAllYears debe generar un rango completo', () => {
    const data = [
      { createdAt: '2021-01-01' },
      { createdAt: '2023-01-01' }
    ];

    const years = component.getAllYears(data);
    expect(years).toEqual([2021, 2022, 2023]);
  });

  it('processFollowersData debe contar correctamente por año', () => {
    const data = [
      { createdAt: '2022-01-01' },
      { createdAt: '2022-06-01' },
      { createdAt: '2023-01-01' }
    ];

    const allYears = [2022, 2023];
    const result = component.processFollowersData(data, allYears);

    expect(result.labels).toEqual(['2022', '2023']);
    expect(result.data).toEqual([2, 1]);
  });

  it('ngOnInit debe cargar publicaciones y seguidores', () => {
    userServiceSpy.getMyUser.and.returnValue(mockUser);
    publicationServiceSpy.getMyPublications.and.returnValue(of({ publications: mockPublications }));
    userServiceSpy.getFollowers.and.returnValue(of({ follows: [] }));
    userServiceSpy.getFollowings.and.returnValue(of({ follows: [] }));

    spyOn(component, 'createBarChart');
    spyOn(component, 'createFollowersChart');

    component.ngOnInit();

    expect(publicationServiceSpy.getMyPublications).toHaveBeenCalled();
    expect(userServiceSpy.getFollowers).toHaveBeenCalled();
    expect(userServiceSpy.getFollowings).toHaveBeenCalled();
    expect(component.createBarChart).toHaveBeenCalled();
    expect(component.createFollowersChart).toHaveBeenCalled();
  });
});
