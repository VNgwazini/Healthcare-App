import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Typography
} from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';

// props: bloodType and className only
// state includes values received from the API, units and expired
class BloodTypeCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      units: 0,
      showAlert: false
    }
  }

  componentDidMount() {
    const token = localStorage.getItem("jwt");
    const user = JSON.parse(localStorage.getItem("user"));
    const currentDate = new Date();

    const updateData = async (id) => {
      axios({
        method: 'PUT',
        url: `http://localhost:1337/bloodsupplies/${id}`,
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: { usage: "unassigned" }
      })
      .then((response) => {
        console.log(response.data);
      })   
    }

    // if (this.props.bloodType == "A+") {
    //   for (var i = 0; i < 1201; i+=100) {
    //     var url = `http://localhost:1337/bloodsupplies?_start=${i}`
    //     axios({
    //       method: 'GET',
    //       url: url,
    //       headers: {
    //         Authorization: `Bearer ${token}`
    //       }
    //     })
    //     .then((response) => {
    //       console.log(response.data.length);
    //       for (var i in response.data) {
    //         updateData(response.data[i].id);
    //       }
    //     })
    //   }
    // }
    
    const getData = async () => {
      var url = `http://localhost:1337/bloodsupplies?bloodBank.id=${user.bloodBank.id}&bloodDonor.bloodGroup=${this.props.bloodType}&usage=unassigned`;
      // encoding + in the URL
      if (url.includes('+')) {
        url = url.replace('+', '%2B');
      }
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.setState({
        units: response.data.length
      });
      // sets showAlert to true if some units are close to expiring
      var almostExpired = false;
      var thresholdDate = new Date();
      const DAYS = 5; // the number of days before expiration when we want to alert
      thresholdDate.setDate(thresholdDate.getDate() + DAYS);
      for (const entry of response.data) {
        const expDate = new Date(entry.expiration);
        if (expDate < thresholdDate) {
          almostExpired = true;
          break;
        }
      }
      this.setState({
        showAlert: almostExpired
      });
    }

    if (user) {
      getData();
    }
  }
  
  // TODO: make cards clickable so they lead to the inventory page
  render() {
    const {bloodType, className, ...rest} = this.props;
    return (
      <Card
        className={className}
        variant="outlined"
        style={{position: 'relative', height: '100%'}}
        {...rest}
      >
        <div style={this.state.showAlert ? {display: 'inline', position: 'absolute', top: 0, right: 0} 
          : {display: 'none'}}>
          <Tooltip placement="top" title={this.state.showAlert ? "Some units will expire in 5 days or less" : ""}>
            <IconButton>
              <ErrorIcon color="error" fontSize="small"/>
            </IconButton>
          </Tooltip>
        </div>
        <CardContent>
          <Typography
            style={this.state.units > 1 ? {color: '#3F51B5'} : {color: '#E53935'}}
            variant="h3"
            align="center"
          >
            {bloodType}
          </Typography>
          <Typography
            variant="body2"
            align="center"
          >
            {this.state.units} UNITS
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

BloodTypeCard.propTypes = {
  bloodType: PropTypes.string,
  className: PropTypes.string
};

export default BloodTypeCard;
