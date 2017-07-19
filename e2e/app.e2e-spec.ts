import { BreweryObservablesPage } from './app.po';

describe('brewery-observables App', () => {
  let page: BreweryObservablesPage;

  beforeEach(() => {
    page = new BreweryObservablesPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
