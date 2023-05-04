const URL = "http://localhost:8080/api/sleeping-bags";
import { sanitizeStringWithTableRows } from "../../utils.js";

export function initSleepingBagResult() {
  document.getElementById("tbl-body").onclick = showUserDetails;
  getAllUsers();
}

export async function getAllUsers() {
  try {
    const usersFromServer = await fetch(URL).then((res) => res.json());
    showAllData(usersFromServer);
  } catch (err) {
    console.error("UPPPPPS: " + err); //This can be done better - do it
  }
}

function showAllData(data) {
  const tableRowsArray = data.map(
    (sleepingbag) => `
  <div class="card m-4 justify-content-center" style="width:300px">
  <img class="card-img-top" src="https://www.fotoagent.dk/single_picture/12535/138/large/389010021.jpg" alt="Image" style="width:250px">
  <div class="card-body">
    <h4 class="card-title">${sleepingbag.model}</h4>
    <p class="card-text">${sleepingbag.brand}</p>
    <p class="card-text">Pris:</p>

    <button id="row-btn_details_${sleepingbag.sku}" type="button" class="btn btn-sm btn-primary" 
    data-bs-toggle="modal"
    data-bs-target="#exampleModal">Details</button> 
    
  </div>
  </div>

  `
  );

  const tableRowsString = tableRowsArray.join("\n");
  document.getElementById("tbl-body").innerHTML =
    sanitizeStringWithTableRows(tableRowsString);
}

async function showUserDetails(evt) {
  const target = evt.target;
  if (!target.id.startsWith("row-btn_")) {
    return;
  }
  const parts = target.id.split("_"); // laver et array og splitter ved _
  // row-btn = 0, details/delete = 1 og id = 2
  const id = parts[2];
  const btnAction = parts[1];
  if (btnAction === "details") {
    // bootstrap 5 modal
    document.querySelector("#exampleModalLabel").innerText =
      "Information om sovepose " + id;

    // Hente 1 sovepose @GetMapping("/{sku}
    const sleepingbag = await fetch(URL + "/" + id)
      .then((res) => res.json())
      .then((sleepingbag) => {
        document.querySelector("#modal-body").innerText = `
        Mærke: ${sleepingbag.brand}
        Produktnavn: ${sleepingbag.model}
        Pris: 
        Længde:
        Komforttemp.(°C):
        Laveste temp. (°C):
        Fyld:
        Vægt (g):
        Farve: 
        Sæson:
        Sortiment:
        Varenr:

        `;
      });
  }
}

export function sendInfoBetweenSites(tripObj) {
  window.router.navigate("/users-modal");
  const testfield = document.querySelector("#test");
  testfield.innerHTML = "The trip will have a temp of: " + tripObj.tripTemp;
}