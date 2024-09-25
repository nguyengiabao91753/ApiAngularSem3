import { Injectable } from "@angular/core";
import { Data } from "@angular/router";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class BaseUrlService{
  public BASE_URL='https://localhost:7273/api/';
  public LOCAL_URL='https://localhost:7273/';
}