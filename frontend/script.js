const toggle = document.getElementById('tone-toggle');
const menu = document.getElementById('tone-menu');
const items = document.querySelectorAll('.dropdown-item');
let selectedTone = "Roast"; // default

const closeMenu = () => {
  menu.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
};

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
  button.addEventListener('click', () => {
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
  button.addEventListener('click', () => {
    const service = button.dataset.service;

    if (service === "spotify") {
      window.location.href = "http://localhost:5000/login";
    }
    else if (service === "chess") {
      const username = document.querySelector("#chess-input input").value;

      document.getElementById("roast-text").textContent = "Roasting...";
      document.getElementById("roast-output").style.display = "block";

      fetch(`http://localhost:5000/chess/${username}?tone=${selectedTone}`)
        .then(res => res.json())
        .then(data => {
          document.getElementById("roast-output").style.display = "block";
          typeWriter(document.getElementById("roast-text"), data.roast, 15);
        })
        .catch(() => alert("Invalid username"));
    } 
    else if (service === "github") {
  const username = document.querySelector("#github-input input").value;

  // show loading
  document.getElementById("roast-output").style.display = "block";
  document.getElementById("roast-text").textContent = "Roasting...";

  fetch(`http://localhost:5000/github/${username}?tone=${selectedTone}`)
    .then(res => res.json())
    .then(data => {

      const stats = data.data;

      // ✅ Show GitHub stats
      const statsBox = document.getElementById("github-stats");
      if (statsBox) {
        statsBox.style.display = "block";

        document.getElementById("gh-followers").textContent =
          `Followers: ${stats.followers}`;

        document.getElementById("gh-repos").textContent =
          `Repos: ${stats.public_repos}`;

        document.getElementById("gh-stars").textContent =
          `Stars: ${stats.total_stars}`;
      }

      // ✅ Show avatar if exists
      const avatar = document.getElementById("gh-avatar");
      if (avatar && stats.avatar) {
        avatar.src = stats.avatar;
        avatar.style.display = "block";
      }

      // ✅ Typewriter roast
      typeWriter(document.getElementById("roast-text"), data.roast);

    })
    .catch(() => {
      alert("Invalid GitHub username");
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
