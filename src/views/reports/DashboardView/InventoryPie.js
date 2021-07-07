import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  colors
} from '@material-ui/core';
import OpacityIcon from '@material-ui/icons/Opacity';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { random } from 'lodash';

const BLOODTYPES = ['A%2B', 'A-', 'B%2B', 'B-', 'AB%2B', 'AB-', 'O%2B', 'O-'];

// class InventoryPie extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       units: []
//     }
//   }

//   componentDidMount() {
//     const token = localStorage.getItem("jwt");
//     const user = JSON.parse(localStorage.getItem("user"));

//     const getData = async () => {
//       var url;
//       var tempArr = [];
//       for (const i in BLOODTYPES) {
//         url = `http://localhost:1337/bloodsupplies?bloodBank.id=${user.bloodBank.id}&bloodDonor.bloodGroup=${BLOODTYPES[i]}&usage=unassigned`;
//         const response = await axios.get(url, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         tempArr.push(response.data.length);
//         this.setState({
//           units: tempArr
//         });
//       }
//     }
    
//     if (user) {
//       getData();
//     }
//   }

  const InventoryPie = ({ className, ...rest }) => {

    var dataArr = [];
    var total = 0    
    var typeCounts = [];
    for(var bloodType in BLOODTYPES){
      var count = random(50);
      typeCounts.push(count);
      total = total + count;
    }
    
    for (const i in typeCounts) {
      dataArr.push(Math.round(typeCounts[i] / total * 100));
    }

    const data = {
      datasets: [
        {
          data: dataArr,
          backgroundColor: [
            colors.red[600],
            colors.orange[600],
            colors.yellow[600],
            colors.green[600],
            colors.teal[600],
            colors.blue[600],
            colors.indigo[600],
            colors.purple[600],
          ],
          borderWidth: 8,
          borderColor: colors.common.white,
          hoverBorderColor: colors.common.white
        }
      ],
      labels: BLOODTYPES
    };
  
    const devices = [
      {
        title: 'A+',
        value: dataArr[0],
        icon: OpacityIcon,
        color: colors.red[600]
      },
      {
        title: 'A-',
        value: dataArr[1],
        icon: OpacityIcon,
        color: colors.orange[600]
      },
      {
        title: 'B+',
        value: dataArr[2],
        icon: OpacityIcon,
        color: colors.yellow[600]
      },
      {
        title: 'B-',
        value: dataArr[3],
        icon: OpacityIcon,
        color: colors.green[600]
      },
      {
        title: 'AB+',
        value: dataArr[4],
        icon: OpacityIcon,
        color: colors.teal[600]
      },
      {
        title: 'AB-',
        value: dataArr[5],
        icon: OpacityIcon,
        color: colors.blue[600]
      },
      {
        title: 'O+',
        value: dataArr[6],
        icon: OpacityIcon,
        color: colors.indigo[600]
      },
      {
        title: 'O-',
        value: dataArr[7],
        icon: OpacityIcon,
        color: colors.purple[600]
      }
    ];
  
    const options = {
      animation: false,
      cutoutPercentage: 80,
      layout: { padding: 0 },
      legend: {
        display: false
      },
      maintainAspectRatio: false,
      responsive: true
    };
  
  return (
    <Card
      className={className}
      style={{height: '100%'}}
      {...rest}
    >
      <CardHeader title="Inventory Overview"/>
      <Divider />
      <CardContent>
        <Box
          height={300}
          position="relative"
        >
          <Doughnut
            data={data}
            options={options}
          />
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          mt={2}
        >
          {devices.map(({
            color,
            icon: Icon,
            title,
            value
          }) => (
            <Box
              key={title}
              p={1}
              textAlign="center"
            >
              <Icon color="action" />
              <Typography
                color="textPrimary"
                variant="body1"
              >
                {title}
              </Typography>
              <Typography
                style={{ color }}
                variant="h4"
              >
                {value}
                %
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
      <Divider />
      <Box display="flex" justifyContent="flex-end" p={1}>
        <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
          href="/app/manage_inventory"
        >
          View details
        </Button>
      </Box>
    </Card>
  );
}

InventoryPie.propTypes = {
  className: PropTypes.string
};

export default InventoryPie;
