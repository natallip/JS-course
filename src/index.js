ymaps.ready(init);

function init() {
    var myPlacemark;
    var placemarks = [];
    var clusterer;
    var customItemContentLayout;
    var coords;
    var address;
    var name, place, text, now, options, blockReviews;
    var firstGeoObject;
    var time = [];
    var balloonLayout;
    var data;
    var index = 0;

    data = {
        type: 'FeatureCollection',
        features: []
    }
       
    var myMap = new ymaps.Map('map', {
        center: [55.753994, 37.622093],
        zoom: 11
    });
    
    ymaps.geolocation.get({
        provider: 'browser',
        mapStateAutoApply: true
    }).then(function (result) {
        myMap.geoObjects.add(result.geoObjects);
    });

    function openBalloon(e) {
        coords = e.get('coords');
        
        ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0).getAddressLine();
            address = document.querySelector('.place__title');
            address.innerHTML = firstGeoObject;
        });
       
    var myBalloon = myMap.balloon.open(coords, {
        contentHeader: '<div class="block">' +
            '<div class="block__place">' + 
            '<div class="place__title"></div>' +
            '<div class="place__close">&#10133;</div></div>',
        contentBody: '<div class="block__reviews"></div>',
        contentFooter: '<div class="review">' +
            '<div class="title">Ваш отзыв</div>' +
            '<input type="text" class="text" id="name" placeholder="Ваше'+'&ensp;'+'имя">' +
            '<input type="text" class="text" id="place" placeholder="Укажите'+'&ensp;'+'место">' +
            '<textarea name="review" id="text" class="textarea" placeholder="Поделитесь'+'&ensp;'+'впечатлениями"></textarea>'+
            '</div>' +
            '<div class="block__btn"><button class="add-comment">Добавить</button></div>' +
            '</div>'
        }, {
            closeButton: false
        });
    }
    
    myMap.events.add('click', function (e) {
        if (!myMap.balloon.isOpen(e)) {
            openBalloon(e); 
        }
        else {
            myMap.balloon.close();
        }
    });
    
    myMap.events.add('balloonopen', function (e) {    
        myMap.hint.close();
    });

    document.addEventListener('click', function(e) {
        if (!e.target.classList.contains('place__close')) {
            return;                
        }
        var balloon = document.querySelector('.ymaps-2-1-56-balloon__content');
        balloon.style.display = 'none'; 
    })

    function createPlacemark(coords) {
        return new ymaps.Placemark(coords, {
        }, {
            preset: 'islands#violetDotIconWithCaption'
        });
    }
                    
    function getAddress(coords) {   // Определяем адрес по координатам (обратное геокодирование).
        ymaps.geocode(coords).then(function (res) {
            firstGeoObject = res.geoObjects.get(0).getAddressLine();
                                                                           
            myPlacemark.properties     
                .set({   
                    balloonContentHeader: `<div class="hidden link">${firstGeoObject}</div>`,
                    balloonContentFooter: `<div class="block"> 
                    <div class="block__place"> 
                    <div class="place__title">${firstGeoObject}</div>
                    <div class="place__close">&#10133;</div></div>
                    <div class="block__reviews">${blockReviews.innerHTML}</div>` +
                    '<div class="review">' +
                    '<div class="title">Ваш отзыв</div>' +
                    '<input type="text" class="text" id="name" placeholder="Ваше'+'&ensp;'+'имя">' +
                    '<input type="text" class="text" id="place" placeholder="Укажите'+'&ensp;'+'место">' +
                    '<textarea name="review" id="text" class="textarea" placeholder="Поделитесь'+'&ensp;'+'впечатлениями"></textarea>'+
                    '</div>' +
                    '<div class="block__btn"><button class="add-comment">Добавить</button></div>' +
                    '</div>'
                });
           
        });
    }

    customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        '<div class=balloon_header>{{ properties.balloonContentHeader|raw }}</div>' +
        '<div class=balloon_body>{{ properties.balloonContentBody|raw }}</div>'
    );
               
    clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        geoObjectHideIconOnBalloonOpen: false, 
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonItemContentLayout: customItemContentLayout,
        clusterBalloonPanelMaxMapArea: 0,
        clusterBalloonContentLayoutWidth: 200,
        clusterBalloonContentLayoutHeight: 130,
        clusterBalloonPagerSize: 5,
        clusterHideIconOnBalloonOpen: false,
        preset: 'islands#violetClusterIcons',
        groupByCoordinates: false
    });

    function appendReview() {
        balloonLayout = document.querySelector('.ymaps-2-1-56-balloon__layout');
        blockReviews = document.querySelector('.block__reviews'); 
        name = document.querySelector('#name'); 
        place = document.querySelector('#place');
        text = document.querySelector('#text');
        now = new Date();
        options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };

        var review = document.createElement('DIV'); 
        var reviewInfo = document.createElement('DIV');
        var reviewText = document.createElement('DIV');
                
        review.setAttribute('class', 'review');
        reviewInfo.innerHTML = `<b>${name.value}</b>  ${place.value}  ${now.toLocaleString("ru", options)}`;
        reviewText.innerHTML = text.value;
        review.appendChild(reviewInfo);
        review.appendChild(reviewText);
        blockReviews.appendChild(review);
        time.push(now.toLocaleString('ru', options));
    }
        
    if (!localStorage.data) {
        data = {
            type: 'FeatureCollection',
            features: []
        }
        index = 0;
    } else {
        data = JSON.parse(localStorage.data);
        index =  Object.keys(data.features).length;
        
    }
    if (localStorage.data) {
        var dataForPlacemarks = JSON.parse(localStorage.data);
        var objectManager = new ymaps.ObjectManager({
            clusterize: true,
            clusterDisableClickZoom: true,
            geoObjectHideIconOnBalloonOpen: false, 
            clusterOpenBalloonOnClick: true,
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            clusterBalloonItemContentLayout: customItemContentLayout,
            clusterBalloonPanelMaxMapArea: 0,
            clusterBalloonContentLayoutWidth: 200,
            clusterBalloonContentLayoutHeight: 130,
            clusterBalloonPagerSize: 5,
            clusterHideIconOnBalloonOpen: false,
            preset: 'islands#violetClusterIcons',
            groupByCoordinates: false
        });

        objectManager.objects.options.set('preset', 'islands#violetDotIcon');
        objectManager.add(dataForPlacemarks);
        myMap.geoObjects.add(objectManager);
    }
    document.addEventListener('click', function(e) {
        if (!e.target.classList.contains('link')) {
            return;                
        }
        
    })

    //   ////////////
     
    document.addEventListener('click', function(e) {
        if (!e.target.classList.contains('add-comment')) {
            return;                
        }
        appendReview();
        myPlacemark = createPlacemark(coords);
        getAddress(coords);
        myPlacemark.properties      
           .set({   
               balloonContentBody: `<div class="hidden">${place.value}<br>${text.value}<br>${now.toLocaleString('ru', options)}</div>`
           });
       
        data.features[index] = {
            type: 'Feature',
            id: index, 
            geometry: 
                { type: 'Point', coordinates: coords },
            properties: myPlacemark.properties._data
        }   
        index++;

             
        placemarks.push(myPlacemark);
                   
        localStorage.data = JSON.stringify(data);
        //console.log(data);

        myPlacemark.events.add('balloonopen', function (e) {
            coords = e.originalEvent.currentTarget.geometry._coordinates;

            return function getAddress(coords) {
                ymaps.geocode(coords).then(function (res) {
                    return firstGeoObject = res.geoObjects.get(0).getAddressLine();
                });
            }
        })

        clusterer.add(placemarks); 
        //console.log(placemarks); 

        

        myMap.geoObjects.add(clusterer);
        
        name.value = '';
        place.value = '';
        text.value = '';
    })  
    console.log(data);
}

// https://tech.yandex.ru/maps/jsbox/2.1/cluster_balloon_carousel
// https://tech.yandex.ru/maps/jsbox/2.1/clusterer_create
// https://tech.yandex.ru/maps/jsbox/2.1/object_manager_balloon
// https://tech.yandex.ru/maps/jsbox/2.1/object_manager
// https://tech.yandex.ru/maps/jsbox/2.1/object_manager_events
// https://tech.yandex.ru/maps/jsbox/2.1/object_manager_balloon




