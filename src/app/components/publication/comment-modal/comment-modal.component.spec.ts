import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentModalComponent } from './comment-modal.component';
import { PublicationService } from '../../../services/publication/publication.service';
import { UserService } from '../../../services/user/user.service';
import { of, throwError } from 'rxjs';
import { User } from '../../../models/user';

describe('CommentModalComponent', () => {
  let component: CommentModalComponent;
  let fixture: ComponentFixture<CommentModalComponent>;
  let publicationServiceSpy: jasmine.SpyObj<PublicationService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    publicationServiceSpy = jasmine.createSpyObj('PublicationService', ['sendComment', 'deleteComment']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getMyUser']);

    await TestBed.configureTestingModule({
      imports: [CommentModalComponent],
      providers: [
        { provide: PublicationService, useValue: publicationServiceSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CommentModalComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });


  it('no debe emitir el evento close si el clic no es en la overlay', () => {
    spyOn(component.close, 'emit');

    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });

    const otherElement = document.createElement('div');
    otherElement.classList.add('some-other-class');
    document.body.appendChild(otherElement);

    document.dispatchEvent(event);

    expect(component.close.emit).not.toHaveBeenCalled();

    document.body.removeChild(otherElement);
  });

  it('debe emitir el evento close cuando se llama a onClose', () => {
    spyOn(component.close, 'emit');

    component.onClose();

    expect(component.close.emit).toHaveBeenCalled();
  });

  it('debe enviar un comentario y agregarlo a la lista', () => {
    const mockUser = new User(
      '123',
      'John',
      'Doe',
      'john@test.com',
      'johndoe',
      '12345678',
      'ROLE_USER',
      '', '', false, '', ''
    );
    userServiceSpy.getMyUser.and.returnValue(mockUser);

    publicationServiceSpy.sendComment.and.returnValue(of({ comment: { _id: '123', text: 'Nuevo comentario' } }));

    component.publicationId = '456'; // Asignamos un valor a publicationId
    component.messageText = 'Nuevo comentario';
    component.sendComment();

    expect(publicationServiceSpy.sendComment).toHaveBeenCalledWith('456', 'Nuevo comentario');
    expect(component.comments.length).toBe(1);
    expect(component.comments[0].text).toBe('Nuevo comentario');
  });

  it('debe manejar el error al enviar un comentario', () => {
    spyOn(console, 'error');
    publicationServiceSpy.sendComment.and.returnValue(throwError(() => new Error('Error al enviar comentario')));

    component.messageText = 'Nuevo comentario';
    component.sendComment();

    expect(console.error).toHaveBeenCalledWith('Error al enviar comentario:', jasmine.any(Error));
  });

  it('debe eliminar un comentario', () => {
    const comment = { _id: '123', text: 'Comentario original' };
    component.comments = [comment];

    publicationServiceSpy.deleteComment.and.returnValue(of({}));

    component.deleteComment(comment._id);

    expect(publicationServiceSpy.deleteComment).toHaveBeenCalledWith(comment._id);
    expect(component.comments[0].text).toBe(' Este comentario ha sido eliminado.');
  });

  it('debe manejar el error al eliminar un comentario', () => {
    spyOn(console, 'error');
    publicationServiceSpy.deleteComment.and.returnValue(throwError(() => new Error('Error al eliminar comentario')));

    component.deleteComment('123');

    expect(console.error).toHaveBeenCalledWith('Error al eliminar comentario:', jasmine.any(Error));
  });
});
