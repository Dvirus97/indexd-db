import { APP, ec } from "../packages/utils/helper.ts";
import { db } from "./init-db.ts";
import "./style.css";

async function renderTodo(element: HTMLElement) {
  const todos = await db.getAll("todo");
  element.innerHTML = "";
  todos.forEach((todo) => {
    const li = ec("li").class("todo-item").appendTo(element);
    const label = ec("label").class("todo-label").appendTo(li.element);
    const complete = ec("input")
      .attr({ type: "checkbox", ...(todo.complete ? { checked: true } : {}) })
      .appendTo(label.element);
    const textSpan = ec("span")
      .class("todo-text")
      .text(todo.text)
      .appendTo(label.element);
    const deleteButton = ec("button")
      .class("delete-todo-btn")
      .text("X")
      .appendTo(li.element);

    complete.element.onchange = async () => {
      await db.updateOne("todo", {
        ...todo,
        complete: complete.element.checked,
      });
      renderTodo(element);
    };

    deleteButton.element.onclick = async () => {
      await db.deleteOne("todo", todo._id!);
      renderTodo(element);
    };
  });
}

(async () => {
  db.dbChanged((x) => {
    console.log("change", x);
  });

  const todoTitle = ec("h2").class("app-title").text("Todo app").appendTo(APP);

  const addTodoSection = ec("section").class("add-todo-section").appendTo(APP);
  const addTodoInput = ec("input")
    .attr({ placeholder: "add todo..." })
    .appendTo(addTodoSection.element);
  const addTodoButton = ec("button")
    .text("Add")
    .appendTo(addTodoSection.element);

  const todoListSection = ec("section")
    .class("todos-list-section")
    .appendTo(APP);
  const todoList = ec("ul")
    .class("todos-list")
    .appendTo(todoListSection.element);

  addTodoButton.element.onclick = async () => {
    const text = addTodoInput.element.value;
    addTodoInput.element.value = "";
    await db.addOne("todo", { text, complete: false });
    renderTodo(todoList.element);
  };

  renderTodo(todoList.element);
})();

// (async () => {
//   db.dbChanged((x) => {
//     console.log("change", x);
//   });

//   listener.on("event", (x) => {
//     console.log("event", x);
//   });

//   const { pre } = preview();
//   async function renderAllPeople() {
//     const people = await db.getAll(PERSON);
//     let text = "";
//     people.forEach((person) => {
//       text += JSON.stringify(person, null, 2);
//       text += `<button class="delete-person-button" personId="${person._id}"> delete ${person.name}</button>`;
//       text += "<br>";
//       text += "<br>";
//     });
//     pre.innerHtml(text);
//   }

//   await renderAllPeople();

//   const { idInput, nameInput, ageInput, clearInputs } = inputs();
//   const { createPerson, updatePerson, log } = buttons();

//   log.element.addEventListener("click", () => {
//     listener.emit("event", { name: "event" });
//   });

//   const deletePersonButtons = document.querySelectorAll(
//     ".delete-person-button"
//   );

//   createPerson.element.addEventListener("click", async () => {
//     const name = nameInput.element.value;
//     const age = Number(ageInput.element.value);
//     clearInputs();
//     const person = { name, age };
//     db.addOne(PERSON, person).then(() => {
//       renderAllPeople();
//     });
//   });

//   updatePerson.element.addEventListener("click", () => {
//     const name = nameInput.element.value;
//     const age = Number(ageInput.element.value);
//     const id = Number(idInput.element.value);
//     clearInputs();

//     const newPerson = { id, name, age };
//     db.updateOne(PERSON, newPerson).then(() => {
//       renderAllPeople();
//     });
//   });

//   deletePersonButtons.forEach((button) => {
//     button.addEventListener("click", (e) => {
//       const personId = Number(
//         (e.target as HTMLButtonElement).getAttribute("personId")
//       );
//       db.deleteOne(PERSON, personId).then(() => {
//         renderAllPeople();
//       });
//     });
//   });
// })();
