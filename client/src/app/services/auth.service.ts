import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map'
import { tokenNotExpired } from 'angular2-jwt'

@Injectable()
export class AuthService {

  domain = 'http://localhost:8080'
  authToken;
  user;
  options;

  constructor(
    private http: Http
  ) { }

  createAuthenticationHeaders() {
    this.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'content-type': 'application/json',
        'authorization': this.authToken
      })
    });
  }

  loadToken() {
    this.authToken =  localStorage.getItem('token');
  }

  registerUser(user) {
    return this.http.post(this.domain + '/authentication/register', user).map(res => res.json());
  }

  checkEmail(email) {
    return this.http.get(this.domain + '/authentication/check-email/' + email).map(res => res.json());
  }

  checkUsername(username) {
    return this.http.get(this.domain + '/authentication/check-username/' + username).map(res => res.json());
  }

  login(user) {
    return this.http.post(`${this.domain}/authentication/login`, user).map(res => res.json());
  }

  loggedIn() {
    return tokenNotExpired();
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  storeUserData(token, user) {
    localStorage.setItem('token', token);
    user = JSON.stringify(user);
    localStorage.setItem('user', user);
    this.authToken = token;
    this.user = user;
  }

  getProfile() {
    this.createAuthenticationHeaders();
    return this.http.get(`${this.domain}/authentication/profile`, this.options).map(res => res.json());
  }

}
