import {NextRequest, NextResponse} from "next/server";
import {NextApiResponse} from "next";
import {createRouteHandlerClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
import {Database} from "@/lib/types/supabase";

export async function POST(request: NextRequest, response: NextApiResponse) {

  // Check if user is logged in
  const supabase = await createRouteHandlerClient<Database>({cookies});
  const session = await supabase.auth.getSession();
  const {data: {user}} = await supabase.auth.getUser()

  if (!session || !user) {
    return NextResponse.json("Login to upload.", {status: 500});
  }

  const data = await request.json();

  // Rate Limiting by user email
  // if (ratelimit) {
  //   const identifier = session.user.email;
  //   const result = await ratelimit.limit(identifier!);
  //   res.setHeader("X-RateLimit-Limit", result.limit);
  //   res.setHeader("X-RateLimit-Remaining", result.remaining);

  //   // Calcualte the remaining time until generations are reset
  //   const diff = Math.abs(
  //     new Date(result.reset).getTime() - new Date().getTime()
  //   );
  //   const hours = Math.floor(diff / 1000 / 60 / 60);
  //   const minutes = Math.floor(diff / 1000 / 60) - hours * 60;

  //   if (!result.success) {
  //     return res
  //       .status(429)
  //       .json(
  //         `Your generations will renew in ${hours} hours and ${minutes} minutes. Email hassan@hey.com if you have any questions.`
  //       );
  //   }
  // }

  const audioUrl = data.audioUrl;
  const audioConfig = data.values;
  console.log('AUDIO URL', audioUrl);
  console.log('AUDIO CONFIG', audioConfig);

  const modelInput = audioUrl !== null ? {
    input_audio: audioUrl,
    ...audioConfig
  } : {
    ...audioConfig
  }

  // if (error) throw new Error(error.message);

  // POST request to Replicate to start the image restoration generation process
  let startResponse = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + process.env.REPLICATE_API_KEY,
    },
    body: JSON.stringify({
      version:
        "7a76a8258b23fae65c5a22debb8841d1d7e816b75c2f24218cd2bd8573787906",
      input: modelInput,
    }),
  });

  let jsonStartResponse = await startResponse.json();
  // FIXME: this may be null

  let endpointUrl;
  if (jsonStartResponse.urls.get) {
    endpointUrl = jsonStartResponse.urls.get;
  }

  // create a new query row in the database
  const {data: query, error} = await supabase
    .from('query')
    .insert(
      {
        user_id: user.id,
        model_name: 'fb_musicgen',
        model_config: modelInput,
        output_url: endpointUrl
      },
    )
    .select();

  if (!query || error) {
    console.log(error)
    return NextResponse.json("Error creating query", {status: 500});
  }

  console.log('JSON RESPONSE', jsonStartResponse);
  console.log('ENDPOINT URL', endpointUrl);
  //
  // // GET request to get the status of the image restoration process & return the result when it's ready
  // let restoredImage: string | null = null;
  // while (!restoredImage) {
  //   // Loop in 1s intervals until the alt text is ready
  //   console.log("polling for result...");
  //   let finalResponse = await fetch(endpointUrl, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Token " + process.env.REPLICATE_API_KEY,
  //     },
  //   });
  //   let jsonFinalResponse = await finalResponse.json();
  //   console.log('FINAL JSON RESPONSE', jsonFinalResponse);
  //
  //   if (jsonFinalResponse.status === "succeeded") {
  //     restoredImage = jsonFinalResponse.output;
  //   } else if (jsonFinalResponse.status === "failed") {
  //     break;
  //   } else {
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //   }
  // }

  return NextResponse.json(endpointUrl ? endpointUrl : "Failed to start generation.", {status: 200});
}