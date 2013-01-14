var google_maps = function(options){

	var self = this;

	var defaults = {
		zoom: 4,
		center: new google.maps.LatLng(40.397, -100.644),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		lat: "Latitude",
		lon: "Longitude",
		iconPath: "images/map_markers/"
	};

	jQuery.extend( defaults, options);

	//Creating and Rendering the map
	var	map = new google.maps.Map( document.getElementById( defaults.container), defaults);

	this.map = map;

	this.markers = [];

	//Icons paths for markers
	var icon_paths = {
		red: defaults.iconPath + "house-red.png",
		yellow: defaults.iconPath + "house-yellow.png",
		green: defaults.iconPath + "house-green.png",
		purple: defaults.iconPath + "house-purple.png",
		blue: defaults.iconPath + "house-blue.png"
	};

	// For saving the total amount of markers for a given color and total amount
	var TOTAL_MARKERS = {
		red: 0,
		yellow: 0,
		green: 0,
		purple: 0,
		blue: 0,

		amount_red: 0,
		amount_yellow: 0,
		amount_green: 0,
		amount_purple:0
	};

	var pledgeAverage = defaults.pledgeAverage;

	//Render pins of data is passed.
	if(defaults.data){

		addPointsToMap( defaults.data );

	}
	//Place pins If there is info about points.
	else if(defaults.points){

		addPointsToMap( defaults.points );
	
	} //end if points


	/*
		Removes Map from DOM
	 */
	
	this.destroy =function(){

		jQuery("#" + defaults.container).remove();

	};

	/*
		Resizes map
	 */
	this.resize = function(){

			google.maps.event.trigger(self.map, 'resize');

	};


	/*
		This function returns an count of the total number of markers per color.
			If color is passed as param returns the total for that color only
			Otherwise the complete object is returned.
	 */
	this.getTotalMarkersCount = function(color){

		if(color) return TOTAL_MARKERS[color];

		return TOTAL_MARKERS;
	};


	/*
		Clear all markers from Map
	 */
	this.clearMarkers = function(){
		//console.log("markers:", self.markers);

		jQuery.each( self.markers, function(index, elem){
			elem.setMap(null);
		});

	};

	/*
		Adds all Markers into map
	 */
	this.addMarkers = function( filter_markers ){

		self.clearMarkers();

		var markers = filter_markers || self.markers;

		jQuery.each( markers, function(index, elem){
			elem.setMap(self.map);
		});

	};

	this.filterMarkersByColor = function(color){

		var filter_markers = _.filter(self.markers, function(item){
			if(item["icon"].indexOf( color ) != -1) return true;
		});

		self.addMarkers(filter_markers);

	};

	this.centerMap =function(){

		map.panTo( defaults.center );
	};


	/*
		HELPER FUNCTIONS
	 */

	//Add markers to the map, uses the same data as the one from the grid.
	
	function addPointsToMap(array_of_points){

		

		jQuery.each( array_of_points, function(index, elem){

			// Create Marker
			var marker = new google.maps.Marker({
					map: map,
					icon: getIcon(elem),
					title : elem[1] + " " + elem[2], //INDEXES
					position: new google.maps.LatLng( elem[defaults.lat], elem[defaults.lon] )
			});

			self.markers.push(marker);

			//Info window
			var infowindow = new google.maps.InfoWindow({
				//content: getInfoWindowContent(elem),
				maxWidth: 400
			});

      google.maps.event.addListener(marker, 'click', function() {

				infowindow.close();

				var content = getInfoWindowContent(elem);
				
				infowindow.setContent( content );
        infowindow.open( map, marker);
				 
      });

      //Apply CSS class to infowindow (FuzzyLogic)
      google.maps.event.addListener(infowindow, 'domready', function() {

				//And this to the infowindow tail, timeout needed since the tail images are loaded later
        setTimeout(function(){
					console.log("tail:", jQuery("img[src='http://maps.gstatic.com/mapfiles/iw3.png']"));
					jQuery("img[src='http://maps.gstatic.com/mapfiles/iw3.png']").attr("src", "http://localhost/~americosavinon/Presto35Apps/Adelante/parish_dashboard/images/map_markers/iw3_eggplant.png");
        }, 200);

        //This adds the style to the big content box
				var myInfoWindow = jQuery(".myInfoWindow");
        myInfoWindow.parent().parent().parent().addClass("ui-dialog ui-widget ui-widget-content ui-corner-all ui-draggable ui-resizable");
        
			});

		}); //End each array_of_points

		
	}

	//Will return the correct icon for the marker based on Adelante logic
	/*
	a.	RED = no pledge/gift
	b.	YELLOW = Pledge/Gift below “average gift” amount. This is an average $ amount calculated based on all pledges/gifts $ amounts for that parish divided by the number of pledges/gifts.
	c.	GREEN = Pledge/Gift above “average gift”
	d.	PURPLE = Pledge/Gift is a major gift; $1,500 or more
	 */
	
	function getIcon(elem){
		// console.log("pledgeAverage:", pledgeAverage, " : elem for icon:", elem);
		var amount_pledged = elem[11]; //INDEXES
		var amount_paid = elem[12];
		//console.log("amount_pledged:", amount_pledged, " :: ", "amount_paid:", amount_paid);

		if(amount_pledged === 0 || amount_paid === 0){

			TOTAL_MARKERS["red"]++;
			TOTAL_MARKERS["amount_red"] += amount_pledged + amount_paid;

			return icon_paths['red'];
		}
		else if( amount_pledged >= 2500 || amount_paid >= 2500){

			TOTAL_MARKERS["purple"]++;
			TOTAL_MARKERS["amount_purple"] += amount_pledged + amount_paid;

			return icon_paths['purple'];
		}
		else if( amount_pledged < pledgeAverage || amount_paid < pledgeAverage ){

			TOTAL_MARKERS["yellow"]++;
			TOTAL_MARKERS["amount_yellow"] += amount_pledged + amount_paid;

			return icon_paths['yellow'];
		}
		else if( amount_pledged > pledgeAverage || amount_paid > pledgeAverage ){

			TOTAL_MARKERS["green"]++;
			TOTAL_MARKERS["amount_green"] += amount_pledged + amount_paid;

			return icon_paths['green'];
		}
		
		else return icon_paths['blue'];

	}


	function formatMoney(value){

		if(!value || value.constructor == Object) return "$0";
		return "$"+value;
	}

	//Returns the HTML content for the Pin InfoWindow
	function getInfoWindowContent(elem){

		var html = [	//INDEXES
			"<div class='myInfoWindow' style='width:280px'>",
			"<b>Donor Details</b>",
			"<p>",
				// "<span><label class='infowindow_label'>Name: </label></span>",
				// "<span><label>&nbsp;", elem[1], " ", elem[2], "</label></span>",
				
				// "<span><label class='infowindow_label'>Address: </label></span>",
				// "<span><label>&nbsp;", elem[3], "</label></span>",

				"<span><label class='infowindow_label'>City / State: </label></span>",
				"<span><label>&nbsp;", elem[4], ", ", elem[5], "</label></span>",
				
				"<span><label class='infowindow_label'>Zip: </label></span>",
				"<span><label>&nbsp;", elem[6], "</label></span>",

				// "<span><label class='infowindow_label'>Phone:</label></span>",
				// "<span><label>&nbsp;", elem[7], "</label></span>",
				
				// "<span><label class='infowindow_label'>E-mail: </label></span>",
				// "<span><label>&nbsp;", elem[8], "</label></span>",
			"</p>",

			"<b>Transaction Details</b>",
			"<p>",
				"<span><label class='infowindow_label'>Amount Pledged: </label></span>",
				"<span><label>&nbsp;", formatMoney(elem[11]), "</label></span>",

				"<span><label class='infowindow_label'>Amount Paid: </label></span>",
				"<span><label>&nbsp;", formatMoney(elem[12]), "</label></span>",

				"<span><label class='infowindow_label'>Balance Due: </label></span>",
				"<span><label>&nbsp;", formatMoney(elem[13]), "</label></span>",
			"</p>",
			"</div>"
		].join("");

		return html;
	}


	//Return map instance
	return this;

};