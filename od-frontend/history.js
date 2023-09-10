if (localStorage.getItem('token')) {
    document.getElementById("login_nav").textContent = "Выйти";
}

if (localStorage.getItem('token') == null) {
        Swal.fire("Недоступно", "Не авторизован!", "warning")
        .then((result) => {
            if (result.isConfirmed) {
                window.location.replace("https://objectdetection-phluorogg.cloud.okteto.net:5500/login.html");
            }
        });
    } else {
    historyRequest(0);
}

function historyRequest(page) {
    fetch(`https://objectdetection-phluorogg.cloud.okteto.net:8000/history`, {
    method: "POST",
    headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
        page: page
    })
    })
    .then((res) => {
        var status = res.status;
        if (status == '401') {
            Swal.fire("Ошибка", "Ошибка авторизации!", "error")
            .then((result) => {
                if (result.isConfirmed) {
                    window.location.replace("https://objectdetection-phluorogg.cloud.okteto.net:5500/login.html");
                }
            });
        } else if (status == '400') {
            return null;
        } else if (status == '200') {
            return res.blob();
        } else {
            Swal.fire("Ошибка", "Ошибка сервера!", "error");
        }
        return null;
    })
    .then((image) => {
        if (image != null) {
            addImage(URL.createObjectURL(image));
            historyRequest(page + 1);
        } else {
            addWatching();
        }
    })
    .catch(function (error) {
        console.log(error);
    });
}

function addImage(src) {
    console.log(src);
    let divImage = document.createElement('div')
    divImage.className = 'img';
    divImage.innerHTML = `<img src="${src}">`;
    document.querySelector('.img-container').appendChild(divImage);
}

function addWatching() {
    document.querySelectorAll('.img-container img').forEach(img =>{
        img.onclick = () => {
            document.querySelector('.pop-up').style.display = 'block';
            document.querySelector('.pop-up img').src = img.getAttribute('src');
        }
    });

    document.querySelector('.pop-up span').onclick = () => {
        document.querySelector('.pop-up').style.display = 'none'; 
    }
}