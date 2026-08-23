import { Routes } from '@angular/router';

import { Home } from './features/home/pages/home/home';
import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';
import { Logout } from './features/auth/pages/logout/logout';

import { BrowseProperties } from './features/properties/pages/browse-properties/browse-properties';
import { Message } from './features/messages/pages/message/message';
import { Contact } from './features/contact/pages/contact/contact';
import { Favorite } from './features/favorites/pages/favorite/favorite';
import { PropertyDetails } from './features/properties/pages/property-details/property-details';

import { AddProperty } from './features/seller/pages/add-property/add-property';

import { BuyerGuard } from './core/guards/buyer-guard';
import { SellerGuard } from './core/guards/seller-guard';
import { AdminGuard } from './core/guards/admin-guard';

import { SellerLayout } from './layouts/seller-layout/seller-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { AdminDashboard } from './features/admin/pages/admin-dashboard/admin-dashboard';
import { AdminUsers } from './features/admin/pages/admin-users/admin-users';
import { AdminProperties } from './features/admin/pages/admin-properties/admin-properties';
import { SellerDashboard } from './features/seller/pages/seller-dashboard/seller-dashboard';
import { SellerProperties } from './features/seller/pages/seller-properties/seller-properties';
import { SellerMessages } from './features/messages/pages/seller-messages/seller-messages';
import { SellerNotifications } from './features/notifications/pages/seller-notifications/seller-notifications';
import { Profile } from './features/profile/pages/profile/profile';
import { SellerProfile } from './features/profile/pages/seller-profile/seller-profile';
import { PaymentSuccess } from './features/payments/pages/payment-success/payment-success';
import { PaymentCancel } from './features/payments/pages/payment-cancel/payment-cancel';
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'browse', component: BrowseProperties },
  { path: 'property/:id', component: PropertyDetails },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  {
    path: 'favorite',
    component: Favorite,
    canActivate: [BuyerGuard],
  },

  {
    path: 'message',
    component: Message,
    canActivate: [BuyerGuard],
  },
  {
    path: 'message/:id',
    component: Message,
    canActivate: [BuyerGuard],
  },
  {
    path: 'contact',
    component: Contact,
    canActivate: [BuyerGuard],
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [BuyerGuard],
  },

  // Seller Routes
  {
    path: 'seller',
    component: SellerLayout,
    canActivate: [SellerGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: SellerDashboard,
      },
      {
        path: 'properties',
        component: SellerProperties,
      },
      {
        path: 'add-property',
        component: AddProperty,
      },
      {
        path: 'messages',
        component: SellerMessages,
      },
      {
        path: 'messages/:id',
        component: SellerMessages,
      },
      {
        path: 'notifications',
        component: SellerNotifications,
      },
      {
        path: 'profile',
        component: SellerProfile,
      },
      {
        path: 'update-property/:id',
        loadComponent: () =>
          import('./features/seller/pages/update-property/update-property').then((m) => m.UpdateProperty),
      },
    ],
  },
  {
    path: 'payment-success',
    component: PaymentSuccess,
  },
  {
    path: 'payment-cancel',
    component: PaymentCancel,
  },

  // Admin Routes
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: AdminDashboard,
      },
      {
        path: 'users',
        component: AdminUsers,
      },
      {
        path: 'properties',
        component: AdminProperties,
      },
    ],
  },

  { path: '**', redirectTo: 'home' },
];
