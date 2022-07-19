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


export function handler(
    req: Request
) {
    console.log(req);

    const res = new Response();
    api(req, res)
    return res;

}
