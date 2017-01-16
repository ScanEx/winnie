Конфигурационный файл формирует элементы интерфейса приложения и список слоев, загружаемых на карту.

Схема описания делится на четыре основные секции:
- `app` - для конфигурации приложения (настройки интерфейса, виджетов, и прочие параметры, влияющие на пользовательский интерфейс)
- `state` - для хранения начального состояния карты (начальное положение, активные слои, текущая дата - т.е. те функции, которые доступны для управления пользователем)
- `layers` - для переопределения параметров слоёв (режимы отображения, дополнительные свойства)
- `user` - для хранения настроек, специфичных для конкретного приложения. Содержимое этого раздела не регламентируется

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

Секция `app` имеет линейную структуру. Это означает, что каждый её ключ соответствует описываемому объекту и содержит хеш с настройками, касающимися только этого компонента.

*Примечание: почти всегда хеш с настройками передаётся конструктору соответствующего класса, однако может дополняться параметрами, не входящими в оригинальную документацию. Ниже будут приведены ссылки на описание классов, объектов или функций, которым передаются эти хеши.*

Секция `state` в конструкторе приложений скрыта от пользователя и заполняется автоматически.

## Настройки карты

За основные настройки карты отвечают два ключа, расположенные в секции `app`: `map` и `gmxMap`.

**Пример:**
```json
{
    "app": {
        "map": {
            "minZoom": 3
        },
        "gmxMap": {
            "mapID": "37TYY",

        }
    }
}
```

### Ключ map (карта)

