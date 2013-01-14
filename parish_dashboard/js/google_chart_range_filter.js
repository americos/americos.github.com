var google_chart_range_filter = function(options){

	var self = this;

	var defaults = {
		backgroundColor : "#ECECEC" //light grey
	};

	defaults = jQuery.extend(defaults, options);

	//Data Table
	var data = new google.visualization.DataTable();

	//Adding Columns
	jQuery.each( defaults.columns, function(index, elem){

		data.addColumn(elem.type, elem.value);

	});

	data.addRows( defaults.data );

	
	//Format Number
	var formatter = new google.visualization.NumberFormat(
		{prefix: '$'}
  );
  formatter.format(data, 1); // Apply formatter to second column
	formatter.format(data, 2);


	
  var chart_options = {
		title: "",
		allowHtml: true,
		backgroundColor: defaults.backgroundColor,
		legend: {
			position: "bottom"
		}
  };

	// var data = google.visualization.arrayToDataTable( options.data );

	this.render = function(){

		var chart = new google.visualization.LineChart(document.getElementById( defaults.container ));
		// chart.draw( data, defaults );
		chart.draw( data, chart_options );
	};

};