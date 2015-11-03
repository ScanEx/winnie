# "Winnie" - web maps constructor

### Description
Easy way to embed [Leaflet](http://leafletjs.com/) and [GeoMixer](http://geomixer.ru/index.php/en) based maps into your applications or create a new ones with extended and configurable set of UI controls and widgets

### Components
- Online application editor hosted on Kosmosnimki server
- Source code library on Github

![Winnie workflow](http://images.kosmosnimki.ru/demo/winnie/winnie-scheme.png)

### Features
- GeoMixer based data visualization
- Lealfet plugins
- Widgets (so called Winnie-widgets):
  - [Base Maps layers](https://github.com/ScanEx/Leaflet.gmxBaseLayersManager)
  - Sidebar
  ..- LayersTree
  ..- Objects and geometry
  - Storytelling
  ..- Bookmarks on the map
  - Balloon image gallery
  - Calendar
  - Search bar
  - Copyright bar

### Examples

Some example of what kind of applications can be created using "Winnie":

1. A project of [Moscow region culture heritage](http://mosoblculture.ru/map)

![](http://images.kosmosnimki.ru/demo/winnie/app-mosobl.png)

2. A project of [WWF social map](http://en.tigerstrail.ru/#navmap)

![](http://images.kosmosnimki.ru/demo/winnie/app-wwf.png)

3. A ["Crisismap"](http://crisismap.ru) project

![](http://images.kosmosnimki.ru/demo/winnie/app-crisismap.png)

### License

© 2015 Kosmosnimki Ru Ltd. (SCANEX Group), published under Apache Public License 2.0

### Getting started

You have two work scenarios:

#### You already have Geomixer based project:

1. Go to the [Editor](http://kosmosnimki.ru/winnie) from your Geomixer project using option "Share" and choose one of the templates
2. Edit config file to customize base UI settings accordingly to config options (see [config reference](https://github.com/Kosmosnimki/winnie/blob/master/docs/config.md) for more detailed description)
3. Save final map application, get permalink and embed into your site or blog using ```<iframe>``` (you can return and edit it anytime following the iframe permalink)

#### You just want to use Leaflet:

1. Go to the [Editor](http://kosmosnimki.ru/winnie) directly and choose one of the templates (by default it will use base OSM map) 
	- or you can make a local clone of source library by downloading it from [Github]
2. Connect any additional [Winnie-widgets] that can be useful for your project
3. Save and embed map application using ```<iframe>``` or customize the code into your local application


### Описание
Простой способ создавать картографические приложения на основе [Leaflet](http://leaflet.js) и [GeoMixer](http://geomixer.ru), используя набор готовых контролов и виджетов

### Возможности
- Встроенная визуализация данных с помощью платформы Геомиксер (подробнее http://geomixer.ru)
- Поддержка плагинов Leaflet
- Виджеты:
  - Базовые карты
  - Дерево слоев
  - Storytelling (картографические сюжеты)
  - Закладки на карте
  - Фотогаллерея в балунах

А также:
- Минисайдбар (компактная панель для мобильных UI)
- Строка поиска по адресам или координатам
- Добавление пользовательских объектов на карту
- Сохранение пермалинков

### Примеры

### Лицензия

### Начало работы
