import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Typography,
} from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import { random } from 'lodash';

  // TODO: make cards clickable so they lead to the inventory page
  const BloodTypeCard = ({ className, bloodType, ...rest }) => {
    //to simulate units counts
    const randomCount = random(50);
    //to simulate expired units
    const randomBool = random(1) ? false:true;

    return (
      <Card
        variant="outlined"
        style={{position: 'relative', height: '100%'}}
        {...rest}
      >
        <div style={randomBool ? {display: 'inline', position: 'absolute', top: 0, right: 0} 
          : {display: 'none'}}>
          <Tooltip placement="top" title={randomBool ? "Some units will expire in 5 days or less" : ""}>
            <IconButton>
              <ErrorIcon color="error" fontSize="small"/>
            </IconButton>
          </Tooltip>
        </div>
        <CardContent>
          <Typography
            style={randomCount > 1 ? {color: '#3F51B5'} : {color: '#E53935'}}
            variant="h3"
            align="center"
          >
            {bloodType}
          </Typography>
          <Typography
            variant="body2"
            align="center"
          >
            {randomCount} UNITS
          </Typography>
        </CardContent>
      </Card>
    );
}

BloodTypeCard.propTypes = {
  bloodType: PropTypes.string,
  className: PropTypes.string
};

export default BloodTypeCard;
