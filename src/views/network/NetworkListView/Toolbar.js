import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  FormGroup,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  makeStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import axios from 'axios';
import moment from 'moment';

const token = localStorage.jwt;
const User = JSON.parse(localStorage.getItem("user"));

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    overflowX: "auto"
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(1),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },

}));

const state = {
  blood_donor : 'ME',
  bloodbank : 'LOMA',
  bloodgroup : 'A+',
  expiration : 'TOMORROW',
  request_type : 'URGENT',
  phone : '(909)583-4392',
  previous_pregnancies : false,
  previous_transfusions : false,
  previous_reaction : false
}

const Toolbar = ({ className, bloodDonors, ...rest }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState('');
  const [donorGroup, setGroup] = React.useState('');
  const [donorPrevPreg, setDonorPrevPreg] = React.useState('');
  const [donorPrevTrans, setDonorPrevTrans] = React.useState('');
  const [donorPrevReact, setDonorPrevReact] = React.useState('');


  const handleChange = (event) => {
    setState(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDonorChange = (event) => {
    setState(event.target.value);
    console.log('event.target: ',event.target);
    console.log('bloodDonors', bloodDonors);

    axios({
      method: 'GET',
      url: `http://localhost:1337/blood-donors?id=${event.target.value}`,
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
    //handle success
    .then((response) => {
      const bloodDonor = response.data;
      console.log('bloodDonor: ',bloodDonor[0]);
      console.log('bloodGroup: ',bloodDonor[0].bloodGroup);
      setGroup(bloodDonor[0].bloodGroup);
      console.log('previousPregnancies: ',bloodDonor[0].previousPregnancies);
      setDonorPrevPreg(bloodDonor[0].previousPregnancies);
      console.log('previousTransfusions: ',bloodDonor[0].previousTransfusions);
      setDonorPrevTrans(bloodDonor[0].previousTransfusions);
      console.log('previousReactions: ',bloodDonor[0].previousReactions);
      setDonorPrevReact(bloodDonor[0].previousReactions);
    })
    //handle error
    .catch(error => console.error(`Error: ${error}`));
  }
  
  const handleSubmit = (props) => {
    let formData =  new FormData(document.getElementById("makeDonation"));
    var object = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });
    console.log(object)

    axios({
          method: 'POST',
          url: 'http://localhost:1337/bloodsupplies',
          headers: {
            Authorization: `Bearer ${token}`
          },
          data: object 
        })
        .then((response) => {
          const donor = response.data;
          console.log(donor);
          handleClose();
        })
        .catch(error => console.error(`Error: ${error}`));
        handleClose();
        window.location.reload();  };

  const { bloodDonor,bloodBank, bloodGroup, expiration, user, phone, previousPregnancies, previousTransfusions, previousReactions, usage } = state

  const User = JSON.parse(localStorage.getItem("user"));


  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box
        display="flex"
        justifyContent="flex-end"
      >
        <Button
          color="primary"
          variant="contained"
          onClick={handleClickOpen}
        >
          Make A Donation
          </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
              <form encType="multipart/form-data" onSubmit={handleSubmit}  method="post" id="makeDonation">
                <FormGroup>
                  <DialogTitle id="form-dialog-title">Make A Donation</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      To make a donation, please select the blood group and expiraton date here.
                    </DialogContentText>
                    <FormControl required className={classes.formControl} id="donationForm">
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                        <FormControl required style={{ width: '100%'}}>
                            <InputLabel shrink id="bloodDonor">
                            Blood Donor
                            </InputLabel>
                            <Select
                                lableId="bloodDonor"
                                id="bloodDonor"
                                label="Blood Donor"
                                name="bloodDonor"
                                type="text"
                                value={bloodDonor}
                                onChange={handleDonorChange}
                                InputLabelProps={{
                                  shrink: false,
                                }}
                                style={{ width: '75%'}}
                              >
                                {bloodDonors.map((bloodDonor, index) => 
                                  <MenuItem value={bloodDonor.id}>{`${bloodDonor.firstName} ${bloodDonor.lastName}`}</MenuItem>
                                  )}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                          <FormControl required style={{ width: '100%'}}>
                            <InputLabel shrink id="bloodBank">
                            Blood Bank
                            </InputLabel>
                            <Select
                                lableId="bloodBank"
                                id="bloodBank"
                                label="Blood Bank"
                                name="bloodBank"
                                type="text"
                                defaultValue={User.bloodBank.id}
                                value={bloodBank}
                                onChange={handleChange}
                                InputLabelProps={{
                                  shrink: false,
                                }}
                                style={{ width: '75%'}}
                              >
                              <MenuItem disabled value={User.bloodBank.id}>{User.bloodBank.name}</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                        <FormControl required style={{ width: '100%'}}>
                            <InputLabel shrink id="bloodGroup">
                            Blood Group
                            </InputLabel>
                            <Select
                                lableId="bloodGroup"
                                id="bloodGroup"
                                label="Blood Group"
                                name="bloodGroup"
                                type="text"
                                defaultValue={donorGroup}
                                value={bloodGroup}
                                onChange={handleChange}
                                InputLabelProps={{
                                  shrink: false,
                                }}
                                style={{ width: '75%'}}
                              >
                              <MenuItem value={donorGroup}>{donorGroup}</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                          id="expiration"
                          label="Expiration Date"
                          name="expiration"
                          type="text"
                          value={expiration}
                          InputProps={{
                            readOnly: true,
                          }}
                          defaultValue={moment(new Date().setHours(new Date().getHours() + (24*45))).format('LL')}
                          className={classes.textField}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                        <FormControl required style={{ width: '100%'}}>
                            <InputLabel shrink id="previousReactions">
                            Usage
                            </InputLabel>
                            <Select
                                lableId="usage"
                                id="usage"
                                label="NEW Usage"
                                name="usage"
                                type="text"
                                value={usage}
                                onChange={handleChange}
                                InputLabelProps={{
                                  shrink: false,
                                }}
                                style={{ width: '75%'}}
                              >
                              <MenuItem value={'internal'}>Internal</MenuItem>
                              <MenuItem value={'external'}>External</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                        <FormControl required style={{ width: '100%'}}>
                            <InputLabel shrink id="user">
                            User
                            </InputLabel>
                            <Select
                                lableId="user"
                                id="user"
                                label="NEW User"
                                name="user"
                                type="text"
                                defaultValue={User.id}
                                value={user}
                                onChange={handleChange}
                                InputLabelProps={{
                                  shrink: false,
                                }}
                                style={{ width: '75%'}}
                              >
                              <MenuItem disabled value={User.id}>{User.username}</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                          id="phone"
                          label="Phone"
                          name="phone"
                          type="text"
                          value={phone}
                          onChange={handleChange}
                          className={classes.textField}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <FormControl required style={{ width: '100%'}}>
                            <InputLabel shrink id="previousPregnancies">
                            Previous Pregnancies
                            </InputLabel>
                            <Select
                                lableId="previousPregnancies"
                                id="previousPregnancies"
                                label="Previous Pregnancies"
                                name="previousPregnancies"
                                type="text"
                                defaultValue={donorPrevPreg}
                                value={previousPregnancies}
                                onChange={handleChange}
                                InputLabelProps={{
                                  shrink: false,
                                }}
                                style={{ width: '75%'}}
                              >
                              <MenuItem value={donorPrevPreg}>{donorPrevPreg}</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                          <FormControl required style={{ width: '100%'}}>
                            <InputLabel shrink id="previousTransfusions">
                            Previous Transfusions
                            </InputLabel>
                            <Select
                                lableId="previousTransfusions"
                                id="previousTransfusions"
                                label="Previous Transfusionss"
                                name="previousTransfusions"
                                type="text"
                                defaultValue={donorPrevTrans}
                                value={previousTransfusions}
                                onChange={handleChange}
                                InputLabelProps={{
                                  shrink: false,
                                }}
                                style={{ width: '75%'}}
                              >
                              <MenuItem value={donorPrevTrans}>{donorPrevTrans}</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                          <FormControl required style={{ width: '100%'}}>
                            <InputLabel shrink id="previousReactions">
                            Previous Reactions
                            </InputLabel>
                            <Select
                                lableId="previousReactions"
                                id="previousReactions"
                                label="Previous Reactions"
                                name="previousReactions"
                                type="text"
                                defaultValue={donorPrevReact}
                                value={previousReactions}
                                onChange={handleChange}
                                InputLabelProps={{
                                  shrink: false,
                                }}
                                style={{ width: '75%'}}
                              >
                              <MenuItem value={donorPrevReact}>{donorPrevReact}</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </FormControl>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary" form="donationForm">
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" type="submit" form="donationForm">
                      Submit
                    </Button>
                  </DialogActions>
                </FormGroup>
              </form>
            </Dialog>
      </Box>
      <Box mt={1}>
        <Card>
          <CardContent>
            <Box maxWidth={500}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon
                        fontSize="small"
                        color="action"
                      >
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  )
                }}
                placeholder="Search product"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
