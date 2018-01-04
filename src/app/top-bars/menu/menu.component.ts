import { Component, OnInit } from '@angular/core';
import { IsOnlineGuard } from '../../guard/is-online.guard';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { RESTService } from '../../service/rest.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  fullName: string;

  constructor(private isOnline: IsOnlineGuard, private _router: Router, private user: UserService, private rest: RESTService) {
    const preParam = {
      topic: "getAccountData",
      username: window.sessionStorage.getItem("username"),
      token: window.sessionStorage.getItem("token"),
      role: window.sessionStorage.getItem("role")
    };
    // console.log(preParam);
    this.rest.getAccountData(preParam).then(response => {
      this.fullName = response['prename_th'] + response['firstname_th'] + " " + response['lastname_th'];
    });
   }

  ngOnInit() {
    if(window.sessionStorage.getItem("prename") != null){
      this.fullName = window.sessionStorage.getItem("prename") + window.sessionStorage.getItem("firstname") + "  " + window.sessionStorage.getItem("lastname");
    }else{
      this.logout();
    }
  }

  logout() {
    window.sessionStorage.setItem("role", "");
    window.sessionStorage.setItem("username", "");
    window.sessionStorage.setItem("token", "");
    window.sessionStorage.setItem("prename", "");
    window.sessionStorage.setItem("firstname", "");
    window.sessionStorage.setItem("lastname", "");
    this._router.navigateByUrl("/home");
  }

}
