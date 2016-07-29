import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import {ChatBoxPage} from '../chat-box/chat-box';

@Component({
  templateUrl: 'build/pages/chat/chat.html',
})
export class ChatPage {
  isAndroid: boolean = false;

  constructor(private nav: NavController, private platform: Platform) {
    this.isAndroid = this.platform.is('android');
  }

  goChat() {
    this.nav.push(ChatBoxPage);
  }

}
