var google_chart_pie = function(options){

	var self = this;

	var defaults = {
		title: "My title",
		allowHtml: true,
		colors: ["#A8CF53", "#EFAC32", "#D7493C", "#801ACF"] //Green, Yellow, Red, Purple (from Map buttons bar)
	};

	defaults = jQuery.extend( defaults, options);

	//Data Table
	var data = new google.visualization.DataTable();

	//Adding Columns
	jQuery.each( defaults.columns, function(index, elem){

		data.addColumn(elem.type, elem.value);

	});

	data.addRows( defaults.data );

	/*
		Rendering the Pie chart
	 */
	this.render = function(){

		var chart = new google.visualization.PieChart(document.getElementById( defaults.container ));
		chart.draw( data, defaults );

	};

};