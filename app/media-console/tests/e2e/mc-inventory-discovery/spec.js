describe( 'Testing Media Console Inventory Discovery Page', function () {
    beforeEach( function() {
        browser.get( '/app/media-console/mc-inventory-discover.html' );
    });

    // This is a placeholder test that should be replaced.
    it( 'should have a title', function () {
        expect( browser.getTitle() ).toEqual( "MC: Inventory Discovery" );
    });
} );