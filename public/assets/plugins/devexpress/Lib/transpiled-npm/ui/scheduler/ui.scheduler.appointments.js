"use strict";

exports.default = void 0;

var _renderer = _interopRequireDefault(require("../../core/renderer"));

var _dom_adapter = _interopRequireDefault(require("../../core/dom_adapter"));

var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));

var _element_data = require("../../core/element_data");

var _translator = require("../../animation/translator");

var _date = _interopRequireDefault(require("../../core/utils/date"));

var _common = require("../../core/utils/common");

var _type = require("../../core/utils/type");

var _iterator = require("../../core/utils/iterator");

var _object = require("../../core/utils/object");

var _array = require("../../core/utils/array");

var _extend = require("../../core/utils/extend");

var _element = require("../../core/element");

var _recurrence = require("./recurrence");

var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));

var _uiScheduler = _interopRequireDefault(require("./ui.scheduler.publisher_mixin"));

var _uiScheduler2 = _interopRequireDefault(require("./ui.scheduler.appointment"));

var _index = require("../../events/utils/index");

var _double_click = require("../../events/double_click");

var _message = _interopRequireDefault(require("../../localization/message"));

var _uiCollection_widget = _interopRequireDefault(require("../collection/ui.collection_widget.edit"));

var _deferred = require("../../core/utils/deferred");

var _utilsTimeZone = _interopRequireDefault(require("./utils.timeZone.js"));

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var COMPONENT_CLASS = 'dx-scheduler-scrollable-appointments';
var APPOINTMENT_ITEM_CLASS = 'dx-scheduler-appointment';
var APPOINTMENT_TITLE_CLASS = 'dx-scheduler-appointment-title';
var APPOINTMENT_CONTENT_DETAILS_CLASS = 'dx-scheduler-appointment-content-details';
var APPOINTMENT_DATE_CLASS = 'dx-scheduler-appointment-content-date';
var RECURRING_ICON_CLASS = 'dx-scheduler-appointment-recurrence-icon';
var ALL_DAY_CONTENT_CLASS = 'dx-scheduler-appointment-content-allday';
var DBLCLICK_EVENT_NAME = (0, _index.addNamespace)(_double_click.name, 'dxSchedulerAppointment');
var toMs = _date.default.dateToMilliseconds;

