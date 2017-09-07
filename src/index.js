/* ДЗ 3 - работа с массивами и объеектами */

/*
 Задача 1:
 Напишите аналог встроенного метода forEach для работы с массивами
 */
function forEach(array, fn) {
    for (let i=0; i<array.length; i++) {
        fn(array[i], i, array);
    }
}

/*
 Задача 2:
 Напишите аналог встроенного метода map для работы с массивами
 */
function map(array, fn) {
    var newArray = [];

    for (let i=0; i<array.length; i++) {
        newArray[i] = fn(array[i], [i], array);
    }

    return newArray;
}

/*
 Задача 3:
 Напишите аналог встроенного метода reduce для работы с массивами
 */
function reduce(array, fn, initial) {
    var result = initial || array[0];

    if (result == array[0]) {
        for (let i = 1; i < (array.length); i++) {
            result = fn(result, array[i], i, array);    
        }
    } else if (result == initial) {
        for (let i = 0; i < (array.length); i++) {
            result = fn(result, array[i], i, array);    
        }
    } else {
        
        return result;
    }
        
    return result;
}

/*
 Задача 4:
 Функция принимает объект и имя свойства, которое необходиом удалить из объекта
 Функция должна удалить указанное свойство из указанного объекта
 */
function deleteProperty(obj, prop) {
    delete obj[prop];
}

/*
 Задача 5:
 Функция принимает объект и имя свойства и возвращает true или false
 Функция должна проверить существует ли укзаанное свойство в указанном объекте
 */
function hasProperty(obj, prop) {
    for (var k in obj) {
        if (obj.hasOwnProperty(prop)) {
            return true;
        }

        return false;
    }
}
// function hasProperty(obj, prop) {
//     for (var k in obj) {
//         if (k === prop) {
//             return true;
//         }

//         return false;
//     }
// }

/*
 Задача 6:
 Функция должна получить все перечисляемые свойства объекта и вернуть их в виде массива
 */
function getEnumProps(obj) {
    return Object.keys(obj);
}

/*
 Задача 7:
 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистра и вернуть в виде массива
 */
function upperProps(obj) {
    var keys = Object.keys(obj);

    for (let i=0; i<keys.length; i++) {
        keys[i] = keys[i].toUpperCase();
    }

    return keys;
}

/*
 Задача 8 *:
 Напишите аналог встроенного метода slice для работы с массивами
 */
function slice(array, from, to) {
    var newArray = [];
    var start = from || 0;
    var end = to || array.length;
       
    if ((typeof to) === 'undefined') {
        end = array.length;
    }
    if (to === 0) {
        end = 0;
    }
    if ((start < 0) && (-start < (array.length))) {
        start = array.length + start;
    } 
    if ((start < 0) && (-start > (array.length))) {
        start = 0;
    } 
    if (to < 0) {
        end = array.length + to;
    }
    if (-end > (array.length - start)) {
        return newArray;
    } 
    var size = end - start;

    if (end > array.length) {
        end = array.length;
        size = end - start;
    }
        
    if (size > 0) {
        for (let i = 0; i < size; i++) {
            newArray[i] = array[start + i];
        } 
    }
    
    return newArray;
}

/*
 Задача 9 *:
 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj) {
    var proxy = new Proxy(obj, { set(obj, prop, value) {
        obj[prop] = value*value;
        
        return true;
    }
    });

    return proxy;
}

export {
    forEach,
    map,
    reduce,
    deleteProperty,
    hasProperty,
    getEnumProps,
    upperProps,
    slice,
    createProxy
};
