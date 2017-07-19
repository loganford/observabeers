import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// App Components
import { AppComponent } from './app.component';
import { InventoryComponent, EditAddDialog } from './inventory/inventory.component'
import { StoreComponent } from './store/store.component'

// App Services
import { SourceService } from './shared/source.service'
import { InventoryService } from './inventory/inventory.service'
import { StoreService } from './store/store.service'

// Material Modules
import {MdCardModule, MdButtonModule, MdInputModule, MdSelectModule, MdIconModule, MdDialogModule } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

// Mock Backend
import { backendProvider } from 'backendProvider';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';

const appComponents = [
  AppComponent,
  InventoryComponent,
  StoreComponent,
  EditAddDialog
];

const appServices = [
  SourceService,
  InventoryService,
  StoreService
];

const materialModules = [
  BrowserAnimationsModule,
  MdCardModule,
  MdButtonModule,
  MdInputModule,
  MdSelectModule,
  MdIconModule,
  MdDialogModule
];

const mockBackend = [
  backendProvider,
  MockBackend,
  BaseRequestOptions
];

@NgModule({
  declarations: [
    appComponents
  ],
  entryComponents: [
    EditAddDialog
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    materialModules
  ],
  providers: [ appServices ],
  bootstrap: [AppComponent]
})
export class AppModule { }
