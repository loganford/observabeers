import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, XHRBackend, RequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

export function BackendService(backend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend) {
  // array in local storage for registered inventory
  let inventory: any[] = JSON.parse(localStorage.getItem('beers')) || [];


  // configure fake backend
  backend.connections.subscribe((connection: MockConnection) => {
    // wrap in timeout to simulate server db call
    setTimeout(() => {

      // authenticate
      if (connection.request.url.endsWith('/inventory') && connection.request.method === RequestMethod.Get) {

        connection.mockRespond(new Response(new ResponseOptions({
          status: 200,
          body: {
            inventory
          }
        })));

        return;
      }

      // get inventory
      if (connection.request.url.endsWith('/db/inventory') && connection.request.method === RequestMethod.Get) {
        // check for fake auth token in header and return inventory if valid, this security is implemented server side in a real application
        if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: inventory })));
        } else {
          // return 401 not authorised if token is null or invalid
          connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
        }

        return;
      }

      // get user by id
      if (connection.request.url.match(/\/api\/inventory\/\d+$/) && connection.request.method === RequestMethod.Get) {
        // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
        if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          // find user by id in inventory array
          let urlParts = connection.request.url.split('/');
          let id = parseInt(urlParts[urlParts.length - 1]);
          let matchedUsers = inventory.filter(user => { return user.id === id; });
          let user = matchedUsers.length ? matchedUsers[0] : null;

          // respond 200 OK with user
          connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: user })));
        } else {
          // return 401 not authorised if token is null or invalid
          connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
        }

        return;
      }

      // create user
      if (connection.request.url.endsWith('/db/inventory') && connection.request.method === RequestMethod.Post) {
        // get new user object from post body
        let newUser = JSON.parse(connection.request.getBody());

        // validation
        let duplicateUser = inventory.filter(user => { return user.username === newUser.username; }).length;
        if (duplicateUser) {
          return connection.mockError(new Error('Username "' + newUser.username + '" is already taken'));
        }

        // save new user
        newUser.id = inventory.length + 1;
        inventory.push(newUser);
        localStorage.setItem('inventory', JSON.stringify(inventory));

        // respond 200 OK
        connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));

        return;
      }

      // delete user
      if (connection.request.url.match(/\/api\/inventory\/\d+$/) && connection.request.method === RequestMethod.Delete) {
        // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
        if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
          // find user by id in inventory array
          let urlParts = connection.request.url.split('/');
          let id = parseInt(urlParts[urlParts.length - 1]);
          for (let i = 0; i < inventory.length; i++) {
            let user = inventory[i];
            if (user.id === id) {
              // delete user
              inventory.splice(i, 1);
              localStorage.setItem('inventory', JSON.stringify(inventory));
              break;
            }
          }

          // respond 200 OK
          connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
        } else {
          // return 401 not authorised if token is null or invalid
          connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
        }

        return;
      }

      // pass through any requests not handled above
      let realHttp = new Http(realBackend, options);
      let requestOptions = new RequestOptions({
        method: connection.request.method,
        headers: connection.request.headers,
        body: connection.request.getBody(),
        url: connection.request.url,
        withCredentials: connection.request.withCredentials,
        responseType: connection.request.responseType
      });
      realHttp.request(connection.request.url, requestOptions)
        .subscribe((response: Response) => {
            connection.mockRespond(response);
          },
          (error: any) => {
            connection.mockError(error);
          });

    }, 500);

  });

  return new Http(backend, options);
};

export let backendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: Http,
  useFactory: BackendService,
  deps: [MockBackend, BaseRequestOptions, XHRBackend]
};
