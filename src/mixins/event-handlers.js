'use strict';
import {getTrackCSS, getTrackLeft} from './trackHelper';
import assign from 'object-assign';
import defaultProps from '../default-props';


var EventHandlers = {

  componentDidMount: function(){
    var Hammer = require( 'hammerjs' );
    var hammertime = new Hammer(this.getDOMNode());
    hammertime.on("panleft panright", function(ev) {
      ev.preventDefault();
    });
  },

  // Event handler for previous and next
  changeSlide: function (options) {
    var indexOffset, slideOffset, unevenOffset;
    unevenOffset = (this.state.slideCount % this.props.slidesToScroll !== 0);
    indexOffset = unevenOffset ? 0 : (this.state.slideCount - this.state.currentSlide) % this.props.slidesToScroll;

    if (options.message === 'previous') {
      slideOffset = (indexOffset === 0) ? this.props.slidesToScroll : this.props.slidesToShow - indexOffset;
      this.slideHandler(this.state.currentSlide - slideOffset, false);
    } else if (options.message === 'next') {
      slideOffset = (indexOffset === 0) ? this.props.slidesToScroll : indexOffset;
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
  keyHandler: function (e) {

  },
  // Focus on selecting a slide (click handler on track)
  selectHandler: function (e) {

  },
  swipeStart: function (e) {
    var touches, posX, posY;

    if ((this.props.swipe === false) || ('ontouchend' in document && this.props.swipe === false)) {
      return;
    } else if (this.props.draggable === false && e.type.indexOf('mouse') !== -1) {
      return;
    }
    posX = (e.touches !== undefined) ? e.touches[0].pageX : e.clientX;
    posY = (e.touches !== undefined) ? e.touches[0].pageY : e.clientY;
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
  swipeMove: function (e) {
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
    if (swipeDirection === 'vertical' && !defaultProps.vertical) return;

    curLeft = getTrackLeft(assign({
      slideIndex: this.state.currentSlide,
      trackRef: this.refs.track
    }, this.props, this.state));
    touchObject.curX = (e.touches) ? e.touches[0].pageX : e.clientX;
    touchObject.curY = (e.touches) ? e.touches[0].pageY : e.clientY;
    touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(touchObject.curX - touchObject.startX, 2)));

    positionOffset = (this.props.rtl === false ? 1 : -1) * (touchObject.curX > touchObject.startX ? 1 : -1);
    swipeLeft = curLeft + touchObject.swipeLength * positionOffset;
    this.setState({
      touchObject: touchObject,
      swipeLeft: swipeLeft,
      trackStyle: getTrackCSS(assign({left: swipeLeft}, this.props, this.state))
    });

  },

  //
  // SWIPE END METHODS
  //

  handleSwipe: function (swipeDirection) {
    if (swipeDirection === 'left') {
      this.slideHandler(this.state.currentSlide + this.props.slidesToScroll);
    } else if (swipeDirection === 'right') {
      this.slideHandler(this.state.currentSlide - this.props.slidesToScroll);
    } else {
      this.slideHandler(this.state.currentSlide, null, true);
    }
  },

  killSwipe: function () {
    this.setState({
      dragging: false,
      swipeLeft: null,
      touchObject: {}
    });
  },

  //
  // SWIPE END
  //

  swipeEnd: function (e) {
    var touchObject = this.state.touchObject;
    var minSwipe = this.state.listWidth/this.props.touchThreshold;
    var swipeDirection = this.swipeDirection(touchObject);

    // Stop all events
    // e.preventDefault();

    // IF NOT dragging then return false
    if (!this.state.dragging) { return; }

    // Neutralise React swipe event
    this.killSwipe();

    // Fix for #13
    // "I'm trying it with demo page and I can drag but if I click on one of images suddenly dragging is disabled, dots don't respond."
    if (!touchObject.swipeLength) { return; }

    // If the swipe is worth handling then work out what to do with it
    if (touchObject.swipeLength > minSwipe) {
      return this.handleSwipe(swipeDirection);
    }
    
    // If NOT then handle it… I don' know
    this.slideHandler(this.state.currentSlide, null, true);
  }
};

export default EventHandlers;
