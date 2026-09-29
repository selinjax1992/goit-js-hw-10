// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  promiseForm: document.querySelector('.form'),
};

const onPromiseFormSubmit = event => {
  event.preventDefault();
  const userDelayPromise = new Promise((resolve, reject) => {
    const isSuccess = refs.promiseForm.elements.state.value === 'fulfilled';
    const delay = Number(refs.promiseForm.elements.delay.value);
    setTimeout(() => {
      if (isSuccess) {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
  userDelayPromise
    .then(delay => {
      iziToast.success({ message: `✅ Fulfilled promise in ${delay}ms` });
    })
    .catch(delay => {
      iziToast.error({ message: `❌ Rejected promise in ${delay}ms` });
    });
  refs.promiseForm.reset();
};

refs.promiseForm.addEventListener('submit', onPromiseFormSubmit);
