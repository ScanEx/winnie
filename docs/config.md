# Конфигурационный файл

Конфигурационный файл конструктора приложений делится на четыре основные составляющие:
- `app` - для хранения конфигурации приложения (настройки интерфейса, виджетов, и прочие параметры, влияющие на интерфейс)
- `state` - для хранения состояния карты (положение, активные слои, текущая дата т.е. те параметы, которые могут изменяться пользователем).
- `layers` - для переопределения параметров слоёв (режимы отображения, дополнительные свойства).
- `user` - для хранения настроек, специфичных для конкретного приложения. Содержимое этого раздела не регламетируется.

В итоге корень конфига выглядит следующим образом:

```json
{
    "app": { },
    "state": { },
    "layers": { },
    "user": { }
}
```

Ни один из ключей не является обязательным.

Конфигурационный файл описывается в формате json. Это значит, что каждый ключ должен быть заключён в двойные кавычки, а в качестве значения может быть строка в двойных кавычках, число, булево значение (`true`/`false`) или объект `{ ... }`. Пары `ключ: значение` разделяются запятыми. Лишних запятых быть не должно. Комментарии не допускаются.

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
calendarWidget | календарь |  | [CalendarWidget](https://github.com/ScanEx/GMXCommonComponents/tree/master/CalendarWidget)

## Секция state

Представляет из себя объект, каждый ключ которого соответствует *состоянию* какого-либо компонента приложения.

По своей сути `state` - это просто секция `components` из пермалинка fires (версия 3.0.0)

Ключи объекта обозначают компонент, а их значения содержат данные для восстановления его состояния.

Как правило, объект `state` формируется автоматически.
Ниже приведен список типичных параметров для каждого компонента, которые могут настраиваться пользователем

#### map
```json
{
    "position": {
        "x": 50,
        "y": 30,
        "z": 3
    }
}
```

#### language

`eng` или `rus`

Подробная документация в [PermalinkManager](https://github.com/ScanEx/GMXCommonComponents/tree/master/PermalinkManager)

## Секция layers

Представляет из себя объект, каждый ключ которого соответствует идентификатору слоя или группы.

Доступны следующие настройки:

#### clusters

Отображает слой в виде кластеров путём применения Leaflet-плагина [L.MarkerCluster](https://github.com/Leaflet/Leaflet.markercluster)

Включает все настройки плагина, а также функции [bindClusters()](https://github.com/ScanEx/Leaflet-GeoMixer/blob/master/documentation-rus.md#clusters-options---%D0%BE%D0%BF%D1%86%D0%B8%D0%B8-%D0%BA%D0%BB%D0%B0%D1%81%D1%82%D0%B5%D1%80%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8) GeoMixer-а, плюс следующие параметры:
- `<Boolean>autoSpiderfy (true)` - если включён, то маркеры, расположенные в одной точке будут разворачиваться автоматически без зумирования.

#### title

Объект с двумя необязательными ключами: `eng` и `rus`. Переопределяет заголовок слоя с учётом текущего языка.

#### description

Объект с двумя необязательными ключами: `eng` и `rus`. Переопределяет описание слоя с учётом текущего языка.

#### heatmap

Отображает слой в виде хитмэпа путём применения Leaflet-плагина [Leaflet.Heat](https://github.com/Leaflet/Leaflet.heat)

Включает все настройки плагина, а также функции [bindHeatmap()](https://github.com/ScanEx/Leaflet-GeoMixer/blob/master/documentation-rus.md#heatmap-options---%D0%BE%D0%BF%D1%86%D0%B8%D0%B8-heatmap) GeoMixer-а, т.е

- `<Number|Function>maxHeatMapZoom` - Максимальный zoom на котором включен HeatMap слоя. (На всех zoom > maxZoom слой будет ображаться без HeatMap).
- `<Number>intensityField` - Наименование атрибута значение которого используется для расчета интенсивности точки.
- `<String>intensityScale` - Множитель используемый при расчете интенсивности точки.
- `<Number>minOpacity` - минимальный предел прозрачности
- `<Number>maxZoom` - zoom, при котором точки достигают максимальной интенсивности (по умолчанию - maxZoom карты)
- `<Number>max` - максимальная интенсивность точки, по умолчанию 1.0
- `<Number>radius` - радиус точек хитмапа, по умолчанию 25
- `<Number>blur` - коэффициент размытия, по умолчанию 15
- `<Object>gradient` - настройки градиента, например {0.4: "blue", 0.65: "lime", 1: "red"}

### Пример секции `layers`:

```json
{
    "<GroupID>": {
        "title": {
            "eng": "Group1"
        }
    },
    "GroupID": {
        "title": {
            "eng": "Group2"
        }
    },
    "<LayerID>": {
        "clusters": {
            "zoomToBoundsOnClick": false,
            "autoSpiderfy": true,
            "maxZoom": 30
        }
    }
}
```

## Значения по умолчанию

Для всех компонентов конструктора заданы значения по умолчанию, так что для нормальной работы приложения достаточно указать только id карты и api-ключ в компоненте `gmxMap`. Ниже приведён конфигурционный файл, из которого берутся значения, не указанные в редакторе.

Если его использовать "как есть", то получим пустую карту с включёнными контролами и виджетом подложек.

```json
{
    "app": {
        "gmxMap": {
            "setZIndex": true
        },
        "hideControl": {},
        "zoomControl": {},
        "centerControl": {
            "color": "black"
        },
        "bottomControl": {},
        "locationControl": {},
        "copyrightControl": {},
        "baseLayersControl": {},
        "layersMapper": {},
        "layersTreeWidget": false,
        "bookmarksWidget": false,
        "storytellingWidget": false,
        "sidebarWidget": false,
    },
    "state": {
        "map": {
            "position": {
                "x": 82,
                "y": 53,
                "z": 3
            }
        },
        "language": "rus"
    }
}
```
