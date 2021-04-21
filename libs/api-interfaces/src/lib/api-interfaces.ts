import { IsEmail } from 'class-validator';

export interface IMessage {
    message: string;
}

export interface IUser {
    _id?: string;
    __v?: number;
    email: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export class CreateUserDto {
    @IsEmail()
    public email!: string;
}
