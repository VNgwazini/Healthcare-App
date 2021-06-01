import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  makeStyles
} from '@material-ui/core';

var userInfo = JSON.parse(localStorage.getItem("user"));
var user;
if (userInfo) {
  user = {
    avatar: '/static/images/avatars/avatar_10.png', // TODO: get relevant user icon
    city: userInfo.bloodBank.city,
    country: 'Ghana', // currently assuming every bank is in Ghana
    jobTitle: 'Manager', // TODO: save job title in user info
    name: userInfo.username,
    timezone: 'GTM-7' // TODO: get time zone from location (if this is even necessary)
  };
}
else {
  user = {
    avatar: '/static/images/avatars/avatar_10.png', // TODO: get relevant user icon
    city: 'city',
    country: 'country', // currently assuming every bank is in Ghana
    jobTitle: 'Guest', // TODO: save job title in user info
    name: 'Not Logged In',
    timezone: 'GTM-7' // TODO: get time zone from location (if this is even necessary)
  }
}

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    height: 100,
    width: 100
  }
}));

const Profile = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
        >
          <Avatar
            className={classes.avatar}
            src={user.avatar}
          />
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h3"
          >
            {user.name}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body1"
          >
            {`${user.city}, ${user.country}`}
          </Typography>
          <Typography
            className={classes.dateText}
            color="textSecondary"
            variant="body1"
          >
            {`${moment().format('hh:mm A')} ${user.timezone}`}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          color="primary"
          fullWidth
          variant="text"
        >
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
