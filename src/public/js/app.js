function post(event) {
  event.preventDefault();
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
      if (!response.ok) {
        throw new Error("Request failed.");
      }
      const input = document.getElementById("new-post-input");
      input.value = "";
      getPosts();
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
        div.classList.add("post-container");
        div.id = `post-${post.id}`;

        div.appendChild(buildPost(post))
        div.appendChild(buildForm(post.id));
        post.comments.forEach((comment) => {
          div.appendChild(buildComment(comment))
        })

        scrollable.appendChild(div);
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

function switchReplyVisibility(commentId) {
  const commentContainerEl = document.getElementById(commentId);

  const buttonEl = commentContainerEl.getElementsByClassName("reply")[0];

  const responseEl = commentContainerEl.getElementsByClassName("response")[0];

  if (responseEl.classList.contains("hidden")) {
    responseEl.classList.remove("hidden");
    buttonEl.textContent = "↑";
  } else {
    responseEl.classList.add("hidden");
    buttonEl.textContent = "↵";
  }
}

async function commentCreate(data) {
  try {
    const res = await fetch("/api/comment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      throw new Error("Request failed.");
    }
    getPosts();
  } catch (err) {
    console.error(err);
  }
}

// DOM functions

function buildPost(post) {
  const container = document.createElement("div")
  container.classList.add("comment", "post")

  container.appendChild(buildContent(post.content, post.createdOn));
  container.appendChild(buildReplyButton(`post-${post.id}`));

  return container;
}

function buildForm(postID, comment) {
  const form = document.createElement("form");
  form.classList.add("response", "hidden");

  const postIDInput = document.createElement("input");
  postIDInput.type = "hidden";
  postIDInput.name = "postId";
  postIDInput.value = postID;
  form.appendChild(postIDInput);

  if (comment) {
    const commentIDInput = document.createElement("input");
    commentIDInput.type = "hidden";
    commentIDInput.name = "commentId";
    commentIDInput.value = comment.id;
    form.appendChild(commentIDInput);
  }

  const commentInput = document.createElement("input");
  commentInput.type = "text";
  commentInput.name = "text";
  commentInput.placeholder = "Add a comment";
  form.appendChild(commentInput);

  form.onsubmit = async (e) => {
    e.preventDefault();
    await commentCreate({
      content: commentInput.value,
      postId: postID,
      repliesToCommentId: comment?.id,
    })
    commentInput.value = "";
    switchReplyVisibility(`comment-${comment.id}`);
  }

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.innerHTML = "✉"
  form.appendChild(submitButton);

  return form;
}

function buildReplyButton(id) {
  const replyButton = document.createElement("button");
  replyButton.classList.add("reply");
  replyButton.onclick = () => switchReplyVisibility(id);
  replyButton.innerHTML = "↵";
  return replyButton;
}

function buildComment(comment) {
  const container = document.createElement("div");
  container.classList.add("post-container", "indented");
  container.id = `comment-${comment.id}`;

  const commentElement = document.createElement("div");
  commentElement.classList.add("comment");

  commentElement.appendChild(buildContent(comment.content, comment.createdOn));
  commentElement.appendChild(buildReplyButton(`comment-${comment.id}`));
  container.appendChild(commentElement);

  container.appendChild(buildForm(comment.postId, comment));

  if (comment.comments) {
    comment.comments.forEach((c) => {
      container.appendChild(buildComment(c))
    })
  }

  return container;
}

function buildContent(content, date) {
  const contentContainer = document.createElement("div");
  contentContainer.classList.add("comment-content");

  const contentElement = document.createElement("p");
  contentElement.classList.add("content");
  contentElement.innerHTML = content;

  const dateElement = document.createElement("p");
  dateElement.classList.add("date");
  dateElement.innerHTML = date;

  contentContainer.appendChild(contentElement);
  contentContainer.appendChild(dateElement);

  return contentContainer;
}