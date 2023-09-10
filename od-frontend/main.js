if (localStorage.getItem('token')) {
    document.getElementById("login_nav").textContent = "Выйти";
}

let photo = document.getElementById("preview");
let result = document.getElementById("result");
var formData = null;


function load(input) {
    let file = input.files[0];
    console.log(file);
    formData = new FormData;
    formData.append('image', file);

    console.log(formData);
    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function () {
        photo.src = reader.result;
    }
}

function highlightDropZone(event) {
    event.preventDefault();
    this.classList.add('drop');
}

function unHighlightDropZone(event) {
    event.preventDefault();
    this.classList.remove('drop');
}

const dropFile = document.getElementsByClassName('photo-field');

if (dropFile && dropFile.length) {
    const dropField = dropFile[0];
    dropField.addEventListener('dragover', highlightDropZone);
    dropField.addEventListener('dragenter', highlightDropZone);
    dropField.addEventListener('dragleave', unHighlightDropZone);
    dropField.addEventListener('drop', (event) => {
        const dt = event.dataTransfer;
        load(dt);
        unHighlightDropZone.call(dropField, event);
    });
}

const max_count_field = document.querySelector('.max_count');
const color_field = document.querySelector('.color');
const accuracy_field = document.querySelector('.accuracy');
const button_detect = document.querySelector('.btn_detect');

var max_count = max_count_field.value;
var accuracy = accuracy_field.value;
var color = color_field.value.slice(1);

max_count_field.addEventListener('change', (e) => max_count = e.target.value);
accuracy_field.addEventListener('change', (e) => accuracy = e.target.value);
color_field.addEventListener('change', (e) => color = e.target.value.slice(1));

button_detect.addEventListener('click', async (e) => {
    e.preventDefault();
    if (formData == null) {
        Swal.fire("Ошибка", "Загрузите изображение!", "warning");
    } else {
        await detectRequest();
    }
});

function detectRequest() {
    var config = {};
    if(localStorage.getItem('token')){
        config = {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }
    fetch(`https://objectdetection-back-phluorogg.cloud.okteto.net/detect?score_threshold=${accuracy}&max_results=${max_count}&color=${color}`, {
    method: "POST",
    body: formData,
    headers: config
    })
    .then((res) => {
        var status = res.status;
        if (status == '401') {
            Swal.fire("Ошибка", "Ошибка авторизации!", "error")
            .then((result) => {
                if (result.isConfirmed) {
                    window.location.replace("https://objectdetection-phluorogg.cloud.okteto.net/login.html");
                }
            });
        } else if (status == '400') {
            Swal.fire("Ошибка", "Неверный запрос! Проверьте введённые данные", "error");
        } else if (status == '200') {
            return res.blob();
        } else {
            Swal.fire("Ошибка", "Ошибка сервера!", "error");
        }
        return null;
    })
    .then((image) => {
        if (image != null) {
            result.src = URL.createObjectURL(image);
        }
    })
    .catch(function (error) {
        console.log(error);
    });
}