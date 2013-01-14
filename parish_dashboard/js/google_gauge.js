var google_gauge = function(options){

	var self = this;

	var max = options.max || 100;
	var fourth = max / 4;

	var defaults = {
		width: 400,
		height: 120,

		redFrom: 0,
		redTo: fourth,
		yellowFrom: fourth,
		yellowTo: fourth * 3,
		greenFrom: fourth * 3,
		greenTo: max,
		
		minorTicks: 5,
		max: max
		//TODO: Maybe I should add some animation
		//	https://google-developers.appspot.com/chart/interactive/docs/animation
		// animation: {
		// 	duration: 500,
		// 	easing: "out"
		// }
	};

	defaults = jQuery.extend(defaults, options);

	var my_data = defaults.test_data ? defaults.test_data : defaults.data; //TODO get data from service
	this.data = google.visualization.arrayToDataTable( my_data );

	/*
		Rendering the Gauge(s)
	 */
	this.render = function(){
		
		var chart = new google.visualization.Gauge(document.getElementById( defaults.container ));
		chart.draw( self.data, defaults);
	};

	

};