import * as mongoose from "mongoose";

import User from "@database/models/User";
import IUser from "@database/models/types/IUser";

export async function GET(request: Request) {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI!);
  }

  const users: IUser[] = await User.find({});
  if (!users.length) {
    return Response.json(
      {
        index: 0,
      },
      {
        status: 200,
      },
    );
  }
  return Response.json(
    {
      index:
        users
          .map((user: IUser) => user._id)
          .sort()
          .reverse()[0] + 1,
    },
    {
      status: 200,
    },
  );
}
