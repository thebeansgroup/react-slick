'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactLibCloneWithProps = require('react/lib/cloneWithProps');

var _reactLibCloneWithProps2 = _interopRequireDefault(_reactLibCloneWithProps);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var getSlideClasses = function getSlideClasses(spec) {
  var slickActive, slickCenter, slickCloned;
  var centerOffset;

  slickCloned = spec.index < 0 || spec.index >= spec.slideCount;
  if (spec.centerMode) {
    centerOffset = Math.floor(spec.slidesToShow / 2);
    slickCenter = spec.currentSlide === spec.index;
    if (spec.index > spec.currentSlide - centerOffset - 1 && spec.index <= spec.currentSlide + centerOffset) {
      slickActive = true;
    }
  } else {
    slickActive = spec.currentSlide === spec.index;
  }
  return (0, _classnames2['default'])({
    'slick-slide': true,
    'slick-active': slickActive,
    'slick-center': slickCenter,
    'slick-cloned': slickCloned
  });
};

var renderSlides = function renderSlides(spec) {
  var key;
  var slides = [];
  var preCloneSlides = [];
  var postCloneSlides = [];
  var count = _react2['default'].Children.count(spec.children);

  _react2['default'].Children.forEach(spec.children, function (child, index) {
    var infiniteCount;
    slides.push((0, _reactLibCloneWithProps2['default'])(child, {
      key: index,
      'data-index': index,
      className: getSlideClasses((0, _objectAssign2['default'])({ index: index }, spec)),
      style: (0, _objectAssign2['default'])({}, { width: spec.slideWidth }, child.props.style)
    }));

    // variableWidth doesn't clone children properly. centerMode clones too many
    // children than necessary.
    if (spec.infinite) {
      infiniteCount = spec.slidesToShow;

      if (index >= count - infiniteCount) {
        key = -(count - index);
        preCloneSlides.push((0, _reactLibCloneWithProps2['default'])(child, {
          key: key,
          'data-index': key,
          className: getSlideClasses((0, _objectAssign2['default'])({ index: key }, spec)),
          style: (0, _objectAssign2['default'])({}, { width: spec.slideWidth }, child.props.style)
        }));
      }

      if (index < infiniteCount) {
        key = count + index;
        postCloneSlides.push((0, _reactLibCloneWithProps2['default'])(child, {
          key: key,
          'data-index': key,
          className: getSlideClasses((0, _objectAssign2['default'])({ index: key }, spec)),
          style: (0, _objectAssign2['default'])({}, { width: spec.slideWidth }, child.props.style)
        }));
      }
    }
  });

  return preCloneSlides.concat(slides, postCloneSlides);
};

var Track = _react2['default'].createClass({
  displayName: 'Track',

  render: function render() {
    var slides = renderSlides(this.props);
    return _react2['default'].createElement(
      'div',
      { className: 'slick-track', style: this.props.trackStyle },
      slides
    );
  }
});
exports.Track = Track;