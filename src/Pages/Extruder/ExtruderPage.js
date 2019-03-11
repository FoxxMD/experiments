import React, { Component } from 'react';
import ThreeRender from './ThreeRenderer';
import { compose } from 'recompose';
import { CircularProgress, Paper, TextField, Button, Switch, withStyles } from '@material-ui/core';
import pageHOC from '../PageHOC';
import { connect } from 'react-redux';
import { defaultPrefs } from '../../Global/Preferences/preferencesReducer';
import { selectAppBarHeight } from '../../Global/Preferences/preferencesSelector';
import StatefulSlider from './StatefulSlider';

const EX_H = 'h';
const EX_S = 's';
const EX_V = 'v';

const EXPERIMENT_KEY = 'extruder';

const styles = theme => ({
  paper: {
	position: 'absolute',
	bottom: '2%',
	right: '2%',
	backgroundColor: 'rgba(88, 87, 87, 0.2);',
	color: 'white',
	zIndex: '9999',
	padding: '15px',
	"&:hover": {
	  backgroundColor: 'rgba(88, 87, 87, 0.7);'
	}
  },
  textField: {
	margin: '0 15px 0 0',
	color: 'white',
  },
  progress: {
	position: 'absolute',
	top: '50%',
	right: '50%',
	width: '100px',
	height: '100px'
  }
});

// help from https://itnext.io/how-to-use-plain-three-js-in-your-react-apps-417a79d926e0
class ThreeContainer extends Component {
  constructor( props ){
	super( props );
	this.state    = {
	  loading: true,
	  url: 'https://i.imgur.com/3aDc8Iy.jpg',
	  animate: true,
	};
	this.renderer = null;
  }
  
  componentDidMount(){
	this.renderer = new ThreeRender( {
	  containerElement: this.threeRootElement,
	  url: this.state.url,
	  onReady: this.onReady,
	  initialExtrusion: {
		h: 0.05,
		s: 0,
		v: 0,
	  }
	} );
	this.setState( {
	  url: null
	} );
  }
  
  onReady = () => {
	console.log( 'ready!' );
	this.setState( {
	  loading: false
	} );
  };
  
  setExtrusion = ( type, val ) => {
	console.log( `Type: ${type}, Value: ${val}` );
	this.renderer.setExtrusionTween( { [ type ]: val } );
  };
  
  setUrl = () => {
	const url = this.state.url;
	this.setState( {
	  url: null,
	  ready: false,
	} );
	this.renderer.setImage( url );
  };
  
  setAnimating = ( e, checked ) => {
	this.renderer.setImageAnimating( checked );
	this.setState( {
	  animate: checked
	} );
  };
  
  render(){
	const { classes = {} } = this.props;
	return (
		<div style={{
		  overflow: 'hidden',
		  position: 'absolute',
		  width: '100%',
		  height: window.innerHeight - (this.props.appBarHeight !== null ? this.props.appBarHeight : 0),
		  backgroundColor: 'black'
		}}>
		  {this.state.loading ? (
			  <div style={{ height: '100%', position: 'relative' }}>
				<CircularProgress classes={{ root: classes.progress }}
								  color="secondary"/></div>
		  ) : null}
		  <Paper classes={{ root: classes.paper }}>
			<h4 style={{ margin: '10px 0 10px 0' }}>Settings</h4>
			<TextField
				classes={{ root: classes.textField }}
				onChange={e => this.setState( { url: e.target.value } )}
				id="filled-search"
				label="URL"
				type="search"
				margin="normal"
				variant="filled"
				InputProps={{ style: { color: 'white' } }}
				InputLabelProps={{ style: { color: 'white' } }}
			/><Button onClick={this.setUrl} variant="contained" color="secondary" size="small">Use</Button>
			<div>
			  Animate <Switch checked={this.state.animate} onChange={this.setAnimating}/>
			</div>
			<StatefulSlider max={3} initialValue={0.05} title="Hue" step={0.05}
							onChange={( val ) => this.setExtrusion( EX_H, val )}/>
			<StatefulSlider max={3} initialValue={0} title="Saturation" step={0.05}
							onChange={( val ) => this.setExtrusion( EX_S, val )}/>
			<StatefulSlider max={3} initialValue={0} title="Brightness" step={0.05}
							onChange={( val ) => this.setExtrusion( EX_V, val )}/>
		  </Paper>
		  <div style={{ height: '100%', position: 'relative' }} ref={element => this.threeRootElement = element}/>
		</div>
	);
  }
}

const defaultPrefsData = { ...defaultPrefs, autoStart: false };

const mapStateToProps = ( state ) => ({
  appBarHeight: selectAppBarHeight( state ),
});

const composed = compose(
	pageHOC( { key: EXPERIMENT_KEY, defaultPrefsData } ),
	connect( mapStateToProps, null ),
	withStyles( styles ),
);

export default composed( ThreeContainer );
