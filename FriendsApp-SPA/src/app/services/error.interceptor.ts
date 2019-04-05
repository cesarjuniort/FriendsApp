import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError( error => {
                if(error instanceof HttpErrorResponse){

                    //handling standard error codes
                    if(error.status === 401 || error.status === 403){
                        return throwError(error.statusText || 'Unauthorized');
                    } else if (error.status === 404){
                        return throwError(error.statusText || 'Not Found');
                    }


                    error.headers.keys();
                    const appError = error.headers.get('Application-Error');
                    if(appError){
                        console.log('appError', appError);
                        return throwError(appError);
                    }
                    else {
                        const serverError = error.error;
                        let modelStateErrors = ''; // to be parsed from server model annotations (if any).
                        if(serverError && typeof serverError === 'object'){
                            for(const key in serverError){
                                if(serverError[key]){
                                    modelStateErrors += serverError[key] + '\n';
                                }
                            }
                        }
                        return throwError(modelStateErrors || serverError || 'Server Internal Error!');
                    }
                }
            })
        )
    }
    
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
}