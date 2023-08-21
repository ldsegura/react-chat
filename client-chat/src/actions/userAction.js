const getUser = async (request, onSuccess, onError) => {
  try {
    await fetch(`${process.env.REACT_APP_DOMAIN_CMS}/api/users/${request.id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((response) => {
        onSuccess && onSuccess(response);
      });
  } catch (e) {
    onError && onError();
  }
};

const userAction = {
  getUser,
};

export default userAction;
