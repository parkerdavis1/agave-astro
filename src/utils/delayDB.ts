export async function delayDB() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('go');
        }, 1000);
    });
}
