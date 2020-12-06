import { ElementRef, Injectable } from "@angular/core";
import {
  Engine,
  FreeCamera,
  Scene,
  Light,
  Mesh,
  Color3,
  Color4,
  Vector3,
  HemisphericLight,
  StandardMaterial,
  Texture,
  DynamicTexture,
  Camera,
} from "babylonjs";

@Injectable({
  providedIn: "root",
})
export class EngineService {
  private canvas: HTMLCanvasElement;
  private engine: Engine;

  constructor() {}

  /**
   * createScene creates and returns the scene
   */
  public createScene(canvas: ElementRef<HTMLCanvasElement>) {
    // Get the canvas DOM element
    this.canvas = canvas.nativeElement;
    // Load the 3d engine
    this.engine = new Engine(this.canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
    });
    // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
    console.log("createScene", this.canvas, this.engine);
  }
}
