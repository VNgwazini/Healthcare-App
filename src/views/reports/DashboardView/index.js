import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card,
  CardHeader, 
  CardContent,
  Container,
  Divider,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import BloodTypeCard from './BloodTypeCard';
import RequestsReceived from './RequestsReceived';
import RequestsSent from './RequestsSent';
import NetworkBloodSupply from './NetworkBloodSupply';
import InventoryPie from './InventoryPie';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  
  return (
    <Page
      className={classes.root}
      title="Dashboard"
    >
      <Container maxWidth={false}>
        <Grid
          container
          spacing={1}
        >
          <Card style={{width: '100%', margin: '4px'}}>
            <CardHeader title="Inventory Status"/>
            <Divider />
            <CardContent>
              <Grid 
                container
                spacing={1}
              >
                <Grid container item xs={3}>
                  <Grid item xs style={{marginRight: "4px"}}>
                    <BloodTypeCard 
                      bloodType="A+"
                    />
                  </Grid>
                  <Grid item xs style={{marginLeft: "4px"}}>
                    <BloodTypeCard 
                      bloodType="A-"
                    />
                  </Grid>
                </Grid>
                <Grid container item xs={3}>
                  <Grid item xs style={{marginRight: "4px"}}>
                    <BloodTypeCard 
                      bloodType="B+"
                    />
                  </Grid>
                  <Grid item xs style={{marginLeft: "4px"}}>
                    <BloodTypeCard 
                      bloodType="B-"
                    />
                  </Grid>
                </Grid>
                <Grid container item xs={3}>
                  <Grid item xs style={{marginRight: "4px"}}>
                    <BloodTypeCard 
                      bloodType="AB+"
                    />
                  </Grid>
                  <Grid item xs style={{marginLeft: "4px"}}>
                    <BloodTypeCard 
                      bloodType="AB-"
                    />
                  </Grid>
                </Grid>
                <Grid container item xs={3}>
                  <Grid item xs style={{marginRight: "4px"}}>
                    <BloodTypeCard 
                      bloodType="O+"
                    />
                  </Grid>
                  <Grid item xs style={{marginLeft: "4px"}}>
                    <BloodTypeCard 
                      bloodType="O-"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Grid
            item
            lg={5}
            md={6}
            xl={5}
            xs={12}
          >
            <InventoryPie />
          </Grid>
          <Grid
            item
            lg={7}
            md={6}
            xl={7}
            xs={12}
          >
            <NetworkBloodSupply />
          </Grid>
          <Grid
            item
            lg={12}
            md={12}
            xl={12}
            xs={12}
          >
            <RequestsReceived />
          </Grid>
          <Grid
            item
            lg={12}
            md={12}
            xl={12}
            xs={12}
          >
            <RequestsSent />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;
