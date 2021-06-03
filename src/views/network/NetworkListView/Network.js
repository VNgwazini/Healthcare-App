import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Network = ({ className, banks, ...rest }) => {
  const classes = useStyles();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const displayTable = () => {
    return (
      <>
      <Table>
      <TableHead>
          <TableRow>
          <TableCell style={{width: "5%"}}>
            Bank Name
            </TableCell>
            <TableCell style={{width: "1%"}}>
            A+
            </TableCell>
            <TableCell style={{width: "1%"}}>
            A-
            </TableCell>
            <TableCell style={{width: "1%"}}>
            B+
            </TableCell>
            <TableCell style={{width: "1%"}}>
            B-
            </TableCell>
            <TableCell style={{width: "1%"}}>
            AB+
            </TableCell>
            <TableCell style={{width: "1%"}}>
            AB-
            </TableCell>
            <TableCell style={{width: "1%"}}>
            O+
            </TableCell>
            <TableCell style={{width: "1%"}}>
            O-
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {banks
        .slice(page * limit, page * limit + limit)
        .map((bank, index) => (
          <>
            <TableRow
              hover
              key={bank.id}
            >
              <TableCell>
                {bank[0].name}
              </TableCell>
              <TableCell>
                {bank[1].count}
              </TableCell>
              <TableCell>
                {bank[2].count}
              </TableCell>
              <TableCell>
                {bank[3].count}
              </TableCell>
              <TableCell>
                {bank[4].count}
              </TableCell>
              <TableCell>
                {bank[5].count}
              </TableCell>
              <TableCell>
                {bank[6].count}
              </TableCell>
              <TableCell>
                {bank[7].count}
              </TableCell>
              <TableCell>
                {bank[8].count}
              </TableCell>
            </TableRow>
            </>
          ))
        }
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
          {displayTable()}
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={banks.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
      />
    </Card>
  );
};

Network.propTypes = {
  className: PropTypes.string,
};

export default Network;
