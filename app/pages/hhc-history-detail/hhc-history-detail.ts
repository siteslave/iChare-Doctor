import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, Alert, Loading, Toast, Storage, LocalStorage } from 'ionic-angular';
import * as moment from 'moment';

import {Hhc} from '../../providers/hhc/hhc';
import {Configure} from '../../providers/configure/configure';
import {Encrypt} from '../../providers/encrypt/encrypt';
/*
  Generated class for the HhcHistoryDetailPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
interface HHCDetail {
  advice: string,
  fbs: any,
  cc: any,
  sbp: any,
  dbp: any,
  weight: any,
  height: any,
  date_serv: any,
  time_serv: any,
  community_service_id: any,
  pluse: any
}

@Component({
  templateUrl: 'build/pages/hhc-history-detail/hhc-history-detail.html',
  providers: [Configure, Encrypt, Hhc]
})

export class HhcHistoryDetailPage implements OnInit{
  localStorage;
  url;
  id;
  history;

  communityServices;

  communitySeviceId;
  fbs; pluse;
  sbp; dbp; 
  weight; height;
  cc; advice;
  dateServ; timeServ;

  constructor(
    private nav: NavController,
    private navParams: NavParams,
    private configure: Configure,
    private encrypt: Encrypt,
    private hhc: Hhc
  ) {
    this.id = this.navParams.get('id');
    console.log(this.id);
    this.url = this.configure.getUrl();

    this.localStorage = new Storage(LocalStorage);
  }

  ngOnInit() {

    let loading = Loading.create({
      content: 'Please wait...'
    });

    this.nav.present(loading);
    
    let url = `${this.url}/api/doctor/hhc/detail`;
    let _url = `${this.url}/basic/community-service-type`;

    this.localStorage.get('token')
      .then(token => {
        this.hhc.getCommunityServiceType(_url)
          .then(data => {
            this.communityServices = data;
            return this.hhc.getHhcDetail(url, token, this.id);
          })
          .then(detail => {
            let data = <HHCDetail>detail;
            console.log(data);
            this.cc = data.cc;
            this.advice = data.advice;
            this.pluse = data.pluse;
            this.communitySeviceId = data.community_service_id;
            this.sbp = data.sbp;
            this.dbp = data.dbp;
            this.weight = data.weight;
            this.height = data.height;
            this.fbs = data.fbs;
            this.dateServ = moment(data.date_serv).format('YYYY-MM-DD');
            this.timeServ = moment(data.time_serv, 'HH:mm:ss').format('HH:mm');

            loading.dismiss();
          }, err => {
            loading.dismiss();
            let toast = Toast.create({
              message: 'เกิดข้อผิดพลาด ' + JSON.stringify(err),
              duration: 3000,
              position: 'top'
            });

            this.nav.present(toast);
          });  
    })
  }

  remove() {

    let confirm = Alert.create({
      title: 'ยืนยันการลบ?',
      message: 'คุณต้องการลบรายการนี้ ใช่หรือไม่?',
      buttons: [
        {
          text: 'ใช่',
          handler: () => {
            let params = this.encrypt.encrypt({ id: this.id });
            console.log(params);

            let url = `${this.url}/api/doctor/hhc/delete`;
      
            this.localStorage.get('token')
              .then(token => {
                //console.log(token);
                //console.log(url);

                this.hhc.remove(url, token, params)
                  .then(() => {
                    let toast = Toast.create({
                      message: 'ลบรายการเสร็จเรียบร้อย',
                      duration: 3000,
                      position: 'top'
                    });

                    this.nav.present(toast);
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
          }
        },
        {
          text: 'ไม่ใช่',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });

    this.nav.present(confirm);    
    
  }

  save() {
    let params = {
      id: this.id,
      communityServiceId: this.communitySeviceId,
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

    if (params.communityServiceId && params.sbp && params.dbp && params.height && params.weight) {

      let _params = this.encrypt.encrypt(params);
      console.log(_params);

      let url = `${this.url}/api/doctor/hhc`;
      
      this.localStorage.get('token')
        .then(token => {
          //console.log(token);
          //console.log(url);

          this.hhc.update(url, token, _params)
            .then(() => {
               let toast = Toast.create({
                message: 'บันทึกเสร็จเรียบร้อย',
                duration: 3000,
                position: 'top'
              });

              this.nav.present(toast);
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
