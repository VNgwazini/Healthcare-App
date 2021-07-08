import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  BarChart as BarChartIcon,
  BarChart2 as BarChart2Icon,
  ShoppingBag as ShoppingBagIcon,
  Users as UsersIcon,
  Droplet as DropletIcon
} from 'react-feather';
import NavItem from './NavItem';

var user, items;

// the avatar pic is a placeholder for now
// src: https://toppng.com/photo/201156/clip-art-black-and-white-stock-donate-blood-clipart-blood-donation-icon
// if (localStorage.getItem("jwt")) {
  user = {
    avatar: '/static/images/avatars/usericon.png',
    jobTitle: "Local Blood Bank",
    name: "Demo User"
  };

  items = [
    {
      href: '/app/dashboard',
      icon: BarChartIcon,
      title: 'Dashboard'
    },
    {
      href: '/app/manage_requests',
      icon: ShoppingBagIcon,
      title: 'Manage Requests'
    },
    {
      href: '/app/manage_inventory',
      icon: DropletIcon,
      title: 'Manage Inventory'
    },
    {
      href: '/app/manage_donors',
      icon: UsersIcon,
      title: 'Manage Donors'
    },
    {
      href: '/app/network',
      icon: BarChart2Icon,
      title: 'View Network'
    },
    // NOT IMPLEMENTED FOR NOW
    // {
    //   href: '/app/account',
    //   icon: UserIcon,
    //   title: 'Account'
    // },
    // {
    //   href: '/app/settings',
    //   icon: SettingsIcon,
    //   title: 'Settings'
    // }
  ];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Box alignItems="center" display="flex" flexDirection="column" p={2}>
        <Avatar
          className={classes.avatar}
          src={user.avatar}
        />
        <Typography className={classes.name} color="textPrimary" variant="h5">
          {user.name}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {user.jobTitle}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map(item => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
      <Box flexGrow={1} />
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default NavBar;
