import { useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Formik } from 'formik';
import React, { useState } from 'react';
import Axios from 'axios';
import { toast } from 'toast-notification-alert';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography
} from '@material-ui/core';
import { Fragment } from 'react';
import Favicon from 'react-favicon';

export default function RegisterPage() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPass, setConfirmPass] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [disabledRB, setDisabledRB] = useState(false);

  const history = useHistory();

  const submitSM = async (e) => {
    e.preventDefault();
    try {
      const newUserSM = {
        firstName,
        lastName,
        email,
        password,
        confirmPass
      };
      await Axios.post(
        'https://sof-music-auth-backend.herokuapp.com/admin/register',
        newUserSM
      );
      setDisabledRB(true);
      toast.show({ title: 'Successful Registration!', position: 'topright', type: 'info' });
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPass('');
      setTimeout(() => {
        history.push('/admin/login');
      }, 2000);
    } catch (err) {
      toast.show({ title: err.response.data.msg, position: 'topright', type: 'alert' });
    }
  };

  return (
    <Fragment>
      <Helmet>
        <title>SoF Music - Register</title>
      </Helmet>
      <Favicon url='https://sofmusic-backend.herokuapp.com/uploads/logoIcon.png'/>
      <Box
        sx={{
          backgroundColor: '#9E002B',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      ><br/><br/><br/>
        <Container maxWidth="sm" style={{backgroundColor: 'white', borderRadius: '5%'}}>
        <br/><br/>
          <Formik>
            {({
              handleBlur
            }) => (
              <form onSubmit={submitSM}>
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                  <Typography
                    color="textPrimary"
                    variant="h2"
                  >
                    <span style={{color: '#9E002B', 
                    fontWeight: 'bold', fontFamily: 'Mistral'}}>SoF</span><br/>
                    <span style={{color: '#9E002B', fontSize: '30%'}}>CREATE NEW ACCOUNT</span>
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  label="First Name*"
                  margin="normal"
                  name="firstName"
                  onBlur={handleBlur}
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Last Name*"
                  margin="normal"
                  name="lastName"
                  onBlur={handleBlur}
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Email Address*"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  value={email}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Password*"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  value={password}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Confirm Password*"
                  margin="normal"
                  name="confirmPass"
                  onBlur={handleBlur}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  type="password"
                  value={confirmPass}
                  variant="outlined"
                />
                <Box sx={{ py: 2 }}>
                  <Button
                    style={{backgroundColor: '#9E002B'}}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    disabled={disabledRB}
                  >
                    SIGN UP NOW
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
          <br/><br/>
        </Container><br/><br/><br/>
      </Box>
    </Fragment>
  );
}