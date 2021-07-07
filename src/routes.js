import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import AccountView from 'src/views/account/AccountView';
import RequestsListView from 'src/views/request/RequestsListView';
import DashboardView from 'src/views/reports/DashboardView';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import ManageInventoryListView from 'src/views/product/ManageInventoryListView';
import ManageDonorListView from 'src/views/donors/ManageDonorListView';
import NetworkListView from 'src/views/network/NetworkListView';
import RegisterView from 'src/views/auth/RegisterView';
import SettingsView from 'src/views/settings/SettingsView';

let isLoggedIn = localStorage.getItem("jwt");

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'account', element: <AccountView /> },
      { path: 'manage_requests', element: <RequestsListView /> },
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'manage_inventory', element: <ManageInventoryListView /> },
      { path: 'manage_donors', element: <ManageDonorListView /> },
      { path: 'network', element: <NetworkListView /> },
      { path: 'settings', element: <SettingsView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginView /> },
      { path: 'register', element: <RegisterView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: <Navigate to="/app/dashboard"/> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
