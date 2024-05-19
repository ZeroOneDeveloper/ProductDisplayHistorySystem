import React from "react";

import mongoose from "mongoose";

import TransactionCard from "@components/TransactionCard";
import Transaction from "@database/models/Transaction";
import ITransaction from "@database/models/types/ITransaction";

const Page: React.FC = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI!);
  }
  const transaction: ITransaction[] = await Transaction.find();
  return (
    <div className="min-h-screen">
      <div className="flex flex-wrap gap-4 py-8 w-[90%] mx-auto">
        {transaction.map((transaction: ITransaction, index) => (
          <TransactionCard
            key={index}
            index={transaction.index}
            productName={transaction.productName}
            count={transaction.count}
            previousHash={transaction.previousHash}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
