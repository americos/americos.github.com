var fusion_stacked = function(options){

	var self = this;

	var defaults = {
		graphPath: "vendor/FusionCharts/Charts/",
		id: "stackedChart1",
		width: 200,
		height: 230,
		backgroundColor: "C4C4C4",
		data:[ { label:"Default Data", value: "0" }]
	};


	defaults = jQuery.extend(defaults, options);


	var graph_file = defaults.graphPath + "StackedColumn2D.swf";


	var json_data= {
		"chart": {
		// "palette": "0",
		"caption": "",
		"showlabels": "1",
		"showvalues": "0",
		"numberprefix": "$",
		"bgColor": defaults.backgroundColor,
		"bgalpha": "100",
		"showBorder" : 0,
		"showsum": "0",
		"decimals": "2",
		"useroundedges": "1",
		"baseFontColor": "000000",
		"formatNumberScale":  "0"
		// "legendborderalpha": "0"
		},
		"categories": [
			{
				"category": [
					{
					"label": ""
					}
				]
			}
		],
		"dataset": [
			{
				"seriesname": "Goal",
				"color": "#C0BACC",
				"showvalues": "1",
				"data": [
					{
						"value": defaults.data["goal"]
					}
				]
			},
			{
				"seriesname": "Amount Paid & Outstanding Pledges",
				"color": "#aa7b7e",
				"showvalues": "1",
				"data": [
					{
						"value": defaults.data["amount_paid_and_outstanding_pledges"]
					}
				]
			},
			{
				"seriesname": "Amount Paid",
				"color": "#eab4e9",
				"showvalues": "1",
				"data": [
					{
						"value": defaults.data["amount_paid"]
					}
				]
			}
		]
		};


		this.render = function(){
			
			var chart = new FusionCharts( graph_file , defaults.id , defaults.width, defaults.height, "0", "1" );
			chart.setJSONData( json_data );
			chart.render( defaults.container );

		};
};