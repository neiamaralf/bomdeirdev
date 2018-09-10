import { Injectable } from "@angular/core";
import * as HTTP from "@angular/common/http";
import { Config } from "../config";

@Injectable()
export class DbService {
  constructor(private http: HTTP.HttpClient) {

  }

  __encodeURI(url:string){        
    return encodeURI(url)
}

  put(jsondata) {
    return this.http.put(Config.apiUrl + "put.php", { jsondata }, { headers: this.getCommonHeaders("application/json") })
     
  }

  post(jsondata) {
    /*return fetch(Config.apiUrl + "post.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsondata)})*/
    return this.http.post(Config.apiUrl + "post.php", { jsondata }, { headers: this.getCommonHeaders("application/json") })
     
  }

  delete(params) {
    return this.http.delete(Config.apiUrl + "delete.php?" + params, { headers: this.getCommonHeaders("application/json") })
      
  }


  get(params) {
    
    return this.http.get(Config.apiUrl + "get.php?" + params, { headers: this.getCommonHeaders("application/json") });
  }

  geturl(url,contenttype) {
    return this.http.get(encodeURI(url), { headers: this.getCommonHeaders(contenttype) });
  }

  getCommonHeaders(contenttype) {
    let headers = new HTTP.HttpHeaders();
    headers.append("Content-Type", contenttype);
    return headers;
  }
}
