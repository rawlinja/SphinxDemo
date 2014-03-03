describe("Application", function() {
    var app;

  beforeEach(function() {
      app = new window.Application();
  });

  it('app should be initialized', function() {
    expect(app).toBeDefined();
  }); 
});
