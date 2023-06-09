import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LobbyRoutingModule } from './lobby-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LobbyComponent } from './lobby.component';


@NgModule({
  declarations: [
    LobbyComponent
  ],
  imports: [
    CommonModule,
    LobbyRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class LobbyModule { }
