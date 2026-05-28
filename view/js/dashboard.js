window.onload = () => {
  showUserDetails();
  fetchRecentFiles();
};

const logout = () => {
  localStorage.clear();
  location.href = "../index.html";
};

const toast = new Notyf({
  position: {
    x: "center",
    y: "top",
  },
});

const getToken = () => {
  const options = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authKey")}`,
    },
  };
  return options;
};

const showUserDetails = async () => {
  const session = await getSession();
  let fullname1 = document.getElementById("fullname");
  let email = document.getElementById("email");
  
  // email.innerHTML = session.email;
};

const getSize = (size) => {
  const kb = size / 1000;
  const mb = kb / 1000;
  const gb = mb / 1000;

  if (gb >= 1) return gb.toFixed(2) + "Gb";
  if (mb >= 1) return mb.toFixed(2) + "Mb";
  if (kb >= 1) return kb.toFixed(2) + "Kb";
  return (size = "B");
};

const fetchRecentFiles = async () => {
  try {
    const { data } = await axios(
      "http://localhost:8080/files?limit=5",
      getToken(),
    );
    const recentFiles = document.getElementById("recent-files");
    for (let item of data) {
      const ui = `
               <div class="flex justify-between">
                  <div>
                    <h1 class="text-zinc-600 font-semibold capitalize">
                      ${item.filename}
                    </h1>
                    <small class="text-gray-600 text-sm">${getSize(item.size)}</small>
                  </div>
                  <p class="text-gray-600 text-sm">${moment().format("DD MMM YYYY")}</p>
                </div>
     `;
      recentFiles.innerHTML += ui;
    }
  } catch (err) {
    toast.error(err.response ? err.response.data.message : err.message);
  }
};
