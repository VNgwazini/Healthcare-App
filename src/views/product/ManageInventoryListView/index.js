import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Toolbar from './Toolbar';
import axios from 'axios';
import Donations from './Donations';
import moment from 'moment';


const token = localStorage.getItem("jwt");
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

const ManageInventoryList = () => {
  const classes = useStyles();
  const [units, setUnits] = useState([]);
  const [donors, setDonors] = useState([]);

  // useEffect(() => {

  // // TODO: make sure it actually gets all of the donors, not just 100
  // const getAllDonors = () => {
  //   axios({
  //     method: 'GET',
  //     url: `http://localhost:1337/blood-donors?bloodBank.id=${user.bloodBank.id}&_sort=lastName:ASC`,
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     },
  //   })
  //   .then((response) => {
  //     setDonors(response.data);
  //     //console.log(donors);
  //   })
  //   .catch(error => console.error(`Error: ${error}`));
  // }

  // const getAllBloodUnits = () => {
  //   updateTestDataExpirationDates()
  //   axios({
  //     method: 'GET',
  //     url: `http://localhost:1337/bloodsupplies?bloodBank.id=${user.bloodBank.id}&_sort=createdAt:DESC`,
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     },
  //   })
  //   //handle success
  //   .then((response) => {
  //     if (response.data.length === 100) {
  //       axios({
  //         method: 'GET',
  //         url: `http://localhost:1337/bloodsupplies?bloodBank.id=${user.bloodBank.id}&_sort=createdAt:DESC&_start=100`,
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         },
  //       })
  //       //handle success
  //       .then((response2) => {
  //         var temp = response.data.concat(response2.data);
  //         setUnits(temp);
  //         //console.log(temp);
  //         // stops here, assuming that there wouldn't be more than 200 units in inventory
  //       })
  //       .catch(error => console.error(`Error: ${error}`));
  //     }
  //     else {
  //       setUnits(response);
  //     }
  //   })
  //   //handle error
  //   .catch(error => console.error(`Error: ${error}`));
  // }

  // const updateTestDataExpirationDates = () => {
  //   console.log('updateTestDataExpirationDates called!')
  //   for(let i in units){
  //     console.log(`${i}: `,units);
  //     axios({
  //       method: 'PUT',
  //       url: `http://localhost:1337/bloodsupplies/${units[i]}`,
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       },
  //       data: {
  //         expiration : `${moment(new Date().setHours(new Date().getHours() + (24*35)))}`,
  //       }
  //     })
  //     //handle success
  //     .then((response) => {
  //       const donor = response.data;
  //       console.log(donor);
  //     })
  //     //handle error
  //     .catch(error => console.error(`Error: ${error}`));
  //   }
  // }

  //   getAllBloodUnits();
  //   getAllDonors();
  //   // eslint-disable-next-line
  // }, []);



  return (
    <>
    <Page
      className={classes.root}
      title="Manage Donations"
    >
      <Container maxWidth={false}>
        <Toolbar donors={donors}/>
        <Box mt={3}>
          <Donations bloodUnits={units} donors={donors}/>
        </Box>
      </Container>
    </Page>
    </>
  );
};

export default ManageInventoryList;
