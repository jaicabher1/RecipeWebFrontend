import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditProfileComponent } from './edit-profile.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { User } from '../../models/user';

describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getMyUser', 'getUserById', 'updateUser', 'uploadImage']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        EditProfileComponent,            // 👈 standalone component
        HttpClientTestingModule          // 👈 required for HttpClient dependencies
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debe cargar usuario si hay ID', () => {
    const mockUser = new User('1', 'Nombre', '', 'a@a.com', 'nick', '', 'ROLE_USER');
    userServiceSpy.getMyUser.and.returnValue(mockUser);
    userServiceSpy.getUserById.and.returnValue(of({ user: mockUser }));

    component.ngOnInit();

    expect(userServiceSpy.getUserById).toHaveBeenCalledWith('1');
    expect(component.user).toEqual(mockUser);
  });

  it('onSubmit debe mostrar error si no hay ID', () => {
    component.user = new User(); // sin ID
    component.onSubmit();
    expect(component.messageType).toBe('error');
  });

  it('onFileSelected debe asignar el archivo', () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    component.onFileSelected({ target: { files: [file] } });
    expect(component.selectedFile).toBe(file);
  });

  it('onUploadImage debe mostrar error si falta archivo o user ID', () => {
    component.user = new User(); // sin ID
    component.onUploadImage();
    expect(component.messageType).toBe('error');
  });

});
