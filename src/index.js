/* ДЗ 7.1 - BOM */

/**
 * Функция должна создавать окно с указанным именем и размерами
 *
 * @param {number} name - имя окна
 * @param {number} width - ширина окна
 * @param {number} height - высота окна
 * @return {Window}
 */
function createWindow(name, width, height) {
    var newWindow = window.open(`${name}, width=${width},height=${height}`);

    return newWindow;
}

/**
 * Функция должна закрывать указанное окно
 *
 * @param {Window} window - окно, размер которого надо изменить
 */
function closeWindow(window) {
    window.close(window);
}

/**
 * Функция должна создавать cookie с указанными именем и значением
 *
 * @param name - имя
 * @param value - значение
 */
function createCookie(name, value) {
    var date = new Date;

    date.setDate(date.getDate() + 1);
    date.toUTCString();
    document.cookie = `${name}=${value};expires= + ${date}`;
}

/**
 * Функция должна удалять cookie с указанным именем
 *
 * @param name - имя
 */
function deleteCookie(name) {
    var date = new Date;
    
    date.setDate(date.getDate() - 1);
    date.toUTCString();
    document.cookie = `${name}=;expires= + ${date}`;
}

export {
    createWindow,
    closeWindow,
    createCookie,
    deleteCookie
};
