import React, { useState } from 'react';
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
import { 
  bloodUnits,
  bloodBanks
} from  "../../../data"
import { random, slice } from 'lodash';

  const NetworkBloodSupply = ({ className, ...rest }) => {

    const [bloodUnitData, setbloodUnitData] = useState(bloodUnits);
    const [bloodBankData, setBloodBankData] = useState(bloodBanks);
    const BLOODTYPES = ['A%2B', 'A-', 'B%2B', 'B-', 'AB%2B', 'AB-', 'O%2B', 'O-'];
    var bankNames = [];
    var network = [];
  {bloodBankData
    .slice(0,7)
    .map((bank, index) => (
      bankNames.push(bank.name + " Hospital")
    ))}
    for(var bank in  bankNames){
      var typeCounts = [];
      for(var bloodType in BLOODTYPES){
        typeCounts.push(random(50));
      }
      network.push(typeCounts);
    }
    
    const data = {
      datasets: [
        {
          backgroundColor: colors.red[600],
          data: network[0],
          label: 'A+'
        },
        {
          backgroundColor: colors.orange[600],
          data: network[1],
          label: 'A-'
        },
        {
          backgroundColor: colors.yellow[600],
          data: network[2],
          label: 'B+'
        },
        {
          backgroundColor: colors.green[600],
          data: network[3],
          label: 'B-'
        },
        {
          backgroundColor: colors.teal[600],
          data: network[4],
          label: 'AB+'
        },
        {
          backgroundColor: colors.blue[600],
          data: network[5],
          label: 'AB-'
        },
        {
          backgroundColor: colors.indigo[600],
          data: network[6],
          label: 'O+'
        },
        {
          backgroundColor: colors.purple[600],
          data: network[7],
          label: 'O-'
        }
      ],
      labels: bankNames
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
        <Box
          height={400}
          position="relative"
          style={{display: "block"}}
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
          href="/app/manage_requests"
        >
          Make a request
        </Button>
      </Box>
    </Card>
  );
}

NetworkBloodSupply.propTypes = {
  className: PropTypes.string
};

export default NetworkBloodSupply;
