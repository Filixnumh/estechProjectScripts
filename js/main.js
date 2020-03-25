$(function () {
    var playerTrack = $("#player-track"), bgArtwork = $('#bg-artwork'), bgArtworkUrl, albumName = $('#album-name'), trackName = $('#track-name'), albumArt = $('#album-art'), sArea = $('#s-area'), seekBar = $('#seek-bar'), trackTime = $('#track-time'), insTime = $('#ins-time'), sHover = $('#s-hover'), playPauseButton = $("#play-pause-button"), i = playPauseButton.find('i'), tProgress = $('#current-time'), tTime = $('#track-length'), seekT, seekLoc, seekBarPos, cM, ctMinutes, ctSeconds, curMinutes, curSeconds, durMinutes, durSeconds, playProgress, bTime, nTime = 0, buffInterval = null, tFlag = false, albums = ['Hiyo', 'Vladimir Cauchemar', 'Vance Joy', 'Elderbrook', 'Anatu','Dan Croll'], trackNames = ['Hiyo - Dont Go', 'Aulos', 'Riptide', 'Sleepwalking', 'Bleach-(Til Kolare Remix)','From Nowhere (Baardsen Remix)'], albumArtworks = ['c_1', 'c_2', 'c_3', 'c_4', 'c_5','c_6'], trackUrl = ['(../../files/song1.mp3', '(../../files/song2.mp3', '(../../files/song3.mp3', '(../../files/song4.mp3', '(../../files/song5.mp3','(../../files/song6.mp3'], playPreviousTrackButton = $('#play-previous'), playNextTrackButton = $('#play-next'), currIndex = -1;

    for (var indexloop = 0; indexloop < albums.length; indexloop++) {
        var html =
            "<div class='col-md-6 col'>" +
            "<div class='card mb-3 text-white bg-dark' style='max-width: 540px;'>" +
            "<div class='row no-gutters'>" +
            "<div class='col-md-4'>" +
            "<div class='image-cropper'>" +
            "<img  src='img/" + albumArtworks[indexloop] + ".jpg' class='card-img hoveranimated' alt='...' style='max-width: 200px;'></div></div>" +
            "<div class='col-md-8'>" +
            "<div class='card-body'>" +
            "<h5 class='card-title'>" + trackNames[indexloop] + "</h5>" +
            "<p class='card-text'>" + albums[indexloop] + "</p>" +
            "<p class='card-text'><small class='text-muted'>Genero: 'instrumental'</small></p>" +
            "<div class='btn-dark draw-border startSong btn'>" +
            "<center><i class='fa fa-play'></i></center>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>";
        var htmlIMgFirst =
            "<img src='img/" + albumArtworks[indexloop] + ".jpg' class='active' id='c_1'>";
        $("#audio_rows").append(html);
        var htmlIMg =
            "<img src='img/" + albumArtworks[indexloop] + ".jpg'  id='" + albumArtworks[indexloop] + "'>";
        if (indexloop === 0) {
            $("#album-art").append(htmlIMgFirst);
        } else {
            $("#album-art").append(htmlIMg);
        }

    }
    function playPause() {
        setTimeout(function () {
            if (audio.paused) {
                playerTrack.addClass('active');
                albumArt.addClass('active');
                checkBuffering();
                i.attr('class', 'fa fa-pause');

                audio.play();
            }
            else {
                playerTrack.removeClass('active');
                albumArt.removeClass('active');
                clearInterval(buffInterval);
                albumArt.removeClass('buffering');
                i.attr('class', 'fa fa-play');
                audio.pause();
                $("#show_hide_music").hide(1000);
            }
        }, 300);
    }


    function showHover(event) {
        seekBarPos = sArea.offset();
        seekT = event.clientX - seekBarPos.left;
        seekLoc = audio.duration * (seekT / sArea.outerWidth());

        sHover.width(seekT);

        cM = seekLoc / 60;

        ctMinutes = Math.floor(cM);
        ctSeconds = Math.floor(seekLoc - ctMinutes * 60);

        if ((ctMinutes < 0) || (ctSeconds < 0))
            return;

        if ((ctMinutes < 0) || (ctSeconds < 0))
            return;

        if (ctMinutes < 10)
            ctMinutes = '0' + ctMinutes;
        if (ctSeconds < 10)
            ctSeconds = '0' + ctSeconds;

        if (isNaN(ctMinutes) || isNaN(ctSeconds))
            insTime.text('--:--');
        else
            insTime.text(ctMinutes + ':' + ctSeconds);

        insTime.css({ 'left': seekT, 'margin-left': '-21px' }).fadeIn(0);

    }

    function hideHover() {
        sHover.width(0);
        insTime.text('00:00').css({ 'left': '0px', 'margin-left': '0px' }).fadeOut(0);
    }

    function playFromClickedPos() {
        audio.currentTime = seekLoc;
        seekBar.width(seekT);
        hideHover();
    }

    function updateCurrTime() {
        nTime = new Date();
        nTime = nTime.getTime();

        if (!tFlag) {
            tFlag = true;
            trackTime.addClass('active');
        }

        curMinutes = Math.floor(audio.currentTime / 60);
        curSeconds = Math.floor(audio.currentTime - curMinutes * 60);

        durMinutes = Math.floor(audio.duration / 60);
        durSeconds = Math.floor(audio.duration - durMinutes * 60);

        playProgress = (audio.currentTime / audio.duration) * 100;

        if (curMinutes < 10)
            curMinutes = '0' + curMinutes;
        if (curSeconds < 10)
            curSeconds = '0' + curSeconds;

        if (durMinutes < 10)
            durMinutes = '0' + durMinutes;
        if (durSeconds < 10)
            durSeconds = '0' + durSeconds;

        if (isNaN(curMinutes) || isNaN(curSeconds))
            tProgress.text('00:00');
        else
            tProgress.text(curMinutes + ':' + curSeconds);

        if (isNaN(durMinutes) || isNaN(durSeconds))
            tTime.text('00:00');
        else
            tTime.text(durMinutes + ':' + durSeconds);

        if (isNaN(curMinutes) || isNaN(curSeconds) || isNaN(durMinutes) || isNaN(durSeconds))
            trackTime.removeClass('active');
        else
            trackTime.addClass('active');


        seekBar.width(playProgress + '%');

        if (playProgress == 100) {
            i.attr('class', 'fa fa-play');
            seekBar.width(0);
            tProgress.text('00:00');
            albumArt.removeClass('buffering').removeClass('active');
            clearInterval(buffInterval);
        }
    }

    function checkBuffering() {
        clearInterval(buffInterval);
        buffInterval = setInterval(function () {
            if ((nTime == 0) || (bTime - nTime) > 1000)
                albumArt.addClass('buffering');
            else
                albumArt.removeClass('buffering');

            bTime = new Date();
            bTime = bTime.getTime();

        }, 100);
    }

    function selectTrack(flag) {
        if (flag == 0 || flag == 1)
            ++currIndex;
        else
            --currIndex;

        if ((currIndex > -1) && (currIndex < albumArtworks.length)) {
            if (flag == 0)
                i.attr('class', 'fa fa-play');
            else {
                albumArt.removeClass('buffering');
                i.attr('class', 'fa fa-pause');
            }

            seekBar.width(0);
            trackTime.removeClass('active');
            tProgress.text('00:00');
            tTime.text('00:00');

            currAlbum = albums[currIndex];
            currTrackName = trackNames[currIndex];
            currArtwork = albumArtworks[currIndex];

            audio.src = trackUrl[currIndex];

            nTime = 0;
            bTime = new Date();
            bTime = bTime.getTime();

            if (flag != 0) {
                audio.play();
                playerTrack.addClass('active');
                albumArt.addClass('active');

                clearInterval(buffInterval);
                checkBuffering();
            }

            albumName.text(currAlbum);
            trackName.text(currTrackName);
            albumArt.find('img.active').removeClass('active');
            $('#' + currArtwork).addClass('active');

            bgArtworkUrl = $('#' + currArtwork).attr('src');

            bgArtwork.css({ 'background-image': 'url(' + bgArtworkUrl + ')' });
        }
        else {
            if (flag == 0 || flag == 1)
                --currIndex;
            else
                ++currIndex;
        }
    }
    function selectTrackatPos(flag, currIndex) {



        if ((currIndex > -1) && (currIndex < albumArtworks.length)) {
            if (flag == 0)
                i.attr('class', 'fa fa-play');
            else {
                albumArt.removeClass('buffering');
                i.attr('class', 'fa fa-pause');
            }

            seekBar.width(0);
            trackTime.removeClass('active');
            tProgress.text('00:00');
            tTime.text('00:00');

            currAlbum = albums[currIndex];
            currTrackName = trackNames[currIndex];
            currArtwork = albumArtworks[currIndex];

            audio.src = trackUrl[currIndex];

            nTime = 0;
            bTime = new Date();
            bTime = bTime.getTime();

            if (flag != 0) {
                audio.play();

                playerTrack.addClass('active');
                albumArt.addClass('active');

                clearInterval(buffInterval);
                checkBuffering();

            }

            albumName.text(currAlbum);
            trackName.text(currTrackName);
            albumArt.find('img.active').removeClass('active');
            $('#' + currArtwork).addClass('active');

            bgArtworkUrl = $('#' + currArtwork).attr('src');

            bgArtwork.css({ 'background-image': 'url(' + bgArtworkUrl + ')' });
            start(audio);
        }
        else {
            if (flag == 0 || flag == 1)
                --currIndex;
            else
                ++currIndex;
        }


    }

    function initPlayer() {
        audio = new Audio();
        audio.crossOrigin = "anonymous";
        selectTrack(0);

        audio.loop = false;

        playPauseButton.on('click', playPause);

        sArea.mousemove(function (event) { showHover(event); });

        sArea.mouseout(hideHover);

        sArea.on('click', playFromClickedPos);

        $(audio).on('timeupdate', updateCurrTime);

        playPreviousTrackButton.on('click', function () { selectTrack(-1); });
        playNextTrackButton.on('click', function () { selectTrack(1); });


        $('.startSong').click(function () {
            var index = $('.startSong').index(this);
            selectTrackatPos(1, index);
            //mostrar el app

            $("#show_hide_music").show(1000);

        });



    }
    $('.startSong').click(function () {


        $("#show_hide_music").show(1000);

    });

    function start(currentAudio) {

        var audio = currentAudio;

        var ctx = new AudioContext();
        var analyser = ctx.createAnalyser();
        var audioSrc = ctx.createMediaElementSource(audio);
        // se conecta MediaElementSource con el analyser 



        audioSrc.connect(analyser);

        analyser.connect(ctx.destination);

        // frequencyBinCount da el numero de valores
        var frequencyData = new Uint8Array(analyser.frequencyBinCount);

        // se implementa en el canvas

        var canvas = document.getElementById('canvas'),
            cwidth = canvas.width,
            cheight = canvas.height - 2,
            meterWidth = 10, //anchura entre barras
            gap = 2, //hueco entre barras
            capHeight = 2,
            capStyle = '#fff',
            meterNum = 800 / (10 + 2), //numero de barras
            capYPositionArray = []; // guarda la posicion anterior a la barra
        ctx = canvas.getContext('2d'),
            gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(1, '#fff12a');
        gradient.addColorStop(0.5, '#ff0');
        gradient.addColorStop(0, '#fff12a');
        // loop
        function renderFrame() {
            var array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            var step = Math.round(array.length / meterNum);
            ctx.clearRect(0, 0, cwidth, cheight);
            for (var i = 0; i < meterNum; i++) {
                var value = array[i * step];
                if (capYPositionArray.length < Math.round(meterNum)) {
                    capYPositionArray.push(value);
                };
                ctx.fillStyle = capStyle;
                //dibuja la pequeña barra de arriba en cada barra
                if (value < capYPositionArray[i]) {
                    ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
                } else {
                    ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
                    capYPositionArray[i] = value;
                };
                ctx.fillStyle = gradient; //color en gradiente
                ctx.fillRect(i * 12, cheight - value + capHeight, meterWidth, cheight);
            }
            requestAnimationFrame(renderFrame);
        }
        renderFrame();


    };
    initPlayer();
});