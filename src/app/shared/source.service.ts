// source.service.ts

import {Injectable, EventEmitter} from '@angular/core';
import {IBeer} from '../models/beer';

@Injectable()
export class SourceService {

  // Locally stored beer inventory, used after beer is fetched from Mock Inventory API
  private inventorySource: IBeer[];

  // Components can subscribe to this emitter to keep their inventory current
  inventorySourceUpdated = new EventEmitter<IBeer[]>();

  setInventorySource(inventory: IBeer[]) {
    // Update the current beer inventory in the app
    this.inventorySource = inventory;

    // Emit the change to the beer inventory throughout the app
    this.inventorySourceUpdated.emit(this.inventorySource);
  }

  getInventorySource(): IBeer[] {
    // Return the locally stored beer inventory
    return this.inventorySource;
  }
}

