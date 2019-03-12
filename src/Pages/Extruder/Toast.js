import { Snackbar, SnackbarContent, withStyles } from '@material-ui/core';
import React from 'react';

const styles1 = theme => ({
  error: {
	backgroundColor: theme.palette.error.dark,
  },
});

function MySnackbarContent( props ){
  const { classes, className, message, onClose, variant, ...other } = props;
  
  return (
	  <SnackbarContent
		  classes={{ root: classes.error }}
		  aria-describedby="client-snackbar"
		  message={
			<span id="client-snackbar" style={{
			  display: 'flex',
			  alignItems: 'center',
			}}>
			  {message}
        </span>
		  }
		  {...other}
	  />
  );
}

// MySnackbarContent.propTypes = {
//   classes: PropTypes.object.isRequired,
//   className: PropTypes.string,
//   message: PropTypes.node,
//   onClose: PropTypes.func,
//   variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
// };

const MySnackbarContentWrapper = withStyles( styles1 )( MySnackbarContent );

class CustomizedSnackbars extends React.Component {
  state = {
	open: false,
  };
  
  handleClick = () => {
	this.setState( { open: true } );
  };
  
  handleClose = ( event, reason ) => {
	if(reason === 'clickaway') {
	  return;
	}
	
	this.setState( { open: false } );
	this.props.onClose();
  };
  
  componentWillReceiveProps( nextProps, nextContext ){
	if(this.props.open === false && nextProps.open === true) {
	  this.setState( {
		open: true
	  } );
	}
  }
  
  render(){
	const { classes, message = 'Error loading image' } = this.props;
	return (
		<div>
		  <Snackbar
			  anchorOrigin={{
				vertical: 'top',
				horizontal: 'center',
			  }}
			  open={this.state.open}
			  autoHideDuration={6000}
			  onClose={this.handleClose}
		  >
			<MySnackbarContentWrapper
				variant="error"
				message={message}
			/>
		  </Snackbar>
		</div>
	);
  }
}

export default CustomizedSnackbars;
