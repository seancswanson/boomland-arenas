import { WindowRefService } from "../../services/window-ref.service";
import { ElementRef, Injectable, NgZone } from "@angular/core";
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
import "babylonjs-materials";

@Injectable({
  providedIn: "root",
})
export class EngineService {
  private canvas: HTMLCanvasElement;
  private engine: Engine;
  private camera: FreeCamera;
  private scene: Scene;
  private light: Light;

  private sphere: Mesh;

  public constructor(
    private ngZone: NgZone,
    private windowRef: WindowRefService
  ) {}

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
    // Create a basic BJS Scene object
    this.scene = new Scene(this.engine);
    // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
    this.camera = new FreeCamera("camera1", new Vector3(0, 5, -10), this.scene);
    // Target the camera to scene origin
    this.camera.setTarget(Vector3.Zero());
    // Attach the camera to the canvas
    this.camera.attachControl(this.canvas, false);
    // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
    this.light = new HemisphericLight(
      "light1",
      new Vector3(0, 1, 0),
      this.scene
    );
    // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
    this.sphere = Mesh.CreateSphere(
      "sphere1",
      16,
      2,
      this.scene,
      false,
      Mesh.FRONTSIDE
    );

    console.log("createScene", this.canvas, this.engine);
    return this.scene;
  }

  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      const rendererLoopCallback = () => {
        this.scene.render();
      };

      if (this.windowRef.document.readyState !== "loading") {
        this.engine.runRenderLoop(rendererLoopCallback);
      } else {
        this.windowRef.window.addEventListener("DOMContentLoaded", () => {
          this.engine.runRenderLoop(rendererLoopCallback);
        });
      }

      this.windowRef.window.addEventListener("resize", () => {
        this.engine.resize();
      });
    });
  }
}
