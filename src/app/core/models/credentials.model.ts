export interface ICredentials {
    username?: string;
    password?: string;
    rememberMe?: boolean;
  }
  
  export class Credentials implements ICredentials {
    constructor(
      public username?: string,
      public password?: string,
      public rememberMe?: boolean
    ) { }
  }
  