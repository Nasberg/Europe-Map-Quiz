$(document).ready(() => {
  async function randomList() {
    let names;
    await $.get('/get-countries', (data) => {
      names = data.map(item => {
        return item.name;
      });

      for (let i = names.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = names[i]
        names[i] = names[j]
        names[j] = temp
      }
    });
    return names;
  }



  const progressHub = $('.progressHub');

  async function runGame() {
    const player = $('#playerName').val();
    const progress = $('#progress');
    const time = $('#time');
    const country = $('#country');
    const lives = $('#lives');

    progress.text('0 / 40');
    time.text('0:00');
    lives.text('O O O');
    progressHub.css('display', 'block');

    let doneCountries = 0;
    let mins = 0;
    let secs = 0;

    const startTime = setInterval(() => {
      secs++;

      if (secs == 60) {
        mins++;
        secs = 0;
      }

      if (secs < 10) {
        secs = `0${secs}`;
      }
      time.text(`${mins}:${secs}`);
    }, 1000);

    const randomNames = await randomList();

    country.text(randomNames[0]);

    $('path').on('click', (e) => {
      if (e.target.getAttribute('name') == randomNames[0]) {
        e.target.style.fill = '#3CFF31';
        doneCountries++;
        randomNames.shift();
        progress.text(`${doneCountries} / 40`);
        country.text(randomNames[0]);

        if (doneCountries == 40) {
          clearInterval(startTime);

          $.ajax({
            url: '/add-player',
            type: 'POST',
            data: {
              name: player,
              time: `${mins}:${secs}`
            },
            success: (data) => {
              $('#gameEndedModal').css('background-color', '#3CFF31');
              $('#winStatus').text('Congratulations! You won!');
              $('#winStatus').append(`
                <h5 class="py-2">Your time: ${mins}:${secs}</h5>
              `);
              $('#gameEndedModal').modal();
            }
          });
        }
      }
      else if (randomNames.includes(e.target.getAttribute('name'))) {
        switch (lives.text()) {
          case 'O O O':
            lives.text('X O O');
            break;
          case 'X O O':
            lives.text('X X O');
            break;
          case 'X X O':
            lives.text('X X X');
            clearInterval(startTime);
            $('#gameEndedModal').css('background-color', '#FF3136');
            $('#winStatus').text('You lost!');
            $('#gameEndedModal').modal();
            break;
        }

        e.target.style.fill = '#FF3136';
        setTimeout(() => {
          e.target.style.fill = '#00FFCD';
        }, 800);
      }
    });
  }

  // MODAL SELECTORS
  const welcomeModal = $('#welcomeModal');
  const highscoreModal = $('#highscoreModal');
  const startGameModal = $('#startGameModal');
  const gameEndedModal = $('#gameEndedModal');

  // WELCOME MODAL CONTROLS
  $('#highscoreModalBtn').on('click', () => {
    $.get('/get-highscores', (highscores) => {
      const body = highscoreModal.find('.modal-body');
      let secScores = [];

      body.empty();

      highscores.forEach((item, i) => {
        let timeSpl = item.time.split(':');
        let secs = parseInt(timeSpl[0]) * 60 + parseInt(timeSpl[1]);

        secScores.push({
          name: item.name,
          time: item.time,
          secs: secs
        });
      });

      secScores.sort((a, b) => {
        return a.secs - b.secs;
      });

      for (let i = 0; i < 5; i++) {
        body.append(`
          <div class="row my-2">
            <div class="col-1">
              <h5>${i+1}.</h5>
            </div>
            <div class="col-8">
              <h5>${secScores[i].name}</h5>
            </div>
            <div class="col-3">
              <h5>${secScores[i].time}</h5>
            </div>
          </div>
        `);
      }


      welcomeModal.modal('hide');
      highscoreModal.modal();
    });
  });

  $('#startGameModalBtn').on('click', () => {
    welcomeModal.modal('hide');
    startGameModal.modal();
  });


  // HIGHSCORE MODAL CONTROLS
  $('#leaveHighscoreBtn').on('click', () => {
    highscoreModal.modal('hide');
    welcomeModal.modal();
  });


  // START GAME MODAL CONTROLS
  startGameModal.on('shown.bs.modal', () => {
    $('#playerName').focus();
  });

  $('#leaveStartGameBtn').on('click', () => {
    startGameModal.modal('hide');
    welcomeModal.modal();
  });

  $('#countdownModal').on('shown.bs.modal', () => {
    let count = 3;

    const countdown = setInterval(() => {
      if (count > 0) {
        $('#countdown').text(count);
        count--;
      }
      else {
        clearInterval(countdown);
        $('#countdownModal').modal('hide');
        runGame();

      }
    }, 1000);
  });

  $('#startGameBtn').on('click', () => {
    if ($('#playerName').val() != '') {
      $('#startGameModal').modal('hide');
      $('#countdownModal').modal();
    }
  });


  // GAME ENDED MODAL CONTROLS
  $('#leaveNewGameBtn').on('click', () => {
    location.reload()
  });



  welcomeModal.modal();
});
