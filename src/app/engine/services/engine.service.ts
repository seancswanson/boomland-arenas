import { ElementRef, Injectable } from "@angular/core";
import * as BABYLON from "babylonjs";

@Injectable({
  providedIn: "root",
})
export class EngineService {
  private canvas: HTMLCanvasElement;
  constructor() {}

  /**
   * createScene
   */
  public createScene(canvas: ElementRef<HTMLCanvasElement>) {
    this.canvas = canvas.nativeElement;
    console.log("createScene", this.canvas);
  }
}
