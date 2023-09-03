import {Ratelimit} from "@upstash/ratelimit";
import type {NextApiRequest, NextApiResponse} from "next";
import redis from "../../utils/redis";
import {getServerSession} from "next-auth/next";
import {authOptions} from "./auth/[...nextauth]";
import {json} from "stream/consumers";
import {AudioConfigValues} from "../restore";

type Data = {
  status: string;
  generatedAudio: string | null;
};

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    endpointUrl: string;
  };
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Data>
) {
  // Check if user is logged in
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(500).json({generatedAudio: null, status: "Login to upload."});
  }

  const endpointUrl = req.body.endpointUrl;

  let generatedAudio: string | null = null;

  let finalResponse = await fetch(endpointUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + process.env.REPLICATE_API_KEY,
    },
  });

  let status;
  let jsonFinalResponse = await finalResponse.json();

  if (jsonFinalResponse.status === "succeeded") {
    status = "succeeded";
    generatedAudio = jsonFinalResponse.output;
  } else if (jsonFinalResponse.status === "failed") {
    // return error
    status = "failed";
    generatedAudio = jsonFinalResponse.error;
  } else {
    status = "processing"
    generatedAudio = 'Processing...';
  }


  res
    .status(200)
    .json({status: status, generatedAudio: generatedAudio});
}
