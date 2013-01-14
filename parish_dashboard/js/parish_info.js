var parish_info = function(options){

	var self = this;

	var defaults = {
		data: "(No Data)",
		container: "parish_info_cont"
	};

	defaults = jQuery.extend(defaults, options);

	

	/*
		Rendering the component
	 */
	this.render = function(){

		var renderTo = jQuery( "#" + defaults.container );
		//renderTo.width( options.width );

		var d = defaults.data;

		var template = [
			"<div>",
				"<div class='logo_container'>",
					// "<image src='",options.logo,"' class='logo' />",
					// "<label class='pastor'>Pastor: ", d.pastor,"</label>",
				"</div>",
				"<table>",
					"<tr>",
						"<td><label class='parish_labels'>Goal:</label></td>",
						"<td><label class='parish_amounts'>", d.goal,"</label></td>",
					"</tr>",
					"<tr>",
						"<td><label class='parish_labels'>Amount Paid:</label></td>",
						"<td><label class='parish_amounts'>", d.amount_paid,"</label></td>",
					"</tr>",
					"<tr>",
						"<td><label class='parish_labels'>Outstanding Pledges:</label></td>",
						"<td><label class='parish_amounts'>", d.outstanding_pledges,"</label></td>",
					"</tr>",
					"<tr>",
						"<td><label class='parish_labels'>Amount Paid & Outstanding Pledges:</label></td>",
						"<td><label class='parish_amounts'>", d.amount_paid_and_outstanding_pledges,"</label></td>",
					"</tr>",
					"<tr>",
						"<td><label class='parish_labels'>Over/(Under) Goal:</label></td>",
						"<td><label class='parish_amounts'>", d.over_under_goal_based_on_pledges,"</label></td>",
					"</tr>",
					"<tr>",
						"<td><label class='parish_labels'>Percent of Goal Pledged:</label></td>",
						"<td><label class='parish_percents'>", formatPercent( d.percent_of_goal_pledged),"</label></td>",
					"</tr>",
					"<tr>",
						"<td><label class='parish_labels'>Percent of Goal Paid:</label></td>",
						"<td><label class='parish_percents'>", formatPercent( d.percent_of_goal_paid),"</label></td>",
					"</tr>",

					"<tr>",
						"<td><hr></td>",
					"</tr>",

					// "<tr>",
					// 	"<td><label class='parish_labels'>Balance:</label></td>",
					// 	"<td><label class='parish_amounts'>", d.balance,"</label></td>",
					// "</tr>",

					"<tr>",
						"<td><label class='parish_labels'>Average Gift Amount:</label></td>",
						"<td><label class='parish_amounts'>", d.average_amount_gift,"</label></td>",
					"</tr>",

					"<tr>",
						"<td><label class='parish_labels'>Number of Pledges/Gifts:</label></td>",
						"<td><label class='parish_numbers'>", d.number_of_donors,"</label></td>",
					"</tr>",

				"</table>",
			"</div>"
		].join("");

		renderTo.html( template );

		//Format Currencies
		jQuery(".parish_amounts").formatCurrency();


	};

	/*
		Clears the data of this component and refreshes component
	 */
	this.clear = function(){
		self.data = {};
		self.render();
	};

	/*
		HELPER FUNCTIONS
	 */

	function formatPercent(value){
		value = value * 100;
		return value.toFixed(2) + "%";
	}


};