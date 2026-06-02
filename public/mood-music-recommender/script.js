
function showSongs(mood){

    const songsDiv = document.getElementById("songs");

    let songs = musicData[mood];

    let html = `<h2>${mood} Songs</h2>`;

    songs.forEach(song=>{
        html += `
        <p>
            <strong>${song.title}</strong>
            - ${song.artist}
        </p>`;
    });

    songsDiv.innerHTML = html;
}