import React, { Component } from 'react';
import ThreeRender from './ThreeRenderer';
import { compose } from 'recompose';
import isUrl from 'is-url';
import qs from 'qs';
import {
  CircularProgress,
  Paper,
  TextField,
  Button,
  Switch,
  withStyles,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  IconButton,
  Popover,
  Typography
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InfoIcon from '@material-ui/icons/Info';
import pageHOC from '../PageHOC';
import { connect } from 'react-redux';
import { defaultPrefs } from '../../Global/Preferences/preferencesReducer';
import { selectAppBarHeight } from '../../Global/Preferences/preferencesSelector';
import StatefulSlider from './StatefulSlider';
import Toast from './Toast';

const popOverProps = {
  anchorOrigin: {
	vertical: 'bottom',
	horizontal: 'center'
  },
  transformOrigin: {
	vertical: 'top',
	horizontal: 'right'
  }
};

const EX_H = 'h';
const EX_S = 's';
const EX_V = 'v';

const EXPERIMENT_KEY = 'extruder';

const styles = theme => ({
  settings: {
	position: 'absolute',
	bottom: '2%',
	right: '2%',
	backgroundColor: 'rgba(88, 87, 87, 0.5);',
	color: 'white',
	zIndex: '9999',
	maxWidth: '500px',
	"&:hover": {
	  backgroundColor: 'rgba(88, 87, 87, 0.9);'
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
  },
  info: {
	position: 'absolute',
	top: '0',
	right: '24px',
	zIndex: 9999,
	color: 'rgba(255,255,255,0.9)'
  },
  popoverTypography: {
	margin: theme.spacing.unit * 2,
  },
  blockTypography: {
	marginBlockStart: '1em',
	marginBlockEnd: '1em'
  },
  block: {
	...theme.typography.body1
  }
});

// help from https://itnext.io/how-to-use-plain-three-js-in-your-react-apps-417a79d926e0
class ThreeContainer extends Component {
  constructor( props ){
	super( props );
	const searchParams = qs.parse( window.location.search, { ignoreQueryPrefix: true } );
	const {
			url = 'https://i.imgur.com/On5dGzV.jpg',
			h   = 0.2,
			s   = 0.05,
			v   = 0
		  }            = searchParams || {};
	
	this.state = {
	  initialLoad: true,
	  loading: true,
	  urlInput: '',
	  url,
	  animate: true,
	  messageOpen: false,
	  creditAnchorElement: null,
	  extrusion: {
		h: typeof h === 'string' ? parseFloat( h ) : h,
		s: typeof s === 'string' ? parseFloat( s ) : s,
		v: typeof v === 'string' ? parseFloat( v ) : v,
	  }
	};
	
	if(!isUrl( url )) {
	  this.state.messageOpen = false;
	  this.state.message     = 'URL is not valid';
	}
	
	this.renderer = null;
  }
  
  componentDidMount(){
	this.renderer = new ThreeRender( {
	  containerElement: this.threeRootElement,
	  url: this.state.url,
	  onReady: this.onReady,
	  onProgress: this.setProgress,
	  onError: this.setError,
	  initialExtrusion: this.state.extrusion,
	} );
  }
  
  onReady = () => {
	console.log( 'ready' );
	this.setState( prevState => ({
	  loading: false,
	  url: prevState.initialLoad ? prevState.url : prevState.urlInput,
	  urlInput: '',
	}), this.setUrlHash );
  };
  
  handleToastClose = () => {
	this.setState( {
	  messageOpen: false
	} );
  };
  
  handleInfoClick = ( event ) => {
	this.setState( {
	  creditAnchorElement: event.currentTarget
	} );
  };
  
  handleInfoClose = () => {
	this.setState( {
	  creditAnchorElement: null
	} );
  };
  
  
  setExtrusion = ( type, val ) => {
	console.log( `Type: ${type}, Value: ${val}` );
	this.setState( prevState => ({
	  extrusion: {
		...prevState.extrusion,
		[ type ]: val
	  }
	}), this.setUrlHash );
	this.renderer.setExtrusionTween( { [ type ]: val } );
  };
  
  setUrl = () => {
	if(!isUrl( this.state.urlInput )) {
	  this.setState( {
		message: 'URL is not valid',
		messageOpen: true,
	  } );
	}
	else {
	  this.renderer.setImage( this.state.urlInput );
	}
  };
  
  setUrlHash = () => {
	const { url = '', extrusion: { s, h, v } = {}, initialLoad } = this.state;
	if(initialLoad) {
	  this.setState( {
		initialLoad: false
	  } );
	}
	else {
	  const searchParams = new URLSearchParams();
	  searchParams.set( 'url', url );
	  searchParams.set( 'h', h.toLocaleString( undefined, { maximumFractionDigits: 2 } ) );
	  searchParams.set( 's', s.toLocaleString( undefined, { maximumFractionDigits: 2 } ) );
	  searchParams.set( 'v', v.toLocaleString( undefined, { maximumFractionDigits: 2 } ) );
	  const newQs = searchParams.toString();
	  window.history.replaceState( { newHash: newQs }, 'Extruder', `${window.location.origin}${window.location.pathname}?${newQs}` );
	  
	}
  };
  
  setProgress = () => {
	console.log( 'progress' );
	this.setState( {
	  loading: true
	} );
  };
  
  setError = ( e ) => {
	this.setState( {
	  loading: false,
	  messageOpen: true,
	  message: 'Image failed to load! Either the URL was not found or the domain does not allow CORS requests :('
	} );
  };
  
  setAnimating = ( e, checked ) => {
	this.renderer.setImageAnimating( checked );
	this.setState( {
	  animate: checked
	} );
  };
  
  render(){
	const { classes = {} }                                               = this.props;
	const { extrusion: { h, s, v } = {}, urlInput, creditAnchorElement } = this.state;
	return (
		<div style={{
		  overflow: 'hidden',
		  position: 'absolute',
		  width: '100%',
		  height: window.innerHeight - (this.props.appBarHeight !== null ? this.props.appBarHeight : 0),
		  backgroundColor: 'black'
		}}>
		  <IconButton classes={{ root: classes.info }} onClick={this.handleInfoClick} color="inherit">
			<InfoIcon/>
		  </IconButton>
		  <Popover open={Boolean( creditAnchorElement )}
				   anchorEl={creditAnchorElement}
				   onClose={this.handleInfoClose}
				   style={{ padding: '10px 15px' }}
				   {...popOverProps}>
			<div className={classes.popoverTypography}>
			  <Typography variant="subheading">Image Extruder</Typography>
			  <div className={classes.block}>
				Visualization code by <a style={{ marginRight: '5px' }}
										 target='_blank'
										 href="https://codepen.io/darrylhuffman/details/wOKbvy">
				Darryl Huffman</a>❤️
			  </div>
			  <ul className={classes.block}>
				<li>Adjust aspects of the image using the <b>Settings</b> panel in the bottom right</li>
				<li>Use <b>Hue</b>, <b>Saturation</b>, and <b>Brightness</b> to adjust how far each particle is extruded</li>
				<li>Click and hold with mouse to rotate and mousewheel to zoom</li>
				<li>Use your own image by putting an image URL in the URL box and clicking "Use"</li>
			  </ul>
			</div>
		  </Popover>
		  <Toast onClose={this.handleToastClose} open={this.state.messageOpen} message={this.state.message}/>
		  {this.state.loading ? (
			  <div style={{ height: '100%', position: 'relative' }}>
				<CircularProgress classes={{ root: classes.progress }}
								  color="secondary"/></div>
		  ) : null}
		  <ExpansionPanel classes={{ root: classes.settings }}>
			<ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>Settings</ExpansionPanelSummary>
			<ExpansionPanelDetails style={{ padding: '10px 15px 10px 15px' }}>
			  <Paper style={{ backgroundColor: 'inherit' }} elevation={0}>
				<TextField
					classes={{ root: classes.textField }}
					value={urlInput}
					onChange={e => this.setState( { urlInput: e.target.value } )}
					id="filled-search"
					label="Image URL"
					type="search"
					margin="normal"
					variant="filled"
					InputProps={{ style: { color: 'white' } }}
					InputLabelProps={{ style: { color: 'white' } }}
				/><Button onClick={this.setUrl} variant="contained" color="secondary" size="small">Use</Button>
				<div>
				  Animate <Switch checked={this.state.animate} onChange={this.setAnimating}/>
				</div>
				<StatefulSlider max={3} initialValue={h} title="Hue" step={0.05}
								onChange={( val ) => this.setExtrusion( EX_H, val )}/>
				<StatefulSlider max={3} initialValue={s} title="Saturation" step={0.05}
								onChange={( val ) => this.setExtrusion( EX_S, val )}/>
				<StatefulSlider max={3} initialValue={v} title="Brightness" step={0.05}
								onChange={( val ) => this.setExtrusion( EX_V, val )}/>
			  </Paper>
			</ExpansionPanelDetails>
		  </ExpansionPanel>
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
