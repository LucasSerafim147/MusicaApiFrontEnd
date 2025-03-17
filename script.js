document.addEventListener('DOMContentLoaded', () => {
    const musicList = document.getElementById('musicList');
    const musicForm = document.getElementById('musicForm');
    const cancelEditBtn = document.getElementById('cancelEdit');
    const searchInput = document.getElementById('searchInput');
    const formTitle = document.getElementById('formTitle');

    function loadMusics() {
        fetch('http://localhost:3001/api/musics') // Ajuste a porta aqui
            .then(response => response.json())
            .then(data => {
                musicList.innerHTML = '';
                data.forEach(music => renderMusic(music));
            })
            .catch(error => console.error('Erro ao carregar músicas:', error));
    }

    function renderMusic(music) {
        const musicItem = document.createElement('div');
        musicItem.className = 'music-item';
        musicItem.dataset.id = music.id;

        musicItem.innerHTML = `
            <img src="${music.cover}" class="music-cover" alt="Capa ${music.title}">
            <div class="music-info">
                <h3>${music.title}</h3>
                <p>Artista: ${music.artist}</p>
                <p>Duração: ${music.duration}</p>
            </div>
            <div class="actions">
                <button class="edit-btn"><i class="fas fa-edit"></i> Editar</button>
                <button class="delete-btn"><i class="fas fa-trash"></i> Excluir</button>
            </div>
        `;

        musicList.appendChild(musicItem);

        musicItem.querySelector('.edit-btn').addEventListener('click', () => editMusic(music));
        musicItem.querySelector('.delete-btn').addEventListener('click', () => deleteMusic(music.id));
    }

    musicForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('musicId').value;
        const musicData = {
            title: document.getElementById('title').value,
            artist: document.getElementById('artist').value,
            duration: document.getElementById('duration').value,
            cover: document.getElementById('cover').value
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `http://localhost:3001/api/musics/${id}` : 'http://localhost:3001/api/musics'; // Ajuste a porta aqui

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(musicData)
        })
            .then(response => {
                if (!response.ok) throw new Error('Erro ao salvar música');
                musicForm.reset();
                document.getElementById('musicId').value = '';
                formTitle.textContent = 'Adicionar Música';
                loadMusics();
            })
            .catch(error => console.error('Erro:', error));
    });

    function editMusic(music) {
        document.getElementById('musicId').value = music.id;
        document.getElementById('title').value = music.title;
        document.getElementById('artist').value = music.artist;
        document.getElementById('duration').value = music.duration;
        document.getElementById('cover').value = music.cover;
        formTitle.textContent = 'Editar Música';
    }

    cancelEditBtn.addEventListener('click', () => {
        musicForm.reset();
        document.getElementById('musicId').value = '';
        formTitle.textContent = 'Adicionar Música';
    });

    function deleteMusic(id) {
        if (confirm('Tem certeza que deseja excluir esta música?')) {
            fetch(`http://localhost:3001/api/musics/${id}`, { method: 'DELETE' }) // Ajuste a porta aqui
                .then(response => {
                    if (!response.ok) throw new Error('Erro ao excluir música');
                    loadMusics();
                })
                .catch(error => console.error('Erro:', error));
        }
    }

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const musicItems = document.querySelectorAll('.music-item');
        musicItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const artist = item.querySelector('.music-info p:first-child').textContent.toLowerCase().replace('artista: ', '');
            item.style.display = title.includes(searchTerm) || artist.includes(searchTerm) ? 'flex' : 'none';
        });
    });

    loadMusics();
});