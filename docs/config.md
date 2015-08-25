# Конфигурационный файл

Конфигурационный файл конструктора приложений делится на две составляющие: `app` - для хранения конфигурации приложения (настройки интерфейса, виджетов, и прочие статичные параметры) и `state` - для хранения состояния карты (положение, активные слои, текущая дата т.е. те параметы, которые могут изменяться пользователем).

Корень конфига выглядит следующим образом:

```javascript
{
    "app": { }
    "state": { }
}
```

## Секция app

Представляет из себя объект, каждый ключ которого соответствует *начальным настройкам* какого-либо компонента приложения.

В качестве значения выступает объект с параметрами, передаваемый в конструктор соответствующего компоненту класса. Некоторые часто используемые параметры перечислены в таблице ниже. Полный список следует искать в документации соответствующего класса. 

Если в качестве значения передать `false`, то компонент не будет инициализирован. 

Если компонент должен быть проинициализирован, но не принимает ни одного параметра - передаётся пустой объект `{}`.

На текущий момент в конструкторе приложений доступны для конфигурирования следующие компоненты:

ключ | описание | параметры | класс 
--- | --- | --- | ---
map | Leaflet-карта | `<Number>minZoom` `<Number>maxZoom` | [L.Map](http://leafletjs.com/reference.html#map-options)
gmxMap | данные карты | `<String>mapID` `<String>apiKey` | [L.gmx.loadMap](https://github.com/ScanEx/Leaflet-GeoMixer/blob/master/documentation-rus.md#lgmxloadmap)
hideControl | контрол скрытия | --- | [L.Control.gmxHide](https://github.com/ScanEx/gmxControls/blob/master/documentation-rus.md#%D0%9F%D0%BB%D0%B0%D0%B3%D0%B8%D0%BD-lcontrolgmxhide)
zoomControl | контрол зума | --- | [L.Control.gmxZoom](https://github.com/ScanEx/gmxControls/blob/master/documentation-rus.md#%D0%9F%D0%BB%D0%B0%D0%B3%D0%B8%D0%BD-lcontrolgmxzoom)
centerControl | крестик по центру карты | `<String>color` | [L.Control.gmxCenter](https://github.com/ScanEx/gmxControls/blob/master/documentation-rus.md#%D0%9F%D0%BB%D0%B0%D0%B3%D0%B8%D0%BD-lcontrolgmxzoom)
bottomControl | фон и контейнер контролов, расположенных снизу | `<Boolean>notHide` | [L.Control.gmxBottom](https://github.com/ScanEx/gmxControls/blob/master/documentation-rus.md#%D0%9F%D0%BB%D0%B0%D0%B3%D0%B8%D0%BD-lcontrolgmxbottom)
locationControl | контрол координат | `<String>position` `<String>scaleFormat` `<Boolean>notHide` | [L.Control.gmxLocation](https://github.com/ScanEx/gmxControls/blob/master/documentation-rus.md#%D0%9F%D0%BB%D0%B0%D0%B3%D0%B8%D0%BD-lcontrolgmxlocation)
copyrightControl | контрол копирайтов | `<String>position` `<String>type` `<String>mapCopyright` | [L.Control.gmxCopyright](https://github.com/ScanEx/gmxControls/blob/master/documentation-rus.md#%D0%9F%D0%BB%D0%B0%D0%B3%D0%B8%D0%BD-lcontrolgmxcopyright)
baseLayersControl | контрол подложек | `<String>maxLayersInRow` | [GmxIconLayers](https://github.com/ScanEx/GMXCommonComponents/tree/master/GmxIconLayers)
layersMapper | менеджер отображения слоёв (отключить, если нужно управлять отображением слоёв вручную) | --- | ---
layersTreeWidget | виджет дерева слоёв | `<Number>maxDepth` `<Boolean>showCenterIcon` | [LayersTreeWidget](https://github.com/ScanEx/GMXCommonComponents/tree/master/LayersTreeWidget)
storytellingWidget | виджет сторителлинга | --- | [StorytellingWidget](https://github.com/ScanEx/GMXCommonComponents/tree/master/StorytellingWidget)
sidebarWidget | сайдбар. Включается автоматически, если включен виджет закладок или дерева слоёв | `<Boolean>useAnimation` | [IconSidebarWidget](https://github.com/ScanEx/GMXCommonComponents/tree/master/IconSidebarWidget)

## Секция state

Представляет из себя объект, каждый ключ которого соответствует *состоянию* какого-либо компонента приложения.

По своей сути `state` - это просто секция `components` из пермалинка fires (версия 3.0.0)

Ключи объекта обозначают компонент, а их значения содержат данные для восстановления его состояния.

Как правило, объект `state` формируется автоматически.
Ниже приведен список типичных параметров для каждого компонента, которые могут настраиваться пользователем

**map**
```javascript
{
    position: {
        x: <Number>,    // долгота
        y: <Number>,    // широта
        z: <Number>     // зум
    }
}
```

**language**

`eng` или `rus`

## Значения по умолчанию

Для всех компонентов конструктора заданы значения по умолчанию, так что для нормальной работы приложения достаточно указать только id карты и api-ключ в компоненте `gmxMap`. Ниже приведён конфигурционный файл, из которого берутся значения, не указанные в редакторе.

Если его использовать "как есть", то получим пустую карту с включёнными контролами и виджетом подложек.

```javascript
{
    app: {
        gmxMap: {
            setZIndex: true
        },
        hideControl: {},
        zoomControl: {},
        centerControl: {
            color: 'black'
        },
        bottomControl: {},
        locationControl: {},
        copyrightControl: {},
        baseLayersControl: {},
        layersMapper: {},
        layersTreeWidget: false,
        bookmarksWidget: false
        storytellingWidget: false,
        sidebarWidget: false,
    },
    state: {
        map: {
            position: {
                x: 82,
                y: 53,
                z: 3
            }
        },
        language: 'rus'
    }
}
```