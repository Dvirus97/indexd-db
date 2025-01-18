import { IDB } from "../packages/utils/indexdb";
import { AppDb, CAR, PERSON } from "./db.type";

export const db = new IDB<AppDb>("appDb", [PERSON, CAR], 2);
