import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  FormGroup,
  Button,
  Card,
  CardContent,
  Grid,
  InputLabel,
  Select,
  TextField,
  InputAdornment,
  SvgIcon,
  makeStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import axios from 'axios';
import moment from 'moment';

const token = localStorage.jwt;

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
  formControl: {},
  selectEmpty: {
    marginTop: theme.spacing(1),
  },
  textField: {
    width: "200px"
  },
  selectField: {
    width: "200px"
  }
}));

const Toolbar = ({ className, donors, ...rest }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState('');
  const [curDonor, setCurDonor] = React.useState('');

  const handleChange = (event) => {
    setState(event.target.value);
  };

  const handleDonorChange = (event) => {
    // since the "value" of the donor field in the form
    // is the index of the donor in the donors list passed in:
    setCurDonor(donors[event.target.value]);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurDonor('');
  };
  
  const handleSubmit = (props) => {
    let formData =  new FormData(document.getElementById("makeDonation"));
    const expirationDate = new Date(formData.get("expiration"));
    expirationDate.setDate(expirationDate.getDate() + 1);

    axios({
      method: 'POST',
      url: 'http://localhost:1337/bloodsupplies',
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        user: user,
        bloodBank: user.bloodBank,
        bloodDonor: donors[formData.get("donorIndex")],
        usage: (formData.get("usage") == '' ? "unassigned" : formData.get("usage")),
        expiration: expirationDate.toISOString()
      } 
    })
    .then((response) => {
      console.log(response.data);
      handleClose();
      setCurDonor('');
      window.location.reload();
    })
    .catch(error => console.error(`Error: ${error}`));
  };

  const user = JSON.parse(localStorage.getItem("user"));

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
          Make Donation
        </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <form encType="multipart/form-data" onSubmit={handleSubmit}  method="post" id="makeDonation">
            <FormGroup id="donationForm">
              <DialogTitle id="form-dialog-title">Make a Donation</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  To make a new donation entry, please enter the relevant information below.<br/>
                  If the donor is not listed in the options, please go to the "Manage Donors" page and create a new donor.<br/>
                  All fields are required.
                </DialogContentText>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl required className={classes.formControl}>
                      <InputLabel htmlFor="donorIndex">Donor</InputLabel>
                      <Select
                        native
                        onChange={handleDonorChange}
                        className={classes.selectField}
                        inputProps={{
                          name: 'donorIndex',
                          id: 'donorIndex',
                        }}
                      >
                        <option aria-label="None" value="" />
                        {donors.map((donor, index) => 
                          <option value={index}>{donor.lastName + ", " + donor.firstName}</option>
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        label="Donor's Blood Group"
                        value={curDonor.bloodGroup}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true
                        }}
                        disabled
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl required className={classes.formControl}>
                      <TextField
                        id="expiration"
                        label="Expiration Date"
                        name="expiration"
                        type="date"
                        defaultValue={moment(new Date().setHours(new Date().getHours()+(24*45))).toISOString().slice(0, 10)}
                        value={state.expiration}
                        onChange={handleChange}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl className={classes.formControl}>
                      <InputLabel htmlFor="usage">Usage</InputLabel>
                      <Select
                        native
                        onChange={handleChange}
                        className={classes.selectField}
                        inputProps={{
                          name: 'usage',
                          id: 'usage',
                        }}
                      >
                        <option aria-label="None" value="" />
                        <option value="internal">internal</option>
                        <option value="unassigned">unassigned</option>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
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
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
