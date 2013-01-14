var fusion_led = function(options){

	var self = this;

	var defaults = {
		graphPath: "vendor/FusionCharts/Charts/",
		value : "800000",
		max_value : "1000000",
		width: "140",
		height: "300",
		id: "some_id"
	};

	jQuery.extend( defaults, options);

	defaults.third = Math.round(defaults.max_value / 3);

	var graph_file = defaults.graphPath + "VLED.swf";
	
	var led_config ={
		"chart": {
			"manageresize": "1",
			"chartbottommargin": "5",
			"lowerlimit": "0",
			"upperlimit": defaults.max_value,
			"numbersuffix": "",
			"numberprefix": "$",
			"showtickmarks": "1",
			"tickvaluedistance": "0",
			"bgcolor": defaults.backgroundColor,
			"majortmnumber": "5",
			"majortmheight": "4",
			"minortmnumber": "0",
			"showtickvalues": "1",
			"decmials": "2",
			"ledgap": "2",
			"ledsize": "2",
			"ledboxbgcolor": "333333",
			"ledbordercolor": "666666",
			"borderthickness": "2",
			"chartrightmargin": "20"
		},
		"colorrange": {
			"color": [
				{
					"minvalue": "0",
					"maxvalue": defaults.third,
					"code": "FF0000"
				},
				{
					"minvalue": defaults.third,
					"maxvalue": defaults.third + defaults.third,
					"code": "FFFF00"
				},
				{
					"minvalue": defaults.third + defaults.third,
					"maxvalue": defaults.max_value,
					"code": "00FF00"
				}
			]
		},
		"value": defaults.value
	};

	this.render = function(){
		
		var chart = new FusionCharts( graph_file, defaults.id, defaults.width, defaults.height, "0", "1" );
		chart.setJSONData( led_config );
		chart.render( defaults.container );

	};

};