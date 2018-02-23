import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FlashMessage } from 'angular-flash-message';

@Injectable()
export class NotAuthGuard implements CanActivate {

    constructor (
        private authService: AuthService,
        private router: Router,
        private flashMessage: FlashMessage
    ) {}

    canActivate() {
        if(this.authService.loggedIn()) {
            this.flashMessage.info('You are already logged in', {
                dalay: 10000
            });
            this.router.navigate(['/']);
            return false;
        } else {
            return true;
        }
    }
}
