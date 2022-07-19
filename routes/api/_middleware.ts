// routes/_middleware.ts
import { MiddlewareHandlerContext } from "$fresh/server.ts";

interface State {
    data: string;
}

export async function handler(
    req: Request,
    ctx: MiddlewareHandlerContext<State>,
) {

    console.log("I;m here");
    ctx.state.data = "myData";
    const res = new Response("hahaha");
    
    return res;
    
}