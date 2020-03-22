import { AuthLogin } from './../shared/authLogin';
import { HttpClient } from '@angular/common/http';
import { Auth } from './../shared/auth';
import { Injectable } from '@angular/core';
import { Router, Data } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    token: string;
    tokenTimer: any;
    private isAuthentecated = false;
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) {}

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    getIsAuth() {
        return this.isAuthentecated;
    }

    getToken() {
        return this.token;
    }

    createUser(username: string, email: string, address: string, password: string) {
        const authData: Auth = { username: username, email: email, address: address, password: password };
        return this.http.post('http://localhost:4000/api/user/signup', authData).subscribe(
            (res) => {
                this.router.navigate([ '/auth/login' ]);
                console.log(res);
            },
            (err) => {
                console.log('connection failed: ', err);
            },
        );
    }

    login(email: string, password: string) {
        const authDataLogin: AuthLogin = { email: email, password: password };
        // this.http.post<{ token: string, expiresIn: number }>('http://localhost:4000/api/user/login', authDataLogin)
        //   .subscribe(res => {
        //     const token = res.token;
        //     this.token = token;
        //     const expiresInDuration = res.expiresIn;
        //     const now = new Date();
        //     const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        //     this.saveAuthData(token, expirationDate);
        //     this.authStatusListener.next(true);
        //     this.isAuthentecated = true;
        //     this.router.navigate(['/']);
        //   })
        this.token = 'aksfjasasfkljasfkljasfl';
        const expiresInDuration = 840000000;
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        this.saveAuthData(this.token, expirationDate);
        this.authStatusListener.next(true);
        this.isAuthentecated = true;
        this.router.navigate([ '/' ]);
    }

    logout() {
        this.token = null;
        this.authStatusListener.next(false);
        this.isAuthentecated = false;
        this.clearAuthData();
        clearTimeout(this.tokenTimer);
    }

    aotoAuthUser() {
        const authInformation = this.getAuthDate();
        if (!authInformation) {
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.token = authInformation.token;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
            this.isAuthentecated = true;
        }
    }

    private setAuthTimer(duration: number) {
        console.log('Setting timer: ' + duration);
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private saveAuthData(token: string, expirationData: Data) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationData.toISOString());
    }

    public clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
    }

    private getAuthDate() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        if (!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
        };
    }
}
