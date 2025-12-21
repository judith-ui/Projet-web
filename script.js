document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  const containercarrossel = container?.querySelector(".container-carrossel");
  const carrossel = containercarrossel?.querySelector(".carrossel");

  if (!container || !containercarrossel || !carrossel) return;

  const carrosselItems = carrossel.querySelectorAll(".carrossel-item");
  const btnPrev = document.querySelector("#btn-prev");
  const btnNext = document.querySelector("#btn-next");

  let isMouseDown = false;
  let currentMousePos = 0;
  let lastMousePos = 0;
  let lastMoveTo = 0;
  let moveTo = 0;

  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      moveTo += 30;
    });
  }

  if (btnNext) {
    btnNext.addEventListener("click", () => {
      moveTo -= 30;
    });
  }

  const createcarrossel = () => {
    const carrosselProps = onResize();
    const length = carrosselItems.length;
    const degress = 360 / length;
    const gap = 20;
    const tz = distanceZ(carrosselProps.w, length, gap);

    const height = calculateHeight(tz);

    container.style.width = tz * 2 + gap * length + "px";
    container.style.height = height + "px";

    carrosselItems.forEach((item, i) => {
      const degressByItem = degress * i + "deg";
      item.style.setProperty("--rotatey", degressByItem);
      item.style.setProperty("--tz", tz + "px");
    });
  };

  const lerp = (a, b, n) => n * (a - b) + b;

  const distanceZ = (widthElement, length, gap) =>
    widthElement / 2 / Math.tan(Math.PI / length) + gap;

  const calculateHeight = (z) => {
    const t = Math.atan((90 * Math.PI) / 180 / 2);
    return t * 2 * z;
  };

  const getPosX = (x) => {
    currentMousePos = x;
    moveTo = currentMousePos < lastMousePos ? moveTo - 2 : moveTo + 2;
    lastMousePos = currentMousePos;
  };

  const update = () => {
    lastMoveTo = lerp(moveTo, lastMoveTo, 0.05);
    carrossel.style.setProperty("--rotatey", lastMoveTo + "deg");
    requestAnimationFrame(update);
  };

  const onResize = () => {
    const boundingcarrossel = containercarrossel.getBoundingClientRect();
    return { w: boundingcarrossel.width, h: boundingcarrossel.height };
  };

  const initEvents = () => {
    // souris
    carrossel.addEventListener("mousedown", () => {
      isMouseDown = true;
      carrossel.style.cursor = "grabbing";
    });
    carrossel.addEventListener("mouseup", () => {
      isMouseDown = false;
      carrossel.style.cursor = "grab";
    });
    container.addEventListener("mouseleave", () => (isMouseDown = false));

    carrossel.addEventListener("mousemove", (e) => {
      if (isMouseDown) getPosX(e.clientX);
    });

    // tactile
    carrossel.addEventListener("touchstart", () => {
      isMouseDown = true;
      carrossel.style.cursor = "grabbing";
    });
    carrossel.addEventListener("touchend", () => {
      isMouseDown = false;
      carrossel.style.cursor = "grab";
    });
    container.addEventListener("touchmove", (e) => {
      if (isMouseDown) getPosX(e.touches[0].clientX);
    });

    window.addEventListener("resize", createcarrossel);

    update();
    createcarrossel();
  };

  initEvents();

  let interval;
  const rotationSpeed = 2;

  const startRotation = (direction) => {
    interval = setInterval(() => {
      moveTo += direction * rotationSpeed;
    }, 16);
  };

  const stopRotation = () => {
    clearInterval(interval);
  };

  if (btnPrev) {
    btnPrev.addEventListener("mousedown", () => startRotation(1));
    btnPrev.addEventListener("mouseup", stopRotation);
    btnPrev.addEventListener("mouseleave", stopRotation);
    btnPrev.addEventListener("touchstart", () => startRotation(1));
    btnPrev.addEventListener("touchend", stopRotation);
  }

  if (btnNext) {
    btnNext.addEventListener("mousedown", () => startRotation(-1));
    btnNext.addEventListener("mouseup", stopRotation);
    btnNext.addEventListener("mouseleave", stopRotation);
    btnNext.addEventListener("touchstart", () => startRotation(-1));
    btnNext.addEventListener("touchend", stopRotation);
  }
});
// Validation du formulaire de contact
const contactForm = document.getElementById("contactForm");
const feedback = document.getElementById("formFeedback");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nom = document.getElementById("nom").value;

    // Simulation d'envoi
    feedback.textContent = `Merci ${nom}, votre message a bien été envoyé !`;
    feedback.classList.remove("hidden");
    contactForm.reset();

    setTimeout(() => {
      feedback.classList.add("hidden");
    }, 5000);
  });
}
