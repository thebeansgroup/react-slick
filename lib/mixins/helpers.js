'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactLibReactTransitionEvents = require('react/lib/ReactTransitionEvents');

var _reactLibReactTransitionEvents2 = _interopRequireDefault(_reactLibReactTransitionEvents);

var _trackHelper = require('./trackHelper');

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _getBoxWidth = function _getBoxWidth(box) {
  // Check the browser supports the width/height option.
  if (box.getBoundingClientRect().width) return box.getBoundingClientRect().width;
  // No width/height support, so use offsetWidth instead
  return box.offsetWidth;
};

var helpers = {

  initialize: function initialize(props) {
    var slideCount = _react2['default'].Children.count(props.children);
    var listWidth = _getBoxWidth(this.refs.list.getDOMNode());
    var trackWidth = _getBoxWidth(this.refs.track.getDOMNode());
    var slideWidth = _getBoxWidth(this.getDOMNode()) / props.slidesToShow;

    this.setState({
      slideCount: slideCount,
      slideWidth: slideWidth,
      listWidth: listWidth,
      trackWidth: trackWidth,
      currentSlide: props.initialSlide

    }, function () {

      var targetLeft = (0, _trackHelper.getTrackLeft)((0, _objectAssign2['default'])({
        slideIndex: this.state.currentSlide,
        trackRef: this.refs.track
      }, props, this.state));
      // getCSS function needs previously set state
      var trackStyle = (0, _trackHelper.getTrackCSS)((0, _objectAssign2['default'])({ left: targetLeft }, props, this.state));

      this.setState({ trackStyle: trackStyle });

      this.autoPlay(); // once we're set up, trigger the initial autoplay.
    });
  },
  adaptHeight: function adaptHeight() {
    if (this.props.adaptiveHeight) {
      var selector = '[data-index="' + this.state.currentSlide + '"]';
      if (this.refs.list) {
        var slickList = this.refs.list.getDOMNode();
        slickList.style.height = slickList.querySelector(selector).offsetHeight + 'px';
      }
    }
  },
  slideHandler: function slideHandler(index, sync, dontAnimate) {
    var _this = this;

    // Functionality of animateSlide and postSlide is merged into this function
    // console.log('slideHandler', index);
    var targetSlide, currentSlide;
    var targetLeft, currentLeft;

    if (this.state.animating === true) {
      return;
    }

    if (this.props.fade === true || this.state.currentSlide === index) {
      return;
    }

    targetSlide = index;
    if (targetSlide < 0) {
      if (this.state.slideCount % this.props.slidesToScroll !== 0) {
        currentSlide = this.state.slideCount - this.state.slideCount % this.props.slidesToScroll;
      } else {
        currentSlide = this.state.slideCount + targetSlide;
      }
    } else if (targetSlide >= this.state.slideCount) {
      if (this.state.slideCount % this.props.slidesToScroll !== 0) {
        currentSlide = 0;
      } else {
        currentSlide = targetSlide - this.state.slideCount;
      }
    } else {
      currentSlide = targetSlide;
    }

    targetLeft = (0, _trackHelper.getTrackLeft)((0, _objectAssign2['default'])({
      slideIndex: targetSlide,
      trackRef: this.refs.track
    }, this.props, this.state));

    currentLeft = (0, _trackHelper.getTrackLeft)((0, _objectAssign2['default'])({
      slideIndex: currentSlide,
      trackRef: this.refs.track
    }, this.props, this.state));

    if (this.props.infinite === false) {
      targetLeft = currentLeft;
    }

    if (this.props.beforeChange) {
      this.props.beforeChange(currentSlide);
    }

    var nextStateChanges = {
      animating: false,
      trackStyle: (0, _trackHelper.getTrackCSS)((0, _objectAssign2['default'])({ left: currentLeft }, this.props, this.state)),
      swipeLeft: null
    };

    var callback = function callback() {
      _this.setState(nextStateChanges);
      if (_this.props.afterChange) {
        _this.props.afterChange(currentSlide);
      }
      _reactLibReactTransitionEvents2['default'].removeEndEventListener(_this.refs.track.getDOMNode(), callback);
    };

    this.setState({
      animating: true,
      currentSlide: currentSlide,
      currentLeft: currentLeft,
      trackStyle: (0, _trackHelper.getTrackAnimateCSS)((0, _objectAssign2['default'])({ left: targetLeft }, this.props, this.state))
    }, function () {
      _reactLibReactTransitionEvents2['default'].addEndEventListener(this.refs.track.getDOMNode(), callback);
    });

    this.autoPlay();
  },
  swipeDirection: function swipeDirection(touchObject) {
    var xDist, yDist, r, swipeAngle;

    xDist = touchObject.startX - touchObject.curX;
    yDist = touchObject.startY - touchObject.curY;
    r = Math.atan2(yDist, xDist);

    swipeAngle = Math.round(r * 180 / Math.PI);
    if (swipeAngle < 0) {
      swipeAngle = 360 - Math.abs(swipeAngle);
    }
    if (swipeAngle <= 45 && swipeAngle >= 0 || swipeAngle <= 360 && swipeAngle >= 315) {
      return this.props.rtl === false ? 'left' : 'right';
    }
    if (swipeAngle >= 135 && swipeAngle <= 225) {
      return this.props.rtl === false ? 'right' : 'left';
    }

    return 'vertical';
  },
  autoPlay: function autoPlay() {
    var _this2 = this;

    var play = function play() {
      if (_this2.state.mounted) {
        _this2.slideHandler(_this2.state.currentSlide + _this2.props.slidesToScroll);
      }
    };
    if (this.props.autoplay) {
      window.clearTimeout(this.state.autoPlayTimer);
      this.setState({
        autoPlayTimer: window.setTimeout(play, this.props.autoplaySpeed)
      });
    }
  }
};

exports['default'] = helpers;
module.exports = exports['default'];