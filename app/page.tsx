import React from "react";

import mongoose from "mongoose";


const Page: React.FC = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI!);
  }
  return (
    <div>
      <h1></h1>
    </div>
  );
};

export default Page;
