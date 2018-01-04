import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Inject } from '@angular/core';
import { NgModel } from '@angular/forms';
import { RESTService } from '../service/rest.service';
import { IsOnlineGuard } from '../guard/is-online.guard';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public dialog: MatDialog, private rest: RESTService, private isOnline: IsOnlineGuard, private _router: Router) { }

  animal: string;
  name: string;

  enableDebugMode = true;

  personal_id: string;
  prename: string;
  firstname: string;
  lastname: string;
  birthday: string;
  birhtmonth: string;
  birthyear: string;
  plan_code: string;
  plan = [];

  couseM1 = [
    { value: '1', viewValue: 'เลือกแผนวิทยาศาสตร์ - คณิตศาสตร์ (ภาษาไทย)' },
    { value: '2', viewValue: 'เลือกแผนวิทยาศาสตร์ - คณิตศาสตร์ (ภาษาอังกฤษ)' },
    { value: '3', viewValue: 'เลือกทั้งสองแผน' }
  ];

  couseM4 = [
    { value: '1', viewValue: 'เลือกแผนวิทยาศาสตร์ - คณิตศาสตร์' },
    { value: '2', viewValue: 'เลือกแผนภาษาอังกฤษ - คณิตศาสตร์' }
  ];

  navigateDashboard() {
    this._router.navigateByUrl("/student/dashboard");
  }

  openDialog(level): void {
    if (level == 1) {
      this.plan = this.couseM1;
    } else {
      this.plan = this.couseM4;
    }
    let dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: 'max-content',
      data: {
        level: level,
        personal_id: this.personal_id,
        prename: this.prename,
        firstname: this.firstname,
        lastname: this.lastname,
        birthday: this.birthday,
        birhtmonth: this.birhtmonth,
        birthyear: this.birthyear,
        plan_code: this.plan_code,
        plan: this.plan,
        topic: "createNewAccount"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (this.enableDebugMode) {
          console.log("มีการบันทึกข้อมูล");
          if (result.personal_id !== undefined) console.log("มีการกรอกเลขประจำตัวประชาชนจริง");
          if (result.prename !== undefined) console.log("มีการเลือกคำหน้านามแล้ว จริง");
          if (result.firstname !== undefined) console.log("มีการกรอกชื่อจริงมาแล้ว จริง");
          if (result.lastname !== undefined) console.log("มีการกรอกนามสกุลมาแล้ว จริง");
          if (result.birthday !== undefined) console.log("มีการเลือกวันที่เกิดมาแล้ว จริง");
          if (result.birhtmonth !== undefined) console.log("มีการเลือกเดือนเกิดมาแล้ว จริง");
          if (result.birthyear !== undefined) console.log("มีการเลือกปีเกิดมาแล้วจริง");
        }
        if (
          (result.personal_id !== undefined) &&
          (result.prename !== undefined) &&
          (result.firstname !== undefined) &&
          (result.lastname !== undefined) &&
          (result.birthday !== undefined) &&
          (result.birhtmonth !== undefined) &&
          (result.plan_code !== undefined) &&
          (result.birthyear !== undefined)) {
          this.rest.createNewAccount(result).then(response => {
            console.log(response);
            if (response['operation'] == "success") {
              /*
              * เมื่อการลงชื่อเข้าใช้สำเร็จแล้วให้กำหนด session ของผู้ใช้งานไว้
              */
              window.sessionStorage.setItem("role", response['role']);
              window.sessionStorage.setItem("username", response['username']);
              window.sessionStorage.setItem("token", response['token']);
              window.sessionStorage.setItem("prename", response['prename']);
              window.sessionStorage.setItem("firstname", response['firstname']);
              window.sessionStorage.setItem("lastname", response['lastname']);
              this._router.navigateByUrl("/student/info");
              // window.location.href = "./student/info";
            } else {
              alert("มีบางอย่างพิดลาด!\n " + response['error_message']);
              window.sessionStorage.setItem("role", "");
              window.sessionStorage.setItem("username", "");
              window.sessionStorage.setItem("token", "");
              window.sessionStorage.setItem("prename", "");
              window.sessionStorage.setItem("firstname", "");
              window.sessionStorage.setItem("lastname", "");
            }
          });
        } else {
          console.log(result);
          alert("คุณยังกรอกข้อมูลไม่ครบ");
        }
      } else {
        /*
        * ไม่ได้กรอกข้อมูล
        */
        console.log("ไม่ได้กรอกข้อมูล");
      }
    });
  }

  ngOnInit() {
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }


  preNmaes = [
    { value: 'เด็กชาย', viewValue: 'เด็กชาย' },
    { value: 'เด็กหญิง', viewValue: 'เด็กหญิง' },
    { value: 'นาย', viewValue: 'นาย' },
    { value: 'นางสาว', viewValue: 'นางสาว' }
  ];

  numOfDate = [
    { value: '01', viewValue: '01' }, { value: '02', viewValue: '02' }, { value: '03', viewValue: '03' },
    { value: '04', viewValue: '04' }, { value: '05', viewValue: '05' }, { value: '06', viewValue: '06' },
    { value: '07', viewValue: '07' }, { value: '08', viewValue: '08' }, { value: '09', viewValue: '09' },
    { value: '10', viewValue: '10' }, { value: '11', viewValue: '11' }, { value: '12', viewValue: '12' },
    { value: '13', viewValue: '13' }, { value: '14', viewValue: '14' }, { value: '15', viewValue: '15' },
    { value: '16', viewValue: '16' }, { value: '17', viewValue: '17' }, { value: '18', viewValue: '18' },
    { value: '19', viewValue: '19' }, { value: '20', viewValue: '20' }, { value: '21', viewValue: '21' },
    { value: '22', viewValue: '22' }, { value: '23', viewValue: '23' }, { value: '24', viewValue: '24' },
    { value: '25', viewValue: '25' }, { value: '26', viewValue: '26' }, { value: '27', viewValue: '27' },
    { value: '28', viewValue: '28' }, { value: '29', viewValue: '29' }, { value: '30', viewValue: '30' },
    { value: '31', viewValue: '31' }
  ];

  numOfMounts = [
    { value: '01', viewValue: 'มกราคม' },
    { value: '02', viewValue: 'กุมภาพันธ์' },
    { value: '03', viewValue: 'มีนาคม' },
    { value: '04', viewValue: 'เมษายน' },
    { value: '05', viewValue: 'พฤษภาคม' },
    { value: '06', viewValue: 'มิถุนายน' },
    { value: '07', viewValue: 'กรกฎาคม' },
    { value: '08', viewValue: 'สิงหาคม' },
    { value: '09', viewValue: 'กันยายน' },
    { value: '10', viewValue: 'ตุลาคม' },
    { value: '11', viewValue: 'พฤศจิกายน' },
    { value: '12', viewValue: 'ธันวาคม' }
  ];

  numOfYears = [
    { value: '2540', viewValue: '2540' },
    { value: '2541', viewValue: '2541' },
    { value: '2542', viewValue: '2542' },
    { value: '2543', viewValue: '2543' },
    { value: '2544', viewValue: '2544' },
    { value: '2545', viewValue: '2545' },
    { value: '2546', viewValue: '2546' },
    { value: '2547', viewValue: '2547' },
    { value: '2548', viewValue: '2548' },
    { value: '2549', viewValue: '2549' },
    { value: '2550', viewValue: '2550' }
  ];

  onNoClick(): void {
    this.dialogRef.close();
  }

}