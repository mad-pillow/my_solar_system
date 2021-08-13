const mainContainer = document.querySelector("#main");
const stars = document.querySelector("#stars");
const solarSystem = document.querySelector("#solar-system");

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

function createPlanet(x, y, parent = mainContainer) {
  const newPlanet = document.createElement("div");
  const randomSize = Math.ceil(Math.random() * 40) + 40;
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

function createPath(parent = mainContainer) {
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
  createPlanet(e.clientX, e.clientY);
  mainContainer.removeEventListener("mousemove", changePath);
  document.querySelector("#path").remove();
});

mainContainer.addEventListener("mousedown", (e) => {
  createPath();
  mainContainer.addEventListener("mousemove", changePath);
});
