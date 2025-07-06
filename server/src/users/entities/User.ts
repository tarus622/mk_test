export class User {
  private id: string;
  private email: string;
  private password: string;
  private refresh_token?: string;

  constructor(id: string, email: string, password: string) {
    this.id = id;
    this.email = email;
    this.password = password;
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

  setRefreshToken(token: string) {
    this.refresh_token = token;
  }
}
