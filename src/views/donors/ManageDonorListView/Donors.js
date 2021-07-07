import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Button,
  Box,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormGroup,
  Grid,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  makeStyles,
} from '@material-ui/core';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import { 
  bloodDonors
} from  "../../../data"
import "./custom.css"
import axios from 'axios';

const token = localStorage.jwt;

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    width: "100%"
  },
  selectField: {
    width: "75%"
  },
  textField: {
    width: "75%"
  }
}));

const Donors = ({ className, ...rest }) => {
  const classes = useStyles();
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState('');
  // eslint-disable-next-line
  const [data, setData] = useState(bloodDonors);


  const resetSelectedIDs = () => {
    setSelectedCustomerIds([]);
  }
  
  const handleChange = (event) => {
    setState(event.target.value);
  };

  const handleClickOpen = (event, id) => {
    handleSelectOne(event, id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetSelectedIDs();
  };

  const handleSubmit = (props) => {
    let formData =  new FormData(document.getElementById("updateDonor"));
    var object = {};
    for (var pair of formData.entries()) {
      var key = pair[0];
      var value = pair[1];
      console.log(key, value);
      if (value !== '') {
        object[key] = value;
      }
    }
    console.log(object);

    for(let i in selectedCustomerIds){
      console.log(`${i}: `,selectedCustomerIds);
      axios({
        method: 'PUT',
        url: `http://localhost:1337/blood-donors/${selectedCustomerIds[i]}`,
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: object
      })
      //handle success
      .then((response) => {
        console.log(response.data);
        handleClose();
        window.location.reload();      
      })
      //handle error
      .catch(error => console.error(`Error: ${error}`));
      handleClose();
      window.location.reload();   
    }
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomerIds.indexOf(id);
    let newSelectedCustomerIds = [];

    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, id);
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1));
    } else if (selectedIndex === selectedCustomerIds.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, selectedIndex),
        selectedCustomerIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
    console.log('Selected IDs: ', newSelectedCustomerIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const displayTable = (data) => {
    return (
      <>
        <Box my={3} mx={3}>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
              <form encType="multipart/form-data" onSubmit={handleSubmit}  method="post" id="updateDonor">
                <FormGroup id="updateDonorForm">
                  <DialogTitle id="form-dialog-title">Update a Donor</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      To update a donor, please enter the updated information here.<br/>
                      Only fill out the fields that you want to update. 
                    </DialogContentText>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <FormControl className={classes.formControl}>
                            <TextField
                              id="firstName"
                              label="NEW First Name"
                              name="firstName"
                              type="text"
                              onChange={handleChange}
                              className={classes.textField}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                          <FormControl className={classes.formControl}>
                            <TextField
                              id="lastName"
                              label="NEW Last Name"
                              name="lastName"
                              type="text"
                              onChange={handleChange}
                              className={classes.textField}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                          <FormControl className={classes.formControl}>
                            <TextField
                              id="phone"
                              label="NEW Phone"
                              name="phone"
                              type="text"
                              helperText="Only enter numbers"
                              value={state.phone}
                              onChange={handleChange}
                              className={classes.textField}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                          <FormControl className={classes.formControl}>
                            <TextField
                              id="email"
                              label="NEW Email"
                              name="email"
                              type="text"
                              value={state.email}
                              onChange={handleChange}
                              className={classes.textField}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                          <FormControl className={classes.formControl}>
                            <InputLabel shrink htmlFor="bloodGroup">
                              NEW Blood Group
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
                          <FormControl className={classes.formControl}>
                            <InputLabel shrink htmlFor="sex">
                              NEW Sex
                            </InputLabel>
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
                          <FormControl className={classes.formControl}>
                            <InputLabel shrink htmlFor="previousPregnancies">
                              NEW Prev. Pregnancies
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
                          <FormControl className={classes.formControl}>
                            <InputLabel shrink htmlFor="previousTransfusions">
                             NEW Prev. Transfusions
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
                          <FormControl className={classes.formControl}>
                            <InputLabel shrink htmlFor="previousReactions">
                             NEW Prev. Reactions
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
                    <Button onClick={handleClose} color="primary" form="updateDonorForm">
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" type="submit" form="updateDonorForm">
                      Submit
                    </Button>
                  </DialogActions>
                </FormGroup>
              </form>
            </Dialog>
        </Box>
      <Table className="custom-table">
      <TableHead>
          <TableRow>
            <TableCell style={{textAlign: "center"}}>
            Action
            </TableCell>
            <TableCell>
            Name
            </TableCell>
            <TableCell>
            Phone Number
            </TableCell>
            <TableCell>
            Email Address
            </TableCell>
            <TableCell>
            Blood Group
            </TableCell>
            <TableCell>
            Sex
            </TableCell>
            <TableCell>
            Previous Transfusions
            </TableCell>
            <TableCell>
            Previous Reactions
            </TableCell>
            <TableCell>
            Donor ID
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {bloodDonors
        .slice(page * limit, page * limit + limit)
        .map((data) => (
          <>
            <TableRow
              hover
              key={data.id}
              selected={selectedCustomerIds.indexOf(data.id) !== -1}
            >
              <TableCell style={{textAlign: "center"}}>
                <Chip icon={<OpenInBrowserIcon />} label="Update" color="secondary" onClick={(event) => {handleClickOpen(event, data.id)}}/>
              </TableCell>
              <TableCell>
                {data.firstName + " " + data.lastName}
              </TableCell>
              <TableCell>
                {data.phone}
              </TableCell>
              <TableCell>
                {data.email}
              </TableCell>
              <TableCell>
                {data.bloodGroup}
              </TableCell>
              <TableCell>
                {data.sex}
              </TableCell>
              <TableCell>
                {data.previousTransfusions}
              </TableCell>
              <TableCell>
                {data.previousReactions}
              </TableCell>
              <TableCell>
                {data.id}
              </TableCell>
            </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
      </>
    )
  }

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <PerfectScrollbar>
        <Box minWidth={1050}>
          {displayTable(data)}
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={data.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
      />
    </Card>
  );
};

Donors.propTypes = {
  className: PropTypes.string,
};

export default Donors;
