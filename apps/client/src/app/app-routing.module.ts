import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './auth/register/register.component';
import { AppReadyGuard } from './guards/app-ready.guard';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { InsideComponent } from './inside/inside.component';

const routes: Routes = [
    {path: '', component: HomeComponent, resolve: [AppReadyGuard]},
    {path: 'inside', component: InsideComponent, canActivate: [AuthGuard], resolve: [AppReadyGuard]},
    {path: 'register', component: RegisterComponent, resolve: [AppReadyGuard]},
    {path: '**', redirectTo: '/', pathMatch: 'full'},
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
