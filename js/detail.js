window.renderDetail = renderDetail;

function renderDetail() {
    const mySection = document.querySelector('section');
    const data = history.state.data;
    mySection.innerHTML = `
        <div>
            <figure>
                <img src="${data.url}" alt="${data.alt}">
            </figure> 
            <div>
                <div>作者：${data.name}</div>
                <div>诗名：${data.alt}</div>
                <div>诗句：${data.credit}</div>
            </div>
            <div>
                <button class="push-message-button" onclick="xhr()">发送请求</button>
            </div>
            <div id="xhr-text"></div>  
        </div>`;
    const headerTitleDom = document.querySelector('.header-title');
    headerTitleDom.innerHTML = `<span onclick="back()"><img class="back-icon" src="../images/back.png"/></span>`;
}

function back() {
    router.go('/');
}

function xhr() {
    console.log(1234);

    const xhr = new XMLHttpRequest();
    const url = 'https://easy-mock.com/mock/5c84985753b6126d7bcc7f7b/service-worker/xhr-test';
    xhr.open('GET', url, true);
    xhr.onload = function() {
        // 请求结束后,在此处写处理代码
    };
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status === 200) {
                const xhrTextDom = document.getElementById('xhr-text');
                const response = JSON.parse(xhr.responseText);
                xhrTextDom.innerText = response.data;
            }
        }
    };
    xhr.send(null);
}
