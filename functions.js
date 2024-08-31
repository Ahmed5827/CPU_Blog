let userData = {};

// Load user data from localStorage when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const storedUserData = localStorage.getItem("userData");
  if (storedUserData) {
    userData = JSON.parse(storedUserData);
  }

  // Use event delegation to handle keydown events
  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission or other default actions

      // Find the nearest comment input within the parent container
      const commentInput = event.target
        .closest(".usericopost")
        .querySelector(".comment");
      const commentsContainer = event.target
        .closest(".usericopost")
        .querySelector(".comments-container");
      const interactionsText = event.target
        .closest(".usericopost")
        .querySelector(".interactions small");

      if (commentInput && commentsContainer) {
        const commentText = commentInput.value.trim();

        if (commentText) {
          // Create new comment element
          const newComment = document.createElement("div");
          newComment.classList.add("commentpost");

          // Set the inner HTML of the new comment
          newComment.innerHTML = `
                        <div class="row-layoutcomments">
                            <div>
                                <img src="user.png" width="50px" class="imgclass" />
                            </div>
                            <div class="name">
                                <h4 class="truename">${userData.userName}</h4>
                                <small>${userData.userRole}</small>
                            </div>
                        </div>
                        <span>${commentText}</span>
                    `;

          // Append the new comment to the comments container
          commentsContainer.appendChild(newComment);

          // Update the comment counter
          let commentsCount =
            parseInt(interactionsText.textContent.split(" ")[2]) || 0;
          commentsCount++;
          interactionsText.textContent = `${
            interactionsText.textContent.split(" ")[0]
          } Likes, ${commentsCount} comments`;

          // Clear the input field
          commentInput.value = "";
        }
      }
    }
  });
});

function navigateToPage(event) {
  event.preventDefault(); // Prevents form submission

  // Get values from the input fields
  const name = document.getElementById("name").value;
  const role = document.getElementById("role").value;
  const password = document.getElementById("password").value;

  // Check if inputs are valid
  if (name && role && password) {
    // Save user data to localStorage
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userName: name,
        userRole: role,
        userPassword: password,
      })
    );

    // Navigate to the desired page
    window.location.href = "index.html";
  } else {
    alert("Please fill out all fields.");
  }
}

function focusCommentInput(container) {
  // Find the closest parent container for the clicked comment image
  var postContainer = container.closest(".usericopost");
  var commentInput = postContainer.querySelector(".comment");
  if (commentInput) {
    commentInput.focus();
  }
}

function Liked(container) {
  // Get the image inside the clicked container
  var img = container.querySelector(".myImage");

  // Find the closest parent container that contains the likes counter
  var postContainer = container.closest(".usericopost");
  var likesText = postContainer.querySelector(".interactions small");

  // Extract the number of likes from the text
  var likes = parseInt(likesText.textContent.split(" ")[0]);

  // Check if the image is already liked or not
  if (img.src.endsWith("liked.png")) {
    img.src = "like.png";
    likes--; // Decrement like count
  } else if (img.src.endsWith("like.png")) {
    img.src = "liked.png";
    likes++; // Increment like count
  }
  likesText.textContent = `${likes} Likes, ${
    likesText.textContent.split(" ")[2]
  } ${
    likesText.textContent.split(" ")[3]
  }`;
}

function addPost() {
  var postContent = document.getElementById("postInput").value;
  if (postContent.trim() !== "") {
    var newPost = document.createElement("div");
    newPost.className = "usericopost";
    newPost.innerHTML = `
            <div class="row-layout">
                <div>
                    <img src="user.png" width="50px" class="imgclass" />
                </div>
                <div class="name">
                    <h3 class="truename">${userData.userName}</h3>
                    <small>${userData.userRole}</small>
                </div>
            </div>
            <hr width="97%" />
            <div class="content">
                <p class="blog">${postContent}</p>
                <div class="interactions">
                    <small>0 Likes, 0 comments</small>
                </div>
                <hr width="97%" />
                <div class="LandC">
                    <div class="cursor" onclick="Liked(this)">
                        <img src="like.png" class="myImage" width="30px" />
                        <label>Like</label>
                    </div>
                    <div class="cursor" onclick="focusCommentInput(this)">
                        <img src="comment.png" width="30px" />
                        <label>Comment</label>
                    </div>
                </div>
                <hr width="97%" />
                <div class="comments-container"></div>
                <input type="text" class="comment" placeholder="add a comment!" />
            </div>
        `;

    var postForum = document.querySelector(".postforum");
    postForum.insertAdjacentElement("afterend", newPost);
    document.getElementById("postInput").value = "";
  } else {
    alert("Please enter something to post.");
  }
}
