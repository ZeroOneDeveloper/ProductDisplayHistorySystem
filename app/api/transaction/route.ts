import * as mongoose from "mongoose";

import User from "@database/models/User";
import Transaction from "@database/models/Transaction";
import IUser from "@database/models/types/IUser";

import { sign } from "@utilities/security";

export async function GET(request: Request) {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI!);
  }

  return Response.json(
    await Transaction.find({ processed: false }).sort({ index: 1 }),
  );
}

export async function POST(request: Request) {
  const {
    senderId,
    targetId,
    productName,
    count,
  }: {
    senderId: number;
    targetId: number;
    productName: string;
    count: number;
  } = await request.json();

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI!);
  }

  const sender: IUser | null = await User.findOne({ _id: senderId });
  const target: IUser | null = await User.findOne({ _id: targetId });

  if (!sender || !target) {
    return Response.json(
      {},
      {
        status: 400,
      },
    );
  }

  const lastTransaction = await Transaction.find({}).sort({ _id: -1 }).limit(1);

  return Response.json(
    await new Transaction({
      index: lastTransaction[0].index + 1,
      targetId: targetId,
      senderId: senderId,
      targetPublicKey: target.publicKey,
      productName: productName,
      count: count,
      previousHash: sign(JSON.stringify(lastTransaction[0]), sender.privateKey),
      processed: false,
    }).save(),
  );
}
