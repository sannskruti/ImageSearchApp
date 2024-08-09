const accessKey = ""; //write your access key
const searchForm = document.querySelector("form");
const searchInput = document.querySelector(".search-input");
const imagesContainer = document.querySelector(".images-container");
const loadMoreBtn = document.querySelector(".loadMoreBtn");

let page = 1;

//Function to fetch images using Unsplash API
const fetchImages = async (query, pageNo) => {
  try {
    if (pageNo === 1) {
      imagesContainer.innerHTML = "";
      // NOT on load more button
    }

    //   console.log(query);
    const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=28&page=${pageNo}&client_id=${accessKey}`;

    const response = await fetch(url); //will return a promise
    const data = await response.json();
    console.log("data", data);

    //for wrong input word
    if (data.results.length > 0) {
      // we saw that "results" is an array given in the api's data
      data.results.forEach((photo) => {
        //we need to create one img for one photo and show in image container
        //Creating image div
        const imageElement = document.createElement("div"); //create a div
        //lets add a class to imageElement
        imageElement.classList.add("imageDiv");
        imageElement.innerHTML = `<img src="${photo.urls.regular}"/>`; // in the urls , we have sizes of the images... give html to it and apend it to images container

        //creating overlay
        const overlayElement = document.createElement("div"); //this element will create overlay
        overlayElement.classList.add("overlay");

        //creating overlay text
        const overlayText = document.createElement("h3");
        overlayText.innerText = `${photo.alt_description}`;
        overlayElement.appendChild(overlayText);

        //in imagelement , overlay will be appeneded
        imageElement.appendChild(overlayElement);

        imagesContainer.appendChild(imageElement);
      });

      //by default load more button is not visisble so put condition to make it visible after getting some content
      if (data.total_pages === pageNo) {
        //means u come on last page, total page is coming from data
        loadMoreBtn.style.display = "none";
      } else {
        loadMoreBtn.style.display = "block";
      }
    } else {
      //when array is empty
      imagesContainer.innerHTML = `<h2>No image found!</h2>`;
      if (loadMoreBtn.style.display === "block") {
        loadMoreBtn.style.display = "none";
      }
    }
  } catch (error) {
    imagesContainer.innerHTML = `<h2>Failed to fetch images. please try again later</h2>`;
  }
};

//Adding event listner to search form
searchForm.addEventListener("submit", (e) => {
  //page is autosubmitting so we need to prevent cz the input is going off
  e.preventDefault();
  //   console.log(searchInput.value);

  //now we need to fetch images wrt to search input text
  const inputText = searchInput.value.trim();
  if (inputText !== "") {
    page = 1;
    fetchImages(inputText, page);
  } else {
    imagesContainer.innerHTML = `<h2>Please enter a search query</h2>`;
    if (loadMoreBtn.style.display === "block") {
      loadMoreBtn.style.display = "none";
    }
  }
});

//Adding event listner to load more button to fetch more images
loadMoreBtn.addEventListener("click", () => {
  fetchImages(searchInput.value.trim(), ++page);
});
