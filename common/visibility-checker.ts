export default function checkVisibility(target: any) {
    const targetPosition = {
        top: window.pageYOffset + target.getBoundingClientRect().top,
        bottom: window.pageYOffset + target.getBoundingClientRect().bottom
    };

    const windowPosition = {
        top: window.pageYOffset,
        bottom: window.pageYOffset + document.documentElement.clientHeight
    };

    return targetPosition.bottom > windowPosition.top && targetPosition.top < windowPosition.bottom;
}
