import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import React, { useState, useContext } from 'react';
import Axios from 'axios';
import { toast } from 'toast-notification-alert';
import Favicon from 'react-favicon';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography
} from '@material-ui/core';
import AdminContext from '../context/AdminContext';

export default function LoginPage() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [disabledRB, setDisabledRB] = useState(false);
  const { adminData, setAdminData } = useContext(AdminContext);

  const history = useHistory();

  const submitSM = async (e) => {
    e.preventDefault();
    try {
      const loginSM = {
        email,
        password
      };
      const loginRes = await Axios.post(
        'https://sof-music-auth-backend.herokuapp.com/admin/login',
        loginSM
      );
      setAdminData({
        token: loginRes.data.token,
        admin: loginRes.data.admin
      });
      setDisabledRB(true);
      toast.show({ title: 'Successful Login!', position: 'topright', type: 'info' });
      setEmail('');
      setPassword('');
      setTimeout(() => {
        history.push('/admin');
      }, 2000);
    } catch (err) {
      toast.show({ title: err.response.data.msg, position: 'topright', type: 'alert' });
    }
  };

  return (
    <html>
      <head>
        <title>SoF Music - Login</title>
      </head>
      <style>
      {`\
        body {\
          overflow: hidden;\
        }\
      `}
      </style>
      <body style={{ backgroundColor: '#9E002B'}}>
      <Favicon url='https://sofmusic-backend.herokuapp.com/uploads/logoIcon.png'/><br/><br/><br/><br/>
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
                    <span style={{color: '#9E002B', fontSize: '30%'}}>LOGIN</span>
                  </Typography>
                </Box>
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
                <Box sx={{ py: 2 }}>
                  <Button
                    style={{backgroundColor: '#9E002B'}}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    disabled={disabledRB}
                  >
                    LOGIN
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
          <br/><br/>
        </Container><br/><br/><br/><br/>
      </body>
    </html>
  );
}