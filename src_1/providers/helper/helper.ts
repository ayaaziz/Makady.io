import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class HelperProvider {
  langdirection:any="ltr"
  accesstoken:any
  type:any
  serviceurl:any="http://itrootsdemos.com/makady/phase1/api/"
  constructor(public http: HttpClient) {
    console.log('Hello HelperProvider Provider');
  }

}
