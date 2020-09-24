let uploadBtnElement = document.querySelector('#uploadBtn');
let attachmentElement = document.querySelector('#attachment');
let taskPanelElement = document.querySelector('#taskPanel');
let taskBodyElement = document.querySelector('#taskBody');
let contentListElement = document.querySelector('#contentList');
let usernameElement = document.querySelector('#username');
let passwordElement = document.querySelector('#password');
let loginBtnElement = document.querySelector('#loginBtn');

const baseURL = axios.defaults.baseURL = '/api';
axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
getPhotos();

uploadBtnElement.onclick = function () {
    attachmentElement.click();
}

attachmentElement.onchange = async function () {
    //构造上传进度框内容
    let li = document.createElement('li');
    let span = document.createElement('span');
    span.innerHTML = attachmentElement.files[0].name;
    let div1 = document.createElement('div');
    div1.classList.add('task-progress-status');
    let div2 = document.createElement('div');
    div2.classList.add('progress');

    li.appendChild(span);
    li.appendChild(span);
    li.appendChild(div1);
    li.appendChild(div2);

    let fd = new FormData();
    fd.append('attachment', attachmentElement.files[0]);
    let { data } = await axios({
        method: 'post',
        url: '/upload',
        data: fd
    })
    // let xhr = new XMLHttpRequest();
    // xhr.open('post', '/api/upload', true);
    // xhr.upload.onloadstart = function () {
    //     taskPanelElement.style.display = 'block';
    //     div1.innerHTML = '准备上传……';
    //     taskBodyElement.appendChild(li);
    // }
    // // 与上传下载有关的数据（上传总大小，已经上传的大小）都可以通过事件对象来获取
    // xhr.upload.onprogress = function (e) {
    //     div1.innerHTML = '上传中……';
    //     div2.style.width = (e.loaded / e.total * 100).toFixed(2) + '%';
    // }
    // // 后端响应完成以后出发
    // xhr.onload = function () {
    //     div1.innerHTML = '上传完成';
    //     taskPanelElement.style.display = 'none';
    //     getPhotos();
    // }
    // // 通过正文发送数据，数据作为send方法的参数传入的
    // // xhr.setRequestHeader('');
    // // 如果通过 multipart/form-data 发送数据，数据必须得组织成 form-data 格式
    // // 我们可以借助一个对象来完成这个工作 FormData 对象
    // let fd = new FormData();
    // // fd.append('username', 'zmouse');
    // fd.append('photos', attachmentElement.files[0]);
    // xhr.send(fd);
}

async function getPhotos() {

    //原生ajax
    // let xhr = new XMLHttpRequest();
    // xhr.onload = function () {
    //     let response = JSON.parse(xhr.responseText);
    //     if (!response.code) {
    //         contentListElement.innerHTML = '';
    //         let data = response.data;
    //         data.forEach(d => {
    //             let imgElement = document.createElement('img');
    //             imgElement.src = `/api/static/upload/${d.filename}`;
    //             imgElement.innerHTML = d.id;
    //             contentListElement.appendChild(imgElement);
    //         });
    //     }
    // }
    // xhr.open('get', '/api/getPhotos', true);
    // xhr.send();

    //axios
    let { data } = await axios.get('/getPhotos');
    if (!data.code) {
        contentListElement.innerHTML = '';
        data.data.forEach(d => {
            let imgElement = document.createElement('img');
            imgElement.src = `${baseURL}/static/upload/${d.filename}`;
            imgElement.innerHTML = d.id;
            contentListElement.appendChild(imgElement);
        });
    }
}



//登陆
loginBtnElement.onclick = async function () {

    //原生ajax
    // let xhr = new XMLHttpRequest();
    // xhr.onload = function () {
    //     let response = JSON.parse(xhr.responseText);
    //     if (response.code) {
    //         alert(response.message);
    //     } else {
    //         alert('登陆成功');
    //     }
    // }
    // xhr.open('post', '/api/login', true);
    // let fd = new FormData();
    // fd.append('username', usernameElement.value);
    // fd.append('password', passwordElement.value);
    // xhr.send(fd);

    //axios
    // let { data } = await axios.post('/api/login', {
    //     username: usernameElement.value,
    //     password: passwordElement.value
    // });
    let { data, headers: { authorization } } = await axios({
        method: 'post',
        url: '/login',
        data: {
            username: usernameElement.value,
            password: passwordElement.value
        }
    });
    if (data.code) {
        alert(data.message);
    } else {
        localStorage.setItem('token', authorization);
    }
}

