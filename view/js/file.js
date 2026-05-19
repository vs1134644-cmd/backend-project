const toast = new Notyf({
  position: {
    x: "center",
    y: "top",
  },
});

const toggleDrawer = () => {
  const drawer = document.getElementById("drawer");
  const drawerValue = drawer.style.right;
  if (drawerValue === "0px") {
    drawer.style.right = "-33.33%";
  } else {
    drawer.style.right = "0px";
  }
};

window.onload = () => {
  fetchFiles();
};

const uploadFile = async (e) => {
  try {
    e.preventDefault();
    const form = e.target;
    const uploadButton = document.getElementById("upload-btn");
    const formdata = new FormData(form);
    const progress = document.getElementById("progress");

    const options = {
      onUploadProgress: (e) => {
        const loaded = e.loaded;
        const total = e.total;
        const percentage = Math.floor((loaded * 100) / total);
        progress.style.width = percentage + "%";
        progress.innerHTML = percentage + "%";
      },
    };

    const { data } = await axios.post(
      "http://localhost:8080/file",
      formdata,
      options,
    );
    toast.success("File Uploaded successfully");
    toggleDrawer();
    progress.style.width = 0;
    progress.innerHTML = "";
    form.reset();
    fetchFiles();
  } catch (err) {
    console.log(err.response ? err.response.data.message : err.message);
  }
};

const getSize = (size) => {
  const mb = size / 1000 / 1000;
  return mb.toFixed(1);
};

const fetchFiles = async () => {
  try {
    const { data } = await axios("http://localhost:8080/files");
    const tableBody = document.getElementById("files-table");
    tableBody.innerHTML = "";

    for (file of data) {
      const ui = `
            <tr>
                <td class="py-4 pl-6 capitalize">${file.filename}</td>
                <td class="capitalize">${file.type}</td>
                <td>${getSize(file.size)}MB</td>
                <td>${moment(file.cratedAt).format("DD MMM YYYY")}</td>
                <td>
                  <div class="space-x-2">
                    <button
                    onclick="deleteFile('${file?._id}')"
                      class="bg-rose-500 p-1 px-2 rounded text-white hover:bg-rose-700"
                    >
                      <i class="ri-delete-bin-line"></i>
                    </button>
                    <button
                      class="bg-amber-500 p-1 px-2 rounded text-white hover:bg-amber-700"
                    >
                      <i class="ri-share-line"></i>
                    </button>
                    <button
                    onclick="downloadFiles('${file._id}', '${file.filename}')"
                      class="bg-green-500 p-1 px-2 rounded text-white hover:bg-green-700"
                    >
                      <i class="ri-download-2-line"></i>
                    </button>
                  </div>
                </td>
              </tr>
    `;
      tableBody.innerHTML += ui;
    }
  } catch (err) {
    console.log(err);
  }
};

const deleteFile = async (id) => {
  try {
    const { data } = await axios.delete(`http://localhost:8080/files/${id}`);
    toast.success("File deleted");
    fetchFiles();
  } catch (err) {
    toast.error(err.response ? err.response.data.message : err.message);
  }
};

const downloadFiles = async (id, filename) => {
  try {
    const options = {
      responseType: "blob",
    };
    const { data } = await axios.get(
      `http://localhost:8080/files/download/${id}`,
      options,
    );
    const ext = data.type.split("/").pop();
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.${ext}`;
    a.click();
    a.remove();
  } catch (err) {
    console.log(err.response ? err.response.data.message : err.message);
  }
};
