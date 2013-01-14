var fusion_pyramid = function(options){

	var self = this;

	var defaults = {
		graphPath: "vendor/FusionCharts/Charts/",
		id: "pyramidChart1",
		width: 300,
		height: 200,
		backgroundColor: "FFFFFF",
		data:[ { label:"Default Data", value: "0" }]
	};


	defaults = jQuery.extend(defaults, options);


	var graph_file = defaults.graphPath + "Pyramid.swf";


	//Formatting values for total amounts using a dom element as helper
	var formatCurrencyHelper = jQuery("#formatCurrencyHelper");
	var amounts = ["amount_purple", "amount_green", "amount_yellow"];
	jQuery.each( amounts, function(index, elem){

		var value = defaults.total_map_markers[elem];
		formatCurrencyHelper.html(value);
		//formatCurrencyHelper.formatCurrency();

		defaults.total_map_markers[ elem + "_currency"] = formatCurrencyHelper.formatCurrency().html();

		formatCurrencyHelper.html("");

	});


	var chart_json = {
		"chart": {
			"manageresize": "1",
			"origw": "450",
			"origh": "250",
			//"caption": defaults.title,
			"showlegend": "0",
			"legendposition": "Right",
			"showlabels": "0",
			"bgcolor": "#3D3644", //This is the purple theme color of the dashboard
			"bgalpha": "100",
			"pyramidYScale": "5",
			"showborder": "0",
			"decmials": "2",
			"numberprefix": "",
			"showpercentagevalues": "0",
			"formatnumberscale": "0",
			"legendbgcolor": "CBC6D5"
		},
		"data": defaults.data,
		"annotations": {
			"groups": [

				{
					"showbelow": "1",
					"constrainedscale": "0",
					"items": [
						{
						"type": "rectangle",
						"x": "$chartStartX+2",
						"y": "$chartStartY+2",
						"tox": "$chartEndX-2",
						"toy": "$chartEndY-2",
						"fillalpha": "100",
						"radius": "10",
						"showborder": "1",
						"borderthickness": "1",
						"color": defaults.backgroundColor,
						"borderalpha": "100"
						}
					]
				},
				{
				"showbelow": "0",
				"x": "$canvasCenterX",
				"constrainedscale": "0",
				"items": [
					//LUMEN CHRISTI SOCIETY
					{
					"type": "text",
					"x": "110",
					"y": "20",
					"bold": "1",
					"label": "Lumen Christi Society",
					"align": "left",
					"color": "801ACF"
					},
					{
					"type": "text",
					"x": "110",
					"y": "40",
					"bold": "1",
					"label": "Transactions: "+defaults.total_map_markers["purple"]+"{BR}Total Amount: "+ defaults.total_map_markers["amount_purple_currency"],
					"align": "left",
					"color": "333333"
					},
					// ABOVE AVERAGE
					{
					"type": "text",
					"x": "110",
					"y": "70",
					"bold": "1",
					"label": "Above Average Amount",
					"align": "left",
					"color": "85A441"
					},
					{
					"type": "text",
					"x": "110",
					"y": "90",
					"bold": "1",
					"label": "Transactions: "+defaults.total_map_markers["green"]+"{BR}Total Amount: " + defaults.total_map_markers["amount_green_currency"],
					"align": "left",
					"color": "333333"
					},
					// BELOW AVERAGE
					{
					"type": "text",
					"x": "110",
					"y": "120",
					"bold": "1",
					"label": "Below Average Amount",
					"align": "left",
					"color": "BF8828"
					},
					{
					"type": "text",
					"x": "110",
					"y": "140",
					"bold": "1",
					"label": "Transactions: "+defaults.total_map_markers["yellow"]+"{BR}Total Amount: "+ defaults.total_map_markers["amount_yellow_currency"],
					"align": "left",
					"color": "333333"
					}
				]
				} //End Group

				] // End GRoups
			} // End Annotations

	};

	/*
		Render the Pyramid Chart
	 */
	this.render = function(){

		var chart = new FusionCharts( graph_file, defaults.id, defaults.width, defaults.height, "0", "1" );
		chart.setJSONData( chart_json );
		chart.render( defaults.container );

	};

};