// home page js
function testStart() {
  window.location.href = "practice.html"; // change if your test page has a different name
}



  




// practice page js

const paragraphs = [
  `The sun dipped behind the hills, casting a golden hue across the quiet village. Birds chirped their final songs of the day as lanterns flickered to life. Children laughed, chasing fireflies in open fields. A gentle breeze carried the scent of jasmine. Everything felt timeless, peaceful - a perfect end to a simple, beautiful day.`,

  `Emma wandered through the bookstore, running her fingers along the spines of forgotten novels. One cover caught her eye - worn leather with faded lettering. Opening it, she discovered handwritten notes in the margins. Someone else had loved this book deeply. Smiling, she bought it, unknowingly beginning a new chapter that would change her life forever.`,

  `The rain fell softly, tapping on the windowpane like an old friend returning. Inside, the fireplace crackled with warmth. Anna wrapped herself in a blanket, sipping tea, a book open in her lap. The world outside melted away, replaced by pages of adventure. These rainy evenings reminded her how lovely silence and solitude could truly be.`,

  `In the heart of the forest stood an ancient oak, its branches like arms protecting the secrets of time. Legends spoke of fairies hiding in its roots and wishes whispered into its bark. Children believed in its magic, and even grown-ups felt a strange calm when nearby. The tree remained - silent, old, and full of stories.`,

  `Jake loved Sunday mornings - the aroma of pancakes, the rustle of the newspaper, and the lazy rhythm of a day unplanned. The cat curled on the couch. Sunlight spilled across the floor like melted butter. For a few precious hours, there were no deadlines, no calls. Just peace, laughter, and the quiet joy of being home.`
];

const textSection = document.querySelector(".quote");
const userInput = document.getElementById("quote-input");

let quote = "";
let time = 60;
let timerInterval = null;
let mistakes = 0;

// array to store data 
let wpmOverTime = [];
let accuracyOverTime = [];
let timePoints = [];
let elapsedTime = 0;

// end


// Generate local text
const generateText = () => {
  const randomIndex = Math.floor(Math.random() * paragraphs.length);
  quote = paragraphs[randomIndex];

  let arr = quote.split("").map((char) => `<span class='quote-chars'>${char}</span>`);
  textSection.innerHTML = arr.join("");
};

// Typing logic
userInput.addEventListener("input", () => {
  let quoteChars = document.querySelectorAll(".quote-chars");
  quoteChars = Array.from(quoteChars);

  let userInputChars = userInput.value.split("");
  
  quoteChars.forEach((char, index) => {
    if (userInputChars[index] == null) {
      char.classList.remove("success", "fail");
    } else if (char.innerText === userInputChars[index]) {
      char.classList.add("success");
      char.classList.remove("fail");
    } else {
      if (!char.classList.contains("fail")) {
        mistakes += 1;
        char.classList.add("fail");
      }
    }
  });

  
  document.getElementById("mistakes").innerText = mistakes;

  let check = quoteChars.every((element) => {
    return element.classList.contains("success");
  });

  if (check) {
    displayResult();
  }
});

// Timer logic
// function updateTimer() {
//   if (time === 0) {
//     displayResult();
//   } else {
//     document.getElementById("timer").innerText = --time + "s";
//   }
// }
function updateTimer() {
  if (time === 0) {
    displayResult();
  } else {
    elapsedTime++;
    document.getElementById("timer").innerText = --time + "s";

    let totalChars = userInput.value.length;
    let wpm = totalChars > 0 ? (totalChars / 5 / (elapsedTime / 60)).toFixed(2) : 0;
    let accuracy = totalChars > 0 ? Math.round(((totalChars - mistakes) / totalChars) * 100) : 0;

    wpmOverTime.push(parseFloat(wpm));
    accuracyOverTime.push(parseFloat(accuracy));
    timePoints.push(elapsedTime);

    updateLiveChart();
  }
}

const timeReduce = () => {
  time = 60;
  timerInterval = setInterval(updateTimer, 1000);
};

