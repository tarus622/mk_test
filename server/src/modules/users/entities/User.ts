export class User {
  private id: string;
  private email: string;
  private password: string;
  private permission: string;
  private refresh_token?: string;

  constructor(id: string, email: string, password: string, permission: string) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.permission = permission;
  }

  getId() {
    return this.id;
  }

  getEmail() {
    return this.email;
  }

  getPassword() {
    return this.password;
  }

  getPermission() {
    return this.permission;
  }

  getRefreshToken() {
    return this.refresh_token;
  }

  setId(id: string) {
    this.id = id;
  }

  setEmail(email: string) {
    this.email = email;
  }

  setPassword(password: string) {
    this.password = password;
  }

  setPermission(permission: string) {
    this.permission = permission;
  }

  setRefreshToken(token: string) {
    this.refresh_token = token;
  }

  revokeToken() {
    this.refresh_token = '';
  }
}
