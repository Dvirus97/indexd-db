import { buttons, inputs, preview } from "./build-dom.ts";
import { PERSON } from "./db.type.ts";
import { db } from "./init-db.ts";
import "./style.css";

(async () => {
db.dbChanged((x)=>{
  console.log("change", x)
})

    const { pre } = preview();
    async function renderAllPeople() {
        const people = await db.getAll(PERSON);
        let text = "";
        people.forEach((person) => {
            text += JSON.stringify(person, null, 2);
            text += `<button class="delete-person-button" personId="${person._id}"> delete ${person.name}</button>`;
            text += "<br>";
            text += "<br>";
        });
        pre.innerHtml(text);
    }

    await renderAllPeople();

    const { idInput, nameInput, ageInput, clearInputs } = inputs();
    const {createPerson,updatePerson} = buttons();

    const deletePersonButtons = document.querySelectorAll(".delete-person-button");

    createPerson.element.addEventListener("click", async () => {
        const name = nameInput.element.value;
        const age = Number(ageInput.element.value);
        clearInputs();
        const person = { name, age };
        db.addOne(PERSON, person).then(() => {
            renderAllPeople();
        });
    });

    updatePerson.element.addEventListener("click", () => {
        const name = nameInput.element.value;
        const age = Number(ageInput.element.value);
        const id = Number(idInput.element.value);
        clearInputs();

        const newPerson = { id, name, age };
        db.updateOne(PERSON, newPerson).then(() => {
            renderAllPeople();
        });
    });

    deletePersonButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const personId = Number((e.target as HTMLButtonElement).getAttribute("personId"));
            db.deleteOne(PERSON, personId).then(() => {
                renderAllPeople();
            });
        });
    });
})();