const displayResult = () => {
  document.querySelector(".result").style.display = "block";
  clearInterval(timerInterval);
  document.getElementById("stop-test").style.display = "none";
  userInput.disabled = true;

  let timeTaken = 60 - time;
  let totalChars = userInput.value.length;

  let wpm = totalChars > 0 ? (totalChars / 5 / (timeTaken / 60)).toFixed(2) : 0;
  let accuracy = totalChars > 0
    ? Math.round(((totalChars - mistakes) / totalChars) * 100)
    : 0;

  document.getElementById("wpm").innerText = `${wpm} wpm`;
  document.getElementById("accuracy").innerText = `${accuracy} %`;

  
  generateChart(wpm, accuracy);
};

const startTest = () => {
  // add
  wpmOverTime = [];
  accuracyOverTime = [];
  timePoints = [];
  elapsedTime = 0;
  if (liveChart) liveChart.destroy();

// end
  mistakes = 0;
  time = 60;
  userInput.disabled = false;
  userInput.value = "";
  textSection.innerHTML = "";
  generateText();
  timeReduce();
  userInput.focus();
  
  document.getElementById("start-test").style.display = "none";
  document.getElementById("stop-test").style.display = "block";
  document.querySelector(".result").style.display = "none";
};

window.onload = () => {
    // // Restore theme from localStorage
    // const savedTheme = localStorage.getItem("theme");
    // const body = document.body;
    // const themeIcon = document.getElementById("theme-icon");
  
    // if (savedTheme === "dark") {
    //   document.body.classList.add("dark-mode");
    //   if (themeIcon) themeIcon.setAttribute("data-feather", "sun");
    // } else {
    //   if (themeIcon) themeIcon.setAttribute("data-feather", "moon");
    // }
  
    // feather.replace(); // Refresh icons
  
    // Typing test setup
  userInput.value = "";
  document.getElementById("start-test").style.display = "block";
  document.getElementById("stop-test").style.display = "none";
  userInput.disabled = true;
};
// Chart display

let liveChart;

function updateLiveChart() {
  const ctx = document.getElementById("liveChart").getContext("2d");

  const gradientWPM = ctx.createLinearGradient(0, 0, 0, 400);
  gradientWPM.addColorStop(0, "#4caf50");
  gradientWPM.addColorStop(1, "#1b5e20");

  const gradientAccuracy = ctx.createLinearGradient(0, 0, 0, 400);
  gradientAccuracy.addColorStop(0, "#2196f3");
  gradientAccuracy.addColorStop(1, "#0d47a1");

  liveChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: timePoints,
      datasets: [
        {
          label: "WPM",
          data: wpmOverTime,
          borderColor: gradientWPM,
          tension: 0.4,
          fill: false,
          pointRadius: 3,
          pointHoverRadius: 6,
        },
        {
          label: "Accuracy",
          data: accuracyOverTime,
          borderColor: gradientAccuracy,
          tension: 0.4,
          fill: false,
          pointRadius: 3,
          pointHoverRadius: 6,
        }
      ]
    },
    options: {
      responsive: true,
      animation: {
        duration: 500,
        easing: 'easeOutQuart'
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { color: "#ccc" },
          grid: { color: "#333" },
          title: {
            display: true,
            text: 'Value',
            color: '#fff'
          }
        },
        x: {
          ticks: { color: "#ccc" },
          grid: { color: "#333" },
          title: {
            display: true,
            text: 'Time (s)',
            color: '#fff'
          }
        }
      },
      plugins: {
        legend: {
          labels: { color: '#fff' }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.formattedValue}${context.dataset.label === 'Accuracy' ? '%' : ' WPM'}`;
            }
          }
        }
      }
    }
  });
}




// Dark mode toggle
function toggleTheme() {
  const body = document.body;
  const themeIcon = document.getElementById("theme-icon");

  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    // localStorage.setItem("theme", "dark");
    themeIcon.setAttribute("data-feather", "sun");
  } else {
    // localStorage.setItem("theme", "light");
    themeIcon.setAttribute("data-feather", "moon");
  }

  feather.replace(); // Reinitialize icons to reflect changes
}
