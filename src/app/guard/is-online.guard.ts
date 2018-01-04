import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class IsOnlineGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (
      (window.sessionStorage.getItem("role") != "") &&
      (window.sessionStorage.getItem("username") != "")
    ) {
      return true;
    } else {
      //this.router.navigateByUrl("/home");
      return false;
    }
  }
}
