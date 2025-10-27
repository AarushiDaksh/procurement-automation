import mongoose, { Schema, InferSchemaType } from "mongoose";

const UserSchema = new Schema(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, index: true },
    name: { type: String },
    role: {
      type: String,
      enum: ["ADMIN", "BUYER", "VENDOR"],
      default: "BUYER",
      index: true,
    },
    orgId: { type: Schema.Types.ObjectId, ref: "Organization" },
  },
  { timestamps: true }
);

export type UserDoc = InferSchemaType<typeof UserSchema>;
export default mongoose.models.User || mongoose.model("User", UserSchema);
