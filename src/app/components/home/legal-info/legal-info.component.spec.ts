import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LegalInfoComponent } from './legal-info.component';
import { ActivatedRoute } from '@angular/router';

describe('LegalInfoComponent', () => {
  let component: LegalInfoComponent;
  let fixture: ComponentFixture<LegalInfoComponent>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy()
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [LegalInfoComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LegalInfoComponent);
    component = fixture.componentInstance;
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar los términos si el parámetro es "terms"', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('terms');

    component.ngOnInit();

    expect(component.showTerms).toBeTrue();
    expect(component.showPrivacy).toBeFalse();
  });

  it('debe mostrar la privacidad si el parámetro es "privacy"', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('privacy');

    component.ngOnInit();

    expect(component.showPrivacy).toBeTrue();
    expect(component.showTerms).toBeFalse();
  });

  it('no debe mostrar nada si el parámetro es otro', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('otro');

    component.ngOnInit();

    expect(component.showPrivacy).toBeFalse();
    expect(component.showTerms).toBeFalse();
  });

  it('debe contener el correo de contacto por defecto', () => {
    expect(component.contactoEmail).toBe('contacto@recipejaime.com');
  });
});
