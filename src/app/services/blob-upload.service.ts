import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import * as moment from 'moment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class BlobUploadService {
  constructor(private http: HttpClient, public adalService: MsAdalAngular6Service) {}

  getUserDelegationKey(): Observable<any> {
    const url = environment.storageUrl + '/?restype=service&comp=userdelegationkey&timeout=120';
    const headers = {
      Authorization: 'bearer ' + this.adalService.accessToken,
      'x-ms-version': '2017-11-09',
    };
    return this.http.post('https://davidleesapi.azurewebsites.net/api/GetSasToken', '', { headers: headers })
  }

  

}
