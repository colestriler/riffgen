import type { NextApiResponse } from "next";
import redis from "../../../utils/redis";
import {createRouteHandlerClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest, response: NextApiResponse) {
  // Check if user is logged in
  const supabase = createRouteHandlerClient({cookies});
  const session = await supabase.auth.getSession();
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // const session = await getServerSession(req, res, authOptions);
  if (!session || !user) {
    return NextResponse.json("Login to upload.", {status: 500});
  }

  // Query the redis database by email to get the number of generations left
  const identifier = user.email;
  const windowDuration = 24 * 60 * 60 * 1000;
  const bucket = Math.floor(Date.now() / windowDuration);

  const usedGenerations =
    (await redis?.get(`@upstash/ratelimit:${identifier!}:${bucket}`)) || 0;

  // it can return null and it also returns the number of generations the user has done, not the number they have left

  // TODO: Move this using date-fns on the client-side
  const resetDate = new Date();
  resetDate.setHours(19, 0, 0, 0);
  const diff = Math.abs(resetDate.getTime() - new Date().getTime());
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor(diff / 1000 / 60) - hours * 60;

  const remainingGenerations = 5 - Number(usedGenerations);
  // const remainingGenerations = 100;

  return NextResponse.json({ remainingGenerations, hours, minutes })
}
