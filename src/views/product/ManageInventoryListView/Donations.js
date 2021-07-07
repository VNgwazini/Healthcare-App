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
  List,
  ListItem,
  ListItemText,
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
import UpdateIcon from '@material-ui/icons/Update';
import InfoIcon from '@material-ui/icons/Info';
import moment from 'moment';
import { 
  bloodUnits,
  bloodDonors
} from  "../../../data"
import axios from 'axios';
import { random } from 'lodash';

const token = localStorage.jwt;


const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }, 
  formControl: {},
  selectField: {
    width: "200px"
  },
  textField: {
    width: "200px"
  }
}));

const Donations = ({ className, ...rest }) => {
  const classes = useStyles();
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [open, setOpen] = React.useState(false);

  const [openInfo, setOpenInfo] = React.useState(false);
  const [reqInfo, setReqInfo] = React.useState(''); 

  const [state, setState] = React.useState('');
  const [curDonor, setCurDonor] = React.useState('');

  const resetSelectedIDs = () => {
    setSelectedCustomerIds([]);
  }
  
  const handleChange = (event) => {
    setState(event.target.value);
  };

  const handleDonorChange = (event) => {
    // since the "value" of the donor field in the form
    // is the index of the donor in the donors list passed in:
    // setCurDonor(donors[event.target.value]);
  }

  const handleClickOpen = (event, id) => {
    handleSelectOne(event,id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurDonor('');
    resetSelectedIDs();
  };

  const handleSubmit = (props) => {
    let formData =  new FormData(document.getElementById("updateMultiple"));

    const donorIndex = formData.get("donorIndex");
    var expirationDate;
    if (formData.get("expiration")) {
      expirationDate = new Date(formData.get("expiration"));
      expirationDate.setDate(expirationDate.getDate() + 1);
    }
    const usage = formData.get("usage");

    var object = {}
    if (donorIndex) {object["bloodDonor"] = data.bloodDonor}
    if (expirationDate) {object["expiration"] = expirationDate.toISOString()}
    if (usage) {object["usage"] = usage}
    console.log(object);

    for(let i in selectedCustomerIds){
      axios({
        method: 'PUT',
        url: `http://localhost:1337/bloodsupplies/${selectedCustomerIds[i]}`,
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: object
      })
      //handle success
      .then((response) => {
        console.log(response.data);
        handleClose();      
        setCurDonor('');
        window.location.reload();
      })
      //handle error
      .catch(error => console.error(`Error: ${error}`));
    }
  };

  // const handleSelectAll = (event) => {
  //   let newSelectedCustomerIds;

  //   if (event.target.checked) {
  //     newSelectedCustomerIds = bloodUnits.map((customer) => customer.id);
  //   } else {
  //     newSelectedCustomerIds = [];
  //   }

  //   setSelectedCustomerIds(newSelectedCustomerIds);
  // };

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

  const handleClickOpenInfo = (event, bloodUnit) => {
    handleSelectOne(event, bloodUnit.id);
    if (bloodUnit.bloodRequest) {
      axios({
        method: 'GET',
        url: `http://localhost:1337/bloodbanks/${bloodUnit.bloodRequest.requestor}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      //handle success
      .then((response) => {
        var temp = {
          requestor: response.data.name,
          id: bloodUnit.bloodRequest.id,
          deliveryMethod: bloodUnit.bloodRequest.deliveryMethod,
          status: bloodUnit.bloodRequest.status
        }
        setReqInfo(temp);
        setOpenInfo(true);
      })
      //handle error
      .catch(error => console.error(`Error: ${error}`));
    }
    else {
      setReqInfo('')
      setOpenInfo(true);
    }
  };

  const handleCloseInfo = () => {
    setOpenInfo(false);
    resetSelectedIDs();
  };

  const [data, setData] = useState(bloodUnits);
  const [bloodDonorData, setBloodDonorData] = useState(bloodDonors);
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-","O+", "O-"]

  const displayTable = () => {
    return (
      <>
      <Box my={3} mx={3}>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <form encType="multipart/form-data" onSubmit={handleSubmit}  method="post" id="updateMultiple">
          <FormGroup id="updateForm">
            <DialogTitle id="form-dialog-title">Update Donation</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To update a request, please enter the updated information here.<br/>
                To reserve units for internal use only, select "internal" in the usage field.<br/>
                Only fill out the fields that you want to update.
              </DialogContentText>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="donorIndex">NEW Donor</InputLabel>
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
                      {bloodDonorData.map((donor, index) => 
                        <option value={index}>{donor.firstName + " " + donor.lastName}</option>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl className={classes.formControl}>
                    <TextField
                      label="NEW Donor's Blood Group"
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
                  <FormControl className={classes.formControl}>
                    <TextField
                      id="expiration"
                      label="NEW Expiration Date"
                      name="expiration"
                      type="date"
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
                    <InputLabel htmlFor="usage">NEW Usage</InputLabel>
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
              <Button onClick={handleClose} color="primary" form="updateForm">
                Cancel
              </Button>
              <Button onClick={handleSubmit} color="primary" type="submit" form="updateForm">
                Submit
              </Button>
            </DialogActions>
          </FormGroup>
        </form>
        </Dialog>
      </Box>
      <Box my={3} mx={3}>
        <Dialog open={openInfo} onClose={handleCloseInfo} aria-labelledby="requestInfo">
          <DialogTitle id="form-dialog-title">Assigned Request Info</DialogTitle>
          <DialogContent>
            <List>
              <ListItem>
                <ListItemText primary="Request ID" secondary={reqInfo ? reqInfo.id.slice(17) : "N/A"}/>
              </ListItem>
              <ListItem>
                <ListItemText primary="Requestor" secondary={reqInfo ? reqInfo.requestor : "N/A"}/>
              </ListItem>
              <ListItem>
                <ListItemText primary="Delivery Method" secondary={reqInfo ? reqInfo.deliveryMethod : "N/A"}/>
              </ListItem>
              <ListItem>
                <ListItemText primary="Status" secondary={reqInfo ? reqInfo.status : "N/A"}/>
              </ListItem>
            </List>
          </DialogContent>  
        </Dialog>
      </Box>
      <Table style={{width: "101%"}}>
      <TableHead>
          <TableRow>
            <TableCell style={{textAlign: "center"}}>
            Action
            </TableCell>
            <TableCell>
            Blood Group
            </TableCell>
            <TableCell style={{width: "9%"}}>
            Donation Date
            </TableCell>
            <TableCell>
            Expiration Date
            </TableCell>
            <TableCell>
            Donor
            </TableCell>
            <TableCell>
            Previous Transfusions
            </TableCell>
            <TableCell>
            Previous Reactions
            </TableCell>
            <TableCell>
            Usage
            </TableCell>
            <TableCell>
            Unit ID
            </TableCell>
            <TableCell>
            Request Info
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {data
        .slice(page * limit, page * limit + limit)
        .map((bloodUnit, index) => (
          <>
            <TableRow
              hover
              key={bloodUnit.id}
              selected={selectedCustomerIds.indexOf(bloodUnit.id) !== -1}
            >
              <TableCell style={{textAlign: "center"}}>
                <Chip 
                  icon={<UpdateIcon />} 
                  label={bloodUnit.usage!=="external" ? "Update" : "Used"}
                  color={bloodUnit.usage!=="external" ? "primary" : "default"}
                  onClick={(event) => {handleClickOpen(event,bloodUnit.id)}}
                  disabled={bloodUnit.usage === "external"}
                />
              </TableCell>
              <TableCell>
                {bloodGroups[random(bloodGroups.length-1)]}
              </TableCell>
              <TableCell>
                {moment(bloodUnit.createdAt).format('ll')}
              </TableCell>
              <TableCell>
                {moment(bloodUnit.expiration).format('ll')}
              </TableCell>
              <TableCell>
                {bloodDonors[index].firstName + " " +bloodDonors[index].lastName}
              </TableCell>
              <TableCell>
                {bloodDonors[index].previousTransfusions}
              </TableCell>
              <TableCell>
                {bloodDonors[index].previousReactions}
              </TableCell>
              <TableCell>
                <Chip
                  color="default"
                  label={bloodUnit.usage}
                  size="small"
                />
              </TableCell>
              <TableCell>
                {bloodUnit.id}
              </TableCell>
              <TableCell>
                <Chip 
                  icon={<InfoIcon />} 
                  label={bloodUnit.bloodRequest ? "Info" : "N/A"}
                  color={bloodUnit.bloodRequest ? "primary" : "default"}
                  onClick={(event) => {handleClickOpenInfo(event, bloodUnit)}}
                  disabled={!bloodUnit.bloodRequest}
                />
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
          {displayTable(bloodUnits)}
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={bloodUnits.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
      />
    </Card>
  );
};

Donations.propTypes = {
  className: PropTypes.string,
};

export default Donations;
