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
        div.id = post.id;

        div.innerHTML = `
			<div class="comment post">
				<div>
					<p class="content">${post.content}</p>
					<p class="date">${post.createdOn}</p>
				</div>
				<button class="reply" onclick="switchReplyVisibility(${post.id})">🡇</div>
			</div>
			<form class="response hidden" onsubmit="return comment(event)">
				<input class="hidden" type="text" name="postId" value="${post.id}" />
				<input class="hidden" type="text" name="commentId" value="" />
				<input type="text" name="text" id="text" placeholder="Add a comment" />
				<button type="submit">✉</button>
			</form>
		`;

        scrollable.appendChild(div);
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

function switchReplyVisibility(postId) {
  const postContainerEl = document.getElementById(postId);

  const buttonEl = postContainerEl.getElementsByClassName("reply")[0];

  const responseEl = postContainerEl.getElementsByClassName("response")[0];

  if (responseEl.classList.contains("hidden")) {
    responseEl.classList.remove("hidden");
    buttonEl.textContent = "🡅";
  } else {
    responseEl.classList.add("hidden");
    buttonEl.textContent = "🡇";
  }
}

function comment(event) {
  text = event.target.elements.text.value;
  postId = event.target.elements.postId.value;
  commentId =
    event.target.elements.commentId.value == ""
      ? undefined
      : event.target.elements.commentId.value;

  fetch("/api/comment", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: text,
      postId: postId,
      repliesToCommentId: commentId,
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
      getPosts();
    })
    .catch((error) => {
      console.error(error);
    });

  return false;
}
