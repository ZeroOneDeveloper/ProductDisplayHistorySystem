import * as mongoose from "mongoose";

import Block from "@database/models/Block";
import IBlock from "@database/models/types/IBlock";
import Transaction from "@database/models/Transaction";
import ITransaction from "@database/models/types/ITransaction";

export async function GET(request: Request) {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI!);
  }

  const foundBlock = await Block.find({}).sort({ index: -1 });
  return Response.json(foundBlock);
}

export async function POST(request: Request) {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI!);
  }

  const data: {
    previousHash: string;
    transactions: ITransaction[];
    nonce: number;
    difficulty: number;
  } = await request.json();

  const foundBlocks: IBlock[] = await Block.find({});

  const createdBlock = new Block({
    genesis: !foundBlocks.length,
    index: foundBlocks.length,
    nonce: data.nonce,
    difficulty: data.difficulty,
    transactions: data.transactions,
  });

  for (let i = 0; i < data.transactions.length; i++) {
    await Transaction.updateOne(data.transactions[i], {
      $set: {
        processed: true,
      },
    });
  }

  return Response.json(await createdBlock.save(), {
    status: 201,
  });
}
