import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RESTService } from '../../service/rest.service';

@Component({
  selector: 'app-dashboard-student',
  templateUrl: './dashboard-student.component.html',
  styleUrls: ['./dashboard-student.component.css']
})
export class DashboardStudentComponent implements OnInit {

  status = [
    {
      prename_th: '--ยังไม่ได้รับเอกสาร--',
      firstname_th: '--ยังไม่ได้รับเอกสาร--',
      lastname_th: '--ยังไม่ได้รับเอกสาร--',
      plan: '--ยังไม่ได้รับเอกสาร--',
      checking: '--ยังไม่ได้รับเอกสาร--',
      level: '--ยังไม่ได้รับเอกสาร--'
    }
  ];
  token: any;
  received = false;
  constructor(private _router: Router, private _rest: RESTService) {
    this.token = window.sessionStorage.getItem("token");
    // getStatusAdmission
    const preParam = {
      topic: "getStatusAdmission",
      username: window.sessionStorage.getItem("username"),
      token: window.sessionStorage.getItem("token"),
      role: window.sessionStorage.getItem("role")
    };

    this._rest.getStatusAdmission(preParam).then(response => {
      this.status['prename_th'] = response['prename_th'];
      this.status['firstname_th'] = response['firstname_th'];
      this.status['lastname_th'] = response['lastname_th'];
      this.status['level'] = response['level'];

      if (response['operation'] == "success") {
        this.received = true;
        this.status['checking'] = "ตรวจสอบแล้วผ่านคุณสมบัติ ให้นักเรียนเข้าสู่ระบบอีกครั้งในวันที่ 11 มกราคม 2561 เพื่อพิมพ์บัตรประจำตัวผู้เข้าสอบ";
        if (response['level'] == 1) {
          if (response['plan_code'] == 1) {
            this.status['plan'] = "เลือกแผนวิทยาศาสตร์ - คณิตศาสตร์ (ภาษาไทย)";
          } else if (response['plan_code'] == 2) {
            this.status['plan'] = "เลือกแผนวิทยาศาสตร์ - คณิตศาสตร์ (ภาษาอังกฤษ)";
          } else if (response['plan_code'] == 3) {
            this.status['plan'] = "เลือกทั้งสองแผน";
          }
        } else if (response['level'] == 4) {
          if (response['plan_code'] == 1) {
            this.status['plan'] = "เลือกแผนวิทยาศาสตร์ - คณิตศาสตร์";
          } else if (response['plan_code'] == 2) {
            this.status['plan'] = "เลือกแผนภาษาอังกฤษ - คณิตศาสตร์";
          }
        }
      } else {
        this.status['prename_th'] = "--ยังไม่ได้รับเอกสาร--";
        this.status['firstname_th'] = "";
        this.status['lastname_th'] = "";
        this.status['level'] = "--ยังไม่ได้รับเอกสาร--";
        this.status['plan'] = "--ยังไม่ได้รับเอกสาร--";
        this.status['checking'] = "--ยังไม่ได้รับเอกสาร--";
      }
    });
  }

  gotoRecived() {
    alert("ส่งเอกสารแล้ว ไม่สามารถแก้ไขได้");
  }

  ngOnInit() {
    this.status['prename_th'] = "--ยังไม่ได้รับเอกสาร--";
    this.status['firstname_th'] = "";
    this.status['lastname_th'] = "";
    this.status['level'] = "--ยังไม่ได้รับเอกสาร--";
    this.status['plan'] = "--ยังไม่ได้รับเอกสาร--";
    this.status['checking'] = "--ยังไม่ได้รับเอกสาร--";
  }

  gotoInfo() {
    this._router.navigateByUrl("student/info");
  }

  printApplication() {
    //window.location.href = "http://www.satit.nu.ac.th/2016/barcode/application.php?token=" + window.sessionStorage.getItem("token");
    window.open("http://www.satit.nu.ac.th/2016/barcode/application.php?token=" + window.sessionStorage.getItem("token"), '_blank');
  }

  printBillPayMent() {
    // window.location.href = "http://www.satit.nu.ac.th/2016/barcode/billpayment.php?token=" + window.sessionStorage.getItem("token");
    window.open("http://www.satit.nu.ac.th/2016/barcode/billpayment.php?token=" + window.sessionStorage.getItem("token"), '_blank');
  }

  printCard() {
    alert("ยังไม่ถึงกำหนดการ พิมพ์บัตรประจำตัวผู้เข้าสอบ");
  }
}
