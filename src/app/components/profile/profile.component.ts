import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { Follow } from '../../models/follow';
import { FollowService } from '../../services/follow/follow.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  counters: any = null;
  isFollowing: boolean = false;
  followedId: string = '';
  followMessage: string | null = null;
  followMessageType: 'success' | 'error' | null = null;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private followService: FollowService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const userId = params.get('id');
      this.followedId = userId || '';

      if (userId && userId !== this.userService.getMyUser()?._id) {
        this.loadUserProfile(userId, false);
      } else {
        this.loadUserProfile(undefined, true);
      }
    });
  }

  loadUserProfile(id?: string, isOwnProfile: boolean = false): void {
    if (isOwnProfile) {
      const myId = this.userService.getMyUser()?._id;
      if (myId) {
        this.userService.getUserById(myId).subscribe({
          next: response => {
            this.user = response.user;
            this.counters = { 
              following: response.following, 
              followed: response.followed, 
              publications: response.publications,
              showButton: true 
            };
          },
          error: err => console.error('Error al obtener usuario:', err)
        });
      }
    } else if (id) {
      this.getIsFollowing(id);
      this.userService.getUserById(id).subscribe({
        next: response => {
          this.user = response.user;
          this.counters = {
            following: response.following,
            followed: response.followed,
            publications: response.publications,
            showButton: false
          };
        },
        error: err => console.error('Error al obtener perfil:', err)
      });
    }
  }
  

  getIsFollowing(followedId: string): void {
    this.isFollowing = false;
    const currentUserId = this.userService.getMyUser()?._id;
    if (!currentUserId) return;

    this.userService.getFollowings(currentUserId).subscribe({
      next: response => {
        this.isFollowing = response.follows.some(
          (follow: any) => follow.followed._id === followedId
        );
      },
      error: err => console.error('Error al comprobar follow:', err)
    });
  }

  onFollow(followedId: string): void {
    const currentUserId = this.userService.getMyUser()?._id || '';
    const follow = new Follow('', currentUserId, followedId);

    this.followService.saveFollow(follow).subscribe({
      next: response => {
        this.isFollowing = true;
        this.setFollowMessage('✔ Solicitud de seguimiento enviada correctamente', 'success');
      },
      error: err => {
        const msg = err.error?.message || 'Error al seguir al usuario';
        this.setFollowMessage(`❌ ${msg}`, 'error');
      }
    });
  }

  onUnfollow(followedId: string): void {
    this.followService.deleteFollow(followedId).subscribe({
      next: response => {
        this.isFollowing = false;
        this.setFollowMessage('✔ Dejaste de seguir a este usuario', 'success');
      },
      error: err => {
        const msg = err.error?.message || 'Error al dejar de seguir al usuario';
        this.setFollowMessage(`❌ ${msg}`, 'error');
      }
    });
  }

  private setFollowMessage(message: string, type: 'success' | 'error'): void {
    this.followMessage = message;
    this.followMessageType = type;
    setTimeout(() => {
      this.followMessage = null;
      this.followMessageType = null;
    }, 1000);
  }

  onFollowing(): void {
    this.router.navigate(['/followings']);
  }

  onFollowers(): void {
    this.router.navigate(['/followers']);
  }

  onMyPublications(): void {
    if(this.followedId) this.router.navigate(['/publications/' + this.followedId]);
    else this.router.navigate(['/my-publications']);
  }

  onEditProfile(): void {
    this.router.navigate(['/edit-profile']);
  }
}

