import { APP, ec } from "../packages/utils/helper";

export function preview() {
    const preview = ec("div").appendTo(APP);
    const pre = ec("pre").appendTo(preview.element);
    return { preview, pre };
}

// INPUTS
export function inputs() {
    const inputDiv = ec("div").appendTo(APP).class("flex").style({ gap: "30px" });
    const idLabel = ec("label").appendTo(inputDiv.element).text("id:");
    const idInput = ec("input").appendTo(idLabel.element);

    const nameLabel = ec("label").appendTo(inputDiv.element).text("Name:");
    const nameInput = ec("input").appendTo(nameLabel.element);

    const ageLabel = ec("label").appendTo(inputDiv.element).text("Age:");
    const ageInput = ec("input").appendTo(ageLabel.element).attr({ type: "number" });

    function clearInputs() {
        idInput.element.value = "";
        nameInput.element.value = "";
        ageInput.element.value = "";
    }

    return { idInput, nameInput, ageInput, inputDiv, idLabel, nameLabel, ageLabel, clearInputs };
}

// BUTTONS
export function buttons() {
 const buttonDiv = ec("div").appendTo(APP).class("flex").style({ gap: "30px" });
 const createPerson = ec("button").appendTo(buttonDiv.element).text("Create Person");
 const updatePerson = ec("button").appendTo(buttonDiv.element).text("Update Person");
 const createCar = ec("button").appendTo(buttonDiv.element).text("Create Car");
 const updateCar = ec("button").appendTo(buttonDiv.element).text("Update Car");
 return { buttonDiv, createPerson, updatePerson, createCar, updateCar };
}
