import {
  handleHttpErrors,
  sanitizeStringWithTableRows,
  setStatusMsg,
  makeOptions,
} from "../../utils.js";

const URL = "http://localhost:8080/api/sleeping-bags";

let sleepingBags;

export function initSleepingBags() {
  document
    .getElementById("submit-info")
    ?.addEventListener("click", sleepingBagFormSend);

  document.getElementById("temp")?.addEventListener("input", adjustTempValue);

  document
    .getElementById("price-min")
    ?.addEventListener("input", adjustPriceValueMin);
  document
    .getElementById("price-max")
    ?.addEventListener("input", adjustPriceValueMax);

  document
    .getElementById("create-member")
    ?.addEventListener("click", saveResult);

  var popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="popover"]')
  );
  var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });
}

async function saveResult() {
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;
  let member = { password, email };

  try {
    const isFemale =
      document.querySelector('input[name="gender"]:checked').value === "female"
        ? "true"
        : "false";
    member.isFemale = isFemale;
  } catch (error) {}

  try {
    const personHeight = document.getElementById("height").value;

    if (personHeight?.length !== 0) {
      member.personHeight = personHeight;
    }
  } catch (error) {}

  try {
    const isColdSensitive =
      document.querySelector('input[name="cold"]:checked').value === "true"
        ? "true"
        : "false";
    member.isColdSensitive = isColdSensitive;
  } catch (error) {}

  const memberURL = "http://localhost:8080/api/member";

  // member = body
  const options = makeOptions("POST", member, false);

  try {
    await fetch(memberURL, options).then(handleHttpErrors);
    document.getElementById("status-create-member").innerText =
      "Bruger oprettet";
    document.getElementById("email").innerText = "";
    document.getElementById("password").innerText = "";
  } catch (error) {
    document.getElementById("status-create-member").innerText = error.message;
  }
}

function sleepingBagFormSend() {
  let trip = {};

  try {
    const environmentTemperatureMin =
      document.getElementById("temp-value")?.textContent;

    if (environmentTemperatureMin?.length !== 0) {
      trip.environmentTemperatureMin = environmentTemperatureMin;
    }
  } catch (error) {}

  try {
    const minCost = document.getElementById("price-value-min")?.textContent;

    if (minCost?.length !== 0) {
      trip.minCost = minCost;
    }
  } catch (error) {}

  try {
    const maxCost = document.getElementById("price-value-max")?.textContent;

    if (maxCost?.length !== 0) {
      trip.maxCost = maxCost;
    }
  } catch (error) {}

  try {
    const isFemale =
      document.querySelector('input[name="gender"]:checked').value === "female"
        ? "true"
        : "false";
    trip.isFemale = isFemale;
  } catch (error) {}

  try {
    const isColdSensitive =
      document.querySelector('input[name="cold"]:checked').value === "true"
        ? "true"
        : "false";
    trip.isColdSensitive = isColdSensitive;
  } catch (error) {}

  try {
    const innerMaterial =
      document.querySelector('input[name="fill"]:checked').value === "fiber"
        ? "Fiber"
        : "Dun";
    trip.innerMaterial = innerMaterial;
  } catch (error) {}

  try {
    const personHeight = document.getElementById("height").value;

    if (personHeight?.length !== 0) {
      trip.personHeight = personHeight;
    }
  } catch (error) {}

  try {
    const isInStore = document.getElementById("not-wider");

    if (isInStore.checked) {
      trip.isInStore = "true";
    }
  } catch (error) {}

  fetchFilteredSleepingBags(trip);
}

function adjustTempValue() {
  const temp = document.getElementById("temp-value");
  temp.textContent = this.value;
}

function adjustPriceValueMin() {
  const priceMin = document.getElementById("price-min");
  const priceMax = document.getElementById("price-max");

  // Ensure minimum value is not higher than maximum value
  if (
    parseInt(priceMin.value) > parseInt(priceMax.value) ||
    parseInt(priceMax.value) === parseInt(priceMin.value)
  ) {
    priceMax.value = priceMin.value + 500;
  }

  document.getElementById("price-value-min").textContent = priceMin.value;
  document.getElementById("price-value-max").textContent = priceMax.value;
}

function adjustPriceValueMax() {
  const priceMin = document.getElementById("price-min");
  const priceMax = document.getElementById("price-max");

  // Ensure maximum value is not lower than manimum value
  if (
    parseInt(priceMax.value) < parseInt(priceMin.value) ||
    parseInt(priceMax.value) === parseInt(priceMin.value)
  ) {
    priceMin.value = priceMax.value - 500;
  }

  document.getElementById("price-value-min").textContent = priceMin.value;
  document.getElementById("price-value-max").textContent = priceMax.value;
}

