var listAll = document.querySelector('.list-all');
var listSelect = document.querySelector('.list-select');

function api(method, params) {
    return new Promise((resolve, reject) => {
        VK.api(method, params, data => {
            if (data.error) {
                reject(new Error(data.error.error_msg));
            } else {
                resolve(data.response);
            }
        });
    });
}

const promise = new Promise((resolve, reject) => {
    VK.init({
        apiId: 6196199
    });

    VK.Auth.login(data => {
        if (data.session) {
            resolve(data);
        } else {
            reject(new Error('Не удалось авторизоваться'));
        }
    }, 16);
});

promise
    .then(() => {
        return api('users.get', { v: 5.68, name_case: 'gen' });
    })
    .then(data => {
        return api('friends.get', { v: 5.68, fields: 'first_name, last_name, photo_100' })
    })
    .then(data => {
        if (localStorage.all && localStorage.select) {
            var objAll = JSON.parse(localStorage.all);
            var objSel = JSON.parse(localStorage.select);

            for (let key in objAll) {
                let item = document.createElement('LI');               

                item.innerHTML = objAll[key];
                item.setAttribute('draggable', 'true');
                item.className = 'item';
                listAll.appendChild(item);
            }
            for (let key in objSel) {
                let item = document.createElement('LI');

                item.innerHTML = objSel[key];
                item.setAttribute('draggable', 'true');
                item.className = 'item-select';
                listSelect.appendChild(item);
            }
        } else {
            function addFriend() {
                for (let i=0; i<data.count; i++) {
                    let item = document.createElement('LI');
                    let friend = data.items[i];

                    item.className = 'item';
                    item.innerHTML = `<img class="item-photo" src=${friend.photo_100}><div class="item-text">${friend.first_name} ${friend.last_name}</div><div class="btn-plus">&#10133;</div>`;
                    item.setAttribute('draggable', 'true');
                    listAll.appendChild(item);
                }
            }

            return addFriend();
        }
    })
    .catch(function (e) {
        alert('Ошибка: ' + e.message);
    });    

listAll.addEventListener('click', function(e) {
    var target = e.target;
    var item = target.parentElement;
            
    if (!target.classList.contains('btn-plus')) {
        return;                
    }
    target.classList.remove('btn-plus');
    target.classList.add('btn-minus');
    //listAll.removeChild(item);
    listSelect.appendChild(item);
    item.classList.remove('item');
    item.classList.add('item-select');
})
listSelect.addEventListener('click', function(e) {
    var target = e.target;
    var item = target.parentElement;
            
    if (target.classList.contains('btn-minus')) {
        target.classList.remove('btn-minus');
        target.classList.add('btn-plus');
        //listSelect.removeChild(item);
        listAll.appendChild(item);
        item.classList.remove('item-select');
        item.classList.add('item');

    }
})
// DnD ////////////////////////////////////
listAll.addEventListener('dragstart', function(e) {
    if (!e.target.classList.contains('item')) {
        return;                
    }
    e.target.setAttribute('id', 'dnd');
    e.target.setAttribute('class', 'item-select');
    e.dataTransfer.effectAllowed='move';
    e.dataTransfer.setData('Text', e.target.id); 
                       
    return true;
})
listAll.addEventListener('dragover', function(e) {
    if (!e.target.classList.contains('item')) {
        return;                
    }
    e.preventDefault();
})
        
listSelect.addEventListener('dragover', function (e) {
    e.preventDefault();

    return false;
})
listSelect.addEventListener('drop', function (e) {
    var data = e.dataTransfer.getData('Text');
    var itemMoved = document.getElementById(data);

    if (e.target.parentElement.classList.contains('item-select')) {
        listSelect.appendChild(itemMoved);
        itemMoved.setAttribute('class', 'item-select');
        itemMoved.lastChild.classList.remove('btn-plus'); 
        itemMoved.lastChild.classList.add('btn-minus'); 
        return;                
    }
    e.target.appendChild(itemMoved);
    itemMoved.setAttribute('class', 'item-select');
    itemMoved.lastChild.classList.remove('btn-plus');
    itemMoved.lastChild.classList.add('btn-minus');
    e.stopPropagation();
    e.dataTransfer.dropEffect='move';
    return false;
})

//            LocalStorage                ////////////////////////////
var save = document.querySelector('#btn-save');

save.addEventListener('click', function() {
    var allSaved = document.querySelector('.list-all').children;
    var selectSaved = document.querySelector('.list-select').children;
    var obj1 = {};
    var obj2 = {};

    for (let i=0; i<allSaved.length; i++) {
        obj1[i] = allSaved[i].innerHTML;
    }
    for (let i=0; i<selectSaved.length; i++) {
        obj2[i] = selectSaved[i].innerHTML;
    }
    localStorage.all = JSON.stringify(obj1);
    localStorage.select = JSON.stringify(obj2);
})

// //              Filter             /////////////////////////////
var filterInput = document.querySelector('#filter');
var filterSelected = document.querySelector('#filter-selected');
var substring = '';
var name = [];
        
function isMatching(full, chunk) {
    full = full.toLowerCase();
    chunk = chunk.toLowerCase();
    if (full.indexOf(chunk) === 0) {
        return true;
    }

    return false;
}

function getFullName(ul) {
    for (let i=0; i<ul.length; i++) {
        name[i] = ul[i].textContent.split(' ');
    }

    return name;
}
var cListAll = document.createElement('UL');
var wrapper = document.querySelector('.wrapper');

wrapper.appendChild(cListAll);                   
cListAll.setAttribute('class', 'all');
cListAll.style.display = 'none';

function handlerAll(e) {
    var liAll = document.querySelectorAll('.item'); 
    var fullNameAll = getFullName(listAll.querySelectorAll('.item-text'));

    substring = e.target.value;
    
    for (let i=0; i<liAll.length; i++) {
        if (listAll.children[0]) {
        cListAll.appendChild(listAll.children[0]);
        }
    }
    for (let i=0; i<liAll.length; i++) {
        if (substring !== '') {
            
            if (isMatching(fullNameAll[i][0], substring) || isMatching(fullNameAll[i][1], substring)) {
                listAll.appendChild(liAll[i]);
            } 
        } else {
            listAll.appendChild(liAll[i]);
        } 
    }
}
var cListS = document.createElement('UL');

wrapper.appendChild(cListS);                   
cListS.setAttribute('class', 'select');
cListS.style.display = 'none';

function handlerSelect(e) {
    var liS = document.querySelectorAll('.item-select');     
    var fullNameS = getFullName(listSelect.querySelectorAll('.item-text'));  

    substring = e.target.value;
        
    for (let i=0; i<liS.length; i++) {
        if (listSelect.children[0]) {
            cListS.appendChild(listSelect.children[0]);
        }
    }
  
    for (let i=0; i<liS.length; i++) {
        if (substring !== '') {
            
            if (isMatching(fullNameS[i][0], substring) || isMatching(fullNameS[i][1], substring)) {
                listSelect.appendChild(liS[i]);     
            } 
        } else {
            listSelect.appendChild(liS[i]);
        } 
    }
}
filterInput.addEventListener('keyup', handlerAll);
filterSelected.addEventListener('keyup', handlerSelect);
