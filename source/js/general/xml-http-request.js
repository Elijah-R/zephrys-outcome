export default () => {
  const timeout = 3000;
  const httpStatusCodes = {
    200: [true],
    400: [false, 'Неверный запрос'],
    401: [false, 'Необходима авторизация'],
    403: [false, 'Доступ запрещен'],
    404: [false, 'Запрашиваемые данные не найдены'],
    500: [false, 'Внутренняя ошибка сервера'],
  };

  /* New XHR with predefined settings.
   * @param {Function} onLoad - callback function, invoked in case of successful request
   * @param {Function} onError - callback function, invoked in case of errors. */
  function createRequest(onLoad, onError) {
    const xhr = new XMLHttpRequest();

    function loadHandler() {
      if (httpStatusCodes[xhr.status] && httpStatusCodes[xhr.status][0]) {
        // no xhr.responseType = 'json' because of IE11
        onLoad(JSON.parse(xhr.responseText));
      } else if (!httpStatusCodes[xhr.status]) {
        onError(`(HTTP status code: ${xhr.status})`);
      } else {
        onError(httpStatusCodes[xhr.status][1]);
      }
    }

    xhr.addEventListener('load', loadHandler);

    xhr.addEventListener('error', () => {
      onError('xhr error');
    });
    xhr.addEventListener('timeout', () => {
      onError('xhr timeout');
    });
    return xhr;
  }

  /* Downloads data from the server */
  function load(onLoad, onError) {
    const xhr = createRequest(onLoad, onError);
    xhr.open('GET', window.utils.xhr.url);
    // timeout после open из-за IE11
    xhr.timeout = timeout;
    xhr.send();
  }

  // Sends data to the server.
  function save(data, onLoad, onError) {
    const xhr = createRequest(onLoad, onError);
    xhr.open('POST', window.utils.xhr.url);
    xhr.send(data);
  }

  window.utils = {
    xhr: {
      load,
      save,
      url: '',
    },
  };
};
