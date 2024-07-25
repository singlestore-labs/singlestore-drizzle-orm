function post(event) {
  text = event.target.elements.text.value;

  fetch("/api/post", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: text,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Request failed.");
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });

  return false;
}

function getPosts() {
  fetch("/api/post")
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Request failed.");
    })
    .then((data) => {
      // get element with class scrollable
      const scrollable = document.querySelector(".scrollable");
      // remove all children
      while (scrollable.firstChild) {
        scrollable.removeChild(scrollable.firstChild);
      }
      // for each post, add a new div
      data.forEach((post) => {
        const div = document.createElement("div");
        div.classList.add("post");

        const contentEl = document.createElement("p");
        contentEl.textContent = post.content;
        div.appendChild(contentEl);

        const dateEl = document.createElement("p");
        dateEl.classList.add("date");
        dateEl.textContent = post.createdOn;
        div.appendChild(dateEl);

        scrollable.appendChild(div);
      });
    })
    .catch((error) => {
      console.error(error);
    });
}
