import { Routes, RouterModule } from '@angular/router';

import { } from './app.index.components';

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
