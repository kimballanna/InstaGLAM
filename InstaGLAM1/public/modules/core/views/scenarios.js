describe('InstaGLAM App', function() {

  describe('Selfie list view', function() {

    beforeEach(function() {
      browser.get('app/index.html');
    });


    it('should filter the selfie list as a user types into the search box', function() {

      var phoneList = element.all(by.repeater('photo in photos'));
      var query = element(by.model('query'));

      expect(photo.count()).toBe(3);

      query.sendKeys('duckFace');
      expect(photo.count()).toBe(1);

      query.clear();
      query.sendKeys('selfieStick');
      expect(photo.count()).toBe(2);
	  
	  query.clear();
      query.sendKeys('bathroomSelfie');
      expect(photo.count()).toBe(4);
    });
  });
});