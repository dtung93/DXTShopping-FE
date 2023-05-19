import { HttpClient,HttpEvent,HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl = 'http://localhost:8080/api';
  constructor(private http: HttpClient) { }
  upload(userId:string,file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file)
    formData.append('userId',userId);
    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      reportProgress: true
    });
    return this.http.request(req);
  }
  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }
  deleteFile(userId:string){
    return this.http.delete(`${this.baseUrl}/file/delete/${userId}`)
  }
  getFile(userId:string):Observable<any>{
    return this.http.get(`${this.baseUrl}/file/${userId}`)
  }

}
