/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { Task } from "../shared/task.ts";
import { Remult } from "remult";

const remult = new Remult();
const taskRepo = remult.repo(Task);
function fetchTasks() {
  return taskRepo.find();
}

export default function Todo() {

}
