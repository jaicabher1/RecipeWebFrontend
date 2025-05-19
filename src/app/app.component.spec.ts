import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from './services/user/user.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        AppComponent, // Angular 15+ standalone support
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe tener como título "Rechefy"', () => {
    expect(component.title).toBe('Rechefy');
  });

  it('debe inyectar correctamente UserService', () => {
    const userService = TestBed.inject(UserService);
    expect(userService).toBeTruthy();
  });
});