function showMultipleSleepingBags() {
  document.getElementById("sort-btn-row").innerHTML = `
  <div class="col-lg-4 ms-auto">
    <label for="sort">Sorter:</label>
    <select id="sort-select" name="sort" class="form-select">
        <option value="sortCostLowFirst" selected>Pris (laveste først)</option>
        <option value="sortCostHighFirst">Pris (højeste først)</option>
        <option value="sortWeightLowFirst">Vægt (laveste først)</option>
      </select>
  </div>
  `;

  document
    .getElementById("sort-select")
    ?.addEventListener("change", sortChangeEventListener);

  sleepingBags.sort(compareSleepingBagCostLowFirst);

  showMultipleSleepingBagsResult();
}

function showMultipleSleepingBagsResult() {
  const tableRowsArray = sleepingBags.map(
    (sleepingBag) => `
  <div class="col">
    <div class="card m-2"">
      <img class="card-img-top" src="${sleepingBag.imageURL}" alt="Image" style="display: grid; justify-items: center;">
      <div class="card-body">
        <h6 style="font-weight: bold;" class="card-title">${sleepingBag.brand}</h6>
        <h6 style="font-weight: bold;" class="card-text">${sleepingBag.model}</h6>
        <h6 class="card-text">Pris: ${sleepingBag.cost}</h6>
        <h6 class="card-text">Vægt: ${sleepingBag.productWeight}</h6>


        <button type="button" class="btn btn-sm btn-dark" style="background-color: #00461c;" 
        data-sku="${sleepingBag.sku}"
        data-action="details"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal">Mere info</button> 
        
      </div>
    </div>
  </div>
  `
  );

  document.getElementById("sleeping-bags-result").onclick =
    showSleepingBagDetails;

  const tableRowsString = tableRowsArray.join("\n");
  document.getElementById("sleeping-bags-result").innerHTML =
    sanitizeStringWithTableRows(tableRowsString);
}

function sortChangeEventListener(event) {
  if (event.target.value == "sortCostLowFirst") {
    sleepingBags.sort(compareSleepingBagCostLowFirst);
  } else if (event.target.value == "sortCostHighFirst") {
    sleepingBags.sort(compareSleepingBagCostHighFirst);
  } else if (event.target.value == "sortWeightLowFirst") {
    sleepingBags.sort(compareSleepingBagWeightLowFirst);
  }
  showMultipleSleepingBagsResult();
}

function compareSleepingBagCostLowFirst(sleepingBag1, sleepingBag2) {
  if (sleepingBag1.cost < sleepingBag2.cost) {
    return -1;
  } else if (sleepingBag1.cost > sleepingBag2.cost) {
    return 1;
  } else {
    return 0;
  }
}

function compareSleepingBagCostHighFirst(sleepingBag1, sleepingBag2) {
  if (sleepingBag1.cost > sleepingBag2.cost) {
    return -1;
  } else if (sleepingBag1.cost < sleepingBag2.cost) {
    return 1;
  } else {
    return 0;
  }
}

function compareSleepingBagWeightLowFirst(sleepingBag1, sleepingBag2) {
  if (sleepingBag1.productWeight < sleepingBag2.productWeight) {
    return -1;
  } else if (sleepingBag1.productWeight > sleepingBag2.productWeight) {
    return 1;
  } else {
    return 0;
  }
}

async function showSleepingBagDetails(event) {
  const target = event.target;
  if (target.dataset.action == "details") {
    const sku = target.dataset.sku;
    const sleepingBag = sleepingBags.find((element) => element.sku == sku);

    // bootstrap 5 modal
    document.querySelector("#exampleModalLabel").innerText =
      "Information om sovepose " + sleepingBag.sku;

    document.querySelector("#modal-body").innerText = `
      Mærke: ${sleepingBag.brand}
      Produktnavn: ${sleepingBag.model}
      Pris: ${sleepingBag.cost}
      Personlængde: ${sleepingBag.personHeight}
      Komforttemp.(°C): ${sleepingBag.comfortTemp}
      Lower limit. (°C): ${sleepingBag.lowerLimitTemp}
      Fyld: ${sleepingBag.innerMaterial}
      Vægt (g): ${sleepingBag.productWeight}
      Lagerstatus: ${sleepingBag.stockLocation}
      Varenr: ${sleepingBag.sku}
      `;

    if (sleepingBag.note !== null) {
      document.querySelector("#modal-note").innerText = `
      Note: ${sleepingBag.note}
      `;
    } else {
      document.querySelector("#modal-note").innerText = ``;
    }

    // Generate link to the sleepingbag at Friluftslands homepage
    const link = generateLink(sleepingBag.sku);
    document.querySelector("#modal-link").innerHTML = link;
  }
}

function generateLink(sku) {
  return `<a href="https://www.friluftsland.dk/msearch?q=${sku}" target="_blank">Link</a>`;
}

async function fetchFilteredSleepingBags(tripObj) {
  //TODO: change to true when security is added
  const options = makeOptions("POST", tripObj, false);

  try {
    const filteredResult = await fetch(URL, options).then(handleHttpErrors);
    sleepingBags = filteredResult;
    showMultipleSleepingBags();
  } catch (err) {
    // setStatusMsg("Error", true);
  }
}
