// in src/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useLogin, useNotify, Notification, TextField } from 'react-admin';
import { ThemeProvider } from '@material-ui/styles';
import { Button, Card, CardActions, Avatar } from '@material-ui/core';
import { Field, withTypes, Form } from 'react-final-form';
import LockIcon from '@material-ui/icons/Lock';
import { makeStyles } from '@material-ui/core/styles';
import { GoogleLogin } from 'react-google-login';

const useStyles = makeStyles(theme => ({
	main: {
		display: 'flex',
		flexDirection: 'column',
		minHeight: '100vh',
		alignItems: 'center',
		// justifyContent: 'flex-start',
		// background: 'url(https://source.unsplash.com/random/1600x900)',
		justifyContent: 'center',
		background: '#f9f9f9',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
	},
	card: {
		minWidth: 300,
		// marginTop: '6em',
		marginTop: '0',
		background: '#cee8d7',
	},
	avatar: {
		margin: '1em',
		display: 'flex',
		justifyContent: 'center',
		background: 'url(//xxx.com/assets/images/logo_on.png)',
		backgroundRepeat: 'no-repeat',
		backgroundSize: '180px',
		backgroundPosition: 'center center',
		height: 80,
	},
	icon: {
		backgroundColor: theme.palette.secondary.main,
		display: 'none',
	},
	hint: {
		margin: '1em 0 3em 0',
		display: 'flex',
		justifyContent: 'center',
		color: theme.palette.grey[500],
	},
	form: {
		padding: '0 1em 1em 1em',
	},
	input: {
		marginTop: '1em',
	},
	actions: {
		padding: '0 1em 1em 1em',
		//'& > button': {
		//	width: '100%'
		//},
		//'& > button > span': {
		//	width: '75%',
		//}
	},
}));



const LoginPage = ({ theme }) => {
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const login = useLogin();
	const notify = useNotify();
	//const submit = (e) => {
	//	setLoading(true);
	//	e.preventDefault();
	//	login({ email, password })
	//		.catch(() => {
	//			setLoading(false);
	//			notify('Invalid email or password')
	//		});
	//};

	//useEffect(() => {
	//	login()
	//		.catch((e) => {
	//			//notify('구글 로그인을 진행해 주세요.');
	//			//setLoading(false);
	//			//notify('Invalid email or password, 인증되지않은사용자')
	//		});
 // });


	//let googlePopup;
	//const googleLogin = () => {
	//	googlePopup = window.open('/api/account/google-login', 'google-login', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=700,height=700,left=10,top=10');
	//}
	//const googleLoginClose = () => {
	//	googlePopup.close();
	//}
	
	const handleClick = (event) => {
		window.location.href = '/google-login';
	};

	//const responseGoogle = (response) => {
	//	const params = {
	//		'userId': response.profileObj.email
	//	}
	//	login(params)
	//		.catch((e) => {
	//			console.log(e);
	//		});
	//}
	

	return (
		<ThemeProvider theme={theme}>
			<div className={classes.main}>
				<Card className={classes.card}>
					<div className={classes.avatar}>
						<Avatar className={classes.icon}>
							<LockIcon />
						</Avatar>
					</div>
					<div className={classes.hint}>
						xxx
					</div>
					<CardActions className={classes.actions}>
						<Button
							variant="contained"
							disabled={loading}
							fullWidth
							style={{ background: '#fff url(https://api.iconify.design/flat-color-icons:google.svg) no-repeat 10px center / contain', padding: '10px 10px 10px 40px' }}
							onClick={handleClick}
						>
							{/* {loading && (
								<CircularProgress size={25} thickness={2} />
              )} */}
              Sign in with Google
            </Button>
					</CardActions>
				</Card>
				<Notification />
			</div>
		</ThemeProvider>
	);
};

export default LoginPage;