var SchedulerAppointments = _uiCollection_widget.default.inherit({
  ctor: function ctor(element, options) {
    this.callBase(element, options);
  },
  _supportedKeys: function _supportedKeys() {
    var parent = this.callBase();

    var tabHandler = function tabHandler(e) {
      var appointments = this._getAccessAppointments();

      var focusedAppointment = appointments.filter('.dx-state-focused');
      var index = focusedAppointment.data(_constants.APPOINTMENT_SETTINGS_KEY).sortedIndex;
      var lastIndex = appointments.length - 1;

      if (index > 0 && e.shiftKey || index < lastIndex && !e.shiftKey) {
        e.preventDefault();
        e.shiftKey ? index-- : index++;

        var $nextAppointment = this._getAppointmentByIndex(index);

        this._resetTabIndex($nextAppointment);

        _events_engine.default.trigger($nextAppointment, 'focus');
      }
    };

    return (0, _extend.extend)(parent, {
      escape: function () {
        this.moveAppointmentBack();
        this._escPressed = true;
      }.bind(this),
      del: function (e) {
        if (this.option('allowDelete')) {
          e.preventDefault();

          var data = this._getItemData(e.target);

          this.notifyObserver('onDeleteButtonPress', {
            data: data,
            target: e.target
          });
        }
      }.bind(this),
      tab: tabHandler
    });
  },
  _getAppointmentByIndex: function _getAppointmentByIndex(sortedIndex) {
    var appointments = this._getAccessAppointments();

    return appointments.filter(function (_, $item) {
      return (0, _element_data.data)($item, _constants.APPOINTMENT_SETTINGS_KEY).sortedIndex === sortedIndex;
    }).eq(0);
  },
  _getAccessAppointments: function _getAccessAppointments() {
    return this._itemElements().filter(':visible').not('.dx-state-disabled');
  },
  _resetTabIndex: function _resetTabIndex($appointment) {
    this._focusTarget().attr('tabIndex', -1);

    $appointment.attr('tabIndex', this.option('tabIndex'));
  },
  _moveFocus: _common.noop,
  _focusTarget: function _focusTarget() {
    return this._itemElements();
  },
  _renderFocusTarget: function _renderFocusTarget() {
    var $appointment = this._getAppointmentByIndex(0);

    this._resetTabIndex($appointment);
  },
  _focusInHandler: function _focusInHandler(e) {
    this.callBase.apply(this, arguments);
    this._$currentAppointment = (0, _renderer.default)(e.target);
    this.option('focusedElement', (0, _element.getPublicElement)((0, _renderer.default)(e.target)));
  },
  _focusOutHandler: function _focusOutHandler() {
    var $appointment = this._getAppointmentByIndex(0);

    this.option('focusedElement', (0, _element.getPublicElement)($appointment));
    this.callBase.apply(this, arguments);
  },
  _eventBindingTarget: function _eventBindingTarget() {
    return this._itemContainer();
  },
  _getDefaultOptions: function _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      noDataText: null,
      activeStateEnabled: true,
      hoverStateEnabled: true,
      tabIndex: 0,
      fixedContainer: null,
      allDayContainer: null,
      allowDrag: true,
      allowResize: true,
      allowAllDayResize: true,
      onAppointmentDblClick: null,
      _collectorOffset: 0
    });
  },
  _optionChanged: function _optionChanged(args) {
    switch (args.name) {
      case 'items':
        this._cleanFocusState();

        this._clearDropDownItems();

        this._clearDropDownItemsElements();

        this._repaintAppointments(args.value);

        this._renderDropDownAppointments();

        this._attachAppointmentsEvents();

        break;

      case 'fixedContainer':
      case 'allDayContainer':
      case 'onAppointmentDblClick':
        break;

      case 'allowDrag':
      case 'allowResize':
      case 'allowAllDayResize':
        this._invalidate();

        break;

      case 'focusedElement':
        this._resetTabIndex((0, _renderer.default)(args.value));

        this.callBase(args);
        break;

      case 'allowDelete':
        break;

      case 'focusStateEnabled':
        this._clearDropDownItemsElements();

        this._renderDropDownAppointments();

        this.callBase(args);
        break;

      default:
        this.callBase(args);
    }
  },
  _isAllDayAppointment: function _isAllDayAppointment(appointment) {
    return appointment.settings.length && appointment.settings[0].allDay || false;
  },
  _isRepaintAppointment: function _isRepaintAppointment(appointment) {
    return !(0, _type.isDefined)(appointment.needRepaint) || appointment.needRepaint === true;
  },
  _isRepaintAll: function _isRepaintAll(appointments) {
    if (this.invoke('isVirtualScrolling')) {
      return true;
    }

    if (this.invoke('isCurrentViewAgenda')) {
      return true;
    }

    for (var i = 0; i < appointments.length; i++) {
      var appointment = appointments[i];

      if (!this._isRepaintAppointment(appointment)) {
        return false;
      }
    }

    return true;
  },
  _applyFragment: function _applyFragment(fragment, allDay) {
    if (fragment.children().length > 0) {
      this._getAppointmentContainer(allDay).append(fragment);
    }
  },
  _onEachAppointment: function _onEachAppointment(appointment, index, container, isRepaintAll) {
    var _this = this;

    var repaintAppointment = function repaintAppointment() {
      appointment.needRepaint = false;

      _this._clearItem(appointment);

      _this._renderItem(index, appointment, container);
    };

    if ((appointment === null || appointment === void 0 ? void 0 : appointment.needRemove) === true) {
      this._clearItem(appointment);
    } else if (isRepaintAll || this._isRepaintAppointment(appointment)) {
      repaintAppointment();
    }
  },
  _repaintAppointments: function _repaintAppointments(appointments) {
    var _this2 = this;

    this._renderByFragments(function ($commonFragment, $allDayFragment) {
      var isRepaintAll = _this2._isRepaintAll(appointments);

      if (isRepaintAll) {
        _this2._getAppointmentContainer(true).html('');

        _this2._getAppointmentContainer(false).html('');
      }

      !appointments.length && _this2._cleanItemContainer();
      appointments.forEach(function (appointment, index) {
        var container = _this2._isAllDayAppointment(appointment) ? $allDayFragment : $commonFragment;

        _this2._onEachAppointment(appointment, index, container, isRepaintAll);
      });
    });
  },
  _renderByFragments: function _renderByFragments(renderFunction) {
    var isVirtualScrolling = this.invoke('isVirtualScrolling');

    if (isVirtualScrolling) {
      var $commonFragment = (0, _renderer.default)(_dom_adapter.default.createDocumentFragment());
      var $allDayFragment = (0, _renderer.default)(_dom_adapter.default.createDocumentFragment());
      renderFunction($commonFragment, $allDayFragment);

      this._applyFragment($commonFragment, false);

      this._applyFragment($allDayFragment, true);
    } else {
      renderFunction(this._getAppointmentContainer(false), this._getAppointmentContainer(true));
    }
  },
  _attachAppointmentsEvents: function _attachAppointmentsEvents() {
    this._attachClickEvent();

    this._attachHoldEvent();

    this._attachContextMenuEvent();

    this._attachAppointmentDblClick();

    this._renderFocusState();

    this._attachFeedbackEvents();

    this._attachHoverEvents();
  },
  _clearItem: function _clearItem(item) {
    var $items = this._findItemElementByItem(item.itemData);

    if (!$items.length) {
      return;
    }

    (0, _iterator.each)($items, function (_, $item) {
      $item.detach();
      $item.remove();
    });
  },
  _clearDropDownItems: function _clearDropDownItems() {
    this._virtualAppointments = {};
  },
  _clearDropDownItemsElements: function _clearDropDownItemsElements() {
    this.invoke('clearCompactAppointments');
  },
  _findItemElementByItem: function _findItemElementByItem(item) {
    var result = [];
    var that = this;
    this.itemElements().each(function () {
      var $item = (0, _renderer.default)(this);

      if ($item.data(that._itemDataKey()) === item) {
        result.push($item);
      }
    });
    return result;
  },
  _itemClass: function _itemClass() {
    return APPOINTMENT_ITEM_CLASS;
  },
  _itemContainer: function _itemContainer() {
    var $container = this.callBase();
    var $result = $container;
    var $allDayContainer = this.option('allDayContainer');

    if ($allDayContainer) {
      $result = $container.add($allDayContainer);
    }

    return $result;
  },
  _cleanItemContainer: function _cleanItemContainer() {
    this.callBase();
    var $allDayContainer = this.option('allDayContainer');

    if ($allDayContainer) {
      $allDayContainer.empty();
    }

    this._virtualAppointments = {};
  },
  _clean: function _clean() {
    this.callBase();
    delete this._$currentAppointment;
    delete this._initialSize;
    delete this._initialCoordinates;
  },
  _init: function _init() {
    this.callBase();
    this.$element().addClass(COMPONENT_CLASS);
    this._preventSingleAppointmentClick = false;
  },
  _renderAppointmentTemplate: function _renderAppointmentTemplate($container, data, model) {
    var formatText = this.invoke('getTextAndFormatDate', model.appointmentData, model.appointmentData.settings || model.targetedAppointmentData, // TODO: very strange variable model.appointmentData.settings at this place
    'TIME');
    (0, _renderer.default)('<div>').text(formatText.text).addClass(APPOINTMENT_TITLE_CLASS).appendTo($container);

    if ((0, _type.isPlainObject)(data)) {
      if (data.html) {
        $container.html(data.html);
      }
    }

    var $contentDetails = (0, _renderer.default)('<div>').addClass(APPOINTMENT_CONTENT_DETAILS_CLASS);
    (0, _renderer.default)('<div>').addClass(APPOINTMENT_DATE_CLASS).text(formatText.formatDate).appendTo($contentDetails);
    $contentDetails.appendTo($container);

    if (data.recurrenceRule) {
      (0, _renderer.default)('<span>').addClass(RECURRING_ICON_CLASS + ' dx-icon-repeat').appendTo($container);
    }

    if (data.allDay) {
      (0, _renderer.default)('<div>').text(' ' + _message.default.format('dxScheduler-allDay') + ': ').addClass(ALL_DAY_CONTENT_CLASS).prependTo($contentDetails);
    }
  },
  _executeItemRenderAction: function _executeItemRenderAction(index, itemData, itemElement) {
    var action = this._getItemRenderAction();

    if (action) {
      action(this.invoke('mapAppointmentFields', {
        itemData: itemData,
        itemElement: itemElement
      }));
    }

    delete this._currentAppointmentSettings;
  },
  _itemClickHandler: function _itemClickHandler(e) {
    this.callBase(e, {}, {
      afterExecute: function (e) {
        this._processItemClick(e.args[0].event);
      }.bind(this)
    });
  },
  _processItemClick: function _processItemClick(e) {
    var $target = (0, _renderer.default)(e.currentTarget);

    var data = this._getItemData($target);

    if (e.type === 'keydown' || (0, _index.isFakeClickEvent)(e)) {
      this.notifyObserver('showEditAppointmentPopup', {
        data: data,
        target: $target
      });
      return;
    }

    this._appointmentClickTimeout = setTimeout(function () {
      if (!this._preventSingleAppointmentClick && _dom_adapter.default.getBody().contains($target[0])) {
        this.notifyObserver('showAppointmentTooltip', {
          data: data,
          target: $target
        });
      }

      this._preventSingleAppointmentClick = false;
    }.bind(this), 300);
  },
  _extendActionArgs: function _extendActionArgs() {
    var args = this.callBase.apply(this, arguments);
    return this.invoke('mapAppointmentFields', args);
  },
  _render: function _render() {
    this.callBase.apply(this, arguments);

    this._attachAppointmentDblClick();
  },
  _attachAppointmentDblClick: function _attachAppointmentDblClick() {
    var that = this;

    var itemSelector = that._itemSelector();

    var itemContainer = this._itemContainer();

    _events_engine.default.off(itemContainer, DBLCLICK_EVENT_NAME, itemSelector);

    _events_engine.default.on(itemContainer, DBLCLICK_EVENT_NAME, itemSelector, function (e) {
      that._itemDXEventHandler(e, 'onAppointmentDblClick', {}, {
        afterExecute: function afterExecute(e) {
          that._dblClickHandler(e.args[0].event);
        }
      });
    });
  },
  _dblClickHandler: function _dblClickHandler(e) {
    var $targetAppointment = (0, _renderer.default)(e.currentTarget);

    var appointmentData = this._getItemData($targetAppointment);

    clearTimeout(this._appointmentClickTimeout);
    this._preventSingleAppointmentClick = true;
    this.notifyObserver('showEditAppointmentPopup', {
      data: appointmentData,
      target: $targetAppointment
    });
  },
  _renderItem: function _renderItem(index, item, container) {
    var itemData = item.itemData;
    var $items = [];

    for (var i = 0; i < item.settings.length; i++) {
      var setting = item.settings[i];
      this._currentAppointmentSettings = setting;
      var $item = this.callBase(index, itemData, container);
      $item.data(_constants.APPOINTMENT_SETTINGS_KEY, setting);
      $items.push($item);
    }

    return $items;
  },
  _getItemContent: function _getItemContent($itemFrame) {
    $itemFrame.data(_constants.APPOINTMENT_SETTINGS_KEY, this._currentAppointmentSettings);
    var $itemContent = this.callBase($itemFrame);
    return $itemContent;
  },
  _createItemByTemplate: function _createItemByTemplate(itemTemplate, renderArgs) {
    var itemData = renderArgs.itemData,
        container = renderArgs.container,
        index = renderArgs.index;
    return itemTemplate.render({
      model: {
        appointmentData: itemData,
        targetedAppointmentData: this.invoke('getTargetedAppointmentData', itemData, (0, _renderer.default)(container).parent())
      },
      container: container,
      index: index
    });
  },
  _getAppointmentContainer: function _getAppointmentContainer(allDay) {
    var $allDayContainer = this.option('allDayContainer');
    var $container = this.itemsContainer().not($allDayContainer);

    if (allDay && $allDayContainer) {
      $container = $allDayContainer;
    }

    return $container;
  },
  _postprocessRenderItem: function _postprocessRenderItem(args) {
    this._renderAppointment(args.itemElement, this._currentAppointmentSettings);
  },
  _renderAppointment: function _renderAppointment($appointment, settings) {
    $appointment.data(_constants.APPOINTMENT_SETTINGS_KEY, settings);

    this._applyResourceDataAttr($appointment);

    var data = this._getItemData($appointment);

    var geometry = this.invoke('getAppointmentGeometry', settings);
    var allowResize = this.option('allowResize') && (!(0, _type.isDefined)(settings.skipResizing) || (0, _type.isString)(settings.skipResizing));
    var allowDrag = this.option('allowDrag');
    var allDay = settings.allDay;
    this.invoke('setCellDataCacheAlias', this._currentAppointmentSettings, geometry);

    var deferredColor = this._getAppointmentColor($appointment, settings.groupIndex);

    if (settings.virtual) {
      this._processVirtualAppointment(settings, $appointment, data, deferredColor);
    } else {
      var info = settings.info;

      this._createComponent($appointment, _uiScheduler2.default, {
        observer: this.option('observer'),
        data: data,
        geometry: geometry,
        direction: settings.direction || 'vertical',
        allowResize: allowResize,
        allowDrag: allowDrag,
        allDay: allDay,
        reduced: settings.appointmentReduced,
        isCompact: settings.isCompact,
        startDate: new Date(info === null || info === void 0 ? void 0 : info.appointment.startDate),
        cellWidth: this.invoke('getCellWidth'),
        cellHeight: this.invoke('getCellHeight'),
        resizableConfig: this._resizableConfig(data, settings)
      });

      deferredColor.done(function (color) {
        if (color) {
          $appointment.css('backgroundColor', color);
        }
      });
    }
  },
  _applyResourceDataAttr: function _applyResourceDataAttr($appointment) {
    var resources = this.invoke('getResourcesFromItem', this._getItemData($appointment));

    if (resources) {
      (0, _iterator.each)(resources, function (name, values) {
        var attr = 'data-' + (0, _common.normalizeKey)(name.toLowerCase()) + '-';

        for (var i = 0; i < values.length; i++) {
          $appointment.attr(attr + (0, _common.normalizeKey)(values[i]), true);
        }
      });
    }
  },
  _resizableConfig: function _resizableConfig(appointmentData, itemSetting) {
    return {
      area: this._calculateResizableArea(itemSetting, appointmentData),
      onResizeStart: function (e) {
        this._$currentAppointment = (0, _renderer.default)(e.element);

        if (this.invoke('needRecalculateResizableArea')) {
          var updatedArea = this._calculateResizableArea(this._$currentAppointment.data(_constants.APPOINTMENT_SETTINGS_KEY), this._$currentAppointment.data('dxItemData'));

          e.component.option('area', updatedArea);

          e.component._renderDragOffsets(e.event);
        }

        this._initialSize = {
          width: e.width,
          height: e.height
        };
        this._initialCoordinates = (0, _translator.locate)(this._$currentAppointment);
      }.bind(this),
      onResizeEnd: function (e) {
        if (this._escPressed) {
          e.event.cancel = true;
          return;
        }

        this._resizeEndHandler(e);
      }.bind(this)
    };
  },
  _calculateResizableArea: function _calculateResizableArea(itemSetting, appointmentData) {
    var area = this.$element().closest('.dx-scrollable-content');
    return this.invoke('getResizableAppointmentArea', {
      coordinates: {
        left: itemSetting.left,
        top: 0,
        groupIndex: itemSetting.groupIndex
      },
      allDay: itemSetting.allDay
    }) || area;
  },
  _resizeEndHandler: function _resizeEndHandler(e) {
    var scheduler = this.option('observer');
    var $element = (0, _renderer.default)(e.element);

    var _$element$data = $element.data('dxAppointmentSettings'),
        info = _$element$data.info;

    var sourceAppointment = this._getItemData($element);

    var modifiedAppointmentAdapter = scheduler.createAppointmentAdapter(sourceAppointment).clone();

    var startDate = this._getEndResizeAppointmentStartDate(e, sourceAppointment, info.appointment);

    var endDate = info.appointment.endDate;

    var dateRange = this._getDateRange(e, startDate, endDate);

    modifiedAppointmentAdapter.startDate = new Date(dateRange[0]);
    modifiedAppointmentAdapter.endDate = new Date(dateRange[1]);
    this.notifyObserver('updateAppointmentAfterResize', {
      target: sourceAppointment,
      data: modifiedAppointmentAdapter.clone({
        pathTimeZone: 'fromGrid'
      }).source(),
      $appointment: $element
    });
  },
  _getEndResizeAppointmentStartDate: function _getEndResizeAppointmentStartDate(e, rawAppointment, appointmentInfo) {
    var scheduler = this.option('observer');
    var appointmentAdapter = scheduler.createAppointmentAdapter(rawAppointment);
    var startDate = appointmentInfo.startDate;
    var recurrenceProcessor = (0, _recurrence.getRecurrenceProcessor)();
    var recurrenceRule = appointmentAdapter.recurrenceRule,
        startDateTimeZone = appointmentAdapter.startDateTimeZone;
    var isAllDay = this.invoke('isAllDay', rawAppointment);
    var isRecurrent = recurrenceProcessor.isValidRecurrenceRule(recurrenceRule);

    if (!e.handles.top && !isRecurrent && !isAllDay) {
      startDate = scheduler.timeZoneCalculator.createDate(appointmentAdapter.startDate, {
        appointmentTimeZone: startDateTimeZone,
        path: 'toGrid'
      });
    }

    return startDate;
  },
  _getDateRange: function _getDateRange(e, startDate, endDate) {
    var itemData = this._getItemData(e.element);

    var deltaTime = this.invoke('getDeltaTime', e, this._initialSize, itemData);
    var renderingStrategyDirection = this.invoke('getRenderingStrategyDirection');
    var isStartDateChanged = false;
    var isAllDay = this.invoke('isAllDay', itemData);
    var needCorrectDates = this.invoke('needCorrectAppointmentDates') && !isAllDay;
    var startTime;
    var endTime;

    if (renderingStrategyDirection !== 'vertical' || isAllDay) {
      isStartDateChanged = this.option('rtlEnabled') ? e.handles.right : e.handles.left;
    } else {
      isStartDateChanged = e.handles.top;
    }

    if (isStartDateChanged) {
      startTime = needCorrectDates ? this._correctStartDateByDelta(startDate, deltaTime) : startDate.getTime() - deltaTime;
      startTime += _utilsTimeZone.default.getTimezoneOffsetChangeInMs(startDate, endDate, startTime, endDate);
      endTime = endDate.getTime();
    } else {
      startTime = startDate.getTime();
      endTime = needCorrectDates ? this._correctEndDateByDelta(endDate, deltaTime) : endDate.getTime() + deltaTime;
      endTime -= _utilsTimeZone.default.getTimezoneOffsetChangeInMs(startDate, endDate, startDate, endTime);
    }

    return [startTime, endTime];
  },
  _correctEndDateByDelta: function _correctEndDateByDelta(endDate, deltaTime) {
    var endDayHour = this.invoke('getEndDayHour');
    var startDayHour = this.invoke('getStartDayHour');
    var result = endDate.getTime() + deltaTime;
    var visibleDayDuration = (endDayHour - startDayHour) * toMs('hour');
    var daysCount = deltaTime > 0 ? Math.ceil(deltaTime / visibleDayDuration) : Math.floor(deltaTime / visibleDayDuration);
    var maxDate = new Date(endDate);
    var minDate = new Date(endDate);
    minDate.setHours(startDayHour, 0, 0, 0);
    maxDate.setHours(endDayHour, 0, 0, 0);

    if (result > maxDate.getTime() || result <= minDate.getTime()) {
      var tailOfCurrentDay = maxDate.getTime() - endDate.getTime();
      var tailOfPrevDays = deltaTime - tailOfCurrentDay;
      var lastDay = new Date(endDate.setDate(endDate.getDate() + daysCount));
      lastDay.setHours(startDayHour, 0, 0, 0);
      result = lastDay.getTime() + tailOfPrevDays - visibleDayDuration * (daysCount - 1);
    }

    return result;
  },
  _correctStartDateByDelta: function _correctStartDateByDelta(startDate, deltaTime) {
    var endDayHour = this.invoke('getEndDayHour');
    var startDayHour = this.invoke('getStartDayHour');
    var result = startDate.getTime() - deltaTime;
    var visibleDayDuration = (endDayHour - startDayHour) * toMs('hour');
    var daysCount = deltaTime > 0 ? Math.ceil(deltaTime / visibleDayDuration) : Math.floor(deltaTime / visibleDayDuration);
    var maxDate = new Date(startDate);
    var minDate = new Date(startDate);
    minDate.setHours(startDayHour, 0, 0, 0);
    maxDate.setHours(endDayHour, 0, 0, 0);

    if (result < minDate.getTime() || result >= maxDate.getTime()) {
      var tailOfCurrentDay = startDate.getTime() - minDate.getTime();
      var tailOfPrevDays = deltaTime - tailOfCurrentDay;
      var firstDay = new Date(startDate.setDate(startDate.getDate() - daysCount));
      firstDay.setHours(endDayHour, 0, 0, 0);
      result = firstDay.getTime() - tailOfPrevDays + visibleDayDuration * (daysCount - 1);
    }

    return result;
  },
  _tryGetAppointmentColor: function _tryGetAppointmentColor(appointment) {
    var settings = (0, _renderer.default)(appointment).data(_constants.APPOINTMENT_SETTINGS_KEY);

    if (!settings) {
      return undefined;
    }

    return this._getAppointmentColor(appointment, settings.groupIndex);
  },
  _getAppointmentColor: function _getAppointmentColor($appointment, groupIndex) {
    var res = new _deferred.Deferred();
    var response = this.invoke('getAppointmentColor', {
      itemData: this._getItemData($appointment),
      groupIndex: groupIndex
    });
    response.done(function (color) {
      return res.resolve(color);
    });
    return res.promise();
  },
  _calculateBoundOffset: function _calculateBoundOffset() {
    return this.invoke('getBoundOffset');
  },
  _virtualAppointments: {},
  _processVirtualAppointment: function _processVirtualAppointment(appointmentSetting, $appointment, appointmentData, color) {
    var virtualAppointment = appointmentSetting.virtual;
    var virtualGroupIndex = virtualAppointment.index;

    if (!(0, _type.isDefined)(this._virtualAppointments[virtualGroupIndex])) {
      this._virtualAppointments[virtualGroupIndex] = {
        coordinates: {
          top: virtualAppointment.top,
          left: virtualAppointment.left
        },
        items: {
          data: [],
          colors: [],
          settings: []
        },
        isAllDay: virtualAppointment.isAllDay ? true : false,
        buttonColor: color
      };
    }

    appointmentSetting.targetedAppointmentData = this.invoke('getTargetedAppointmentData', appointmentData, $appointment);

    this._virtualAppointments[virtualGroupIndex].items.settings.push(appointmentSetting);

    this._virtualAppointments[virtualGroupIndex].items.data.push(appointmentData);

    this._virtualAppointments[virtualGroupIndex].items.colors.push(color);

    $appointment.remove();
  },
  _renderContentImpl: function _renderContentImpl() {
    this.callBase();

    this._renderDropDownAppointments();
  },
  _renderDropDownAppointments: function _renderDropDownAppointments() {
    var _this3 = this;

    this._renderByFragments(function ($commonFragment, $allDayFragment) {
      (0, _iterator.each)(_this3._virtualAppointments, function (groupIndex) {
        var virtualGroup = this._virtualAppointments[groupIndex];
        var virtualItems = virtualGroup.items;
        var virtualCoordinates = virtualGroup.coordinates;
        var $fragment = virtualGroup.isAllDay ? $allDayFragment : $commonFragment;
        var left = virtualCoordinates.left;
        var buttonWidth = this.invoke('getDropDownAppointmentWidth', virtualGroup.isAllDay);
        var buttonHeight = this.invoke('getDropDownAppointmentHeight');
        var rtlOffset = this.option('rtlEnabled') ? buttonWidth : 0;
        this.notifyObserver('renderCompactAppointments', {
          $container: $fragment,
          coordinates: {
            top: virtualCoordinates.top,
            left: left + rtlOffset
          },
          items: virtualItems,
          buttonColor: virtualGroup.buttonColor,
          width: buttonWidth - this.option('_collectorOffset'),
          height: buttonHeight,
          onAppointmentClick: this.option('onItemClick'),
          allowDrag: this.option('allowDrag'),
          cellWidth: this.invoke('getCellWidth'),
          isCompact: this.invoke('isAdaptive') || this._isGroupCompact(virtualGroup),
          applyOffset: !virtualGroup.isAllDay && this.invoke('isApplyCompactAppointmentOffset')
        });
      }.bind(_this3));
    });
  },
  _isGroupCompact: function _isGroupCompact(virtualGroup) {
    return !virtualGroup.isAllDay && this.invoke('supportCompactDropDownAppointments');
  },
  _sortAppointmentsByStartDate: function _sortAppointmentsByStartDate(appointments) {
    appointments.sort(function (a, b) {
      var result = 0;
      var firstDate = new Date(this.invoke('getField', 'startDate', a.settings || a)).getTime();
      var secondDate = new Date(this.invoke('getField', 'startDate', b.settings || b)).getTime();

      if (firstDate < secondDate) {
        result = -1;
      }

      if (firstDate > secondDate) {
        result = 1;
      }

      return result;
    }.bind(this));
  },
  _processRecurrenceAppointment: function _processRecurrenceAppointment(appointment, index, skipLongAppointments) {
    // NOTE: this method is actual only for agenda
    var recurrenceRule = this.invoke('getField', 'recurrenceRule', appointment);
    var result = {
      parts: [],
      indexes: []
    };

    if (recurrenceRule) {
      var dates = appointment.settings || appointment;
      var startDate = new Date(this.invoke('getField', 'startDate', dates));
      var endDate = new Date(this.invoke('getField', 'endDate', dates));
      var appointmentDuration = endDate.getTime() - startDate.getTime();
      var recurrenceException = this.invoke('getField', 'recurrenceException', appointment);
      var startViewDate = this.invoke('getStartViewDate');
      var endViewDate = this.invoke('getEndViewDate');
      var recurrentDates = (0, _recurrence.getRecurrenceProcessor)().generateDates({
        rule: recurrenceRule,
        exception: recurrenceException,
        start: startDate,
        end: endDate,
        min: startViewDate,
        max: endViewDate
      });
      var recurrentDateCount = appointment.settings ? 1 : recurrentDates.length;

      for (var i = 0; i < recurrentDateCount; i++) {
        var appointmentPart = (0, _extend.extend)({}, appointment, true);

        if (recurrentDates[i]) {
          var appointmentSettings = this._applyStartDateToObj(recurrentDates[i], {});

          this._applyEndDateToObj(new Date(recurrentDates[i].getTime() + appointmentDuration), appointmentSettings);

          appointmentPart.settings = appointmentSettings;
        } else {
          appointmentPart.settings = dates;
        }

        result.parts.push(appointmentPart);

        if (!skipLongAppointments) {
          this._processLongAppointment(appointmentPart, result);
        }
      }

      result.indexes.push(index);
    }

    return result;
  },
  _processLongAppointment: function _processLongAppointment(appointment, result) {
    var parts = this.splitAppointmentByDay(appointment);
    var partCount = parts.length;
    var endViewDate = this.invoke('getEndViewDate').getTime();
    var startViewDate = this.invoke('getStartViewDate').getTime();
    var timeZoneCalculator = this.invoke('getTimeZoneCalculator');
    result = result || {
      parts: []
    };

    if (partCount > 1) {
      (0, _extend.extend)(appointment, parts[0]);

      for (var i = 1; i < partCount; i++) {
        var startDate = this.invoke('getField', 'startDate', parts[i].settings).getTime();
        startDate = timeZoneCalculator.createDate(startDate, {
          path: 'toGrid'
        });

        if (startDate < endViewDate && startDate > startViewDate) {
          result.parts.push(parts[i]);
        }
      }
    }

    return result;
  },
  _reduceRecurrenceAppointments: function _reduceRecurrenceAppointments(recurrenceIndexes, appointments) {
    (0, _iterator.each)(recurrenceIndexes, function (i, index) {
      appointments.splice(index - i, 1);
    });
  },
  _combineAppointments: function _combineAppointments(appointments, additionalAppointments) {
    if (additionalAppointments.length) {
      (0, _array.merge)(appointments, additionalAppointments);
    }

    this._sortAppointmentsByStartDate(appointments);
  },
  _applyStartDateToObj: function _applyStartDateToObj(startDate, obj) {
    this.invoke('setField', 'startDate', obj, startDate);
    return obj;
  },
  _applyEndDateToObj: function _applyEndDateToObj(endDate, obj) {
    this.invoke('setField', 'endDate', obj, endDate);
    return obj;
  },
  moveAppointmentBack: function moveAppointmentBack(dragEvent) {
    var $appointment = this._$currentAppointment;
    var size = this._initialSize;
    var coords = this._initialCoordinates;

    if (dragEvent) {
      this._removeDragSourceClassFromDraggedAppointment();

      if ((0, _type.isDeferred)(dragEvent.cancel)) {
        dragEvent.cancel.resolve(true);
      } else {
        dragEvent.cancel = true;
      }
    }

    if ($appointment && !dragEvent) {
      if (coords) {
        (0, _translator.move)($appointment, coords);
        delete this._initialSize;
      }

      if (size) {
        $appointment.outerWidth(size.width);
        $appointment.outerHeight(size.height);
        delete this._initialCoordinates;
      }
    }
  },
  focus: function focus() {
    if (this._$currentAppointment) {
      var focusedElement = (0, _element.getPublicElement)(this._$currentAppointment);
      this.option('focusedElement', focusedElement);

      _events_engine.default.trigger(focusedElement, 'focus');
    }
  },
  splitAppointmentByDay: function splitAppointmentByDay(appointment) {
    var dates = appointment.settings || appointment;
    var originalStartDate = new Date(this.invoke('getField', 'startDate', dates));

    var startDate = _date.default.makeDate(originalStartDate);

    var endDate = _date.default.makeDate(this.invoke('getField', 'endDate', dates));

    var maxAllowedDate = this.invoke('getEndViewDate');
    var startDayHour = this.invoke('getStartDayHour');
    var endDayHour = this.invoke('getEndDayHour');
    var appointmentIsLong = this.invoke('appointmentTakesSeveralDays', appointment);
    var result = [];
    var timeZoneCalculator = this.invoke('getTimeZoneCalculator');
    startDate = timeZoneCalculator.createDate(startDate, {
      path: 'toGrid'
    });
    endDate = timeZoneCalculator.createDate(endDate, {
      path: 'toGrid'
    });

    if (startDate.getHours() <= endDayHour && startDate.getHours() >= startDayHour && !appointmentIsLong) {
      result.push(this._applyStartDateToObj(new Date(startDate), {
        appointmentData: appointment
      }));
      startDate.setDate(startDate.getDate() + 1);
    }

    while (appointmentIsLong && startDate.getTime() < endDate.getTime() && startDate < maxAllowedDate) {
      var currentStartDate = new Date(startDate);
      var currentEndDate = new Date(startDate);

      this._checkStartDate(currentStartDate, originalStartDate, startDayHour);

      this._checkEndDate(currentEndDate, endDate, endDayHour);

      var appointmentData = (0, _object.deepExtendArraySafe)({}, appointment, true);
      var appointmentSettings = {};

      this._applyStartDateToObj(currentStartDate, appointmentSettings);

      this._applyEndDateToObj(currentEndDate, appointmentSettings);

      appointmentData.settings = appointmentSettings;
      result.push(appointmentData);
      startDate = _date.default.trimTime(startDate);
      startDate.setDate(startDate.getDate() + 1);
      startDate.setHours(startDayHour);
    }

    return result;
  },
  _checkStartDate: function _checkStartDate(currentDate, originalDate, startDayHour) {
    if (!_date.default.sameDate(currentDate, originalDate) || currentDate.getHours() <= startDayHour) {
      currentDate.setHours(startDayHour, 0, 0, 0);
    } else {
      currentDate.setHours(originalDate.getHours(), originalDate.getMinutes(), originalDate.getSeconds(), originalDate.getMilliseconds());
    }
  },
  _checkEndDate: function _checkEndDate(currentDate, originalDate, endDayHour) {
    if (!_date.default.sameDate(currentDate, originalDate) || currentDate.getHours() > endDayHour) {
      currentDate.setHours(endDayHour, 0, 0, 0);
    } else {
      currentDate.setHours(originalDate.getHours(), originalDate.getMinutes(), originalDate.getSeconds(), originalDate.getMilliseconds());
    }
  },
  _removeDragSourceClassFromDraggedAppointment: function _removeDragSourceClassFromDraggedAppointment() {
    var $appointments = this._itemElements().filter(".".concat(_constants.APPOINTMENT_DRAG_SOURCE_CLASS));

    $appointments.each(function (_, element) {
      var appointmentInstance = (0, _renderer.default)(element).dxSchedulerAppointment('instance');
      appointmentInstance.option('isDragSource', false);
    });
  },
  _setDragSourceAppointment: function _setDragSourceAppointment(appointment, settings) {
    var $appointments = this._findItemElementByItem(appointment);

    var _settings$info$source = settings.info.sourceAppointment,
        startDate = _settings$info$source.startDate,
        endDate = _settings$info$source.endDate;
    var groupIndex = settings.groupIndex;
    $appointments.forEach(function ($item) {
      var _$item$data = $item.data(_constants.APPOINTMENT_SETTINGS_KEY),
          itemInfo = _$item$data.info,
          itemGroupIndex = _$item$data.groupIndex;

      var _itemInfo$sourceAppoi = itemInfo.sourceAppointment,
          itemStartDate = _itemInfo$sourceAppoi.startDate,
          itemEndDate = _itemInfo$sourceAppoi.endDate;
      var appointmentInstance = $item.dxSchedulerAppointment('instance');
      var isDragSource = startDate.getTime() === itemStartDate.getTime() && endDate.getTime() === itemEndDate.getTime() && groupIndex === itemGroupIndex;
      appointmentInstance.option('isDragSource', isDragSource);
    });
  }
}).include(_uiScheduler.default);

(0, _component_registrator.default)('dxSchedulerAppointments', SchedulerAppointments);
var _default = SchedulerAppointments;
exports.default = _default;
module.exports = exports.default;