/* ДЗ 6.1 - Асинхронность и работа с сетью */

/**
 * Функция должна создавать Promise, который должен быть resolved через seconds секунду после создания
 *
 * @param {number} seconds - количество секунд, через которое Promise должен быть resolved
 * @return {Promise}
 */
function delayPromise(seconds) {
    return new Promise((resolve) => {        
        setTimeout(() => {
            resolve();
        }, seconds*1000);
    });
}

/**
 * Функция должна вернуть Promise, который должен быть разрешен массивом городов, загруженным из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * Элементы полученного массива должны быть отсортированы по имени города
 *
 * @return {Promise<Array<{name: String}>>}
 */
function loadAndSortTowns() {
    var promise = new Promise((resolve) => {
        var url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';
        var xhr = new XMLHttpRequest();

        xhr.open('GET', url);
        xhr.send();
        xhr.addEventListener('load', () => {
            resolve(xhr.response);
        });
    });

    return promise
        .then((response) => {
            var cities = JSON.parse(response);
                        
            return cities.sort(function(obj1, obj2) {
                if (obj1.name > obj2.name) return 1;
                if (obj1.name < obj2.name) return -1;
                return 0;
            });
        });
}

export {
    delayPromise,
    loadAndSortTowns
};


