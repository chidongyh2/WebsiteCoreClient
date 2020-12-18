import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
      path: '',
      children: [
        {
          path: 'login',
          loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
        },
        // {
        //     path: 'change-password',
        //     component: ResetPasswordComponent,
        //     canActivate: [AuthChangeService]
        // },
        // {
        //     path: 'reset-password-finish',
        //     component: ResetPasswordFinishComponent
        // },
        // {
        //   path: 'registration',
        //   loadChildren: './registration/registration.module#RegistrationModule'
        // },
        // {
        //   path: 'forgot',
        //   loadChildren: './forgot/forgot.module#ForgotModule'
        // },
        // {
        //   path: 'lock-screen',
        //   loadChildren: './lock-screen/lock-screen.module#LockScreenModule'
        // }
      ]
    }
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class AuthRoutingModule {
  }