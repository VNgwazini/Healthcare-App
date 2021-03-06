import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  FormGroup,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl, 
  Grid,
  InputLabel,
  makeStyles,
  Select,
  TextField
} from '@material-ui/core';
import axios from 'axios';
import { 
  bloodRequests,
  bloodBanks
} from  "../../../data"

const token = localStorage.getItem("jwt");
const user = JSON.parse(localStorage.getItem("user"));

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
  },
  selectField: {
    width: "100%"
  },
  textField: {
    width: "100%"
  }
}));

const Toolbar = ({ className, suppliers, ...rest }) => {
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
  
  const handleSubmit = () => {
    let formData =  new FormData(document.getElementById("makeRequest"));
    var object = {};
    formData.forEach(function(value, key){
      if (key === "supplierIndex") { object["supplier"] = suppliers[value]; }
      else { object[key] = value; }
    });
    object["user"] = user;
    object["status"] = "pending";
    object["requestor"] = "Demo Bank";
    console.log(object);

    axios({
      method: 'POST',
      url: 'http://localhost:1337/blood-requests',
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: object 
    })
    .then((response) => {
      handleClose();
      window.location.reload();
    })
    .catch(error => console.error(`Error: ${error}`));
    handleClose();
    window.location.reload();
  };
// eslint-disable-next-line
  const [data, setData] = useState(bloodRequests);
  // eslint-disable-next-line
  const [bankData, setbankData] = useState(bloodBanks);

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box display="flex" justifyContent="flex-end">
        <Button
          color="primary"
          variant="contained"
          onClick={handleClickOpen}
        >
          Make Request
        </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <form encType="multipart/form-data" onSubmit={handleSubmit}  method="post" id="makeRequest">
            <FormGroup id="makeRequestForm">
              <DialogTitle id="form-dialog-title">Make a Request</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  To make a request, please select and submit the relevant information here.<br/>
                  All fields are required.
                </DialogContentText>
                <Grid container spacing={2}>
                <Grid item xs={6}>
                    <FormControl required>
                      <InputLabel htmlFor="bloodGroup">Group</InputLabel>
                      <Select
                        native
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
                        <option value="">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl required>
                      <TextField
                        id="units"
                        label="Units"
                        name="units"
                        type="number"
                        value={state.units}
                        onChange={handleChange}
                        className={classes.textField}
                        InputProps={{inputProps: {min: 0}}}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl required>
                      <InputLabel htmlFor="supplierIndex">Supplier</InputLabel>
                      <Select
                        native
                        onChange={handleChange}
                        className={classes.selectField}
                        inputProps={{
                          name: 'supplierIndex',
                          id: 'supplierIndex',
                        }}
                      >
                        <option aria-label="None" value="" />
                        {bloodBanks.map((supplier, index) => 
                          <option value={index}>{supplier.name + " County Hospital"}</option>
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl required>
                      <InputLabel htmlFor="requestType">Request</InputLabel>
                      <Select
                        native
                        onChange={handleChange}
                        className={classes.selectField}
                        inputProps={{
                          name: 'requestType',
                          id: 'requestType',
                        }}
                      >
                        <option aria-label="None" value="" />
                        <option value="emergency">emergency</option>
                        <option value="urgent">urgent</option>
                        <option value="standard">standard</option>
                        <option value="group_supply">low</option>
                        <option value="">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary" form="makeRequestForm">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary" type="submit" form="makeRequestForm">
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