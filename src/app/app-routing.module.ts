import { AuthGuardService } from './shareds/services/auth-guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { AppService } from './shareds/services/app.service';
import { MainModule } from './main/main.module';

const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: '',
        component: LayoutComponent,
        resolve: {
            data: AppService
        },
        canActivate: [AuthGuardService],
        children: [
            {
                path: '',
                loadChildren: () => import ('./main/main.module').then(m => MainModule)
            }
        ]
    },
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}