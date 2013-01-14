Sample.Hello = function( app ) {
	jQuery( app.rootElement ).find( '.helloString' ).html(
		app.getPropertyValue( 'helloString' )
	)
};