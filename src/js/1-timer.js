// Описаний в документації
import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  seconds: document.querySelector('[data-seconds]'),
  minutes: document.querySelector('[data-minutes]'),
  hours: document.querySelector('[data-hours]'),
  days: document.querySelector('[data-days]'),
};

refs.startBtn.disabled = true;
let userSelectedDate = null;
let intervalId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < Date.now()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      refs.startBtn.disabled = true;
      userSelectedDate = null;
    } else {
      userSelectedDate = selectedDates[0];
      refs.startBtn.disabled = false;
    }
  },
};

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function updateTimerInterface({ days, hours, minutes, seconds }) {
  refs.days.textContent = pad(days);
  refs.hours.textContent = pad(hours);
  refs.minutes.textContent = pad(minutes);
  refs.seconds.textContent = pad(seconds);
}

const onClickStartBtn = () => {
  function updateTimer() {
    updateTimerInterface(convertMs(userSelectedDate - Date.now()));

    if (userSelectedDate - Date.now() <= 0) {
      clearInterval(intervalId);
      updateTimerInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      refs.input.disabled = false;
      iziToast.success({ message: 'TimeOut', position: 'topRight' });
    }
  }
  refs.startBtn.disabled = true;
  refs.input.disabled = true;
  updateTimer();
  intervalId = setInterval(updateTimer, 1000);
};
refs.startBtn.addEventListener('click', onClickStartBtn);
flatpickr(refs.input, options);
