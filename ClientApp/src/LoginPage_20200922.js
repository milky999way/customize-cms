// 참조: https://marmelab.com/react-admin/doc/3.3/Authentication.html
// https://stackoverflow.com/questions/50946945/background-image-in-react-admin-login-page
import React from 'react';
import { Login, LoginForm, Button } from 'react-admin';
import { withStyles } from '@material-ui/core/styles';
import { GoogleLogin } from 'react-google-login';

const styles = ({
	main: {
		background: '#f9f9f9',
		justifyContent: 'center'
	},
	card: {
		background: '#cee8d7',
		marginTop: '0',
		paddingBottom: '2em',
		textAlign: 'center',
		'& > .g-signin2': {
			display: 'inline-block'
		}
	},
	avatar: {
		background: 'url(//xxx.com/assets/images/logo_on.png)',
		backgroundRepeat: 'no-repeat',
		backgroundSize: '180px',
		backgroundPosition: 'center center',
		height: 80,
	},
	icon: { display: 'none' },
});

const responseGoogle = (response) => {
	console.log(response);
}

const CustomLoginPage = props => {
	// console.log(props);
	return (
		<Login {...props}>
			<div className="g-signin2" data-onsuccess="onSignIn">Sign in with Google</div>
		</Login>
	)
};

export default withStyles(styles)(CustomLoginPage);