import { HandlerContext } from "$fresh/server.ts";
import { Entity, EntityBase, Fields, InMemoryDataProvider, JsonDataProvider, JsonEntityStorage, Remult } from "remult";
import * as path from "https://deno.land/std/path/mod.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";



// Jokes courtesy of https://punsandoneliners.com/randomness/programmer-jokes/
const JOKES = [
  "Why do Java developers often wear glasses? They can't C#.",
  "A SQL query walks into a bar, goes up to two tables and says “can I join you?”",
  "Wasn't hard to crack Forrest Gump's password. 1forrest1.",
  "I love pressing the F5 key. It's refreshing.",
  "Called IT support and a chap from Australia came to fix my network connection.  I asked “Do you come from a LAN down under?”",
  "There are 10 types of people in the world. Those who understand binary and those who don't.",
  "Why are assembly programmers often wet? They work below C level.",
  "My favourite computer based band is the Black IPs.",
  "What programme do you use to predict the music tastes of former US presidential candidates? An Al Gore Rhythm.",
  "An SEO expert walked into a bar, pub, inn, tavern, hostelry, public house.",
];


@Entity("tasks", { allowApiCrud: true })
class Task extends EntityBase {
  @Fields.autoIncrement()
  id = 0;
  @Fields.string()
  title = '';
}


export class JsonEntityFileStorage implements JsonEntityStorage {
  getItem(entityDbName: string): string {
    let fn = path.join(this.folderPath, entityDbName) + '.json';
    if (existsSync(fn)) {
      return new TextDecoder().decode( Deno.readFileSync(fn))
    }
    return undefined!;
  }
  setItem(entityDbName: string, json: string) {
    if (!existsSync(this.folderPath)) {
      Deno.mkdirSync(this.folderPath);
    }
    return Deno.writeFileSync(path.join(this.folderPath, entityDbName) + '.json', new TextEncoder().encode(json));
  }
  constructor(private folderPath: string) { }
}



const remult =// new Remult(new InMemoryDataProvider());
  new Remult(new JsonDataProvider(new JsonEntityFileStorage('./db')));


export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {
  //await util.promisify((api as any))(_req, res);
  const randomIndex = Math.floor(Math.random() * JOKES.length);
  const body = JOKES[randomIndex];
  const repo = remult.repo(Task);
  await repo.insert([{ title: "abc" }])

  return new Response(JSON.stringify({ "name:": "noam", "count": await repo.count() }));
  return new Response(body);
};


