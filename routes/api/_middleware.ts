// routes/_middleware.ts
import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { Remult } from "remult";
import { remultMiddleware } from "remult/remult-middleware";
import { Task } from "../../shared/task.ts";

const api = remultMiddleware({
    entities: [Task],
    initApi: async (remult: Remult) => {
        const taskRepo = remult.repo(Task);
        if (await taskRepo.count() === 0) {
            await taskRepo.insert([
                { title: "Task a" },
                { title: "Task b", completed: true },
                { title: "Task c" },
                { title: "Task d" },
                { title: "Task e", completed: true }
            ]);
        }
    }
});


export async function handler(
    req: Request
) {


    const url = new URL(req.url);

    let query: any = {};
    url.searchParams.forEach((val, key) => {

        let current = query[key];
        if (!current) {
            query[key] = val;
            return;
        }
        if (Array.isArray(current)) {
            current.push(val);
            return;
        }
        query[key] = [current, val]
    });

    const theReq = {
        method: req.method,
        originalUrl: req.url,
        path: url.pathname,
        body: req.bodyUsed ? await req.json() : undefined,
        params: {},
        query
    };

    return new Promise<Response>((res) => {
        api(theReq, {
            json: (data: any) => {
                res(new Response(JSON.stringify(data)))
            }
        })
    });

}
