import { IDB } from "../packages/utils/indexdb";
import { TodoDb } from "./db.type";

export const db = new IDB<TodoDb>("todoDb", ["todo"], 1);
