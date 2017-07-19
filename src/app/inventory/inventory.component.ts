// inventory.component.ts

import {InventoryService} from './inventory.service';
import {Component, OnInit, ChangeDetectionStrategy, Inject} from '@angular/core';
import {SourceService} from "../shared/source.service";
import {IBeer} from "../models/beer";
import {MdDialog, MdDialogRef, MD_DIALOG_DATA, MdDialogConfig} from "@angular/material";

@Component({
  moduleId: module.id,
  selector: 'inventory',
  templateUrl: 'inventory.component.html',
  styleUrls: ['inventory.component.css', '../app.component.css'],
  providers: [InventoryService],
  // Do not include "SourceService" as a provider so that it is shared across the app as a singleton
  changeDetection: ChangeDetectionStrategy.Default
})

export class InventoryComponent implements OnInit  {

  public inventory: IBeer[] = [];
  private editingBeers: number[] = [];

  constructor(private inventoryService: InventoryService,
              private sourceService: SourceService,
              public dialog: MdDialog) {}

  ngOnInit() {
    // Subscribe to any changes made to the locally stored beer inventory (including changes made from this component)
    this.sourceService.inventorySourceUpdated.subscribe(
      (beers) => {
        this.inventory = beers;
      }
    );

    // Fetch beer inventory from Mock Inventory API Service on init
    this.getBeers();
  }

  getBeers() {
    this.inventoryService.getBeers().subscribe(
      (beers) => {
        // If beers successfully return, update the source service
        this.sourceService.setInventorySource(beers);
      }
    );
  }

  addBeer(beer: IBeer) {
    this.inventoryService.addBeer(beer).subscribe(
      (newInventory) => {
        this.sourceService.setInventorySource(newInventory);
      }
    )
  }

  updateBeer(beer: IBeer) {
    this.inventoryService.updateBeer(beer).subscribe(
      (newInventory) => {
        this.sourceService.setInventorySource(newInventory);
      }
    );
  }

  deleteBeer(beer: IBeer) {
    this.inventoryService.deleteBeer(beer.id).subscribe(
      (newInventory) => {
        this.sourceService.setInventorySource(newInventory);
      }
    )
  }

  // Open/Close Edit Dialog
  edit(beer: IBeer) {
    let data: any = {};
    data = Object.assign({}, beer); // Deep copy of beer to edit
    data.context = 'Edit'; // Add context to configure add/edit dialog
    let dialogRef = this.dialog.open(EditAddDialog, {
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        delete result['context']; // Remove context to get beer model
        this.updateBeer(result);
      }
    });
  }

  // Open/Close Add Dialog
  add(){
    let data: any = {};
    data.context = 'Add'; // Add context to configure add/edit dialog
    let dialogRef = this.dialog.open(EditAddDialog, {
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        delete result['context']; // Remove context to get beer only
        this.addBeer(result);
      }
    });
  }
}

@Component({
  moduleId: module.id,
  selector: 'edit-add-dialog',
  styleUrls: ['inventory.component.css'],
  templateUrl: 'edit-add-dialog.html',
})

export class EditAddDialog {
  constructor(@Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<EditAddDialog>) {}
}
