import { AuthGuard } from './guards/auth.guard';
import { AuthLayoutComponent } from './shared/layout/auth-layout/auth-layout.component';
import { UserLayoutComponent } from './shared/layout/user-layout/user-layout.component';
import { BlankLayoutComponent } from './shared/layout/blank-layout/blank-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: '',
        component: BlankLayoutComponent,
        children: [ { path: '', loadChildren: () => import('./views/pages/pages.module').then((m) => m.PagesModule) } ],
    },
    {
        path: 'user',
        component: UserLayoutComponent,
        // canActivate: [ AuthGuard ],
        children: [
            { path: '', loadChildren: () => import('./views/reports/reports.module').then((m) => m.ReportsModule) },
            { path: '', loadChildren: () => import('./views/profile/profile.module').then((m) => m.ProfileModule) },
        ],
    },
    {
        path: 'auth',
        component: AuthLayoutComponent,
        children: [ { path: '', loadChildren: () => import('./views/auth/auth.module').then((m) => m.AuthModule) } ],
    },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes, { anchorScrolling: 'enabled' }) ],
    exports: [ RouterModule ],
})
export class AppRoutingModule {}
