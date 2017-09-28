/**
 * ДЗ 6.2 - Создать страницу с текстовым полем для фильтрации городов
 *
 * Страница должна предварительно загрузить список городов из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * и отсортировать в алфавитном порядке.
 *
 * При вводе в текстовое поле, под ним должен появляться список тех городов,
 * в названии которых, хотя бы частично, есть введенное значение.
 * Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.
 *
 * Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 * После окончания загрузки городов, надпись исчезает и появляется текстовое поле.
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 *
 * *** Часть со звездочкой ***
 * Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 * то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 * При клике на кнопку, процесс загруки повторяется заново
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
import { loadAndSortTowns } from '../src/index';
let homeworkContainer = document.querySelector('#homework-container');

/**
 * Функция должна загружать список городов из https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * И возвращать Promise, которой должен разрешиться массивом загруженных городов
 *
 * @return {Promise<Array<{name: string}>>}
 */

function loadTowns() {
    return loadAndSortTowns();
}
/**
 * Функция должна проверять встречается ли подстрока chunk в строке full
 * Проверка должна происходить без учета регистра символов
 *
 * @example
 * isMatching('Moscow', 'moscow') // true
 * isMatching('Moscow', 'mosc') // true
 * isMatching('Moscow', 'cow') // true
 * isMatching('Moscow', 'SCO') // true
 * isMatching('Moscow', 'Moscov') // false
 *
 * @return {boolean}
 */
function isMatching(full, chunk) {
    full = full.toLowerCase();
    chunk = chunk.toLowerCase();

    if (full.indexOf(chunk) !== -1) {
        return true;
    }

    return false;
}

let filterBlock = homeworkContainer.querySelector('#filter-block');
let filterInput = homeworkContainer.querySelector('#filter-input');
let filterResult = homeworkContainer.querySelector('#filter-result');
var btn = document.createElement('BUTTON');

btn.setAttribute('id', 'button');
let substring = '';
var result = [];

function SortTowns() {
    var townsPromise = new Promise((resolve) => {        
        var url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';
        var xhr = new XMLHttpRequest();

        xhr.open('GET', url);
        xhr.send();
        xhr.addEventListener('load', () => {
            var loadingBlock = homeworkContainer.querySelector('#loading-block');
                
            loadingBlock.innerHTML = 'Загрузка...'; 
            if (xhr.status<400) {
                loadingBlock.style.display = 'none';
                resolve(xhr.response);
            } else {
                loadingBlock.innerHTML = 'Не удалось загрузить города'; 
                homeworkContainer.appendChild(btn); 
                btn.setAttribute('value', 'Повторить');
                btn.addEventListener('click', () => {
                    btn.style.display = 'none';
                    SortTowns();  
                })
            }
        });
    });
    townsPromise
        .then((response) => {
            var cities = JSON.parse(response);
            var arr= [];

            for (let i=0; i<cities.length; i++) {
                arr[i] = cities[i].name;
            }
            result = arr.sort(function(obj1, obj2) {
                if (obj1 > obj2) return 1;
                if (obj1 < obj2) return -1;
                return 0;
            });

            return result;
        })
}    

SortTowns();

filterInput.addEventListener('keyup', function() {
    substring = filterInput.value;
   
    filterResult.innerHTML = '';
    if (substring !== '') {
        for (let i=0; i<result.length; i++) {
            
            if (isMatching(result[i], substring)) {
                let element = document.createElement('DIV');
    
                element.innerHTML = result[i];
                filterResult.appendChild(element);
            } 
        }
    }
});

export {
    loadTowns,
    isMatching
};