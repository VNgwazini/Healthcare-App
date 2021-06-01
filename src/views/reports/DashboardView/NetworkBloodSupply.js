import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  colors
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

const BLOODTYPES = ['A%2B', 'A-', 'B%2B', 'B-', 'AB%2B', 'AB-', 'O%2B', 'O-'];

class NetworkBloodSupply extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      network: [], // per each blood type, has a list of each bank's inventory for that type
      bloodbanks: [] // list of banks' names
    }
  }

  componentDidMount() {
    const token = localStorage.getItem("jwt");
    const user = JSON.parse(localStorage.getItem("user"));

    const getData = async () => {
      const responseBanks = await axios.get(`http://localhost:1337/bloodbanks?id_ne=${user.bloodBank.id}&_limit=5`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      var tempNames = [];
      var bankIds = [];
      for (var bank of responseBanks.data) {
        tempNames.push(bank.name);
        bankIds.push(bank.id);
      }
      this.setState({
        bloodbanks: tempNames
      });

      var url, typeList;
      const currentDate = new Date();

      for (var type of BLOODTYPES) {
        typeList = [];
        for (var id of bankIds) {
          url = `http://localhost:1337/bloodsupplies?bloodBank.id=${id}&bloodDonor.bloodGroup=${type}&usage=unassigned`;
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          typeList.push(response.data.length);
        }
        var tempNames = this.state.network;
        tempNames.push(typeList);
        this.setState({
          network: tempNames
        });
      }
    } 

    if (user) {
      getData();
    }
  }

  render() {
    const {className, ...rest} = this.props;

    const data = {
      datasets: [
        {
          backgroundColor: colors.red[600],
          data: this.state.network[0],
          label: 'A+'
        },
        {
          backgroundColor: colors.orange[600],
          data: this.state.network[1],
          label: 'A-'
        },
        {
          backgroundColor: colors.yellow[600],
          data: this.state.network[2],
          label: 'B+'
        },
        {
          backgroundColor: colors.green[600],
          data: this.state.network[3],
          label: 'B-'
        },
        {
          backgroundColor: colors.teal[600],
          data: this.state.network[4],
          label: 'AB+'
        },
        {
          backgroundColor: colors.blue[600],
          data: this.state.network[5],
          label: 'AB-'
        },
        {
          backgroundColor: colors.indigo[600],
          data: this.state.network[6],
          label: 'O+'
        },
        {
          backgroundColor: colors.purple[600],
          data: this.state.network[7],
          label: 'O-'
        }
      ],
      labels: this.state.bloodbanks
    };
  
    const options = {
      animation: false,
      cornerRadius: 20,
      layout: { padding: 0 },
      legend: { display: false },
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        xAxes: [
          {
            barThickness: 12,
            maxBarThickness: 10,
            barPercentage: 0.5,
            categoryPercentage: 0.5,
            gridLines: {
              display: false,
              drawBorder: false
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              min: 0
            },
            gridLines: {
              borderDash: [2],
              borderDashOffset: [2],
              drawBorder: false,
              zeroLineBorderDash: [2],
              zeroLineBorderDashOffset: [2],
            }
          }
        ]
      },
      tooltips: {
        borderWidth: 1,
        enabled: true,
        intersect: false,
        mode: 'index',
      }
    };

    var isLoaded = false;
    for (var obj of data["datasets"]) {
      if (obj["data"]) {
        for (var entry of obj["data"]) {
          if (!entry) {
            isLoaded = false;
          }
          else {
            isLoaded = true;
          }
        }
      }
      else {
        isLoaded = false;
      }
    }
  
    return (
      <Card
        className={className}
        {...rest}
      >
        <CardHeader
          title="Network Blood Supply"
        />
        <Divider />
        <CardContent>
          <img src="/static/loading.gif" alt="Loading..."
              style={isLoaded ? {display: "none"} : {display: "block", margin: "auto", height: "400px", width: "50%"}}/>
          <Box
            height={400}
            position="relative"
            style={isLoaded ? {display: "block"} : {display: "none"}}
          >
            <Bar
              data={data}
              options={options}
            />
          </Box>
        </CardContent>
        <Divider />
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button
            color="primary"
            endIcon={<ArrowRightIcon />}
            size="small"
            variant="text"
            href="http://localhost:3000/app/manage_requests"
          >
            Make a request
          </Button>
        </Box>
      </Card>
    );
  }
};

NetworkBloodSupply.propTypes = {
  className: PropTypes.string
};

export default NetworkBloodSupply;
