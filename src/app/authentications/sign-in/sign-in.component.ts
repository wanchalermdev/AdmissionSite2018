import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { Http, Response, Headers, RequestOptions, HttpModule } from '@angular/http';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  loginForm: FormGroup;
  loginMessage: String;
  loginSuccessMessage: String;

  constructor(private user: UserService, private _router: Router, private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      'username': [null, Validators.required],
      'password': [null, Validators.required]
    });
  }

  formLoginSubmit(post) {

    this.user.authenticate(post.username, post.password).then(response => {
      // console.log(response);
      if (response['operation'] == "success") {
        /*
        * เมื่อการลงชื่อเข้าใช้สำเร็จแล้วให้กำหนด session ของผู้ใช้งานไว้
        */
        this.loginMessage = "";
        this.loginSuccessMessage = "ลงชื่อเข้าใช้สำเร็จ กรุณารอระบบประมวลผล";
        window.sessionStorage.setItem("role", response['role']);
        window.sessionStorage.setItem("username", response['username']);
        window.sessionStorage.setItem("token", response['token']);
        window.sessionStorage.setItem("prename", response['prename']);
        window.sessionStorage.setItem("firstname", response['firstname']);
        window.sessionStorage.setItem("lastname", response['lastname']);
        this._router.navigateByUrl("/student/dashboard");
      } else {
        window.sessionStorage.setItem("role", "");
        window.sessionStorage.setItem("username", "");
        window.sessionStorage.setItem("token", "");
        window.sessionStorage.setItem("prename", "");
        window.sessionStorage.setItem("firstname", "");
        window.sessionStorage.setItem("lastname", "");
        this.loginMessage = "ชื่อผู้ใช้ หรือรหัสผ่านไม่ถูกต้องกรุณาลองอีกครั้ง";
        this.loginSuccessMessage = "";
      }
    });
  }

  ngOnInit() {

  }
}
