import React from "react";

import mongoose from "mongoose";

import User from "@database/models/User";
import IUser from "@database/models/types/IUser";
import UserCard from "@/components/UserCard";

const Page: React.FC = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI!);
  }
  const users: IUser[] = await User.find();
  return (
    <div className="min-h-screen">
      <div className="flex flex-wrap gap-4 p-8">
        {users.map((user: IUser, index) => (
          <UserCard
            key={index}
            name={user._id.toString()}
            publicKey={user.publicKey}
          />
        ))}
        <UserCard created />
      </div>
    </div>
  );
};

export default Page;
