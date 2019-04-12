import { Injectable } from "@angular/core";
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import { Observable } from 'rxjs';

@Injectable()
export class PreventUnsaveChanges implements CanDeactivate<MemberEditComponent> {
    canDeactivate(component: MemberEditComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): 
         boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
             
        if (component.editForm.dirty) {
            return confirm('You have unsaved changes. Are you sure you want to continue?');
        }
        return true;
    }

}