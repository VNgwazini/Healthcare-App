import React, { useState } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Button,
  Box,
  Card,
  CardHeader,
  Chip,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  Popover,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  makeStyles
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import UpdateIcon from '@material-ui/icons/Update';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import axios from 'axios';

const token = localStorage.jwt;

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  },
  typography: {
    padding: theme.spacing(1),
  },
  formControl: {
    minWidth: 120,
    width: "100%"
  },
  selectField: {
    width: "200px"
  },
  textField: {
    width: "200px"
  }
}));

const RequestsSent = ({ className, requests, suppliers, ...rest }) => {
  const classes = useStyles();
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openCancel, setOpenCancel] = React.useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [state, setState] = React.useState({
    cancellationReason: "None provided"
  });

  const resetSelectedIDs = () => {
    setSelectedCustomerIds([]);
  }

  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = requests.map((customer) => customer.id);
    } else {
      newSelectedCustomerIds = [];
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
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
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleChange = (event) => {
    setState(event.target.value);
  };

  const handleClickOpenUpdate = (event, id) => {
    handleSelectOne(event,id);
    setOpenUpdate(true);
  };


  const handleCloseUpdate = () => {
    setOpenUpdate(false);
    resetSelectedIDs();
  };

  const handleSubmitUpdate = (props) => {
    let formData =  new FormData(document.getElementById("updateMultiple"));
    var object = {};
    for (var pair of formData.entries()) {
      var key = pair[0];
      var value = pair[1];
      if (value != '') {
        if (key === "supplierIndex") { 
          key = "supplier"; 
          value = suppliers[value];
        }
        object[key] = value;
      }
    }
    console.log(object);
    for(let i in selectedCustomerIds){
      console.log(`${i}: `,selectedCustomerIds);
      axios({
        method: 'PUT',
        url: `http://localhost:1337/blood-requests/${selectedCustomerIds[i]}`,
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: object
      })
      //handle success
      .then((response) => {
        console.log(response.data);
        handleCloseUpdate();      
      })
      //handle error
      .catch(error => console.error(`Error: ${error}`));
      window.location.reload();
    }
  };

  const handleClickOpenCancel = (event, id) => {
    handleSelectOne(event,id);
    setOpenCancel(true);
  };

  const handleCloseCancel = () => {
    setOpenCancel(false);
    resetSelectedIDs();
  };

  const handleSubmitCancel = () => {
    let formData =  new FormData(document.getElementById("cancelRequest"));
    let reason = formData.get("cancellationReason");
    console.log(reason);
    axios({
      method: 'PUT',
      url: `http://localhost:1337/blood-requests/${selectedCustomerIds[0]}`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {"status": "canceled", "cancellationReason": reason}
    })
    .then((response) => {
      console.log(response);    
    })
    .catch(error => console.error(`Error: ${error}`));
    window.location.reload();
  }

  const handleClickOpenPopover = (event, req) => {
    handleSelectOne(event, req.id);
    setAnchorEl(event.currentTarget);
    var reason = req.cancellationReason ? req.cancellationReason : "None provided";
    setState({
      cancellationReason: reason
    })
    setOpenPopover(true);
  };

  const handleClosePopover = () => {
    setOpenPopover(false);
    setAnchorEl(null);
    resetSelectedIDs();
  };

  const displayTable = (requests) => {
    return (
      <>
        <Card>
          <CardHeader title="Your Requests" />
          <Box my={3} mx={3}>
            <Dialog open={openUpdate} onClose={handleCloseUpdate} aria-labelledby="form-dialog-title">
              <form encType="multipart/form-data" onSubmit={handleSubmitUpdate}  method="post" id="updateMultiple">
                <FormGroup id="updateForm">
                  <DialogTitle id="form-dialog-title">Update Request</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      To update a request, please enter the updated information here.<br/>
                      Only fill out the fields that you want to update.
                    </DialogContentText>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <FormControl className={classes.formControl}>
                          <InputLabel htmlFor="bloodGroup">NEW Blood Group</InputLabel>
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
                        <TextField
                          id="units"
                          label="NEW Units"
                          name="units"
                          type="number"
                          onChange={handleChange}
                          className={classes.textField}
                          InputProps={{inputProps: {min: 0}}}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl>
                          <InputLabel htmlFor="supplierIndex">NEW Supplier</InputLabel>
                          <Select
                            native
                            id="supplierIndex"
                            onChange={handleChange}
                            className={classes.selectField}
                            inputProps={{
                              name: 'supplierIndex',
                              id: 'supplierIndex',
                            }}
                          >
                            <option aria-label="None" value="" />
                            {suppliers.map((supplier, index) => 
                              <option value={index}>{supplier.name}</option>
                            )}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl>
                          <InputLabel htmlFor="requestType">NEW Request Type</InputLabel>
                          <Select
                            native
                            id="requestType"
                            onChange={handleChange}
                            className={classes.selectField}
                            inputProps={{
                              name: 'requestType',
                              id: 'requestType',
                            }}
                          >
                            <option aria-label="None" value="" />
                            <option value="emergency">Emergency</option>
                            <option value="urgent">Urgent</option>
                            <option value="standard">Standard</option>
                            <option value="group_supply">Low</option>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseUpdate} color="primary" form="updateForm">
                      Cancel
                    </Button>
                    <Button onClick={handleSubmitUpdate} color="primary" type="submit" form="updateForm">
                      Submit
                    </Button>
                  </DialogActions>
                </FormGroup>
              </form>
            </Dialog>
          </Box>
          <Box my={3} mx={3}>
            <Dialog open={openCancel} onClose={handleCloseCancel} aria-labelledby="form-dialog-title">
              <form encType="multipart/form-data" onSubmit={handleSubmitCancel}  method="post" id="cancelRequest">
                <FormGroup>
                  <DialogTitle id="form-dialog-title">Cancel Request</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Before canceling a request, please enter the cancellation reason here.
                    </DialogContentText>
                    <FormControl required className={classes.formControl} id="cancelRequestForm">
                      <InputLabel htmlFor="cancellationReason">Cancellation Reason</InputLabel>
                      <Select
                        native
                        onChange={handleChange}
                        className={classes.selectField}
                        inputProps={{
                          name: 'cancellationReason',
                          id: 'cancellationReason',
                        }}
                      >
                        <option aria-label="None" value="" />
                        <option value="reason_1">reason_1</option>
                        <option value="reason_2">reason_2</option>
                        <option value="reason_3">reason_3</option>
                        <option value="reason_4">reason_4</option>
                        <option value="other">other</option>
                      </Select>
                    </FormControl>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseCancel} color="primary" form="cancelRequestForm">
                      Cancel
                    </Button>
                    <Button onClick={handleSubmitCancel} color="primary" type="submit" form="cancelRequestForm">
                      Submit
                    </Button>
                  </DialogActions>
                </FormGroup>
              </form>
            </Dialog>
          </Box>
        <Popover
          id="cancel-reason-popover"
          open={openPopover}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          <Typography className={classes.typography}>Reason: {state.cancellationReason}</Typography>
        </Popover>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{textAlign: "center"}}>
                Action
              </TableCell>
              <TableCell>
                Creation Date
              </TableCell>
              <TableCell>
                Last Updated
              </TableCell>
              <TableCell>
                Blood Group
              </TableCell>
              <TableCell>
                Units
              </TableCell>
              <TableCell>
                Supplier
              </TableCell>
              {/* <TableCell>
                Delivery Method
              </TableCell> */}
              <TableCell>
                Status
              </TableCell>
              <TableCell>
                Request Type
              </TableCell>
              <TableCell>
                Request ID
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {requests
            .slice(page * limit, page * limit + limit)
            .map((request) => (
            <>
              <TableRow
                hover
                key={request.id}
                selected={selectedCustomerIds.indexOf(request.id) !== -1}
              >
                <TableCell>
                  <div style={{textAlign: "center"}}>
                    <Chip 
                      icon={request.status == "canceled" ? <CancelIcon /> 
                          : (request.deliveryMethod == "dispatch" ? <LocalShippingIcon /> : <FlightTakeoffIcon />)} 
                      label={request.status == "canceled" ? "N/A" : "Sent"}
                      color="default"
                      disabled
                      style={request.status != "pending" ? {display: "inline-flex"} : {display: "none"}}
                    />
                    <Tooltip title="Update" placement="top">
                      <IconButton
                        color="primary"
                        size="small"
                        style={request.status == "pending" ? {display: "inline-flex"} : {display: "none"}}
                        onClick={(event) => {handleClickOpenUpdate(event,request.id)}}
                      >
                        <UpdateIcon/>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Cancel" placement="top">
                      <IconButton 
                        color="primary"
                        size="small"
                        style={request.status == "pending" ? {display: "inline-flex"} : {display: "none"}}
                        onClick={(event) => {handleClickOpenCancel(event,request.id)}}
                      >
                        <CancelIcon/>
                      </IconButton>
                    </Tooltip>
                  </div>
                </TableCell>
                <TableCell>
                  {moment(request.createdAt).format('ll')}
                </TableCell>
                <TableCell>
                  {moment(request.updatedAt).format('ll')}
                </TableCell>
                <TableCell>
                  {request.bloodGroup}
                </TableCell>
                <TableCell>
                  {request.units}
                </TableCell>
                <TableCell>
                  {request.supplier ? request.supplier.name : "Finding supplier..."}
                </TableCell>
                {/* <TableCell>
                  {request.deliveryMethod}
                </TableCell> */}
                <TableCell>
                  <Tooltip title="Click to view reason" placement="top">
                    <Chip 
                      id="popover-chip" 
                      color="primary" 
                      label={request.status} 
                      size="small" 
                      style={request.status == "canceled" ? {display: "inline-flex"} : {display: "none"}}
                      onClick={(event) => {handleClickOpenPopover(event, request)}}
                    />
                  </Tooltip>
                  <Chip 
                    color={request.status=="pending" ? "primary" : "default"} 
                    label={request.status} 
                    size="small" 
                    style={request.status == "canceled" ? {display: "none"} : {display: "inline-flex"}}
                  />
                </TableCell>
                <TableCell>
                  {request.requestType}
                </TableCell>
                <TableCell>
                  {request.id.slice(17)}
                </TableCell>
              </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </Card>
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
          {displayTable(requests)}
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={requests.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />
    </Card>
  );
};

RequestsSent.propTypes = {
  className: PropTypes.string,
};

export default RequestsSent;
