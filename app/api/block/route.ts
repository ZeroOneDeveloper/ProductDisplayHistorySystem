import * as mongoose from "mongoose";

import Block from "@database/models/Block";

export async function GET(request: Request) {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI!);
  }

  const foundBlock = await Block.find({}).sort({ index: -1 }).limit(1);
  if (!foundBlock.length) {
    return Response.json({});
  } else return Response.json(foundBlock[0]);
}
