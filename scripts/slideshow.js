//arrange the slide items
//arrange the slides next to each other
const slides = Array.from(document.querySelectorAll(".slide"));
let slideWidth = slides[0].getBoundingClientRect().width;

const setSlidePosition = (slide, index) => {
    slide.style.left = slideWidth * index + 'px';
}

slides.forEach(setSlidePosition);


//work on slideshow
const left = document.querySelector(".left");
const right = document.querySelector(".right");
const icon = document.querySelector(".play-pause");
let current = 1;
let playPauseBool = true;
let interval;

const changeSlides = () => {
    if (current > slides.length) { current = 1 }
    if (current === 0) { current = slides.length }

    for (let i = 0; i < slides.length; i++) {
        for (j = 0; j < slides[i].className.length; j++) {
            if (slides[i].className.includes(current)) {
                slides[i].style.cssText = "visibility: visible; opacity: 1";
            } else {
                slides[i].style.cssText = "visibility: hidden; opacity: 0";
            }
        }
    }
}

changeSlides();

const playPause = () => {
    if (playPauseBool === true) {
        interval = setInterval((() => {
            current++;
            changeSlides();
        }), 5000);
        playPauseBool = false;

    } else {
        clearInterval(interval);
        playPauseBool = true;
    }
}


icon.addEventListener("click", () => {
    playPause();
    changePlayPause();

});

const changePlayPause = () => {
    const i = document.querySelector(".play-pause i");
    const cls = i.classList[1];
    if (cls === "fa-play") {
        i.classList.remove("fa-play");
        i.classList.add("fa-pause");
    } else {
        i.classList.remove("fa-pause");
        i.classList.add("fa-play")
    }
}

right.addEventListener("click", () => {
    if (!playPauseBool) { playPause() }
    current++;
    changeSlides();
});

left.addEventListener("click", () => {
    if (!playPauseBool) { playPause() }
    current--;
    changeSlides();
})

playPause();

