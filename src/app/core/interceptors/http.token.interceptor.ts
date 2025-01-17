import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headersConfig = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    //   const token = this.jwtService.getToken();

    //   if (token) {
    //     headersConfig['Authorization'] = `Token ${token}`;
    //   }

    const request = req.clone({ setHeaders: headersConfig });
    return next.handle(request);
  }
}
