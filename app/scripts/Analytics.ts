function createAnalytics(): object {
    let counter = 0;
    let isActive: boolean = true;

    const listener = (): number => {
        return counter++;
    }

    document.addEventListener('click', listener);

    return {
        destroy() {
            document.removeEventListener('click', listener);
            isActive = false;
        },

        getClicks() {
            if (!isActive) {
                return `Analytics is destroyed. Total clicks = ${counter}`
            }
            return counter;
        }
    }
}

window['analytics'] = createAnalytics();