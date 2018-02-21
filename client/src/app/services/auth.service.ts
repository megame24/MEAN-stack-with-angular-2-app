import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthService {

  domain = 'http://localhost:8080'

  constructor(
    private http: Http
  ) { }

  registerUser(user) {
    return this.http.post(this.domain + '/authentication/register', user).map(res => res.json());
  }

  checkEmail(email) {
    return this.http.get(this.domain + '/authentication/check-email/' + email).map(res => res.json());
  }

  checkUsername(username) {
    return this.http.get(this.domain + '/authentication/check-username/' + username).map(res => res.json());
  }

}
