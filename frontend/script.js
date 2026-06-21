const toggle = document.getElementById('tone-toggle');
const menu = document.getElementById('tone-menu');
const items = document.querySelectorAll('.dropdown-item');
let selectedTone = "Roast"; // default

const API_URL = "https://roastmytaste.onrender.com"; 

const closeMenu = () => {
  menu.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
};

// Spawn a floating fire emoji at the given viewport coordinates
let fireStormInterval = null;

function spawnFireParticle() {

  const fire = document.createElement("span");

  fire.className = "floating-emoji";
  fire.textContent = "🔥";

  const size = Math.random() * 60 + 20;

  fire.style.left =
    `${Math.random() * window.innerWidth}px`;

  fire.style.fontSize = `${size}px`;

  fire.style.setProperty(
    "--drift",
    `${(Math.random() - 0.5) * 250}px`
  );

  fire.style.animationDuration =
    `${Math.random() * 4 + 4}s`;

  document.body.prepend(fire);

  fire.addEventListener(
    "animationend",
    () => fire.remove(),
    { once: true }
  );
}

function startFireStorm() {

  if (fireStormInterval) return;

  fireStormInterval = setInterval(() => {

    const count = Math.floor(Math.random() * 2) + 1;

    for (let i = 0; i < count; i++) {
      spawnFireParticle();
    }

  }, 150);
}

function stopFireStorm() {

  clearInterval(fireStormInterval);
  fireStormInterval = null;
}

const openMenu = () => {
  menu.hidden = false;
  toggle.setAttribute('aria-expanded', 'true');
};

toggle.addEventListener('click', (event) => {
  event.stopPropagation();
  menu.hidden ? openMenu() : closeMenu();
});

items.forEach(item => {
  item.addEventListener('click', (event) => {
    event.stopPropagation();
    selectedTone = event.target.textContent;
    toggle.textContent = selectedTone;
    closeMenu();
  });
});

const buttons = document.querySelectorAll('.container button');
const inputBoxes = document.querySelectorAll('.input-box');
const serviceRows = document.querySelectorAll('.service-row');
const serviceRoastButtons = document.querySelectorAll('.service-roast-button');
const measureCanvas = document.createElement('canvas');
const measureCtx = measureCanvas.getContext('2d');

const hideInputs = () => {
  inputBoxes.forEach(box => {
    box.classList.remove('active');
    box.setAttribute('aria-hidden', 'true');
  });
};

const hideServiceRows = () => {
  serviceRows.forEach(row => {
    row.classList.remove('active');
    row.setAttribute('aria-hidden', 'true');
  });
};

const showServiceRow = (service) => {
  serviceRows.forEach(row => {
    const shouldShow = row.id === `${service}-row`;
    row.classList.toggle('active', shouldShow);
    row.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
  });
};

const updateInputWidth = (input) => {
  const style = getComputedStyle(input);
  measureCtx.font = `${style.fontSize} ${style.fontFamily}`;
  const text = input.value || input.placeholder || '';
  const width = Math.max(180, measureCtx.measureText(text).width + 40);
  input.style.width = `${width}px`;
};

buttons.forEach(button => {
  button.addEventListener('click', () => {
    hideInputs();
    hideServiceRows();
    const target = button.dataset.input;
    const box = document.getElementById(`${target}-input`);

    showServiceRow(target);

    if (box) {
      box.classList.add('active');
      box.setAttribute('aria-hidden', 'false');
      const input = box.querySelector('input');
      if (input) {
        updateInputWidth(input);
        input.focus();
      }
    }
  });
});

serviceRoastButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    const service = button.dataset.service;
    const input = document.querySelector(`#${service}-input input`);
    if (input) {
      input.focus();
    }
  });
});

inputBoxes.forEach(box => {
  const input = box.querySelector('input');
  if (input) {
    input.addEventListener('input', () => updateInputWidth(input));
    updateInputWidth(input);
  }
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.dropdown')) {
    closeMenu();
  }
});

serviceRoastButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    // show a burst of floating fires from bottom when Roast tone is selected
    if (
      selectedTone &&
      selectedTone.toLowerCase() === "roast"
    ) {
      startFireStorm();
    }

    const service = button.dataset.service;

    if (service === "spotify") {
      window.location.href = `${API_URL}/login`;
    }
    else if (service === "chess") {
      const username = document.querySelector("#chess-input input").value;

      document.getElementById("roast-text").textContent = "Roasting...";
      document.getElementById("roast-output").style.display = "block";

      fetch(`${API_URL}/chess/${username}?tone=${selectedTone}`)
        .then(res => res.json())
        .then(data => {

          stopFireStorm();

          document.getElementById("roast-output").style.display = "block";

          typeWriter(
            document.getElementById("roast-text"),
            data.roast,
            15
          );
        })
        .catch(() => alert("Invalid username"));
    } 
    else if (service === "github") {
      const username = document.querySelector("#github-input input").value;

      document.getElementById("roast-output").style.display = "block";
      document.getElementById("roast-text").textContent = "Roasting...";

      fetch(`${API_URL}/github/${username}?tone=${selectedTone}`)
      .then(res => res.json())
      .then(data => {
        const stats = data.data;

        const statsBox = document.getElementById("github-stats");
        if (statsBox) {
          statsBox.style.display = "block";
          document.getElementById("gh-followers").textContent = `Followers: ${stats.followers}`;
          document.getElementById("gh-repos").textContent = `Repos: ${stats.public_repos}`;
          document.getElementById("gh-stars").textContent = `Stars: ${stats.total_stars}`;
        }

        const avatar = document.getElementById("gh-avatar");
        if (avatar && stats.avatar) {
          avatar.src = stats.avatar;
          avatar.style.display = "block";
        }

        typeWriter(document.getElementById("roast-text"), data.roast);
      })
      .catch(() => {
        alert("Invalid GitHub username");
      });
    }
    else if (service === "valorant") {
      const input = document.querySelector("#valorant-input input").value;

      const parts = input.split("#");
      if (parts.length !== 2) {
        alert("Enter RiotID#Tag");
        return;
      }

      const name = parts[0];
      const tag = parts[1];

      document.getElementById("roast-output").style.display = "block";
      document.getElementById("roast-text").textContent = "Roasting...";

      fetch(`${API_URL}/valorant/${name}/${tag}?tone=${selectedTone}`)
        .then(async res => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          return data;
        })
        .then(data => {
          typeWriter(document.getElementById("roast-text"), data.roast);
        })
        .catch(err => {
          alert(err.message);
        });
    }
  });
});

function typeWriter(element, text) {
  element.textContent = "";
  let i = 0;

  function typing() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      let speed = i < 80 ? 30 : 50;
      setTimeout(typing, speed);
    }
  }
  typing();
}
