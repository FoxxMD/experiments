import { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import pageHOC from '../PageHOC';
import { defaultPrefs } from '../../Global/Preferences/preferencesReducer';

class Home extends Component {
  
  render(){
	return null;
  }
}

const defaultPrefsData = { ...defaultPrefs, autoStart: false };

const mapDispatchToProps = ( dispatch ) => ({
  push: ( path ) => dispatch( push( path ) )
});

const composed = compose(
	pageHOC( { key: 'home', defaultPrefsData } ),
	connect( null, mapDispatchToProps )
);

export default composed( Home );
