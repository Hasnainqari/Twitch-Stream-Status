document.addEventListener("DOMContentLoaded", () => {
  const proxyUrl = "https://twitch-proxy.freecodecamp.rocks/";
  const users = [
    "ESL_SC2",
    "OgamingSC2",
    "cretetion",
    "freecodecamp",
    "storbeck",
    "habathcx",
    "RobotCaleb",
    "noobs2ninjas",
  ];
  const statusDiv = document.getElementById("stream-status");

  function fetchStreamData() {
    users.forEach((user) => {
      fetch(`${proxyUrl}users?login=${user}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.data.length === 0) {
            throw new Error("User not found");
          }
          const userId = data.data[0].id;
          return fetch(`${proxyUrl}streams/${userId}`);
        })
        .then((response) => response.json())
        .then((data) => {
          const user = users.find((user) =>
            data.data.some((stream) => stream.user_id === userId)
          );
          const userData = data.data[0];
          const isStreaming = userData ? true : false;

          const userDiv = document.createElement("div");
          userDiv.className = "stream-item";
          const userLink = document.createElement("a");
          userLink.href = `https://www.twitch.tv/${user}`;
          userLink.target = "_blank";
          userLink.textContent = user;
          userDiv.appendChild(userLink);

          if (isStreaming) {
            userDiv.innerHTML += `
                <p>Stream Title: ${userData.title}</p>
                <p>Game: ${userData.game_name}</p>
              `;
          } else {
            userDiv.innerHTML += `<p>Status: Offline</p>`;
          }

          statusDiv.appendChild(userDiv);
        })
        .catch((error) => {
          console.error("Error:", error);
          const userDiv = document.createElement("div");
          userDiv.className = "stream-item";
          userDiv.innerHTML = `<p>${user} - User data not available</p>`;
          statusDiv.appendChild(userDiv);
        });
    });
  }

  fetchStreamData();
});
