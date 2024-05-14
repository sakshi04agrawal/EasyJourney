function getData() {
  //   preventDefault();
  var from = document.getElementById("depart").value;
  var to = document.getElementById("arrival").value;
  var date = document.getElementById("day").value;

  fetch(
    "https://railway-w6eh.onrender.com/proxy?from=" +
      from +
      "&to=" +
      to +
      "&date=" +
      date,  {mode: 'no-cors'}
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data.data);
      const html = data.data
        .map((user) => {
          return `
                <div class="user">
                    <h1>From ${user.train_base.from_stn_name} to ${user.train_base.to_stn_name}</h1>
                    <p>Train number: ${user.train_base.train_no} => Train name: ${user.train_base.train_name}</p>
                    <p>Departure Time: ${user.train_base.from_time} => Arrival Time: ${user.train_base.to_time}</p>
                </div>
                `;
        })
        .join("");
      console.log(html);
      document.querySelector("#content").insertAdjacentHTML("afterbegin", html);
      // return false;
      // console.log(data);
    })
    .catch((err) => {
      console.log("Train not found", err);
    });

  // e.preventDefault();
}

