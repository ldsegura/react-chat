const getMessages = async (request, onSuccess, onError) => {
  try {
    await fetch(`${process.env.REACT_APP_DOMAIN_CMS}/api/chat-directlies?filters[index]=${request.index}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((response) => {
        onSuccess && onSuccess(response.data);
      });
  } catch (e) {
    onError && onError();
  }
};

const messageAction = {
  getMessages,
};

export default messageAction;
