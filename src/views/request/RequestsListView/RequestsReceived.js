import React, { useState, useEffect } from 'react';
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
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';

import axios from 'axios';
import { SignalCellularNullRounded } from '@material-ui/icons';

const token = localStorage.getItem("jwt");
const user = JSON.parse(localStorage.getItem("user"));

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

const RequestsReceived = ({ className, requests, ...rest }) => {
  const classes = useStyles();
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [openFulfill, setOpenFulfill] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [state, setState] = useState({
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
    console.log(state);
  };

  const handleClickOpenFulfill = (event, id) => {
    handleSelectOne(event,id);
    setOpenFulfill(true);
  };

  const handleCloseFulfill = () => {
    setOpenFulfill(false);
    resetSelectedIDs();
  };

  const handleSubmitFulfill = (props) => {
    let formData =  new FormData(document.getElementById("fulfillRequest"));
    var dataObject = {
      status: "shipped",
      supplier: user.bloodBank,
      deliveryMethod: formData.get("deliveryMethod")
    }

    axios({
      method: 'PUT',
      url: `http://localhost:1337/blood-requests/${selectedCustomerIds[0]}`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: dataObject
    })
    .then((response) => {
      handleCloseFulfill();
    })
    .catch(error => console.error(`Error: ${error}`));

    var requestToUpdate = requests.filter(request => request.id == selectedCustomerIds[0])[0];
    const currentDate = new Date();
    // gets the oldest, non-expired, unassigned units of the right blood type
    var url = `http://localhost:1337/bloodsupplies?bloodBank.id=${user.bloodBank.id}&bloodDonor.bloodGroup=${requestToUpdate.bloodGroup}&expiration_gt=${currentDate.toISOString()}&usage=unassigned&_sort=expiration:ASC`;
    if (url.includes('+')) {
      url = url.replace('+', '%2B');
    }
    axios({
      method: 'GET',
      url: url,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((response2) => {
      for (var i = 0; i < requestToUpdate.units; i++) {
        axios({
          method: 'PUT',
          url: `http://localhost:1337/bloodsupplies/${response2.data[i].id}`,
          headers: {
            Authorization: `Bearer ${token}`
          },
          data: { 
            bloodRequest: requestToUpdate, 
            usage: "external" 
          }
        })
        .then((response3) => {
          console.log(response3.data);
          window.location.reload();
        })
      }
    })
    .catch(error => console.error(`Error: ${error}`));
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
          <CardHeader title="Requests Received" />
          <Box my={3} mx={3}>
            <Dialog open={openFulfill} onClose={handleCloseFulfill} aria-labelledby="form-dialog-title">
              <form encType="multipart/form-data" onSubmit={handleSubmitFulfill}  method="post" id="fulfillRequest">
                <FormGroup>
                  <DialogTitle id="form-dialog-title">Fulfill Request</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      To fufill a request, please enter the relevant information here.
                      Blood units of that blood type (oldest, non-expired) will be automatically assigned to this request.
                    </DialogContentText>
                    <FormControl required className={classes.formControl} id="fulfillRequestForm">
                      <InputLabel htmlFor="deliveryMethod">Delivery Method</InputLabel>
                      <Select
                        native
                        onChange={handleChange}
                        className={classes.selectField}
                        inputProps={{
                          name: 'deliveryMethod',
                          id: 'deliveryMethod',
                        }}
                      >
                        <option aria-label="None" value="" />
                        <option value="dispatch">Dispatch</option>
                        <option value="drones">Drones</option>
                      </Select>
                    </FormControl>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseFulfill} color="primary" form="fulfillRequestForm">
                      Cancel
                    </Button>
                    <Button onClick={handleSubmitFulfill} color="primary" type="submit" form="fulfillRequestForm">
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
              {/* <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedCustomerIds.length === requests.length}
                  color="primary"
                  indeterminate={
                    selectedCustomerIds.length > 0
                    && selectedCustomerIds.length < requests.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell> */}
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
                Requestor
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
                {/* <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCustomerIds.indexOf(request.id) !== -1}
                    onChange={(event) => handleSelectOne(event, request.id)}
                    value="true"
                    // disabled={request.status=="canceled"}
                  />
                </TableCell> */}
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
                    <Tooltip title="Fulfill" placement="top">
                      <IconButton
                        color="primary"
                        size="small"
                        style={request.status == "pending" ? {display: "inline-flex"} : {display: "none"}}
                        onClick={(event) => {handleClickOpenFulfill(event,request.id)}}
                      >
                        <OpenInBrowserIcon/>
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
                  {request.requestor.name}
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

RequestsReceived.propTypes = {
  className: PropTypes.string,
};

export default RequestsReceived;
