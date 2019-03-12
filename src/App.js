import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { CssBaseline, Grid } from '@material-ui/core';
import { Route, Switch, Redirect } from 'react-router-dom';

import AppBar from './Components/AppBar';
import routes from './routes';

class App extends Component {
  render(){
	return (
		<Fragment>
		  <CssBaseline/>
		  <AppBar/>
		  <Grid container>
			<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
			  <Switch>
				{routes.map( ( route, i ) => <Route key={i} {...route}/> )}
				<Redirect push from="/" to="/extruder"/>
			  </Switch>
			</Grid>
		  </Grid>
		</Fragment>
	);
  }
}

const mapDispatchToProps = ( dispatch ) => ({
  // startFeed: () => dispatch( { type: 'SSE:START' } )
});

export default connect( null, mapDispatchToProps )( App );
