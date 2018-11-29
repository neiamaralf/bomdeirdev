import { Injectable } from "@angular/core";
import * as HTTP from "@angular/common/http";
import { Config } from "../config";

@Injectable()
export class DbService {
 constructor(private http: HTTP.HttpClient) {
 }

 put(jsondata) {
  return this.http.put(encodeURI(Config.apiUrl + "put.php"), { jsondata }, { headers: this.getCommonHeaders("application/json") })
 }

 post(jsondata) {
  return this.http.post(encodeURI(Config.apiUrl + "post.php"), { jsondata }, { headers: this.getCommonHeaders("application/json") })
 }

 delete(params) {
  return this.http.delete(encodeURI(Config.apiUrl + "delete.php?" + params), { headers: this.getCommonHeaders("application/json") })
 }

 get(params) {
  return this.http.get(encodeURI(Config.apiUrl + "get.php?" + params), { headers: this.getCommonHeaders("application/json") });
 }

 geturl(url, contenttype) {
  return this.http.get(encodeURI(url), { headers: this.getCommonHeaders(contenttype) });
 }

 posturl() {
  this.http.post(encodeURI("https://www.athena3d.com.br/bomdeir/clima.php"), "", { headers: this.getCommonHeaders("application/xml") })
   .subscribe(function (response) {
   }, function (e) {
    console.log("Error: " + e);
   });
 }

 getCommonHeaders(contenttype) {
  let headers = new HTTP.HttpHeaders();
  headers.append("Content-Type", contenttype);
  headers.append("Accept", "text/html");
  return headers;
 }
}
