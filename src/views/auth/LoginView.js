import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import axios from 'axios';
import Page from 'src/components/Page';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const LoginView = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <Page
      className={classes.root}
      title="Login"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: 'D3moEmai1@example.com',
              password: 'P@$sW0rdE2!'
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={
              (data) => {
              console.log(data)
              // axios
              // .post('http://localhost:1337/auth/local', {
              //   identifier: "email@example.com",
              //   password: "Password123"
              // })
              // .then(response => {
              //   // Handle success.
              //   localStorage.setItem("user", JSON.stringify("Demo User"))
              //   localStorage.setItem("jwt", "Demo JWT")
              //   navigate('/app/dashboard', { replace: true });
              //   window.location.reload();
              // })
              // .catch(error => {
              //   // Handle error.
              //   console.log('An error occurred:', error.response);
              //   navigate('/app/dashboard', { replace: true });
              //   window.location.reload();
              // });
              navigate('/app/dashboard', { replace: true });
              window.location.reload();
            }
          }
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography
                    color="textPrimary"
                    variant="h2"
                  >
                    Sign in
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    (For demo purposes only. Please click "Sign In Now" to access site!)
                  </Typography>
                </Box>
                <Grid
                  container
                  spacing={3}
                >
                </Grid>
                <Box
                  mt={3}
                  mb={1}
                >
                  </Box>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email Address"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign in now
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default LoginView;