(function () {

    angular.module( "app", [ "pmcc", "ngMockE2E" ] )

        //mock network latency for mock web services
        .config( function ( $provide ) {
            $provide.decorator( '$httpBackend', function ( $delegate ) {
                var proxy = function ( method, url, data, callback, headers ) {

                    var delay = 300 + parseInt( Math.random() * 900 );
                    var interceptor = function () {
                        var _this      = this,
                            _arguments = arguments;
                        setTimeout( function () {
                            callback.apply( _this, _arguments );
                        }, delay );
                    };
                    return $delegate.call( this, method, url, data, interceptor, headers );
                };
                for ( var key in $delegate ) {
                    proxy[ key ] = $delegate[ key ];
                }
                return proxy;
            } );
        } )

        //Mock Web Services
        .run( function ( $httpBackend, $timeout ) {

            function rand( min, max ) {
                return min + parseInt( Math.random() * (max - min) );
            }

            var categories = [
                "Automotive", "Business and Finance", "Education", "Employment and Career", "Entertainment and Leisure", "Gaming", "Health and Fitness", "Home and Garden", "Men's Interest", "Music", "News", "Parenting and Family", "Real Estate", "Reference", "Food and Dining", "Shopping", "Social Networking", "Sports", "Technology", "Travel", "Women's Interest" ];

            var logos = [ "http://www.gtgraphics.org/generics/99gen_tree.jpg",
                "http://www.gtgraphics.org/generics/99gen_ethno.jpg",
                "http://www.gtgraphics.org/generics/99gen_dots.jpg",
                "http://www.gtgraphics.org/generics/99gen_houses.jpg"
            ];

            function category() {

                var arr = categories.slice();
                var c1 = arr.splice( parseInt( Math.random() * arr.length ), 1)[0];
                var c2 = arr.splice( parseInt( Math.random() * arr.length ), 1)[0];
                var c3 = arr.splice( parseInt( Math.random() * arr.length ), 1)[0];

                return c1 + ", " + c2 +", " + c3;
            }

            function inRange( arr, attr, range ) {
                return arr.filter( function ( item ) {
                    return item[ attr ] >= range[ 0 ] && item[ attr ] <= range[ 1 ];
                } )
            }

            //Generate Mock Offers
            var offers = [];
            for ( var i = 1; i < 875; i++ ) {

                var r = Math.floor( Math.random() * logos.length )

                var c = category();
                var name = c.replace(/(,\s|\s)/gi,"-" ).substr(0,30) + i

                offers.push( {

                        logo: logos[ r ],
                        name: name,
                        impressions: rand( 1000, 1000000 ),
                        eCPM: rand( 1, 30 ),
                        category: c
                    }
                );
            }

            $httpBackend.whenPOST( '/mock-offers' ).respond( function ( method, url, data, headers ) {
                //console.log('Received these data:', method, url, data, headers);

                var o = offers;

                var response = {};

                var req = JSON.parse( data );

                //apply eCPM filter
                if ( req.filters && req.filters.eCPM ) {
                    o = inRange( o, "eCPM", req.filters.eCPM );
                }

                //apply Impressions filter
                if ( req.filters && req.filters.Impressions ) {
                    o = inRange( o, "impressions", req.filters.Impressions );
                }

                response.numMatches = o.length;
                response.pageCount = Math.ceil( response.numMatches / req.pageSize );
                response.currentPage = Math.min( req.currentPage, response.pageCount );

                //slice the data to the page
                var startRecord = ( req.currentPage - 1 ) * req.pageSize;
                o = o.splice( startRecord, req.pageSize );

                response.data = o;

                return [ 200, response, {} ];
            } );

            $httpBackend.whenGET( '/offers' ).respond( function ( method, url, data ) {
                console.log( "Getting phones", method, url, data );

                var o = offers;

                if ( filters && filters.eCPM ) {
                    o = inRange( o, "eCPM", filters.eCPM );
                }

                if ( filters && filters.Impressions ) {
                    o = inRange( o, "impressions", filters.Impressions );
                }

                return [ 200, o, {} ];
            } );

        } )

        //mock Offer Service
        .factory( "offerService", function () {

            function rand( min, max ) {
                return min + parseInt( Math.random() * (max - min) );
            }

            var categories = [ "Sports", "Automotive" ];

            function category() {
                return categories[ 0 ];
            }

            function inRange( arr, attr, range ) {
                return arr.filter( function ( item ) {
                    return item[ attr ] >= range[ 0 ] && item[ attr ] <= range[ 1 ];
                } )
            }

            var offers = [];
            for ( var i = 1; i < 100; i++ ) {

                offers.push( {

                        logo: "http://www.gtgraphics.org/generics/99gen_ethno.jpg",
                        name: "Offer " + i,
                        impressions: rand( 1000, 1000000 ),
                        eCPM: rand( 1, 30 ),
                        category: category()
                    }
                );
            }

            function getOffers( filters, page, numRecordsPerPage ) {

                /*for simulation filtering occurs on the client.
                 * but in production better to pass the filter to the server
                 * to be processed as part of the query
                 * */

                var o = offers;

                if ( filters && filters.eCPM ) {
                    o = inRange( o, "eCPM", filters.eCPM );
                }

                if ( filters && filters.Impressions ) {
                    o = inRange( o, "impressions", filters.Impressions );
                }

                return o;
            }

            return {
                getOffers: getOffers
            };

        } )

        //demo controller which exposes offers
        .controller( "demo", [ "$scope", "offerService", "pmccServicesDataSource", "pmccServicesDialogManager", function ( $scope, offerService, pmccServicesDataSource, pmccServicesDialogManager ) {

            //expose the dialog manager service
            var dialogManager = pmccServicesDialogManager;

            //filter model
            $scope.ImpressionsRange = {
                low: 0,
                high: 1000000,
                min: 0,
                max: 1000000
            };

            $scope.eCPMRange = {
                low: 0,
                high: 30,
                min: 0,
                max: 30
            };

            //datasource
            $scope.offersDatasource = pmccServicesDataSource.create( $scope, "/mock-offers" );
            $scope.offersDatasource.objectName = "Offer";
            $scope.offersDatasource.filters = function () {
                return {
                    eCPM: [ $scope.eCPMRange.low, $scope.eCPMRange.high ],
                    Impressions: [ $scope.ImpressionsRange.low, $scope.ImpressionsRange.high ]
                };
            };

            //tile & table display management
            $scope.offersViewPreference = "table";
            $scope.selectedOffers = [];


            //deal management
            $scope.addADeal =function addADeal( theOffer ){
                //set offer & deal state before showing dialog
                $scope.currentOffer = theOffer;
                dialogManager.show( 'dialog-add-a-deal' );
            }

            $scope.viewOfferDetail =function viewDealDetail( theOffer ){
                $scope.currentOffer = theOffer;
                dialogManager.show( 'dialog-view-offer-detail' );
            }





        } ] );

})();


