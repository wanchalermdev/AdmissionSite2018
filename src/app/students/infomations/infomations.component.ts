import { Component, Directive, EventEmitter, ElementRef, Renderer, HostListener, Output, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { RESTService } from '../../service/rest.service';
import { Router } from '@angular/router';
import { FileFilter, hookType, UploaderHook } from '@uniprank/ng2-file-uploader';
import { FileDropModule, UploadFile, UploadEvent } from 'ngx-file-drop/lib/ngx-drop';
import { BehaviorSubject } from 'rxjs/Rx';
import { FileManager, FileManagerOptions, FileUploader, Utils, Transfer, TransferOptions } from '@uniprank/ng2-file-uploader';
import { MenuComponent } from '../../top-bars/menu/menu.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-infomations',
  templateUrl: './infomations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./infomations.component.scss'],
})
export class InfomationsComponent implements OnInit {
  public uploader: Transfer;
  public hasFiles: boolean;

  myControl: FormControl = new FormControl();

  filteredOptions: Observable<string[]>;
  filteredOptions4: Observable<string[]>;

  filter(val: string): string[] {
    return this.options.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  filter4(val: string): string[] {
    return this.prvOptions.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  selectCourse: FormGroup;
  studentForm: FormGroup;

  studentImagePath: String;

  isShowCouseM1: boolean;
  isShowCorseM4: boolean;
  isUploadImage: boolean;

  studentLevel: number;
  studentYear: number;
  rand: number;

  checked = false;
  indeterminate = false;
  align = 'start';
  disabled = false;

  student = {};
  couses = {};

  uploadStudentImage() {
    window.location.href = "http://www.satit.nu.ac.th/UploadStudentImage/index.php?token=" + window.sessionStorage.getItem("token");
  }
  options = [];
  prvOptions = [];

  constructor(private _formBuilder: FormBuilder, private rest: RESTService, private _router: Router, private element: ElementRef, private renderer: Renderer) {
    this._files = [];
    this.rand = Math.random();
    this.studentForm = this._formBuilder.group({
      personal_id: ['', Validators.required],
      birthday: ['', Validators.required],
      birthmonth: ['', Validators.required],
      birthyear: ['', Validators.required],
      prename_th: ['', Validators.required],
      firstname_th: ['', Validators.required],
      lastname_th: ['', Validators.required],
      firstname_en: ['', Validators.required],
      lastname_en: ['', Validators.required],
      plan_code: ['', Validators.required],
      plan_code4: ['', Validators.required],
      ethnicity: ['', Validators.required],
      nationality: ['', Validators.required],
      religion: ['', Validators.required],
      phone_number: ['', Validators.required],
      email: ['', Validators.required],
      address1_a: ['', Validators.required],
      address1_b: ['', Validators.required],
      address1_c: ['', Validators.required],
      address1_d: ['', Validators.required],
      address1_e: ['', Validators.required],
      address1_f: ['', Validators.required],
      address1_g: ['', Validators.required],
      address1_h: ['', Validators.required],
      address1_i: ['', Validators.required],
      address2_a: ['', Validators.required],
      address2_b: ['', Validators.required],
      address2_c: ['', Validators.required],
      address2_d: ['', Validators.required],
      address2_e: ['', Validators.required],
      address2_f: ['', Validators.required],
      address2_g: ['', Validators.required],
      address2_h: ['', Validators.required],
      address2_i: ['', Validators.required],
      father_prename: ['', Validators.required],
      father_firstname: ['', Validators.required],
      father_lastname: ['', Validators.required],
      father_career: ['', Validators.required],
      father_income: ['', Validators.required],
      father_age: ['', Validators.required],
      father_phone: ['', Validators.required],
      mother_prename: ['', Validators.required],
      mother_firstname: ['', Validators.required],
      mother_lastname: ['', Validators.required],
      morther_career: ['', Validators.required],
      mother_income: ['', Validators.required],
      mother_age: ['', Validators.required],
      mother_phone: ['', Validators.required],
      parent_prename: ['', Validators.required],
      parent_firstname: ['', Validators.required],
      parent_lastname: ['', Validators.required],
      parent_career: ['', Validators.required],
      parent_income: ['', Validators.required],
      parent_age: ['', Validators.required],
      parent_phone: ['', Validators.required],
      school_b: ['', Validators.required],
      school_a: ['', Validators.required],
      school_name: ['', Validators.required],
      education_status: ['', Validators.required]
    });
    const preParam = {
      topic: "getAccountData",
      username: window.sessionStorage.getItem("username"),
      token: window.sessionStorage.getItem("token"),
      role: window.sessionStorage.getItem("role")
    };
    // console.log(preParam);
    this.rest.getAccountData(preParam).then(response => {
      // console.log(response);
      this.student = response;
      this.studentLevel = this.student['level'];
      this.studentYear = this.student['year'];
      if (this.student['level'] == 1) {
        this.couseM4 = null;
        this.studyStatusM4 = null;
      } else {
        this.couseM1 = null;
        this.studyStatusM1 = null;
      }

      if (this.student['isupload_image'] == 1) {
        this.isUploadImage = true;
      } else {
        this.isUploadImage = false;
      }

      if (this.student['school_b'] !== "") {
        // console.log("มีจังหวัด")
        console.log(this.student['school_b']);
        this.prvs.forEach(element => {
          if (element.viewValue == this.student['school_b']) {
            console.log("มีอำเภอ");
            this.listApms = [];
            const _prvCode = element.prvCode;
            this.apms.forEach(elements => {
              if (elements.prvCode == _prvCode) {
                this.listApms.push({ value: elements.value, viewValue: elements.viewValue, prvCode: elements.prvCode });
              }
            });
          }
        });
      }

      this.studentImagePath = "http://www.satit.nu.ac.th/AdmissionEngine/files/" + this.student['year'] + "/images/" + this.student['level'] + "/" + this.student['image_name'];
    });
    // Bind FileUploader class to variable
    this.uploader = new FileUploader({
      url: 'http://satit.nu.ac.th/AdmissionEngine/uploadStudentImage.php?token=' + window.sessionStorage.getItem("token"),
      removeBySuccess: false,
      autoUpload: true,
      uniqueFiles: true,
      method: "post",
      // filter implementation possible
    });

    var delayInMilliseconds = 500; //1 second

    setTimeout(function () {

      // alert("โปรดตรวจสอบความถูกต้องของข้อมูลก่อนบันทึกข้อมูล");
      window.document.getElementById("myPlan").focus();

    }, delayInMilliseconds);



  }
  saveData(data) {
    if (this.student['plan_code'] !== undefined) {
      this.student['topic'] = "saveAccountData";
      this.student['role'] = window.sessionStorage.getItem("role");
      this.student['token'] = window.sessionStorage.getItem("token");
      this.student['headers'] = null;
      this.student['username'] = window.sessionStorage.getItem("username");
      this.rest.getAccountData(this.student).then(response => {
        if (response['operation'] === "success") {
          this._router.navigateByUrl("student/dashboard");
        } else {
          alert("มีบางอย่างผิดพลาด ติดต่อนักพัฒนา");
        }
      });
    } else {
      alert("นักเรียนยังไม่ได้เลือกแผนการเรียน กรุณาเลือกแผนการเรียน");
    }
  }

  copyAddress() {
    this.student['address2_a'] = this.student['address1_a'];
    this.student['address2_b'] = this.student['address1_b'];
    this.student['address2_c'] = this.student['address1_c'];
    this.student['address2_d'] = this.student['address1_d'];
    this.student['address2_e'] = this.student['address1_e'];
    this.student['address2_f'] = this.student['address1_f'];
    this.student['address2_g'] = this.student['address1_g'];
    this.student['address2_h'] = this.student['address1_h'];
    this.student['address2_i'] = this.student['address1_i'];
  }

  ngOnInit() {
    const preParam2 = {
      topic: 'getFindSchoolName',
      token: window.sessionStorage.getItem("token"),
      username: window.sessionStorage.getItem("username"),
      role: window.sessionStorage.getItem("role"),
      school_name: this.student['school_name']
    };
    this.rest.RESTPost(preParam2).then(response => {
      for (var k in response) {
        if ((response[k]['school_name'] !== "") && (response[k]['school_name'] !== undefined)) {
          this.options.push(response[k]['school_name']);
        }
      }
    });

    for(var d in this.prvs){
      this.prvOptions.push(this.prvs[d]['viewValue']);
    }

    this.filteredOptions = this.myControl.valueChanges
      .startWith(null)
      .map(val => val ? this.filter(val) : this.options.slice());

      this.filteredOptions4 = this.myControl.valueChanges
      .startWith(null)
      .map(val => val ? this.filter4(val) : this.prvOptions.slice());
      
    if (typeof this.maxFiles !== 'undefined') {
      this._limit = this.maxFiles;
    }

    this.uploader.queue$.subscribe((data: FileManager[]) => {
      this.checkClass();

    });

    this._files$.subscribe((data: FileManager[]) => {
      this.imageLoaded = (data.length > 0);

    });

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.selectCourse = this._formBuilder.group({
      a: ['', Validators.required],
      b: ['', Validators.required]
    });

    var div_load = document.getElementsByClassName("div-load")[0];
    div_load.innerHTML = "Hello";

  }

  prvs = [
    { value: 'กรุงเทพมหานคร', viewValue: 'กรุงเทพมหานคร', prvCode: '1' },
    { value: 'สมุทรปราการ', viewValue: 'สมุทรปราการ', prvCode: '2' },
    { value: 'นนทบุรี', viewValue: 'นนทบุรี', prvCode: '3' },
    { value: 'ปทุมธานี', viewValue: 'ปทุมธานี', prvCode: '4' },
    { value: 'พระนครศรีอยุธยา', viewValue: 'พระนครศรีอยุธยา', prvCode: '5' },
    { value: 'อ่างทอง', viewValue: 'อ่างทอง', prvCode: '6' },
    { value: 'ลพบุรี', viewValue: 'ลพบุรี', prvCode: '7' },
    { value: 'สิงห์บุรี', viewValue: 'สิงห์บุรี', prvCode: '8' },
    { value: 'ชัยนาท', viewValue: 'ชัยนาท', prvCode: '9' },
    { value: 'สระบุรี', viewValue: 'สระบุรี', prvCode: '10' },
    { value: 'ชลบุรี', viewValue: 'ชลบุรี', prvCode: '11' },
    { value: 'ระยอง', viewValue: 'ระยอง', prvCode: '12' },
    { value: 'จันทบุรี', viewValue: 'จันทบุรี', prvCode: '13' },
    { value: 'ตราด', viewValue: 'ตราด', prvCode: '14' },
    { value: 'ฉะเชิงเทรา', viewValue: 'ฉะเชิงเทรา', prvCode: '15' },
    { value: 'ปราจีนบุรี', viewValue: 'ปราจีนบุรี', prvCode: '16' },
    { value: 'นครนายก', viewValue: 'นครนายก', prvCode: '17' },
    { value: 'สระแก้ว', viewValue: 'สระแก้ว', prvCode: '18' },
    { value: 'นครราชสีมา', viewValue: 'นครราชสีมา', prvCode: '19' },
    { value: 'บุรีรัมย์', viewValue: 'บุรีรัมย์', prvCode: '20' },
    { value: 'สุรินทร์', viewValue: 'สุรินทร์', prvCode: '21' },
    { value: 'ศรีสะเกษ', viewValue: 'ศรีสะเกษ', prvCode: '22' },
    { value: 'อุบลราชธานี', viewValue: 'อุบลราชธานี', prvCode: '23' },
    { value: 'ยโสธร', viewValue: 'ยโสธร', prvCode: '24' },
    { value: 'ชัยภูมิ', viewValue: 'ชัยภูมิ', prvCode: '25' },
    { value: 'อำนาจเจริญ', viewValue: 'อำนาจเจริญ', prvCode: '26' },
    { value: 'หนองบัวลำภู', viewValue: 'หนองบัวลำภู', prvCode: '27' },
    { value: 'ขอนแก่น', viewValue: 'ขอนแก่น', prvCode: '28' },
    { value: 'อุดรธานี', viewValue: 'อุดรธานี', prvCode: '29' },
    { value: 'เลย', viewValue: 'เลย', prvCode: '30' },
    { value: 'หนองคาย', viewValue: 'หนองคาย', prvCode: '31' },
    { value: 'มหาสารคาม', viewValue: 'มหาสารคาม', prvCode: '32' },
    { value: 'ร้อยเอ็ด', viewValue: 'ร้อยเอ็ด', prvCode: '33' },
    { value: 'กาฬสินธุ์', viewValue: 'กาฬสินธุ์', prvCode: '34' },
    { value: 'สกลนคร', viewValue: 'สกลนคร', prvCode: '35' },
    { value: 'นครพนม', viewValue: 'นครพนม', prvCode: '36' },
    { value: 'มุกดาหาร', viewValue: 'มุกดาหาร', prvCode: '37' },
    { value: 'เชียงใหม่', viewValue: 'เชียงใหม่', prvCode: '38' },
    { value: 'ลำพูน', viewValue: 'ลำพูน', prvCode: '39' },
    { value: 'ลำปาง', viewValue: 'ลำปาง', prvCode: '40' },
    { value: 'อุตรดิตถ์', viewValue: 'อุตรดิตถ์', prvCode: '41' },
    { value: 'แพร่', viewValue: 'แพร่', prvCode: '42' },
    { value: 'น่าน', viewValue: 'น่าน', prvCode: '43' },
    { value: 'พะเยา', viewValue: 'พะเยา', prvCode: '44' },
    { value: 'เชียงราย', viewValue: 'เชียงราย', prvCode: '45' },
    { value: 'แม่ฮ่องสอน', viewValue: 'แม่ฮ่องสอน', prvCode: '46' },
    { value: 'นครสวรรค์', viewValue: 'นครสวรรค์', prvCode: '47' },
    { value: 'อุทัยธานี', viewValue: 'อุทัยธานี', prvCode: '48' },
    { value: 'กำแพงเพชร', viewValue: 'กำแพงเพชร', prvCode: '49' },
    { value: 'ตาก', viewValue: 'ตาก', prvCode: '50' },
    { value: 'สุโขทัย', viewValue: 'สุโขทัย', prvCode: '51' },
    { value: 'พิษณุโลก', viewValue: 'พิษณุโลก', prvCode: '52' },
    { value: 'พิจิตร', viewValue: 'พิจิตร', prvCode: '53' },
    { value: 'เพชรบูรณ์', viewValue: 'เพชรบูรณ์', prvCode: '54' },
    { value: 'ราชบุรี', viewValue: 'ราชบุรี', prvCode: '55' },
    { value: 'กาญจนบุรี', viewValue: 'กาญจนบุรี', prvCode: '56' },
    { value: 'สุพรรณบุรี', viewValue: 'สุพรรณบุรี', prvCode: '57' },
    { value: 'นครปฐม', viewValue: 'นครปฐม', prvCode: '58' },
    { value: 'สมุทรสาคร', viewValue: 'สมุทรสาคร', prvCode: '59' },
    { value: 'สมุทรสงคราม', viewValue: 'สมุทรสงคราม', prvCode: '60' },
    { value: 'เพชรบุรี', viewValue: 'เพชรบุรี', prvCode: '61' },
    { value: 'ประจวบคีรีขันธ์', viewValue: 'ประจวบคีรีขันธ์', prvCode: '62' },
    { value: 'นครศรีธรรมราช', viewValue: 'นครศรีธรรมราช', prvCode: '63' },
    { value: 'กระบี่', viewValue: 'กระบี่', prvCode: '64' },
    { value: 'พังงา', viewValue: 'พังงา', prvCode: '65' },
    { value: 'ภูเก็ต', viewValue: 'ภูเก็ต', prvCode: '66' },
    { value: 'สุราษฎร์ธานี', viewValue: 'สุราษฎร์ธานี', prvCode: '67' },
    { value: 'ระนอง', viewValue: 'ระนอง', prvCode: '68' },
    { value: 'ชุมพร', viewValue: 'ชุมพร', prvCode: '69' },
    { value: 'สงขลา', viewValue: 'สงขลา', prvCode: '70' },
    { value: 'สตูล', viewValue: 'สตูล', prvCode: '71' },
    { value: 'ตรัง', viewValue: 'ตรัง', prvCode: '72' },
    { value: 'พัทลุง', viewValue: 'พัทลุง', prvCode: '73' },
    { value: 'ปัตตานี', viewValue: 'ปัตตานี', prvCode: '74' },
    { value: 'ยะลา', viewValue: 'ยะลา', prvCode: '75' },
    { value: 'นราธิวาส', viewValue: 'นราธิวาส', prvCode: '76' },
    { value: 'บึงกาฬ', viewValue: 'บึงกาฬ', prvCode: '77' }
  ];

  setApms(_prvCode) {
    console.log(_prvCode);
    this.listApms = [];
    this.apms.forEach(element => {
      if (element.prvCode == _prvCode) {
        this.listApms.push({ value: element.value, viewValue: element.viewValue, prvCode: element.prvCode });
      }
    });
  }

  listApms = [];
  apms = [
    { value: 'เขตพระนคร', viewValue: 'เขตพระนคร', prvCode: '1' },
    { value: 'เขตดุสิต', viewValue: 'เขตดุสิต', prvCode: '1' },
    { value: 'เขตหนองจอก', viewValue: 'เขตหนองจอก', prvCode: '1' },
    { value: 'เขตบางรัก', viewValue: 'เขตบางรัก', prvCode: '1' },
    { value: 'เขตบางเขน', viewValue: 'เขตบางเขน', prvCode: '1' },
    { value: 'เขตบางกะปิ', viewValue: 'เขตบางกะปิ', prvCode: '1' },
    { value: 'เขตปทุมวัน', viewValue: 'เขตปทุมวัน', prvCode: '1' },
    { value: 'เขตป้อมปราบศัตรูพ่าย', viewValue: 'เขตป้อมปราบศัตรูพ่าย', prvCode: '1' },
    { value: 'เขตพระโขนง', viewValue: 'เขตพระโขนง', prvCode: '1' },
    { value: 'เขตมีนบุรี', viewValue: 'เขตมีนบุรี', prvCode: '1' },
    { value: 'เขตลาดกระบัง', viewValue: 'เขตลาดกระบัง', prvCode: '1' },
    { value: 'เขตยานนาวา', viewValue: 'เขตยานนาวา', prvCode: '1' },
    { value: 'เขตสัมพันธวงศ์', viewValue: 'เขตสัมพันธวงศ์', prvCode: '1' },
    { value: 'เขตพญาไท', viewValue: 'เขตพญาไท', prvCode: '1' },
    { value: 'เขตธนบุรี', viewValue: 'เขตธนบุรี', prvCode: '1' },
    { value: 'เขตบางกอกใหญ่', viewValue: 'เขตบางกอกใหญ่', prvCode: '1' },
    { value: 'เขตห้วยขวาง', viewValue: 'เขตห้วยขวาง', prvCode: '1' },
    { value: 'เขตคลองสาน', viewValue: 'เขตคลองสาน', prvCode: '1' },
    { value: 'เขตตลิ่งชัน', viewValue: 'เขตตลิ่งชัน', prvCode: '1' },
    { value: 'เขตบางกอกน้อย', viewValue: 'เขตบางกอกน้อย', prvCode: '1' },
    { value: 'เขตบางขุนเทียน', viewValue: 'เขตบางขุนเทียน', prvCode: '1' },
    { value: 'เขตภาษีเจริญ', viewValue: 'เขตภาษีเจริญ', prvCode: '1' },
    { value: 'เขตหนองแขม', viewValue: 'เขตหนองแขม', prvCode: '1' },
    { value: 'เขตราษฎร์บูรณะ', viewValue: 'เขตราษฎร์บูรณะ', prvCode: '1' },
    { value: 'เขตบางพลัด', viewValue: 'เขตบางพลัด', prvCode: '1' },
    { value: 'เขตดินแดง', viewValue: 'เขตดินแดง', prvCode: '1' },
    { value: 'เขตบึงกุ่ม', viewValue: 'เขตบึงกุ่ม', prvCode: '1' },
    { value: 'เขตสาทร', viewValue: 'เขตสาทร', prvCode: '1' },
    { value: 'เขตบางซื่อ', viewValue: 'เขตบางซื่อ', prvCode: '1' },
    { value: 'เขตจตุจักร', viewValue: 'เขตจตุจักร', prvCode: '1' },
    { value: 'เขตบางคอแหลม', viewValue: 'เขตบางคอแหลม', prvCode: '1' },
    { value: 'เขตประเวศ', viewValue: 'เขตประเวศ', prvCode: '1' },
    { value: 'เขตคลองเตย', viewValue: 'เขตคลองเตย', prvCode: '1' },
    { value: 'เขตสวนหลวง', viewValue: 'เขตสวนหลวง', prvCode: '1' },
    { value: 'เขตจอมทอง', viewValue: 'เขตจอมทอง', prvCode: '1' },
    { value: 'เขตดอนเมือง', viewValue: 'เขตดอนเมือง', prvCode: '1' },
    { value: 'เขตราชเทวี', viewValue: 'เขตราชเทวี', prvCode: '1' },
    { value: 'เขตลาดพร้าว', viewValue: 'เขตลาดพร้าว', prvCode: '1' },
    { value: 'เขตวัฒนา', viewValue: 'เขตวัฒนา', prvCode: '1' },
    { value: 'เขตบางแค', viewValue: 'เขตบางแค', prvCode: '1' },
    { value: 'เขตหลักสี่', viewValue: 'เขตหลักสี่', prvCode: '1' },
    { value: 'เขตสายไหม', viewValue: 'เขตสายไหม', prvCode: '1' },
    { value: 'เขตคันนายาว', viewValue: 'เขตคันนายาว', prvCode: '1' },
    { value: 'เขตสะพานสูง', viewValue: 'เขตสะพานสูง', prvCode: '1' },
    { value: 'เขตวังทองหลาง', viewValue: 'เขตวังทองหลาง', prvCode: '1' },
    { value: 'เขตคลองสามวา', viewValue: 'เขตคลองสามวา', prvCode: '1' },
    { value: 'เขตบางนา', viewValue: 'เขตบางนา', prvCode: '1' },
    { value: 'เขตทวีวัฒนา', viewValue: 'เขตทวีวัฒนา', prvCode: '1' },
    { value: 'เขตทุ่งครุ', viewValue: 'เขตทุ่งครุ', prvCode: '1' },
    { value: 'เขตบางบอน', viewValue: 'เขตบางบอน', prvCode: '1' },
    { value: '*บ้านทะวาย', viewValue: '*บ้านทะวาย', prvCode: '1' },
    { value: 'เมืองสมุทรปราการ', viewValue: 'เมืองสมุทรปราการ', prvCode: '2' },
    { value: 'บางบ่อ', viewValue: 'บางบ่อ', prvCode: '2' },
    { value: 'บางพลี', viewValue: 'บางพลี', prvCode: '2' },
    { value: 'พระประแดง', viewValue: 'พระประแดง', prvCode: '2' },
    { value: 'พระสมุทรเจดีย์', viewValue: 'พระสมุทรเจดีย์', prvCode: '2' },
    { value: 'บางเสาธง', viewValue: 'บางเสาธง', prvCode: '2' },
    { value: 'เมืองนนทบุรี', viewValue: 'เมืองนนทบุรี', prvCode: '3' },
    { value: 'บางกรวย', viewValue: 'บางกรวย', prvCode: '3' },
    { value: 'บางใหญ่', viewValue: 'บางใหญ่', prvCode: '3' },
    { value: 'บางบัวทอง', viewValue: 'บางบัวทอง', prvCode: '3' },
    { value: 'ไทรน้อย', viewValue: 'ไทรน้อย', prvCode: '3' },
    { value: 'ปากเกร็ด', viewValue: 'ปากเกร็ด', prvCode: '3' },
    { value: 'เทศบาลนครนนทบุรี (สาขาแขวงท่าทราย)*', viewValue: 'เทศบาลนครนนทบุรี (สาขาแขวงท่าทราย)*', prvCode: '3' },
    { value: 'เทศบาลเมืองปากเกร็ด*', viewValue: 'เทศบาลเมืองปากเกร็ด*', prvCode: '3' },
    { value: 'เมืองปทุมธานี', viewValue: 'เมืองปทุมธานี', prvCode: '4' },
    { value: 'คลองหลวง', viewValue: 'คลองหลวง', prvCode: '4' },
    { value: 'ธัญบุรี', viewValue: 'ธัญบุรี', prvCode: '4' },
    { value: 'หนองเสือ', viewValue: 'หนองเสือ', prvCode: '4' },
    { value: 'ลาดหลุมแก้ว', viewValue: 'ลาดหลุมแก้ว', prvCode: '4' },
    { value: 'ลำลูกกา', viewValue: 'ลำลูกกา', prvCode: '4' },
    { value: 'สามโคก', viewValue: 'สามโคก', prvCode: '4' },
    { value: 'ลำลูกกา (สาขาตำบลคูคต)*', viewValue: 'ลำลูกกา (สาขาตำบลคูคต)*', prvCode: '4' },
    { value: 'พระนครศรีอยุธยา', viewValue: 'พระนครศรีอยุธยา', prvCode: '5' },
    { value: 'ท่าเรือ', viewValue: 'ท่าเรือ', prvCode: '5' },
    { value: 'นครหลวง', viewValue: 'นครหลวง', prvCode: '5' },
    { value: 'บางไทร', viewValue: 'บางไทร', prvCode: '5' },
    { value: 'บางบาล', viewValue: 'บางบาล', prvCode: '5' },
    { value: 'บางปะอิน', viewValue: 'บางปะอิน', prvCode: '5' },
    { value: 'บางปะหัน', viewValue: 'บางปะหัน', prvCode: '5' },
    { value: 'ผักไห่', viewValue: 'ผักไห่', prvCode: '5' },
    { value: 'ภาชี', viewValue: 'ภาชี', prvCode: '5' },
    { value: 'ลาดบัวหลวง', viewValue: 'ลาดบัวหลวง', prvCode: '5' },
    { value: 'วังน้อย', viewValue: 'วังน้อย', prvCode: '5' },
    { value: 'เสนา', viewValue: 'เสนา', prvCode: '5' },
    { value: 'บางซ้าย', viewValue: 'บางซ้าย', prvCode: '5' },
    { value: 'อุทัย', viewValue: 'อุทัย', prvCode: '5' },
    { value: 'มหาราช', viewValue: 'มหาราช', prvCode: '5' },
    { value: 'บ้านแพรก', viewValue: 'บ้านแพรก', prvCode: '5' },
    { value: 'เมืองอ่างทอง', viewValue: 'เมืองอ่างทอง', prvCode: '6' },
    { value: 'ไชโย', viewValue: 'ไชโย', prvCode: '6' },
    { value: 'ป่าโมก', viewValue: 'ป่าโมก', prvCode: '6' },
    { value: 'โพธิ์ทอง', viewValue: 'โพธิ์ทอง', prvCode: '6' },
    { value: 'แสวงหา', viewValue: 'แสวงหา', prvCode: '6' },
    { value: 'วิเศษชัยชาญ', viewValue: 'วิเศษชัยชาญ', prvCode: '6' },
    { value: 'สามโก้', viewValue: 'สามโก้', prvCode: '6' },
    { value: 'เมืองลพบุรี', viewValue: 'เมืองลพบุรี', prvCode: '7' },
    { value: 'พัฒนานิคม', viewValue: 'พัฒนานิคม', prvCode: '7' },
    { value: 'โคกสำโรง', viewValue: 'โคกสำโรง', prvCode: '7' },
    { value: 'ชัยบาดาล', viewValue: 'ชัยบาดาล', prvCode: '7' },
    { value: 'ท่าวุ้ง', viewValue: 'ท่าวุ้ง', prvCode: '7' },
    { value: 'บ้านหมี่', viewValue: 'บ้านหมี่', prvCode: '7' },
    { value: 'ท่าหลวง', viewValue: 'ท่าหลวง', prvCode: '7' },
    { value: 'สระโบสถ์', viewValue: 'สระโบสถ์', prvCode: '7' },
    { value: 'โคกเจริญ', viewValue: 'โคกเจริญ', prvCode: '7' },
    { value: 'ลำสนธิ', viewValue: 'ลำสนธิ', prvCode: '7' },
    { value: 'หนองม่วง', viewValue: 'หนองม่วง', prvCode: '7' },
    { value: '*อ.บ้านเช่า จ.ลพบุรี', viewValue: '*อ.บ้านเช่า จ.ลพบุรี', prvCode: '7' },
    { value: 'เมืองสิงห์บุรี', viewValue: 'เมืองสิงห์บุรี', prvCode: '8' },
    { value: 'บางระจัน', viewValue: 'บางระจัน', prvCode: '8' },
    { value: 'ค่ายบางระจัน', viewValue: 'ค่ายบางระจัน', prvCode: '8' },
    { value: 'พรหมบุรี', viewValue: 'พรหมบุรี', prvCode: '8' },
    { value: 'ท่าช้าง', viewValue: 'ท่าช้าง', prvCode: '8' },
    { value: 'อินทร์บุรี', viewValue: 'อินทร์บุรี', prvCode: '8' },
    { value: 'เมืองชัยนาท', viewValue: 'เมืองชัยนาท', prvCode: '9' },
    { value: 'มโนรมย์', viewValue: 'มโนรมย์', prvCode: '9' },
    { value: 'วัดสิงห์', viewValue: 'วัดสิงห์', prvCode: '9' },
    { value: 'สรรพยา', viewValue: 'สรรพยา', prvCode: '9' },
    { value: 'สรรคบุรี', viewValue: 'สรรคบุรี', prvCode: '9' },
    { value: 'หันคา', viewValue: 'หันคา', prvCode: '9' },
    { value: 'หนองมะโมง', viewValue: 'หนองมะโมง', prvCode: '9' },
    { value: 'เนินขาม', viewValue: 'เนินขาม', prvCode: '9' },
    { value: 'เมืองสระบุรี', viewValue: 'เมืองสระบุรี', prvCode: '10' },
    { value: 'แก่งคอย', viewValue: 'แก่งคอย', prvCode: '10' },
    { value: 'หนองแค', viewValue: 'หนองแค', prvCode: '10' },
    { value: 'วิหารแดง', viewValue: 'วิหารแดง', prvCode: '10' },
    { value: 'หนองแซง', viewValue: 'หนองแซง', prvCode: '10' },
    { value: 'บ้านหมอ', viewValue: 'บ้านหมอ', prvCode: '10' },
    { value: 'ดอนพุด', viewValue: 'ดอนพุด', prvCode: '10' },
    { value: 'หนองโดน', viewValue: 'หนองโดน', prvCode: '10' },
    { value: 'พระพุทธบาท', viewValue: 'พระพุทธบาท', prvCode: '10' },
    { value: 'เสาไห้', viewValue: 'เสาไห้', prvCode: '10' },
    { value: 'มวกเหล็ก', viewValue: 'มวกเหล็ก', prvCode: '10' },
    { value: 'วังม่วง', viewValue: 'วังม่วง', prvCode: '10' },
    { value: 'เฉลิมพระเกียรติ', viewValue: 'เฉลิมพระเกียรติ', prvCode: '10' },
    { value: 'เมืองชลบุรี', viewValue: 'เมืองชลบุรี', prvCode: '11' },
    { value: 'บ้านบึง', viewValue: 'บ้านบึง', prvCode: '11' },
    { value: 'หนองใหญ่', viewValue: 'หนองใหญ่', prvCode: '11' },
    { value: 'บางละมุง', viewValue: 'บางละมุง', prvCode: '11' },
    { value: 'พานทอง', viewValue: 'พานทอง', prvCode: '11' },
    { value: 'พนัสนิคม', viewValue: 'พนัสนิคม', prvCode: '11' },
    { value: 'ศรีราชา', viewValue: 'ศรีราชา', prvCode: '11' },
    { value: 'เกาะสีชัง', viewValue: 'เกาะสีชัง', prvCode: '11' },
    { value: 'สัตหีบ', viewValue: 'สัตหีบ', prvCode: '11' },
    { value: 'บ่อทอง', viewValue: 'บ่อทอง', prvCode: '11' },
    { value: 'เกาะจันทร์', viewValue: 'เกาะจันทร์', prvCode: '11' },
    { value: 'สัตหีบ (สาขาตำบลบางเสร่)*', viewValue: 'สัตหีบ (สาขาตำบลบางเสร่)*', prvCode: '11' },
    { value: 'ท้องถิ่นเทศบาลเมืองหนองปรือ*', viewValue: 'ท้องถิ่นเทศบาลเมืองหนองปรือ*', prvCode: '11' },
    { value: 'เทศบาลตำบลแหลมฉบัง*', viewValue: 'เทศบาลตำบลแหลมฉบัง*', prvCode: '11' },
    { value: 'เทศบาลเมืองชลบุรี*', viewValue: 'เทศบาลเมืองชลบุรี*', prvCode: '11' },
    { value: 'เมืองระยอง', viewValue: 'เมืองระยอง', prvCode: '12' },
    { value: 'บ้านฉาง', viewValue: 'บ้านฉาง', prvCode: '12' },
    { value: 'แกลง', viewValue: 'แกลง', prvCode: '12' },
    { value: 'วังจันทร์', viewValue: 'วังจันทร์', prvCode: '12' },
    { value: 'บ้านค่าย', viewValue: 'บ้านค่าย', prvCode: '12' },
    { value: 'ปลวกแดง', viewValue: 'ปลวกแดง', prvCode: '12' },
    { value: 'เขาชะเมา', viewValue: 'เขาชะเมา', prvCode: '12' },
    { value: 'นิคมพัฒนา', viewValue: 'นิคมพัฒนา', prvCode: '12' },
    { value: 'สาขาตำบลมาบข่า*', viewValue: 'สาขาตำบลมาบข่า*', prvCode: '12' },
    { value: 'เมืองจันทบุรี', viewValue: 'เมืองจันทบุรี', prvCode: '13' },
    { value: 'ขลุง', viewValue: 'ขลุง', prvCode: '13' },
    { value: 'ท่าใหม่', viewValue: 'ท่าใหม่', prvCode: '13' },
    { value: 'โป่งน้ำร้อน', viewValue: 'โป่งน้ำร้อน', prvCode: '13' },
    { value: 'มะขาม', viewValue: 'มะขาม', prvCode: '13' },
    { value: 'แหลมสิงห์', viewValue: 'แหลมสิงห์', prvCode: '13' },
    { value: 'สอยดาว', viewValue: 'สอยดาว', prvCode: '13' },
    { value: 'แก่งหางแมว', viewValue: 'แก่งหางแมว', prvCode: '13' },
    { value: 'นายายอาม', viewValue: 'นายายอาม', prvCode: '13' },
    { value: 'เขาคิชฌกูฏ', viewValue: 'เขาคิชฌกูฏ', prvCode: '13' },
    { value: '*กิ่ง อ.กำพุธ จ.จันทบุรี', viewValue: '*กิ่ง อ.กำพุธ จ.จันทบุรี', prvCode: '13' },
    { value: 'เมืองตราด', viewValue: 'เมืองตราด', prvCode: '14' },
    { value: 'คลองใหญ่', viewValue: 'คลองใหญ่', prvCode: '14' },
    { value: 'เขาสมิง', viewValue: 'เขาสมิง', prvCode: '14' },
    { value: 'บ่อไร่', viewValue: 'บ่อไร่', prvCode: '14' },
    { value: 'แหลมงอบ', viewValue: 'แหลมงอบ', prvCode: '14' },
    { value: 'เกาะกูด', viewValue: 'เกาะกูด', prvCode: '14' },
    { value: 'เกาะช้าง', viewValue: 'เกาะช้าง', prvCode: '14' },
    { value: 'เมืองฉะเชิงเทรา', viewValue: 'เมืองฉะเชิงเทรา', prvCode: '15' },
    { value: 'บางคล้า', viewValue: 'บางคล้า', prvCode: '15' },
    { value: 'บางน้ำเปรี้ยว', viewValue: 'บางน้ำเปรี้ยว', prvCode: '15' },
    { value: 'บางปะกง', viewValue: 'บางปะกง', prvCode: '15' },
    { value: 'บ้านโพธิ์', viewValue: 'บ้านโพธิ์', prvCode: '15' },
    { value: 'พนมสารคาม', viewValue: 'พนมสารคาม', prvCode: '15' },
    { value: 'ราชสาส์น', viewValue: 'ราชสาส์น', prvCode: '15' },
    { value: 'สนามชัยเขต', viewValue: 'สนามชัยเขต', prvCode: '15' },
    { value: 'แปลงยาว', viewValue: 'แปลงยาว', prvCode: '15' },
    { value: 'ท่าตะเกียบ', viewValue: 'ท่าตะเกียบ', prvCode: '15' },
    { value: 'คลองเขื่อน', viewValue: 'คลองเขื่อน', prvCode: '15' },
    { value: 'เมืองปราจีนบุรี', viewValue: 'เมืองปราจีนบุรี', prvCode: '16' },
    { value: 'กบินทร์บุรี', viewValue: 'กบินทร์บุรี', prvCode: '16' },
    { value: 'นาดี', viewValue: 'นาดี', prvCode: '16' },
    { value: '*สระแก้ว', viewValue: '*สระแก้ว', prvCode: '16' },
    { value: '*วังน้ำเย็น', viewValue: '*วังน้ำเย็น', prvCode: '16' },
    { value: 'บ้านสร้าง', viewValue: 'บ้านสร้าง', prvCode: '16' },
    { value: 'ประจันตคาม', viewValue: 'ประจันตคาม', prvCode: '16' },
    { value: 'ศรีมหาโพธิ', viewValue: 'ศรีมหาโพธิ', prvCode: '16' },
    { value: 'ศรีมโหสถ', viewValue: 'ศรีมโหสถ', prvCode: '16' },
    { value: '*อรัญประเทศ', viewValue: '*อรัญประเทศ', prvCode: '16' },
    { value: '*ตาพระยา', viewValue: '*ตาพระยา', prvCode: '16' },
    { value: '*วัฒนานคร', viewValue: '*วัฒนานคร', prvCode: '16' },
    { value: '*คลองหาด', viewValue: '*คลองหาด', prvCode: '16' },
    { value: 'เมืองนครนายก', viewValue: 'เมืองนครนายก', prvCode: '17' },
    { value: 'ปากพลี', viewValue: 'ปากพลี', prvCode: '17' },
    { value: 'บ้านนา', viewValue: 'บ้านนา', prvCode: '17' },
    { value: 'องครักษ์', viewValue: 'องครักษ์', prvCode: '17' },
    { value: 'เมืองสระแก้ว', viewValue: 'เมืองสระแก้ว', prvCode: '18' },
    { value: 'คลองหาด', viewValue: 'คลองหาด', prvCode: '18' },
    { value: 'ตาพระยา', viewValue: 'ตาพระยา', prvCode: '18' },
    { value: 'วังน้ำเย็น', viewValue: 'วังน้ำเย็น', prvCode: '18' },
    { value: 'วัฒนานคร', viewValue: 'วัฒนานคร', prvCode: '18' },
    { value: 'อรัญประเทศ', viewValue: 'อรัญประเทศ', prvCode: '18' },
    { value: 'เขาฉกรรจ์', viewValue: 'เขาฉกรรจ์', prvCode: '18' },
    { value: 'โคกสูง', viewValue: 'โคกสูง', prvCode: '18' },
    { value: 'วังสมบูรณ์', viewValue: 'วังสมบูรณ์', prvCode: '18' },
    { value: 'เมืองนครราชสีมา', viewValue: 'เมืองนครราชสีมา', prvCode: '19' },
    { value: 'ครบุรี', viewValue: 'ครบุรี', prvCode: '19' },
    { value: 'เสิงสาง', viewValue: 'เสิงสาง', prvCode: '19' },
    { value: 'คง', viewValue: 'คง', prvCode: '19' },
    { value: 'บ้านเหลื่อม', viewValue: 'บ้านเหลื่อม', prvCode: '19' },
    { value: 'จักราช', viewValue: 'จักราช', prvCode: '19' },
    { value: 'โชคชัย', viewValue: 'โชคชัย', prvCode: '19' },
    { value: 'ด่านขุนทด', viewValue: 'ด่านขุนทด', prvCode: '19' },
    { value: 'โนนไทย', viewValue: 'โนนไทย', prvCode: '19' },
    { value: 'โนนสูง', viewValue: 'โนนสูง', prvCode: '19' },
    { value: 'ขามสะแกแสง', viewValue: 'ขามสะแกแสง', prvCode: '19' },
    { value: 'บัวใหญ่', viewValue: 'บัวใหญ่', prvCode: '19' },
    { value: 'ประทาย', viewValue: 'ประทาย', prvCode: '19' },
    { value: 'ปักธงชัย', viewValue: 'ปักธงชัย', prvCode: '19' },
    { value: 'พิมาย', viewValue: 'พิมาย', prvCode: '19' },
    { value: 'ห้วยแถลง', viewValue: 'ห้วยแถลง', prvCode: '19' },
    { value: 'ชุมพวง', viewValue: 'ชุมพวง', prvCode: '19' },
    { value: 'สูงเนิน', viewValue: 'สูงเนิน', prvCode: '19' },
    { value: 'ขามทะเลสอ', viewValue: 'ขามทะเลสอ', prvCode: '19' },
    { value: 'สีคิ้ว', viewValue: 'สีคิ้ว', prvCode: '19' },
    { value: 'ปากช่อง', viewValue: 'ปากช่อง', prvCode: '19' },
    { value: 'หนองบุญมาก', viewValue: 'หนองบุญมาก', prvCode: '19' },
    { value: 'แก้งสนามนาง', viewValue: 'แก้งสนามนาง', prvCode: '19' },
    { value: 'โนนแดง', viewValue: 'โนนแดง', prvCode: '19' },
    { value: 'วังน้ำเขียว', viewValue: 'วังน้ำเขียว', prvCode: '19' },
    { value: 'เทพารักษ์', viewValue: 'เทพารักษ์', prvCode: '19' },
    { value: 'เมืองยาง', viewValue: 'เมืองยาง', prvCode: '19' },
    { value: 'พระทองคำ', viewValue: 'พระทองคำ', prvCode: '19' },
    { value: 'ลำทะเมนชัย', viewValue: 'ลำทะเมนชัย', prvCode: '19' },
    { value: 'บัวลาย', viewValue: 'บัวลาย', prvCode: '19' },
    { value: 'สีดา', viewValue: 'สีดา', prvCode: '19' },
    { value: 'เฉลิมพระเกียรติ', viewValue: 'เฉลิมพระเกียรติ', prvCode: '19' },
    { value: 'ท้องถิ่นเทศบาลตำบลโพธิ์กลาง*', viewValue: 'ท้องถิ่นเทศบาลตำบลโพธิ์กลาง*', prvCode: '19' },
    { value: 'สาขาตำบลมะค่า-พลสงคราม*', viewValue: 'สาขาตำบลมะค่า-พลสงคราม*', prvCode: '19' },
    { value: '*โนนลาว', viewValue: '*โนนลาว', prvCode: '19' },
    { value: 'เมืองบุรีรัมย์', viewValue: 'เมืองบุรีรัมย์', prvCode: '20' },
    { value: 'คูเมือง', viewValue: 'คูเมือง', prvCode: '20' },
    { value: 'กระสัง', viewValue: 'กระสัง', prvCode: '20' },
    { value: 'นางรอง', viewValue: 'นางรอง', prvCode: '20' },
    { value: 'หนองกี่', viewValue: 'หนองกี่', prvCode: '20' },
    { value: 'ละหานทราย', viewValue: 'ละหานทราย', prvCode: '20' },
    { value: 'ประโคนชัย', viewValue: 'ประโคนชัย', prvCode: '20' },
    { value: 'บ้านกรวด', viewValue: 'บ้านกรวด', prvCode: '20' },
    { value: 'พุทไธสง', viewValue: 'พุทไธสง', prvCode: '20' },
    { value: 'ลำปลายมาศ', viewValue: 'ลำปลายมาศ', prvCode: '20' },
    { value: 'สตึก', viewValue: 'สตึก', prvCode: '20' },
    { value: 'ปะคำ', viewValue: 'ปะคำ', prvCode: '20' },
    { value: 'นาโพธิ์', viewValue: 'นาโพธิ์', prvCode: '20' },
    { value: 'หนองหงส์', viewValue: 'หนองหงส์', prvCode: '20' },
    { value: 'พลับพลาชัย', viewValue: 'พลับพลาชัย', prvCode: '20' },
    { value: 'ห้วยราช', viewValue: 'ห้วยราช', prvCode: '20' },
    { value: 'โนนสุวรรณ', viewValue: 'โนนสุวรรณ', prvCode: '20' },
    { value: 'ชำนิ', viewValue: 'ชำนิ', prvCode: '20' },
    { value: 'บ้านใหม่ไชยพจน์', viewValue: 'บ้านใหม่ไชยพจน์', prvCode: '20' },
    { value: 'โนนดินแดง', viewValue: 'โนนดินแดง', prvCode: '20' },
    { value: 'บ้านด่าน', viewValue: 'บ้านด่าน', prvCode: '20' },
    { value: 'แคนดง', viewValue: 'แคนดง', prvCode: '20' },
    { value: 'เฉลิมพระเกียรติ', viewValue: 'เฉลิมพระเกียรติ', prvCode: '20' },
    { value: 'เมืองสุรินทร์', viewValue: 'เมืองสุรินทร์', prvCode: '21' },
    { value: 'ชุมพลบุรี', viewValue: 'ชุมพลบุรี', prvCode: '21' },
    { value: 'ท่าตูม', viewValue: 'ท่าตูม', prvCode: '21' },
    { value: 'จอมพระ', viewValue: 'จอมพระ', prvCode: '21' },
    { value: 'ปราสาท', viewValue: 'ปราสาท', prvCode: '21' },
    { value: 'กาบเชิง', viewValue: 'กาบเชิง', prvCode: '21' },
    { value: 'รัตนบุรี', viewValue: 'รัตนบุรี', prvCode: '21' },
    { value: 'สนม', viewValue: 'สนม', prvCode: '21' },
    { value: 'ศีขรภูมิ', viewValue: 'ศีขรภูมิ', prvCode: '21' },
    { value: 'สังขะ', viewValue: 'สังขะ', prvCode: '21' },
    { value: 'ลำดวน', viewValue: 'ลำดวน', prvCode: '21' },
    { value: 'สำโรงทาบ', viewValue: 'สำโรงทาบ', prvCode: '21' },
    { value: 'บัวเชด', viewValue: 'บัวเชด', prvCode: '21' },
    { value: 'พนมดงรัก', viewValue: 'พนมดงรัก', prvCode: '21' },
    { value: 'ศรีณรงค์', viewValue: 'ศรีณรงค์', prvCode: '21' },
    { value: 'เขวาสินรินทร์', viewValue: 'เขวาสินรินทร์', prvCode: '21' },
    { value: 'โนนนารายณ์', viewValue: 'โนนนารายณ์', prvCode: '21' },
    { value: 'เมืองศรีสะเกษ', viewValue: 'เมืองศรีสะเกษ', prvCode: '22' },
    { value: 'ยางชุมน้อย', viewValue: 'ยางชุมน้อย', prvCode: '22' },
    { value: 'กันทรารมย์', viewValue: 'กันทรารมย์', prvCode: '22' },
    { value: 'กันทรลักษ์', viewValue: 'กันทรลักษ์', prvCode: '22' },
    { value: 'ขุขันธ์', viewValue: 'ขุขันธ์', prvCode: '22' },
    { value: 'ไพรบึง', viewValue: 'ไพรบึง', prvCode: '22' },
    { value: 'ปรางค์กู่', viewValue: 'ปรางค์กู่', prvCode: '22' },
    { value: 'ขุนหาญ', viewValue: 'ขุนหาญ', prvCode: '22' },
    { value: 'ราษีไศล', viewValue: 'ราษีไศล', prvCode: '22' },
    { value: 'อุทุมพรพิสัย', viewValue: 'อุทุมพรพิสัย', prvCode: '22' },
    { value: 'บึงบูรพ์', viewValue: 'บึงบูรพ์', prvCode: '22' },
    { value: 'ห้วยทับทัน', viewValue: 'ห้วยทับทัน', prvCode: '22' },
    { value: 'โนนคูณ', viewValue: 'โนนคูณ', prvCode: '22' },
    { value: 'ศรีรัตนะ', viewValue: 'ศรีรัตนะ', prvCode: '22' },
    { value: 'น้ำเกลี้ยง', viewValue: 'น้ำเกลี้ยง', prvCode: '22' },
    { value: 'วังหิน', viewValue: 'วังหิน', prvCode: '22' },
    { value: 'ภูสิงห์', viewValue: 'ภูสิงห์', prvCode: '22' },
    { value: 'เมืองจันทร์', viewValue: 'เมืองจันทร์', prvCode: '22' },
    { value: 'เบญจลักษ์', viewValue: 'เบญจลักษ์', prvCode: '22' },
    { value: 'พยุห์', viewValue: 'พยุห์', prvCode: '22' },
    { value: 'โพธิ์ศรีสุวรรณ', viewValue: 'โพธิ์ศรีสุวรรณ', prvCode: '22' },
    { value: 'ศิลาลาด', viewValue: 'ศิลาลาด', prvCode: '22' },
    { value: 'เมืองอุบลราชธานี', viewValue: 'เมืองอุบลราชธานี', prvCode: '23' },
    { value: 'ศรีเมืองใหม่', viewValue: 'ศรีเมืองใหม่', prvCode: '23' },
    { value: 'โขงเจียม', viewValue: 'โขงเจียม', prvCode: '23' },
    { value: 'เขื่องใน', viewValue: 'เขื่องใน', prvCode: '23' },
    { value: 'เขมราฐ', viewValue: 'เขมราฐ', prvCode: '23' },
    { value: '*ชานุมาน', viewValue: '*ชานุมาน', prvCode: '23' },
    { value: 'เดชอุดม', viewValue: 'เดชอุดม', prvCode: '23' },
    { value: 'นาจะหลวย', viewValue: 'นาจะหลวย', prvCode: '23' },
    { value: 'น้ำยืน', viewValue: 'น้ำยืน', prvCode: '23' },
    { value: 'บุณฑริก', viewValue: 'บุณฑริก', prvCode: '23' },
    { value: 'ตระการพืชผล', viewValue: 'ตระการพืชผล', prvCode: '23' },
    { value: 'กุดข้าวปุ้น', viewValue: 'กุดข้าวปุ้น', prvCode: '23' },
    { value: '*พนา', viewValue: '*พนา', prvCode: '23' },
    { value: 'ม่วงสามสิบ', viewValue: 'ม่วงสามสิบ', prvCode: '23' },
    { value: 'วารินชำราบ', viewValue: 'วารินชำราบ', prvCode: '23' },
    { value: '*อำนาจเจริญ', viewValue: '*อำนาจเจริญ', prvCode: '23' },
    { value: '*เสนางคนิคม', viewValue: '*เสนางคนิคม', prvCode: '23' },
    { value: '*หัวตะพาน', viewValue: '*หัวตะพาน', prvCode: '23' },
    { value: 'พิบูลมังสาหาร', viewValue: 'พิบูลมังสาหาร', prvCode: '23' },
    { value: 'ตาลสุม', viewValue: 'ตาลสุม', prvCode: '23' },
    { value: 'โพธิ์ไทร', viewValue: 'โพธิ์ไทร', prvCode: '23' },
    { value: 'สำโรง', viewValue: 'สำโรง', prvCode: '23' },
    { value: '*กิ่งอำเภอลืออำนาจ', viewValue: '*กิ่งอำเภอลืออำนาจ', prvCode: '23' },
    { value: 'ดอนมดแดง', viewValue: 'ดอนมดแดง', prvCode: '23' },
    { value: 'สิรินธร', viewValue: 'สิรินธร', prvCode: '23' },
    { value: 'ทุ่งศรีอุดม', viewValue: 'ทุ่งศรีอุดม', prvCode: '23' },
    { value: '*ปทุมราชวงศา', viewValue: '*ปทุมราชวงศา', prvCode: '23' },
    { value: '*กิ่งอำเภอศรีหลักชัย', viewValue: '*กิ่งอำเภอศรีหลักชัย', prvCode: '23' },
    { value: 'นาเยีย', viewValue: 'นาเยีย', prvCode: '23' },
    { value: 'นาตาล', viewValue: 'นาตาล', prvCode: '23' },
    { value: 'เหล่าเสือโก้ก', viewValue: 'เหล่าเสือโก้ก', prvCode: '23' },
    { value: 'สว่างวีระวงศ์', viewValue: 'สว่างวีระวงศ์', prvCode: '23' },
    { value: 'น้ำขุ่น', viewValue: 'น้ำขุ่น', prvCode: '23' },
    { value: '*อ.สุวรรณวารี จ.อุบลราชธานี', viewValue: '*อ.สุวรรณวารี จ.อุบลราชธานี', prvCode: '23' },
    { value: 'เมืองยโสธร', viewValue: 'เมืองยโสธร', prvCode: '24' },
    { value: 'ทรายมูล', viewValue: 'ทรายมูล', prvCode: '24' },
    { value: 'กุดชุม', viewValue: 'กุดชุม', prvCode: '24' },
    { value: 'คำเขื่อนแก้ว', viewValue: 'คำเขื่อนแก้ว', prvCode: '24' },
    { value: 'ป่าติ้ว', viewValue: 'ป่าติ้ว', prvCode: '24' },
    { value: 'มหาชนะชัย', viewValue: 'มหาชนะชัย', prvCode: '24' },
    { value: 'ค้อวัง', viewValue: 'ค้อวัง', prvCode: '24' },
    { value: 'เลิงนกทา', viewValue: 'เลิงนกทา', prvCode: '24' },
    { value: 'ไทยเจริญ', viewValue: 'ไทยเจริญ', prvCode: '24' },
    { value: 'เมืองชัยภูมิ', viewValue: 'เมืองชัยภูมิ', prvCode: '25' },
    { value: 'บ้านเขว้า', viewValue: 'บ้านเขว้า', prvCode: '25' },
    { value: 'คอนสวรรค์', viewValue: 'คอนสวรรค์', prvCode: '25' },
    { value: 'เกษตรสมบูรณ์', viewValue: 'เกษตรสมบูรณ์', prvCode: '25' },
    { value: 'หนองบัวแดง', viewValue: 'หนองบัวแดง', prvCode: '25' },
    { value: 'จัตุรัส', viewValue: 'จัตุรัส', prvCode: '25' },
    { value: 'บำเหน็จณรงค์', viewValue: 'บำเหน็จณรงค์', prvCode: '25' },
    { value: 'หนองบัวระเหว', viewValue: 'หนองบัวระเหว', prvCode: '25' },
    { value: 'เทพสถิต', viewValue: 'เทพสถิต', prvCode: '25' },
    { value: 'ภูเขียว', viewValue: 'ภูเขียว', prvCode: '25' },
    { value: 'บ้านแท่น', viewValue: 'บ้านแท่น', prvCode: '25' },
    { value: 'แก้งคร้อ', viewValue: 'แก้งคร้อ', prvCode: '25' },
    { value: 'คอนสาร', viewValue: 'คอนสาร', prvCode: '25' },
    { value: 'ภักดีชุมพล', viewValue: 'ภักดีชุมพล', prvCode: '25' },
    { value: 'เนินสง่า', viewValue: 'เนินสง่า', prvCode: '25' },
    { value: 'ซับใหญ่', viewValue: 'ซับใหญ่', prvCode: '25' },
    { value: 'เมืองชัยภูมิ (สาขาตำบลโนนสำราญ)*', viewValue: 'เมืองชัยภูมิ (สาขาตำบลโนนสำราญ)*', prvCode: '25' },
    { value: 'สาขาตำบลบ้านหว่าเฒ่า*', viewValue: 'สาขาตำบลบ้านหว่าเฒ่า*', prvCode: '25' },
    { value: 'หนองบัวแดง (สาขาตำบลวังชมภู)*', viewValue: 'หนองบัวแดง (สาขาตำบลวังชมภู)*', prvCode: '25' },
    { value: 'กิ่งอำเภอซับใหญ่ (สาขาตำบลซับใหญ่)*', viewValue: 'กิ่งอำเภอซับใหญ่ (สาขาตำบลซับใหญ่)*', prvCode: '25' },
    { value: 'สาขาตำบลโคกเพชร*', viewValue: 'สาขาตำบลโคกเพชร*', prvCode: '25' },
    { value: 'เทพสถิต (สาขาตำบลนายางกลัก)*', viewValue: 'เทพสถิต (สาขาตำบลนายางกลัก)*', prvCode: '25' },
    { value: 'บ้านแท่น (สาขาตำบลบ้านเต่า)*', viewValue: 'บ้านแท่น (สาขาตำบลบ้านเต่า)*', prvCode: '25' },
    { value: 'แก้งคร้อ (สาขาตำบลท่ามะไฟหวาน)*', viewValue: 'แก้งคร้อ (สาขาตำบลท่ามะไฟหวาน)*', prvCode: '25' },
    { value: 'คอนสาร (สาขาตำบลโนนคูณ)*', viewValue: 'คอนสาร (สาขาตำบลโนนคูณ)*', prvCode: '25' },
    { value: 'เมืองอำนาจเจริญ', viewValue: 'เมืองอำนาจเจริญ', prvCode: '26' },
    { value: 'ชานุมาน', viewValue: 'ชานุมาน', prvCode: '26' },
    { value: 'ปทุมราชวงศา', viewValue: 'ปทุมราชวงศา', prvCode: '26' },
    { value: 'พนา', viewValue: 'พนา', prvCode: '26' },
    { value: 'เสนางคนิคม', viewValue: 'เสนางคนิคม', prvCode: '26' },
    { value: 'หัวตะพาน', viewValue: 'หัวตะพาน', prvCode: '26' },
    { value: 'ลืออำนาจ', viewValue: 'ลืออำนาจ', prvCode: '26' },
    { value: 'เมืองหนองบัวลำภู', viewValue: 'เมืองหนองบัวลำภู', prvCode: '27' },
    { value: 'นากลาง', viewValue: 'นากลาง', prvCode: '27' },
    { value: 'โนนสัง', viewValue: 'โนนสัง', prvCode: '27' },
    { value: 'ศรีบุญเรือง', viewValue: 'ศรีบุญเรือง', prvCode: '27' },
    { value: 'สุวรรณคูหา', viewValue: 'สุวรรณคูหา', prvCode: '27' },
    { value: 'นาวัง', viewValue: 'นาวัง', prvCode: '27' },
    { value: 'เมืองขอนแก่น', viewValue: 'เมืองขอนแก่น', prvCode: '28' },
    { value: 'บ้านฝาง', viewValue: 'บ้านฝาง', prvCode: '28' },
    { value: 'พระยืน', viewValue: 'พระยืน', prvCode: '28' },
    { value: 'หนองเรือ', viewValue: 'หนองเรือ', prvCode: '28' },
    { value: 'ชุมแพ', viewValue: 'ชุมแพ', prvCode: '28' },
    { value: 'สีชมพู', viewValue: 'สีชมพู', prvCode: '28' },
    { value: 'น้ำพอง', viewValue: 'น้ำพอง', prvCode: '28' },
    { value: 'อุบลรัตน์', viewValue: 'อุบลรัตน์', prvCode: '28' },
    { value: 'กระนวน', viewValue: 'กระนวน', prvCode: '28' },
    { value: 'บ้านไผ่', viewValue: 'บ้านไผ่', prvCode: '28' },
    { value: 'เปือยน้อย', viewValue: 'เปือยน้อย', prvCode: '28' },
    { value: 'พล', viewValue: 'พล', prvCode: '28' },
    { value: 'แวงใหญ่', viewValue: 'แวงใหญ่', prvCode: '28' },
    { value: 'แวงน้อย', viewValue: 'แวงน้อย', prvCode: '28' },
    { value: 'หนองสองห้อง', viewValue: 'หนองสองห้อง', prvCode: '28' },
    { value: 'ภูเวียง', viewValue: 'ภูเวียง', prvCode: '28' },
    { value: 'มัญจาคีรี', viewValue: 'มัญจาคีรี', prvCode: '28' },
    { value: 'ชนบท', viewValue: 'ชนบท', prvCode: '28' },
    { value: 'เขาสวนกวาง', viewValue: 'เขาสวนกวาง', prvCode: '28' },
    { value: 'ภูผาม่าน', viewValue: 'ภูผาม่าน', prvCode: '28' },
    { value: 'ซำสูง', viewValue: 'ซำสูง', prvCode: '28' },
    { value: 'โคกโพธิ์ไชย', viewValue: 'โคกโพธิ์ไชย', prvCode: '28' },
    { value: 'หนองนาคำ', viewValue: 'หนองนาคำ', prvCode: '28' },
    { value: 'บ้านแฮด', viewValue: 'บ้านแฮด', prvCode: '28' },
    { value: 'โนนศิลา', viewValue: 'โนนศิลา', prvCode: '28' },
    { value: 'เวียงเก่า', viewValue: 'เวียงเก่า', prvCode: '28' },
    { value: 'ท้องถิ่นเทศบาลตำบลบ้านเป็ด*', viewValue: 'ท้องถิ่นเทศบาลตำบลบ้านเป็ด*', prvCode: '28' },
    { value: 'เทศบาลตำบลเมืองพล*', viewValue: 'เทศบาลตำบลเมืองพล*', prvCode: '28' },
    { value: 'เมืองอุดรธานี', viewValue: 'เมืองอุดรธานี', prvCode: '29' },
    { value: 'กุดจับ', viewValue: 'กุดจับ', prvCode: '29' },
    { value: 'หนองวัวซอ', viewValue: 'หนองวัวซอ', prvCode: '29' },
    { value: 'กุมภวาปี', viewValue: 'กุมภวาปี', prvCode: '29' },
    { value: 'โนนสะอาด', viewValue: 'โนนสะอาด', prvCode: '29' },
    { value: 'หนองหาน', viewValue: 'หนองหาน', prvCode: '29' },
    { value: 'ทุ่งฝน', viewValue: 'ทุ่งฝน', prvCode: '29' },
    { value: 'ไชยวาน', viewValue: 'ไชยวาน', prvCode: '29' },
    { value: 'ศรีธาตุ', viewValue: 'ศรีธาตุ', prvCode: '29' },
    { value: 'วังสามหมอ', viewValue: 'วังสามหมอ', prvCode: '29' },
    { value: 'บ้านดุง', viewValue: 'บ้านดุง', prvCode: '29' },
    { value: '*หนองบัวลำภู', viewValue: '*หนองบัวลำภู', prvCode: '29' },
    { value: '*ศรีบุญเรือง', viewValue: '*ศรีบุญเรือง', prvCode: '29' },
    { value: '*นากลาง', viewValue: '*นากลาง', prvCode: '29' },
    { value: '*สุวรรณคูหา', viewValue: '*สุวรรณคูหา', prvCode: '29' },
    { value: '*โนนสัง', viewValue: '*โนนสัง', prvCode: '29' },
    { value: 'บ้านผือ', viewValue: 'บ้านผือ', prvCode: '29' },
    { value: 'น้ำโสม', viewValue: 'น้ำโสม', prvCode: '29' },
    { value: 'เพ็ญ', viewValue: 'เพ็ญ', prvCode: '29' },
    { value: 'สร้างคอม', viewValue: 'สร้างคอม', prvCode: '29' },
    { value: 'หนองแสง', viewValue: 'หนองแสง', prvCode: '29' },
    { value: 'นายูง', viewValue: 'นายูง', prvCode: '29' },
    { value: 'พิบูลย์รักษ์', viewValue: 'พิบูลย์รักษ์', prvCode: '29' },
    { value: 'กู่แก้ว', viewValue: 'กู่แก้ว', prvCode: '29' },
    { value: 'ประจักษ์ศิลปาคม', viewValue: 'ประจักษ์ศิลปาคม', prvCode: '29' },
    { value: 'เมืองเลย', viewValue: 'เมืองเลย', prvCode: '30' },
    { value: 'นาด้วง', viewValue: 'นาด้วง', prvCode: '30' },
    { value: 'เชียงคาน', viewValue: 'เชียงคาน', prvCode: '30' },
    { value: 'ปากชม', viewValue: 'ปากชม', prvCode: '30' },
    { value: 'ด่านซ้าย', viewValue: 'ด่านซ้าย', prvCode: '30' },
    { value: 'นาแห้ว', viewValue: 'นาแห้ว', prvCode: '30' },
    { value: 'ภูเรือ', viewValue: 'ภูเรือ', prvCode: '30' },
    { value: 'ท่าลี่', viewValue: 'ท่าลี่', prvCode: '30' },
    { value: 'วังสะพุง', viewValue: 'วังสะพุง', prvCode: '30' },
    { value: 'ภูกระดึง', viewValue: 'ภูกระดึง', prvCode: '30' },
    { value: 'ภูหลวง', viewValue: 'ภูหลวง', prvCode: '30' },
    { value: 'ผาขาว', viewValue: 'ผาขาว', prvCode: '30' },
    { value: 'เอราวัณ', viewValue: 'เอราวัณ', prvCode: '30' },
    { value: 'หนองหิน', viewValue: 'หนองหิน', prvCode: '30' },
    { value: 'เมืองหนองคาย', viewValue: 'เมืองหนองคาย', prvCode: '31' },
    { value: 'ท่าบ่อ', viewValue: 'ท่าบ่อ', prvCode: '31' },
    { value: 'เมืองบึงกาฬ', viewValue: 'เมืองบึงกาฬ', prvCode: '97' },
    { value: 'พรเจริญ', viewValue: 'พรเจริญ', prvCode: '97' },
    { value: 'โพนพิสัย', viewValue: 'โพนพิสัย', prvCode: '31' },
    { value: 'โซ่พิสัย', viewValue: 'โซ่พิสัย', prvCode: '97' },
    { value: 'ศรีเชียงใหม่', viewValue: 'ศรีเชียงใหม่', prvCode: '31' },
    { value: 'สังคม', viewValue: 'สังคม', prvCode: '31' },
    { value: 'เซกา', viewValue: 'เซกา', prvCode: '97' },
    { value: 'ปากคาด', viewValue: 'ปากคาด', prvCode: '97' },
    { value: 'บึงโขงหลง', viewValue: 'บึงโขงหลง', prvCode: '97' },
    { value: 'ศรีวิไล', viewValue: 'ศรีวิไล', prvCode: '97' },
    { value: 'บุ่งคล้า', viewValue: 'บุ่งคล้า', prvCode: '97' },
    { value: 'สระใคร', viewValue: 'สระใคร', prvCode: '31' },
    { value: 'เฝ้าไร่', viewValue: 'เฝ้าไร่', prvCode: '31' },
    { value: 'รัตนวาปี', viewValue: 'รัตนวาปี', prvCode: '31' },
    { value: 'โพธิ์ตาก', viewValue: 'โพธิ์ตาก', prvCode: '31' },
    { value: 'เมืองมหาสารคาม', viewValue: 'เมืองมหาสารคาม', prvCode: '32' },
    { value: 'แกดำ', viewValue: 'แกดำ', prvCode: '32' },
    { value: 'โกสุมพิสัย', viewValue: 'โกสุมพิสัย', prvCode: '32' },
    { value: 'กันทรวิชัย', viewValue: 'กันทรวิชัย', prvCode: '32' },
    { value: 'เชียงยืน', viewValue: 'เชียงยืน', prvCode: '32' },
    { value: 'บรบือ', viewValue: 'บรบือ', prvCode: '32' },
    { value: 'นาเชือก', viewValue: 'นาเชือก', prvCode: '32' },
    { value: 'พยัคฆภูมิพิสัย', viewValue: 'พยัคฆภูมิพิสัย', prvCode: '32' },
    { value: 'วาปีปทุม', viewValue: 'วาปีปทุม', prvCode: '32' },
    { value: 'นาดูน', viewValue: 'นาดูน', prvCode: '32' },
    { value: 'ยางสีสุราช', viewValue: 'ยางสีสุราช', prvCode: '32' },
    { value: 'กุดรัง', viewValue: 'กุดรัง', prvCode: '32' },
    { value: 'ชื่นชม', viewValue: 'ชื่นชม', prvCode: '32' },
    { value: '*หลุบ', viewValue: '*หลุบ', prvCode: '32' },
    { value: 'เมืองร้อยเอ็ด', viewValue: 'เมืองร้อยเอ็ด', prvCode: '33' },
    { value: 'เกษตรวิสัย', viewValue: 'เกษตรวิสัย', prvCode: '33' },
    { value: 'ปทุมรัตต์', viewValue: 'ปทุมรัตต์', prvCode: '33' },
    { value: 'จตุรพักตรพิมาน', viewValue: 'จตุรพักตรพิมาน', prvCode: '33' },
    { value: 'ธวัชบุรี', viewValue: 'ธวัชบุรี', prvCode: '33' },
    { value: 'พนมไพร', viewValue: 'พนมไพร', prvCode: '33' },
    { value: 'โพนทอง', viewValue: 'โพนทอง', prvCode: '33' },
    { value: 'โพธิ์ชัย', viewValue: 'โพธิ์ชัย', prvCode: '33' },
    { value: 'หนองพอก', viewValue: 'หนองพอก', prvCode: '33' },
    { value: 'เสลภูมิ', viewValue: 'เสลภูมิ', prvCode: '33' },
    { value: 'สุวรรณภูมิ', viewValue: 'สุวรรณภูมิ', prvCode: '33' },
    { value: 'เมืองสรวง', viewValue: 'เมืองสรวง', prvCode: '33' },
    { value: 'โพนทราย', viewValue: 'โพนทราย', prvCode: '33' },
    { value: 'อาจสามารถ', viewValue: 'อาจสามารถ', prvCode: '33' },
    { value: 'เมยวดี', viewValue: 'เมยวดี', prvCode: '33' },
    { value: 'ศรีสมเด็จ', viewValue: 'ศรีสมเด็จ', prvCode: '33' },
    { value: 'จังหาร', viewValue: 'จังหาร', prvCode: '33' },
    { value: 'เชียงขวัญ', viewValue: 'เชียงขวัญ', prvCode: '33' },
    { value: 'หนองฮี', viewValue: 'หนองฮี', prvCode: '33' },
    { value: 'ทุ่งเขาหลวง', viewValue: 'ทุ่งเขาหลวง', prvCode: '33' },
    { value: 'เมืองกาฬสินธุ์', viewValue: 'เมืองกาฬสินธุ์', prvCode: '34' },
    { value: 'นามน', viewValue: 'นามน', prvCode: '34' },
    { value: 'กมลาไสย', viewValue: 'กมลาไสย', prvCode: '34' },
    { value: 'ร่องคำ', viewValue: 'ร่องคำ', prvCode: '34' },
    { value: 'กุฉินารายณ์', viewValue: 'กุฉินารายณ์', prvCode: '34' },
    { value: 'เขาวง', viewValue: 'เขาวง', prvCode: '34' },
    { value: 'ยางตลาด', viewValue: 'ยางตลาด', prvCode: '34' },
    { value: 'ห้วยเม็ก', viewValue: 'ห้วยเม็ก', prvCode: '34' },
    { value: 'สหัสขันธ์', viewValue: 'สหัสขันธ์', prvCode: '34' },
    { value: 'คำม่วง', viewValue: 'คำม่วง', prvCode: '34' },
    { value: 'ท่าคันโท', viewValue: 'ท่าคันโท', prvCode: '34' },
    { value: 'หนองกุงศรี', viewValue: 'หนองกุงศรี', prvCode: '34' },
    { value: 'สมเด็จ', viewValue: 'สมเด็จ', prvCode: '34' },
    { value: 'ห้วยผึ้ง', viewValue: 'ห้วยผึ้ง', prvCode: '34' },
    { value: 'สามชัย', viewValue: 'สามชัย', prvCode: '34' },
    { value: 'นาคู', viewValue: 'นาคู', prvCode: '34' },
    { value: 'ดอนจาน', viewValue: 'ดอนจาน', prvCode: '34' },
    { value: 'ฆ้องชัย', viewValue: 'ฆ้องชัย', prvCode: '34' },
    { value: 'เมืองสกลนคร', viewValue: 'เมืองสกลนคร', prvCode: '35' },
    { value: 'กุสุมาลย์', viewValue: 'กุสุมาลย์', prvCode: '35' },
    { value: 'กุดบาก', viewValue: 'กุดบาก', prvCode: '35' },
    { value: 'พรรณานิคม', viewValue: 'พรรณานิคม', prvCode: '35' },
    { value: 'พังโคน', viewValue: 'พังโคน', prvCode: '35' },
    { value: 'วาริชภูมิ', viewValue: 'วาริชภูมิ', prvCode: '35' },
    { value: 'นิคมน้ำอูน', viewValue: 'นิคมน้ำอูน', prvCode: '35' },
    { value: 'วานรนิวาส', viewValue: 'วานรนิวาส', prvCode: '35' },
    { value: 'คำตากล้า', viewValue: 'คำตากล้า', prvCode: '35' },
    { value: 'บ้านม่วง', viewValue: 'บ้านม่วง', prvCode: '35' },
    { value: 'อากาศอำนวย', viewValue: 'อากาศอำนวย', prvCode: '35' },
    { value: 'สว่างแดนดิน', viewValue: 'สว่างแดนดิน', prvCode: '35' },
    { value: 'ส่องดาว', viewValue: 'ส่องดาว', prvCode: '35' },
    { value: 'เต่างอย', viewValue: 'เต่างอย', prvCode: '35' },
    { value: 'โคกศรีสุพรรณ', viewValue: 'โคกศรีสุพรรณ', prvCode: '35' },
    { value: 'เจริญศิลป์', viewValue: 'เจริญศิลป์', prvCode: '35' },
    { value: 'โพนนาแก้ว', viewValue: 'โพนนาแก้ว', prvCode: '35' },
    { value: 'ภูพาน', viewValue: 'ภูพาน', prvCode: '35' },
    { value: 'วานรนิวาส (สาขาตำบลกุดเรือคำ)*', viewValue: 'วานรนิวาส (สาขาตำบลกุดเรือคำ)*', prvCode: '35' },
    { value: '*อ.บ้านหัน จ.สกลนคร', viewValue: '*อ.บ้านหัน จ.สกลนคร', prvCode: '35' },
    { value: 'เมืองนครพนม', viewValue: 'เมืองนครพนม', prvCode: '36' },
    { value: 'ปลาปาก', viewValue: 'ปลาปาก', prvCode: '36' },
    { value: 'ท่าอุเทน', viewValue: 'ท่าอุเทน', prvCode: '36' },
    { value: 'บ้านแพง', viewValue: 'บ้านแพง', prvCode: '36' },
    { value: 'ธาตุพนม', viewValue: 'ธาตุพนม', prvCode: '36' },
    { value: 'เรณูนคร', viewValue: 'เรณูนคร', prvCode: '36' },
    { value: 'นาแก', viewValue: 'นาแก', prvCode: '36' },
    { value: 'ศรีสงคราม', viewValue: 'ศรีสงคราม', prvCode: '36' },
    { value: 'นาหว้า', viewValue: 'นาหว้า', prvCode: '36' },
    { value: 'โพนสวรรค์', viewValue: 'โพนสวรรค์', prvCode: '36' },
    { value: 'นาทม', viewValue: 'นาทม', prvCode: '36' },
    { value: 'วังยาง', viewValue: 'วังยาง', prvCode: '36' },
    { value: 'เมืองมุกดาหาร', viewValue: 'เมืองมุกดาหาร', prvCode: '37' },
    { value: 'นิคมคำสร้อย', viewValue: 'นิคมคำสร้อย', prvCode: '37' },
    { value: 'ดอนตาล', viewValue: 'ดอนตาล', prvCode: '37' },
    { value: 'ดงหลวง', viewValue: 'ดงหลวง', prvCode: '37' },
    { value: 'คำชะอี', viewValue: 'คำชะอี', prvCode: '37' },
    { value: 'หว้านใหญ่', viewValue: 'หว้านใหญ่', prvCode: '37' },
    { value: 'หนองสูง', viewValue: 'หนองสูง', prvCode: '37' },
    { value: 'เมืองเชียงใหม่', viewValue: 'เมืองเชียงใหม่', prvCode: '38' },
    { value: 'จอมทอง', viewValue: 'จอมทอง', prvCode: '38' },
    { value: 'แม่แจ่ม', viewValue: 'แม่แจ่ม', prvCode: '38' },
    { value: 'เชียงดาว', viewValue: 'เชียงดาว', prvCode: '38' },
    { value: 'ดอยสะเก็ด', viewValue: 'ดอยสะเก็ด', prvCode: '38' },
    { value: 'แม่แตง', viewValue: 'แม่แตง', prvCode: '38' },
    { value: 'แม่ริม', viewValue: 'แม่ริม', prvCode: '38' },
    { value: 'สะเมิง', viewValue: 'สะเมิง', prvCode: '38' },
    { value: 'ฝาง', viewValue: 'ฝาง', prvCode: '38' },
    { value: 'แม่อาย', viewValue: 'แม่อาย', prvCode: '38' },
    { value: 'พร้าว', viewValue: 'พร้าว', prvCode: '38' },
    { value: 'สันป่าตอง', viewValue: 'สันป่าตอง', prvCode: '38' },
    { value: 'สันกำแพง', viewValue: 'สันกำแพง', prvCode: '38' },
    { value: 'สันทราย', viewValue: 'สันทราย', prvCode: '38' },
    { value: 'หางดง', viewValue: 'หางดง', prvCode: '38' },
    { value: 'ฮอด', viewValue: 'ฮอด', prvCode: '38' },
    { value: 'ดอยเต่า', viewValue: 'ดอยเต่า', prvCode: '38' },
    { value: 'อมก๋อย', viewValue: 'อมก๋อย', prvCode: '38' },
    { value: 'สารภี', viewValue: 'สารภี', prvCode: '38' },
    { value: 'เวียงแหง', viewValue: 'เวียงแหง', prvCode: '38' },
    { value: 'ไชยปราการ', viewValue: 'ไชยปราการ', prvCode: '38' },
    { value: 'แม่วาง', viewValue: 'แม่วาง', prvCode: '38' },
    { value: 'แม่ออน', viewValue: 'แม่ออน', prvCode: '38' },
    { value: 'ดอยหล่อ', viewValue: 'ดอยหล่อ', prvCode: '38' },
    { value: 'เทศบาลนครเชียงใหม่ (สาขาแขวงกาลวิละ)*', viewValue: 'เทศบาลนครเชียงใหม่ (สาขาแขวงกาลวิละ)*', prvCode: '38' },
    { value: 'เทศบาลนครเชียงใหม่ (สาขาแขวงศรีวิชั)*', viewValue: 'เทศบาลนครเชียงใหม่ (สาขาแขวงศรีวิชั)*', prvCode: '38' },
    { value: 'เทศบาลนครเชียงใหม่ (สาขาเม็งราย)*', viewValue: 'เทศบาลนครเชียงใหม่ (สาขาเม็งราย)*', prvCode: '38' },
    { value: 'เมืองลำพูน', viewValue: 'เมืองลำพูน', prvCode: '39' },
    { value: 'แม่ทา', viewValue: 'แม่ทา', prvCode: '39' },
    { value: 'บ้านโฮ่ง', viewValue: 'บ้านโฮ่ง', prvCode: '39' },
    { value: 'ลี้', viewValue: 'ลี้', prvCode: '39' },
    { value: 'ทุ่งหัวช้าง', viewValue: 'ทุ่งหัวช้าง', prvCode: '39' },
    { value: 'ป่าซาง', viewValue: 'ป่าซาง', prvCode: '39' },
    { value: 'บ้านธิ', viewValue: 'บ้านธิ', prvCode: '39' },
    { value: 'เวียงหนองล่อง', viewValue: 'เวียงหนองล่อง', prvCode: '39' },
    { value: 'เมืองลำปาง', viewValue: 'เมืองลำปาง', prvCode: '40' },
    { value: 'แม่เมาะ', viewValue: 'แม่เมาะ', prvCode: '40' },
    { value: 'เกาะคา', viewValue: 'เกาะคา', prvCode: '40' },
    { value: 'เสริมงาม', viewValue: 'เสริมงาม', prvCode: '40' },
    { value: 'งาว', viewValue: 'งาว', prvCode: '40' },
    { value: 'แจ้ห่ม', viewValue: 'แจ้ห่ม', prvCode: '40' },
    { value: 'วังเหนือ', viewValue: 'วังเหนือ', prvCode: '40' },
    { value: 'เถิน', viewValue: 'เถิน', prvCode: '40' },
    { value: 'แม่พริก', viewValue: 'แม่พริก', prvCode: '40' },
    { value: 'แม่ทะ', viewValue: 'แม่ทะ', prvCode: '40' },
    { value: 'สบปราบ', viewValue: 'สบปราบ', prvCode: '40' },
    { value: 'ห้างฉัตร', viewValue: 'ห้างฉัตร', prvCode: '40' },
    { value: 'เมืองปาน', viewValue: 'เมืองปาน', prvCode: '40' },
    { value: 'เมืองอุตรดิตถ์', viewValue: 'เมืองอุตรดิตถ์', prvCode: '41' },
    { value: 'ตรอน', viewValue: 'ตรอน', prvCode: '41' },
    { value: 'ท่าปลา', viewValue: 'ท่าปลา', prvCode: '41' },
    { value: 'น้ำปาด', viewValue: 'น้ำปาด', prvCode: '41' },
    { value: 'ฟากท่า', viewValue: 'ฟากท่า', prvCode: '41' },
    { value: 'บ้านโคก', viewValue: 'บ้านโคก', prvCode: '41' },
    { value: 'พิชัย', viewValue: 'พิชัย', prvCode: '41' },
    { value: 'ลับแล', viewValue: 'ลับแล', prvCode: '41' },
    { value: 'ทองแสนขัน', viewValue: 'ทองแสนขัน', prvCode: '41' },
    { value: 'เมืองแพร่', viewValue: 'เมืองแพร่', prvCode: '42' },
    { value: 'ร้องกวาง', viewValue: 'ร้องกวาง', prvCode: '42' },
    { value: 'ลอง', viewValue: 'ลอง', prvCode: '42' },
    { value: 'สูงเม่น', viewValue: 'สูงเม่น', prvCode: '42' },
    { value: 'เด่นชัย', viewValue: 'เด่นชัย', prvCode: '42' },
    { value: 'สอง', viewValue: 'สอง', prvCode: '42' },
    { value: 'วังชิ้น', viewValue: 'วังชิ้น', prvCode: '42' },
    { value: 'หนองม่วงไข่', viewValue: 'หนองม่วงไข่', prvCode: '42' },
    { value: 'เมืองน่าน', viewValue: 'เมืองน่าน', prvCode: '43' },
    { value: 'แม่จริม', viewValue: 'แม่จริม', prvCode: '43' },
    { value: 'บ้านหลวง', viewValue: 'บ้านหลวง', prvCode: '43' },
    { value: 'นาน้อย', viewValue: 'นาน้อย', prvCode: '43' },
    { value: 'ปัว', viewValue: 'ปัว', prvCode: '43' },
    { value: 'ท่าวังผา', viewValue: 'ท่าวังผา', prvCode: '43' },
    { value: 'เวียงสา', viewValue: 'เวียงสา', prvCode: '43' },
    { value: 'ทุ่งช้าง', viewValue: 'ทุ่งช้าง', prvCode: '43' },
    { value: 'เชียงกลาง', viewValue: 'เชียงกลาง', prvCode: '43' },
    { value: 'นาหมื่น', viewValue: 'นาหมื่น', prvCode: '43' },
    { value: 'สันติสุข', viewValue: 'สันติสุข', prvCode: '43' },
    { value: 'บ่อเกลือ', viewValue: 'บ่อเกลือ', prvCode: '43' },
    { value: 'สองแคว', viewValue: 'สองแคว', prvCode: '43' },
    { value: 'ภูเพียง', viewValue: 'ภูเพียง', prvCode: '43' },
    { value: 'เฉลิมพระเกียรติ', viewValue: 'เฉลิมพระเกียรติ', prvCode: '43' },
    { value: 'เมืองพะเยา', viewValue: 'เมืองพะเยา', prvCode: '44' },
    { value: 'จุน', viewValue: 'จุน', prvCode: '44' },
    { value: 'เชียงคำ', viewValue: 'เชียงคำ', prvCode: '44' },
    { value: 'เชียงม่วน', viewValue: 'เชียงม่วน', prvCode: '44' },
    { value: 'ดอกคำใต้', viewValue: 'ดอกคำใต้', prvCode: '44' },
    { value: 'ปง', viewValue: 'ปง', prvCode: '44' },
    { value: 'แม่ใจ', viewValue: 'แม่ใจ', prvCode: '44' },
    { value: 'ภูซาง', viewValue: 'ภูซาง', prvCode: '44' },
    { value: 'ภูกามยาว', viewValue: 'ภูกามยาว', prvCode: '44' },
    { value: 'เมืองเชียงราย', viewValue: 'เมืองเชียงราย', prvCode: '45' },
    { value: 'เวียงชัย', viewValue: 'เวียงชัย', prvCode: '45' },
    { value: 'เชียงของ', viewValue: 'เชียงของ', prvCode: '45' },
    { value: 'เทิง', viewValue: 'เทิง', prvCode: '45' },
    { value: 'พาน', viewValue: 'พาน', prvCode: '45' },
    { value: 'ป่าแดด', viewValue: 'ป่าแดด', prvCode: '45' },
    { value: 'แม่จัน', viewValue: 'แม่จัน', prvCode: '45' },
    { value: 'เชียงแสน', viewValue: 'เชียงแสน', prvCode: '45' },
    { value: 'แม่สาย', viewValue: 'แม่สาย', prvCode: '45' },
    { value: 'แม่สรวย', viewValue: 'แม่สรวย', prvCode: '45' },
    { value: 'เวียงป่าเป้า', viewValue: 'เวียงป่าเป้า', prvCode: '45' },
    { value: 'พญาเม็งราย', viewValue: 'พญาเม็งราย', prvCode: '45' },
    { value: 'เวียงแก่น', viewValue: 'เวียงแก่น', prvCode: '45' },
    { value: 'ขุนตาล', viewValue: 'ขุนตาล', prvCode: '45' },
    { value: 'แม่ฟ้าหลวง', viewValue: 'แม่ฟ้าหลวง', prvCode: '45' },
    { value: 'แม่ลาว', viewValue: 'แม่ลาว', prvCode: '45' },
    { value: 'เวียงเชียงรุ้ง', viewValue: 'เวียงเชียงรุ้ง', prvCode: '45' },
    { value: 'ดอยหลวง', viewValue: 'ดอยหลวง', prvCode: '45' },
    { value: 'เมืองแม่ฮ่องสอน', viewValue: 'เมืองแม่ฮ่องสอน', prvCode: '46' },
    { value: 'ขุนยวม', viewValue: 'ขุนยวม', prvCode: '46' },
    { value: 'ปาย', viewValue: 'ปาย', prvCode: '46' },
    { value: 'แม่สะเรียง', viewValue: 'แม่สะเรียง', prvCode: '46' },
    { value: 'แม่ลาน้อย', viewValue: 'แม่ลาน้อย', prvCode: '46' },
    { value: 'สบเมย', viewValue: 'สบเมย', prvCode: '46' },
    { value: 'ปางมะผ้า', viewValue: 'ปางมะผ้า', prvCode: '46' },
    { value: '*อ.ม่วยต่อ จ.แม่ฮ่องสอน', viewValue: '*อ.ม่วยต่อ จ.แม่ฮ่องสอน', prvCode: '46' },
    { value: 'เมืองนครสวรรค์', viewValue: 'เมืองนครสวรรค์', prvCode: '47' },
    { value: 'โกรกพระ', viewValue: 'โกรกพระ', prvCode: '47' },
    { value: 'ชุมแสง', viewValue: 'ชุมแสง', prvCode: '47' },
    { value: 'หนองบัว', viewValue: 'หนองบัว', prvCode: '47' },
    { value: 'บรรพตพิสัย', viewValue: 'บรรพตพิสัย', prvCode: '47' },
    { value: 'เก้าเลี้ยว', viewValue: 'เก้าเลี้ยว', prvCode: '47' },
    { value: 'ตาคลี', viewValue: 'ตาคลี', prvCode: '47' },
    { value: 'ท่าตะโก', viewValue: 'ท่าตะโก', prvCode: '47' },
    { value: 'ไพศาลี', viewValue: 'ไพศาลี', prvCode: '47' },
    { value: 'พยุหะคีรี', viewValue: 'พยุหะคีรี', prvCode: '47' },
    { value: 'ลาดยาว', viewValue: 'ลาดยาว', prvCode: '47' },
    { value: 'ตากฟ้า', viewValue: 'ตากฟ้า', prvCode: '47' },
    { value: 'แม่วงก์', viewValue: 'แม่วงก์', prvCode: '47' },
    { value: 'แม่เปิน', viewValue: 'แม่เปิน', prvCode: '47' },
    { value: 'ชุมตาบง', viewValue: 'ชุมตาบง', prvCode: '47' },
    { value: 'สาขาตำบลห้วยน้ำหอม*', viewValue: 'สาขาตำบลห้วยน้ำหอม*', prvCode: '47' },
    { value: 'กิ่งอำเภอชุมตาบง (สาขาตำบลชุมตาบง)*', viewValue: 'กิ่งอำเภอชุมตาบง (สาขาตำบลชุมตาบง)*', prvCode: '47' },
    { value: 'แม่วงก์ (สาขาตำบลแม่เล่ย์)*', viewValue: 'แม่วงก์ (สาขาตำบลแม่เล่ย์)*', prvCode: '47' },
    { value: 'เมืองอุทัยธานี', viewValue: 'เมืองอุทัยธานี', prvCode: '48' },
    { value: 'ทัพทัน', viewValue: 'ทัพทัน', prvCode: '48' },
    { value: 'สว่างอารมณ์', viewValue: 'สว่างอารมณ์', prvCode: '48' },
    { value: 'หนองฉาง', viewValue: 'หนองฉาง', prvCode: '48' },
    { value: 'หนองขาหย่าง', viewValue: 'หนองขาหย่าง', prvCode: '48' },
    { value: 'บ้านไร่', viewValue: 'บ้านไร่', prvCode: '48' },
    { value: 'ลานสัก', viewValue: 'ลานสัก', prvCode: '48' },
    { value: 'ห้วยคต', viewValue: 'ห้วยคต', prvCode: '48' },
    { value: 'เมืองกำแพงเพชร', viewValue: 'เมืองกำแพงเพชร', prvCode: '49' },
    { value: 'ไทรงาม', viewValue: 'ไทรงาม', prvCode: '49' },
    { value: 'คลองลาน', viewValue: 'คลองลาน', prvCode: '49' },
    { value: 'ขาณุวรลักษบุรี', viewValue: 'ขาณุวรลักษบุรี', prvCode: '49' },
    { value: 'คลองขลุง', viewValue: 'คลองขลุง', prvCode: '49' },
    { value: 'พรานกระต่าย', viewValue: 'พรานกระต่าย', prvCode: '49' },
    { value: 'ลานกระบือ', viewValue: 'ลานกระบือ', prvCode: '49' },
    { value: 'ทรายทองวัฒนา', viewValue: 'ทรายทองวัฒนา', prvCode: '49' },
    { value: 'ปางศิลาทอง', viewValue: 'ปางศิลาทอง', prvCode: '49' },
    { value: 'บึงสามัคคี', viewValue: 'บึงสามัคคี', prvCode: '49' },
    { value: 'โกสัมพีนคร', viewValue: 'โกสัมพีนคร', prvCode: '49' },
    { value: 'เมืองตาก', viewValue: 'เมืองตาก', prvCode: '50' },
    { value: 'บ้านตาก', viewValue: 'บ้านตาก', prvCode: '50' },
    { value: 'สามเงา', viewValue: 'สามเงา', prvCode: '50' },
    { value: 'แม่ระมาด', viewValue: 'แม่ระมาด', prvCode: '50' },
    { value: 'ท่าสองยาง', viewValue: 'ท่าสองยาง', prvCode: '50' },
    { value: 'แม่สอด', viewValue: 'แม่สอด', prvCode: '50' },
    { value: 'พบพระ', viewValue: 'พบพระ', prvCode: '50' },
    { value: 'อุ้มผาง', viewValue: 'อุ้มผาง', prvCode: '50' },
    { value: 'วังเจ้า', viewValue: 'วังเจ้า', prvCode: '50' },
    { value: '*กิ่ง อ.ท่าปุย จ.ตาก', viewValue: '*กิ่ง อ.ท่าปุย จ.ตาก', prvCode: '50' },
    { value: 'เมืองสุโขทัย', viewValue: 'เมืองสุโขทัย', prvCode: '51' },
    { value: 'บ้านด่านลานหอย', viewValue: 'บ้านด่านลานหอย', prvCode: '51' },
    { value: 'คีรีมาศ', viewValue: 'คีรีมาศ', prvCode: '51' },
    { value: 'กงไกรลาศ', viewValue: 'กงไกรลาศ', prvCode: '51' },
    { value: 'ศรีสัชนาลัย', viewValue: 'ศรีสัชนาลัย', prvCode: '51' },
    { value: 'ศรีสำโรง', viewValue: 'ศรีสำโรง', prvCode: '51' },
    { value: 'สวรรคโลก', viewValue: 'สวรรคโลก', prvCode: '51' },
    { value: 'ศรีนคร', viewValue: 'ศรีนคร', prvCode: '51' },
    { value: 'ทุ่งเสลี่ยม', viewValue: 'ทุ่งเสลี่ยม', prvCode: '51' },
    { value: 'เมืองพิษณุโลก', viewValue: 'เมืองพิษณุโลก', prvCode: '52' },
    { value: 'นครไทย', viewValue: 'นครไทย', prvCode: '52' },
    { value: 'ชาติตระการ', viewValue: 'ชาติตระการ', prvCode: '52' },
    { value: 'บางระกำ', viewValue: 'บางระกำ', prvCode: '52' },
    { value: 'บางกระทุ่ม', viewValue: 'บางกระทุ่ม', prvCode: '52' },
    { value: 'พรหมพิราม', viewValue: 'พรหมพิราม', prvCode: '52' },
    { value: 'วัดโบสถ์', viewValue: 'วัดโบสถ์', prvCode: '52' },
    { value: 'วังทอง', viewValue: 'วังทอง', prvCode: '52' },
    { value: 'เนินมะปราง', viewValue: 'เนินมะปราง', prvCode: '52' },
    { value: 'เมืองพิจิตร', viewValue: 'เมืองพิจิตร', prvCode: '53' },
    { value: 'วังทรายพูน', viewValue: 'วังทรายพูน', prvCode: '53' },
    { value: 'โพธิ์ประทับช้าง', viewValue: 'โพธิ์ประทับช้าง', prvCode: '53' },
    { value: 'ตะพานหิน', viewValue: 'ตะพานหิน', prvCode: '53' },
    { value: 'บางมูลนาก', viewValue: 'บางมูลนาก', prvCode: '53' },
    { value: 'โพทะเล', viewValue: 'โพทะเล', prvCode: '53' },
    { value: 'สามง่าม', viewValue: 'สามง่าม', prvCode: '53' },
    { value: 'ทับคล้อ', viewValue: 'ทับคล้อ', prvCode: '53' },
    { value: 'สากเหล็ก', viewValue: 'สากเหล็ก', prvCode: '53' },
    { value: 'บึงนาราง', viewValue: 'บึงนาราง', prvCode: '53' },
    { value: 'ดงเจริญ', viewValue: 'ดงเจริญ', prvCode: '53' },
    { value: 'วชิรบารมี', viewValue: 'วชิรบารมี', prvCode: '53' },
    { value: 'เมืองเพชรบูรณ์', viewValue: 'เมืองเพชรบูรณ์', prvCode: '54' },
    { value: 'ชนแดน', viewValue: 'ชนแดน', prvCode: '54' },
    { value: 'หล่มสัก', viewValue: 'หล่มสัก', prvCode: '54' },
    { value: 'หล่มเก่า', viewValue: 'หล่มเก่า', prvCode: '54' },
    { value: 'วิเชียรบุรี', viewValue: 'วิเชียรบุรี', prvCode: '54' },
    { value: 'ศรีเทพ', viewValue: 'ศรีเทพ', prvCode: '54' },
    { value: 'หนองไผ่', viewValue: 'หนองไผ่', prvCode: '54' },
    { value: 'บึงสามพัน', viewValue: 'บึงสามพัน', prvCode: '54' },
    { value: 'น้ำหนาว', viewValue: 'น้ำหนาว', prvCode: '54' },
    { value: 'วังโป่ง', viewValue: 'วังโป่ง', prvCode: '54' },
    { value: 'เขาค้อ', viewValue: 'เขาค้อ', prvCode: '54' },
    { value: 'เมืองราชบุรี', viewValue: 'เมืองราชบุรี', prvCode: '55' },
    { value: 'จอมบึง', viewValue: 'จอมบึง', prvCode: '55' },
    { value: 'สวนผึ้ง', viewValue: 'สวนผึ้ง', prvCode: '55' },
    { value: 'ดำเนินสะดวก', viewValue: 'ดำเนินสะดวก', prvCode: '55' },
    { value: 'บ้านโป่ง', viewValue: 'บ้านโป่ง', prvCode: '55' },
    { value: 'บางแพ', viewValue: 'บางแพ', prvCode: '55' },
    { value: 'โพธาราม', viewValue: 'โพธาราม', prvCode: '55' },
    { value: 'ปากท่อ', viewValue: 'ปากท่อ', prvCode: '55' },
    { value: 'วัดเพลง', viewValue: 'วัดเพลง', prvCode: '55' },
    { value: 'บ้านคา', viewValue: 'บ้านคา', prvCode: '55' },
    { value: 'ท้องถิ่นเทศบาลตำบลบ้านฆ้อง', viewValue: 'ท้องถิ่นเทศบาลตำบลบ้านฆ้อง', prvCode: '55' },
    { value: 'เมืองกาญจนบุรี', viewValue: 'เมืองกาญจนบุรี', prvCode: '56' },
    { value: 'ไทรโยค', viewValue: 'ไทรโยค', prvCode: '56' },
    { value: 'บ่อพลอย', viewValue: 'บ่อพลอย', prvCode: '56' },
    { value: 'ศรีสวัสดิ์', viewValue: 'ศรีสวัสดิ์', prvCode: '56' },
    { value: 'ท่ามะกา', viewValue: 'ท่ามะกา', prvCode: '56' },
    { value: 'ท่าม่วง', viewValue: 'ท่าม่วง', prvCode: '56' },
    { value: 'ทองผาภูมิ', viewValue: 'ทองผาภูมิ', prvCode: '56' },
    { value: 'สังขละบุรี', viewValue: 'สังขละบุรี', prvCode: '56' },
    { value: 'พนมทวน', viewValue: 'พนมทวน', prvCode: '56' },
    { value: 'เลาขวัญ', viewValue: 'เลาขวัญ', prvCode: '56' },
    { value: 'ด่านมะขามเตี้ย', viewValue: 'ด่านมะขามเตี้ย', prvCode: '56' },
    { value: 'หนองปรือ', viewValue: 'หนองปรือ', prvCode: '56' },
    { value: 'ห้วยกระเจา', viewValue: 'ห้วยกระเจา', prvCode: '56' },
    { value: 'สาขาตำบลท่ากระดาน*', viewValue: 'สาขาตำบลท่ากระดาน*', prvCode: '56' },
    { value: '*บ้านทวน จ.กาญจนบุรี', viewValue: '*บ้านทวน จ.กาญจนบุรี', prvCode: '56' },
    { value: 'เมืองสุพรรณบุรี', viewValue: 'เมืองสุพรรณบุรี', prvCode: '57' },
    { value: 'เดิมบางนางบวช', viewValue: 'เดิมบางนางบวช', prvCode: '57' },
    { value: 'ด่านช้าง', viewValue: 'ด่านช้าง', prvCode: '57' },
    { value: 'บางปลาม้า', viewValue: 'บางปลาม้า', prvCode: '57' },
    { value: 'ศรีประจันต์', viewValue: 'ศรีประจันต์', prvCode: '57' },
    { value: 'ดอนเจดีย์', viewValue: 'ดอนเจดีย์', prvCode: '57' },
    { value: 'สองพี่น้อง', viewValue: 'สองพี่น้อง', prvCode: '57' },
    { value: 'สามชุก', viewValue: 'สามชุก', prvCode: '57' },
    { value: 'อู่ทอง', viewValue: 'อู่ทอง', prvCode: '57' },
    { value: 'หนองหญ้าไซ', viewValue: 'หนองหญ้าไซ', prvCode: '57' },
    { value: 'เมืองนครปฐม', viewValue: 'เมืองนครปฐม', prvCode: '58' },
    { value: 'กำแพงแสน', viewValue: 'กำแพงแสน', prvCode: '58' },
    { value: 'นครชัยศรี', viewValue: 'นครชัยศรี', prvCode: '58' },
    { value: 'ดอนตูม', viewValue: 'ดอนตูม', prvCode: '58' },
    { value: 'บางเลน', viewValue: 'บางเลน', prvCode: '58' },
    { value: 'สามพราน', viewValue: 'สามพราน', prvCode: '58' },
    { value: 'พุทธมณฑล', viewValue: 'พุทธมณฑล', prvCode: '58' },
    { value: 'เมืองสมุทรสาคร', viewValue: 'เมืองสมุทรสาคร', prvCode: '59' },
    { value: 'กระทุ่มแบน', viewValue: 'กระทุ่มแบน', prvCode: '59' },
    { value: 'บ้านแพ้ว', viewValue: 'บ้านแพ้ว', prvCode: '59' },
    { value: 'เมืองสมุทรสงคราม', viewValue: 'เมืองสมุทรสงคราม', prvCode: '60' },
    { value: 'บางคนที', viewValue: 'บางคนที', prvCode: '60' },
    { value: 'อัมพวา', viewValue: 'อัมพวา', prvCode: '60' },
    { value: 'เมืองเพชรบุรี', viewValue: 'เมืองเพชรบุรี', prvCode: '61' },
    { value: 'เขาย้อย', viewValue: 'เขาย้อย', prvCode: '61' },
    { value: 'หนองหญ้าปล้อง', viewValue: 'หนองหญ้าปล้อง', prvCode: '61' },
    { value: 'ชะอำ', viewValue: 'ชะอำ', prvCode: '61' },
    { value: 'ท่ายาง', viewValue: 'ท่ายาง', prvCode: '61' },
    { value: 'บ้านลาด', viewValue: 'บ้านลาด', prvCode: '61' },
    { value: 'บ้านแหลม', viewValue: 'บ้านแหลม', prvCode: '61' },
    { value: 'แก่งกระจาน', viewValue: 'แก่งกระจาน', prvCode: '61' },
    { value: 'เมืองประจวบคีรีขันธ์', viewValue: 'เมืองประจวบคีรีขันธ์', prvCode: '62' },
    { value: 'กุยบุรี', viewValue: 'กุยบุรี', prvCode: '62' },
    { value: 'ทับสะแก', viewValue: 'ทับสะแก', prvCode: '62' },
    { value: 'บางสะพาน', viewValue: 'บางสะพาน', prvCode: '62' },
    { value: 'บางสะพานน้อย', viewValue: 'บางสะพานน้อย', prvCode: '62' },
    { value: 'ปราณบุรี', viewValue: 'ปราณบุรี', prvCode: '62' },
    { value: 'หัวหิน', viewValue: 'หัวหิน', prvCode: '62' },
    { value: 'สามร้อยยอด', viewValue: 'สามร้อยยอด', prvCode: '62' },
    { value: 'เมืองนครศรีธรรมราช', viewValue: 'เมืองนครศรีธรรมราช', prvCode: '63' },
    { value: 'พรหมคีรี', viewValue: 'พรหมคีรี', prvCode: '63' },
    { value: 'ลานสกา', viewValue: 'ลานสกา', prvCode: '63' },
    { value: 'ฉวาง', viewValue: 'ฉวาง', prvCode: '63' },
    { value: 'พิปูน', viewValue: 'พิปูน', prvCode: '63' },
    { value: 'เชียรใหญ่', viewValue: 'เชียรใหญ่', prvCode: '63' },
    { value: 'ชะอวด', viewValue: 'ชะอวด', prvCode: '63' },
    { value: 'ท่าศาลา', viewValue: 'ท่าศาลา', prvCode: '63' },
    { value: 'ทุ่งสง', viewValue: 'ทุ่งสง', prvCode: '63' },
    { value: 'นาบอน', viewValue: 'นาบอน', prvCode: '63' },
    { value: 'ทุ่งใหญ่', viewValue: 'ทุ่งใหญ่', prvCode: '63' },
    { value: 'ปากพนัง', viewValue: 'ปากพนัง', prvCode: '63' },
    { value: 'ร่อนพิบูลย์', viewValue: 'ร่อนพิบูลย์', prvCode: '63' },
    { value: 'สิชล', viewValue: 'สิชล', prvCode: '63' },
    { value: 'ขนอม', viewValue: 'ขนอม', prvCode: '63' },
    { value: 'หัวไทร', viewValue: 'หัวไทร', prvCode: '63' },
    { value: 'บางขัน', viewValue: 'บางขัน', prvCode: '63' },
    { value: 'ถ้ำพรรณรา', viewValue: 'ถ้ำพรรณรา', prvCode: '63' },
    { value: 'จุฬาภรณ์', viewValue: 'จุฬาภรณ์', prvCode: '63' },
    { value: 'พระพรหม', viewValue: 'พระพรหม', prvCode: '63' },
    { value: 'นบพิตำ', viewValue: 'นบพิตำ', prvCode: '63' },
    { value: 'ช้างกลาง', viewValue: 'ช้างกลาง', prvCode: '63' },
    { value: 'เฉลิมพระเกียรติ', viewValue: 'เฉลิมพระเกียรติ', prvCode: '63' },
    { value: 'เชียรใหญ่ (สาขาตำบลเสือหึง)*', viewValue: 'เชียรใหญ่ (สาขาตำบลเสือหึง)*', prvCode: '63' },
    { value: 'สาขาตำบลสวนหลวง**', viewValue: 'สาขาตำบลสวนหลวง**', prvCode: '63' },
    { value: 'ร่อนพิบูลย์ (สาขาตำบลหินตก)*', viewValue: 'ร่อนพิบูลย์ (สาขาตำบลหินตก)*', prvCode: '63' },
    { value: 'หัวไทร (สาขาตำบลควนชะลิก)*', viewValue: 'หัวไทร (สาขาตำบลควนชะลิก)*', prvCode: '63' },
    { value: 'ทุ่งสง (สาขาตำบลกะปาง)*', viewValue: 'ทุ่งสง (สาขาตำบลกะปาง)*', prvCode: '63' },
    { value: 'เมืองกระบี่', viewValue: 'เมืองกระบี่', prvCode: '64' },
    { value: 'เขาพนม', viewValue: 'เขาพนม', prvCode: '64' },
    { value: 'เกาะลันตา', viewValue: 'เกาะลันตา', prvCode: '64' },
    { value: 'คลองท่อม', viewValue: 'คลองท่อม', prvCode: '64' },
    { value: 'อ่าวลึก', viewValue: 'อ่าวลึก', prvCode: '64' },
    { value: 'ปลายพระยา', viewValue: 'ปลายพระยา', prvCode: '64' },
    { value: 'ลำทับ', viewValue: 'ลำทับ', prvCode: '64' },
    { value: 'เหนือคลอง', viewValue: 'เหนือคลอง', prvCode: '64' },
    { value: 'เมืองพังงา', viewValue: 'เมืองพังงา', prvCode: '65' },
    { value: 'เกาะยาว', viewValue: 'เกาะยาว', prvCode: '65' },
    { value: 'กะปง', viewValue: 'กะปง', prvCode: '65' },
    { value: 'ตะกั่วทุ่ง', viewValue: 'ตะกั่วทุ่ง', prvCode: '65' },
    { value: 'ตะกั่วป่า', viewValue: 'ตะกั่วป่า', prvCode: '65' },
    { value: 'คุระบุรี', viewValue: 'คุระบุรี', prvCode: '65' },
    { value: 'ทับปุด', viewValue: 'ทับปุด', prvCode: '65' },
    { value: 'ท้ายเหมือง', viewValue: 'ท้ายเหมือง', prvCode: '65' },
    { value: 'เมืองภูเก็ต', viewValue: 'เมืองภูเก็ต', prvCode: '66' },
    { value: 'กะทู้', viewValue: 'กะทู้', prvCode: '66' },
    { value: 'ถลาง', viewValue: 'ถลาง', prvCode: '66' },
    { value: '*ทุ่งคา', viewValue: '*ทุ่งคา', prvCode: '66' },
    { value: 'เมืองสุราษฎร์ธานี', viewValue: 'เมืองสุราษฎร์ธานี', prvCode: '67' },
    { value: 'กาญจนดิษฐ์', viewValue: 'กาญจนดิษฐ์', prvCode: '67' },
    { value: 'ดอนสัก', viewValue: 'ดอนสัก', prvCode: '67' },
    { value: 'เกาะสมุย', viewValue: 'เกาะสมุย', prvCode: '67' },
    { value: 'เกาะพะงัน', viewValue: 'เกาะพะงัน', prvCode: '67' },
    { value: 'ไชยา', viewValue: 'ไชยา', prvCode: '67' },
    { value: 'ท่าชนะ', viewValue: 'ท่าชนะ', prvCode: '67' },
    { value: 'คีรีรัฐนิคม', viewValue: 'คีรีรัฐนิคม', prvCode: '67' },
    { value: 'บ้านตาขุน', viewValue: 'บ้านตาขุน', prvCode: '67' },
    { value: 'พนม', viewValue: 'พนม', prvCode: '67' },
    { value: 'ท่าฉาง', viewValue: 'ท่าฉาง', prvCode: '67' },
    { value: 'บ้านนาสาร', viewValue: 'บ้านนาสาร', prvCode: '67' },
    { value: 'บ้านนาเดิม', viewValue: 'บ้านนาเดิม', prvCode: '67' },
    { value: 'เคียนซา', viewValue: 'เคียนซา', prvCode: '67' },
    { value: 'เวียงสระ', viewValue: 'เวียงสระ', prvCode: '67' },
    { value: 'พระแสง', viewValue: 'พระแสง', prvCode: '67' },
    { value: 'พุนพิน', viewValue: 'พุนพิน', prvCode: '67' },
    { value: 'ชัยบุรี', viewValue: 'ชัยบุรี', prvCode: '67' },
    { value: 'วิภาวดี', viewValue: 'วิภาวดี', prvCode: '67' },
    { value: 'เกาะพงัน (สาขาตำบลเกาะเต่า)*', viewValue: 'เกาะพงัน (สาขาตำบลเกาะเต่า)*', prvCode: '67' },
    { value: '*อ.บ้านดอน จ.สุราษฎร์ธานี', viewValue: '*อ.บ้านดอน จ.สุราษฎร์ธานี', prvCode: '67' },
    { value: 'เมืองระนอง', viewValue: 'เมืองระนอง', prvCode: '68' },
    { value: 'ละอุ่น', viewValue: 'ละอุ่น', prvCode: '68' },
    { value: 'กะเปอร์', viewValue: 'กะเปอร์', prvCode: '68' },
    { value: 'กระบุรี', viewValue: 'กระบุรี', prvCode: '68' },
    { value: 'สุขสำราญ', viewValue: 'สุขสำราญ', prvCode: '68' },
    { value: 'เมืองชุมพร', viewValue: 'เมืองชุมพร', prvCode: '69' },
    { value: 'ท่าแซะ', viewValue: 'ท่าแซะ', prvCode: '69' },
    { value: 'ปะทิว', viewValue: 'ปะทิว', prvCode: '69' },
    { value: 'หลังสวน', viewValue: 'หลังสวน', prvCode: '69' },
    { value: 'ละแม', viewValue: 'ละแม', prvCode: '69' },
    { value: 'พะโต๊ะ', viewValue: 'พะโต๊ะ', prvCode: '69' },
    { value: 'สวี', viewValue: 'สวี', prvCode: '69' },
    { value: 'ทุ่งตะโก', viewValue: 'ทุ่งตะโก', prvCode: '69' },
    { value: 'เมืองสงขลา', viewValue: 'เมืองสงขลา', prvCode: '70' },
    { value: 'สทิงพระ', viewValue: 'สทิงพระ', prvCode: '70' },
    { value: 'จะนะ', viewValue: 'จะนะ', prvCode: '70' },
    { value: 'นาทวี', viewValue: 'นาทวี', prvCode: '70' },
    { value: 'เทพา', viewValue: 'เทพา', prvCode: '70' },
    { value: 'สะบ้าย้อย', viewValue: 'สะบ้าย้อย', prvCode: '70' },
    { value: 'ระโนด', viewValue: 'ระโนด', prvCode: '70' },
    { value: 'กระแสสินธุ์', viewValue: 'กระแสสินธุ์', prvCode: '70' },
    { value: 'รัตภูมิ', viewValue: 'รัตภูมิ', prvCode: '70' },
    { value: 'สะเดา', viewValue: 'สะเดา', prvCode: '70' },
    { value: 'หาดใหญ่', viewValue: 'หาดใหญ่', prvCode: '70' },
    { value: 'นาหม่อม', viewValue: 'นาหม่อม', prvCode: '70' },
    { value: 'ควนเนียง', viewValue: 'ควนเนียง', prvCode: '70' },
    { value: 'บางกล่ำ', viewValue: 'บางกล่ำ', prvCode: '70' },
    { value: 'สิงหนคร', viewValue: 'สิงหนคร', prvCode: '70' },
    { value: 'คลองหอยโข่ง', viewValue: 'คลองหอยโข่ง', prvCode: '70' },
    { value: 'ท้องถิ่นเทศบาลตำบลสำนักขาม', viewValue: 'ท้องถิ่นเทศบาลตำบลสำนักขาม', prvCode: '70' },
    { value: 'เทศบาลตำบลบ้านพรุ*', viewValue: 'เทศบาลตำบลบ้านพรุ*', prvCode: '70' },
    { value: 'เมืองสตูล', viewValue: 'เมืองสตูล', prvCode: '71' },
    { value: 'ควนโดน', viewValue: 'ควนโดน', prvCode: '71' },
    { value: 'ควนกาหลง', viewValue: 'ควนกาหลง', prvCode: '71' },
    { value: 'ท่าแพ', viewValue: 'ท่าแพ', prvCode: '71' },
    { value: 'ละงู', viewValue: 'ละงู', prvCode: '71' },
    { value: 'ทุ่งหว้า', viewValue: 'ทุ่งหว้า', prvCode: '71' },
    { value: 'มะนัง', viewValue: 'มะนัง', prvCode: '71' },
    { value: 'เมืองตรัง', viewValue: 'เมืองตรัง', prvCode: '72' },
    { value: 'กันตัง', viewValue: 'กันตัง', prvCode: '72' },
    { value: 'ย่านตาขาว', viewValue: 'ย่านตาขาว', prvCode: '72' },
    { value: 'ปะเหลียน', viewValue: 'ปะเหลียน', prvCode: '72' },
    { value: 'สิเกา', viewValue: 'สิเกา', prvCode: '72' },
    { value: 'ห้วยยอด', viewValue: 'ห้วยยอด', prvCode: '72' },
    { value: 'วังวิเศษ', viewValue: 'วังวิเศษ', prvCode: '72' },
    { value: 'นาโยง', viewValue: 'นาโยง', prvCode: '72' },
    { value: 'รัษฎา', viewValue: 'รัษฎา', prvCode: '72' },
    { value: 'หาดสำราญ', viewValue: 'หาดสำราญ', prvCode: '72' },
    { value: 'อำเภอเมืองตรัง(สาขาคลองเต็ง)**', viewValue: 'อำเภอเมืองตรัง(สาขาคลองเต็ง)**', prvCode: '72' },
    { value: 'เมืองพัทลุง', viewValue: 'เมืองพัทลุง', prvCode: '73' },
    { value: 'กงหรา', viewValue: 'กงหรา', prvCode: '73' },
    { value: 'เขาชัยสน', viewValue: 'เขาชัยสน', prvCode: '73' },
    { value: 'ตะโหมด', viewValue: 'ตะโหมด', prvCode: '73' },
    { value: 'ควนขนุน', viewValue: 'ควนขนุน', prvCode: '73' },
    { value: 'ปากพะยูน', viewValue: 'ปากพะยูน', prvCode: '73' },
    { value: 'ศรีบรรพต', viewValue: 'ศรีบรรพต', prvCode: '73' },
    { value: 'ป่าบอน', viewValue: 'ป่าบอน', prvCode: '73' },
    { value: 'บางแก้ว', viewValue: 'บางแก้ว', prvCode: '73' },
    { value: 'ป่าพะยอม', viewValue: 'ป่าพะยอม', prvCode: '73' },
    { value: 'ศรีนครินทร์', viewValue: 'ศรีนครินทร์', prvCode: '73' },
    { value: 'เมืองปัตตานี', viewValue: 'เมืองปัตตานี', prvCode: '74' },
    { value: 'โคกโพธิ์', viewValue: 'โคกโพธิ์', prvCode: '74' },
    { value: 'หนองจิก', viewValue: 'หนองจิก', prvCode: '74' },
    { value: 'ปะนาเระ', viewValue: 'ปะนาเระ', prvCode: '74' },
    { value: 'มายอ', viewValue: 'มายอ', prvCode: '74' },
    { value: 'ทุ่งยางแดง', viewValue: 'ทุ่งยางแดง', prvCode: '74' },
    { value: 'สายบุรี', viewValue: 'สายบุรี', prvCode: '74' },
    { value: 'ไม้แก่น', viewValue: 'ไม้แก่น', prvCode: '74' },
    { value: 'ยะหริ่ง', viewValue: 'ยะหริ่ง', prvCode: '74' },
    { value: 'ยะรัง', viewValue: 'ยะรัง', prvCode: '74' },
    { value: 'กะพ้อ', viewValue: 'กะพ้อ', prvCode: '74' },
    { value: 'แม่ลาน', viewValue: 'แม่ลาน', prvCode: '74' },
    { value: 'เมืองยะลา', viewValue: 'เมืองยะลา', prvCode: '75' },
    { value: 'เบตง', viewValue: 'เบตง', prvCode: '75' },
    { value: 'บันนังสตา', viewValue: 'บันนังสตา', prvCode: '75' },
    { value: 'ธารโต', viewValue: 'ธารโต', prvCode: '75' },
    { value: 'ยะหา', viewValue: 'ยะหา', prvCode: '75' },
    { value: 'รามัน', viewValue: 'รามัน', prvCode: '75' },
    { value: 'กาบัง', viewValue: 'กาบัง', prvCode: '75' },
    { value: 'กรงปินัง', viewValue: 'กรงปินัง', prvCode: '75' },
    { value: 'เมืองนราธิวาส', viewValue: 'เมืองนราธิวาส', prvCode: '76' },
    { value: 'ตากใบ', viewValue: 'ตากใบ', prvCode: '76' },
    { value: 'บาเจาะ', viewValue: 'บาเจาะ', prvCode: '76' },
    { value: 'ยี่งอ', viewValue: 'ยี่งอ', prvCode: '76' },
    { value: 'ระแงะ', viewValue: 'ระแงะ', prvCode: '76' },
    { value: 'รือเสาะ', viewValue: 'รือเสาะ', prvCode: '76' },
    { value: 'ศรีสาคร', viewValue: 'ศรีสาคร', prvCode: '76' },
    { value: 'แว้ง', viewValue: 'แว้ง', prvCode: '76' },
    { value: 'สุคิริน', viewValue: 'สุคิริน', prvCode: '76' },
    { value: 'สุไหงโก-ลก', viewValue: 'สุไหงโก-ลก', prvCode: '76' },
    { value: 'สุไหงปาดี', viewValue: 'สุไหงปาดี', prvCode: '76' },
    { value: 'จะแนะ', viewValue: 'จะแนะ', prvCode: '76' },
    { value: 'เจาะไอร้อง', viewValue: 'เจาะไอร้อง', prvCode: '76' },
    { value: '*อ.บางนรา จ.นราธิวาส', viewValue: '*อ.บางนรา จ.นราธิวาส', prvCode: '76' }
  ];

  income = [
    { value: '1', viewValue: 'น้อยกว่า 150,000 บาทต่อปี' },
    { value: '3', viewValue: 'ตั้งแต่ 150,000 - 300,000 บาทต่อปี' },
    { value: '4', viewValue: 'ตั้งแต่ 300,000- 450,000 บาทต่อปี' },
    { value: '5', viewValue: 'ตั้งแต่ 450,000 - 600,000 บาทต่อปี' },
    { value: '6', viewValue: 'ตั้งแต่ 600,000 - 1,000,000 บาทต่อปี' },
    { value: '6', viewValue: 'ตั้งแต่ 1,000,000 - 3,000,000 บาทต่อปี' },
    { value: '6', viewValue: 'มากกว่า 3,000,000 บาทต่อปี' },
  ];

  career = [
    { value: '1', viewValue: 'ข้าราชการ' },
    { value: '2', viewValue: 'พนักงานหน่วยงานรัฐ' },
    { value: '3', viewValue: 'พนักงานรัฐวิสาหกิจ' },
    { value: '4', viewValue: 'นักธุรกิจ' },
    { value: '5', viewValue: 'ค้าขาย' },
    { value: '6', viewValue: 'เกษตรกร' },
    { value: '7', viewValue: 'ไม่ได้ประกอบอาชีพ' },
    { value: '8', viewValue: 'อื่นๆ' }
  ];

  studyStatusM1 = [
    { value: '1', viewValue: 'กำลังศึกษาอยู่ชั้นประถมศึกษาปีที่ 6' },
    { value: '2', viewValue: 'สำเร็จการศึกษาระดับชั้นประถมศึกษาปีที่ 6 แล้ว' },
  ];

  studyStatusM4 = [
    { value: '1', viewValue: 'กำลังศึกษาอยู่ระดับชั้นมัธยมศึกษาปีที่ 3' },
    { value: '2', viewValue: 'สำเร็จการศึกษาระดับชั้นมัธยมศึกษาปีที่ 3 แล้ว' },
  ];

  couseM1 = [
    { value: '1', viewValue: 'เลือกแผนวิทยาศาสตร์ - คณิตศาสตร์ (ภาษาไทย)' },
    { value: '2', viewValue: 'เลือกแผนวิทยาศาสตร์ - คณิตศาสตร์ (ภาษาอังกฤษ)' },
    { value: '3', viewValue: 'เลือกทั้งสองแผน' }
  ];

  couseM4 = [
    { value: '1', viewValue: 'เลือกแผนวิทยาศาสตร์ - คณิตศาสตร์' },
    { value: '2', viewValue: 'เลือกแผนภาษาอังกฤษ - คณิตศาสตร์' }
  ];

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



  @Output()
  public fileHoverStart: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  public fileHoverEnd: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  public fileAccepted: EventEmitter<FileManager[]> = new EventEmitter<FileManager[]>();
  @Output()
  public fileRejected: EventEmitter<Error> = new EventEmitter<Error>();
  @Output()
  public progress: EventEmitter<number> = new EventEmitter<number>();

  @Input()
  public fileOptions: FileManagerOptions;
  @Input()
  public maxFiles: number;

  public imageLoaded: boolean = false;

  private _limit: number = -1;
  private _files: FileManager[];

  private _lastFile$: BehaviorSubject<FileManager> = new BehaviorSubject(null);
  private _files$: BehaviorSubject<FileManager[]> = new BehaviorSubject([]);



  public get files(): any {
    let files = this._files$.getValue();
    return files;
  }

  public get latestFile(): any {
    return Utils.asObservable(this._lastFile$);
  }

  public onFileHoverStart(event: any): void {
    this.fileHoverStart.emit(event);
  }

  public onFileHoverEnd(event: any): void {
    this.fileHoverEnd.emit(event);
  }

  public onFileAccepted(event: any): void {
    if (event.length > 0) {
      this.imageLoaded = true;

    }
    this._files$.next(event);
    this.checkClass();
    this.fileAccepted.emit(event);

  }

  public onFileRejected(event: any): void {
    this.fileRejected.emit(event);
  }

  public onProgress(event: number): void {
    this.progress.emit(event);
  }

  private checkClass(): void {
    (this._files.length > 0) ?
      this.renderer.setElementClass(this.element.nativeElement, 'has-files', true) :
      this.renderer.setElementClass(this.element.nativeElement, 'has-files', false);

    this.cleanUp();
  }

  private cleanUp(): void {
    let files = this._files$.getValue();
    for (let key in files) {
      if (files.hasOwnProperty(key)) {
        let file = files[key];
        (!file.inQueue) && files.splice(+key, 1);
      }
    }
    (files.length > 0) && this._lastFile$.next(files[files.length - 1]);
    (files.length === 0) && this._lastFile$.next(null);

    this._files$.next(files);
  }
}
