// store.service.ts

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http, Response, Headers} from '@angular/http';
import {IBeer} from '../models/beer'
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {environment} from '../../environments/environment';
import {SourceService} from "../shared/source.service";

//CRUD Service for the Beer Lineup of a brewery
@Injectable()
export class StoreService {

  private headers: Headers;

  constructor(private http: Http,
              private sourceService: SourceService) {
    this.headers = new Headers({'Content-Type': 'application/json'});
  }

  // Add a new beer to the inventory, should return updated beer inventory
  order(beerId: number, orderQuantity: number): Observable<IBeer[]> {

    return new Observable(observer => {
      let beerSource = this.sourceService.getInventorySource();
      beerSource.forEach(function(beer){
        if(beer.id == beerId){
          beer.quantity -= orderQuantity;
        }
      });
      this.sourceService.setInventorySource(beerSource);
      observer.next(beerSource);
      observer.complete();
    });

    // To use a real POST API endpoint, you would do something similar to this:
    // let body = JSON.stringify(beer);
    // return this.http.post(environment.inventoryUrl, body, {headers: this.headers}).map((response: Response) => <IBeer[]>response.json()).catch(this.handleError)
  }

  private handleError(error: Response) {
    return Observable.throw(error);
  }

}
