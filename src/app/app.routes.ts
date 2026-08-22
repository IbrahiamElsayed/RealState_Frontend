import { Routes } from '@angular/router';

import { Home } from './Pages/home/home';
import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';
import { Logout } from './features/auth/pages/logout/logout';

import { BrowseProperties } from './Pages/browse-properties/browse-properties';
import { Message } from './Pages/message/message';
import { Contact } from './Pages/contact/contact';
import { Favorite } from './Pages/favorite/favorite';
import { PropertyDetails } from './Pages/property-details/property-details';

import { AddProperty } from './Pages/add-property/add-property';

import { BuyerGuard } from './core/guards/buyer-guard';
import { SellerGuard } from './core/guards/seller-guard';

import { SellerLayout } from './layouts/seller-layout/seller-layout';
import { SellerDashboard } from './Pages/seller-dashboard/seller-dashboard';
import { SellerProperties } from './Pages/seller-properties/seller-properties';
import { SellerMessages } from './Pages/seller-messages/seller-messages';
import { SellerNotifications } from './Pages/seller-notifications/seller-notifications';
import { SellerProfile } from './Pages/seller-profile/seller-profile';
import { PaymentSuccess } from './Pages/payment-success/payment-success';
import { PaymentCancel } from './Pages/payment-cancel/payment-cancel';
import { Profile } from './Pages/profile/profile';
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
          import('./Pages/update-property/update-property').then((m) => m.UpdateProperty),
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

  { path: '**', redirectTo: 'home' },
];
