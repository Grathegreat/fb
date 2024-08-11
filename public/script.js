document.getElementById('login-btn').addEventListener('click', () => {
    const appstate = document.getElementById('appstate').value;
    if (appstate) {
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ appstate })
        }).then(response => response.json())
          .then(data => {
              logToConsole(data.message);
              if (data.success) {
                  document.getElementById('start-btn').disabled = false;
              }
          });
    } else {
        logToConsole('Appstate is required to log in.');
    }
});

document.getElementById('start-btn').addEventListener('click', () => {
    logToConsole('Starting automation...');
    fetch('/start-automation').then(response => response.json())
                              .then(data => logToConsole(data.message));
});

function logToConsole(message) {
    const consoleBox = document.getElementById('console');
    const newLog = document.createElement('p');
    newLog.textContent = message;
    consoleBox.appendChild(newLog);
    consoleBox.scrollTop = consoleBox.scrollHeight;
}