var utils = {

    //TODO:specific to pmcc-range-selector...needs to be made generic
    checkPseudoElementCss: function(querySelector, pseudoElement, cssProperty, expectedValue) {
        var script = "return window.getComputedStyle( document.querySelector('" + querySelector + "'), '" + pseudoElement + "' ).getPropertyValue('" + cssProperty + "')";

        browser.executeScript( script )
            .then( function ( result ) {
                expect( result ).toEqual( expectedValue );
            } );
    },
    checkLabelContent: function ( querySelector, pseudoElement, expectedValue ) {
        // The content property will return the literal value put in the content css of a pseudo element
        // More information is here: https://support.mozilla.org/en-US/questions/969529#answer-473524
        var content = "";
        content = content.concat("'", expectedValue, "'");
        this.checkPseudoElementCss( querySelector, pseudoElement, "content", content );
    },
    checkLabelDisplay: function ( querySelector, pseudoElement, expectedValue ) {
        this.checkPseudoElementCss( querySelector, pseudoElement, "display", expectedValue );
    },
    checkEdgeDetection: function( elms, triggerAction, layerName ) {
        var viewport = {
            width: 1024,
            height: 786
        };

        browser.manage().window().setSize( viewport.width, viewport.height );


        elms.forEach( function ( elm ) {

            var trigger = element( by.id( 'trigger-' + elm.id ) ),
                layer = element( by.css( (layerName instanceof Function) ? layerName(elm) : layerName ) ),
                location,
                size;

            if( triggerAction === "click") {
                trigger.click();
            } else if( triggerAction === "hover" ){
                browser.actions()
                    .mouseMove( trigger )
                    .perform();
            } else {
                throw Error("Trigger method not know. Please create action to trigger layer");
            }

            //popover is present and displayed
            expect( layer.isPresent() ).toBeTruthy();
            expect( layer.isDisplayed() ).toBeTruthy();

            expect( layer.getAttribute( 'class' ) ).toContain( elm.klass );

            //popover sits within viewport bounds

            layer.getLocation()
                .then( function ( _location ) {
                    location = _location;
                } )
                .then( function () {
                    layer.getSize()
                        .then( function ( _size ) {
                            size = _size;
                        } )
                        .then( function () {
                            expect( location.x >= 0 ).toBeTruthy();
                            expect( location.x + size.width <= viewport.width ).toBeTruthy();

                            expect( location.y >= 0 ).toBeTruthy();
                            expect( location.y + size.height <= viewport.height ).toBeTruthy();
                        } )
                } );
        } );
    }
};

module.exports = utils;