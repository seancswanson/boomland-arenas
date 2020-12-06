import { ElementRef, Injectable } from "@angular/core";
import * as BABYLON from "babylonjs";

@Injectable({
  providedIn: "root",
})
export class EngineService {
  constructor() {}

  /**
   * createScene
   */
  public createScene(canvas: ElementRef<HTMLCanvasElement>) {
    console.log("createScene", canvas);
  }
}
