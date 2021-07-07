import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Toolbar from './Toolbar';
import axios from 'axios';
import Donors from './Donors';


const token = localStorage.jwt;
var user = JSON.parse(localStorage.getItem("user"));

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

const ManageDonorListView = () => {
  const classes = useStyles();
  const [bloodDonors, setBloodDonors] = useState([]);

  // useEffect(() => {
  //   getAllBloodDonors();
  // }, []);

  // const getAllBloodDonors = () => {
  //   axios({
  //     method: 'GET',
  //     url: `http://localhost:1337/blood-donors?bloodBank.id=${user.bloodBank.id}&_sort=createdAt:DESC`,
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     },
  //   })
  //   //handle success
  //   .then((response) => {
  //     setBloodDonors(response.data);
  //   })
  //   //handle error
  //   .catch(error => console.error(`Error: ${error}`));
  // }

  return (
    <>
    <Typography
    align="center"
    color="secondary"
    variant="body1"
  >
    All data is mocked for demo purposes and does not represent any real people.
  </Typography>
    <Page
      className={classes.root}
      title="Manage Donors"
    >
      <Container maxWidth={false}>
        <Toolbar />
        <Box mt={3}>
          <Donors bloodDonors={bloodDonors} />
        </Box>
      </Container>
    </Page>
    </>
  );
};

export default ManageDonorListView;
