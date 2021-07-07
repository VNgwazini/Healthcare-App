import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import axios from 'axios';
import Network from './Network';


const token = localStorage.getItem("jwt");
const user = JSON.parse(localStorage.getItem("user"));
const BLOODGROUPS = ['A%2B', 'A-','B%2B', 'B-', 'AB%2B', 'AB-', 'O%2B', 'O-'];

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

const NetworkListView = () => {
  const classes = useStyles();
  const [otherBloodBanks, setOtherBloodBanks] = useState([]);

  // useEffect(() => {
  //   makeRow();
  // }, []);

  // const makeRow = async () => {
  //   var row = [];
  //   var rows = [];
  //   //get banks
  //   const responseBanks = await axios.get(`http://localhost:1337/bloodbanks?id_ne=${user.bloodBank.id}`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  //   //handle success
  //   //loop through each bank
  //   for (var bank of responseBanks.data) {
  //     row = [];
  //     //push bank  to row
  //     row.push(bank);
  //     //get count of each blood group
  //     for(var bldGrp of BLOODGROUPS){
  //       const responseCount = await axios.get(`http://localhost:1337/bloodsupplies/count?bloodBank.id=${bank.id}&bloodDonor.bloodGroup=${bldGrp}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       //push count to row
  //       row.push({bloodGroup: bldGrp, count: responseCount.data});
  //     }
  //       //push array to rows array
  //       rows.push(row);
  //   }
  //   setOtherBloodBanks(rows);
  // }

  return (
    <Page
      className={classes.root}
      title="Network"
    >
      <Container maxWidth={false}>
        {/* <Toolbar bloodDonors={bloodDonors}/> */}
        <Box mt={3}>
          <Network banks={otherBloodBanks} />
        </Box>
      </Container>
    </Page>
  );
};

export default NetworkListView;
