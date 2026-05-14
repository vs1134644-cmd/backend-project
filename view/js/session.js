const getSession = async () => {
  try {
    const session = localStorage.getItem("authKey");

    if (!session) {
      return null;
    }

    const payload = {
      token: session,
    };
    const { data } = await axios.post(
      "http://localhost:8080/token/verify",
      payload,
    );
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};
