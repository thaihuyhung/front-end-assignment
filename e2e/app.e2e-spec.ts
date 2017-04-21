import { FrontEndAssignmentPage } from './app.po';

describe('front-end-assignment App', () => {
  let page: FrontEndAssignmentPage;

  beforeEach(() => {
    page = new FrontEndAssignmentPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
