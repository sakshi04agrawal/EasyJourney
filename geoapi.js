
const apiKey = "5ae2e3f221c38a28845f05b60b236a13881f3bceab3e00c94a46749f";

function apiGet(method, query) {
  return new Promise(function(resolve, reject) {
    var otmAPI =
      "https://api.opentripmap.com/0.1/en/places/" +
      method +
      "?apikey=" +
      apiKey;
    if (query !== undefined) {
      otmAPI += "&" + query;
    }
    fetch(otmAPI)
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(function(err) {
        console.log("Fetch Error :-S", err);
      });
  });
}

const pageLength = 5; // number of objects per page

    let lon; // place longitude
    let lat; // place latitude

    let offset = 0; // offset from first object in the list
    let count; // total objects count

    const search_form=document.getElementById("search_form").addEventListener("click", getList); 
    
    function getList(){
        let name = document.getElementById("textbox").value;
        apiGet("geoname", "name=" + name).then(function(data) {
        let message = "Name not found";
        if (data.status == "OK") {
        message = data.name;
        lon = data.lon;
        lat = data.lat;
        firstLoad();
        }
        console.log(message)
        document.getElementById("info").insertAdjacentHTML("afterbegin", message);
        });
        // e.preventDefault();
    };


function firstLoad() {
    apiGet(
      "radius",
      `radius=1000&limit=${pageLength}&offset=${offset}&lon=${lon}&lat=${lat}&rate=2&format=count`
    ).then(function(data) {
      count = data.count;
      offset = 0;
      document.getElementById(
        "info"
      ).innerHTML += `<p>${count} objects with description in a 1km radius</p>`;
      loadList();
    });
  }

  function loadList() {
    apiGet(
      "radius",
      `radius=1000&limit=${pageLength}&offset=${offset}&lon=${lon}&lat=${lat}&rate=2&format=json`
    ).then(function(data) {
      let list = document.getElementById("list");
      console.log(list)
      list.insertAdjacentHTML("afterbegin", list);
      data.forEach(item => list.appendChild(createListItem(item)));
      let nextBtn = document.getElementById("next_button");
      if (count < offset + pageLength) {
        nextBtn.style.visibility = "hidden";
      } else {
        nextBtn.style.visibility = "visible";
        nextBtn.innerText = `Next (${offset + pageLength} of ${count})`;
      }
    });
  }

  function createListItem(item) {
    let a = document.createElement("a");
    a.className = "list-group-item list-group-item-action";
    a.setAttribute("data-id", item.xid);
    a.innerHTML = `<div class="bag">
                     <h5 class="list-group-item-heading">${item.name}</h5>
                     <p class="list-group-item-text">${item.kinds}</p>
                     </div>`;

    a.addEventListener("click", function() {
      document.querySelectorAll("#list a").forEach(function(item) {
        item.classList.remove("active");
      });
      this.classList.add("active");
      let xid = this.getAttribute("data-id");
      apiGet("xid/" + xid).then(data => onShowPOI(data));
    });
    return a;
  }  

  function onShowPOI(data) {
    let poi = document.getElementById("poi");
    poi.innerHTML = `<p id="poi"></p>`;
    if (data.preview) {
      poi.innerHTML += `<img src="${data.preview.source}">`;
    }
    poi.innerHTML += data.wikipedia_extracts
      ? data.wikipedia_extracts.html
      : data.info
      ? data.info.descr
      : "No description";

    poi.innerHTML += `<p><a target="_blank" href="${data.otm}">Show more at OpenTripMap</a></p>`;
  }

const next_button=document.getElementById("next_button").addEventListener("click", getNext); 

function getNext(){
    offset += pageLength;
    loadList();
    console.log(error)
  }
getNext;
  