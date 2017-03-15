import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './app.index.components';

const ROUTES: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: '**',
        redirectTo: 'not-found'
    }
];
export const AppRoute = RouterModule.forRoot(ROUTES);
