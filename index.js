let myLeads = [];
const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));
const tabBtn = document.getElementById("tab-btn");
const exportBtn = document.getElementById("export-btn");

if (leadsFromLocalStorage) {
  myLeads = leadsFromLocalStorage;
  render(myLeads);
}

tabBtn.addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tabUrl = tabs[0].url;
    if (!myLeads.includes(tabUrl)) {
      myLeads.push(tabUrl);
      localStorage.setItem("myLeads", JSON.stringify(myLeads));
      render(myLeads);
    }
  });
});

exportBtn.addEventListener("click", function () {
  exportLeads();
});

function exportLeads() {
  const exportData = JSON.stringify(myLeads, null, 2);

  const blob = new Blob([exportData], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "my_Leads.json";
  document.body.appendChild(link);
  link.click();

  URL.revokeObjectURL(url);
}

function render(leads) {
  let listItems = "";
  for (let i = 0; i < leads.length; i++) {
    listItems += `
      <li>
        <span>${i + 1}. </span>
        ${
          isValidURL(leads[i])
            ? `  <a target='_blank' href='${leads[i]}'>
            ${leads[i]}
          </a>`
            : leads[i]
        }
      </li>
    `;
  }
  ulEl.innerHTML = listItems;
}

function isValidURL(str) {
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
}

deleteBtn.addEventListener("dblclick", function () {
  localStorage.clear();
  myLeads = [];
  render(myLeads);
});

inputBtn.addEventListener("click", function () {
  const inputValue = inputEl.value.trim();
  if (inputValue !== "") {
    myLeads.push(inputEl.value);
    inputEl.value = "";
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    render(myLeads);
  }
});
