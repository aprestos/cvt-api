// user.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuid } from 'uuid';


export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    type: String,
    unique: true,
    default: function genUUID() {
      return uuid();
    },
  })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
