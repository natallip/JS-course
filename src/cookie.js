/**
 * ДЗ 7.2 - Создать редактор cookie с возможностью фильтрации
 *
 * На странице должна быть таблица со списком имеющихся cookie:
 * - имя
 * - значение
 * - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)
 *
 * На странице должна быть форма для добавления новой cookie:
 * - имя
 * - значение
 * - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)
 *
 * Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено
 *
 * На странице должно быть текстовое поле для фильтрации cookie
 * В таблице должны быть только те cookie, в имени или значении которых есть введенное значение
 * Если в поле фильтра пусто, то должны выводиться все доступные cookie
 * Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 * Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 * то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена
 *
 * Для более подробной информации можно изучить код тестов
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */

let homeworkContainer = document.querySelector('#homework-container');
let filterNameInput = homeworkContainer.querySelector('#filter-name-input');
let addNameInput = homeworkContainer.querySelector('#add-name-input');
let addValueInput = homeworkContainer.querySelector('#add-value-input');
let addButton = homeworkContainer.querySelector('#add-button');
let listTable = homeworkContainer.querySelector('#list-table tbody');

function getCookie() {
    var obj = {};

    document.cookie.split('; ').map(function (cookie) {
        cookie.split('=').reduce(function (name, value) {
            obj[name] = value;
        });
    });

    return obj;
}

function isMatching(full, chunk) {
    full = full.toLowerCase();
    chunk = chunk.toLowerCase();

    if (full.indexOf(chunk) !== -1) {
        return true;
    }

    return false;
}

function addCookieInTable(name, value) {
    var tr = document.createElement('tr');
    var td = `<td>${name}</td><td>${value}</td><td><button data-delete=${name}>удалить</button></td>`;

    tr.innerHTML = td;
    listTable.appendChild(tr);
}

filterNameInput.addEventListener('keyup', function() {
    listTable.innerHTML = '';
    var substring = filterNameInput.value;
    var cookie = getCookie();

    for (var key in cookie) {
        if (cookie.hasOwnProperty(key)) {
            if (substring !== '') {
                if (isMatching(key, substring) || isMatching(cookie[key], substring)) {
                    addCookieInTable(key, cookie[key]);
                }
            } else {
                addCookieInTable(key, cookie[key]);
            }
        }
    }
});

addButton.addEventListener('click', () => {
    var name = addNameInput.value;
    var value = addValueInput.value;
    var filter = filterNameInput.value;

    if (addNameInput.value !== '' && addValueInput.value !== '') {

        [].forEach.call(listTable.children, function(tr) {
            var name = tr.children[0].textContent;
            var value = tr.children[1].textContent;

            if (addNameInput.value === name || addValueInput.value === value) {
                listTable.removeChild(tr);
            }
        });

        document.cookie = `${name}=${value}`;

        if (isMatching(name, filter) || isMatching(value, filter)) {
            addCookieInTable(name, value);
        }
    }
});

listTable.addEventListener('click', function (e) {
    var target = e.target;
    
    if (target.dataset.delete) {
        var td = target.parentNode;
        var tr = td.parentNode;

        listTable.removeChild(tr);
        document.cookie = `${tr.children[0].textContent}=${tr.children[1].textContent}; path=/; expires=${new Date(0)}`;
    }
});