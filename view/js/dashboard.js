window.onload = () => {
  showUserDetails();
  fetchDashboard();
  fetchRecentFiles();
  fetchRecentSharedFiles();
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
  fullname1.innerHTML = session.fullname;
  email.innerHTML = session.email;
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
                  <p class="text-gray-600 text-sm">${moment(item.createdAt).format("DD MMM YYYY")}</p>
                </div>
     `;
      recentFiles.innerHTML += ui;
    }
  } catch (err) {
    toast.error(err.response ? err.response.data.message : err.message);
  }
};

const fetchRecentSharedFiles = async () => {
  try {
    const { data } = await axios(
      "http://localhost:8080/share?limit=5",
      getToken(),
    );
    const recentShared = document.getElementById("recent-shared");
    for (let item of data) {
      const ui = `
               <div class="flex justify-between">
                  <div>
                    <h1 class="text-zinc-600 font-semibold capitalize">
                      ${item.receiverEmail}
                    </h1>
                    <small class="text-gray-600 text-sm">${getSize(item.size)}</small>
                  </div>
                  <p class="text-gray-600 text-sm">${moment(item.createdAt).format("DD MMM YYYY")}</p>
                </div>
     `;
      recentShared.innerHTML += ui;
    }
  } catch (err) {
    toast.error(err.response ? err.response.data.message : err.message);
  }
};

const fetchDashboard = async () => {
  try {
    const { data } = await axios.get(
      "http://localhost:8080/dashboard-reports",
      getToken(),
    );

    const reports = document.getElementById("reports");
    for (let item of data) {
      const ui = `
            <div
                class="relative overflow-hidden bg-white rounded-lg shadow hover:shadow-lg h-40 flex flex-col justify-center items-center"
              >
                <h1 class="text-lg font-semibold text-gray-600">${item._id}</h1>
                <p class="text-4xl font-bold">${item.total}</p>
                <div
                  style="
                    background-image: linear-gradient(
                      to right,
                      #b8cbb8 0%,
                      #b8cbb8 0%,
                      #b465da 0%,
                      #cf6cc9 33%,
                      #ee609c 66%,
                      #ee609c 100%
                    );
                  "
                  class="flex justify-center items-center w-[100px] h-[100px] rounded-full absolute top-7.5 -left-4"
                >
                  <i class="ri-file-line text-4xl text-white"></i>
                </div>
              </div>
        `;
      reports.innerHTML += ui;
    }
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
};

const uploadImage = () => {
  const input = document.createElement("input");
  // const image = document.getElementById("image");
  input.type = "file";
  input.accept = "image/*";
  input.click();

  input.onchange = () => {
    const file = input.files[0];
    const pic = document.getElementById("pic");
    const formdata = new FormData();
    formdata.append("file", file);
    console.log(formdata);
    
  };
};
