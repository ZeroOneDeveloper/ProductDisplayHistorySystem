"use client";

import React from "react";

const TransactionCard: React.FC<{
  index: number;
  productName: string;
  count: number;
  previousHash: string;
}> = ({ index, productName, count, previousHash }) => {
  return (
    <div className="bg-gray-300 rounded-xl px-6 py-8 whitespace-nowrap max-w-md w-full">
      <div>
        <h1 className="font-light">Index</h1>
        <h2 className="font-bold text-xl">{index}</h2>
      </div>
      <div className="my-1">
        <div className="flex items-center gap-1.5">
          <h1 className="font-light">상품명 : </h1>
          <h2 className="font-bold text-xl">{productName}</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <h1 className="font-light">수량 : </h1>
          <h2 className="font-bold text-xl">{count}</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <h1 className="font-light">이전 거래 해시 : </h1>
          <h2 className="font-bold text-xl text-ellipsis overflow-hidden">
            {previousHash ? previousHash : "최초 거래"}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
