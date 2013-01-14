/*
	This file is in charge of providing all the necessary logic
	to parse the data for the Donot's grid.

	It won't render anything, is just the logic. In other words is the MODEL
 */

var donors_grid_logic = function(options){

	var self = this;

	var data = options.data;


	var defaults = {
		current_year : 2012
	};

	defaults = jQuery.extend( defaults, options);


	var YEAR_LABELS = {
		2011: "Annual Appeal-2011",
		2012: "Annual Appeal-2012"
	};


	//Data groupped by year
	var data_by_year = _.groupBy( data, "Fund_Description");

	//Data groupped by ID
	var data_by_constituent = _.groupBy( data, "Constituent_ID");

	//Data of the current year
	var data_current_year = data_by_year[ YEAR_LABELS[defaults.current_year] ]; //Sub set of data_by_year
	var data_current_year_by_id = _.groupBy( data_current_year, "Constituent_ID");
// console.log("=== data_current_year_by_id: ", data_current_year_by_id);

	var TOTAL_AMOUNTS = {
		goal : defaults.goal,
		cash : 0,
		pay_cash : 0,
		pledges : 0,
		amount_paid : 0,
		outstanding_pledges : 0,
		amount_paid_and_outstanding_pledges : 0,
		over_under_goal_based_on_pledges : 0,
		percent_of_goal_pledged : 0,
		percent_of_goal_paid : 0,
		balance : 0,

		average_amount_gift: 0,
		number_of_transactions: 0,
		number_of_donors: _.size(data_current_year_by_id)
	};


	


	/*
		Returns the total number of unique donors for a given year
	 */
	this.getNumberOfUniqueDonorsForYear = function(year){

		var data_of_given_year = self.getDataByYearAndID(year);

		return _.keys(data_of_given_year).length;
	};

	/*
		Returns the data grouped by a given year and then by a ID
	 */
	this.getDataByYearAndID = function(year){

		var data_of_given_year = data_by_year[ YEAR_LABELS[year] ];

		return _.groupBy( data_of_given_year, "Constituent_ID");

	};

	/*
		Returns an Object with the data groupBy year
	 */
	this.getDataByYear = function(){

		return data_by_year;

	};

	/*
		Returns the Total Amounts of Pledges ( Where Gift_Type == 'Pledge')
	 */
	this.getTotalAmountPledged = function(){
		
		var t = 0;
		
		jQuery.each( data, function(index, elem){
			if( elem["Gift_Type"] == "Pledge") t += formatAmount(elem["Gift_Amount"]);
		});

		return t;
	};

	/*
		Returns the Total Amount for Balance (This it taken from the Grid since a special logic was needed to get the Balance column)
	 */
	this.getTotalAmountBalance = function(){
		
		var t = 0;

		jQuery.each( data, function(index, elem){
			t += formatAmount(elem["Gift_Pledge_Balance"]);
		});

		return t;

	};

	/*
		Returns the Average for the total amount of gifts / total amount of transactions
	*/
	this.getAmountPledgedAverage = function(){

		var total = 0;

		jQuery.each( data, function(index, elem){
			total += formatAmount(elem["Gift_Amount"]);
		});

		return total / data.length;
	};

	/*
		Returns the Amount Pledge (based on Gift logic) for a given set of transactions (same ID's)
	 */
	this.getAmountPledged = function(elem){

		var amount_pledged = 0;
		var balance = 0;

		//At this level 'elem' is an array of objects of all the transactions grouped by ID
		amount_pledged = _.find(elem, function(val){
			if(val["Gift_Type"] == "Pledge") return true;
		});

		//When Gift Type is a "Pledge". Balance will exist in this row
		if(amount_pledged) {
			balance = amount_pledged["Gift_Pledge_Balance"]; //Balance needs to be before amount_pledged assignment.
			amount_pledged = amount_pledged["Gift_Amount"];

		}
		else {
			//Other Type of payment (e.g. cash) so get the total SUM
			var total = 0;
			jQuery.each(elem, function(index, obj){
				total+= formatAmount( obj["Gift_Amount"]);
			});
			amount_pledged = total;

			//NOTE: I CAN'T USE _.REDUCE ON PRESTO APPS DUE TO CONFLICTS IN REDUCE FUNCTION OF PROTOTYPE
			// amount_pledged = _.reduce( elem, function(memo, item){
			// return formatAmount(item["Gift_Amount"]) + memo;
			// }, 0);
			
		}

		return {
			amount_pledged: formatAmount(amount_pledged),
			balance: formatAmount(balance)
		};

	};


	/*
		This function will be in charge of calculating ALL the amounts for every single grid's row (a row is a group of transactions by ID).
	 */
	this.calculateTotalAmounts = function(transactions_per_id){

		_.filter(transactions_per_id, function(val){
			
			if(val["Gift_Type"] === "Cash") TOTAL_AMOUNTS.cash += formatAmount(val["Gift_Amount"]);

			if(val["Gift_Type"] === "Pay-Cash") TOTAL_AMOUNTS.pay_cash += formatAmount(val["Gift_Amount"]);

			if(val["Gift_Type"] === "Pledge") {
				TOTAL_AMOUNTS.pledges += formatAmount(val["Gift_Amount"]);
				TOTAL_AMOUNTS.balance += formatAmount(val["Gift_Pledge_Balance"]);

			}

			TOTAL_AMOUNTS.number_of_transactions++;

		});

	};

	/*
		Returns the TOTAL_AMOUNTS Object that contains all the different amounts needed to display in the Dashboard.
	 */
	this.getTotalAmounts = function(){

		//Amount Paid = Cash + Pay_Cash
		TOTAL_AMOUNTS.amount_paid = TOTAL_AMOUNTS.cash + TOTAL_AMOUNTS.pay_cash;

		//Outstanding Pledges = Pledges - Pay_cash
		TOTAL_AMOUNTS.outstanding_pledges = TOTAL_AMOUNTS.pledges - TOTAL_AMOUNTS.pay_cash;

		//Sum of Amount Paid & Outstanding Pledges = Amount Paid + (Pledges - Pay_cash)
		TOTAL_AMOUNTS.amount_paid_and_outstanding_pledges = TOTAL_AMOUNTS.amount_paid  + (TOTAL_AMOUNTS.pledges - TOTAL_AMOUNTS.pay_cash);

		// Over /(Under) Goal Based on Pledges =  Sum of Amount Paid & Outstanding Pledges -  Goal
		TOTAL_AMOUNTS.over_under_goal_based_on_pledges = TOTAL_AMOUNTS.amount_paid_and_outstanding_pledges - TOTAL_AMOUNTS.goal;

		// Percent of Goal Pledged = Sum of Amount Paid & Outstanding Pledges / Goal
		TOTAL_AMOUNTS.percent_of_goal_pledged = TOTAL_AMOUNTS.amount_paid_and_outstanding_pledges / TOTAL_AMOUNTS.goal;

		//Percent of Goal Paid = Goal / Amount_paid
		TOTAL_AMOUNTS.percent_of_goal_paid = TOTAL_AMOUNTS.amount_paid / TOTAL_AMOUNTS.goal;

		//Average Amount Gift = Pledges / Number of Pledges
		//Average Gift Amount = (Pledges + Cash) / Number of Transactions
		TOTAL_AMOUNTS.average_amount_gift = (TOTAL_AMOUNTS.pledges + TOTAL_AMOUNTS.cash) / TOTAL_AMOUNTS.number_of_transactions;

		return TOTAL_AMOUNTS;

	};

	/*
		Returns an Array of Arrays with the Rows data for this grid
	 */
	this.getRows = function(){

		var rows =[]; //This will be Final result for this method
		var row = [];

		//Iterate over each set of transactions that are groupped by id in a given year.
		//	Elem contains the Object where the key is the id and the value is an array of objects.
		jQuery.each( data_current_year_by_id, function(index, elem){
			
			var amount_pledged = self.getAmountPledged(elem);
			var balance = amount_pledged.balance; //This line needs to be before assigning amount_pledged
			amount_pledged = amount_pledged.amount_pledged;

			
			self.calculateTotalAmounts(elem);

			//Work with the "Plege Item" if any, if it doens't exists then just use the first index one.
			var elem_backup = elem;

			elem = _.find(elem, function(val){
				if(val["Gift_Type"] == "Pledge") return true;
			});
			if(!elem) elem = elem_backup[0];


			elem = normalizeObject(elem);

			balance = formatAmount(elem["Gift_Pledge_Balance"]);
			
			var amount_paid = amount_pledged - balance;

			row.push( parseInt(elem["Constituent_ID"], 10));
			row.push(elem["Title_1"]);
			row.push(elem["First_Name"] + " " + elem["Last_Name"]);
			row.push(elem["Preferred_Address_Line_1"]);
			row.push(elem["Preferred_City"]);
			row.push(elem["Preferred_State"]);
			row.push( parseInt(elem["Preferred_ZIP"], 10));
			row.push(elem["Preferred_Home_Number"]);
			row.push(elem["Preferred_Primary_Email_Number"]);
			row.push( new Date(elem["Gift_Date"]) );

			row.push( elem["Fund_Description"]);

			row.push( amount_pledged );
			row.push( amount_paid );
			row.push( balance );
			row.push( flagDescription( elem["Flags"]) );
			row.push( parseFloat(elem["Latitude"]) );
			row.push( parseFloat(elem["Longitude"]) );

			rows.push(row);

			row = [];
		});

		return rows;
	};

	/*
		Returns an array of Objects for this Grid
	 */
	this.getColumns = function() {
		
		return [
			{ type: 'number', label: "Constituent ID"},	//INDEXES (16): 0
			{ type: 'string', label: "Prefix"},
			{ type: 'string', label: "Name" },
			{ type: 'string', label: "Address" },
			{ type: 'string', label: "City" },
			{ type: 'string', label: "State" },			//5
			{ type: 'number', label: "Zip" },
			{ type: 'string', label: "Phone" },			//7
			{ type: 'string', label: "Email" },
			{ type: 'date', label: "Pledge Date" },

			{ type: 'string', label: "Fund Description"}, //10

			{ type: 'number', label: "Amount Pledged" },
			{ type: 'number', label: "Amount Paid" },
			{ type: 'number', label: "Balance Due" },	//13
			{ type: 'string', label: "Flags" },
			{ type: 'number', label: "Latitude" },
			{ type: 'number', label: "Longitude" }		//16
		];

	};

	/*
		This is going to happen when the user clicks the grid
	 */
	this.onRowClick = function( id, amounts ){

		var details_for_current_year = data_current_year_by_id[id]; //This is use for the "form" Details
		var details_for_all_years = data_by_constituent[id]; //This is use for the Transaction Details Tables

		// console.log("going to details: ", details_for, ":: ", "amounts:", amounts);
		// console.log("all Details for this is ID:", details_for);
		

		//Work with the Pledge Item, if it doesn't exist use the first one
		var single_detail = _.find(details_for_current_year, function(val){
			if(val["Gift_Type"] == "Pledge") return true;
		});
		if(!single_detail) single_detail = details_for_current_year[0];
		 
		single_detail = normalizeObject( single_detail );

		var html = createDialogHTML( details_for_all_years, single_detail, amounts );

		var dialog_container = jQuery("#dialog_container");
		dialog_container.html( html );
		jQuery("#dialog_container").dialog({
			// modal: true,
			width: 600,
			closeOnEscape: true,
			height: 460
			// buttons: {
			// 	Ok: function(){
			// 		jQuery(this).dialog("close");
			// 	}
			// }
		});



	};

	/*
		Helper functions
	 */
	function formatAmount(value){

		if(!value || value.constructor == Object) return 0;
		if(value.constructor == Number) return value;

		try{
			value = value.replace(/\$/,"");
			value = value.replace(/,/,"");
			value = parseFloat(value);
		}
		catch(e){
			console.error("Error while formatting this amount:", value);
		}

		return value;
	}

	/*
		Function that creates the Dialog HTML

			@details: Contains and array of objects of all the transactions for a given ID
			@single_detail: is the first element of the details array
			@amounts: is a custom object that contains all the amount properties for this row.
	 */
	function createDialogHTML(details, single_detail, amounts){

		// var non_pledge_transactions = _.filter(details, function(elem){
		// 	return elem["Gift_Type"] != "Pledge";
		// });
		// console.log("non_pledge_transactions:", non_pledge_transactions);


		var details_by_date = _.groupBy(details, "Fund_Description");
		
		var transactions_html = [];

		jQuery.each( details_by_date, function(index, year){
			transactions_html.push("<div>");
				transactions_html.push( "<div>", index ,"</div>");
				transactions_html.push("<table class='details_table'>");
					transactions_html.push("<tr>");
						transactions_html.push('<th>Date</th>');
						transactions_html.push('<th>Amount</th>');
						transactions_html.push('<th>Gift Type</th>');
						transactions_html.push('</th>');
					transactions_html.push("</tr>");

			//Sorting the transaction details dates inside the year array (Greater -> Smaller)
			year = year.sort(sorty);

			jQuery.each( year, function(index, elem){

				transactions_html.push( "<tr>");
					transactions_html.push( "<td>");
					transactions_html.push( elem.Gift_Date);
					transactions_html.push( "</td>");
					transactions_html.push( "<td style='text-align:right;'>");
					transactions_html.push( elem.Gift_Amount);
					transactions_html.push( "</td>");
					transactions_html.push( "<td>");
					transactions_html.push( elem.Gift_Type);
					transactions_html.push( "</td>");
				transactions_html.push( "</tr>");
			});

			transactions_html.push("</table>");
		transactions_html.push("</div>");

		});
		transactions_html = transactions_html.join("");

		var html =[
			// <!-- Donor single_Detail -->
			'<span style="float:left;padding:5px;width:50%">',
				'<label class="dialog_main_label">Donor Details</label>',
				'<div>',
					'<label class="dialog_key">Constituent ID</label>',
					'<label>', single_detail.Constituent_ID ,'</label>',
				'</div>',
				// '<div>',
				// 	'<label class="dialog_key">Name</label>',
				// 	'<label>', single_detail.Title_1 + " " + single_detail.First_Name + " " + single_detail.Last_Name,'</label>',
				// '</div>',
				// '<div>',
				// 	'<label class="dialog_key">Address</label>',
				// 	'<label>', single_detail.Preferred_Address_Line_1,'</label>',
				// '</div>',
				'<div>',
					'<label class="dialog_key">City/State</label>',
					'<label>', single_detail.Preferred_City + ", " + single_detail.Preferred_State,'</label>',
				'</div>',
				'<div>',
					'<label class="dialog_key">Zip</label>',
					'<label>', single_detail.Preferred_ZIP,'</label>',
				'</div>',
				'<div>',
					'<label class="dialog_key">Phone</label>',
					'<label>', single_detail.Preferred_Home_Number,'</label>',
				'</div>',
				'<div>',
					'<label class="dialog_key">Email</label>',
					'<label>', single_detail.Preferred_Primary_Email_Number,'</label>',
				'</div>',
			'</span>',
			
			// <!-- Transaction Details -->
			'<span>',
				'<label class="dialog_main_label">Transaction Details</label>',
				'<div>',
					'<label class="dialog_key">Pledge Date</label>',
					'<label>', single_detail.Gift_Date,'</label>',
				'</div>',
				'<div>',
					'<label class="dialog_key">Amount Pledged</label>',
					'<label>', amounts.pledge_amount, '</label>',
				'</div>',
				'<div>',
					'<label class="dialog_key">Amount Paid</label>',
					'<label>', amounts.amount_paid,'</label>',
				'</div>',
				'<div>',
					'<label class="dialog_key">Balance Due</label>',
					'<label>', amounts.balance,'</label>',
				'</div>',
				'<div style="float:left;">',
					'<label class="dialog_key">Details</label>',
					transactions_html,
			'</span>'
		];

		return html.join("");
	}

	/*
		This is a coustom sorting function for sorting an array that contains obj with date value as text: It does a conversion where
		a date like: MM/DD/YY is converted to YYMMDD and the array.
	 */
	function sorty(a,b){
		
		var copy_a = a;
		var copy_b = b;
		copy_a = copy_a["Gift_Date"].split("/");
		copy_b = copy_b["Gift_Date"].split("/");

		var y_a = copy_a[2];
		var m_a = copy_a[0];
		var d_a = copy_a[1];

		var y_b = copy_b[2];
		var m_b = copy_b[0];
		var d_b = copy_b[1];

		//Check if either MM or DD is only 1 char.
		if(m_a.length == 1) m_a = "0" + m_a;
		if(m_b.length == 1) m_b = "0" + m_b;

		copy_a = y_a + m_a+ d_a;
		copy_b = y_b + m_b+ d_b;

		if(copy_a > copy_b) return -1;
		if(copy_a < copy_b) return 1;
		return 0;
	}

	/**
	 * This function checks for "Objects" on the properties elem and fills them with empty string
	 * to avoid [Object Object].
	 */
	function normalizeObject(elem){

		jQuery.each(elem, function(index, prop){

			if(prop.constructor == Object) elem[index] = "";
		});

		return elem;
	}

	/*
		Function that will return an HTML String with the flag value plus the description with <title> tag
	 */
	function flagDescription(value){

		if(!value) return value;

		//Based on Description by Michael Rubio
		var flags = {
			A : "Address Change",
			B : "Seasonal Address Change",
			C : "Comment",
			D : "Deceased",
			E : "Email Reminders Only",
			F : "Foundation/Charitable Fund Correspondence",
			G : "Special Pledge Reminder Frequency",
			I : "Info Request",
			J : "Bequest or Planned Giving",
			K : "EFT Sign Up",
			N : "Name Change",
			O : "Parish or Business Check/Payroll Deduction",
			P : "Opt Out/Cancel My Pledge",
			R : "Do Not Solicit",
			U : "Update Phone/Email",
			X : "Final Payment on Pledge",
			Y : "New Donor"
		};

		return "<div title='"+flags[value]+"'>"+ value +"</div>";
	}

};