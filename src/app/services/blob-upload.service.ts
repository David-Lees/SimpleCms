import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlobUploadService {
  constructor(private http: HttpClient, public adalService: MsAdalAngular6Service) {}

  getUserDelegationKey(): Observable<any> {
    const headers = {
      'Authorization': 'bearer ' + this.adalService.accessToken,
      'x-ms-version': '2017-11-09',
    };
    return this.http.post(`${environment.apiUrl}/api/GetSasToken`, '', { headers });
  }
}
