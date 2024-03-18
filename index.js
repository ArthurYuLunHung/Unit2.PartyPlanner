const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401-FTB-ET-WEB-AM/events`;

const state = {
  parties: [],
};

const partyList = document.querySelector("#parties");

const addPartyForm = document.querySelector("#addParty");
addPartyForm.addEventListener("submit", addParty);

async function render() {
  await getParties();
  renderParties();
}
render();

async function getParties() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.parties = json.data;
  } catch (error) {
    console.error(error);
  }
}

async function addParty(event) {
  event.preventDefault();
  await createParty(
    addPartyForm.name.value,
    new Date(addPartyForm.date.value),
    // addPartyForm.time.value,
    addPartyForm.location.value,
    addPartyForm.description.value
  );
}

async function createParty(name, date, location, description) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, date, location, description }),
    });
    const json = await response.json();
    console.log(" new party", json);
    if (json.error) {
      throw new Error(json.message);
    }
    render();
  } catch (error) {
    console.error("Error creating party:", error);
  }
}

async function updateParty(name, date, location, description) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, date, location, description }),
    });
    const json = await response.json();

    if (json.error) {
      throw new Error(json.message);
    }

    render();
  } catch (error) {
    console.error(error);
  }
}

async function deleteParty(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Party could not be deleted");
    }
  } catch (error) {
    console.error(error);
  }
}

function renderParties() {
  if (!state.parties.length) {
    partyList.innerHTML = `<li>No Party Found.</li>`;
    return;
  }

  const partyCards = state.parties.map((party) => {
    const partyCard = document.createElement("li");
    partyCard.classList.add("party");
    partyCard.innerHTML = `
        <h2>${party.name}</h2>
        <h3>${party.date}</h3>
        <h3>${party.location}</h3>
        <h3>${party.description}</h3>
        `;
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Party";

    partyCard.append(deleteButton);

    deleteButton.addEventListener("click", () => deleteParty(party.id));
    return partyCard;
  });
  partyList.replaceChildren(...partyCards);
}
