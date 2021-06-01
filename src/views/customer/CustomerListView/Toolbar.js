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
  FormControl
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import axios from 'axios';

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
  table: {
    width: "100%",
    overflowX: "auto"
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
    window.location.reload();
  };
  
  const handleSubmit = (props) => {
    let formData =  new FormData(document.getElementById("makeRequest"));
    var object = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });
    console.log(object)

    axios({
          method: 'POST',
          url: 'http://localhost:1337/blood-requests',
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
    window.location.reload();
  };

  const { bloodGroup, units, supplier, deliveryMethod, status, requestType } = state
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
          Make A Request
          </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
              <form encType="multipart/form-data" onSubmit={handleSubmit}  method="post" id="makeRequest">
                <FormGroup>
                  <DialogTitle id="form-dialog-title">Make A Request</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      To make a Request, please select the blood group and expiraton date here.
                    </DialogContentText>
                    <FormControl required className={classes.formControl} id="requestForm">
                      <TextField
                        id="requestor"
                        label="Requestor"
                        name="requestor"
                        type="text"
                        defaultValue={User.bloodBank.id}
                        InputProps={{
                          readOnly: true,
                        }}
                        onChange={handleChange}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        id="bloodGroup"
                        label="Blood Group"
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
                        label="Units"
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
                        id="supplier"
                        label="Supplier"
                        name="supplier"
                        type="text"
                        value={supplier}
                        onChange={handleChange}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        id="deliveryMethod"
                        label="Delivery Method"
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
                        id="user"
                        label="User"
                        name="user"
                        type="text"
                        defaultValue={User.id}
                        InputProps={{
                          readOnly: true,
                        }}
                        onChange={handleChange}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        id="status"
                        label="Status"
                        name="status"
                        type="text"
                        defaultValue="pending"
                        InputProps={{
                          readOnly: true,
                        }}
                        onChange={handleChange}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        id="requestType"
                        label="Request Type"
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
                    <Button onClick={handleClose} color="primary" form="requestForm">
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" type="submit" form="requestForm">
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