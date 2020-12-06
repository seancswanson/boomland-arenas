import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { EngineComponent } from "./engine/engine.component";
import { UiComponent } from "./ui/ui.component";
import { WindowRefService } from "./services/window-ref.service";

@NgModule({
  declarations: [AppComponent, EngineComponent, UiComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [WindowRefService],
  bootstrap: [AppComponent],
})
export class AppModule {}
