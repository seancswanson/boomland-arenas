import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class EngineService {
  constructor() {}

  /**
   * sayHi
   */
  public sayHi() {
    alert("Hi!");
  }
}
