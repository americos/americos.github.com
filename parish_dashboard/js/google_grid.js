var google_grid = function(options){

	var self = this;

	var defaults = {
		dateFormatType : "short"
	};

	defaults = jQuery.extend(defaults, options);


	this.dataTable = new google.visualization.DataTable();

	
	//Add Columns
	jQuery.each( defaults.columns, function(index, element){
		self.dataTable.addColumn( element.type, element.label );
	});
	
	//Add Rows
	self.dataTable.addRows( defaults.rows );
		
	//Table
	var table = new google.visualization.Table(document.getElementById( defaults.container ));

	//Formaters
	var date_formatter = new google.visualization.DateFormat({ formatType: defaults.dateFormatType });
	date_formatter.format(self.dataTable, defaults.dateColumnIndex);

	var number_formatter = new google.visualization.NumberFormat({
		prefix: "$"
	});
	jQuery.each(defaults.amountColumnIndex, function(index, value){
		number_formatter.format(self.dataTable, value);
	});
	
	// var highlight_formatter = new google.visualization.TableColorFormat();
 //  highlight_formatter.addRange(1500, null, 'white', 'orange'); // Highlight From 1500 up to inifinty
 //  highlight_formatter.format( self.dataTable, 10); //INDEXES
	

  // Table Options
	var table_options = {
		showRowNumber: true,
		allowHtml: true
	};

	//Events
	google.visualization.events.addListener( table, "select", function(){
		
		var row_selected = table.getSelection();
		row_selected = row_selected[0].row;

		var id = self.dataTable.getFormattedValue( row_selected, 0); //INDEXES
		var pledge_amount = self.dataTable.getFormattedValue( row_selected, 11);
		var amount_paid = self.dataTable.getFormattedValue( row_selected, 12);
		var balance = self.dataTable.getFormattedValue( row_selected, 13);
		
		var amounts = {
			pledge_amount: pledge_amount,
			amount_paid: amount_paid,
			balance: balance
		};
		//var row_data = self.dataTable.getRowProperties( row_selected ); // Does not work :( Possible Google bug
		
		console.log("Click on:", id);

		defaults.onRowClick( id,  amounts);
	});

	/*
		Function to render the Grid in its container
	 */
	this.render = function(){

		//If defaults.hideColumns exists (it's an array) then create a DataView to hide those columns
		if( defaults.hideColumns){
			var dataView = new google.visualization.DataView( self.dataTable );
			dataView.hideColumns( defaults.hideColumns );

			table.draw( dataView, table_options);
		}
		else{
			table.draw(self.dataTable, table_options);
		}
		
	};

	this.getTable = function(){
		return table;
	};

	this.getDataTable = function(){
		return self.dataTable;
	};

return this;

};