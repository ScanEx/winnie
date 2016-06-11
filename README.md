# "Winnie" - web-maps UI constructor

### Description
Easy way to embed [GeoMixer](http://geomixer.ru/index.php/en) based maps into your applications or create a new ones with extended and configurable set of UI controls and widgets for [Leaflet](http://leafletjs.com/).

### Components
- Online application editor hosted on Kosmosnimki server
- Source code library on Github

![Winnie workflow](http://images.kosmosnimki.ru/demo/winnie/winnie-scheme.png)

### Features
- GeoMixer based data visualization
- Leaflet plugins
- Widgets (so called "Winnie-widgets"):
  - [Base Maps layers](https://github.com/ScanEx/Leaflet.gmxBaseLayersManager)
  - Sidebar
  ..- LayersTree
  ..- Objects and geometry
  - Storytelling
  ..- Bookmarks on the map
  - Balloon image gallery
  - Calendar

### Config reference

https://github.com/Kosmosnimki/winnie/blob/master/docs/config.md (currently in Russian)

### Examples

Some examples of what kind of applications can be created using "Winnie":
check the ["Gallery"](http://winnie.kosmosnimki.ru/gallery.html)

### License

© 2015 Kosmosnimki Ru Ltd. (SCANEX Group), published under Apache Public License 2.0

### Getting started

<b>You have two basic work scenarios:</b>

#### 1
1. Go to the [Editor](http://winnie.kosmosnimki.ru) from your GeoMixer project using option "Share" and choose one of the templates:

	![](http://images.kosmosnimki.ru/demo/winnie/winnie-editor.png)
    
2. Edit config file to customize base UI settings accordingly to config options (see [config reference](https://github.com/Kosmosnimki/winnie/blob/master/docs/config.md) for more detailed description)

3. Save final map application, get permalink and embed it into your site or blog - that's it! (you can return and edit it anytime, following the saved permalink)

#### 2
You can also download the library and customize the source code if you like <!--more documentation to come-->

### Future plans
- To make "Winnie" capable of interacting with any OGC-compatible backend
- To finalize Winnie builder
- To fork "mobile-first" approach of Winnie based widgets with more mobile adjustable components

### Support
The project was supported by WWF

### Описание
Простой способ создавать картографические приложения, используя API [GeoMixer](http://geomixer.ru). Поддерживает набор готовых контролов и виджетов для [Leaflet](http://leaflet.js)

### Возможности
- Встроенная визуализация данных с помощью Геомиксер (подробнее о платформе http://geomixer.ru)
- Поддержка плагинов Leaflet
- Виджеты:
  - Базовые карты
  - Дерево слоев
  - Storytelling ("картографические сюжеты")
  - Закладки на карте
  - Фотогаллерея в балунах
  - Строка поиска*

### Справочник конфиг-файла

https://github.com/Kosmosnimki/winnie/blob/master/docs/config.md

### Примеры

["Галерея"](http://winnie.kosmosnimki.ru/gallery.html)

### Лицензия

© 2015 Kosmosnimki Ru (SCANEX Group), открытая лицензия [Apache Public License 2.0](http://www.apache.org/licenses/LICENSE-2.0)

### Начало работы

<b>Базовые сценарии:</b>

1. Перейдите в [Редактор](http://winnie.kosmosnimki.ru) из проекта в GeoMixer, используя "Share" и выберите один из шаблонов интерфейса.
2. Отредактируйте конфигурационный файл, если необходимо (см [config reference](https://github.com/Kosmosnimki/winnie/blob/master/docs/config.md) для более детального описания)
3. Сохраните финальную версию конфигурационного файла. Полученный пермалинк вставьте в свой сайт или блог, используя "код для вставки" (вы можете редактировать или возвращаться к предыдущей версии, используя сохраненный пермалинк)

### Дальнейшие планы
- Сделать "Winnie" backend- независимым, чтобы библиотека могла работать с любым бэкэндом
- Доделать сборщик для локальной сборки
- Уделить больше внимания UI-компонентам для мобильных устройств и адаптивному дизайну
 
### Поддержка

Проект "Винни" был поддержан WWF
