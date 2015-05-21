(function () {

    angular.module( "app", [ "pmcc", "ngMockE2E" ] )
        //Mock Web Services
        .run(function($httpBackend) {

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
            for ( var i = 1; i < 875; i++ ) {

                offers.push( {

                        logo: "http://www.gtgraphics.org/generics/99gen_ethno.jpg",
                        name: "Offer " + i,
                        impressions: rand( 1000, 1000000 ),
                        eCPM: rand( 1, 30 ),
                        category: category()
                    }
                );
            }



            $httpBackend.whenPOST('/offers').respond(function(method, url, data, headers){
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
                response.currentPage = Math.min( req.currentPage , response.pageCount );



                //slice the data to the page
                var startRecord = ( req.currentPage - 1 ) * req.pageSize;
                o = o.splice( startRecord , req.pageSize  );

                response.data = o;

                return [200, response, {}];
            });

            $httpBackend.whenGET('/offers').respond(function(method,url,data) {
                console.log("Getting phones", method, url, data );

                var o = offers;

                if ( filters && filters.eCPM ) {
                    o = inRange( o, "eCPM", filters.eCPM );
                }

                if ( filters && filters.Impressions ) {
                    o = inRange( o, "impressions", filters.Impressions );
                }

                return [200, o, {}];
            });
        })
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
        .factory( "pmccQueryService", function ($rootScope, $timeout, $http) {

            var self = this,
                debounceDelay = 400,
                base = function () {
                    var self = this;
                    self.timeout = null,
                    self.pageSize = 10;
                    self.pageCount = 5;
                    self.currentPage = 1;
                    self.url = "http://url";
                    self.previous = previous;
                    self.next = next;
                    self.model = [];
                    self.previousDisabled = previousDisabled;
                    self.nextDisabled = nextDisabled;
                    self.sortAttribute = "";
                    self.sortDirection = "";
                    self.numMatches=0;
                    self.filters=function(){ return ""; };

                };

            function previous() {
                console.log( "prev" );
                this.currentPage -= 1;
            }

            function previousDisabled(){
                return this.currentPage <= 1;
            }

            function next() {
                console.log( "next" );
               this.currentPage += 1;
            }

            function nextDisabled(){
                return this.currentPage >= this.pageCount;
            }

            function create() {
                var q = new base();


                //watch for changes that should trigger a requery
                $rootScope.$watch( function(){

                    return q.pageSize + q.currentPage + JSON.stringify( q.filters() );

                },

                function(){ debounceQuery(q); }

                );

                return q;
            }

            function debounceQuery( q ){

                if( q.timeout )
                    $timeout.cancel( q.timeout );

                q.timeout = $timeout( function() { triggerQuery(q) }, debounceDelay );

            }

            function triggerQuery( q ){
                var request = {
                    method: 'POST',
                    url: '/offers',
                    headers: {
                        'Content-Type': undefined
                    },
                    data: {
                        currentPage: q.currentPage,
                        pageSize: q.pageSize,
                        filters: q.filters()
                    }
                };

                var data=  {
                    currentPage: q.currentPage,
                        pageSize: q.pageSize,
                        filters: q.filters()
                };

                $http.post( "/offers", data ).success(function(response) {
                    q.model = response.data;
                    q.numMatches = response.numMatches;
                    q.pageCount = response.pageCount;
                    q.currentPage = response.currentPage;

                });
            }

            return {
                create: create
            }

        } )
        .controller( "demo", [ "$scope", "offerService", "pmccQueryService", function ( $scope, offerService, pmccQueryService ) {

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

            $scope.datasource = pmccQueryService.create( $scope.offers );
            $scope.datasource.url="http://mock-offers",
            $scope.datasource.filters = function () {
                return {
                        eCPM: [ $scope.eCPMRange.low, $scope.eCPMRange.high ],
                        Impressions: [ $scope.ImpressionsRange.low, $scope.ImpressionsRange.high ]
                    };
            }

            $scope.selectedOffers = [];

            var offersWatcher =
            $scope.$watch( "datasource.model", function( model ){
                $scope.offers = model;
            });


            $scope.$on( "$destroy", function () {
                offersWatcher();
            } );



        } ] );

})();