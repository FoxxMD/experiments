import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  CircularProgress,
  Popover,
  Menu,
  MenuItem,
  List,
  ListItem
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import InfoIcon from '@material-ui/icons/Info';
import SettingsIcon from '@material-ui/icons/Settings';
import Favorite from '@material-ui/icons/Favorite';
import WorldIcon from '@material-ui/icons/Language';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withSize } from 'react-sizeme';

import routes from '../routes';
import { selectActivePref, selectAppBarHeight } from '../Global/Preferences/preferencesSelector';
// import { sseSelector } from '../Global/SSE/sseSelectors';
// import * as sseActions from '../Global/SSE/sseActions';
// import * as sseConstants from '../Global/SSE/sseConstants';
import * as prefActions from '../Global/Preferences/preferencesActions';
import PreferenceDrawer from './PreferenceDrawer';

const styles = theme => ({
  root: {
	flexGrow: 1,
  },
  flex: {
	flex: 1,
  },
  menuButton: {
	marginLeft: -12,
	marginRight: 20,
  },
  linkStyle: {
	...theme.typography.title,
	color: 'inherit',
	textDecoration: 'none'
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

// const statusType = {
//   [ sseConstants.SSE_STATUS_CONNECTING ]: 'secondary',
//   [ sseConstants.SSE_STATUS_CLOSED ]: 'secondary',
//   [ sseConstants.SSE_STATUS_OPEN ]: 'primary'
// };

const badgeStyles = theme => ({
  colorPrimary: {
	backgroundColor: 'green'
  },
  colorSecondary: {
	backgroundColor: 'grey',
  },
  colorError: {
	backgroundColor: 'red'
  },
  badge: {
	top: '-8px',
	right: '-8px',
	width: '13px',
	height: '13px'
  }
});

const progressStyles = theme => ({
  colorPrimary: {
	color: 'orange'
  },
  root: {
	position: 'absolute'
  }
});

// const StatusBadge    = withStyles( badgeStyles )( Badge );
// const StatusProgress = withStyles( progressStyles )( CircularProgress );

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

class ButtonAppBar extends Component {
  
  constructor( props ){
	super( props );
	this.state = {
	  prefDrawerOpen: false,
	  navMenuEl: null,
	  creditAnchorElement: null
	};
  }
  
  componentDidUpdate( prevProps ){
	if(prevProps.size.height !== this.props.size.height) {
	  this.props.announceAppBarHeight( this.props.size.height );
	}
  }
  
  handleOpenNavMenu = ( e ) => {
	this.setState( {
	  navMenuEl: e.currentTarget
	} );
  };
  
  handleNavMenuClose = () => {
	this.setState( {
	  navMenuEl: null
	} );
  };
  
  handleNavMenuItemClick = ( path ) => {
	this.setState( {
	  navMenuEl: null
	} );
	this.props.goToLink( path );
  };
  
  openPrefDrawer = () => {
	this.setState( {
	  prefDrawerOpen: true
	} );
  };
  
  closePrefDrawer = () => {
	this.setState( {
	  prefDrawerOpen: false
	} );
  };
  
  handlePopoverClick = ( event ) => {
	this.setState( {
	  creditAnchorElement: event.currentTarget
	} );
  };
  
  handlePopoverClose = () => {
	this.setState( {
	  creditAnchorElement: null
	} );
  };
  
  // toggleSse = () => {
  // if(this.props.sse.status === sseConstants.SSE_STATUS_CLOSED) {
  //   this.props.startFeed();
  // }
  // else if(this.props.sse.status === sseConstants.SSE_STATUS_OPEN) {
  //   this.props.stopFeed();
  // }
  // };
  
  savePrefs = ( prefs ) => {
	this.setState( {
	  prefDrawerOpen: false
	} );
	this.props.setPreferences( prefs );
	
	// if(this.props.sse.status === sseConstants.SSE_STATUS_OPEN) {
	//   this.props.stopFeed();
	//   this.props.startFeed();
	// }
  };
  
  render(){
	const { classes, breadcrumbs, sse }      = this.props;
	const { creditAnchorElement, navMenuEl } = this.state;
	return (
		<div className={classes.root}>
		  <AppBar position="static">
			<Toolbar>
			  <List component="nav">
				<ListItem
					button
					aria-haspopup="true"
					aria-controls="lock-menu"
					onClick={this.handleOpenNavMenu}>
				  <MenuIcon style={{ marginRight: '5px' }}/>
				  <Typography variant="title" color="inherit" className={classes.flex}>
					{breadcrumbs.map( ( breadcrumb, index ) => (
						<span key={breadcrumb.key}>
						  {breadcrumb}
						  {(index < breadcrumbs.length - 1) && <i> / </i>}
				  </span>
					) )}
				  </Typography>
				</ListItem>
			  </List>
			  <Menu
				  id="lock-menu"
				  anchorEl={navMenuEl}
				  open={Boolean( navMenuEl )}
				  onClose={this.handleNavMenuClose}
			  >
				{routes.map( ( route, index ) => (
					<MenuItem
						key={index}
						onClick={() => this.handleNavMenuItemClick( route.path )}
					>
					  {route.breadcrumb}
					</MenuItem>
				) )}
			  </Menu>
			  <span style={{ flex: 1 }}></span>
			  <IconButton disabled onClick={this.openPrefDrawer} color="inherit">
				<SettingsIcon/>
			  </IconButton>
			  <IconButton onClick={this.handlePopoverClick} color="inherit">
				<Favorite/>
			  </IconButton>
			  <Popover open={Boolean( creditAnchorElement )}
					   anchorEl={creditAnchorElement}
					   onClose={this.handlePopoverClose}
					   {...popOverProps}>
				<div className={classes.popoverTypography}>
				  <Typography className={classes.blockTypography}>Hey thanks for checking this out! You're great.</Typography>
				  <Typography className={classes.blockTypography}>Site source code is available on <a
					  href="https://github.com/FoxxMD/experiments">Github</a>, created
					by <a href="https://matthewfoxx.com">Matt Foxx</a>.</Typography>
				  <Typography className={classes.blockTypography}>Click on {<InfoIcon/>} on each page for more information and code attribution.</Typography>
				  <Typography className={classes.blockTypography}>Check out my Reddit live stream visualizations at <a
					  href="http://redditdata.live">redditdata.live</a></Typography>
				  <Typography className={classes.blockTypography}>If you have an idea for the site, feedback, or just want to say hi you
					can:</Typography>
				  <ul className={classes.block}>
					<li>Create an issue on <a href="https://github.com/FoxxMD/experiments/issues">Github</a></li>
					<li>PM me on <a href="https://www.reddit.com/user/foxxmd">Reddit</a></li>
					<li><span style={{ display: 'inline' }}>shoot me an email at</span>
					  <pre style={{ display: 'inline', marginLeft: '5px', fontSize: '1rem' }}>contact at matthewfoxx.com</pre>
					</li>
				  </ul>
				</div>
			  </Popover>
			</Toolbar>
		  </AppBar>
		  <PreferenceDrawer onSavePrefs={this.savePrefs} onOpen={this.openPrefDrawer} onClose={this.closePrefDrawer}
							preferences={this.props.preferences}
							open={this.state.prefDrawerOpen}/>
		</div>
	);
  }
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapDispatchToProps = ( dispatch ) => ({
  setPreferences: ( prefs ) => (dispatch( prefActions.setPreferences( prefs ) )),
  announceAppBarHeight: ( height ) => (dispatch( prefActions.annouceAppBarHeight( height ) )),
  // startFeed: () => (dispatch( sseActions.startFeed() )),
  // stopFeed: () => (dispatch( sseActions.stopFeed() )),
  goToLink: ( path ) => dispatch( push( path ) )
});

const mapStateToProps = ( state ) => {
  return {
	preferences: selectActivePref( state ),
	height: selectAppBarHeight( state ),
	// sse: sseSelector( state ),
  };
};

const withSizeHOC = withSize( { monitorHeight: true, refreshRate: 100 } );

const composed = compose(
	withStyles( styles ),
	withBreadcrumbs( routes ),
	connect( mapStateToProps, mapDispatchToProps ),
	withSizeHOC,
);

export default composed( ButtonAppBar );
