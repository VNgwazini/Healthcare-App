import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Toolbar from './Toolbar';
import axios from 'axios';
import Results from './Results';

const token = localStorage.jwt;
var User = JSON.parse(localStorage.getItem("user"));


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  productCard: {
    height: '100%',
  },
  box: {
    margin: theme.spacing(4)
  }
}));

const CustomerListView = () => {
  const classes = useStyles();
  const [requests, getBloodRequests] = useState([]);

  useEffect(() => {
    getAllBloodRequests();
  }, []);

  const getAllBloodRequests = () => {
    axios({
      method: 'GET',
      url: `http://localhost:1337/blood-requests?requestor.id=${User.bloodBank.id}&_sort=createdAt:DESC`,
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
    //handle success
    .then((response) => {
      const allRequests = response.data;
      const requestsObject = Object.entries(allRequests);
      getBloodRequests(requestsObject);
    })
    //handle error
    .catch(error => console.error(`Error: ${error}`));
  }

  return (
    <Page
      className={classes.root}
      title="Manage Requests"
    >
      <Container maxWidth={false}>
        <Toolbar />
        <Box mt={3}>
          <Results requests={requests} />
        </Box>
      </Container>
    </Page>
  );
};

export default CustomerListView;
