window.onload = () => {
  fetchHistory();
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

const getSize = (size) => {
  const mb = size / 1000 / 1000;
  return mb.toFixed(1);
};

const fetchHistory = async () => {
  const { data } = await axios(
    "http://localhost:8080/share?limit=5",
    getToken(),
  );
  console.log(data);
  const tableBody = document.getElementById("table-body");
  for (let item of data) {
    const ui = `
           <tr class="text-gray-500 border-b border-gray-200">
          <td class="pl-6 py-4 capitalize">${item.file.filename}</td>
          <td>${item.receiverEmail}</td>
          <td>${moment(item.createdAt).format("DD MMM YYYY hh:mm A")}</td>
        </tr>
    
    `;
    tableBody.innerHTML += ui;
  }
  try {
  } catch (err) {
    toast.error(err.response ? err.response.data.message : err.message);
  }
};
