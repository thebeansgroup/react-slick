'use strict';
Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _trackHelper = require('./trackHelper');

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _defaultProps = require('../default-props');

var _defaultProps2 = _interopRequireDefault(_defaultProps);

var EventHandlers = {
  // Event handler for previous and next
  changeSlide: function changeSlide(options) {
    var indexOffset, slideOffset, unevenOffset;
    unevenOffset = this.state.slideCount % this.props.slidesToScroll !== 0;
    indexOffset = unevenOffset ? 0 : (this.state.slideCount - this.state.currentSlide) % this.props.slidesToScroll;

    if (options.message === 'previous') {
      slideOffset = indexOffset === 0 ? this.props.slidesToScroll : this.props.slidesToShow - indexOffset;
      this.slideHandler(this.state.currentSlide - slideOffset, false);
    } else if (options.message === 'next') {
      slideOffset = indexOffset === 0 ? this.props.slidesToScroll : indexOffset;
      this.slideHandler(this.state.currentSlide + slideOffset, false);
    } else if (options.message === 'dots') {
      // Click on dots
      var targetSlide = options.index * options.slidesToScroll;
      if (targetSlide !== options.currentSlide) {
        this.slideHandler(targetSlide);
      }
    }
  },
  // Accessiblity handler for previous and next
  keyHandler: function keyHandler(e) {},
  // Focus on selecting a slide (click handler on track)
  selectHandler: function selectHandler(e) {},
  swipeStart: function swipeStart(e) {
    var touches, posX, posY;

    if (this.props.swipe === false || 'ontouchend' in document && this.props.swipe === false) {
      return;
    } else if (this.props.draggable === false && e.type.indexOf('mouse') !== -1) {
      return;
    }
    posX = e.touches !== undefined ? e.touches[0].pageX : e.clientX;
    posY = e.touches !== undefined ? e.touches[0].pageY : e.clientY;
    this.setState({
      dragging: true,
      touchObject: {
        startX: posX,
        startY: posY,
        curX: posX,
        curY: posY
      }
    });
  },
  swipeMove: function swipeMove(e) {
    if (!this.state.dragging) {
      return;
    }
    if (this.state.animating) {
      return;
    }
    var swipeLeft;
    var curLeft, positionOffset;
    var touchObject = this.state.touchObject;

    var swipeDirection = this.swipeDirection(touchObject);
    if (swipeDirection === 'vertical' && !_defaultProps2['default'].vertical) return;

    curLeft = (0, _trackHelper.getTrackLeft)((0, _objectAssign2['default'])({
      slideIndex: this.state.currentSlide,
      trackRef: this.refs.track
    }, this.props, this.state));
    touchObject.curX = e.touches ? e.touches[0].pageX : e.clientX;
    touchObject.curY = e.touches ? e.touches[0].pageY : e.clientY;
    touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(touchObject.curX - touchObject.startX, 2)));

    positionOffset = (this.props.rtl === false ? 1 : -1) * (touchObject.curX > touchObject.startX ? 1 : -1);
    swipeLeft = curLeft + touchObject.swipeLength * positionOffset;
    this.setState({
      touchObject: touchObject,
      swipeLeft: swipeLeft,
      trackStyle: (0, _trackHelper.getTrackCSS)((0, _objectAssign2['default'])({ left: swipeLeft }, this.props, this.state))
    });
    e.preventDefault();
  },
  swipeEnd: function swipeEnd(e) {
    e.preventDefault();
    if (!this.state.dragging) {
      return;
    }
    var touchObject = this.state.touchObject;
    var minSwipe = this.state.listWidth / this.props.touchThreshold;
    var swipeDirection = this.swipeDirection(touchObject);
    this.setState({
      dragging: false,
      swipeLeft: null,
      touchObject: {}
    });
    // Fix for #13
    if (!touchObject.swipeLength) {
      return;
    }
    if (touchObject.swipeLength > minSwipe) {
      if (swipeDirection === 'left') {
        this.slideHandler(this.state.currentSlide + this.props.slidesToScroll);
      } else if (swipeDirection === 'right') {
        this.slideHandler(this.state.currentSlide - this.props.slidesToScroll);
      } else {
        this.slideHandler(this.state.currentSlide, null, true);
      }
    } else {
      this.slideHandler(this.state.currentSlide, null, true);
    }
  }
};

exports['default'] = EventHandlers;
module.exports = exports['default'];