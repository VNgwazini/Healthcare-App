import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Button,
  Box,
  Card,
  Chip,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  makeStyles
} from '@material-ui/core';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';

import axios from 'axios';

const token = localStorage.jwt;

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));
const state = {
  bloodGroup:'',
  units: '',
  supplier:'',
  deliveryMethod:'',
  status:'',
  requestType:'',
  bloodUnitIds: []
}
const Results = ({ className, requests, ...rest }) => {
  const classes = useStyles();
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState('');

const resetSelectedIDs = () => {
  setSelectedCustomerIds([]);
}

  const handleChange = (event) => {
    setState(event.target.value);
  };

  const handleClickOpen = (event, id) => {
    handleSelectOne(event,id);
    setOpen(true);
  };


  const handleClose = () => {
    setOpen(false);
    resetSelectedIDs();
  };

  const handleSubmit = (props) => {
    let formData =  new FormData(document.getElementById("updateMultiple"));
    var object = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });
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
            const donor = response.data;
            console.log(donor);
            handleClose();      
          })
          //handle error
          .catch(error => console.error(`Error: ${error}`));
          window.location.reload();
        }
  };

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

  const displayTable = (requests) => {
    const { bloodGroup, units, deliveryMethod, status, requestType } = state

    return (
      <>
        <Box my={3} mx={3}>
          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
              <form encType="multipart/form-data" onSubmit={handleSubmit}  method="post" id="updateMultiple">
                <FormGroup>
                  <DialogTitle id="form-dialog-title">Make A Request</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      To update a Request, please enter the request information here.
                    </DialogContentText>
                    <FormControl required className={classes.formControl} id="requestForm">
                      <TextField
                        id="bloodGroup"
                        label="NEW Blood Group"
                        name="bloodGroup"
                        type="text"
                        value={bloodGroup}
                        onChange={handleChange}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        id="units"
                        label="NEW Units"
                        name="units"
                        type="text"
                        value={units}
                        onChange={handleChange}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        id="deliveryMethod"
                        label="NEW Delivery Method"
                        name="deliveryMethod"
                        type="text"
                        value={deliveryMethod}
                        onChange={handleChange}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        id="status"
                        label="NEW Status"
                        name="status"
                        type="text"
                        value={status}
                        onChange={handleChange}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        id="requestType"
                        label="NEW Request Type"
                        name="requestType"
                        type="text"
                        value={requestType}
                        onChange={handleChange}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </FormControl>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary" form="updateMultipleForm">
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" type="submit" form="updateMultipleForm">
                      Submit
                    </Button>
                  </DialogActions>
                </FormGroup>
              </form>
            </Dialog>
        </Box>
      <Table>
      <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={selectedCustomerIds.length === requests.length}
                color="primary"
                indeterminate={
                  selectedCustomerIds.length > 0
                  && selectedCustomerIds.length < requests.length
                }
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell>
            Action
            </TableCell>
            <TableCell>
            Request ID
            </TableCell>
            <TableCell>
            Blood Group
            </TableCell>
            <TableCell>
            Units
            </TableCell>
            <TableCell>
            Delivery Method
            </TableCell>
            <TableCell>
            Status
            </TableCell>
            <TableCell>
            Request Type
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
              key={request[1].id}
              selected={selectedCustomerIds.indexOf(request[1].id) !== -1}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedCustomerIds.indexOf(request[1].id) !== -1}
                  onChange={(event) => handleSelectOne(event, request[1].id)}
                  value="true"
                />
              </TableCell>
              <TableCell>
                <Chip icon={<OpenInBrowserIcon />} label="Update" color="secondary" onClick={(event) => {handleClickOpen(event,request[1].id)}}/>
              </TableCell>
              <TableCell>
                {request[1].id}
              </TableCell>
              <TableCell>
                {request[1].bloodGroup}
              </TableCell>
              <TableCell>
                {request[1].units}
              </TableCell>
              <TableCell>
                {request[1].deliveryMethod}
              </TableCell>
              <TableCell>
                {request[1].status}
              </TableCell>
              <TableCell>
                {request[1].requestType}
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

Results.propTypes = {
  className: PropTypes.string,
};

export default Results;
