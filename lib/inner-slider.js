'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mixinsEventHandlers = require('./mixins/event-handlers');

var _mixinsEventHandlers2 = _interopRequireDefault(_mixinsEventHandlers);

var _mixinsHelpers = require('./mixins/helpers');

var _mixinsHelpers2 = _interopRequireDefault(_mixinsHelpers);

var _initialState = require('./initial-state');

var _initialState2 = _interopRequireDefault(_initialState);

var _defaultProps = require('./default-props');

var _defaultProps2 = _interopRequireDefault(_defaultProps);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _track = require('./track');

var _dots = require('./dots');

var _arrows = require('./arrows');

var InnerSlider = _react2['default'].createClass({
  displayName: 'InnerSlider',

  mixins: [_mixinsHelpers2['default'], _mixinsEventHandlers2['default']],
  getInitialState: function getInitialState() {
    return _initialState2['default'];
  },
  getDefaultProps: function getDefaultProps() {
    return _defaultProps2['default'];
  },
  componentDidMount: function componentDidMount() {
    // Hack for autoplay -- Inspect Later
    this.setState({
      mounted: true
    });
    this.initialize(this.props);
    this.adaptHeight();
  },
  componentDidUpdate: function componentDidUpdate() {
    this.adaptHeight();
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.initialize(nextProps);
  },
  render: function render() {
    var className = (0, _classnames2['default'])('slick-initialized', 'slick-slider', this.props.className);

    var trackProps = {
      infinite: this.props.infinite,
      centerMode: this.props.centerMode,
      currentSlide: this.state.currentSlide,
      slideWidth: this.state.slideWidth,
      slidesToShow: this.props.slidesToShow,
      trackStyle: this.state.trackStyle,
      variableWidth: this.props.variableWidth
    };

    var dots;

    if (this.props.dots === true && this.state.slideCount > this.props.slidesToShow) {
      var dotProps = {
        dotsClass: this.props.dotsClass,
        slideCount: this.state.slideCount,
        slidesToShow: this.props.slidesToShow,
        currentSlide: this.state.currentSlide,
        slidesToScroll: this.props.slidesToScroll,
        clickHandler: this.changeSlide
      };

      dots = _react2['default'].createElement(_dots.Dots, dotProps);
    }

    var prevArrow, nextArrow;

    var arrowProps = {
      infinite: this.props.infinite,
      centerMode: this.props.centerMode,
      currentSlide: this.state.currentSlide,
      slideCount: this.state.slideCount,
      slidesToShow: this.props.slidesToShow,
      prevArrow: this.props.prevArrow,
      nextArrow: this.props.nextArrow,
      clickHandler: this.changeSlide
    };

    if (this.props.arrows) {
      prevArrow = _react2['default'].createElement(_arrows.PrevArrow, arrowProps);
      nextArrow = _react2['default'].createElement(_arrows.NextArrow, arrowProps);
    }

    return _react2['default'].createElement(
      'div',
      { className: className },
      _react2['default'].createElement(
        'div',
        {
          ref: 'list',
          className: 'slick-list',
          onMouseDown: this.swipeStart,
          onMouseMove: this.state.dragging ? this.swipeMove : null,
          onMouseUp: this.swipeEnd,
          onMouseLeave: this.state.dragging ? this.swipeEnd : null,
          onTouchStart: this.swipeStart,
          onTouchMove: this.state.dragging ? this.swipeMove : null,
          onTouchEnd: this.swipeEnd,
          onTouchCancel: this.state.dragging ? this.swipeEnd : null },
        _react2['default'].createElement(
          _track.Track,
          _extends({ ref: 'track' }, trackProps),
          this.props.children
        )
      ),
      prevArrow,
      nextArrow,
      dots
    );
  }
});
exports.InnerSlider = InnerSlider;