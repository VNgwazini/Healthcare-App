import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

class RequestsSent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: []
    }
  }

  componentDidMount() {
    const token = localStorage.getItem("jwt");
    const user = JSON.parse(localStorage.getItem("user"));
    
    const getData = async () => {
      var url = `http://localhost:1337/blood-requests?requestor.id=${user.bloodBank.id}&supplier.id_ne=${user.bloodBank.id}&status_ne=canceled&_sort=createdAt:DESC&_limit=5`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.setState({
        requests: response.data
      });
    }
    if (user) {
      getData();
    }
  }

  render() {
    const {className, ...rest} = this.props;

    var data = [];
    for (var i in this.state.requests) {
      var req = this.state.requests[i];
      data.push({
        id: uuid(),
        supplier: {
          name: req.supplier ? req.supplier.name : "Finding supplier..."
        },
        type: req.bloodGroup,
        units: req.units,
        createdAt: req.createdAt,
        status: req.status,
        requestType: req.requestType
      });
    }

    const requests = data;

    return (
      <Card className={className} {...rest}>
        <CardHeader title="Requests Sent" />
        <Divider />
        <PerfectScrollbar>
          <Box minWidth={800}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sortDirection="desc">Date
                      {/* <Tooltip enterDelay={300} title="Sort">
                        <TableSortLabel active direction="desc">
                          Date
                        </TableSortLabel>
                      </Tooltip> */}
                    </TableCell>
                  <TableCell>Supplier</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Units</TableCell>
                  <TableCell>Request Type</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map(request => (
                  <TableRow hover key={request.id}>
                    <TableCell>
                      {moment(request.createdAt).format('ll')}
                    </TableCell>
                    <TableCell>{request.supplier.name}</TableCell>
                    <TableCell>{request.type}</TableCell>
                    <TableCell>{request.units}</TableCell>
                    <TableCell>{request.requestType}</TableCell>
                    <TableCell>
                      <Chip color="primary" label={request.status} size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button
            color="primary"
            endIcon={<ArrowRightIcon />}
            size="small"
            variant="text"
            href="http://localhost:3000/app/manage_requests"
          >
            View all
          </Button>
        </Box>
      </Card>
    );
  }
};

RequestsSent.propTypes = {
  className: PropTypes.string
};

export default RequestsSent;
