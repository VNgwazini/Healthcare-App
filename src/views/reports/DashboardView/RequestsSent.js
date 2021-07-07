import React, { useState } from 'react';
import moment from 'moment';
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
import { 
  bloodRequests,
  bloodBanks
} from  "../../../data"
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

const RequestsSent = ({ className, requests, ...rest }) => {
// eslint-disable-next-line
  const [requestData, setrequestData] = useState(bloodRequests);
  // eslint-disable-next-line
  const [bankData, setbankData] = useState(bloodBanks);
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
                <TableCell>Requestor</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Units</TableCell>
                <TableCell>Request Type</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requestData
              .slice(0,5)
              .map((request, index) => (
                <TableRow hover key={request.id}>
                <TableCell>
                  {moment(request.createdAt).format('ll')}
                </TableCell>
                <TableCell>
                  {console.log('bankdata[', index, '] = ', bankData[index])}
                {bankData[index%bankData.length].name ? bankData[index%bankData.length].name + " County Hospital" : "Finding supplier..."}
                </TableCell>
                <TableCell>{request.requestType}</TableCell>
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
          href="/app/manage_requests"
        >
          View all
        </Button>
      </Box>
    </Card>
  );
}


RequestsSent.propTypes = {
  className: PropTypes.string
};

export default RequestsSent;
