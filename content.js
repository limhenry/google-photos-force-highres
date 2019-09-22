let gPhotosHighRes = true;

const resizeImg = () => {
    const badge = document.querySelector('#gphotos-highres');
    badge.removeAttribute('active');
    if (!window.location.pathname.includes('/photo/')) return;
    const imgs = document.querySelectorAll('img');
    imgs.forEach(img => {
        const imgWidth = img.getAttribute('width');
        const imgHeight = img.getAttribute('height');
        if (!img.getAttribute('aria-label') || !imgHeight) return;
        if (gPhotosHighRes) {
            let highResUrl = img.getAttribute('src')
                .replace(`w${imgWidth}`, 'w9999')
                .replace(`h${imgHeight}`, 'h9999');
            img.setAttribute('src', highResUrl);
        }
        else {
            let normalResUrl = img.getAttribute('src')
                .replace(`w9999`, `w${imgWidth}`)
                .replace(`h9999`, `h${imgHeight}`);
            img.setAttribute('src', normalResUrl);
        }
        badge.setAttribute('active', '');
    });
}

const toggleHighRes = () => {
    const badge = document.querySelector('#gphotos-highres');
    if (gPhotosHighRes) {
        setValue(false);
        badge.innerHTML = 'Normal Res';
        resizeImg();
    }
    else {
        setValue(true);
        badge.innerHTML = 'High Res';
        resizeImg();
    }
}

const createBadge = () => {
    const badge = document.createElement('div');
    badge.id = 'gphotos-highres';
    badge.innerHTML = gPhotosHighRes ? 'High Res' : 'Normal Res';
    badge.onclick = toggleHighRes;
    const style = document.createElement('style');
    style.innerHTML = `#gphotos-highres{font-family:'Google Sans',Roboto,sans-serif;box-sizing:border-box;position:fixed;padding:12px;background-color:#212121;height:20px;border-radius:20px;z-index:999999;bottom:24px;left:24px;opacity:0;display:flex;justify-content:center;align-items:center;color:rgba(255,255,255,.7);font-size:12px;font-weight:600;transition:150ms opacity ease;cursor:pointer;user-select:none}#gphotos-highres[active]{opacity:.45}#gphotos-highres:hover{opacity:.95}`;
    document.head.appendChild(style);
    document.body.appendChild(badge);
};

const setValue = (value) => {
    chrome.storage.local.set({ "gphotos-highres": value });
    gPhotosHighRes = value;
}

chrome.storage.local.get('gphotos-highres', (result) => {
    if(!('gphotos-highres' in result)) setValue(true);
    else gPhotosHighRes = result['gphotos-highres'];
    createBadge();
    chrome.runtime.onMessage.addListener((a, b, s) => {
        s();
        resizeImg();
    });
    window.addEventListener('resize', resizeImg);
});