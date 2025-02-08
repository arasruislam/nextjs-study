// import packages
import bcrypt from "bcrypt";
import mongoose, { Schema, model } from "mongoose";

// create user interface data types
export interface IUser {
   email: string;
   password: string;
   _id?: mongoose.Types.ObjectId;
   createdAt: Date;
   updatedAt: Date;
}

// create user schema
const userSchema = new Schema<IUser>(
   {
      email: {
         type: String,
         required: true,
         unique: true,
      },
      password: {
         type: String,
         required: true,
      },
   },
   {
      timestamps: true,
   }
);

// create hooks for password hashing
userSchema.pre("save", async function (next) {
   if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
   }

   next();
});

export const User = model("User", userSchema);
