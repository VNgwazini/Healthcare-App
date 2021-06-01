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

const useStyles = makeStyles((theme) => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    width: "100%"
  },
  selectEmpty: {
    marginTop: theme.spacing(1),
  },
  selectField: {
    width: "75%"
  },
  textField: {
    width: "75%"
  }
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

const token = localStorage.getItem("jwt");
const user = JSON.parse(localStorage.getItem("user"));

const Toolbar = ({ className, ...rest }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState('');

  const handleChange = (event) => {
    setState(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleSubmit = (props) => {
    let formData =  new FormData(document.getElementById("makeDonor"));
    var object = {};
    formData.forEach(function(value, key){
      object[key] = value;
    });
    object["user"] = user;
    object["bloodBank"] = user.bloodBank;

    axios({
      method: 'POST',
      url: 'http://localhost:1337/blood-donors',
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: object 
    })
    .then((response) => {
      console.log(response.data);
      handleClose();
    })
    .catch(error => console.error(`Error: ${error}`));
    window.location.reload();
  };

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
          Make Donor
        </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <form encType="multipart/form-data" onSubmit={handleSubmit}  method="post" id="makeDonor">
            <FormGroup id="makeDonorForm">
              <DialogTitle id="form-dialog-title">Make a Donor</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  To make a donor, please enter the relevant information here.<br/>
                  All fields are required.
                </DialogContentText>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControl required className={classes.formControl}>
                        <TextField
                          id="firstName"
                          label="First Name"
                          name="firstName"
                          type="text"
                          onChange={handleChange}
                          className={classes.textField}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          required
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl required className={classes.formControl}>
                        <TextField
                          id="lastName"
                          label="Last Name"
                          name="lastName"
                          type="text"
                          onChange={handleChange}
                          className={classes.textField}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          required
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl required className={classes.formControl}>
                        <TextField
                          id="phone"
                          label="Phone"
                          name="phone"
                          type="text"
                          helperText="Only enter numbers"
                          value={state.phone}
                          onChange={handleChange}
                          className={classes.textField}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          required
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl required className={classes.formControl}>
                        <TextField
                          id="email"
                          label="Email"
                          name="email"
                          type="text"
                          value={state.email}
                          onChange={handleChange}
                          className={classes.textField}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          required
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl required className={classes.formControl}>
                        <InputLabel shrink htmlFor="bloodGroup">
                          Blood Group
                        </InputLabel>
                        <Select
                          native
                          id="bloodGroup"
                          onChange={handleChange}
                          className={classes.selectField}
                          inputProps={{
                            name: 'bloodGroup',
                            id: 'bloodGroup',
                          }}
                        >
                          <option aria-label="None" value="" />
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl required className={classes.formControl}>
                        <InputLabel shrink htmlFor="sex">Sex</InputLabel>
                        <Select
                          native
                          id="sex"
                          onChange={handleChange}
                          className={classes.selectField}
                          inputProps={{
                            name: 'sex',
                            id: 'sex',
                          }}
                        >
                          <option aria-label="None" value="" />
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl required className={classes.formControl}>
                        <InputLabel shrink htmlFor="previousPregnancies">
                          Previous Pregnancies
                        </InputLabel>
                        <Select
                          native
                          id="previousPregnancies"
                          onChange={handleChange}
                          className={classes.selectField}
                          inputProps={{
                            name: 'previousPregnancies',
                            id: 'previousPregnancies',
                          }}
                        >
                          <option aria-label="None" value="" />
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl required className={classes.formControl}>
                        <InputLabel shrink htmlFor="previousTransfusions">
                          Previous Transfusions
                        </InputLabel>
                        <Select
                          native
                          id="previousTransfusions"
                          onChange={handleChange}
                          className={classes.selectField}
                          inputProps={{
                            name: 'previousTransfusions',
                            id: 'previousTransfusions',
                          }}
                        >
                          <option aria-label="None" value="" />
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl required className={classes.formControl}>
                        <InputLabel shrink htmlFor="previousReactions">
                          Previous Reactions
                        </InputLabel>
                        <Select
                          native
                          id="previousReactions"
                          onChange={handleChange}
                          className={classes.selectField}
                          inputProps={{
                            name: 'previousReactions',
                            id: 'previousReactions',
                          }}
                        >
                          <option aria-label="None" value="" />
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary" form="makeDonorForm">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary" type="submit" form="makeDonorForm">
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
