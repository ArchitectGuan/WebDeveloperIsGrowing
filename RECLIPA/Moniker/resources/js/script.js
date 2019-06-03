'use strict';
window.onload = () => {
    //生成html
    const render = (data) => {
        let
            photoWithTitleTmp = _.template(document.getElementById('photo-with-title').innerHTML),
            photoWithDescTmp = _.template(document.getElementById('photo-with-desc').innerHTML),
            videoWithTitleTmp = _.template(document.getElementById('video-with-title').innerHTML),
            renderRes = [];

        for (let elem of data) {
            elem.type === 1 ?
                renderRes.push(photoWithTitleTmp(elem)) :
                elem.type === 2 ?
                    renderRes.push(videoWithTitleTmp(elem)) :
                    renderRes.push(photoWithDescTmp(elem));
        }
        return renderRes;
    };
    //填充数据
    const loadData = (data) => {
        data.push({
            type: 1,
            title: 'Green Top',
            src: './resources/img/1.jpg'
        });
        data.push({
            type: 1,
            title: 'Matteo Di Iorio',
            src: './resources/img/2.jpg'
        });
        data.push({
            type: 2,
            title: 'The Art',
            src: './resources/video/video4.mp4'
        });
        data.push({
            type: 2,
            title: 'The Volcano',
            src: './resources/video/video1.mp4'
        });
        data.push({
            type: 2,
            title: 'Me',
            src: './resources/video/video3.mp4'
        });
    };
    //下一个
    const next = (htmls) => {
        let main = document.getElementsByTagName('main')[0];
        if ((++n) === htmls.length) n = 0;
        main.innerHTML = htmls[n];
        // console.log(n);
    };
    //上一个
    const pre = (htmls) => {
        let main = document.getElementsByTagName('main')[0];
        if ((--n) === -1) n = htmls.length - 1;
        main.innerHTML = htmls[n];
    }



    let n = 0,
        data = [],
        renderRes;
    loadData(data);
    renderRes = render(data);
    document.getElementsByTagName('main')[0].innerHTML = renderRes[n];
    let timer = setInterval(pre, 5500, renderRes);
    document.addEventListener('click', (e) => {
        //我发现我很喜欢 下面这个写法
        e.clientX > (screen.width / 2) ? next(renderRes) : pre(renderRes);
        clearInterval(timer);
    });
    //使用JS更改光标样式
    document.addEventListener('mousemove', (e) => {
        let body = document.getElementsByTagName('body')[0];
        if (e.clientX > (window.innerWidth / 2)) {
            body.style.cursor = 'url(\'./vendors/img/arrow-right-white.svg\'),auto';
        } else {
            body.style.cursor = 'url(\'./vendors/img/arrow-left-white.svg\'),auto';
        }

    })

}