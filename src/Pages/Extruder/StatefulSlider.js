import React, { Component } from 'react';
import { compose } from 'recompose';
import Slider from '@material-ui/lab/Slider';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
  track: {
	backgroundColor: '#f33b7c'
  },
  thumb: {
	backgroundColor: '#f33b7c'
  }
});

class StatefulSlider extends Component {
  constructor( props ){
	super( props );
	const { initialValue = 0 } = props;
	this.state                 = {
	  value: initialValue
	};
  }
  
  onChange = ( e, value ) => {
	this.setState( {
	  value
	} );
  };
  
  onValueSet = ( e ) => {
	this.props.onChange( this.state.value );
  };
  
  render(){
	const { title, onChange, classes, initialValue, ...otherProps } = this.props;
	return (<div style={{ margin: '10px 0 0 0', paddingBottom: '15px', minWidth: '300px' }}>
	  {title !== undefined ? <h5>{title}: {this.state.value.toLocaleString( undefined, { maximumFractionDigits: 2 } )}</h5> : null}
	  <Slider classes={classes} {...otherProps} value={this.state.value} onChange={this.onChange} onDragEnd={this.onValueSet}/>
	</div>);
  }
}

const composed = compose(
	withStyles( styles ),
);

export default composed( StatefulSlider );
