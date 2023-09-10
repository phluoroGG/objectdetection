const username = document.querySelector('.user');
const password = document.querySelector('.pass');
const login_register = document.querySelector('.btn_login');
localStorage.removeItem("token");

const data = {
    username: '',
    password: ''
}

username.addEventListener('change', (e) => data.username = e.target.value);
password.addEventListener('change', (e) => data.password = e.target.value);
data.username = username.value;
data.password = password.value;
login_register.addEventListener('click', async (e) => {
    e.preventDefault();
    if (data.username == '') {
        Swal.fire("Ошибка", "Введите логин!", "warning");
    } else if (data.password == '') {
        Swal.fire("Ошибка", "Введите пароль!", "warning");
    } else {
        await loginRequest();
    }
});

function loginRequest() {
    fetch("http://127.0.0.1:8000/api/token/", {
    method: "POST",
    headers: {
        'Content-type': 'application/json'
    },
    body: JSON.stringify(data)
    })
    .then((res) => {
        var status = res.status;
        if (status == '401') {
            Swal.fire("Ошибка", "Неверный логин или пароль! Проверьте корректность введённых данных", "error");
        } else if (status == '400') {
            Swal.fire("Ошибка", "Неверный запрос! Проверьте введённые данные", "error");
        } else if (status == '200') {
            return res.json();
        } else {
            Swal.fire("Ошибка", "Ошибка сервера!", "error");
        }
        return null;
    })
    .then((response) => {
        if (response != null) {
            console.log(response.access);
            window.localStorage.setItem('token', response.access);
            window.location.replace("http://127.0.0.1:5500/index.html");
        }
    })
    .catch(function (error) {
        console.log(error);
    });
}