let uniqueIdentifier = 1

function addDateSelector() {
  const dateSelectors = document.getElementById("dateTimeSelectors");

  const dateInputContainer = document.createElement("div");
  dateInputContainer.id = "dateTimeInputContainer-" + String(uniqueIdentifier);

  // Date Selector
  const newDateLabel = document.createElement("label");
  newDateLabel.for = "eventDate-" + String(uniqueIdentifier);
  newDateLabel.innerText = "Event Date: ";

  const newDateInput = document.createElement("input");
  newDateInput.type = "date";
  newDateInput.id = "eventDate-" + String(uniqueIdentifier);
  newDateInput.required = true;

  // Time Start
  const newEventTimeStartLabel = document.createElement("label");
  newEventTimeStartLabel.for = "eventTimeStart-" + String(uniqueIdentifier);
  newEventTimeStartLabel.innerText = "Event Time Start: ";

  const newEventTimeStartInput = document.createElement("input");
  newEventTimeStartInput.type = "time";
  newEventTimeStartInput.id = "eventTimeStart-" + String(uniqueIdentifier);
  newEventTimeStartInput.required = true;

  // Time End
  const newEventTimeEndLabel = document.createElement("label");
  newEventTimeEndLabel.for = "eventTimeEnd-" + String(uniqueIdentifier);
  newEventTimeEndLabel.innerText = "Event Time End: ";

  const newEventTimeEndInput = document.createElement("input");
  newEventTimeEndInput.type = "time";
  newEventTimeEndInput.id = "eventTimeEnd-" + String(uniqueIdentifier);
  newEventTimeEndInput.required = true;

  // Remove Button
  const removeButton = document.createElement("button");
  removeButton.className = "removeDate";
  removeButton.id = "removeDate-" + String(uniqueIdentifier);
  removeButton.innerText = "-";
  removeButton.onclick = function() {
    removeDateSelector(removeButton);
  }

  dateInputContainer.appendChild(newDateLabel);
  dateInputContainer.appendChild(newDateInput);

  dateInputContainer.appendChild(newEventTimeStartLabel);
  dateInputContainer.appendChild(newEventTimeStartInput);

  dateInputContainer.appendChild(newEventTimeEndLabel);
  dateInputContainer.appendChild(newEventTimeEndInput);

  dateInputContainer.appendChild(removeButton);

  dateSelectors.appendChild(dateInputContainer);

  uniqueIdentifier++;
}

function removeDateSelector(button) {
  const dateInputContainer = button.parentElement;
  dateInputContainer.remove();
}
