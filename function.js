let selectedFood = [];
let selectedMovie = [];

const btnDate = document.getElementById("btnDate");
const dateResult = document.getElementById("dateResult");
const freeDate = document.getElementById("freeDate");
const finalResult = document.getElementById("finalResult");

const menuSection = document.getElementById("menuSection");
const btnFinishMenu = document.getElementById("btnFinishMenu");
const foodResult = document.getElementById("foodResult");

const movieSection = document.getElementById("movieSection");
const btnFinishMovie = document.getElementById("btnFinishMovie");
const btnSkipMovie = document.getElementById("btnSkipMovie");
const movieResult = document.getElementById("movieResult");


const FORMSPREE_ENDPOINT = "https://formspree.io/f/mkgdenov";

const sendDataToFormspree = async (date, food, movie) => {
  const data = {
    date_selection: date,
    food_selection: food,
    movie_selection: movie || "Không chọn phim / Bỏ qua",
  };

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log("Dữ liệu đã được gửi thành công đến Formspree!");
    } else {
      console.error("Lỗi khi gửi dữ liệu đến Formspree:", response.statusText);
    }
  } catch (error) {
    console.error("Lỗi mạng hoặc lỗi khác:", error);
  }
};


const finishMovieSelection = (isSkipped) => {
    let movieText;

    if (isSkipped || selectedMovie.length === 0) {
      selectedMovie = [];
      movieText = "<b>Và không xem phim (tạm thời):</b> Chắc là mình đi dạo/uống nước ha 🥺";
    } else {
      movieText = "<b>Và xem phim:</b> " + selectedMovie.join(", ");
    }

    movieResult.innerHTML = movieText;

    movieSection.classList.add("hidden");
    menuSection.classList.remove("hidden");
}

if (btnDate && freeDate && movieSection) {
  btnDate.addEventListener("click", () => {
    if (!freeDate.value) {
      alert("Chọn ngày đi mà:<");
      return;
    }
    dateResult.innerText = "Vậy là e rảnh ngày: " + freeDate.value;

    menuSection.classList.add("hidden");
    finalResult.classList.add("hidden");
    movieSection.classList.remove("hidden");
  });
}

document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => {
    const value = card.getAttribute("data-value");
    const parentSectionId = card.closest('.section')?.id;

    let selectedArray = [];
    if (parentSectionId === 'menuSection') {
      selectedArray = selectedFood;
    } else if (parentSectionId === 'movieSection') {
      selectedArray = selectedMovie;
    }

    if (value) {
        if (selectedArray.includes(value)) {

          if (parentSectionId === 'menuSection') {
              selectedFood = selectedArray.filter(v => v !== value);
          } else if (parentSectionId === 'movieSection') {
              selectedMovie = selectedArray.filter(v => v !== value);
          }
          card.classList.remove("selected");
        } else {

          if (parentSectionId === 'movieSection') {

              document.querySelectorAll('#movieSection .card.selected').forEach(c => c.classList.remove('selected'));
              selectedMovie = [];
          }

          if (parentSectionId === 'menuSection') {
              selectedFood.push(value);
          } else if (parentSectionId === 'movieSection') {
              selectedMovie.push(value);
          }
          card.classList.add("selected");
        }
    }
  });
});

if (btnFinishMovie && movieSection && menuSection && movieResult) {
  btnFinishMovie.addEventListener("click", () => {
    finishMovieSelection(false);
  });
}

if (btnSkipMovie && movieSection && menuSection && movieResult) {
    btnSkipMovie.addEventListener("click", () => {
        finishMovieSelection(true);
    });
}


if (btnFinishMenu && menuSection && finalResult) {
  btnFinishMenu.addEventListener("click", () => {
    if (selectedFood.length === 0) {
      alert("Sao không chọn món nào vậy:(");
      return;
    }

    const finalDate = freeDate.value;
    const finalFood = selectedFood.join(", ");
    const finalMovie = selectedMovie.length > 0 ? selectedMovie.join(", ") : "Không chọn phim";

    sendDataToFormspree(finalDate, finalFood, finalMovie);

    foodResult.innerHTML = "<b>Vậy ta sẽ đi ăn:</b> " + finalFood;

    menuSection.classList.add("hidden");

    finalResult.innerHTML = `
      <h2>Thank for choosing :)))</h2>
      <p>Vậy ta sẽ đi chơi vào ngày: <b>${finalDate}</b></p>
      <p>Đi ăn: <b>${finalFood}</b></p>
      <p>Và xem phim: <b>${finalMovie}</b></p>
    `;

    finalResult.classList.remove("hidden");
  });
}