[L.Map](http://leafletjs.com/reference.html#map-options)

- `<Number> minZoom` - минимальный допустимый зум карты
- `<Number> maxZoom` - максимальный допустимый зум карты
- `<Boolean> scrollWheelZoom` - можно ли зумить карту колёсиком мыши

### Ключ gmxMap (загружаемые данные с сервера Kosmosnimki)

[L.gmx.loadMap](https://github.com/ScanEx/Leaflet-GeoMixer/blob/master/documentation-rus.md#lgmxloadmap)

- `<String> mapID` - ID загружаемой карты с сервера Kosmosnimki
- `<String> apiKey` - API-ключ клиента. (в конструкторе приложений этот параметр скрыт)

## Настройки контролов

Контролы - это элементы пользовательского интерфейса, помещаемые непосредственно на карту. Настройки всех контролов располагаются в секции `app`. Ключ обозначает контрол, который мы настраеваем, а в качестве значения может передаваться как хеш с настройками, так и булево значение (в этом случае `true` эквивалентно `{}`, а `false` эквивалентно `undefined`, что означает, что контрол не будет добавлен на карту).

*Примечание: так же, как и для настроек карты, для каждого контрола указана ссылка на документацию*

**Пример:**

```json
{
    "app": {
        "zoomControl": false,
        "centerControl": {
            "color": "#ef33b9"
        },
        "baseLayersControl": true
    }
}
```

### Кнопка скрытия (ключ hideControl)

[L.Control.GmxHide](https://github.com/ScanEx/gmxControls/blob/master/documentation-rus.md#Плагин-lcontrolgmxhide)

*Параметры отсутствуют*

### Кнопки зума (ключ zoomControl)

[L.Control.GmxHide](https://github.com/ScanEx/gmxControls/blob/master/documentation-rus.md#Плагин-lcontrolgmxhide)

Параметры отсутствуют, однако в качестве значения можно указать строку `'leaflet'`. В этом случае вместо контрола Геомиксера будет использован стандартный контрол Leaflet.

### Крестик по центру карты (ключ centerControl)

[L.Control.GmxCenter](https://github.com/ScanEx/gmxControls/blob/master/documentation-rus.md#Плагин-lcontrolgmxcenter)

- `<String> color` - цвет в hex (например `'#fedcba'`)

### Контрол копирайтов (ключ copyrightControl)

[L.Control.GmxCopyright](https://github.com/ScanEx/gmxControls/blob/master/documentation-rus.md#Плагин-lcontrolgmxcopyright)

- `<String> position` - положение контрола (см. [Leaflet control positions](http://leafletjs.com/reference.html#control-'topleft'))
- `<String> type` - тип отображения (`line` - в одной строке, `window` - в виде всплывающего списка)
- `<String> mapCopyright` - копирайт карты

### Контрол координат и масштаба (ключ locationControl)

[L.Control.GmxLocation](https://github.com/ScanEx/gmxControls/blob/master/documentation-rus.md#Плагин-lcontrolgmxlocation)

- `<String> position` - положение контрола (см. [Leaflet control positions](http://leafletjs.com/reference.html#control-'topleft'))
- `<String> scaleFormat` - формат отображения масштаба. Возможны значения `bar` и `text`
- `<String> notHide` - не скрывать контрол при переключении видимости контролов

### Контрол подложек (ключ baseLayersControl)

[L.Control.IconLayers](https://github.com/ScanEx/Leaflet-IconLayers)

- `<Number> maxLayersInRow` - максимальное количество подложек, после которого будет образован следующий ряд

### Календарик (ключ calendarWidget)

[nsGmx.CalendarWidget](https://github.com/ScanEx/GMXCommonComponents/tree/master/CalendarWidget)

- `<String> type` - тип календарика (`fire`(режим 24+n) или `common`)
- `<Boolean> minimized` - свёрнут ли календарик по умолчанию
- `<Boolean> showSwitcher` - показывать ли кнопку переключения режима

### Сайдбар (ключ sidebarWidget)

[nsGmx.IconSidebarControl](https://github.com/ScanEx/GMXCommonComponents/tree/master/IconSidebarControl)

- `<Boolean> useAnimation` - использовать ли анимацию

Сайдбар включается автоматически, если указан какой-либо виджет, который в него встраивается.

### Контрол сторителлинга (ключ storytellingWidget)

[nsGmx.StorytellingControl](https://github.com/ScanEx/GMXCommonComponents/tree/master/StorytellingControl),
[nsGmx.StorytellingAccordeonControl](https://github.com/ScanEx/GMXCommonComponents/tree/master/StorytellingAccordeonControl)

- `<String> type` - тип виджета (`accordeon` или `flipper`)
- `<String> position` - если тип - `accordeon`, то этот параметр влияет на положение виджета (см. [Leaflet control positions](http://leafletjs.com/reference.html#control-'topleft'))
- `<Number|Boolean> openBookmark` - номер закладки, которую нужно открывать по умолчанию (нумерация с 0). Если указано значение `false`, то ни одна из закладок не будет открыта.

### Слайдер прозрачности (ключ transparencySliderWidget)
[nsGmx.TransparencySliderWidget](https://github.com/ScanEx/GMXCommonComponents/TransparencySliderWidget)

*Параметры отсутствуют*

## Настройки виджетов сайдбара

Ниже приведен список виджетов, которые автоматически встраиваются в сайдбар. Они описываются также в секции `app` и для них справедливы те же примечания, что и для контролов.

### Дерево слоёв (ключ layersTreeWidget)

[nsGmx.LayersTreeWidget](https://github.com/ScanEx/GMXCommonComponents/tree/master/LayersTreeWidget)

Конфиг дерева слоёв - двухуровневый и имеет следующий вид (указаны значения по умолчанию):

```json
{
    "maxDepth": 0,
    "showCenterIcon": false,
    "popoversContent": "description",
    "popoversOptions": {
        "trigger": "hover"
    }
}
```

- `<Number> maxDepth` - максимальная глубина отображения дерева
- `<Boolean> showCenterIcon` - показывать ли иконку перецентровки
- `<String> popoversContent` -  что будет отображаться во всплывающей подсказке кнопки `i`
- `<String> popoversOptions.trigger` - действие, приводящее к появлению подсказки (`click` или  `hover`)

### Виджет закладок (ключ bookmarksWidget)

[nsGmx.BookmarksWidget](https://github.com/ScanEx/GMXCommonComponents/tree/master/BookmarksWidget)

*Параметры отсутствуют*


## Настройки слоёв карты

Слои настраиваются в секции `layers`. Каждый ключ соответствует идентификатору слоя или группы. Его значением, в свою очередь, является объект, описывающий настройки данного слоя или группы.

**Пример секции `layers`:**
```json
{
    "Sx8AdnMZ3yFg0LVi": {
        "title": {
            "eng": "Objects and boundaries"
        }
    },
    "0EF727A0FB804921B039AC99DF44A2E2": {
        "heatmap": {
            "intensityField": "HotSpotCount",
            "intensityScale": 3,
            "blur": 11,
            "radius": 16,
            "minRadius": 7,
            "minOpacity": 0.65
        }
    },
    "0063FE5347284163B43E863FCFFA9161": {
        "clusters": {
            "maxClusterRadius": 50
        }
    }
}
```

Ниже приведен список всех настроек слоёв:

### Заголовок слоя (title)

Используется, если необходимо перевести заголовок слоя.

- `<String> eng` - in english
- `<String> rus` - по-русски

### Описание слоя (description)

Используется, если необходимо перевести описание слоя.

- `<String> eng` - in english
- `<String> rus` - по-русски

### Кластеры (clusters)

[Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster)

- `<Number> maxClusterRadius` - максимальный радиус кластеризации (охват), по умолчанию `80` (в пикселях)
- `<Number> maxZoom` - пороговый зум, после которого к слою применяются кластеры
- `<Boolean> showCoverageOnHover` - показывать ли полигон охвата кластера

### Теплокарта (heatmap)

[Leaflet.heat](https://github.com/Leaflet/Leaflet.heat)

- `<String> intensityField` - наименование атрибута значение которого используется для расчета интенсивности точки
- `<String> intensityScale` - множитель, используемый при расчете интенсивности точки
- `<String> blur` - коэффициент размытия (по умолчанию `15`)
- `<String> radius` - максимальный радиус точки теплокарты (по умолчанию `25`)
- `<String> minRadius` -  минимальный радиус точки теплокарты
- `<String> minOpacity` - минимальный коэффициент непрозрачности
