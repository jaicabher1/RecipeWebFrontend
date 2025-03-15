export class User {
    getToken: any;
    
    constructor(
      public _id?: string,
      public name: string = '',
      public surname?: string,
      public email: string = '',
      public nick: string = '',
      public password?: string, 
      public role: 'ROLE_ADMIN' | 'ROLE_USER' = 'ROLE_USER',
      public bio?: string,
      public location?: string,
      public isVerified: boolean = false,
      public image?: string,
      public phoneNumber?: string,
      public createdAt?: Date
    ) {}
  }
  