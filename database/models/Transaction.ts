import { Schema, model, models } from "mongoose";

import ITransaction from "./types/ITransaction";

const TransactionSchema = new Schema<ITransaction>(
  {
    index: {
      type: Number,
      required: true,
    },
    senderId: {
      type: Number,
      required: false,
    },
    targetId: {
      type: Number,
      required: true,
    },
    targetPublicKey: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    previousHash: {
      type: String,
      required: true,
    },
    processed: {
      type: Boolean,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

export default models.transactions || model("transactions", TransactionSchema);
