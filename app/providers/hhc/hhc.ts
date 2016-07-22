import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Hhc provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Hhc {
  url;

  constructor(private http: Http) {
  
  }

  getCommunityServiceType(url) {
    this.url = url;

    return new Promise((resolve, reject) => {

      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });

      this.http.get(url)
        .map(res => res.json())
        .subscribe(data => {
          if (data.ok) {
            resolve(data.rows);
          } else {
            reject(data.msg);
          }
        }, error => reject(error))
    })
  }

  save(url, token, params) {
    this.url = url;
    
    return new Promise((resolve, reject) => {

      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      let body = { params: params, token: token };
      
      this.http.post(url, body, options)
        .map(res => res.json())
        .subscribe(data => {
          if (data.ok) {
            resolve();
          } else {
            reject(data.msg);
          }
        }, error => reject(error))
    });

  }

  update(url, token, params) {
    this.url = url;
    
    return new Promise((resolve, reject) => {

      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      let body = { params: params, token: token };
      
      this.http.put(url, body, options)
        .map(res => res.json())
        .subscribe(data => {
          if (data.ok) {
            resolve();
          } else {
            reject(data.msg);
          }
        }, error => reject(error))
    });

  }

  remove(url, token, params) {
    this.url = url;
    
    return new Promise((resolve, reject) => {

      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      let body = { params: params, token: token };
      
      this.http.post(url, body, options)
        .map(res => res.json())
        .subscribe(data => {
          if (data.ok) {
            resolve();
          } else {
            reject(data.msg);
          }
        }, error => reject(error))
    });
    
  }

  search(url, token, params) {
    this.url = url;
    
    return new Promise((resolve, reject) => {

      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      let body = { params: params, token: token };
      
      this.http.post(url, body, options)
        .map(res => res.json())
        .subscribe(data => {
          if (data.ok) {
            resolve(data.rows);
          } else {
            reject(data.msg);
          }
        }, error => reject(error))
    });

  }

  getHhcHistory(url, token, params) {
    this.url = url;
    
    return new Promise((resolve, reject) => {

      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      let body = { params: params, token: token };
      
      this.http.post(url, body, options)
        .map(res => res.json())
        .subscribe(data => {
          if (data.ok) {
            resolve(data.rows);
          } else {
            reject(data.msg);
          }
        }, error => reject(error))
    });

  }

  getHhcDetail(url, token, id) {
    this.url = url;
    
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let body = { id: id, token: token };
    
    return new Promise((resolve, reject) => {
      this.http.post(url, body, options)
        .map(res => res.json())
        .subscribe(data => {
          if (data.ok) {
            resolve(data.rows);
          } else {
            reject(data.msg);
          }
        }, error => reject(error))
    });

  }

}

