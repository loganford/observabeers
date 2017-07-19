// inventory.service.ts

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Response, Headers} from '@angular/http';
import {IBeer} from '../models/beer'
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {environment} from '../../environments/environment';
import {SourceService} from "../shared/source.service";

// CRUD Service for the inventory of an online craft beer store
// NOTE: This service uses a mocked out API using Observables from the RxJS library
// In a real application setting, one should use something similar to the commented out HTTP calls to real APIs
@Injectable()
export class InventoryService {

  private headers: Headers;

  constructor(private http: Http,
  private sourceService: SourceService) {
    this.headers = new Headers({'Content-Type': 'application/json'});
  }

  // Get all beers in the current inventory
  getBeers(): Observable<IBeer[]> {
    // Retrieves beers from assets/inventory.json and maps them to IBeer type
    return this.http.get(environment.inventoryUrl).map((response: Response) => <IBeer[]>response.json()).catch(this.handleError);
  }

  // Add a new beer to the inventory, should return updated beer inventory
  addBeer(beer: IBeer): Observable<IBeer[]> {

    return new Observable(observer => {
        let beerSource = this.sourceService.getInventorySource();
        beerSource.push(beer);
        this.sourceService.setInventorySource(beerSource);
        observer.next(beerSource);
        observer.complete();
    });

    // To use a real POST API endpoint, you would do something similar to this:
    // let body = JSON.stringify(beer);
    // return this.http.post(environment.inventoryUrl, body, {headers: this.headers}).map((response: Response) => <IBeer[]>response.json()).catch(this.handleError)
  }

  // Update an existing beer in the inventory, should return updated beer inventory
  updateBeer(beerToUpdate: IBeer): Observable<IBeer[]> {

    return new Observable(observer => {
        let beerSource = this.sourceService.getInventorySource();
        beerSource.forEach(function(beer, i){
          if(beer.id == beerToUpdate.id){
            beerSource[i] = beerToUpdate;
          }
        });
        this.sourceService.setInventorySource(beerSource);
        observer.next(beerSource);
        observer.complete();
    });

    // To use a real PUT API endpoint, you would do something similar to this:
    // let body = JSON.stringify(beer);
    // return this.http.put(environment.inventoryUrl + '/' + beer.id, body, {headers: this.headers}).map((response: Response) => <IBeer[]>response.json()).catch(this.handleError);
  }

  // Delete a beer from the inventory, should return updated beer inventory
  deleteBeer(id: number): Observable<IBeer[]> {
    return new Observable(observer => {
        let beerSource = this.sourceService.getInventorySource();
        beerSource.forEach(function(beer, i){
          if(beer.id == id){
            beerSource.splice(i,1);
          }
        });
        observer.next(beerSource);
        observer.complete();
    });
    // To use a real DELETE API endpoint, you would do something similar to this:
    // return this.http.delete(environment.inventoryUrl + '/' + id).map((response: Response) => <IBeer[]>response.json()).catch(this.handleError);
  }

  private handleError(error: Response) {
    return Observable.throw(error);
  }

}
