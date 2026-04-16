// Slideshow //
let slideIndex = 0;
showSlides();

let autoTimer = setInterval(() => plusSlides(1), 10000);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
  clearInterval(autoTimer);
  autoTimer = setInterval(() => plusSlides(1), 10000);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");

  if (n >= slides.length) { slideIndex = 0; }
  if (n < 0) { slideIndex = slides.length - 1; }

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex].style.display = "block";
  if (dots[slideIndex]) dots[slideIndex].className += " active";
}
