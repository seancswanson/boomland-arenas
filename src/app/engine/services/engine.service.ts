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
  ArcRotateCamera,
  FreeCameraMouseInput,
  ArcRotateCameraPointersInput,
  SceneLoader,
  MeshBuilder,
} from "babylonjs";
import "babylonjs-materials";

@Injectable({
  providedIn: "root",
})
export class EngineService {
  private canvas: HTMLCanvasElement;
  private engine: Engine;
  private camera: ArcRotateCamera;
  private scene: Scene;
  private light: Light;

  private sphere: Mesh;
  private ground: Mesh;
  private distance: number;
  private aspect: number;
  private logo: any;
  private rot_state: { x: number; y: number };
  bgBox: Mesh;

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
    this.camera = new ArcRotateCamera(
      "Camera",
      0,
      Math.PI / 6,
      25,
      Vector3.Zero(),
      this.scene
    );

    this.setCameraRotationRestraints();
    this.setCameraInputRestraints();
    this.createUi();

    // Set distance unit.
    this.distance = 20;

    // Calculate aspect ration of scene.
    this.aspect =
      this.scene.getEngine().getRenderingCanvasClientRect().height /
      this.scene.getEngine().getRenderingCanvasClientRect().width;

    // Attach the camera to the canvas
    this.camera.attachControl(this.canvas, false);
    // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
    this.light = new HemisphericLight(
      "light1",
      new Vector3(0, 1, 0),
      this.scene
    );
    this.light.intensity = 0.7;

    // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
    this.sphere = Mesh.CreateSphere(
      "sphere1",
      16,
      2,
      this.scene,
      false,
      Mesh.FRONTSIDE
    );
    // Move the sphere upward 1/2 of its height
    this.sphere.position.y = 1;

    // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable
    this.ground = Mesh.CreateGround("ground1", 6, 6, 2, this.scene, false);
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

  public setCameraRotationRestraints() {
    // Hold on to the rotation of the camera to use when we register it before render.
    this.rot_state = { x: this.camera.alpha, y: this.camera.beta };

    // Limit latitudinal (horizontal) panning by keeping the value static on creation.
    this.camera.upperBetaLimit = this.camera.beta;

    this.scene.registerBeforeRender(() => {
      if (this.rot_state) {
        this.camera.alpha = this.rot_state.x;
      }
    });
  }

  public setCameraInputRestraints() {
    // Remove all default inputs.
    this.camera.inputs.clear();

    // Add back pointer inputs to enable moving the camera with your mouse or finger only.
    this.camera.inputs.add(new ArcRotateCameraPointersInput());
  }

  public createUi() {
    // Splash BG Box
    this.bgBox = MeshBuilder.CreateBox(
      "bg-box",
      { width: 10, height: 0.25, depth: 10 },
      this.scene
    );
    this.bgBox.position.y = 9;
    // Boomland: Arenas logo
    SceneLoader.ImportMesh(
      "",
      "../../assets/",
      "boomland_logo.babylon",
      this.scene,
      (newMeshes) => {
        console.log(typeof newMeshes);
        this.logo = newMeshes[0];
        this.logo.rotation.y = -Math.PI / 2;
        this.logo.position.y = 10;
      }
    );
  }
}
