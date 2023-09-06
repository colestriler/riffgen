import type {NextApiRequest, NextApiResponse} from "next";
import {createRouteHandlerClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
import {NextRequest, NextResponse} from "next/server";


type Data = {
  status: string;
  generatedAudio: string | null;
};

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    endpointUrl: string;
  };
}

export async function POST(request: NextRequest, response: NextApiResponse) {

  const supabase = createRouteHandlerClient({cookies});
  const session = await supabase.auth.getSession();
  const {data: {user}} = await supabase.auth.getUser()

  // Check if user is logged in
  if (!session || !user) {
    return NextResponse.json({generatedAudio: null, status: "Login to upload."}, {status: 500});
  }

  const data = await request.json();
  const endpointUrl = data.endpointUrl;

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

  return NextResponse.json({status: status, generatedAudio: generatedAudio}, {status: 200});

}
