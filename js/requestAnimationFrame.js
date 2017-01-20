window.requestNextAnimationFrame = (function () {
    var originalRequestAnimationFrame = undefined,
        wrapper = undefined,
        callback = undefined,
        geckoVersion = null,
        userAgent = navigator.userAgent,
        index = 0,
        self = this;

    wrapper = function (time) {
        time = performance.now();
        self.callback(time);
    };

    /*!
     bug!
     below code:
     when invoke b after 1s, will only invoke b, not invoke a!

     function a(time){
     console.log("a", time);
     webkitRequestAnimationFrame(a);
     }

     function b(time){
     console.log("b", time);
     webkitRequestAnimationFrame(b);
     }

     a();

     setTimeout(b, 1000);



     so use requestAnimationFrame priority!
     */
    if(window.requestAnimationFrame) {
        return requestAnimationFrame;
    }


    // Workaround for Chrome 10 bug where Chrome
    // does not pass the time to the animation function

    if (window.webkitRequestAnimationFrame) {
        // Define the wrapper

        // Make the switch

        originalRequestAnimationFrame = window.webkitRequestAnimationFrame;

        window.webkitRequestAnimationFrame = function (callback, element) {
            self.callback = callback;

            // Browser calls the wrapper and wrapper calls the callback

            return originalRequestAnimationFrame(wrapper, element);
        }
    }

    //修改time参数
    if (window.msRequestAnimationFrame) {
        originalRequestAnimationFrame = window.msRequestAnimationFrame;

        window.msRequestAnimationFrame = function (callback) {
            self.callback = callback;

            return originalRequestAnimationFrame(wrapper);
        }
    }

    // Workaround for Gecko 2.0, which has a bug in
    // mozRequestAnimationFrame() that restricts animations
    // to 30-40 fps.

    if (window.mozRequestAnimationFrame) {
        // Check the Gecko version. Gecko is used by browsers
        // other than Firefox. Gecko 2.0 corresponds to
        // Firefox 4.0.

        index = userAgent.indexOf('rv:');

        if (userAgent.indexOf('Gecko') != -1) {
            geckoVersion = userAgent.substr(index + 3, 3);

            if (geckoVersion === '2.0') {
                // Forces the return statement to fall through
                // to the setTimeout() function.

                window.mozRequestAnimationFrame = undefined;
            }
        }
    }

    return window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||

        function (callback, element) {
            var start,
                finish;

            window.setTimeout(function () {
                start = performance.now();
                callback(start);
                finish = performance.now();

                self.timeout = 1000 / 60 - (finish - start);

            }, self.timeout);
        };
})();


    window.cancelNextRequestAnimationFrame = window.cancelRequestAnimationFrame
        || window.webkitCancelAnimationFrame
        || window.webkitCancelRequestAnimationFrame
        || window.mozCancelRequestAnimationFrame
        || window.oCancelRequestAnimationFrame
        || window.msCancelRequestAnimationFrame
        || clearTimeout;