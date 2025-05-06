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
  
  // Generate local text
  const generateText = () => {
    const randomIndex = Math.floor(Math.random() * paragraphs.length);
    quote = paragraphs[randomIndex];
  
    let arr = quote.split("").map((char) => `<span class='quote-chars'>${char}</span>`);
    // console.log(arr);
    textSection.innerHTML = arr.join("");
    // console.log(arr.join(""));

  };
  
  // Typing logic
  userInput.addEventListener("input", () => {
    let quoteChars = document.querySelectorAll(".quote-chars");
    // console.log(quoteChars);
    quoteChars = Array.from(quoteChars);
    // console.log(quoteChars);

  
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
  function updateTimer() {
    if (time === 0) {
      displayResult();
    } else {
      document.getElementById("timer").innerText = --time + "s";
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

  };
  
  const startTest = () => {
    mistakes = 0;
    time = 60;
    userInput.disabled = false;
    userInput.value = "";
    textSection.innerHTML = "";
    generateText();
    timeReduce();

    // changes
    currentIndex = 0;
    setCurrentChar();

  
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
    document.querySelector(".result").style.display = "none";
  };
  
  window.onload = () => {
    userInput.value = "";
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    // generateText();
  };
  

//   dark mode js
// Toggle dark mode
function toggleTheme() {
    const body = document.body;
    // const themeText = document.getElementById("theme-text");
    const themeIcon = document.getElementById("theme-icon");
  
    body.classList.toggle("dark-mode");
  
    if (body.classList.contains("dark-mode")) {
    //   themeText.innerText = "Light Mode";
      themeIcon.setAttribute("data-feather", "sun");
    } else {
    //   themeText.innerText = "Dark Mode";
      themeIcon.setAttribute("data-feather", "moon");
    }
  
    feather.replace(); // Reinitialize icons to reflect changes
  }
  