import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, Loading, Toast, Storage, LocalStorage } from 'ionic-angular';

import {Configure} from '../../providers/configure/configure';
import {Encrypt} from '../../providers/encrypt/encrypt';

import {Hhc} from '../../providers/hhc/hhc';

/*
  Generated class for the HhcEntryPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/hhc-entry/hhc-entry.html',
  providers: [Configure, Encrypt, Hhc]
})
export class HhcEntryPage implements OnInit {
  communityServices;

  communitySeviceId;
  fbs; pluse;
  sbp; dbp; 
  weight; height;
  cc; advice;
  dateServ; timeServ;
  url;
  localStorage;
  hashKey;

  constructor(
    private nav: NavController,
    private hhc: Hhc,
    private configure: Configure,
    private encrypt: Encrypt,
    private navParams: NavParams
  ) {

    this.communityServices = [];
    this.hashKey = this.navParams.get('hashKey');
    this.localStorage = new Storage(LocalStorage);
  }
  
  ngOnInit() {
    this.url = this.configure.getUrl();

    let loading = Loading.create({
      content: 'Please wait...'
    });

     this.nav.present(loading);
    
    let _url = `${this.url}/basic/community-service-type`;
    this.hhc.getCommunityServiceType(_url)
      .then(data => {
        this.communityServices = data;
        // console.log(this.communityServices)
        loading.dismiss();
      });
  }

  save() {
    let params = {
      communityServiceId: this.communitySeviceId,
      hashKey: this.hashKey,
      dbp: this.dbp,
      sbp: this.sbp,
      height: this.height,
      weight: this.weight,
      pluse: this.pluse,
      fbs: this.fbs,
      cc: this.cc,
      advice: this.advice,
      dateServ: this.dateServ,
      timeServ: this.timeServ
    };

    if (params.communityServiceId && params.hashKey && params.sbp && params.dbp && params.height && params.weight) {

      let _params = this.encrypt.encrypt(params);
      console.log(_params);

      let url = `${this.url}/api/doctor/hhc`;
      
      this.localStorage.get('token')
        .then(token => {
          //console.log(token);
          //console.log(url);

          this.hhc.save(url, token, _params)
            .then(() => {
              this.nav.pop();
            }, err => {
              let toast = Toast.create({
                message: 'เกิดข้อผิดพลาด ' + JSON.stringify(err),
                duration: 3000,
                position: 'top'
              });

              this.nav.present(toast);
            });
        
        });
      
    } else {

      let toast = Toast.create({
        message: 'ข้อมูลไม่สมบูรณ์',
        duration: 3000,
        position: 'top'
      });

      this.nav.present(toast);
      
    }
  }
}
