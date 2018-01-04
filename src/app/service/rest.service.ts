import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class RESTService {

  /*
  * ตัว แปร _host ใช้กำหนด host ที่จะใช้สื่อสาร back-end
  */
  private _host;

  constructor(private _http: Http) {
    this._host = 'http://www.satit.nu.ac.th/AdmissionEngine/gateway.php';
  }

  RESTPost(param) {
    return new Promise((resolve, reject) => {
      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      return this._http.post(this._host, this.packParameter(param), { headers: headers }).map((res: Response) => {
        console.log(res);
        try {
          var json = res.json();
          json.headers = res.headers;
        } catch (err) {
          const json = {
            operation: "fail"
          };
        }

        return json;
      }).subscribe((data) => {
        resolve(data);
      }, error => {
        return reject(error);
      });
    });
  }

  private packParameter(param) {
    var _parameter = Object.keys(param).map(function (key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(param[key]);
    }).join('&');
    return _parameter;
  }

  getStatusAdmission(param) {
    return new Promise((resolve, reject) => {
      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      return this._http.post(this._host, this.packParameter(param), { headers: headers }).map((res: Response) => {
        // console.log(res);
        try {
          var json = res.json();
          json.headers = res.headers;
        } catch (err) {
          const json = {
            operation: "fail"
          };
        }

        return json;
      }).subscribe((data) => {
        resolve(data);
      }, error => {
        return reject(error);
      });
    });
  }

  getAccountData(param) {
    return new Promise((resolve, reject) => {
      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      return this._http.post(this._host, this.packParameter(param), { headers: headers }).map((res: Response) => {
        // console.log(res);
        try {
          var json = res.json();
          json.headers = res.headers;
        } catch (err) {
          const json = {
            operation: "fail"
          };
        }
        return json;
      }).subscribe((data) => {
        resolve(data);
      }, error => {
        return reject(error);
      });
    });
  }

  saveAccountData(param) {
    return new Promise((resolve, reject) => {
      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      return this._http.post(this._host, this.packParameter(param), { headers: headers }).map((res: Response) => {
        var json = res.json();
        json.headers = res.headers;
        return json;
      }).subscribe((data) => {
        resolve(data);
      }, error => {
        return reject(error);
      });
    });
  }

  createNewAccount(param) {
    return new Promise((resolve, reject) => {
      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      return this._http.post(this._host, this.packParameter(param), { headers: headers }).map((res: Response) => {
        var json = res.json();
        json.headers = res.headers;
        return json;
      }).subscribe((data) => {
        resolve(data);
      }, error => {
        return reject(error);
      });
    });
  }
}
