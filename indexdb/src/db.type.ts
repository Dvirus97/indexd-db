// export type AppDb = {
//     person: {
//         _id?: number;
//         name: string;
//         age: number;
//     };
//     car: {
//         _id?: number;
//         make: string;
//         model: string;
//     };
// };
// export const PERSON = "person";
// export const CAR = "car";
export type TodoDb = {
  todo: {
    _id?: number;
    text: string;
    complete: boolean;
  };
};
export const TODO = "todo";
