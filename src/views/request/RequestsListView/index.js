import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Toolbar from './Toolbar';
import RequestsReceived from './RequestsReceived';
import RequestsSent from './RequestsSent';

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

const RequestsListView = () => {
  const classes = useStyles();
  // eslint-disable-next-line
  const [receivedReqs, setReceivedReqs] = useState([]);
  // eslint-disable-next-line
  const [sentReqs, setSentReqs] = useState([]);
  // eslint-disable-next-line
  const [suppliers, setSuppliers] = useState([]);

  // useEffect(() => {
  //   getReceivedRequests();
  //   getSentRequests();
  //   getAllBloodBanks();
  // }, []);

  // const getReceivedRequests = () => {
  //   axios({
  //     method: 'GET',
  //     url: `http://localhost:1337/blood-requests?supplier.id=${user.bloodBank.id}&requestor.id_ne=${user.bloodBank.id}&_sort=createdAt:DESC`,
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     },
  //   })
  //   //handle success
  //   .then((response) => {
  //     setReceivedReqs(response.data);
  //   })
  //   //handle error
  //   .catch(error => console.error(`Error: ${error}`));
  // }

  // const getSentRequests = () => {
  //   axios({
  //     method: 'GET',
  //     url: `http://localhost:1337/blood-requests?requestor.id=${user.bloodBank.id}&supplier.id_ne=${user.bloodBank.id}&_sort=createdAt:DESC`,
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     },
  //   })
  //   //handle success
  //   .then((response) => {
  //     setSentReqs(response.data);
  //   })
  //   //handle error
  //   .catch(error => console.error(`Error: ${error}`));
  // }

  // const getAllBloodBanks = () => {
  //   axios({
  //     method: 'GET',
  //     url: `http://localhost:1337/bloodbanks?id_ne=${user.bloodBank.id}&_sort=name:ASC`,
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     },
  //   })
  //   //handle success
  //   .then((response) => {
  //     setSuppliers(response.data);
  //   })
  //   //handle error
  //   .catch(error => console.error(`Error: ${error}`));
  // }
  
  // TODO: add filtering functionality 
  // like filter by type, request urgency, status, etc.
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
      title="Manage Requests"
    >
      <Container maxWidth={false}>      
        <Toolbar suppliers={suppliers}/>
        <Box mt={3}>
          <RequestsReceived requests={receivedReqs} />
        </Box>
        <Box mt={3}>
          <RequestsSent requests={sentReqs} suppliers={suppliers} />
        </Box>
      </Container>
    </Page>
    </>
  );
};

export default RequestsListView;
