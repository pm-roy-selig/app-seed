(function () {

    angular.module( "app" )
        .controller( "demo", function ( $scope ) {

            $scope.firstNames = ["Bob", "Kumar", "Carey", "Alice", "Sven", "Lisa", "Kumal"];
            $scope.largeArray = new Array( 50 );
            $scope.lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
            $scope.words = ["lorem", "ibsum", "ibso", "facto", "dorem", "lipsum"];

            $scope.makeCollection = function ( n ) {
                return new Array( n )
            };

            var numStrings = 200;
            $scope.listOfStrings = new Array( numStrings );

            for ( var i = 0; i < $scope.listOfStrings.length; i++ ) {

                var text = [];
                var nWords = parseInt( Math.random() * i + 1 );
                for ( var w = 0; w < nWords; w++ ) {

                    var r = parseInt( Math.random() * $scope.words.length );
                    text.push( $scope.words[r] );
                }

                $scope.listOfStrings[i] = text.join( " " );

            }
            ;

            function randomInteger( num ) {
                return parseInt( Math.random() * num );
            }

            $scope.getTooltip = function ( key ) {
                return "<b>Tooltip " + key + "</b><" +
                    "br>This is a dynamic tooltip created on <i>" + new Date() +
                    "</i><hr>" +
                        // "lorem ipsum";
                    $scope.listOfStrings[key * 1];
            };

            $scope.table = {

                simple: {
                    columns: ["A Column", "B Column", "C Column", "D Column", "E Column", "F Column"],
                    rows: [
                        ["1", "2", "3", "4", "5", "6"],
                        [$scope.lorem, "2", "3", "4", "5", "6"],
                        ["1", "2", "3", "4", $scope.lorem, "6"]
                    ]
                }
            };

            $scope.toggleEnabled = false;
            $scope.toggleEnabledDefault = true;

            $scope.buttonGroup = "no_option_selected";
            $scope.buttonGroupDefault = "option_1";

            $scope.tableSingleSelectModel = [];
            $scope.tableMultiSelectModel = [];


            $scope.range = {
                low: 12,
                high: 120,
                min:0,
                max:200
            };


            $scope.dropdownModel = "Bar Chart"
            $scope.dropdownOptions = [
                { label: "Heat Map", value: "Heat Map", icon: "pmcc-ico-heatmap" },
                { label: "Bubble Chart", value: "Bubble Chart", icon: "pmcc-ico-bubble" },
                { label: "Bar Chart", value: "Bar Chart", icon: "pmcc-ico-bars" },
                { label: "Pie Chart", value: "Pie Chart", icon: "pmcc-ico-pie" },
                { label: "Scatter Chart", value: "Scatter Chart", icon: "pmcc-ico-scatter" },
                { label: "Line Chart", value: "Line Chart", icon: "pmcc-ico-line" },
                { type:"divider"},
                { label: "Hide Chart", value: "Hide Chart" }
            ];

            $scope.switch = { onOff:true };

        } );
})();