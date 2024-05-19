import * as mongoose from "mongoose";

import User from "@database/models/User";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return Response.json(
      {},
      {
        status: 404,
      },
    );
  }
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI!);
  }

  if (!(await User.findOne({ _id: parseInt(id) }))) {
    return Response.json({
      status: 404,
    });
  }
  return Response.json({
    status: 200,
  });
}
