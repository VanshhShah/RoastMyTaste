const toggle = document.getElementById('tone-toggle');
const menu = document.getElementById('tone-menu');
const items = document.querySelectorAll('.dropdown-item');

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
    toggle.textContent = event.target.textContent;
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

  });
});
