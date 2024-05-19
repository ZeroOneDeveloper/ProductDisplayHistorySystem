import * as mongoose from "mongoose";

import crypto from "crypto";

import User from "@database/models/User";

export async function POST(request: Request) {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI!);
  }

  const { id } = await request.json();

  let [publicKey, privateKey] = [
    crypto.randomBytes(64).toString("hex"),
    crypto.randomBytes(64).toString("hex"),
  ];

  while (true) {
    if (await User.findOne({ publicKey })) {
      publicKey = crypto.randomBytes(64).toString("hex");
    }
    if (await User.findOne({ privateKey })) {
      privateKey = crypto.randomBytes(64).toString("hex");
    } else {
      break;
    }
  }

  return await new User({
    _id: id,
    publicKey,
    privateKey,
  }).save();
}
