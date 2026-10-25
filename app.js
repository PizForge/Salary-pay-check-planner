const salaryInput = document.querySelector("#salary");
const lindungToggle = document.querySelector("#lindung-toggle");
const lindungRow = document.querySelector("#lindung-row");
const salaryError = document.querySelector("#salary-error");

const currency = new Intl.NumberFormat("en-MY", {
  style: "currency",
  currency: "MYR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const percentage = (rate) => `${new Intl.NumberFormat("en-MY", {
  style: "percent",
  maximumFractionDigits: 2
}).format(rate)}`;

const amount = (value) => currency.format(value);
const roundToSen = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

function setText(id, value) {
  document.querySelector(`#${id}`).textContent = value;
}

function calculate(rates) {
  const rawSalary = salaryInput.value.trim();
  const salary = rawSalary === "" ? 0 : Number(rawSalary);

  if (!Number.isFinite(salary) || salary < 0) {
    salaryError.textContent = "Enter a valid salary of RM 0 or more.";
    salaryError.hidden = false;
    salaryInput.setAttribute("aria-invalid", "true");
    return;
  }

  salaryError.hidden = true;
  salaryInput.removeAttribute("aria-invalid");

  const epf = roundToSen(salary * rates.epf.rate);
  const socso = roundToSen(Math.min(salary, rates.socso.wageCeiling) * rates.socso.rate);
  const eis = roundToSen(Math.min(salary, rates.eis.wageCeiling) * rates.eis.rate);
  const lindung = lindungToggle.checked
    ? roundToSen(salary * rates.lindung24Jam.rate)
    : 0;
  const total = roundToSen(epf + socso + eis + lindung);

  setText("net-salary", amount(roundToSen(salary - total)));
  setText("epf-amount", amount(epf));
  setText("socso-amount", amount(socso));
  setText("eis-amount", amount(eis));
  setText("lindung-amount", amount(lindung));
  setText("total-amount", amount(total));
  lindungRow.hidden = !lindungToggle.checked;
}

async function initialize() {
  try {
    const response = await fetch("./data.json");
    if (!response.ok) {
      throw new Error(`Unable to load contribution rates (HTTP ${response.status}).`);
    }

    const rates = await response.json();
    for (const [id, value] of [
      ["epf-rate", rates.epf.rate],
      ["socso-rate", rates.socso.rate],
      ["eis-rate", rates.eis.rate],
      ["lindung-rate", rates.lindung24Jam.rate]
    ]) {
      setText(id, percentage(value));
    }

    const update = () => calculate(rates);
    salaryInput.addEventListener("input", update);
    lindungToggle.addEventListener("change", update);
    update();
  } catch (error) {
    console.error("Salary calculator setup failed:", error);
    salaryError.textContent = "Could not load contribution rates. Please serve this page over HTTP and try again.";
    salaryError.hidden = false;
    salaryInput.setAttribute("aria-invalid", "true");
  }
}

initialize();
