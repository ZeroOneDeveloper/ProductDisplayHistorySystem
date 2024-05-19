import * as mongoose from "mongoose";

import crypto from "crypto";

import User from "@database/models/User";
import IUser from "@database/models/types/IUser";

function generateKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 1024, // 키 길이
    publicKeyEncoding: {
      type: "pkcs1", // PEM 형식
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1", // PEM 형식
      format: "pem",
    },
  });

  return { publicKey, privateKey };
}

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

  const foundUser: IUser | null = await User.findOne({ _id: parseInt(id) });

  if (!foundUser) {
    return Response.json(
      {},
      {
        status: 404,
      },
    );
  }
  return Response.json(foundUser);
}

export async function POST(request: Request) {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI!);
  }

  const { id } = await request.json();

  let { publicKey, privateKey } = generateKeyPair();

  while (true) {
    if (
      (await User.findOne({ publicKey })) &&
      (await User.findOne({ privateKey }))
    ) {
      const generateKeys = generateKeyPair();
      publicKey = generateKeys.publicKey;
      privateKey = generateKeys.privateKey;
    } else {
      break;
    }
  }

  return Response.json(
    await new User({
      _id: id,
      publicKey,
      privateKey,
    }).save(),
    {
      status: 201,
    },
  );
}
