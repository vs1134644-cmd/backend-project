const logout = () => {
  localStorage.clear();
  location.href = "../index.html";
};

window.onload = () => {
  showUserDetails();
};
const showUserDetails = async () => {
  const session = await getSession();
  let fullname1 = document.getElementById("fullname");
  let email = document.getElementById("email");
  fullname1.innerHTML = session.fullname;
  email.innerHTML = session.email;
};
