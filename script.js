const mainContainer = document.querySelector("#main");
const stars = document.querySelector("#stars");
const solarSystem = document.querySelector("#solar-system");
const fullscreenBtn = document.querySelector("#full-screen");

function goFullscreen() {
  fullscreenBtn.classList.remove("notfullscreen");
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen();
  } else if (document.documentElement.webkitRequestFullscreen) {
    document.documentElement.webkitRequestFullscreen();
  } else if (document.documentElement.msRequestFullscreen) {
    document.documentElement.msRequestFullscreen();
  }
}

function leaveFullscreen() {
  fullscreenBtn.classList.add("notfullscreen");
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement) {
    fullscreenBtn.classList.remove("notfullscreen");
  } else {
    fullscreenBtn.classList.add("notfullscreen");
  }
});

fullscreenBtn.addEventListener("click", (e) => {
  e.preventDefault();
  return document.fullscreenElement ? leaveFullscreen() : goFullscreen();
});

function setSunSize() {
  const width = parseInt(getComputedStyle(mainContainer).width);
  const height = parseInt(getComputedStyle(mainContainer).height);
  const size = width > height ? height / 5 : width / 5;

  solarSystem.style.width = solarSystem.style.height = `${size}px`;

  return size;
}

setSunSize();

(function createStars(number = 800, parent = stars) {
  for (let i = 0; i < number; i++) {
    const newStar = document.createElement("span");
    newStar.className = "star";
    const randomSize = Math.ceil(Math.random() * 3);
    const randomPosX = (Math.random() * 1000) / 10;
    const randomPosY = (Math.random() * 1000) / 10;
    newStar.style = `
      position: absolute;
      top: ${randomPosY}%;
      left: ${randomPosX}%;
      width: ${randomSize}px;
      height: ${randomSize}px;
      background-color: white;
      border-radius: 50%;
    `;
    parent.insertAdjacentElement("afterbegin", newStar);
  }
})();

function createPlanet(x, y, parent = solarSystem) {
  const newPlanet = document.createElement("div");
  const maxPlanetSize = setSunSize() / 4;
  const randomSize =
    Math.ceil(Math.random() * maxPlanetSize) + maxPlanetSize / 1.75;
  const r = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const alfa = Math.random() * 0.5 + 0.5;
  const rotateFor = Math.ceil(Math.random() * 10) + 10;
  const rotateDir = Math.floor(Math.random() * 2);
  const rotateAboutX = window.innerWidth / 2 - x + randomSize / 2;
  const rotateAboutY = window.innerHeight / 2 - y + randomSize / 2;
  //rework gradientAngle formula
  const gradientAngle =
    Math.atan2(rotateAboutY, rotateAboutX) + (Math.PI * 3) / 2;
  const parentX = parseInt(parent.getBoundingClientRect().left);
  const parentY = parseInt(parent.getBoundingClientRect().top);
  newPlanet.className = "planet";
  newPlanet.style = `
    top: ${y - parentY - randomSize / 2}px;
    left: ${x - parentX - randomSize / 2}px;
    width: ${randomSize}px;
    height: ${randomSize}px;
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(${
      gradientAngle * 57.3
    }deg, rgb(${r}, ${g}, ${b}) 10%, rgb(10, 10, 10));
    animation-name: ${rotateDir ? "movePlanetCCW" : "movePlanetCW"};
    animation-duration: ${rotateFor}s;
    animation-direction: normal;
    transform-origin: ${rotateAboutX}px ${rotateAboutY}px;
  `;

  parent.append(newPlanet);

  return newPlanet;
}

function createPath(parent = solarSystem) {
  const path = document.createElement("div");
  path.id = "path";

  parent.append(path);

  return path;
}

function changePath(e) {
  const deltaX = window.innerWidth / 2 - e.clientX;
  const deltaY = window.innerHeight / 2 - e.clientY;
  const trajDiam = 2 * Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

  document.querySelector("#path").style.width = `${trajDiam}px`;
  document.querySelector("#path").style.height = `${trajDiam}px`;
}

mainContainer.addEventListener("mouseup", (e) => {
  if (e.target !== fullscreenBtn) {
    createPlanet(e.clientX, e.clientY);
    mainContainer.removeEventListener("mousemove", changePath);
    mainContainer.removeEventListener("touchmove", changePath);
    document.querySelector("#path").remove();
  }
});

mainContainer.addEventListener("mousedown", (e) => {
  if (e.target !== fullscreenBtn) {
    createPath();
    mainContainer.addEventListener("mousemove", changePath);
    mainContainer.addEventListener("touchmove", changePath);
  }
});
