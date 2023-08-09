// Initialize an array to store lead URLs.
let myLeads = [];
// Get DOM elements.
const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));
const tabBtn = document.getElementById("tab-btn");
const exportBtn = document.getElementById("export-btn");

// Load leads from local storage.
if (leadsFromLocalStorage) {
  myLeads = leadsFromLocalStorage;
  //Display leads on UI
  render(myLeads);
}

tabBtn.addEventListener("click", function () {
  // Get the URL of the active tab in the current window.
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tabUrl = tabs[0].url;
    if (!myLeads.includes(tabUrl)) {
      // Add the tab URL to myLeads and update local storage.

      myLeads.push(tabUrl);
      localStorage.setItem("myLeads", JSON.stringify(myLeads));
      // Update the user interface with the new leads.

      render(myLeads);
    }
  });
});

exportBtn.addEventListener("click", function () {
  // Call the exportLeads function to create and download a CSV file.

  exportLeadsAsCSV();
});

// function exportLeads() {
//   const exportData = JSON.stringify(myLeads, null, 2);

//   const blob = new Blob([exportData], { type: "text/plain" });
//   const url = URL.createObjectURL(blob);

//   const link = document.createElement("a");
//   link.href = url;
//   link.download = "my_Leads.json";
//   document.body.appendChild(link);
//   link.click();

//   URL.revokeObjectURL(url);
// }
function exportLeadsAsCSV() {
  const csvContent = "data:text/csv;charset=utf-8," + 
    myLeads.map(entry => Object.values(entry).join("")).join("\n");

  const encodedUri = encodeURI(csvContent);

  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "my_Leads.csv");
  document.body.appendChild(link);

  link.click();
}
// Function to render leads in the user interface.

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
// Function to check if a string is a valid URL.

function isValidURL(str) {
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
}

deleteBtn.addEventListener("dblclick", function () {
    // Clear local storage and reset myLeads, then update the user interface.

  localStorage.clear();
  myLeads = [];
  render(myLeads);
});

inputBtn.addEventListener("click", function () {
  const inputValue = inputEl.value.trim();
  if (inputValue !== "") {
        // Add the input value to myLeads and update local storage.

    myLeads.push(inputEl.value);
    inputEl.value = "";
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
        // Update the user interface with the new leads.

    render(myLeads);
  }
});
