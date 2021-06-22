import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './auth/register/register.component';
import { AppReadyGuard } from './guards/app-ready.guard';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { CreateRoomComponent } from './rooms/create-room/create-room.component';
import { RoomComponent } from './rooms/room/room.component';
import { RoomsComponent } from './rooms/rooms.component';

const routes: Routes = [
    {path: '', component: HomeComponent, resolve: [AppReadyGuard]},
    {path: 'rooms', component: RoomsComponent, canActivate: [AuthGuard], resolve: [AppReadyGuard]},
    {path: 'rooms/create', component: CreateRoomComponent, canActivate: [AuthGuard], resolve: [AppReadyGuard]},
    {path: 'room/:roomId', component: RoomComponent, canActivate: [AuthGuard], resolve: [AppReadyGuard]},
    {path: 'register', component: RegisterComponent, resolve: [AppReadyGuard]},
    {path: '**', redirectTo: '/', pathMatch: 'full'},
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
