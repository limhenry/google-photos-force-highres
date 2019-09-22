window.googlePhotosForceHighresBadge = true;

const resizeImage = () => {
    const badgeElement = document.querySelector('#google-photos-force-highres-badge');
    badgeElement.removeAttribute('active');
    if (document.title !== 'Photo - Google Photos') return;
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const imgWidth = img.getAttribute('width');
        const imgHeight = img.getAttribute('height');
        if (!img.getAttribute('aria-label') || !imgHeight) return;
        if (window.googlePhotosForceHighresBadge) {
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
        badgeElement.setAttribute('active', '');
    });
}

const toggleHighRes = () => {
    const badgeElement = document.querySelector('#google-photos-force-highres-badge');
    if (window.googlePhotosForceHighresBadge) {
        window.googlePhotosForceHighresBadge = false;
        badgeElement.innerHTML = 'Normal Res';
        resizeImage();
    }
    else {
        window.googlePhotosForceHighresBadge = true;
        badgeElement.innerHTML = 'High Res';
        resizeImage();
    }
}

const createBadge = () => {
    const badge = document.createElement('div');
    badge.id = 'google-photos-force-highres-badge';
    badge.innerHTML = 'High Res'
    badge.onclick = toggleHighRes;
    const style = document.createElement('style');
    style.innerHTML = `#google-photos-force-highres-badge{font-family:'Google Sans',Roboto,sans-serif;box-sizing:border-box;position:fixed;padding:12px;background-color:#212121;height:20px;border-radius:20px;z-index:999999;bottom:24px;left:24px;opacity:0;display:flex;justify-content:center;align-items:center;color:rgba(255,255,255,.7);font-size:12px;font-weight:600;transition:150ms opacity ease;cursor:pointer;user-select:none}#google-photos-force-highres-badge[active]{opacity:.45}#google-photos-force-highres-badge:hover{opacity:.95}`;
    document.head.appendChild(style);
    document.body.appendChild(badge);
};

createBadge();

chrome.runtime.onMessage.addListener((a, b, sendResponse) => {
    sendResponse();
    resizeImage();
});

window.addEventListener('resize', resizeImage);