import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

import { ZoomMtg } from '@zoomus/websdk';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

const jwt = require('jsonwebtoken');

ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {  

  apiKey = ''; // Your Zoom API Key
  apiSecret = ''; // Your Zoom API Secret
  meetingNumber = 0; // always generate new when requested or user will input
  role = 1;
  leaveUrl = 'http://localhost:4200'; // Your redirect Url, when meeting over
  userName = 'Zoom Feature';
  userEmail = '';
  meetingPassWord = ''; // set default meeting password here
  joinUrl = "";

  joinMeetingForm: FormGroup;
  createMeetingForm: FormGroup;
  meetingCreated: boolean = false;

  apiBaseUrl = environment.apiBaseUrl;

  constructor(public httpClient: HttpClient, @Inject(DOCUMENT) document, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.joinMeetingCreateForm();
    this.meetingCreateForm();
  }


  meetingCreateForm() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.createMeetingForm = this.formBuilder.group({
      'email': [null, [Validators.required, Validators.pattern(emailregex)]],
      'password': [null],
      'title': [null],
      'agenda': [null]
    });
  }


  joinMeetingCreateForm() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.joinMeetingForm = this.formBuilder.group({
      'email': [null, [Validators.required, Validators.pattern(emailregex)]],
      'meetingId': [null, Validators.required],
      'password': [null, [Validators.required]]
    });
  }

  createNewMeeting(data: any) {
    const payload = {
      iss: this.apiKey,
      exp: ((new Date()).getTime() + 500)
    };

    const zoomAccessToken = jwt.sign(payload, this.apiSecret);

    const request = {
      Token: zoomAccessToken,
      MeetingRequest:
        {
          topic: data.title,
          password: data.password == "" || data.Password == undefined || data.Password == null ? this.meetingPassWord : data.Password,
          agenda: data.agenda
        }
    };    
    this.httpClient.post(`${this.apiBaseUrl}zoomfeature/meetings`, request).toPromise().then((response: any) => {
      this.meetingNumber = response.id;
      this.meetingPassWord = response.password;
      this.joinUrl = response.join_url;
      this.meetingCreated = true;
    }).catch((error) => {
      console.log(error)
    });
  }

  joinMeeting(data: any) {  
    this.meetingNumber = data.meetingId;
    this.meetingPassWord = data.password;
    this.userEmail = data.email;
    this.getSignature();
  }
  getSignature() {
    this.httpClient.get(`${this.apiBaseUrl}zoomfeature/signature/${this.meetingNumber}/${this.role}`).toPromise().then((signature: any) => {
      if (signature) {
        console.log(signature)
        this.startMeeting(signature)
      } else {
        console.log(signature)
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  startMeeting(signature) {
    
    document.getElementById('zmmtg-root').style.display = 'block'

    ZoomMtg.init({
      debug: true,
      leaveUrl: this.leaveUrl, //redirect url after meeting end
      isSupportAV: true,
      isSupportChat: true,
      sharingMode: 'both',
      screenShare: true,
      videoHeader: true,
      success: (success) => {
        console.log(success)

        ZoomMtg.join({
          signature: signature,
          meetingNumber: this.meetingNumber,
          userName: this.userName,
          apiKey: this.apiKey,
          userEmail: this.userEmail, // Email required for Webinars         
          passWord: this.meetingPassWord,  // password optional; set by Host
          success: (success) => {
            console.log(success)
          },
          error: (error) => {
            console.log(error)
          }
        })

      },
      error: (error) => {
        console.log(error)
      }
    })
  }
}
