import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Toolbar from './Toolbar';
import Donations from './Donations';

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
  // eslint-disable-next-line
  const [units, setUnits] = useState([]);
  // eslint-disable-next-line
  const [donors, setDonors] = useState([]);

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
