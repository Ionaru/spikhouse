// eslint-disable-next-line max-classes-per-file
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import * as mongoose from 'mongoose';

import { User } from './user.schema';

export interface IUser {
    _id?: string;
    __v?: number;
    email: string;
    displayName: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export class CreateUserDto {
    @IsString()
    @MinLength(3)
    public displayName!: string;

    @IsEmail()
    public email!: string;

    @IsString()
    @MinLength(8)
    public password!: string;
}

export class LoginDto {
    @IsEmail()
    public email!: string;

    @IsString()
    public password!: string;
}

export class RoomPasswordDto {
    @IsString()
    public password!: string;
}

export class CreateRoomDto {
    @IsString()
    @MinLength(3)
    public name!: string;

    @IsString()
    @MinLength(3)
    @IsOptional()
    public password?: string;
}

export interface IRoom {
    _id?: string;
    __v?: number;
    name: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    owner: User | mongoose.Schema.Types.ObjectId;
    hasPassword: boolean;
}

export interface IMessage {
    content: string;
    time: number;
    password?: string;
    sender: Partial<IUser>;
}

export interface IAPIEnvironment {
    dbHost: string;
    production: boolean;
    sessionName: string;
    sessionSecret: string;
}
