// store.component.ts

import {StoreService} from './store.service';
import {Component, OnInit, Input, ChangeDetectionStrategy} from '@angular/core';
import {SourceService} from "../shared/source.service";
import {IBeer} from "../models/beer";

@Component({
  moduleId: module.id,
  selector: 'store',
  templateUrl: 'store.component.html',
  styleUrls: ['store.component.css', '../app.component.css'],
  providers: [StoreService],
  // Do not include "SourceService" as a provider so that it is shared across the app as a singleton
  changeDetection: ChangeDetectionStrategy.Default
})

export class StoreComponent implements OnInit  {

  private inventory: IBeer[] = [];
  private quantityOptions = [6, 12, 24, 48, 100];

  constructor(private sourceService: SourceService,
              private storeService: StoreService) {}

  ngOnInit() {
    // Get fetched beer inventory on init
    this.inventory = this.sourceService.getInventorySource();

    // Subscribe to any changes made locally to the beer inventory
    this.sourceService.inventorySourceUpdated.subscribe(
      (beers) => {
        // Set beer inventory for store component to match the updated inventory
        this.inventory = beers;
      }
    );
  }

  order(beerId: number){
    // Geet quantity to order
    let orderQuantity = 0;
    this.inventory.forEach(function(beer){
      if(beer.id == beerId){
       orderQuantity = beer.orderQuantity;
      }
    });
    this.storeService.order(beerId, orderQuantity).subscribe(
      (newInventory) => {
        this.sourceService.setInventorySource(newInventory);
      }
    )
  }

}
