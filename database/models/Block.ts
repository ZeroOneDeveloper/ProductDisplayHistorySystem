import { Schema, model, models } from "mongoose";

import ITransaction from "./types/ITransaction";

const BlockSchema = new Schema(
  {
    genesis: {
      type: Boolean,
      required: false,
    },
    index: {
      type: Number,
      required: true,
    },
    nonce: {
      type: Number,
      required: true,
    },
    difficulty: {
      type: Number,
      required: true,
    },
    transactions: {
      type: Array<ITransaction>,
      required: true,
      ref: "transactions",
    },
  },
  {
    versionKey: false,
  },
);

export default models.blocks || model("blocks", BlockSchema);
