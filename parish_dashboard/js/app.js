
var Parish = function(){

	this.init = function(){
		var TEST_MODE = false;
		
		var data = "";

		var GOAL = 364499; //STATIC NUMBER, THIS VALUE SHOULD BE PROVIDED BY PARISH
		
		//Create Dashboard Tabs
		var tabs = jQuery("#tabs").tabs({
			select : function(event, ui){
				
				//Clicked on Maps Tab if index == 2
				if(ui.index ==2 ){
					
					var map = loadMap();
					
					// loadPieChart(map);
				}

			}//end select
		});


	//Export Button (Temporal)
	jQuery(".exportButton").click(function(){
		alert("This will export the grid's data");
	});
	//Assistance Button (Temporal)
	jQuery(".needAssistanceButton").click(function(){
		alert("This could load an assitance webpage");
	});


	//Load: Gauge, Chart
	google.load('visualization', '1',
		{
			packages: ['gauge', 'corechart', 'controls', 'table'],
			callback : function(){

				//Get Real data from Source
				jQuery.ajax({
					type:"get",
					url: "test_data/dashboard_data.json",
					//crossDomain:true,
					//dataType: "jsonp",
					success: function(response){
						
						data = response["e:DataTable"]["e:Entry"];
						console.log("Data: ", data);

						/*
							Donors Logic
						 */
						
						var donors_logic = new donors_grid_logic({
							data: data,
							goal : GOAL,
							current_year_label: "Annual Appeal-2012"
						});

						var donors_logic_rows = donors_logic.getRows();

						var TOTAL_AMOUNTS = donors_logic.getTotalAmounts();
						//console.log("=donors_logic_rows:", donors_logic_rows);
						//console.log("=TOTAL_AMOUNTS:", TOTAL_AMOUNTS);
						 

						/*
							Speedometers
						 */
						
						var year1 = 2012;
						var year2 = 2011;
						var max = 2000;

						var g = new google_gauge({
							container: "speedometer1",
							max: max,
							data: [
								['Label', 'Value'],
								['', donors_logic.getNumberOfUniqueDonorsForYear(year1)]
							]
						});
						g.render();

						g = new google_gauge({
							container: "speedometer2",
							max: max,
							data: [
								['Label', 'Value'],
								['', donors_logic.getNumberOfUniqueDonorsForYear(year2)]
							]
						});
						g.render();
						//Fixing the margin for the table element inside the speedometer container (is due to Bootstrap)
						jQuery(".speedometerContainer table").css("margin", "auto");


						/*
							Line Chart
						 */
						
						g = new google_chart_range_filter({
							//title: "Year-over-Year Campaign Comparison",
							columns: [
								{ type: "string", value: "Year" },
								{ type: "number", value: "Campaign Goal" },
								{ type: "number", value: "Amount Paid" }
							],
							data: [
								["2008", 366898, 427686.4 ],
								["2009", 382708, 398678.4 ],
								["2010", 363533.6, 391684.3 ],
								["2011", 344230, 437598.5 ],
								["2012", 364499, TOTAL_AMOUNTS["amount_paid"] ]
							],
							container: "line_chart_container",
							backgroundColor: "#C4C4C4"
						});

						g.render();


						/*
							FAKE Google MAPS: It's not rendered, its for getting the total # of markers for the Pyramid chart
						 */
						var m = new google_maps({
							container: "fake_map_canvas",
							data: donors_logic.getRows(),
							lat: 15, //INDEXES
							lon: 16,
							pledgeAverage : donors_logic.getAmountPledgedAverage(),
							center: new google.maps.LatLng(33.828578 , -84.387431), //Lat and lon Christ the King: 2699 Peachtree Road Northeast  Atlanta, GA 30305
							zoom: 10
						});


						/*
							Pyramid
						*/
						var total_map_markers = m.getTotalMarkersCount();
						console.log("total_map_markers:", total_map_markers);

						m.destroy(); //Destroying this map since I don't need it anymore.

						g = new fusion_pyramid({
							container: "pyramid_chart_container",
							width: 550,
							height:300,
							backgroundColor: "#C4C4C4",
							total_map_markers: total_map_markers, //Passing this object for the graphs annotations
							data: [
								{
									"value": total_map_markers["purple"],
									// "issliced": "1",
									"color": "801ACF", //Purple
									"label": "Lumen Christi Society",
									"showValue": "0",
									"toolText": formatPercent( total_map_markers["amount_purple"] / TOTAL_AMOUNTS["amount_paid_and_outstanding_pledges"] ) + " of Overall Amount" //This category amount / Overall Amount
								},
								{
									"value": total_map_markers["green"],
									"color": "A8CF53", //Green
									"label": "Above Average Amount",
									"showValue": "0",
									"toolText": formatPercent( total_map_markers["amount_green"] / TOTAL_AMOUNTS["amount_paid_and_outstanding_pledges"] ) + " of Overall Amount" //This category amount / Overall Amount
								},
								{
									"value": total_map_markers["yellow"],
									"color": "EFAC32", //Yellow/Orange
									"label": "Below Average Amount",
									"showValue": "0",
									"toolText": formatPercent( total_map_markers["amount_yellow"] / TOTAL_AMOUNTS["amount_paid_and_outstanding_pledges"] ) + " of Overall Amount" //This category amount / Overall Amount
								}
							]
						});
						g.render();


						/*
							Google Grid
						 */
						g = new google_grid({
							container: "w21",
							columns: donors_logic.getColumns(),
							dateColumnIndex: 9, //INDEXES
							amountColumnIndex: [11,12,13],// amountColumnIndex: [7, 8],
							dateFormatType: "short", // "medium", "long" are valid options too
							rows: donors_logic_rows,
							onRowClick: donors_logic.onRowClick,
							hideColumns: [1,2,3,7,8,14,15,16] //Hide the email column through a dataView.
						});

						g.render();



						/*
							Stacked Chart
						*/

						g = new fusion_stacked({
							container: "stacked_chart",
							width: 200,
							height: 300,
							backgroundColor: "#C4C4C4",
							data: {
								goal: TOTAL_AMOUNTS["goal"],
								amount_paid_and_outstanding_pledges: TOTAL_AMOUNTS["amount_paid_and_outstanding_pledges"],
								amount_paid: TOTAL_AMOUNTS["amount_paid"]
							}
						});
						g.render();

						/*
							Fusion LED'S
						 */
						// console.log("TOTAL_AMOUNTS:", TOTAL_AMOUNTS);

						// var led1 = new fusion_led({
						// 	container: "led_1",
						// 	id: "led_goal",
						// 	value: GOAL,
						// 	width: 180,
						// 	max_value: GOAL,
						// 	backgroundColor: "C0BACC" //Cool light purple
						// });
						// led1.render();


						/*
							PARISH INFO
						*/
						var t = new parish_info({
							//logo:'../images/AAA_Generic_Logo.jpg',
							data: TOTAL_AMOUNTS,
							container: "w11"
						});
						t.render();


						//Adding Rounded corners for Google visualizations
						jQuery("svg").attr( "class", "roundedCorners");

					}// end success
				});
			}
		}
	);
	

	function loadMap(){

		var m = "";

		var donors_logic = new donors_grid_logic({
			data: data
		});

		//Check if a map does not exists already
		var map_already_exists = jQuery("#map_canvas").children().length;
		if(map_already_exists != 1){
			//console.log("donors_logic.getAmountPledgedAverage:", donors_logic.getAmountPledgedAverage());
			m = new google_maps({
				container: "map_canvas",
				data: donors_logic.getRows(),
				lat: 15, //INDEXES
				lon: 16,
				pledgeAverage : donors_logic.getAmountPledgedAverage(),
				center: new google.maps.LatLng(33.828578 , -84.387431), //Lat and lon Christ the King: 2699 Peachtree Road Northeast  Atlanta, GA 30305
				zoom: 10
			});

			//Click event for markers buttons
			jQuery("#add_markers").click(function(){
				m.addMarkers();
			});
			jQuery("#show_green").click(function(){
				m.filterMarkersByColor("green");
			});
			jQuery("#show_yellow").click(function(){
				m.filterMarkersByColor("yellow");
			});
			jQuery("#show_red").click(function(){
				m.filterMarkersByColor("red");
			});
			jQuery("#show_purple").click(function(){
				m.filterMarkersByColor("purple");
			});
			jQuery("#center_map").click(function(){
				m.centerMap();
			});

			//To fix problem with layout of map on hidden jQueryUI Tab
			setTimeout(function () {
          m.resize();
          m.centerMap();
      }, 500);

		}// end if map exists already

		return m;

	} //loadMap


	function loadPieChart(map_instance){
		/*
			Pie Chart (depends on Map)
		 */
		var total_map_markers = map_instance.getTotalMarkersCount();

		g = new google_chart_pie({
			container: "pie_chart_container",
			title: "Average Gift Data",
			columns: [
				{ type: "string", value: "Average"},
				{ type: "number", value: "Value"}
			],
			data: [
				['Above Median Fift Amt', total_map_markers["green"] ],
				['Below Median Fift Amt', total_map_markers["yellow"] ],
				['No Gift This Year', total_map_markers["red"] ],
				['Lumen Christi Society', total_map_markers["purple"] ]
			]
		});

		g.render();
	} //LoadPIeChart


	/*
		MISC FUNCTIONS
	 */
	function formatPercent(value){
		value = value * 100;
		return value.toFixed(2) + "%";
	}

 };

};