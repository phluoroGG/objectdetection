const username = document.querySelector('.user');
const password = document.querySelector('.pass');
const button_register = document.querySelector('.btn_register');
const data = {
    username: '',
    password: ''
}


username.addEventListener('change', (e) => data.username = e.target.value);
password.addEventListener('change', (e) => data.password = e.target.value);

data.username = username.value;
data.password = password.value;

button_register.addEventListener('click', async (e) => {
    e.preventDefault();
    if (data.username == '') {
        Swal.fire("Ошибка", "Введите логин!", "warning");
    } else if (data.password == '') {
        Swal.fire("Ошибка", "Введите пароль!", "warning");
    } else {
        await registrationRequest();
    }
});

function registrationRequest() {
    return fetch("https://objectdetection-back-phluorogg.cloud.okteto.net/register", {
    method: "POST",
    headers: {
        'Content-type': 'application/json'
    },
    body: JSON.stringify(data)
})
.then((res) => res.status)
.then((status) => {
    if (status == '400') {
        Swal.fire("Ошибка", "Логин уже используется!", "error");
    } else if (status == '200') {
        Swal.fire("Успех", "Регистрация выполнена!", "success")
        .then((result) => {
            if (result.isConfirmed) {
                window.location.replace("https://objectdetection-phluorogg.cloud.okteto.net/login.html");
            }
        });
        
    } else {
        Swal.fire("Ошибка", "Ошибка сервера!", "error");
    }
})
.catch(function (error) {
    console.log(error);
});
 }