(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Broadcaster", [], factory);
	else if(typeof exports === 'object')
		exports["Broadcaster"] = factory();
	else
		root["Broadcaster"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 34);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),

/***/ 12:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {

(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
        // Callback can either be a function or a string
        if (typeof callback !== "function") {
            callback = new Function("" + callback);
        }
        // Copy function arguments
        var args = new Array(arguments.length - 1);
        for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i + 1];
        }
        // Store and register the task
        var task = { callback: callback, args: args };
        tasksByHandle[nextHandle] = task;
        registerImmediate(nextHandle);
        return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
            case 0:
                callback();
                break;
            case 1:
                callback(args[0]);
                break;
            case 2:
                callback(args[0], args[1]);
                break;
            case 3:
                callback(args[0], args[1], args[2]);
                break;
            default:
                callback.apply(undefined, args);
                break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function registerImmediate(handle) {
            process.nextTick(function () {
                runIfPresent(handle);
            });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function () {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function onGlobalMessage(event) {
            if (event.source === global && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function registerImmediate(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function (event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function registerImmediate(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function registerImmediate(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function registerImmediate(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();
    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();
    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();
    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();
    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
})(typeof self === "undefined" ? typeof global === "undefined" ? undefined : global : self);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(3)))

/***/ }),

/***/ 14:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var scope = typeof global !== "undefined" && global || typeof self !== "undefined" && self || window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function () {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function () {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout = exports.clearInterval = function (timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function () {};
Timeout.prototype.close = function () {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function (item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function (item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function (item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout) item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(12);
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = typeof self !== "undefined" && self.setImmediate || typeof global !== "undefined" && global.setImmediate || undefined && undefined.setImmediate;
exports.clearImmediate = typeof self !== "undefined" && self.clearImmediate || typeof global !== "undefined" && global.clearImmediate || undefined && undefined.clearImmediate;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),

/***/ 31:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Last time updated: 2016-07-03 8:51:35 AM UTC

// links:
// Open-Sourced: https://github.com/streamproc/MediaStreamRecorder
// https://cdn.WebRTC-Experiment.com/MediaStreamRecorder.js
// https://www.WebRTC-Experiment.com/MediaStreamRecorder.js
// npm install msr

//------------------------------------

// Browsers Support::
// Chrome (all versions) [ audio/video separately ]
// Firefox ( >= 29 ) [ audio/video in single webm/mp4 container or only audio in ogg ]
// Opera (all versions) [ same as chrome ]
// Android (Chrome) [ only video ]
// Android (Opera) [ only video ]
// Android (Firefox) [ only video ]
// Microsoft Edge (Only Audio & Gif)

//------------------------------------
// Muaz Khan     - www.MuazKhan.com
// MIT License   - www.WebRTC-Experiment.com/licence
//------------------------------------

// ______________________
// MediaStreamRecorder.js

function MediaStreamRecorder(mediaStream) {
    if (!mediaStream) {
        throw 'MediaStream is mandatory.';
    }

    // void start(optional long timeSlice)
    // timestamp to fire "ondataavailable"
    this.start = function (timeSlice) {
        var Recorder;

        if (typeof MediaRecorder !== 'undefined') {
            Recorder = MediaRecorderWrapper;
        } else if (IsChrome || IsOpera || IsEdge) {
            if (this.mimeType.indexOf('video') !== -1) {
                Recorder = WhammyRecorder;
            } else if (this.mimeType.indexOf('audio') !== -1) {
                Recorder = StereoAudioRecorder;
            }
        }

        // video recorder (in GIF format)
        if (this.mimeType === 'image/gif') {
            Recorder = GifRecorder;
        }

        // audio/wav is supported only via StereoAudioRecorder
        // audio/pcm (int16) is supported only via StereoAudioRecorder
        if (this.mimeType === 'audio/wav' || this.mimeType === 'audio/pcm') {
            Recorder = StereoAudioRecorder;
        }

        // allows forcing StereoAudioRecorder.js on Edge/Firefox
        if (this.recorderType) {
            Recorder = this.recorderType;
        }

        mediaRecorder = new Recorder(mediaStream);
        mediaRecorder.blobs = [];

        var self = this;
        mediaRecorder.ondataavailable = function (data) {
            mediaRecorder.blobs.push(data);
            self.ondataavailable(data);
        };
        mediaRecorder.onstop = this.onstop;
        mediaRecorder.onStartedDrawingNonBlankFrames = this.onStartedDrawingNonBlankFrames;

        // Merge all data-types except "function"
        mediaRecorder = mergeProps(mediaRecorder, this);

        mediaRecorder.start(timeSlice);
    };

    this.onStartedDrawingNonBlankFrames = function () {};
    this.clearOldRecordedFrames = function () {
        if (!mediaRecorder) {
            return;
        }

        mediaRecorder.clearOldRecordedFrames();
    };

    this.stop = function () {
        if (mediaRecorder) {
            mediaRecorder.stop();
        }
    };

    this.ondataavailable = function (blob) {
        console.log('ondataavailable..', blob);
    };

    this.onstop = function (error) {
        console.warn('stopped..', error);
    };

    this.save = function (file, fileName) {
        if (!file) {
            if (!mediaRecorder) {
                return;
            }

            ConcatenateBlobs(mediaRecorder.blobs, mediaRecorder.blobs[0].type, function (concatenatedBlob) {
                invokeSaveAsDialog(concatenatedBlob);
            });
            return;
        }
        invokeSaveAsDialog(file, fileName);
    };

    this.pause = function () {
        if (!mediaRecorder) {
            return;
        }
        mediaRecorder.pause();
        console.log('Paused recording.', this.mimeType || mediaRecorder.mimeType);
    };

    this.resume = function () {
        if (!mediaRecorder) {
            return;
        }
        mediaRecorder.resume();
        console.log('Resumed recording.', this.mimeType || mediaRecorder.mimeType);
    };

    // StereoAudioRecorder || WhammyRecorder || MediaRecorderWrapper || GifRecorder
    this.recorderType = null;

    // video/webm or audio/webm or audio/ogg or audio/wav
    this.mimeType = 'video/webm';

    // logs are enabled by default
    this.disableLogs = false;

    // Reference to "MediaRecorder.js"
    var mediaRecorder;
}

// ______________________
// MultiStreamRecorder.js

function MultiStreamRecorder(mediaStream) {
    if (!mediaStream) {
        throw 'MediaStream is mandatory.';
    }

    var self = this;
    var isMediaRecorder = isMediaRecorderCompatible();

    this.stream = mediaStream;

    // void start(optional long timeSlice)
    // timestamp to fire "ondataavailable"
    this.start = function (timeSlice) {
        audioRecorder = new MediaStreamRecorder(mediaStream);
        videoRecorder = new MediaStreamRecorder(mediaStream);

        audioRecorder.mimeType = 'audio/ogg';
        videoRecorder.mimeType = 'video/webm';

        for (var prop in this) {
            if (typeof this[prop] !== 'function') {
                audioRecorder[prop] = videoRecorder[prop] = this[prop];
            }
        }

        audioRecorder.ondataavailable = function (blob) {
            if (!audioVideoBlobs[recordingInterval]) {
                audioVideoBlobs[recordingInterval] = {};
            }

            audioVideoBlobs[recordingInterval].audio = blob;

            if (audioVideoBlobs[recordingInterval].video && !audioVideoBlobs[recordingInterval].onDataAvailableEventFired) {
                audioVideoBlobs[recordingInterval].onDataAvailableEventFired = true;
                fireOnDataAvailableEvent(audioVideoBlobs[recordingInterval]);
            }
        };

        videoRecorder.ondataavailable = function (blob) {
            if (isMediaRecorder) {
                return self.ondataavailable({
                    video: blob,
                    audio: blob
                });
            }

            if (!audioVideoBlobs[recordingInterval]) {
                audioVideoBlobs[recordingInterval] = {};
            }

            audioVideoBlobs[recordingInterval].video = blob;

            if (audioVideoBlobs[recordingInterval].audio && !audioVideoBlobs[recordingInterval].onDataAvailableEventFired) {
                audioVideoBlobs[recordingInterval].onDataAvailableEventFired = true;
                fireOnDataAvailableEvent(audioVideoBlobs[recordingInterval]);
            }
        };

        function fireOnDataAvailableEvent(blobs) {
            recordingInterval++;
            self.ondataavailable(blobs);
        }

        videoRecorder.onstop = audioRecorder.onstop = function (error) {
            self.onstop(error);
        };

        if (!isMediaRecorder) {
            // to make sure both audio/video are synced.
            videoRecorder.onStartedDrawingNonBlankFrames = function () {
                videoRecorder.clearOldRecordedFrames();
                audioRecorder.start(timeSlice);
            };
            videoRecorder.start(timeSlice);
        } else {
            videoRecorder.start(timeSlice);
        }
    };

    this.stop = function () {
        if (audioRecorder) {
            audioRecorder.stop();
        }
        if (videoRecorder) {
            videoRecorder.stop();
        }
    };

    this.ondataavailable = function (blob) {
        console.log('ondataavailable..', blob);
    };

    this.onstop = function (error) {
        console.warn('stopped..', error);
    };

    this.pause = function () {
        if (audioRecorder) {
            audioRecorder.pause();
        }
        if (videoRecorder) {
            videoRecorder.pause();
        }
    };

    this.resume = function () {
        if (audioRecorder) {
            audioRecorder.resume();
        }
        if (videoRecorder) {
            videoRecorder.resume();
        }
    };

    var audioRecorder;
    var videoRecorder;

    var audioVideoBlobs = {};
    var recordingInterval = 0;
}

if (typeof MediaStreamRecorder !== 'undefined') {
    MediaStreamRecorder.MultiStreamRecorder = MultiStreamRecorder;
}

// _____________________________
// Cross-Browser-Declarations.js

var browserFakeUserAgent = 'Fake/5.0 (FakeOS) AppleWebKit/123 (KHTML, like Gecko) Fake/12.3.4567.89 Fake/123.45';

(function (that) {
    if (typeof window !== 'undefined') {
        return;
    }

    if (typeof window === 'undefined' && typeof global !== 'undefined') {
        global.navigator = {
            userAgent: browserFakeUserAgent,
            getUserMedia: function getUserMedia() {}
        };

        /*global window:true */
        that.window = global;
    } else if (typeof window === 'undefined') {
        // window = this;
    }

    if (typeof document === 'undefined') {
        /*global document:true */
        that.document = {};

        document.createElement = document.captureStream = document.mozCaptureStream = function () {
            return {};
        };
    }

    if (typeof location === 'undefined') {
        /*global location:true */
        that.location = {
            protocol: 'file:',
            href: '',
            hash: ''
        };
    }

    if (typeof screen === 'undefined') {
        /*global screen:true */
        that.screen = {
            width: 0,
            height: 0
        };
    }
})(typeof global !== 'undefined' ? global : window);

// WebAudio API representer
var AudioContext = window.AudioContext;

if (typeof AudioContext === 'undefined') {
    if (typeof webkitAudioContext !== 'undefined') {
        /*global AudioContext:true */
        AudioContext = webkitAudioContext;
    }

    if (typeof mozAudioContext !== 'undefined') {
        /*global AudioContext:true */
        AudioContext = mozAudioContext;
    }
}

if (typeof window === 'undefined') {
    /*jshint -W020 */
    window = {};
}

// WebAudio API representer
var AudioContext = window.AudioContext;

if (typeof AudioContext === 'undefined') {
    if (typeof webkitAudioContext !== 'undefined') {
        /*global AudioContext:true */
        AudioContext = webkitAudioContext;
    }

    if (typeof mozAudioContext !== 'undefined') {
        /*global AudioContext:true */
        AudioContext = mozAudioContext;
    }
}

/*jshint -W079 */
var URL = window.URL;

if (typeof URL === 'undefined' && typeof webkitURL !== 'undefined') {
    /*global URL:true */
    URL = webkitURL;
}

if (typeof navigator !== 'undefined') {
    if (typeof navigator.webkitGetUserMedia !== 'undefined') {
        navigator.getUserMedia = navigator.webkitGetUserMedia;
    }

    if (typeof navigator.mozGetUserMedia !== 'undefined') {
        navigator.getUserMedia = navigator.mozGetUserMedia;
    }
} else {
    navigator = {
        getUserMedia: function getUserMedia() {},
        userAgent: browserFakeUserAgent
    };
}

var IsEdge = navigator.userAgent.indexOf('Edge') !== -1 && (!!navigator.msSaveBlob || !!navigator.msSaveOrOpenBlob);

var IsOpera = false;
if (typeof opera !== 'undefined' && navigator.userAgent && navigator.userAgent.indexOf('OPR/') !== -1) {
    IsOpera = true;
}
var IsChrome = !IsEdge && !IsEdge && !!navigator.webkitGetUserMedia;

var MediaStream = window.MediaStream;

if (typeof MediaStream === 'undefined' && typeof webkitMediaStream !== 'undefined') {
    MediaStream = webkitMediaStream;
}

/*global MediaStream:true */
if (typeof MediaStream !== 'undefined') {
    if (!('getVideoTracks' in MediaStream.prototype)) {
        MediaStream.prototype.getVideoTracks = function () {
            if (!this.getTracks) {
                return [];
            }

            var tracks = [];
            this.getTracks.forEach(function (track) {
                if (track.kind.toString().indexOf('video') !== -1) {
                    tracks.push(track);
                }
            });
            return tracks;
        };

        MediaStream.prototype.getAudioTracks = function () {
            if (!this.getTracks) {
                return [];
            }

            var tracks = [];
            this.getTracks.forEach(function (track) {
                if (track.kind.toString().indexOf('audio') !== -1) {
                    tracks.push(track);
                }
            });
            return tracks;
        };
    }

    if (!('stop' in MediaStream.prototype)) {
        MediaStream.prototype.stop = function () {
            this.getAudioTracks().forEach(function (track) {
                if (!!track.stop) {
                    track.stop();
                }
            });

            this.getVideoTracks().forEach(function (track) {
                if (!!track.stop) {
                    track.stop();
                }
            });
        };
    }
}

if (typeof location !== 'undefined') {
    if (location.href.indexOf('file:') === 0) {
        console.error('Please load this HTML file on HTTP or HTTPS.');
    }
}

// Merge all other data-types except "function"

function mergeProps(mergein, mergeto) {
    for (var t in mergeto) {
        if (typeof mergeto[t] !== 'function') {
            mergein[t] = mergeto[t];
        }
    }
    return mergein;
}

// "dropFirstFrame" has been added by Graham Roth
// https://github.com/gsroth

function dropFirstFrame(arr) {
    arr.shift();
    return arr;
}

/**
 * @param {Blob} file - File or Blob object. This parameter is required.
 * @param {string} fileName - Optional file name e.g. "Recorded-Video.webm"
 * @example
 * invokeSaveAsDialog(blob or file, [optional] fileName);
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 */
function invokeSaveAsDialog(file, fileName) {
    if (!file) {
        throw 'Blob object is required.';
    }

    if (!file.type) {
        try {
            file.type = 'video/webm';
        } catch (e) {}
    }

    var fileExtension = (file.type || 'video/webm').split('/')[1];

    if (fileName && fileName.indexOf('.') !== -1) {
        var splitted = fileName.split('.');
        fileName = splitted[0];
        fileExtension = splitted[1];
    }

    var fileFullName = (fileName || Math.round(Math.random() * 9999999999) + 888888888) + '.' + fileExtension;

    if (typeof navigator.msSaveOrOpenBlob !== 'undefined') {
        return navigator.msSaveOrOpenBlob(file, fileFullName);
    } else if (typeof navigator.msSaveBlob !== 'undefined') {
        return navigator.msSaveBlob(file, fileFullName);
    }

    var hyperlink = document.createElement('a');
    hyperlink.href = URL.createObjectURL(file);
    hyperlink.target = '_blank';
    hyperlink.download = fileFullName;

    if (!!navigator.mozGetUserMedia) {
        hyperlink.onclick = function () {
            (document.body || document.documentElement).removeChild(hyperlink);
        };
        (document.body || document.documentElement).appendChild(hyperlink);
    }

    var evt = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
    });

    hyperlink.dispatchEvent(evt);

    if (!navigator.mozGetUserMedia) {
        URL.revokeObjectURL(hyperlink.href);
    }
}

function bytesToSize(bytes) {
    var k = 1000;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) {
        return '0 Bytes';
    }
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

// ______________ (used to handle stuff like http://goo.gl/xmE5eg) issue #129
// ObjectStore.js
var ObjectStore = {
    AudioContext: AudioContext
};

function isMediaRecorderCompatible() {
    var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    var isChrome = !!window.chrome && !isOpera;
    var isFirefox = typeof window.InstallTrigger !== 'undefined';

    if (isFirefox) {
        return true;
    }

    if (!isChrome) {
        return false;
    }

    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var fullVersion = '' + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    if (isChrome) {
        verOffset = nAgt.indexOf('Chrome');
        fullVersion = nAgt.substring(verOffset + 7);
    }

    // trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(';')) !== -1) {
        fullVersion = fullVersion.substring(0, ix);
    }

    if ((ix = fullVersion.indexOf(' ')) !== -1) {
        fullVersion = fullVersion.substring(0, ix);
    }

    majorVersion = parseInt('' + fullVersion, 10);

    if (isNaN(majorVersion)) {
        fullVersion = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
    }

    return majorVersion >= 49;
}

// ______________ (used to handle stuff like http://goo.gl/xmE5eg) issue #129
// ObjectStore.js
var ObjectStore = {
    AudioContext: window.AudioContext || window.webkitAudioContext
};

// ==================
// MediaRecorder.js

/**
 * Implementation of https://dvcs.w3.org/hg/dap/raw-file/default/media-stream-capture/MediaRecorder.html
 * The MediaRecorder accepts a mediaStream as input source passed from UA. When recorder starts,
 * a MediaEncoder will be created and accept the mediaStream as input source.
 * Encoder will get the raw data by track data changes, encode it by selected MIME Type, then store the encoded in EncodedBufferCache object.
 * The encoded data will be extracted on every timeslice passed from Start function call or by RequestData function.
 * Thread model:
 * When the recorder starts, it creates a "Media Encoder" thread to read data from MediaEncoder object and store buffer in EncodedBufferCache object.
 * Also extract the encoded data and create blobs on every timeslice passed from start function or RequestData function called by UA.
 */

function MediaRecorderWrapper(mediaStream) {
    var self = this;

    /**
     * This method records MediaStream.
     * @method
     * @memberof MediaStreamRecorder
     * @example
     * recorder.record();
     */
    this.start = function (timeSlice, __disableLogs) {
        if (!self.mimeType) {
            self.mimeType = 'video/webm';
        }

        if (self.mimeType.indexOf('audio') !== -1) {
            if (mediaStream.getVideoTracks().length && mediaStream.getAudioTracks().length) {
                var stream;
                if (!!navigator.mozGetUserMedia) {
                    stream = new MediaStream();
                    stream.addTrack(mediaStream.getAudioTracks()[0]);
                } else {
                    // webkitMediaStream
                    stream = new MediaStream(mediaStream.getAudioTracks());
                }
                mediaStream = stream;
            }
        }

        if (self.mimeType.indexOf('audio') !== -1) {
            self.mimeType = IsChrome ? 'audio/webm' : 'audio/ogg';
        }

        self.dontFireOnDataAvailableEvent = false;

        var recorderHints = {
            mimeType: self.mimeType
        };

        if (!self.disableLogs && !__disableLogs) {
            console.log('Passing following params over MediaRecorder API.', recorderHints);
        }

        if (mediaRecorder) {
            // mandatory to make sure Firefox doesn't fails to record streams 3-4 times without reloading the page.
            mediaRecorder = null;
        }

        if (IsChrome && !isMediaRecorderCompatible()) {
            // to support video-only recording on stable
            recorderHints = 'video/vp8';
        }

        // http://dxr.mozilla.org/mozilla-central/source/content/media/MediaRecorder.cpp
        // https://wiki.mozilla.org/Gecko:MediaRecorder
        // https://dvcs.w3.org/hg/dap/raw-file/default/media-stream-capture/MediaRecorder.html

        // starting a recording session; which will initiate "Reading Thread"
        // "Reading Thread" are used to prevent main-thread blocking scenarios
        try {
            mediaRecorder = new MediaRecorder(mediaStream, recorderHints);
        } catch (e) {
            // if someone passed NON_supported mimeType
            // or if Firefox on Android
            mediaRecorder = new MediaRecorder(mediaStream);
        }

        if ('canRecordMimeType' in mediaRecorder && mediaRecorder.canRecordMimeType(self.mimeType) === false) {
            if (!self.disableLogs) {
                console.warn('MediaRecorder API seems unable to record mimeType:', self.mimeType);
            }
        }

        // i.e. stop recording when <video> is paused by the user; and auto restart recording 
        // when video is resumed. E.g. yourStream.getVideoTracks()[0].muted = true; // it will auto-stop recording.
        mediaRecorder.ignoreMutedMedia = self.ignoreMutedMedia || false;

        var firedOnDataAvailableOnce = false;

        // Dispatching OnDataAvailable Handler
        mediaRecorder.ondataavailable = function (e) {
            if (self.dontFireOnDataAvailableEvent) {
                return;
            }

            // how to fix FF-corrupt-webm issues?
            // should we leave this?          e.data.size < 26800
            if (!e.data || !e.data.size || e.data.size < 26800 || firedOnDataAvailableOnce) {
                return;
            }

            firedOnDataAvailableOnce = true;

            var blob = self.getNativeBlob ? e.data : new Blob([e.data], {
                type: self.mimeType || 'video/webm'
            });

            self.ondataavailable(blob);

            self.dontFireOnDataAvailableEvent = true;

            if (!!mediaRecorder) {
                mediaRecorder.stop();
                mediaRecorder = null;
            }

            // record next interval
            self.start(timeSlice, '__disableLogs');
        };

        mediaRecorder.onerror = function (error) {
            if (!self.disableLogs) {
                if (error.name === 'InvalidState') {
                    console.error('The MediaRecorder is not in a state in which the proposed operation is allowed to be executed.');
                } else if (error.name === 'OutOfMemory') {
                    console.error('The UA has exhaused the available memory. User agents SHOULD provide as much additional information as possible in the message attribute.');
                } else if (error.name === 'IllegalStreamModification') {
                    console.error('A modification to the stream has occurred that makes it impossible to continue recording. An example would be the addition of a Track while recording is occurring. User agents SHOULD provide as much additional information as possible in the message attribute.');
                } else if (error.name === 'OtherRecordingError') {
                    console.error('Used for an fatal error other than those listed above. User agents SHOULD provide as much additional information as possible in the message attribute.');
                } else if (error.name === 'GenericError') {
                    console.error('The UA cannot provide the codec or recording option that has been requested.', error);
                } else {
                    console.error('MediaRecorder Error', error);
                }
            }

            // When the stream is "ended" set recording to 'inactive' 
            // and stop gathering data. Callers should not rely on 
            // exactness of the timeSlice value, especially 
            // if the timeSlice value is small. Callers should 
            // consider timeSlice as a minimum value

            if (!!mediaRecorder && mediaRecorder.state !== 'inactive' && mediaRecorder.state !== 'stopped') {
                mediaRecorder.stop();
            }
        };

        // void start(optional long mTimeSlice)
        // The interval of passing encoded data from EncodedBufferCache to onDataAvailable
        // handler. "mTimeSlice < 0" means Session object does not push encoded data to
        // onDataAvailable, instead, it passive wait the client side pull encoded data
        // by calling requestData API.
        try {
            mediaRecorder.start(3.6e+6);
        } catch (e) {
            mediaRecorder = null;
        }

        setTimeout(function () {
            if (!mediaRecorder) {
                return;
            }

            if (mediaRecorder.state === 'recording') {
                // "stop" method auto invokes "requestData"!
                mediaRecorder.requestData();
                // mediaRecorder.stop();
            }
        }, timeSlice);

        // Start recording. If timeSlice has been provided, mediaRecorder will
        // raise a dataavailable event containing the Blob of collected data on every timeSlice milliseconds.
        // If timeSlice isn't provided, UA should call the RequestData to obtain the Blob data, also set the mTimeSlice to zero.
    };

    /**
     * This method stops recording MediaStream.
     * @param {function} callback - Callback function, that is used to pass recorded blob back to the callee.
     * @method
     * @memberof MediaStreamRecorder
     * @example
     * recorder.stop(function(blob) {
     *     video.src = URL.createObjectURL(blob);
     * });
     */
    this.stop = function (callback) {
        if (!mediaRecorder) {
            return;
        }

        // mediaRecorder.state === 'recording' means that media recorder is associated with "session"
        // mediaRecorder.state === 'stopped' means that media recorder is detached from the "session" ... in this case; "session" will also be deleted.

        if (mediaRecorder.state === 'recording') {
            // "stop" method auto invokes "requestData"!
            mediaRecorder.requestData();

            setTimeout(function () {
                self.dontFireOnDataAvailableEvent = true;
                if (!!mediaRecorder && mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                }
                mediaRecorder = null;
            }, 2000);
        }
    };

    /**
     * This method pauses the recording process.
     * @method
     * @memberof MediaStreamRecorder
     * @example
     * recorder.pause();
     */
    this.pause = function () {
        if (!mediaRecorder) {
            return;
        }

        if (mediaRecorder.state === 'recording') {
            mediaRecorder.pause();
        }
    };

    /**
     * The recorded blobs are passed over this event.
     * @event
     * @memberof MediaStreamRecorder
     * @example
     * recorder.ondataavailable = function(data) {};
     */
    this.ondataavailable = function (blob) {
        console.log('recorded-blob', blob);
    };

    /**
     * This method resumes the recording process.
     * @method
     * @memberof MediaStreamRecorder
     * @example
     * recorder.resume();
     */
    this.resume = function () {
        if (this.dontFireOnDataAvailableEvent) {
            this.dontFireOnDataAvailableEvent = false;

            var disableLogs = self.disableLogs;
            self.disableLogs = true;
            this.record();
            self.disableLogs = disableLogs;
            return;
        }

        if (!mediaRecorder) {
            return;
        }

        if (mediaRecorder.state === 'paused') {
            mediaRecorder.resume();
        }
    };

    /**
     * This method resets currently recorded data.
     * @method
     * @memberof MediaStreamRecorder
     * @example
     * recorder.clearRecordedData();
     */
    this.clearRecordedData = function () {
        if (!mediaRecorder) {
            return;
        }

        this.pause();

        this.dontFireOnDataAvailableEvent = true;
        this.stop();
    };

    // Reference to "MediaRecorder" object
    var mediaRecorder;

    function isMediaStreamActive() {
        if ('active' in mediaStream) {
            if (!mediaStream.active) {
                return false;
            }
        } else if ('ended' in mediaStream) {
            // old hack
            if (mediaStream.ended) {
                return false;
            }
        }
        return true;
    }

    // this method checks if media stream is stopped
    // or any track is ended.
    (function looper() {
        if (!mediaRecorder) {
            return;
        }

        if (isMediaStreamActive() === false) {
            self.stop();
            return;
        }

        setTimeout(looper, 1000); // check every second
    })();
}

if (typeof MediaStreamRecorder !== 'undefined') {
    MediaStreamRecorder.MediaRecorderWrapper = MediaRecorderWrapper;
}

// ======================
// StereoAudioRecorder.js

function StereoAudioRecorder(mediaStream) {
    // void start(optional long timeSlice)
    // timestamp to fire "ondataavailable"
    this.start = function (timeSlice) {
        timeSlice = timeSlice || 1000;

        mediaRecorder = new StereoAudioRecorderHelper(mediaStream, this);

        mediaRecorder.record();

        timeout = setInterval(function () {
            mediaRecorder.requestData();
        }, timeSlice);
    };

    this.stop = function () {
        if (mediaRecorder) {
            mediaRecorder.stop();
            clearTimeout(timeout);
        }
    };

    this.pause = function () {
        if (!mediaRecorder) {
            return;
        }

        mediaRecorder.pause();
    };

    this.resume = function () {
        if (!mediaRecorder) {
            return;
        }

        mediaRecorder.resume();
    };

    this.ondataavailable = function () {};

    // Reference to "StereoAudioRecorder" object
    var mediaRecorder;
    var timeout;
}

if (typeof MediaStreamRecorder !== 'undefined') {
    MediaStreamRecorder.StereoAudioRecorder = StereoAudioRecorder;
}

// ============================
// StereoAudioRecorderHelper.js

// source code from: http://typedarray.org/wp-content/projects/WebAudioRecorder/script.js

function StereoAudioRecorderHelper(mediaStream, root) {

    // variables    
    var deviceSampleRate = 44100; // range: 22050 to 96000

    if (!ObjectStore.AudioContextConstructor) {
        ObjectStore.AudioContextConstructor = new ObjectStore.AudioContext();
    }

    // check device sample rate
    deviceSampleRate = ObjectStore.AudioContextConstructor.sampleRate;

    var leftchannel = [];
    var rightchannel = [];
    var scriptprocessornode;
    var recording = false;
    var recordingLength = 0;
    var volume;
    var audioInput;
    var sampleRate = root.sampleRate || deviceSampleRate;

    var mimeType = root.mimeType || 'audio/wav';
    var isPCM = mimeType.indexOf('audio/pcm') > -1;

    var context;

    var numChannels = root.audioChannels || 2;

    this.record = function () {
        recording = true;
        // reset the buffers for the new recording
        leftchannel.length = rightchannel.length = 0;
        recordingLength = 0;
    };

    this.requestData = function () {
        if (isPaused) {
            return;
        }

        if (recordingLength === 0) {
            requestDataInvoked = false;
            return;
        }

        requestDataInvoked = true;
        // clone stuff
        var internalLeftChannel = leftchannel.slice(0);
        var internalRightChannel = rightchannel.slice(0);
        var internalRecordingLength = recordingLength;

        // reset the buffers for the new recording
        leftchannel.length = rightchannel.length = [];
        recordingLength = 0;
        requestDataInvoked = false;

        // we flat the left and right channels down
        var leftBuffer = mergeBuffers(internalLeftChannel, internalRecordingLength);

        var interleaved = leftBuffer;

        // we interleave both channels together
        if (numChannels === 2) {
            var rightBuffer = mergeBuffers(internalRightChannel, internalRecordingLength); // bug fixed via #70,#71
            interleaved = interleave(leftBuffer, rightBuffer);
        }

        if (isPCM) {
            // our final binary blob
            var blob = new Blob([convertoFloat32ToInt16(interleaved)], {
                type: 'audio/pcm'
            });

            console.debug('audio recorded blob size:', bytesToSize(blob.size));
            root.ondataavailable(blob);
            return;
        }

        // we create our wav file
        var buffer = new ArrayBuffer(44 + interleaved.length * 2);
        var view = new DataView(buffer);

        // RIFF chunk descriptor
        writeUTFBytes(view, 0, 'RIFF');

        // -8 (via #97)
        view.setUint32(4, 44 + interleaved.length * 2 - 8, true);

        writeUTFBytes(view, 8, 'WAVE');
        // FMT sub-chunk
        writeUTFBytes(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        // stereo (2 channels)
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * numChannels * 2, true); // numChannels * 2 (via #71)
        view.setUint16(32, numChannels * 2, true);
        view.setUint16(34, 16, true);
        // data sub-chunk
        writeUTFBytes(view, 36, 'data');
        view.setUint32(40, interleaved.length * 2, true);

        // write the PCM samples
        var lng = interleaved.length;
        var index = 44;
        var volume = 1;
        for (var i = 0; i < lng; i++) {
            view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
            index += 2;
        }

        // our final binary blob
        var blob = new Blob([view], {
            type: 'audio/wav'
        });

        console.debug('audio recorded blob size:', bytesToSize(blob.size));

        root.ondataavailable(blob);
    };

    this.stop = function () {
        // we stop recording
        recording = false;
        this.requestData();

        audioInput.disconnect();
    };

    function interleave(leftChannel, rightChannel) {
        var length = leftChannel.length + rightChannel.length;
        var result = new Float32Array(length);

        var inputIndex = 0;

        for (var index = 0; index < length;) {
            result[index++] = leftChannel[inputIndex];
            result[index++] = rightChannel[inputIndex];
            inputIndex++;
        }
        return result;
    }

    function mergeBuffers(channelBuffer, recordingLength) {
        var result = new Float32Array(recordingLength);
        var offset = 0;
        var lng = channelBuffer.length;
        for (var i = 0; i < lng; i++) {
            var buffer = channelBuffer[i];
            result.set(buffer, offset);
            offset += buffer.length;
        }
        return result;
    }

    function writeUTFBytes(view, offset, string) {
        var lng = string.length;
        for (var i = 0; i < lng; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    function convertoFloat32ToInt16(buffer) {
        var l = buffer.length;
        var buf = new Int16Array(l);

        while (l--) {
            buf[l] = buffer[l] * 0xFFFF; //convert to 16 bit
        }
        return buf.buffer;
    }

    // creates the audio context
    var context = ObjectStore.AudioContextConstructor;

    // creates a gain node
    ObjectStore.VolumeGainNode = context.createGain();

    var volume = ObjectStore.VolumeGainNode;

    // creates an audio node from the microphone incoming stream
    ObjectStore.AudioInput = context.createMediaStreamSource(mediaStream);

    // creates an audio node from the microphone incoming stream
    var audioInput = ObjectStore.AudioInput;

    // connect the stream to the gain node
    audioInput.connect(volume);

    /* From the spec: This value controls how frequently the audioprocess event is
    dispatched and how many sample-frames need to be processed each call.
    Lower values for buffer size will result in a lower (better) latency.
    Higher values will be necessary to avoid audio breakup and glitches 
    Legal values are 256, 512, 1024, 2048, 4096, 8192, and 16384.*/
    var bufferSize = root.bufferSize || 2048;
    if (root.bufferSize === 0) {
        bufferSize = 0;
    }

    if (context.createJavaScriptNode) {
        scriptprocessornode = context.createJavaScriptNode(bufferSize, numChannels, numChannels);
    } else if (context.createScriptProcessor) {
        scriptprocessornode = context.createScriptProcessor(bufferSize, numChannels, numChannels);
    } else {
        throw 'WebAudio API has no support on this browser.';
    }

    bufferSize = scriptprocessornode.bufferSize;

    console.debug('using audio buffer-size:', bufferSize);

    var requestDataInvoked = false;

    // sometimes "scriptprocessornode" disconnects from he destination-node
    // and there is no exception thrown in this case.
    // and obviously no further "ondataavailable" events will be emitted.
    // below global-scope variable is added to debug such unexpected but "rare" cases.
    window.scriptprocessornode = scriptprocessornode;

    if (numChannels === 1) {
        console.debug('All right-channels are skipped.');
    }

    var isPaused = false;

    this.pause = function () {
        isPaused = true;
    };

    this.resume = function () {
        isPaused = false;
    };

    // http://webaudio.github.io/web-audio-api/#the-scriptprocessornode-interface
    scriptprocessornode.onaudioprocess = function (e) {
        if (!recording || requestDataInvoked || isPaused) {
            return;
        }

        var left = e.inputBuffer.getChannelData(0);
        leftchannel.push(new Float32Array(left));

        if (numChannels === 2) {
            var right = e.inputBuffer.getChannelData(1);
            rightchannel.push(new Float32Array(right));
        }
        recordingLength += bufferSize;
    };

    volume.connect(scriptprocessornode);
    scriptprocessornode.connect(context.destination);
}

if (typeof MediaStreamRecorder !== 'undefined') {
    MediaStreamRecorder.StereoAudioRecorderHelper = StereoAudioRecorderHelper;
}

// ===================
// WhammyRecorder.js

function WhammyRecorder(mediaStream) {
    // void start(optional long timeSlice)
    // timestamp to fire "ondataavailable"
    this.start = function (timeSlice) {
        timeSlice = timeSlice || 1000;

        mediaRecorder = new WhammyRecorderHelper(mediaStream, this);

        for (var prop in this) {
            if (typeof this[prop] !== 'function') {
                mediaRecorder[prop] = this[prop];
            }
        }

        mediaRecorder.record();

        timeout = setInterval(function () {
            mediaRecorder.requestData();
        }, timeSlice);
    };

    this.stop = function () {
        if (mediaRecorder) {
            mediaRecorder.stop();
            clearTimeout(timeout);
        }
    };

    this.clearOldRecordedFrames = function () {
        if (mediaRecorder) {
            mediaRecorder.clearOldRecordedFrames();
        }
    };

    this.pause = function () {
        if (!mediaRecorder) {
            return;
        }

        mediaRecorder.pause();
    };

    this.resume = function () {
        if (!mediaRecorder) {
            return;
        }

        mediaRecorder.resume();
    };

    this.ondataavailable = function () {};

    // Reference to "WhammyRecorder" object
    var mediaRecorder;
    var timeout;
}

if (typeof MediaStreamRecorder !== 'undefined') {
    MediaStreamRecorder.WhammyRecorder = WhammyRecorder;
}

// ==========================
// WhammyRecorderHelper.js

function WhammyRecorderHelper(mediaStream, root) {
    this.record = function (timeSlice) {
        if (!this.width) {
            this.width = 320;
        }
        if (!this.height) {
            this.height = 240;
        }

        if (this.video && this.video instanceof HTMLVideoElement) {
            if (!this.width) {
                this.width = video.videoWidth || video.clientWidth || 320;
            }
            if (!this.height) {
                this.height = video.videoHeight || video.clientHeight || 240;
            }
        }

        if (!this.video) {
            this.video = {
                width: this.width,
                height: this.height
            };
        }

        if (!this.canvas || !this.canvas.width || !this.canvas.height) {
            this.canvas = {
                width: this.width,
                height: this.height
            };
        }

        canvas.width = this.canvas.width;
        canvas.height = this.canvas.height;

        // setting defaults
        if (this.video && this.video instanceof HTMLVideoElement) {
            this.isHTMLObject = true;
            video = this.video.cloneNode();
        } else {
            video = document.createElement('video');
            video.src = URL.createObjectURL(mediaStream);

            video.width = this.video.width;
            video.height = this.video.height;
        }

        video.muted = true;
        video.play();

        lastTime = new Date().getTime();
        whammy = new Whammy.Video(root.speed, root.quality);

        console.log('canvas resolutions', canvas.width, '*', canvas.height);
        console.log('video width/height', video.width || canvas.width, '*', video.height || canvas.height);

        drawFrames();
    };

    this.clearOldRecordedFrames = function () {
        whammy.frames = [];
    };

    var requestDataInvoked = false;
    this.requestData = function () {
        if (isPaused) {
            return;
        }

        if (!whammy.frames.length) {
            requestDataInvoked = false;
            return;
        }

        requestDataInvoked = true;
        // clone stuff
        var internalFrames = whammy.frames.slice(0);

        // reset the frames for the new recording

        whammy.frames = dropBlackFrames(internalFrames, -1);

        whammy.compile(function (whammyBlob) {
            root.ondataavailable(whammyBlob);
            console.debug('video recorded blob size:', bytesToSize(whammyBlob.size));
        });

        whammy.frames = [];

        requestDataInvoked = false;
    };

    var isOnStartedDrawingNonBlankFramesInvoked = false;

    function drawFrames() {
        if (isPaused) {
            lastTime = new Date().getTime();
            setTimeout(drawFrames, 500);
            return;
        }

        if (isStopDrawing) {
            return;
        }

        if (requestDataInvoked) {
            return setTimeout(drawFrames, 100);
        }

        var duration = new Date().getTime() - lastTime;
        if (!duration) {
            return drawFrames();
        }

        // via webrtc-experiment#206, by Jack i.e. @Seymourr
        lastTime = new Date().getTime();

        if (!self.isHTMLObject && video.paused) {
            video.play(); // Android
        }

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        if (!isStopDrawing) {
            whammy.frames.push({
                duration: duration,
                image: canvas.toDataURL('image/webp')
            });
        }

        if (!isOnStartedDrawingNonBlankFramesInvoked && !isBlankFrame(whammy.frames[whammy.frames.length - 1])) {
            isOnStartedDrawingNonBlankFramesInvoked = true;
            root.onStartedDrawingNonBlankFrames();
        }

        setTimeout(drawFrames, 10);
    }

    var isStopDrawing = false;

    this.stop = function () {
        isStopDrawing = true;
        this.requestData();
    };

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    var video;
    var lastTime;
    var whammy;

    var self = this;

    function isBlankFrame(frame, _pixTolerance, _frameTolerance) {
        var localCanvas = document.createElement('canvas');
        localCanvas.width = canvas.width;
        localCanvas.height = canvas.height;
        var context2d = localCanvas.getContext('2d');

        var sampleColor = {
            r: 0,
            g: 0,
            b: 0
        };
        var maxColorDifference = Math.sqrt(Math.pow(255, 2) + Math.pow(255, 2) + Math.pow(255, 2));
        var pixTolerance = _pixTolerance && _pixTolerance >= 0 && _pixTolerance <= 1 ? _pixTolerance : 0;
        var frameTolerance = _frameTolerance && _frameTolerance >= 0 && _frameTolerance <= 1 ? _frameTolerance : 0;

        var matchPixCount, endPixCheck, maxPixCount;

        var image = new Image();
        image.src = frame.image;
        context2d.drawImage(image, 0, 0, canvas.width, canvas.height);
        var imageData = context2d.getImageData(0, 0, canvas.width, canvas.height);
        matchPixCount = 0;
        endPixCheck = imageData.data.length;
        maxPixCount = imageData.data.length / 4;

        for (var pix = 0; pix < endPixCheck; pix += 4) {
            var currentColor = {
                r: imageData.data[pix],
                g: imageData.data[pix + 1],
                b: imageData.data[pix + 2]
            };
            var colorDifference = Math.sqrt(Math.pow(currentColor.r - sampleColor.r, 2) + Math.pow(currentColor.g - sampleColor.g, 2) + Math.pow(currentColor.b - sampleColor.b, 2));
            // difference in color it is difference in color vectors (r1,g1,b1) <=> (r2,g2,b2)
            if (colorDifference <= maxColorDifference * pixTolerance) {
                matchPixCount++;
            }
        }

        if (maxPixCount - matchPixCount <= maxPixCount * frameTolerance) {
            return false;
        } else {
            return true;
        }
    }

    function dropBlackFrames(_frames, _framesToCheck, _pixTolerance, _frameTolerance) {
        var localCanvas = document.createElement('canvas');
        localCanvas.width = canvas.width;
        localCanvas.height = canvas.height;
        var context2d = localCanvas.getContext('2d');
        var resultFrames = [];

        var checkUntilNotBlack = _framesToCheck === -1;
        var endCheckFrame = _framesToCheck && _framesToCheck > 0 && _framesToCheck <= _frames.length ? _framesToCheck : _frames.length;
        var sampleColor = {
            r: 0,
            g: 0,
            b: 0
        };
        var maxColorDifference = Math.sqrt(Math.pow(255, 2) + Math.pow(255, 2) + Math.pow(255, 2));
        var pixTolerance = _pixTolerance && _pixTolerance >= 0 && _pixTolerance <= 1 ? _pixTolerance : 0;
        var frameTolerance = _frameTolerance && _frameTolerance >= 0 && _frameTolerance <= 1 ? _frameTolerance : 0;
        var doNotCheckNext = false;

        for (var f = 0; f < endCheckFrame; f++) {
            var matchPixCount, endPixCheck, maxPixCount;

            if (!doNotCheckNext) {
                var image = new Image();
                image.src = _frames[f].image;
                context2d.drawImage(image, 0, 0, canvas.width, canvas.height);
                var imageData = context2d.getImageData(0, 0, canvas.width, canvas.height);
                matchPixCount = 0;
                endPixCheck = imageData.data.length;
                maxPixCount = imageData.data.length / 4;

                for (var pix = 0; pix < endPixCheck; pix += 4) {
                    var currentColor = {
                        r: imageData.data[pix],
                        g: imageData.data[pix + 1],
                        b: imageData.data[pix + 2]
                    };
                    var colorDifference = Math.sqrt(Math.pow(currentColor.r - sampleColor.r, 2) + Math.pow(currentColor.g - sampleColor.g, 2) + Math.pow(currentColor.b - sampleColor.b, 2));
                    // difference in color it is difference in color vectors (r1,g1,b1) <=> (r2,g2,b2)
                    if (colorDifference <= maxColorDifference * pixTolerance) {
                        matchPixCount++;
                    }
                }
            }

            if (!doNotCheckNext && maxPixCount - matchPixCount <= maxPixCount * frameTolerance) {
                // console.log('removed black frame : ' + f + ' ; frame duration ' + _frames[f].duration);
            } else {
                // console.log('frame is passed : ' + f);
                if (checkUntilNotBlack) {
                    doNotCheckNext = true;
                }
                resultFrames.push(_frames[f]);
            }
        }

        resultFrames = resultFrames.concat(_frames.slice(endCheckFrame));

        if (resultFrames.length <= 0) {
            // at least one last frame should be available for next manipulation
            // if total duration of all frames will be < 1000 than ffmpeg doesn't work well...
            resultFrames.push(_frames[_frames.length - 1]);
        }

        return resultFrames;
    }

    var isPaused = false;

    this.pause = function () {
        isPaused = true;
    };

    this.resume = function () {
        isPaused = false;
    };
}

if (typeof MediaStreamRecorder !== 'undefined') {
    MediaStreamRecorder.WhammyRecorderHelper = WhammyRecorderHelper;
}

// --------------
// GifRecorder.js

function GifRecorder(mediaStream) {
    if (typeof GIFEncoder === 'undefined') {
        throw 'Please link: https://cdn.webrtc-experiment.com/gif-recorder.js';
    }

    // void start(optional long timeSlice)
    // timestamp to fire "ondataavailable"
    this.start = function (timeSlice) {
        timeSlice = timeSlice || 1000;

        var imageWidth = this.videoWidth || 320;
        var imageHeight = this.videoHeight || 240;

        canvas.width = video.width = imageWidth;
        canvas.height = video.height = imageHeight;

        // external library to record as GIF images
        gifEncoder = new GIFEncoder();

        // void setRepeat(int iter)
        // Sets the number of times the set of GIF frames should be played.
        // Default is 1; 0 means play indefinitely.
        gifEncoder.setRepeat(0);

        // void setFrameRate(Number fps)
        // Sets frame rate in frames per second.
        // Equivalent to setDelay(1000/fps).
        // Using "setDelay" instead of "setFrameRate"
        gifEncoder.setDelay(this.frameRate || this.speed || 200);

        // void setQuality(int quality)
        // Sets quality of color quantization (conversion of images to the
        // maximum 256 colors allowed by the GIF specification).
        // Lower values (minimum = 1) produce better colors,
        // but slow processing significantly. 10 is the default,
        // and produces good color mapping at reasonable speeds.
        // Values greater than 20 do not yield significant improvements in speed.
        gifEncoder.setQuality(this.quality || 1);

        // Boolean start()
        // This writes the GIF Header and returns false if it fails.
        gifEncoder.start();

        startTime = Date.now();

        function drawVideoFrame(time) {
            if (isPaused) {
                setTimeout(drawVideoFrame, 500, time);
                return;
            }

            lastAnimationFrame = requestAnimationFrame(drawVideoFrame);

            if ((typeof lastFrameTime === 'undefined' ? 'undefined' : _typeof(lastFrameTime)) === undefined) {
                lastFrameTime = time;
            }

            // ~10 fps
            if (time - lastFrameTime < 90) {
                return;
            }

            if (video.paused) {
                video.play(); // Android
            }

            context.drawImage(video, 0, 0, imageWidth, imageHeight);

            gifEncoder.addFrame(context);

            // console.log('Recording...' + Math.round((Date.now() - startTime) / 1000) + 's');
            // console.log("fps: ", 1000 / (time - lastFrameTime));

            lastFrameTime = time;
        }

        lastAnimationFrame = requestAnimationFrame(drawVideoFrame);

        timeout = setTimeout(doneRecording, timeSlice);
    };

    function doneRecording() {
        endTime = Date.now();

        var gifBlob = new Blob([new Uint8Array(gifEncoder.stream().bin)], {
            type: 'image/gif'
        });
        self.ondataavailable(gifBlob);

        // todo: find a way to clear old recorded blobs
        gifEncoder.stream().bin = [];
    }

    this.stop = function () {
        if (lastAnimationFrame) {
            cancelAnimationFrame(lastAnimationFrame);
            clearTimeout(timeout);
            doneRecording();
        }
    };

    var isPaused = false;

    this.pause = function () {
        isPaused = true;
    };

    this.resume = function () {
        isPaused = false;
    };

    this.ondataavailable = function () {};
    this.onstop = function () {};

    // Reference to itself
    var self = this;

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    var video = document.createElement('video');
    video.muted = true;
    video.autoplay = true;
    video.src = URL.createObjectURL(mediaStream);
    video.play();

    var lastAnimationFrame = null;
    var startTime, endTime, lastFrameTime;

    var gifEncoder;
    var timeout;
}

if (typeof MediaStreamRecorder !== 'undefined') {
    MediaStreamRecorder.GifRecorder = GifRecorder;
}

// https://github.com/antimatter15/whammy/blob/master/LICENSE
// _________
// Whammy.js

// todo: Firefox now supports webp for webm containers!
// their MediaRecorder implementation works well!
// should we provide an option to record via Whammy.js or MediaRecorder API is a better solution?

/**
 * Whammy is a standalone class used by {@link RecordRTC} to bring video recording in Chrome. It is written by {@link https://github.com/antimatter15|antimatter15}
 * @summary A real time javascript webm encoder based on a canvas hack.
 * @typedef Whammy
 * @class
 * @example
 * var recorder = new Whammy().Video(15);
 * recorder.add(context || canvas || dataURL);
 * var output = recorder.compile();
 */

var Whammy = function () {
    // a more abstract-ish API

    function WhammyVideo(duration, quality) {
        this.frames = [];
        if (!duration) {
            duration = 1;
        }
        this.duration = 1000 / duration;
        this.quality = quality || 0.8;
    }

    /**
     * Pass Canvas or Context or image/webp(string) to {@link Whammy} encoder.
     * @method
     * @memberof Whammy
     * @example
     * recorder = new Whammy().Video(0.8, 100);
     * recorder.add(canvas || context || 'image/webp');
     * @param {string} frame - Canvas || Context || image/webp
     * @param {number} duration - Stick a duration (in milliseconds)
     */
    WhammyVideo.prototype.add = function (frame, duration) {
        if ('canvas' in frame) {
            //CanvasRenderingContext2D
            frame = frame.canvas;
        }

        if ('toDataURL' in frame) {
            frame = frame.toDataURL('image/webp', this.quality);
        }

        if (!/^data:image\/webp;base64,/ig.test(frame)) {
            throw 'Input must be formatted properly as a base64 encoded DataURI of type image/webp';
        }
        this.frames.push({
            image: frame,
            duration: duration || this.duration
        });
    };

    function processInWebWorker(_function) {
        var blob = URL.createObjectURL(new Blob([_function.toString(), 'this.onmessage =  function (e) {' + _function.name + '(e.data);}'], {
            type: 'application/javascript'
        }));

        var worker = new Worker(blob);
        URL.revokeObjectURL(blob);
        return worker;
    }

    function whammyInWebWorker(frames) {
        function ArrayToWebM(frames) {
            var info = checkFrames(frames);
            if (!info) {
                return [];
            }

            var clusterMaxDuration = 30000;

            var EBML = [{
                'id': 0x1a45dfa3, // EBML
                'data': [{
                    'data': 1,
                    'id': 0x4286 // EBMLVersion
                }, {
                    'data': 1,
                    'id': 0x42f7 // EBMLReadVersion
                }, {
                    'data': 4,
                    'id': 0x42f2 // EBMLMaxIDLength
                }, {
                    'data': 8,
                    'id': 0x42f3 // EBMLMaxSizeLength
                }, {
                    'data': 'webm',
                    'id': 0x4282 // DocType
                }, {
                    'data': 2,
                    'id': 0x4287 // DocTypeVersion
                }, {
                    'data': 2,
                    'id': 0x4285 // DocTypeReadVersion
                }]
            }, {
                'id': 0x18538067, // Segment
                'data': [{
                    'id': 0x1549a966, // Info
                    'data': [{
                        'data': 1e6, //do things in millisecs (num of nanosecs for duration scale)
                        'id': 0x2ad7b1 // TimecodeScale
                    }, {
                        'data': 'whammy',
                        'id': 0x4d80 // MuxingApp
                    }, {
                        'data': 'whammy',
                        'id': 0x5741 // WritingApp
                    }, {
                        'data': doubleToString(info.duration),
                        'id': 0x4489 // Duration
                    }]
                }, {
                    'id': 0x1654ae6b, // Tracks
                    'data': [{
                        'id': 0xae, // TrackEntry
                        'data': [{
                            'data': 1,
                            'id': 0xd7 // TrackNumber
                        }, {
                            'data': 1,
                            'id': 0x73c5 // TrackUID
                        }, {
                            'data': 0,
                            'id': 0x9c // FlagLacing
                        }, {
                            'data': 'und',
                            'id': 0x22b59c // Language
                        }, {
                            'data': 'V_VP8',
                            'id': 0x86 // CodecID
                        }, {
                            'data': 'VP8',
                            'id': 0x258688 // CodecName
                        }, {
                            'data': 1,
                            'id': 0x83 // TrackType
                        }, {
                            'id': 0xe0, // Video
                            'data': [{
                                'data': info.width,
                                'id': 0xb0 // PixelWidth
                            }, {
                                'data': info.height,
                                'id': 0xba // PixelHeight
                            }]
                        }]
                    }]
                }]
            }];

            //Generate clusters (max duration)
            var frameNumber = 0;
            var clusterTimecode = 0;
            while (frameNumber < frames.length) {

                var clusterFrames = [];
                var clusterDuration = 0;
                do {
                    clusterFrames.push(frames[frameNumber]);
                    clusterDuration += frames[frameNumber].duration;
                    frameNumber++;
                } while (frameNumber < frames.length && clusterDuration < clusterMaxDuration);

                var clusterCounter = 0;
                var cluster = {
                    'id': 0x1f43b675, // Cluster
                    'data': getClusterData(clusterTimecode, clusterCounter, clusterFrames)
                }; //Add cluster to segment
                EBML[1].data.push(cluster);
                clusterTimecode += clusterDuration;
            }

            return generateEBML(EBML);
        }

        function getClusterData(clusterTimecode, clusterCounter, clusterFrames) {
            return [{
                'data': clusterTimecode,
                'id': 0xe7 // Timecode
            }].concat(clusterFrames.map(function (webp) {
                var block = makeSimpleBlock({
                    discardable: 0,
                    frame: webp.data.slice(4),
                    invisible: 0,
                    keyframe: 1,
                    lacing: 0,
                    trackNum: 1,
                    timecode: Math.round(clusterCounter)
                });
                clusterCounter += webp.duration;
                return {
                    data: block,
                    id: 0xa3
                };
            }));
        }

        // sums the lengths of all the frames and gets the duration

        function checkFrames(frames) {
            if (!frames[0]) {
                postMessage({
                    error: 'Something went wrong. Maybe WebP format is not supported in the current browser.'
                });
                return;
            }

            var width = frames[0].width,
                height = frames[0].height,
                duration = frames[0].duration;

            for (var i = 1; i < frames.length; i++) {
                duration += frames[i].duration;
            }
            return {
                duration: duration,
                width: width,
                height: height
            };
        }

        function numToBuffer(num) {
            var parts = [];
            while (num > 0) {
                parts.push(num & 0xff);
                num = num >> 8;
            }
            return new Uint8Array(parts.reverse());
        }

        function strToBuffer(str) {
            return new Uint8Array(str.split('').map(function (e) {
                return e.charCodeAt(0);
            }));
        }

        function bitsToBuffer(bits) {
            var data = [];
            var pad = bits.length % 8 ? new Array(1 + 8 - bits.length % 8).join('0') : '';
            bits = pad + bits;
            for (var i = 0; i < bits.length; i += 8) {
                data.push(parseInt(bits.substr(i, 8), 2));
            }
            return new Uint8Array(data);
        }

        function generateEBML(json) {
            var ebml = [];
            for (var i = 0; i < json.length; i++) {
                var data = json[i].data;

                if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
                    data = generateEBML(data);
                }

                if (typeof data === 'number') {
                    data = bitsToBuffer(data.toString(2));
                }

                if (typeof data === 'string') {
                    data = strToBuffer(data);
                }

                var len = data.size || data.byteLength || data.length;
                var zeroes = Math.ceil(Math.ceil(Math.log(len) / Math.log(2)) / 8);
                var sizeToString = len.toString(2);
                var padded = new Array(zeroes * 7 + 7 + 1 - sizeToString.length).join('0') + sizeToString;
                var size = new Array(zeroes).join('0') + '1' + padded;

                ebml.push(numToBuffer(json[i].id));
                ebml.push(bitsToBuffer(size));
                ebml.push(data);
            }

            return new Blob(ebml, {
                type: 'video/webm'
            });
        }

        function toBinStrOld(bits) {
            var data = '';
            var pad = bits.length % 8 ? new Array(1 + 8 - bits.length % 8).join('0') : '';
            bits = pad + bits;
            for (var i = 0; i < bits.length; i += 8) {
                data += String.fromCharCode(parseInt(bits.substr(i, 8), 2));
            }
            return data;
        }

        function makeSimpleBlock(data) {
            var flags = 0;

            if (data.keyframe) {
                flags |= 128;
            }

            if (data.invisible) {
                flags |= 8;
            }

            if (data.lacing) {
                flags |= data.lacing << 1;
            }

            if (data.discardable) {
                flags |= 1;
            }

            if (data.trackNum > 127) {
                throw 'TrackNumber > 127 not supported';
            }

            var out = [data.trackNum | 0x80, data.timecode >> 8, data.timecode & 0xff, flags].map(function (e) {
                return String.fromCharCode(e);
            }).join('') + data.frame;

            return out;
        }

        function parseWebP(riff) {
            var VP8 = riff.RIFF[0].WEBP[0];

            var frameStart = VP8.indexOf('\x9d\x01\x2a'); // A VP8 keyframe starts with the 0x9d012a header
            for (var i = 0, c = []; i < 4; i++) {
                c[i] = VP8.charCodeAt(frameStart + 3 + i);
            }

            var width, height, tmp;

            //the code below is literally copied verbatim from the bitstream spec
            tmp = c[1] << 8 | c[0];
            width = tmp & 0x3FFF;
            tmp = c[3] << 8 | c[2];
            height = tmp & 0x3FFF;
            return {
                width: width,
                height: height,
                data: VP8,
                riff: riff
            };
        }

        function getStrLength(string, offset) {
            return parseInt(string.substr(offset + 4, 4).split('').map(function (i) {
                var unpadded = i.charCodeAt(0).toString(2);
                return new Array(8 - unpadded.length + 1).join('0') + unpadded;
            }).join(''), 2);
        }

        function parseRIFF(string) {
            var offset = 0;
            var chunks = {};

            while (offset < string.length) {
                var id = string.substr(offset, 4);
                var len = getStrLength(string, offset);
                var data = string.substr(offset + 4 + 4, len);
                offset += 4 + 4 + len;
                chunks[id] = chunks[id] || [];

                if (id === 'RIFF' || id === 'LIST') {
                    chunks[id].push(parseRIFF(data));
                } else {
                    chunks[id].push(data);
                }
            }
            return chunks;
        }

        function doubleToString(num) {
            return [].slice.call(new Uint8Array(new Float64Array([num]).buffer), 0).map(function (e) {
                return String.fromCharCode(e);
            }).reverse().join('');
        }

        var webm = new ArrayToWebM(frames.map(function (frame) {
            var webp = parseWebP(parseRIFF(atob(frame.image.slice(23))));
            webp.duration = frame.duration;
            return webp;
        }));

        postMessage(webm);
    }

    /**
     * Encodes frames in WebM container. It uses WebWorkinvoke to invoke 'ArrayToWebM' method.
     * @param {function} callback - Callback function, that is used to pass recorded blob back to the callee.
     * @method
     * @memberof Whammy
     * @example
     * recorder = new Whammy().Video(0.8, 100);
     * recorder.compile(function(blob) {
     *    // blob.size - blob.type
     * });
     */
    WhammyVideo.prototype.compile = function (callback) {
        var webWorker = processInWebWorker(whammyInWebWorker);

        webWorker.onmessage = function (event) {
            if (event.data.error) {
                console.error(event.data.error);
                return;
            }
            callback(event.data);
        };

        webWorker.postMessage(this.frames);
    };

    return {
        /**
         * A more abstract-ish API.
         * @method
         * @memberof Whammy
         * @example
         * recorder = new Whammy().Video(0.8, 100);
         * @param {?number} speed - 0.8
         * @param {?number} quality - 100
         */
        Video: WhammyVideo
    };
}();

if (typeof MediaStreamRecorder !== 'undefined') {
    MediaStreamRecorder.Whammy = Whammy;
}

// Last time updated at Nov 18, 2014, 08:32:23

// Latest file can be found here: https://cdn.webrtc-experiment.com/ConcatenateBlobs.js

// Muaz Khan    - www.MuazKhan.com
// MIT License  - www.WebRTC-Experiment.com/licence
// Source Code  - https://github.com/muaz-khan/ConcatenateBlobs
// Demo         - https://www.WebRTC-Experiment.com/ConcatenateBlobs/

// ___________________
// ConcatenateBlobs.js

// Simply pass array of blobs.
// This javascript library will concatenate all blobs in single "Blob" object.

(function () {
    window.ConcatenateBlobs = function (blobs, type, callback) {
        var buffers = [];

        var index = 0;

        function readAsArrayBuffer() {
            if (!blobs[index]) {
                return concatenateBuffers();
            }
            var reader = new FileReader();
            reader.onload = function (event) {
                buffers.push(event.target.result);
                index++;
                readAsArrayBuffer();
            };
            reader.readAsArrayBuffer(blobs[index]);
        }

        readAsArrayBuffer();

        function concatenateBuffers() {
            var byteLength = 0;
            buffers.forEach(function (buffer) {
                byteLength += buffer.byteLength;
            });

            var tmp = new Uint16Array(byteLength);
            var lastOffset = 0;
            buffers.forEach(function (buffer) {
                // BYTES_PER_ELEMENT == 2 for Uint16Array
                var reusableByteLength = buffer.byteLength;
                if (reusableByteLength % 2 != 0) {
                    buffer = buffer.slice(0, reusableByteLength - 1);
                }
                tmp.set(new Uint16Array(buffer), lastOffset);
                lastOffset += reusableByteLength;
            });

            var blob = new Blob([tmp.buffer], {
                type: type
            });

            callback(blob);
        }
    };
})();

// https://github.com/streamproc/MediaStreamRecorder/issues/42
if (true /* && !!module.exports*/) {
        module.exports = MediaStreamRecorder;
    }

if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
        return MediaStreamRecorder;
    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),

/***/ 34:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // import * as WebTorrent from 'webtorrent';
// import * as MediaStreamRecorder from 'msr';


var _webtorrentMin = __webpack_require__(4);

var _webtorrentMin2 = _interopRequireDefault(_webtorrentMin);

var _msr = __webpack_require__(31);

var _msr2 = _interopRequireDefault(_msr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Broadcaster = function () {
  function Broadcaster(recordInterval, // the Interval that the webcam recording should seed each segment of the video
  ID_of_NodeToRenderVideo, // The id where the video node is being appended to
  startStreamID, // The id of the button node that BEGINS the recording/live streaming
  stopStreamID // The id of the button node that ENDS the recording/live streaming
  ) {
    _classCallCheck(this, Broadcaster);

    this.recordInterval = recordInterval; // interval to record video at (in ms)
    this.ID_of_NodeToRenderVideo = ID_of_NodeToRenderVideo;
    this.startStreamID = startStreamID;
    this.stopStreamID = stopStreamID;

    this.videoStream = null;

    this.createBroadcast();

    this.$video = document.getElementById('broadcaster');

    this.startSeeding = this.startSeeding.bind(this);

    this.startStream();
  }

  _createClass(Broadcaster, [{
    key: 'startStream',
    value: function startStream() {
      var _recordInterval = this.recordInterval;
      var startSeeding = this.startSeeding;
      var videoStream = this.videoStream;
      var $video = this.$video;

      var torrentInfo = {
        'magnetURI1': 0,
        'magnetURI2': 0,
        'magnetURI3': 0,
        'was1': false,
        'was2': false
      };

      var broadcaster = void 0;
      // mute audio
      this.$video.defaultMuted = true;

      // allows you to see yourself while recording
      var createSrc = window.URL ? window.URL.createObjectURL : function (stream) {
        return stream;
      };

      // // creates a new instance of torrent so that user is able to seed the video/webm file
      // let was1 = this.was1;
      // let was2 = this.was1;

      // when pressing the play button, start recording
      document.getElementById('' + this.startStreamID).addEventListener('click', function () {
        broadcaster = new _webtorrentMin2.default();

        var mediaConstraints = {
          audio: true,
          video: false
        };

        // begin using the webcam
        navigator.mediaDevices.getUserMedia(mediaConstraints).then(onMediaSuccess).catch(onMediaError);

        function onMediaSuccess(stream) {
          var mediaRecorder = new _msr2.default(stream);
          // record a blob every _recordInterval amount of time
          mediaRecorder.start(_recordInterval);
          mediaRecorder.mimeType = 'video/webm';

          // every _recordInterval, make a new torrent file and start seeding it
          mediaRecorder.ondataavailable = function (blob) {

            var file1 = new File([blob], 'nilejs.webm', {
              type: 'video/webm'
            });

            var file2 = new File([new Blob([JSON.stringify(window.textareaValue)])], 'nilejs.txt', {
              type: 'text/plain'
            });
            window.textareaValue = [];

            var file = [file1, file2];

            if (torrentInfo.was1 && torrentInfo.was2) {
              startSeeding(file, 'magnetURI3', '3', broadcaster, torrentInfo);
              torrentInfo.was1 = torrentInfo.was2 = false;
            } else if (torrentInfo.was1) {
              startSeeding(file, 'magnetURI2', '2', broadcaster, torrentInfo);
              torrentInfo.was2 = true;
            } else {
              startSeeding(file, 'magnetURI1', '1', broadcaster, torrentInfo);
              torrentInfo.was1 = true;
            }
          };

          // retrieve the devices that are being used to record
          videoStream = stream.getTracks();

          // play back the recording to the broadcaster
          $video.srcObject = stream;
          $video.play();
          $video.mute();
        }

        function onMediaError(e) {
          console.error('media error', e);
        }
      });

      // when the user pauses the video, stop the stream and send data to server
      document.getElementById('' + this.stopStreamID).addEventListener('click', function () {
        // resets all of the values to starting values
        torrentInfo = {
          'magnetURI1': 0,
          'magnetURI2': 0,
          'magnetURI3': 0,
          'was1': false,
          'was2': false

          // Pause the video
        };$video.pause();

        // stops the the audio and video from recording
        videoStream.forEach(function (stream) {
          return stream.stop();
        });

        // destroys the broadcasting client and starts back at the beginning
        broadcaster.destroy(function () {
          console.log('All torrents destroyed');
        });
      });
    }
  }, {
    key: 'startSeeding',
    value: function startSeeding(file, currMagnet, castNum, broadcaster, torrentInfo) {
      var _this = this;

      // remove the torrent if it is currently seeding
      if (torrentInfo[currMagnet]) {
        broadcaster.remove(torrentInfo[currMagnet], function () {
          console.log('magnet ' + castNum + ' removed');
        });
      }

      // start seeding the new torrent
      broadcaster.seed(file, function (torrent) {
        torrentInfo[currMagnet] = torrent.magnetURI;
        console.log('broadcaster ' + castNum + ' is seeding ', torrent.magnetURI);
        _this.sendMagnetToServer(torrent.magnetURI);
      });

      // check for if an error occurs, if it does, garbage collection and return error
      broadcaster.on('error', function (err) {
        console.log('webtorrents has encountered an error', err);
      });
    }

    // send magnet to server

  }, {
    key: 'sendMagnetToServer',
    value: function sendMagnetToServer(magnetURI) {
      // send to server
      var xhr = new XMLHttpRequest();

      xhr.open('POST', '/magnet', true);

      xhr.onreadystatechange = function () {
        if (this.status === 200) {
          console.log('Magnet Emitted');
        } else {
          console.log('Emit Failed');
        }
      };
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.send(JSON.stringify({ 'magnetURI': magnetURI }));
    }
  }, {
    key: 'createBroadcast',
    value: function createBroadcast() {
      var video = document.createElement('audio');
      video.setAttribute('id', 'broadcaster');
      video.setAttribute('controls', 'true');
      video.setAttribute('autoplay', 'true');
      video.setAttribute('muted', 'true');
      document.getElementById(this.ID_of_NodeToRenderVideo).appendChild(video);
    }
  }]);

  return Broadcaster;
}();

// export default Broadcaster


module.exports = Broadcaster;

/***/ }),

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, setImmediate) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var require;var require;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e) {
  if ("object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module) module.exports = e();else if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (e),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else {
    var t;t = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, t.WebTorrent = e();
  }
}(function () {
  var e;return function e(t, n, r) {
    function o(s, a) {
      if (!n[s]) {
        if (!t[s]) {
          var u = "function" == typeof require && require;if (!a && u) return require(s, !0);if (i) return i(s, !0);var c = new Error("Cannot find module '" + s + "'");throw c.code = "MODULE_NOT_FOUND", c;
        }var f = n[s] = { exports: {} };t[s][0].call(f.exports, function (e) {
          var n = t[s][1][e];return o(n || e);
        }, f, f.exports, e, t, n, r);
      }return n[s].exports;
    }for (var i = "function" == typeof require && require, s = 0; s < r.length; s++) {
      o(r[s]);
    }return o;
  }({ 1: [function (e, t, n) {
      function r(e, t) {
        s.Readable.call(this, t), this.destroyed = !1, this._torrent = e._torrent;var n = t && t.start || 0,
            r = t && t.end && t.end < e.length ? t.end : e.length - 1,
            o = e._torrent.pieceLength;this._startPiece = (n + e.offset) / o | 0, this._endPiece = (r + e.offset) / o | 0, this._piece = this._startPiece, this._offset = n + e.offset - this._startPiece * o, this._missing = r - n + 1, this._reading = !1, this._notifying = !1, this._criticalLength = Math.min(1048576 / o | 0, 2);
      }t.exports = r;var o = e("debug")("webtorrent:file-stream"),
          i = e("inherits"),
          s = e("readable-stream");i(r, s.Readable), r.prototype._read = function () {
        this._reading || (this._reading = !0, this._notify());
      }, r.prototype._notify = function () {
        var e = this;if (e._reading && 0 !== e._missing) {
          if (!e._torrent.bitfield.get(e._piece)) return e._torrent.critical(e._piece, e._piece + e._criticalLength);if (!e._notifying) {
            e._notifying = !0;var t = e._piece;e._torrent.store.get(t, function (n, r) {
              if (e._notifying = !1, !e.destroyed) {
                if (n) return e._destroy(n);o("read %s (length %s) (err %s)", t, r.length, n && n.message), e._offset && (r = r.slice(e._offset), e._offset = 0), e._missing < r.length && (r = r.slice(0, e._missing)), e._missing -= r.length, o("pushing buffer of length %s", r.length), e._reading = !1, e.push(r), 0 === e._missing && e.push(null);
              }
            }), e._piece += 1;
          }
        }
      }, r.prototype.destroy = function (e) {
        this._destroy(null, e);
      }, r.prototype._destroy = function (e, t) {
        this.destroyed || (this.destroyed = !0, this._torrent.destroyed || this._torrent.deselect(this._startPiece, this._endPiece, !0), e && this.emit("error", e), this.emit("close"), t && t());
      };
    }, { debug: 30, inherits: 41, "readable-stream": 82 }], 2: [function (e, t, n) {
      (function (n) {
        function r(e, t) {
          i.call(this), this._torrent = e, this._destroyed = !1, this.name = t.name, this.path = t.path, this.length = t.length, this.offset = t.offset, this.done = !1;var n = t.offset,
              r = n + t.length - 1;this._startPiece = n / this._torrent.pieceLength | 0, this._endPiece = r / this._torrent.pieceLength | 0, 0 === this.length && (this.done = !0, this.emit("done"));
        }t.exports = r;var o = e("end-of-stream"),
            i = e("events").EventEmitter,
            s = e("./file-stream"),
            a = e("inherits"),
            u = e("path"),
            c = e("render-media"),
            f = e("readable-stream"),
            d = e("stream-to-blob"),
            h = e("stream-to-blob-url"),
            l = e("stream-with-known-length-to-buffer");a(r, i), Object.defineProperty(r.prototype, "downloaded", { get: function get() {
            if (!this._torrent.bitfield) return 0;for (var e = 0, t = this._startPiece; t <= this._endPiece; ++t) {
              if (this._torrent.bitfield.get(t)) e += this._torrent.pieceLength;else {
                var n = this._torrent.pieces[t];e += n.length - n.missing;
              }
            }return e;
          } }), r.prototype.select = function (e) {
          0 !== this.length && this._torrent.select(this._startPiece, this._endPiece, e);
        }, r.prototype.deselect = function () {
          0 !== this.length && this._torrent.deselect(this._startPiece, this._endPiece, !1);
        }, r.prototype.createReadStream = function (e) {
          var t = this;if (0 === this.length) {
            var r = new f.PassThrough();return n.nextTick(function () {
              r.end();
            }), r;
          }var i = new s(t, e);return t._torrent.select(i._startPiece, i._endPiece, !0, function () {
            i._notify();
          }), o(i, function () {
            t._destroyed || t._torrent.destroyed || t._torrent.deselect(i._startPiece, i._endPiece, !0);
          }), i;
        }, r.prototype.getBuffer = function (e) {
          l(this.createReadStream(), this.length, e);
        }, r.prototype.getBlob = function (e) {
          if ("undefined" == typeof window) throw new Error("browser-only method");d(this.createReadStream(), this._getMimeType(), e);
        }, r.prototype.getBlobURL = function (e) {
          if ("undefined" == typeof window) throw new Error("browser-only method");h(this.createReadStream(), this._getMimeType(), e);
        }, r.prototype.appendTo = function (e, t, n) {
          if ("undefined" == typeof window) throw new Error("browser-only method");c.append(this, e, t, n);
        }, r.prototype.renderTo = function (e, t, n) {
          if ("undefined" == typeof window) throw new Error("browser-only method");c.render(this, e, t, n);
        }, r.prototype._getMimeType = function () {
          return c.mime[u.extname(this.name).toLowerCase()];
        }, r.prototype._destroy = function () {
          this._destroyed = !0, this._torrent = null;
        };
      }).call(this, e("_process"));
    }, { "./file-stream": 1, _process: 66, "end-of-stream": 33, events: 34, inherits: 41, path: 63, "readable-stream": 82, "render-media": 83, "stream-to-blob": 100, "stream-to-blob-url": 99, "stream-with-known-length-to-buffer": 101 }], 3: [function (e, t, n) {
      function r(e, t) {
        var n = this;n.id = e, n.type = t, s("new Peer %s", e), n.addr = null, n.conn = null, n.swarm = null, n.wire = null, n.connected = !1, n.destroyed = !1, n.timeout = null, n.retries = 0, n.sentHandshake = !1;
      }function o() {}var i = e("unordered-array-remove"),
          s = e("debug")("webtorrent:peer"),
          a = e("bittorrent-protocol"),
          u = e("./webconn");n.createWebRTCPeer = function (e, t) {
        var n = new r(e.id, "webrtc");return n.conn = e, n.swarm = t, n.conn.connected ? n.onConnect() : (n.conn.once("connect", function () {
          n.onConnect();
        }), n.conn.once("error", function (e) {
          n.destroy(e);
        }), n.startConnectTimeout()), n;
      }, n.createTCPIncomingPeer = function (e) {
        var t = e.remoteAddress + ":" + e.remotePort,
            n = new r(t, "tcpIncoming");return n.conn = e, n.addr = t, n.onConnect(), n;
      }, n.createTCPOutgoingPeer = function (e, t) {
        var n = new r(e, "tcpOutgoing");return n.addr = e, n.swarm = t, n;
      }, n.createWebSeedPeer = function (e, t) {
        var n = new r(e, "webSeed");return n.swarm = t, n.conn = new u(e, t), n.onConnect(), n;
      }, r.prototype.onConnect = function () {
        var e = this;if (!e.destroyed) {
          e.connected = !0, s("Peer %s connected", e.id), clearTimeout(e.connectTimeout);var t = e.conn;t.once("end", function () {
            e.destroy();
          }), t.once("close", function () {
            e.destroy();
          }), t.once("finish", function () {
            e.destroy();
          }), t.once("error", function (t) {
            e.destroy(t);
          });var n = e.wire = new a();n.type = e.type, n.once("end", function () {
            e.destroy();
          }), n.once("close", function () {
            e.destroy();
          }), n.once("finish", function () {
            e.destroy();
          }), n.once("error", function (t) {
            e.destroy(t);
          }), n.once("handshake", function (t, n) {
            e.onHandshake(t, n);
          }), e.startHandshakeTimeout(), t.pipe(n).pipe(t), e.swarm && !e.sentHandshake && e.handshake();
        }
      }, r.prototype.onHandshake = function (e, t) {
        var n = this;if (n.swarm && !n.destroyed) {
          if (n.swarm.destroyed) return n.destroy(new Error("swarm already destroyed"));if (e !== n.swarm.infoHash) return n.destroy(new Error("unexpected handshake info hash for this swarm"));if (t === n.swarm.peerId) return n.destroy(new Error("refusing to connect to ourselves"));s("Peer %s got handshake %s", n.id, e), clearTimeout(n.handshakeTimeout), n.retries = 0;var r = n.addr;!r && n.conn.remoteAddress && (r = n.conn.remoteAddress + ":" + n.conn.remotePort), n.swarm._onWire(n.wire, r), n.swarm && !n.swarm.destroyed && (n.sentHandshake || n.handshake());
        }
      }, r.prototype.handshake = function () {
        var e = this,
            t = { dht: !e.swarm.private && !!e.swarm.client.dht };e.wire.handshake(e.swarm.infoHash, e.swarm.client.peerId, t), e.sentHandshake = !0;
      }, r.prototype.startConnectTimeout = function () {
        var e = this;clearTimeout(e.connectTimeout), e.connectTimeout = setTimeout(function () {
          e.destroy(new Error("connect timeout"));
        }, "webrtc" === e.type ? 25e3 : 5e3), e.connectTimeout.unref && e.connectTimeout.unref();
      }, r.prototype.startHandshakeTimeout = function () {
        var e = this;clearTimeout(e.handshakeTimeout), e.handshakeTimeout = setTimeout(function () {
          e.destroy(new Error("handshake timeout"));
        }, 25e3), e.handshakeTimeout.unref && e.handshakeTimeout.unref();
      }, r.prototype.destroy = function (e) {
        var t = this;if (!t.destroyed) {
          t.destroyed = !0, t.connected = !1, s("destroy %s (error: %s)", t.id, e && (e.message || e)), clearTimeout(t.connectTimeout), clearTimeout(t.handshakeTimeout);var n = t.swarm,
              r = t.conn,
              a = t.wire;t.swarm = null, t.conn = null, t.wire = null, n && a && i(n.wires, n.wires.indexOf(a)), r && (r.on("error", o), r.destroy()), a && a.destroy(), n && n.removePeer(t.id);
        }
      };
    }, { "./webconn": 6, "bittorrent-protocol": 14, debug: 30, "unordered-array-remove": 111 }], 4: [function (e, t, n) {
      function r(e) {
        var t = this;t._torrent = e, t._numPieces = e.pieces.length, t._pieces = [], t._onWire = function (e) {
          t.recalculate(), t._initWire(e);
        }, t._onWireHave = function (e) {
          t._pieces[e] += 1;
        }, t._onWireBitfield = function () {
          t.recalculate();
        }, t._torrent.wires.forEach(function (e) {
          t._initWire(e);
        }), t._torrent.on("wire", t._onWire), t.recalculate();
      }function o() {
        return !0;
      }t.exports = r, r.prototype.getRarestPiece = function (e) {
        e || (e = o);for (var t = [], n = 1 / 0, r = 0; r < this._numPieces; ++r) {
          if (e(r)) {
            var i = this._pieces[r];i === n ? t.push(r) : i < n && (t = [r], n = i);
          }
        }return t.length > 0 ? t[Math.random() * t.length | 0] : -1;
      }, r.prototype.destroy = function () {
        var e = this;e._torrent.removeListener("wire", e._onWire), e._torrent.wires.forEach(function (t) {
          e._cleanupWireEvents(t);
        }), e._torrent = null, e._pieces = null, e._onWire = null, e._onWireHave = null, e._onWireBitfield = null;
      }, r.prototype._initWire = function (e) {
        var t = this;e._onClose = function () {
          t._cleanupWireEvents(e);for (var n = 0; n < this._numPieces; ++n) {
            t._pieces[n] -= e.peerPieces.get(n);
          }
        }, e.on("have", t._onWireHave), e.on("bitfield", t._onWireBitfield), e.once("close", e._onClose);
      }, r.prototype.recalculate = function () {
        var e;for (e = 0; e < this._numPieces; ++e) {
          this._pieces[e] = 0;
        }var t = this._torrent.wires.length;for (e = 0; e < t; ++e) {
          for (var n = this._torrent.wires[e], r = 0; r < this._numPieces; ++r) {
            this._pieces[r] += n.peerPieces.get(r);
          }
        }
      }, r.prototype._cleanupWireEvents = function (e) {
        e.removeListener("have", this._onWireHave), e.removeListener("bitfield", this._onWireBitfield), e._onClose && e.removeListener("close", e._onClose), e._onClose = null;
      };
    }, {}], 5: [function (e, t, n) {
      (function (n, r) {
        function o(e, t, n) {
          m.call(this), this._debugId = "unknown infohash", this.client = t, this.announce = n.announce, this.urlList = n.urlList, this.path = n.path, this._store = n.store || v, this._getAnnounceOpts = n.getAnnounceOpts, this.strategy = n.strategy || "sequential", this.maxWebConns = n.maxWebConns || 4, this._rechokeNumSlots = !1 === n.uploads || 0 === n.uploads ? 0 : +n.uploads || 10, this._rechokeOptimisticWire = null, this._rechokeOptimisticTime = 0, this._rechokeIntervalId = null, this.ready = !1, this.destroyed = !1, this.paused = !1, this.done = !1, this.metadata = null, this.store = null, this.files = [], this.pieces = [], this._amInterested = !1, this._selections = [], this._critical = [], this.wires = [], this._queue = [], this._peers = {}, this._peersLength = 0, this.received = 0, this.uploaded = 0, this._downloadSpeed = O(), this._uploadSpeed = O(), this._servers = [], this._xsRequests = [], this._fileModtimes = n.fileModtimes, null !== e && this._onTorrentId(e), this._debug("new torrent");
        }function i(e, t) {
          return 2 + Math.ceil(t * e.downloadSpeed() / T.BLOCK_LENGTH);
        }function s(e, t, n) {
          return 1 + Math.ceil(t * e.downloadSpeed() / n);
        }function a(e) {
          return Math.random() * e | 0;
        }function u() {}t.exports = o;var c,
            f = e("addr-to-ip-port"),
            d = e("bitfield"),
            h = e("chunk-store-stream/write"),
            l = e("debug")("webtorrent:torrent"),
            p = e("torrent-discovery"),
            m = e("events").EventEmitter,
            g = e("xtend"),
            y = e("xtend/mutable"),
            _ = e("fs"),
            v = e("fs-chunk-store"),
            b = e("simple-get"),
            w = e("immediate-chunk-store"),
            E = e("inherits"),
            k = e("multistream"),
            x = e("net"),
            S = e("os"),
            I = e("run-parallel"),
            B = e("run-parallel-limit"),
            A = e("parse-torrent"),
            C = e("path"),
            T = e("torrent-piece"),
            L = e("pump"),
            U = e("random-iterate"),
            R = e("simple-sha1"),
            O = e("speedometer"),
            M = e("uniq"),
            P = e("ut_metadata"),
            j = e("ut_pex"),
            H = e("./file"),
            N = e("./peer"),
            q = e("./rarity-map"),
            D = e("./server"),
            W = 5e3,
            z = 3 * T.BLOCK_LENGTH,
            F = [1e3, 5e3, 15e3],
            V = e("../package.json").version,
            G = "WebTorrent/" + V + " (https://webtorrent.io)";try {
          c = C.join(_.statSync("/tmp") && "/tmp", "webtorrent");
        } catch (e) {
          c = C.join("function" == typeof S.tmpdir ? S.tmpdir() : "/", "webtorrent");
        }E(o, m), Object.defineProperty(o.prototype, "timeRemaining", { get: function get() {
            return this.done ? 0 : 0 === this.downloadSpeed ? 1 / 0 : (this.length - this.downloaded) / this.downloadSpeed * 1e3;
          } }), Object.defineProperty(o.prototype, "downloaded", { get: function get() {
            if (!this.bitfield) return 0;for (var e = 0, t = 0, n = this.pieces.length; t < n; ++t) {
              if (this.bitfield.get(t)) e += t === n - 1 ? this.lastPieceLength : this.pieceLength;else {
                var r = this.pieces[t];e += r.length - r.missing;
              }
            }return e;
          } }), Object.defineProperty(o.prototype, "downloadSpeed", { get: function get() {
            return this._downloadSpeed();
          } }), Object.defineProperty(o.prototype, "uploadSpeed", { get: function get() {
            return this._uploadSpeed();
          } }), Object.defineProperty(o.prototype, "progress", { get: function get() {
            return this.length ? this.downloaded / this.length : 0;
          } }), Object.defineProperty(o.prototype, "ratio", { get: function get() {
            return this.uploaded / (this.received || 1);
          } }), Object.defineProperty(o.prototype, "numPeers", { get: function get() {
            return this.wires.length;
          } }), Object.defineProperty(o.prototype, "torrentFileBlobURL", { get: function get() {
            if ("undefined" == typeof window) throw new Error("browser-only property");return this.torrentFile ? URL.createObjectURL(new Blob([this.torrentFile], { type: "application/x-bittorrent" })) : null;
          } }), Object.defineProperty(o.prototype, "_numQueued", { get: function get() {
            return this._queue.length + (this._peersLength - this._numConns);
          } }), Object.defineProperty(o.prototype, "_numConns", { get: function get() {
            var e = this,
                t = 0;for (var n in e._peers) {
              e._peers[n].connected && (t += 1);
            }return t;
          } }), Object.defineProperty(o.prototype, "swarm", { get: function get() {
            return console.warn("WebTorrent: `torrent.swarm` is deprecated. Use `torrent` directly instead."), this;
          } }), o.prototype._onTorrentId = function (e) {
          var t = this;if (!t.destroyed) {
            var r;try {
              r = A(e);
            } catch (e) {}r ? (t.infoHash = r.infoHash, t._debugId = r.infoHash.toString("hex").substring(0, 7), n.nextTick(function () {
              t.destroyed || t._onParsedTorrent(r);
            })) : A.remote(e, function (e, n) {
              if (!t.destroyed) return e ? t._destroy(e) : void t._onParsedTorrent(n);
            });
          }
        }, o.prototype._onParsedTorrent = function (e) {
          var t = this;if (!t.destroyed) {
            if (t._processParsedTorrent(e), !t.infoHash) return t._destroy(new Error("Malformed torrent data: No info hash"));t.path || (t.path = C.join(c, t.infoHash)), t._rechokeIntervalId = setInterval(function () {
              t._rechoke();
            }, 1e4), t._rechokeIntervalId.unref && t._rechokeIntervalId.unref(), t.emit("_infoHash", t.infoHash), t.destroyed || (t.emit("infoHash", t.infoHash), t.destroyed || (t.client.listening ? t._onListening() : t.client.once("listening", function () {
              t._onListening();
            })));
          }
        }, o.prototype._processParsedTorrent = function (e) {
          this._debugId = e.infoHash.toString("hex").substring(0, 7), this.announce && (e.announce = e.announce.concat(this.announce)), this.client.tracker && r.WEBTORRENT_ANNOUNCE && !this.private && (e.announce = e.announce.concat(r.WEBTORRENT_ANNOUNCE)), this.urlList && (e.urlList = e.urlList.concat(this.urlList)), M(e.announce), M(e.urlList), y(this, e), this.magnetURI = A.toMagnetURI(e), this.torrentFile = A.toTorrentFile(e);
        }, o.prototype._onListening = function () {
          function e(e) {
            i._destroy(e);
          }function t(e) {
            "string" == typeof e && i.done || i.addPeer(e);
          }function n() {
            i.emit("trackerAnnounce"), 0 === i.numPeers && i.emit("noPeers", "tracker");
          }function r() {
            i.emit("dhtAnnounce"), 0 === i.numPeers && i.emit("noPeers", "dht");
          }function o(e) {
            i.emit("warning", e);
          }var i = this;if (!i.discovery && !i.destroyed) {
            var s = i.client.tracker;s && (s = g(i.client.tracker, { getAnnounceOpts: function getAnnounceOpts() {
                var e = { uploaded: i.uploaded, downloaded: i.downloaded, left: Math.max(i.length - i.downloaded, 0) };return i.client.tracker.getAnnounceOpts && y(e, i.client.tracker.getAnnounceOpts()), i._getAnnounceOpts && y(e, i._getAnnounceOpts()), e;
              } })), i.discovery = new p({ infoHash: i.infoHash, announce: i.announce, peerId: i.client.peerId, dht: !i.private && i.client.dht, tracker: s, port: i.client.torrentPort, userAgent: G }), i.discovery.on("error", e), i.discovery.on("peer", t), i.discovery.on("trackerAnnounce", n), i.discovery.on("dhtAnnounce", r), i.discovery.on("warning", o), i.info ? i._onMetadata(i) : i.xs && i._getMetadataFromServer();
          }
        }, o.prototype._getMetadataFromServer = function () {
          function e(e, n) {
            function r(r, o, i) {
              if (t.destroyed) return n(null);if (t.metadata) return n(null);if (r) return t.emit("warning", new Error("http error from xs param: " + e)), n(null);if (200 !== o.statusCode) return t.emit("warning", new Error("non-200 status code " + o.statusCode + " from xs param: " + e)), n(null);var s;try {
                s = A(i);
              } catch (r) {}return s ? s.infoHash !== t.infoHash ? (t.emit("warning", new Error("got torrent file with incorrect info hash from xs param: " + e)), n(null)) : (t._onMetadata(s), void n(null)) : (t.emit("warning", new Error("got invalid torrent file from xs param: " + e)), n(null));
            }if (0 !== e.indexOf("http://") && 0 !== e.indexOf("https://")) return t.emit("warning", new Error("skipping non-http xs param: " + e)), n(null);var o,
                i = { url: e, method: "GET", headers: { "user-agent": G } };try {
              o = b.concat(i, r);
            } catch (r) {
              return t.emit("warning", new Error("skipping invalid url xs param: " + e)), n(null);
            }t._xsRequests.push(o);
          }var t = this,
              n = Array.isArray(t.xs) ? t.xs : [t.xs],
              r = n.map(function (t) {
            return function (n) {
              e(t, n);
            };
          });I(r);
        }, o.prototype._onMetadata = function (e) {
          var t = this;if (!t.metadata && !t.destroyed) {
            t._debug("got metadata"), t._xsRequests.forEach(function (e) {
              e.abort();
            }), t._xsRequests = [];var n;if (e && e.infoHash) n = e;else try {
              n = A(e);
            } catch (e) {
              return t._destroy(e);
            }t._processParsedTorrent(n), t.metadata = t.torrentFile, t.client.enableWebSeeds && t.urlList.forEach(function (e) {
              t.addWebSeed(e);
            }), 0 !== t.pieces.length && t.select(0, t.pieces.length - 1, !1), t._rarityMap = new q(t), t.store = new w(new t._store(t.pieceLength, { torrent: { infoHash: t.infoHash }, files: t.files.map(function (e) {
                return { path: C.join(t.path, e.path), length: e.length, offset: e.offset };
              }), length: t.length })), t.files = t.files.map(function (e) {
              return new H(t, e);
            }), t._hashes = t.pieces, t.pieces = t.pieces.map(function (e, n) {
              var r = n === t.pieces.length - 1 ? t.lastPieceLength : t.pieceLength;return new T(r);
            }), t._reservations = t.pieces.map(function () {
              return [];
            }), t.bitfield = new d(t.pieces.length), t.wires.forEach(function (e) {
              e.ut_metadata && e.ut_metadata.setMetadata(t.metadata), t._onWireWithMetadata(e);
            }), t._debug("verifying existing torrent data"), t._fileModtimes && t._store === v ? t.getFileModtimes(function (e, n) {
              if (e) return t._destroy(e);if (t.files.map(function (e, r) {
                return n[r] === t._fileModtimes[r];
              }).every(function (e) {
                return e;
              })) {
                for (var r = 0; r < t.pieces.length; r++) {
                  t._markVerified(r);
                }t._onStore();
              } else t._verifyPieces();
            }) : t._verifyPieces(), t.emit("metadata");
          }
        }, o.prototype.getFileModtimes = function (e) {
          var t = this,
              n = [];B(t.files.map(function (e, r) {
            return function (o) {
              _.stat(C.join(t.path, e.path), function (e, t) {
                if (e && "ENOENT" !== e.code) return o(e);n[r] = t && t.mtime.getTime(), o(null);
              });
            };
          }), 2, function (r) {
            t._debug("done getting file modtimes"), e(r, n);
          });
        }, o.prototype._verifyPieces = function () {
          var e = this;B(e.pieces.map(function (t, r) {
            return function (t) {
              if (e.destroyed) return t(new Error("torrent is destroyed"));e.store.get(r, function (o, i) {
                return e.destroyed ? t(new Error("torrent is destroyed")) : o ? n.nextTick(t, null) : void R(i, function (n) {
                  if (e.destroyed) return t(new Error("torrent is destroyed"));if (n === e._hashes[r]) {
                    if (!e.pieces[r]) return;e._debug("piece verified %s", r), e._markVerified(r);
                  } else e._debug("piece invalid %s", r);t(null);
                });
              });
            };
          }), 2, function (t) {
            if (t) return e._destroy(t);e._debug("done verifying"), e._onStore();
          });
        }, o.prototype._markVerified = function (e) {
          this.pieces[e] = null, this._reservations[e] = null, this.bitfield.set(e, !0);
        }, o.prototype._onStore = function () {
          var e = this;e.destroyed || (e._debug("on store"), e.ready = !0, e.emit("ready"), e._checkDone(), e._updateSelections());
        }, o.prototype.destroy = function (e) {
          this._destroy(null, e);
        }, o.prototype._destroy = function (e, t) {
          var n = this;if (!n.destroyed) {
            n.destroyed = !0, n._debug("destroy"), n.client._remove(n), clearInterval(n._rechokeIntervalId), n._xsRequests.forEach(function (e) {
              e.abort();
            }), n._rarityMap && n._rarityMap.destroy();for (var r in n._peers) {
              n.removePeer(r);
            }n.files.forEach(function (e) {
              e instanceof H && e._destroy();
            });var o = n._servers.map(function (e) {
              return function (t) {
                e.destroy(t);
              };
            });n.discovery && o.push(function (e) {
              n.discovery.destroy(e);
            }), n.store && o.push(function (e) {
              n.store.close(e);
            }), I(o, t), e && (0 === n.listenerCount("error") ? n.client.emit("error", e) : n.emit("error", e)), n.emit("close"), n.client = null, n.files = [], n.discovery = null, n.store = null, n._rarityMap = null, n._peers = null, n._servers = null, n._xsRequests = null;
          }
        }, o.prototype.addPeer = function (e) {
          var t = this;if (t.destroyed) throw new Error("torrent is destroyed");if (!t.infoHash) throw new Error("addPeer() must not be called before the `infoHash` event");if (t.client.blocked) {
            var n;if ("string" == typeof e) {
              var r;try {
                r = f(e);
              } catch (n) {
                return t._debug("ignoring peer: invalid %s", e), t.emit("invalidPeer", e), !1;
              }n = r[0];
            } else "string" == typeof e.remoteAddress && (n = e.remoteAddress);if (n && t.client.blocked.contains(n)) return t._debug("ignoring peer: blocked %s", e), "string" != typeof e && e.destroy(), t.emit("blockedPeer", e), !1;
          }var o = !!t._addPeer(e);return o ? t.emit("peer", e) : t.emit("invalidPeer", e), o;
        }, o.prototype._addPeer = function (e) {
          var t = this;if (t.destroyed) return "string" != typeof e && e.destroy(), null;if ("string" == typeof e && !t._validAddr(e)) return t._debug("ignoring peer: invalid %s", e), null;var n = e && e.id || e;if (t._peers[n]) return t._debug("ignoring peer: duplicate (%s)", n), "string" != typeof e && e.destroy(), null;if (t.paused) return t._debug("ignoring peer: torrent is paused"), "string" != typeof e && e.destroy(), null;t._debug("add peer %s", n);var r;return r = "string" == typeof e ? N.createTCPOutgoingPeer(e, t) : N.createWebRTCPeer(e, t), t._peers[r.id] = r, t._peersLength += 1, "string" == typeof e && (t._queue.push(r), t._drain()), r;
        }, o.prototype.addWebSeed = function (e) {
          if (this.destroyed) throw new Error("torrent is destroyed");if (!/^https?:\/\/.+/.test(e)) return this.emit("warning", new Error("ignoring invalid web seed: " + e)), void this.emit("invalidPeer", e);if (this._peers[e]) return this.emit("warning", new Error("ignoring duplicate web seed: " + e)), void this.emit("invalidPeer", e);this._debug("add web seed %s", e);var t = N.createWebSeedPeer(e, this);this._peers[t.id] = t, this._peersLength += 1, this.emit("peer", e);
        }, o.prototype._addIncomingPeer = function (e) {
          var t = this;return t.destroyed ? e.destroy(new Error("torrent is destroyed")) : t.paused ? e.destroy(new Error("torrent is paused")) : (this._debug("add incoming peer %s", e.id), t._peers[e.id] = e, void (t._peersLength += 1));
        }, o.prototype.removePeer = function (e) {
          var t = this,
              n = e && e.id || e;(e = t._peers[n]) && (this._debug("removePeer %s", n), delete t._peers[n], t._peersLength -= 1, e.destroy(), t._drain());
        }, o.prototype.select = function (e, t, n, r) {
          var o = this;if (o.destroyed) throw new Error("torrent is destroyed");if (e < 0 || t < e || o.pieces.length <= t) throw new Error("invalid selection ", e, ":", t);n = Number(n) || 0, o._debug("select %s-%s (priority %s)", e, t, n), o._selections.push({ from: e, to: t, offset: 0, priority: n, notify: r || u }), o._selections.sort(function (e, t) {
            return t.priority - e.priority;
          }), o._updateSelections();
        }, o.prototype.deselect = function (e, t, n) {
          var r = this;if (r.destroyed) throw new Error("torrent is destroyed");n = Number(n) || 0, r._debug("deselect %s-%s (priority %s)", e, t, n);for (var o = 0; o < r._selections.length; ++o) {
            var i = r._selections[o];if (i.from === e && i.to === t && i.priority === n) {
              r._selections.splice(o, 1);break;
            }
          }r._updateSelections();
        }, o.prototype.critical = function (e, t) {
          var n = this;if (n.destroyed) throw new Error("torrent is destroyed");n._debug("critical %s-%s", e, t);for (var r = e; r <= t; ++r) {
            n._critical[r] = !0;
          }n._updateSelections();
        }, o.prototype._onWire = function (e, t) {
          var r = this;if (r._debug("got wire %s (%s)", e._debugId, t || "Unknown"), e.on("download", function (e) {
            r.destroyed || (r.received += e, r._downloadSpeed(e), r.client._downloadSpeed(e), r.emit("download", e), r.client.emit("download", e));
          }), e.on("upload", function (e) {
            r.destroyed || (r.uploaded += e, r._uploadSpeed(e), r.client._uploadSpeed(e), r.emit("upload", e), r.client.emit("upload", e));
          }), r.wires.push(e), t) {
            var o = f(t);e.remoteAddress = o[0], e.remotePort = o[1];
          }r.client.dht && r.client.dht.listening && e.on("port", function (n) {
            if (!r.destroyed && !r.client.dht.destroyed) {
              if (!e.remoteAddress) return r._debug("ignoring PORT from peer with no address");if (0 === n || n > 65536) return r._debug("ignoring invalid PORT from peer");r._debug("port: %s (from %s)", n, t), r.client.dht.addNode({ host: e.remoteAddress, port: n });
            }
          }), e.on("timeout", function () {
            r._debug("wire timeout (%s)", t), e.destroy();
          }), e.setTimeout(3e4, !0), e.setKeepAlive(!0), e.use(P(r.metadata)), e.ut_metadata.on("warning", function (e) {
            r._debug("ut_metadata warning: %s", e.message);
          }), r.metadata || (e.ut_metadata.on("metadata", function (e) {
            r._debug("got metadata via ut_metadata"), r._onMetadata(e);
          }), e.ut_metadata.fetch()), "function" != typeof j || r.private || (e.use(j()), e.ut_pex.on("peer", function (e) {
            r.done || (r._debug("ut_pex: got peer: %s (from %s)", e, t), r.addPeer(e));
          }), e.ut_pex.on("dropped", function (e) {
            var n = r._peers[e];n && !n.connected && (r._debug("ut_pex: dropped peer: %s (from %s)", e, t), r.removePeer(e));
          }), e.once("close", function () {
            e.ut_pex.reset();
          })), r.emit("wire", e, t), r.metadata && n.nextTick(function () {
            r._onWireWithMetadata(e);
          });
        }, o.prototype._onWireWithMetadata = function (e) {
          function t() {
            o.destroyed || e.destroyed || (o._numQueued > 2 * (o._numConns - o.numPeers) && e.amInterested ? e.destroy() : (i = setTimeout(t, W), i.unref && i.unref()));
          }function n() {
            if (e.peerPieces.buffer.length === o.bitfield.buffer.length) {
              for (r = 0; r < o.pieces.length; ++r) {
                if (!e.peerPieces.get(r)) return;
              }e.isSeeder = !0, e.choke();
            }
          }var r,
              o = this,
              i = null;e.on("bitfield", function () {
            n(), o._update();
          }), e.on("have", function () {
            n(), o._update();
          }), e.once("interested", function () {
            e.unchoke();
          }), e.once("close", function () {
            clearTimeout(i);
          }), e.on("choke", function () {
            clearTimeout(i), i = setTimeout(t, W), i.unref && i.unref();
          }), e.on("unchoke", function () {
            clearTimeout(i), o._update();
          }), e.on("request", function (t, n, r, i) {
            if (r > 131072) return e.destroy();o.pieces[t] || o.store.get(t, { offset: n, length: r }, i);
          }), e.bitfield(o.bitfield), e.interested(), e.peerExtensions.dht && o.client.dht && o.client.dht.listening && e.port(o.client.dht.address().port), "webSeed" !== e.type && (i = setTimeout(t, W), i.unref && i.unref()), e.isSeeder = !1, n();
        }, o.prototype._updateSelections = function () {
          var e = this;e.ready && !e.destroyed && (n.nextTick(function () {
            e._gcSelections();
          }), e._updateInterest(), e._update());
        }, o.prototype._gcSelections = function () {
          for (var e = this, t = 0; t < e._selections.length; ++t) {
            for (var n = e._selections[t], r = n.offset; e.bitfield.get(n.from + n.offset) && n.from + n.offset < n.to;) {
              n.offset += 1;
            }r !== n.offset && n.notify(), n.to === n.from + n.offset && e.bitfield.get(n.from + n.offset) && (e._selections.splice(t, 1), t -= 1, n.notify(), e._updateInterest());
          }e._selections.length || e.emit("idle");
        }, o.prototype._updateInterest = function () {
          var e = this,
              t = e._amInterested;e._amInterested = !!e._selections.length, e.wires.forEach(function (t) {
            e._amInterested ? t.interested() : t.uninterested();
          }), t !== e._amInterested && (e._amInterested ? e.emit("interested") : e.emit("uninterested"));
        }, o.prototype._update = function () {
          var e = this;if (!e.destroyed) for (var t, n = U(e.wires); t = n();) {
            e._updateWire(t);
          }
        }, o.prototype._updateWire = function (e) {
          function t(t, n, r, o) {
            return function (i) {
              return i >= t && i <= n && !(i in r) && e.peerPieces.get(i) && (!o || o(i));
            };
          }function n() {
            var t = e.downloadSpeed() || 1;if (t > z) return function () {
              return !0;
            };var n = Math.max(1, e.requests.length) * T.BLOCK_LENGTH / t,
                r = 10,
                o = 0;return function (e) {
              if (!r || s.bitfield.get(e)) return !0;for (var i = s.pieces[e].missing; o < s.wires.length; o++) {
                var a = s.wires[o],
                    u = a.downloadSpeed();if (!(u < z) && !(u <= t) && a.peerPieces.get(e) && !((i -= u * n) > 0)) return r--, !1;
              }return !0;
            };
          }function r(e) {
            for (var t = e, n = e; n < s._selections.length && s._selections[n].priority; n++) {
              t = n;
            }var r = s._selections[e];s._selections[e] = s._selections[t], s._selections[t] = r;
          }function o(o) {
            if (e.requests.length >= u) return !0;for (var i = n(), a = 0; a < s._selections.length; a++) {
              var c,
                  f = s._selections[a];if ("rarest" === s.strategy) for (var d = f.from + f.offset, h = f.to, l = h - d + 1, p = {}, m = 0, g = t(d, h, p, i); m < l && !((c = s._rarityMap.getRarestPiece(g)) < 0);) {
                for (; s._request(e, c, s._critical[c] || o);) {}if (!(e.requests.length < u)) return f.priority && r(a), !0;p[c] = !0, m++;
              } else for (c = f.from + f.offset; c <= f.to; c++) {
                if (e.peerPieces.get(c) && i(c)) {
                  for (; s._request(e, c, s._critical[c] || o);) {}if (!(e.requests.length < u)) return f.priority && r(a), !0;
                }
              }
            }return !1;
          }var s = this;if (!e.peerChoking) {
            if (!e.downloaded) return function () {
              if (!e.requests.length) for (var n = s._selections.length; n--;) {
                var r,
                    o = s._selections[n];if ("rarest" === s.strategy) for (var i = o.from + o.offset, a = o.to, u = a - i + 1, c = {}, f = 0, d = t(i, a, c); f < u && !((r = s._rarityMap.getRarestPiece(d)) < 0);) {
                  if (s._request(e, r, !1)) return;c[r] = !0, f += 1;
                } else for (r = o.to; r >= o.from + o.offset; --r) {
                  if (e.peerPieces.get(r) && s._request(e, r, !1)) return;
                }
              }
            }();var a = i(e, .5);if (!(e.requests.length >= a)) {
              var u = i(e, 1);o(!1) || o(!0);
            }
          }
        }, o.prototype._rechoke = function () {
          function e(e, t) {
            return e.downloadSpeed !== t.downloadSpeed ? t.downloadSpeed - e.downloadSpeed : e.uploadSpeed !== t.uploadSpeed ? t.uploadSpeed - e.uploadSpeed : e.wire.amChoking !== t.wire.amChoking ? e.wire.amChoking ? 1 : -1 : e.salt - t.salt;
          }var t = this;if (t.ready) {
            t._rechokeOptimisticTime > 0 ? t._rechokeOptimisticTime -= 1 : t._rechokeOptimisticWire = null;var n = [];t.wires.forEach(function (e) {
              e.isSeeder || e === t._rechokeOptimisticWire || n.push({ wire: e, downloadSpeed: e.downloadSpeed(), uploadSpeed: e.uploadSpeed(), salt: Math.random(), isChoked: !0 });
            }), n.sort(e);for (var r = 0, o = 0; o < n.length && r < t._rechokeNumSlots; ++o) {
              n[o].isChoked = !1, n[o].wire.peerInterested && (r += 1);
            }if (!t._rechokeOptimisticWire && o < n.length && t._rechokeNumSlots) {
              var i = n.slice(o).filter(function (e) {
                return e.wire.peerInterested;
              }),
                  s = i[a(i.length)];s && (s.isChoked = !1, t._rechokeOptimisticWire = s.wire, t._rechokeOptimisticTime = 2);
            }n.forEach(function (e) {
              e.wire.amChoking !== e.isChoked && (e.isChoked ? e.wire.choke() : e.wire.unchoke());
            });
          }
        }, o.prototype._hotswap = function (e, t) {
          var n = this,
              r = e.downloadSpeed();if (r < T.BLOCK_LENGTH) return !1;if (!n._reservations[t]) return !1;var o = n._reservations[t];if (!o) return !1;var i,
              s,
              a = 1 / 0;for (s = 0; s < o.length; s++) {
            var u = o[s];if (u && u !== e) {
              var c = u.downloadSpeed();c >= z || 2 * c > r || c > a || (i = u, a = c);
            }
          }if (!i) return !1;for (s = 0; s < o.length; s++) {
            o[s] === i && (o[s] = null);
          }for (s = 0; s < i.requests.length; s++) {
            var f = i.requests[s];f.piece === t && n.pieces[t].cancel(f.offset / T.BLOCK_LENGTH | 0);
          }return n.emit("hotswap", i, e, t), !0;
        }, o.prototype._request = function (e, t, r) {
          function o() {
            n.nextTick(function () {
              a._update();
            });
          }var a = this,
              u = e.requests.length,
              c = "webSeed" === e.type;if (a.bitfield.get(t)) return !1;if (u >= (c ? Math.min(s(e, 1, a.pieceLength), a.maxWebConns) : i(e, 1))) return !1;var f = a.pieces[t],
              d = c ? f.reserveRemaining() : f.reserve();if (-1 === d && r && a._hotswap(e, t) && (d = c ? f.reserveRemaining() : f.reserve()), -1 === d) return !1;var h = a._reservations[t];h || (h = a._reservations[t] = []);var l = h.indexOf(null);-1 === l && (l = h.length), h[l] = e;var p = f.chunkOffset(d),
              m = c ? f.chunkLengthRemaining(d) : f.chunkLength(d);return e.request(t, p, m, function n(r, i) {
            if (!a.destroyed) {
              if (!a.ready) return a.once("ready", function () {
                n(r, i);
              });if (h[l] === e && (h[l] = null), f !== a.pieces[t]) return o();if (r) return a._debug("error getting piece %s (offset: %s length: %s) from %s: %s", t, p, m, e.remoteAddress + ":" + e.remotePort, r.message), c ? f.cancelRemaining(d) : f.cancel(d), void o();if (a._debug("got piece %s (offset: %s length: %s) from %s", t, p, m, e.remoteAddress + ":" + e.remotePort), !f.set(d, i, e)) return o();var s = f.flush();R(s, function (e) {
                if (!a.destroyed) {
                  if (e === a._hashes[t]) {
                    if (!a.pieces[t]) return;a._debug("piece verified %s", t), a.pieces[t] = null, a._reservations[t] = null, a.bitfield.set(t, !0), a.store.put(t, s), a.wires.forEach(function (e) {
                      e.have(t);
                    }), a._checkDone() && !a.destroyed && a.discovery.complete();
                  } else a.pieces[t] = new T(f.length), a.emit("warning", new Error("Piece " + t + " failed verification"));o();
                }
              });
            }
          }), !0;
        }, o.prototype._checkDone = function () {
          var e = this;if (!e.destroyed) {
            e.files.forEach(function (t) {
              if (!t.done) {
                for (var n = t._startPiece; n <= t._endPiece; ++n) {
                  if (!e.bitfield.get(n)) return;
                }t.done = !0, t.emit("done"), e._debug("file done: " + t.name);
              }
            });for (var t = !0, n = 0; n < e._selections.length; n++) {
              for (var r = e._selections[n], o = r.from; o <= r.to; o++) {
                if (!e.bitfield.get(o)) {
                  t = !1;break;
                }
              }if (!t) break;
            }return !e.done && t && (e.done = !0, e._debug("torrent done: " + e.infoHash), e.emit("done")), e._gcSelections(), t;
          }
        }, o.prototype.load = function (e, t) {
          var n = this;if (n.destroyed) throw new Error("torrent is destroyed");if (!n.ready) return n.once("ready", function () {
            n.load(e, t);
          });Array.isArray(e) || (e = [e]), t || (t = u);var r = new k(e),
              o = new h(n.store, n.pieceLength);L(r, o, function (e) {
            if (e) return t(e);n.pieces.forEach(function (e, t) {
              n.pieces[t] = null, n._reservations[t] = null, n.bitfield.set(t, !0);
            }), n._checkDone(), t(null);
          });
        }, o.prototype.createServer = function (e) {
          if ("function" != typeof D) throw new Error("node.js-only method");if (this.destroyed) throw new Error("torrent is destroyed");var t = new D(this, e);return this._servers.push(t), t;
        }, o.prototype.pause = function () {
          this.destroyed || (this._debug("pause"), this.paused = !0);
        }, o.prototype.resume = function () {
          this.destroyed || (this._debug("resume"), this.paused = !1, this._drain());
        }, o.prototype._debug = function () {
          var e = [].slice.call(arguments);e[0] = "[" + this.client._debugId + "] [" + this._debugId + "] " + e[0], l.apply(null, e);
        }, o.prototype._drain = function () {
          var e = this;if (this._debug("_drain numConns %s maxConns %s", e._numConns, e.client.maxConns), !("function" != typeof x.connect || e.destroyed || e.paused || e._numConns >= e.client.maxConns)) {
            this._debug("drain (%s queued, %s/%s peers)", e._numQueued, e.numPeers, e.client.maxConns);var t = e._queue.shift();if (t) {
              this._debug("tcp connect attempt to %s", t.addr);var n = f(t.addr),
                  r = { host: n[0], port: n[1] },
                  o = t.conn = x.connect(r);o.once("connect", function () {
                t.onConnect();
              }), o.once("error", function (e) {
                t.destroy(e);
              }), t.startConnectTimeout(), o.on("close", function () {
                if (!e.destroyed) {
                  if (t.retries >= F.length) return void e._debug("conn %s closed: will not re-add (max %s attempts)", t.addr, F.length);var n = F[t.retries];e._debug("conn %s closed: will re-add to queue in %sms (attempt %s)", t.addr, n, t.retries + 1);var r = setTimeout(function () {
                    var n = e._addPeer(t.addr);n && (n.retries = t.retries + 1);
                  }, n);r.unref && r.unref();
                }
              });
            }
          }
        }, o.prototype._validAddr = function (e) {
          var t;try {
            t = f(e);
          } catch (e) {
            return !1;
          }var n = t[0],
              r = t[1];return r > 0 && r < 65535 && !("127.0.0.1" === n && r === this.client.torrentPort);
        };
      }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, { "../package.json": 122, "./file": 2, "./peer": 3, "./rarity-map": 4, "./server": 21, _process: 66, "addr-to-ip-port": 7, bitfield: 13, "chunk-store-stream/write": 26, debug: 30, events: 34, fs: 22, "fs-chunk-store": 50, "immediate-chunk-store": 40, inherits: 41, multistream: 58, net: 21, os: 21, "parse-torrent": 62, path: 63, pump: 67, "random-iterate": 72, "run-parallel": 86, "run-parallel-limit": 85, "simple-get": 90, "simple-sha1": 92, speedometer: 94, "torrent-discovery": 106, "torrent-piece": 107, uniq: 110, ut_metadata: 114, ut_pex: 21, xtend: 119, "xtend/mutable": 120 }], 6: [function (e, t, n) {
      function r(e, t) {
        f.call(this), this.url = e, this.webPeerId = c.sync(e), this._torrent = t, this._init();
      }t.exports = r;var o = e("bitfield"),
          i = e("safe-buffer").Buffer,
          s = e("debug")("webtorrent:webconn"),
          a = e("simple-get"),
          u = e("inherits"),
          c = e("simple-sha1"),
          f = e("bittorrent-protocol"),
          d = e("../package.json").version;u(r, f), r.prototype._init = function () {
        var e = this;e.setKeepAlive(!0), e.once("handshake", function (t, n) {
          if (!e.destroyed) {
            e.handshake(t, e.webPeerId);for (var r = e._torrent.pieces.length, i = new o(r), s = 0; s <= r; s++) {
              i.set(s, !0);
            }e.bitfield(i);
          }
        }), e.once("interested", function () {
          s("interested"), e.unchoke();
        }), e.on("uninterested", function () {
          s("uninterested");
        }), e.on("choke", function () {
          s("choke");
        }), e.on("unchoke", function () {
          s("unchoke");
        }), e.on("bitfield", function () {
          s("bitfield");
        }), e.on("request", function (t, n, r, o) {
          s("request pieceIndex=%d offset=%d length=%d", t, n, r), e.httpRequest(t, n, r, o);
        });
      }, r.prototype.httpRequest = function (e, t, n, r) {
        var o,
            u = this,
            c = e * u._torrent.pieceLength,
            f = c + t,
            h = f + n - 1,
            l = u._torrent.files;if (l.length <= 1) o = [{ url: u.url, start: f, end: h }];else {
          var p = l.filter(function (e) {
            return e.offset <= h && e.offset + e.length > f;
          });if (p.length < 1) return r(new Error("Could not find file corresponnding to web seed range request"));o = p.map(function (e) {
            var t = e.offset + e.length - 1;return { url: u.url + ("/" === u.url[u.url.length - 1] ? "" : "/") + e.path, fileOffsetInRange: Math.max(e.offset - f, 0), start: Math.max(f - e.offset, 0), end: Math.min(t, h - e.offset) };
          });
        }var m,
            g = 0,
            y = !1;o.length > 1 && (m = i.alloc(n)), o.forEach(function (i) {
          function u(e, t) {
            if (e.statusCode < 200 || e.statusCode >= 300) return y = !0, r(new Error("Unexpected HTTP status code " + e.statusCode));s("Got data of length %d", t.length), 1 === o.length ? r(null, t) : (t.copy(m, i.fileOffsetInRange), ++g === o.length && r(null, m));
          }var c = i.url,
              f = i.start,
              h = i.end;s("Requesting url=%s pieceIndex=%d offset=%d length=%d start=%d end=%d", c, e, t, n, f, h);var l = { url: c, method: "GET", headers: { "user-agent": "WebTorrent/" + d + " (https://webtorrent.io)", range: "bytes=" + f + "-" + h } };a.concat(l, function (e, t, n) {
            if (!y) return e ? "undefined" == typeof window || c.startsWith(window.location.origin + "/") ? (y = !0, r(e)) : a.head(c, function (t, n) {
              if (!y) {
                if (t) return y = !0, r(t);if (n.statusCode < 200 || n.statusCode >= 300) return y = !0, r(new Error("Unexpected HTTP status code " + n.statusCode));if (n.url === c) return y = !0, r(e);l.url = n.url, a.concat(l, function (e, t, n) {
                  if (!y) return e ? (y = !0, r(e)) : void u(t, n);
                });
              }
            }) : void u(t, n);
          });
        });
      }, r.prototype.destroy = function () {
        f.prototype.destroy.call(this), this._torrent = null;
      };
    }, { "../package.json": 122, bitfield: 13, "bittorrent-protocol": 14, debug: 30, inherits: 41, "safe-buffer": 88, "simple-get": 90, "simple-sha1": 92 }], 7: [function (e, t, n) {
      var r = /^\[?([^\]]+)\]?:(\d+)$/,
          o = {},
          i = 0;t.exports = function (e) {
        if (1e5 === i && t.exports.reset(), !o[e]) {
          var n = r.exec(e);if (!n) throw new Error("invalid addr: " + e);o[e] = [n[1], Number(n[2])], i += 1;
        }return o[e];
      }, t.exports.reset = function () {
        o = {}, i = 0;
      };
    }, {}], 8: [function (e, t, n) {
      "use strict";
      function r(e) {
        var t = e.length;if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");return "=" === e[t - 2] ? 2 : "=" === e[t - 1] ? 1 : 0;
      }function o(e) {
        return 3 * e.length / 4 - r(e);
      }function i(e) {
        var t,
            n,
            o,
            i,
            s,
            a,
            u = e.length;s = r(e), a = new d(3 * u / 4 - s), o = s > 0 ? u - 4 : u;var c = 0;for (t = 0, n = 0; t < o; t += 4, n += 3) {
          i = f[e.charCodeAt(t)] << 18 | f[e.charCodeAt(t + 1)] << 12 | f[e.charCodeAt(t + 2)] << 6 | f[e.charCodeAt(t + 3)], a[c++] = i >> 16 & 255, a[c++] = i >> 8 & 255, a[c++] = 255 & i;
        }return 2 === s ? (i = f[e.charCodeAt(t)] << 2 | f[e.charCodeAt(t + 1)] >> 4, a[c++] = 255 & i) : 1 === s && (i = f[e.charCodeAt(t)] << 10 | f[e.charCodeAt(t + 1)] << 4 | f[e.charCodeAt(t + 2)] >> 2, a[c++] = i >> 8 & 255, a[c++] = 255 & i), a;
      }function s(e) {
        return c[e >> 18 & 63] + c[e >> 12 & 63] + c[e >> 6 & 63] + c[63 & e];
      }function a(e, t, n) {
        for (var r, o = [], i = t; i < n; i += 3) {
          r = (e[i] << 16) + (e[i + 1] << 8) + e[i + 2], o.push(s(r));
        }return o.join("");
      }function u(e) {
        for (var t, n = e.length, r = n % 3, o = "", i = [], s = 0, u = n - r; s < u; s += 16383) {
          i.push(a(e, s, s + 16383 > u ? u : s + 16383));
        }return 1 === r ? (t = e[n - 1], o += c[t >> 2], o += c[t << 4 & 63], o += "==") : 2 === r && (t = (e[n - 2] << 8) + e[n - 1], o += c[t >> 10], o += c[t >> 4 & 63], o += c[t << 2 & 63], o += "="), i.push(o), i.join("");
      }n.byteLength = o, n.toByteArray = i, n.fromByteArray = u;for (var c = [], f = [], d = "undefined" != typeof Uint8Array ? Uint8Array : Array, h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", l = 0, p = h.length; l < p; ++l) {
        c[l] = h[l], f[h.charCodeAt(l)] = l;
      }f["-".charCodeAt(0)] = 62, f["_".charCodeAt(0)] = 63;
    }, {}], 9: [function (e, t, n) {
      (function (e) {
        function n(e, t, n) {
          for (var r = 0, o = 1, i = t; i < n; i++) {
            var s = e[i];if (s < 58 && s >= 48) r = 10 * r + (s - 48);else if (i !== t || 43 !== s) {
              if (i !== t || 45 !== s) {
                if (46 === s) break;throw new Error("not a number: buffer[" + i + "] = " + s);
              }o = -1;
            }
          }return r * o;
        }function r(t, n, o, i) {
          return null == t || 0 === t.length ? null : ("number" != typeof n && null == i && (i = n, n = void 0), "number" != typeof o && null == i && (i = o, o = void 0), r.position = 0, r.encoding = i || null, r.data = e.isBuffer(t) ? t.slice(n, o) : new e(t), r.bytes = r.data.length, r.next());
        }r.bytes = 0, r.position = 0, r.data = null, r.encoding = null, r.next = function () {
          switch (r.data[r.position]) {case 100:
              return r.dictionary();case 108:
              return r.list();case 105:
              return r.integer();default:
              return r.buffer();}
        }, r.find = function (e) {
          for (var t = r.position, n = r.data.length, o = r.data; t < n;) {
            if (o[t] === e) return t;t++;
          }throw new Error('Invalid data: Missing delimiter "' + String.fromCharCode(e) + '" [0x' + e.toString(16) + "]");
        }, r.dictionary = function () {
          r.position++;for (var e = {}; 101 !== r.data[r.position];) {
            e[r.buffer()] = r.next();
          }return r.position++, e;
        }, r.list = function () {
          r.position++;for (var e = []; 101 !== r.data[r.position];) {
            e.push(r.next());
          }return r.position++, e;
        }, r.integer = function () {
          var e = r.find(101),
              t = n(r.data, r.position + 1, e);return r.position += e + 1 - r.position, t;
        }, r.buffer = function () {
          var e = r.find(58),
              t = n(r.data, r.position, e),
              o = ++e + t;return r.position = o, r.encoding ? r.data.toString(r.encoding, e, o) : r.data.slice(e, o);
        }, t.exports = r;
      }).call(this, e("buffer").Buffer);
    }, { buffer: 24 }], 10: [function (e, t, n) {
      (function (e) {
        function n(t, r, o) {
          var i = [],
              s = null;return n._encode(i, t), s = e.concat(i), n.bytes = s.length, e.isBuffer(r) ? (s.copy(r, o), r) : s;
        }n.bytes = -1, n._floatConversionDetected = !1, n._encode = function (t, r) {
          if (e.isBuffer(r)) return t.push(new e(r.length + ":")), void t.push(r);if (null != r) switch (typeof r === "undefined" ? "undefined" : _typeof(r)) {case "string":
              n.buffer(t, r);break;case "number":
              n.number(t, r);break;case "object":
              r.constructor === Array ? n.list(t, r) : n.dict(t, r);break;case "boolean":
              n.number(t, r ? 1 : 0);}
        };var r = new e("e"),
            o = new e("d"),
            i = new e("l");n.buffer = function (t, n) {
          t.push(new e(e.byteLength(n) + ":" + n));
        }, n.number = function (t, r) {
          var o = r / 2147483648 << 0,
              i = r % 2147483648 << 0,
              s = 2147483648 * o + i;t.push(new e("i" + s + "e")), s === r || n._floatConversionDetected || (n._floatConversionDetected = !0, console.warn('WARNING: Possible data corruption detected with value "' + r + '":', 'Bencoding only defines support for integers, value was converted to "' + s + '"'), console.trace());
        }, n.dict = function (e, t) {
          e.push(o);for (var i, s = 0, a = Object.keys(t).sort(), u = a.length; s < u; s++) {
            i = a[s], null != t[i] && (n.buffer(e, i), n._encode(e, t[i]));
          }e.push(r);
        }, n.list = function (e, t) {
          var o = 0,
              s = t.length;for (e.push(i); o < s; o++) {
            null != t[o] && n._encode(e, t[o]);
          }e.push(r);
        }, t.exports = n;
      }).call(this, e("buffer").Buffer);
    }, { buffer: 24 }], 11: [function (e, t, n) {
      var r = t.exports;r.encode = e("./encode"), r.decode = e("./decode"), r.byteLength = r.encodingLength = function (e) {
        return r.encode(e).length;
      };
    }, { "./decode": 9, "./encode": 10 }], 12: [function (e, t, n) {
      t.exports = function (e, t, n, r, o) {
        var i, s;if (void 0 === r) r = 0;else if ((r |= 0) < 0 || r >= e.length) throw new RangeError("invalid lower bound");if (void 0 === o) o = e.length - 1;else if ((o |= 0) < r || o >= e.length) throw new RangeError("invalid upper bound");for (; r <= o;) {
          if (i = r + (o - r >> 1), (s = +n(e[i], t, i, e)) < 0) r = i + 1;else {
            if (!(s > 0)) return i;o = i - 1;
          }
        }return ~r;
      };
    }, {}], 13: [function (e, t, n) {
      (function (e) {
        function n(e, t) {
          if (!(this instanceof n)) return new n(e, t);0 === arguments.length && (e = 0), this.grow = t && (isFinite(t.grow) && r(t.grow) || t.grow) || 0, "number" != typeof e && void 0 !== e || (e = new o(r(e)), e.fill && !e._isBuffer && e.fill(0)), this.buffer = e;
        }function r(e) {
          var t = e >> 3;return e % 8 != 0 && t++, t;
        }var o = void 0 !== e ? e : "undefined" != typeof Int8Array ? Int8Array : function (e) {
          for (var t = new Array(e), n = 0; n < e; n++) {
            t[n] = 0;
          }
        };n.prototype.get = function (e) {
          var t = e >> 3;return t < this.buffer.length && !!(this.buffer[t] & 128 >> e % 8);
        }, n.prototype.set = function (e, t) {
          var n = e >> 3;t || 1 === arguments.length ? (this.buffer.length < n + 1 && this._grow(Math.max(n + 1, Math.min(2 * this.buffer.length, this.grow))), this.buffer[n] |= 128 >> e % 8) : n < this.buffer.length && (this.buffer[n] &= ~(128 >> e % 8));
        }, n.prototype._grow = function (e) {
          if (this.buffer.length < e && e <= this.grow) {
            var t = new o(e);if (t.fill && t.fill(0), this.buffer.copy) this.buffer.copy(t, 0);else for (var n = 0; n < this.buffer.length; n++) {
              t[n] = this.buffer[n];
            }this.buffer = t;
          }
        }, void 0 !== t && (t.exports = n);
      }).call(this, e("buffer").Buffer);
    }, { buffer: 24 }], 14: [function (e, t, n) {
      function r(e, t, n, r) {
        this.piece = e, this.offset = t, this.length = n, this.callback = r;
      }function o() {
        if (!(this instanceof o)) return new o();m.Duplex.call(this), this._debugId = l(4).toString("hex"), this._debug("new wire"), this.peerId = null, this.peerIdBuffer = null, this.type = null, this.amChoking = !0, this.amInterested = !1, this.peerChoking = !0, this.peerInterested = !1, this.peerPieces = new u(0, { grow: g }), this.peerExtensions = {}, this.requests = [], this.peerRequests = [], this.extendedMapping = {}, this.peerExtendedMapping = {}, this.extendedHandshake = {}, this.peerExtendedHandshake = {}, this._ext = {}, this._nextExt = 1, this.uploaded = 0, this.downloaded = 0, this.uploadSpeed = p(), this.downloadSpeed = p(), this._keepAliveInterval = null, this._timeout = null, this._timeoutMs = 0, this.destroyed = !1, this._finished = !1, this._parserSize = 0, this._parser = null, this._buffer = [], this._bufferSize = 0, this.on("finish", this._onFinish), this._parseHandshake();
      }function i(e, t, n, r) {
        for (var o = 0; o < e.length; o++) {
          var i = e[o];if (i.piece === t && i.offset === n && i.length === r) return s(e, o), i;
        }return null;
      }t.exports = o;var s = e("unordered-array-remove"),
          a = e("bencode"),
          u = e("bitfield"),
          c = e("safe-buffer").Buffer,
          f = e("debug")("bittorrent-protocol"),
          d = e("xtend"),
          h = e("inherits"),
          l = e("randombytes"),
          p = e("speedometer"),
          m = e("readable-stream"),
          g = 4e5,
          y = c.from("BitTorrent protocol"),
          _ = c.from([0, 0, 0, 0]),
          v = c.from([0, 0, 0, 1, 0]),
          b = c.from([0, 0, 0, 1, 1]),
          w = c.from([0, 0, 0, 1, 2]),
          E = c.from([0, 0, 0, 1, 3]),
          k = [0, 0, 0, 0, 0, 0, 0, 0],
          x = [0, 0, 0, 3, 9, 0, 0];h(o, m.Duplex), o.prototype.setKeepAlive = function (e) {
        var t = this;t._debug("setKeepAlive %s", e), clearInterval(t._keepAliveInterval), !1 !== e && (t._keepAliveInterval = setInterval(function () {
          t.keepAlive();
        }, 55e3));
      }, o.prototype.setTimeout = function (e, t) {
        this._debug("setTimeout ms=%d unref=%s", e, t), this._clearTimeout(), this._timeoutMs = e, this._timeoutUnref = !!t, this._updateTimeout();
      }, o.prototype.destroy = function () {
        this.destroyed || (this.destroyed = !0, this._debug("destroy"), this.emit("close"), this.end());
      }, o.prototype.end = function () {
        this._debug("end"), this._onUninterested(), this._onChoke(), m.Duplex.prototype.end.apply(this, arguments);
      }, o.prototype.use = function (e) {
        function t() {}var n = e.prototype.name;if (!n) throw new Error('Extension class requires a "name" property on the prototype');this._debug("use extension.name=%s", n);var r = this._nextExt,
            o = new e(this);"function" != typeof o.onHandshake && (o.onHandshake = t), "function" != typeof o.onExtendedHandshake && (o.onExtendedHandshake = t), "function" != typeof o.onMessage && (o.onMessage = t), this.extendedMapping[r] = n, this._ext[n] = o, this[n] = o, this._nextExt += 1;
      }, o.prototype.keepAlive = function () {
        this._debug("keep-alive"), this._push(_);
      }, o.prototype.handshake = function (e, t, n) {
        var r, o;if ("string" == typeof e ? r = c.from(e, "hex") : (r = e, e = r.toString("hex")), "string" == typeof t ? o = c.from(t, "hex") : (o = t, t = o.toString("hex")), 20 !== r.length || 20 !== o.length) throw new Error("infoHash and peerId MUST have length 20");this._debug("handshake i=%s p=%s exts=%o", e, t, n);var i = c.from(k);i[5] |= 16, n && n.dht && (i[7] |= 1), this._push(c.concat([y, i, r, o])), this._handshakeSent = !0, this.peerExtensions.extended && !this._extendedHandshakeSent && this._sendExtendedHandshake();
      }, o.prototype._sendExtendedHandshake = function () {
        var e = d(this.extendedHandshake);e.m = {};for (var t in this.extendedMapping) {
          var n = this.extendedMapping[t];e.m[n] = Number(t);
        }this.extended(0, a.encode(e)), this._extendedHandshakeSent = !0;
      }, o.prototype.choke = function () {
        if (!this.amChoking) {
          for (this.amChoking = !0, this._debug("choke"); this.peerRequests.length;) {
            this.peerRequests.pop();
          }this._push(v);
        }
      }, o.prototype.unchoke = function () {
        this.amChoking && (this.amChoking = !1, this._debug("unchoke"), this._push(b));
      }, o.prototype.interested = function () {
        this.amInterested || (this.amInterested = !0, this._debug("interested"), this._push(w));
      }, o.prototype.uninterested = function () {
        this.amInterested && (this.amInterested = !1, this._debug("uninterested"), this._push(E));
      }, o.prototype.have = function (e) {
        this._debug("have %d", e), this._message(4, [e], null);
      }, o.prototype.bitfield = function (e) {
        this._debug("bitfield"), c.isBuffer(e) || (e = e.buffer), this._message(5, [], e);
      }, o.prototype.request = function (e, t, n, o) {
        return o || (o = function o() {}), this._finished ? o(new Error("wire is closed")) : this.peerChoking ? o(new Error("peer is choking")) : (this._debug("request index=%d offset=%d length=%d", e, t, n), this.requests.push(new r(e, t, n, o)), this._updateTimeout(), void this._message(6, [e, t, n], null));
      }, o.prototype.piece = function (e, t, n) {
        this._debug("piece index=%d offset=%d", e, t), this.uploaded += n.length, this.uploadSpeed(n.length), this.emit("upload", n.length), this._message(7, [e, t], n);
      }, o.prototype.cancel = function (e, t, n) {
        this._debug("cancel index=%d offset=%d length=%d", e, t, n), this._callback(i(this.requests, e, t, n), new Error("request was cancelled"), null), this._message(8, [e, t, n], null);
      }, o.prototype.port = function (e) {
        this._debug("port %d", e);var t = c.from(x);t.writeUInt16BE(e, 5), this._push(t);
      }, o.prototype.extended = function (e, t) {
        if (this._debug("extended ext=%s", e), "string" == typeof e && this.peerExtendedMapping[e] && (e = this.peerExtendedMapping[e]), "number" != typeof e) throw new Error("Unrecognized extension: " + e);var n = c.from([e]),
            r = c.isBuffer(t) ? t : a.encode(t);this._message(20, [], c.concat([n, r]));
      }, o.prototype._read = function () {}, o.prototype._message = function (e, t, n) {
        var r = n ? n.length : 0,
            o = c.allocUnsafe(5 + 4 * t.length);o.writeUInt32BE(o.length + r - 4, 0), o[4] = e;for (var i = 0; i < t.length; i++) {
          o.writeUInt32BE(t[i], 5 + 4 * i);
        }this._push(o), n && this._push(n);
      }, o.prototype._push = function (e) {
        if (!this._finished) return this.push(e);
      }, o.prototype._onKeepAlive = function () {
        this._debug("got keep-alive"), this.emit("keep-alive");
      }, o.prototype._onHandshake = function (e, t, n) {
        var r = e.toString("hex"),
            o = t.toString("hex");this._debug("got handshake i=%s p=%s exts=%o", r, o, n), this.peerId = o, this.peerIdBuffer = t, this.peerExtensions = n, this.emit("handshake", r, o, n);var i;for (i in this._ext) {
          this._ext[i].onHandshake(r, o, n);
        }n.extended && this._handshakeSent && !this._extendedHandshakeSent && this._sendExtendedHandshake();
      }, o.prototype._onChoke = function () {
        for (this.peerChoking = !0, this._debug("got choke"), this.emit("choke"); this.requests.length;) {
          this._callback(this.requests.pop(), new Error("peer is choking"), null);
        }
      }, o.prototype._onUnchoke = function () {
        this.peerChoking = !1, this._debug("got unchoke"), this.emit("unchoke");
      }, o.prototype._onInterested = function () {
        this.peerInterested = !0, this._debug("got interested"), this.emit("interested");
      }, o.prototype._onUninterested = function () {
        this.peerInterested = !1, this._debug("got uninterested"), this.emit("uninterested");
      }, o.prototype._onHave = function (e) {
        this.peerPieces.get(e) || (this._debug("got have %d", e), this.peerPieces.set(e, !0), this.emit("have", e));
      }, o.prototype._onBitField = function (e) {
        this.peerPieces = new u(e), this._debug("got bitfield"), this.emit("bitfield", this.peerPieces);
      }, o.prototype._onRequest = function (e, t, n) {
        var o = this;if (!o.amChoking) {
          o._debug("got request index=%d offset=%d length=%d", e, t, n);var s = function s(r, _s) {
            if (a === i(o.peerRequests, e, t, n)) return r ? o._debug("error satisfying request index=%d offset=%d length=%d (%s)", e, t, n, r.message) : void o.piece(e, t, _s);
          },
              a = new r(e, t, n, s);o.peerRequests.push(a), o.emit("request", e, t, n, s);
        }
      }, o.prototype._onPiece = function (e, t, n) {
        this._debug("got piece index=%d offset=%d", e, t), this._callback(i(this.requests, e, t, n.length), null, n), this.downloaded += n.length, this.downloadSpeed(n.length), this.emit("download", n.length), this.emit("piece", e, t, n);
      }, o.prototype._onCancel = function (e, t, n) {
        this._debug("got cancel index=%d offset=%d length=%d", e, t, n), i(this.peerRequests, e, t, n), this.emit("cancel", e, t, n);
      }, o.prototype._onPort = function (e) {
        this._debug("got port %d", e), this.emit("port", e);
      }, o.prototype._onExtended = function (e, t) {
        if (0 === e) {
          var n;try {
            n = a.decode(t);
          } catch (e) {
            this._debug("ignoring invalid extended handshake: %s", e.message || e);
          }if (!n) return;this.peerExtendedHandshake = n;var r;if ("object" == _typeof(n.m)) for (r in n.m) {
            this.peerExtendedMapping[r] = Number(n.m[r].toString());
          }for (r in this._ext) {
            this.peerExtendedMapping[r] && this._ext[r].onExtendedHandshake(this.peerExtendedHandshake);
          }this._debug("got extended handshake"), this.emit("extended", "handshake", this.peerExtendedHandshake);
        } else this.extendedMapping[e] && (e = this.extendedMapping[e], this._ext[e] && this._ext[e].onMessage(t)), this._debug("got extended message ext=%s", e), this.emit("extended", e, t);
      }, o.prototype._onTimeout = function () {
        this._debug("request timed out"), this._callback(this.requests.shift(), new Error("request has timed out"), null), this.emit("timeout");
      }, o.prototype._write = function (e, t, n) {
        for (this._bufferSize += e.length, this._buffer.push(e); this._bufferSize >= this._parserSize;) {
          var r = 1 === this._buffer.length ? this._buffer[0] : c.concat(this._buffer);this._bufferSize -= this._parserSize, this._buffer = this._bufferSize ? [r.slice(this._parserSize)] : [], this._parser(r.slice(0, this._parserSize));
        }n(null);
      }, o.prototype._callback = function (e, t, n) {
        e && (this._clearTimeout(), this.peerChoking || this._finished || this._updateTimeout(), e.callback(t, n));
      }, o.prototype._clearTimeout = function () {
        this._timeout && (clearTimeout(this._timeout), this._timeout = null);
      }, o.prototype._updateTimeout = function () {
        var e = this;e._timeoutMs && e.requests.length && !e._timeout && (e._timeout = setTimeout(function () {
          e._onTimeout();
        }, e._timeoutMs), e._timeoutUnref && e._timeout.unref && e._timeout.unref());
      }, o.prototype._parse = function (e, t) {
        this._parserSize = e, this._parser = t;
      }, o.prototype._onMessageLength = function (e) {
        var t = e.readUInt32BE(0);t > 0 ? this._parse(t, this._onMessage) : (this._onKeepAlive(), this._parse(4, this._onMessageLength));
      }, o.prototype._onMessage = function (e) {
        switch (this._parse(4, this._onMessageLength), e[0]) {case 0:
            return this._onChoke();case 1:
            return this._onUnchoke();case 2:
            return this._onInterested();case 3:
            return this._onUninterested();case 4:
            return this._onHave(e.readUInt32BE(1));case 5:
            return this._onBitField(e.slice(1));case 6:
            return this._onRequest(e.readUInt32BE(1), e.readUInt32BE(5), e.readUInt32BE(9));case 7:
            return this._onPiece(e.readUInt32BE(1), e.readUInt32BE(5), e.slice(9));case 8:
            return this._onCancel(e.readUInt32BE(1), e.readUInt32BE(5), e.readUInt32BE(9));case 9:
            return this._onPort(e.readUInt16BE(1));case 20:
            return this._onExtended(e.readUInt8(1), e.slice(2));default:
            return this._debug("got unknown message"), this.emit("unknownmessage", e);}
      }, o.prototype._parseHandshake = function () {
        var e = this;e._parse(1, function (t) {
          var n = t.readUInt8(0);e._parse(n + 48, function (t) {
            var r = t.slice(0, n);if ("BitTorrent protocol" !== r.toString()) return e._debug("Error: wire not speaking BitTorrent protocol (%s)", r.toString()), void e.end();t = t.slice(n), e._onHandshake(t.slice(8, 28), t.slice(28, 48), { dht: !!(1 & t[7]), extended: !!(16 & t[5]) }), e._parse(4, e._onMessageLength);
          });
        });
      }, o.prototype._onFinish = function () {
        for (this._finished = !0, this.push(null); this.read();) {}for (clearInterval(this._keepAliveInterval), this._parse(Number.MAX_VALUE, function () {}); this.peerRequests.length;) {
          this.peerRequests.pop();
        }for (; this.requests.length;) {
          this._callback(this.requests.pop(), new Error("wire was closed"), null);
        }
      }, o.prototype._debug = function () {
        var e = [].slice.call(arguments);e[0] = "[" + this._debugId + "] " + e[0], f.apply(null, e);
      };
    }, { bencode: 11, bitfield: 13, debug: 30, inherits: 41, randombytes: 73, "readable-stream": 82, "safe-buffer": 88, speedometer: 94, "unordered-array-remove": 111, xtend: 119 }], 15: [function (e, t, n) {
      (function (n) {
        function r(e) {
          function t(e) {
            n.nextTick(function () {
              a.emit("warning", e);
            });
          }var a = this;if (!(a instanceof r)) return new r(e);if (s.call(a), e || (e = {}), !e.peerId) throw new Error("Option `peerId` is required");if (!e.infoHash) throw new Error("Option `infoHash` is required");if (!e.announce) throw new Error("Option `announce` is required");if (!n.browser && !e.port) throw new Error("Option `port` is required");a.peerId = "string" == typeof e.peerId ? e.peerId : e.peerId.toString("hex"), a._peerIdBuffer = o.from(a.peerId, "hex"), a._peerIdBinary = a._peerIdBuffer.toString("binary"), a.infoHash = "string" == typeof e.infoHash ? e.infoHash : e.infoHash.toString("hex"), a._infoHashBuffer = o.from(a.infoHash, "hex"), a._infoHashBinary = a._infoHashBuffer.toString("binary"), i("new client %s", a.infoHash), a.destroyed = !1, a._port = e.port, a._getAnnounceOpts = e.getAnnounceOpts, a._rtcConfig = e.rtcConfig, a._userAgent = e.userAgent, a._wrtc = "function" == typeof e.wrtc ? e.wrtc() : e.wrtc;var u = "string" == typeof e.announce ? [e.announce] : null == e.announce ? [] : e.announce;u = u.map(function (e) {
            return e = e.toString(), "/" === e[e.length - 1] && (e = e.substring(0, e.length - 1)), e;
          }), u = h(u);var c = !1 !== a._wrtc && (!!a._wrtc || d.WEBRTC_SUPPORT);a._trackers = u.map(function (e) {
            var n = l.parse(e).protocol;return "http:" !== n && "https:" !== n || "function" != typeof m ? "udp:" === n && "function" == typeof g ? new g(a, e) : "ws:" !== n && "wss:" !== n || !c ? (t(new Error("Unsupported tracker protocol: " + e)), null) : "ws:" === n && "undefined" != typeof window && "https:" === window.location.protocol ? (t(new Error("Unsupported tracker protocol: " + e)), null) : new y(a, e) : new m(a, e);
          }).filter(Boolean);
        }t.exports = r;var o = e("safe-buffer").Buffer,
            i = e("debug")("bittorrent-tracker:client"),
            s = e("events").EventEmitter,
            a = e("xtend"),
            u = e("inherits"),
            c = e("once"),
            f = e("run-parallel"),
            d = e("simple-peer"),
            h = e("uniq"),
            l = e("url"),
            p = e("./lib/common"),
            m = e("./lib/client/http-tracker"),
            g = e("./lib/client/udp-tracker"),
            y = e("./lib/client/websocket-tracker");u(r, s), r.scrape = function (e, t) {
          if (t = c(t), !e.infoHash) throw new Error("Option `infoHash` is required");if (!e.announce) throw new Error("Option `announce` is required");var n = a(e, { infoHash: Array.isArray(e.infoHash) ? e.infoHash[0] : e.infoHash, peerId: o.from("01234567890123456789"), port: 6881 }),
              i = new r(n);i.once("error", t), i.once("warning", t);var s = Array.isArray(e.infoHash) ? e.infoHash.length : 1,
              u = {};return i.on("scrape", function (e) {
            if (s -= 1, u[e.infoHash] = e, 0 === s) {
              i.destroy();var n = Object.keys(u);1 === n.length ? t(null, u[n[0]]) : t(null, u);
            }
          }), e.infoHash = Array.isArray(e.infoHash) ? e.infoHash.map(function (e) {
            return o.from(e, "hex");
          }) : o.from(e.infoHash, "hex"), i.scrape({ infoHash: e.infoHash }), i;
        }, r.prototype.start = function (e) {
          var t = this;i("send `start`"), e = t._defaultAnnounceOpts(e), e.event = "started", t._announce(e), t._trackers.forEach(function (e) {
            e.setInterval();
          });
        }, r.prototype.stop = function (e) {
          var t = this;i("send `stop`"), e = t._defaultAnnounceOpts(e), e.event = "stopped", t._announce(e);
        }, r.prototype.complete = function (e) {
          var t = this;i("send `complete`"), e || (e = {}), e = t._defaultAnnounceOpts(e), e.event = "completed", t._announce(e);
        }, r.prototype.update = function (e) {
          var t = this;i("send `update`"), e = t._defaultAnnounceOpts(e), e.event && delete e.event, t._announce(e);
        }, r.prototype._announce = function (e) {
          this._trackers.forEach(function (t) {
            t.announce(e);
          });
        }, r.prototype.scrape = function (e) {
          var t = this;i("send `scrape`"), e || (e = {}), t._trackers.forEach(function (t) {
            t.scrape(e);
          });
        }, r.prototype.setInterval = function (e) {
          var t = this;i("setInterval %d", e), t._trackers.forEach(function (t) {
            t.setInterval(e);
          });
        }, r.prototype.destroy = function (e) {
          var t = this;if (!t.destroyed) {
            t.destroyed = !0, i("destroy");var n = t._trackers.map(function (e) {
              return function (t) {
                e.destroy(t);
              };
            });f(n, e), t._trackers = [], t._getAnnounceOpts = null;
          }
        }, r.prototype._defaultAnnounceOpts = function (e) {
          var t = this;return e || (e = {}), null == e.numwant && (e.numwant = p.DEFAULT_ANNOUNCE_PEERS), null == e.uploaded && (e.uploaded = 0), null == e.downloaded && (e.downloaded = 0), t._getAnnounceOpts && (e = a(e, t._getAnnounceOpts())), e;
        };
      }).call(this, e("_process"));
    }, { "./lib/client/http-tracker": 21, "./lib/client/udp-tracker": 21, "./lib/client/websocket-tracker": 17, "./lib/common": 18, _process: 66, debug: 30, events: 34, inherits: 41, once: 60, "run-parallel": 86, "safe-buffer": 88, "simple-peer": 91, uniq: 110, url: 112, xtend: 119 }], 16: [function (e, t, n) {
      function r(e, t) {
        var n = this;o.call(n), n.client = e, n.announceUrl = t, n.interval = null, n.destroyed = !1;
      }t.exports = r;var o = e("events").EventEmitter;e("inherits")(r, o), r.prototype.setInterval = function (e) {
        var t = this;null == e && (e = t.DEFAULT_ANNOUNCE_INTERVAL), clearInterval(t.interval), e && (t.interval = setInterval(function () {
          t.announce(t.client._defaultAnnounceOpts());
        }, e), t.interval.unref && t.interval.unref());
      };
    }, { events: 34, inherits: 41 }], 17: [function (e, t, n) {
      function r(e, t, n) {
        var r = this;h.call(r, e, t), i("new websocket tracker %s", t), r.peers = {}, r.socket = null, r.reconnecting = !1, r.retries = 0, r.reconnectTimer = null, r.expectingResponse = !1, r._openSocket();
      }function o() {}t.exports = r;var i = e("debug")("bittorrent-tracker:websocket-tracker"),
          s = e("xtend"),
          a = e("inherits"),
          u = e("simple-peer"),
          c = e("randombytes"),
          f = e("simple-websocket"),
          d = e("../common"),
          h = e("./tracker"),
          l = {},
          p = 5e4;a(r, h), r.prototype.DEFAULT_ANNOUNCE_INTERVAL = 3e4, r.prototype.announce = function (e) {
        var t = this;if (!t.destroyed && !t.reconnecting) {
          if (!t.socket.connected) return void t.socket.once("connect", function () {
            t.announce(e);
          });var n = s(e, { action: "announce", info_hash: t.client._infoHashBinary, peer_id: t.client._peerIdBinary });if (t._trackerId && (n.trackerid = t._trackerId), "stopped" === e.event || "completed" === e.event) t._send(n);else {
            var r = Math.min(e.numwant, 10);t._generateOffers(r, function (e) {
              n.numwant = r, n.offers = e, t._send(n);
            });
          }
        }
      }, r.prototype.scrape = function (e) {
        var t = this;if (!t.destroyed && !t.reconnecting) {
          if (!t.socket.connected) return void t.socket.once("connect", function () {
            t.scrape(e);
          });var n = Array.isArray(e.infoHash) && e.infoHash.length > 0 ? e.infoHash.map(function (e) {
            return e.toString("binary");
          }) : e.infoHash && e.infoHash.toString("binary") || t.client._infoHashBinary,
              r = { action: "scrape", info_hash: n };t._send(r);
        }
      }, r.prototype.destroy = function (e) {
        function t() {
          a && (clearTimeout(a), a = null), s.removeListener("data", t), s.destroy(), s = null;
        }var n = this;if (e || (e = o), n.destroyed) return e(null);n.destroyed = !0, clearInterval(n.interval), clearTimeout(n.reconnectTimer);for (var r in n.peers) {
          var i = n.peers[r];clearTimeout(i.trackerTimeout), i.destroy();
        }if (n.peers = null, n.socket && (n.socket.removeListener("connect", n._onSocketConnectBound), n.socket.removeListener("data", n._onSocketDataBound), n.socket.removeListener("close", n._onSocketCloseBound), n.socket.removeListener("error", n._onSocketErrorBound), n.socket = null), n._onSocketConnectBound = null, n._onSocketErrorBound = null, n._onSocketDataBound = null, n._onSocketCloseBound = null, l[n.announceUrl] && (l[n.announceUrl].consumers -= 1), l[n.announceUrl].consumers > 0) return e();var s = l[n.announceUrl];if (delete l[n.announceUrl], s.on("error", o), s.once("close", e), !n.expectingResponse) return t();var a = setTimeout(t, d.DESTROY_TIMEOUT);s.once("data", t);
      }, r.prototype._openSocket = function () {
        var e = this;e.destroyed = !1, e.peers || (e.peers = {}), e._onSocketConnectBound = function () {
          e._onSocketConnect();
        }, e._onSocketErrorBound = function (t) {
          e._onSocketError(t);
        }, e._onSocketDataBound = function (t) {
          e._onSocketData(t);
        }, e._onSocketCloseBound = function () {
          e._onSocketClose();
        }, e.socket = l[e.announceUrl], e.socket ? l[e.announceUrl].consumers += 1 : (e.socket = l[e.announceUrl] = new f(e.announceUrl), e.socket.consumers = 1, e.socket.once("connect", e._onSocketConnectBound)), e.socket.on("data", e._onSocketDataBound), e.socket.once("close", e._onSocketCloseBound), e.socket.once("error", e._onSocketErrorBound);
      }, r.prototype._onSocketConnect = function () {
        var e = this;e.destroyed || e.reconnecting && (e.reconnecting = !1, e.retries = 0, e.announce(e.client._defaultAnnounceOpts()));
      }, r.prototype._onSocketData = function (e) {
        var t = this;if (!t.destroyed) {
          t.expectingResponse = !1;try {
            e = JSON.parse(e);
          } catch (e) {
            return void t.client.emit("warning", new Error("Invalid tracker response"));
          }"announce" === e.action ? t._onAnnounceResponse(e) : "scrape" === e.action ? t._onScrapeResponse(e) : t._onSocketError(new Error("invalid action in WS response: " + e.action));
        }
      }, r.prototype._onAnnounceResponse = function (e) {
        var t = this;if (e.info_hash !== t.client._infoHashBinary) return void i("ignoring websocket data from %s for %s (looking for %s: reused socket)", t.announceUrl, d.binaryToHex(e.info_hash), t.client.infoHash);if (!e.peer_id || e.peer_id !== t.client._peerIdBinary) {
          i("received %s from %s for %s", JSON.stringify(e), t.announceUrl, t.client.infoHash);var n = e["failure reason"];if (n) return t.client.emit("warning", new Error(n));var r = e["warning message"];r && t.client.emit("warning", new Error(r));var o = e.interval || e["min interval"];o && t.setInterval(1e3 * o);var s = e["tracker id"];if (s && (t._trackerId = s), null != e.complete) {
            var a = Object.assign({}, e, { announce: t.announceUrl, infoHash: d.binaryToHex(e.info_hash) });t.client.emit("update", a);
          }var u;if (e.offer && e.peer_id && (i("creating peer (from remote offer)"), u = t._createPeer(), u.id = d.binaryToHex(e.peer_id), u.once("signal", function (n) {
            var r = { action: "announce", info_hash: t.client._infoHashBinary, peer_id: t.client._peerIdBinary, to_peer_id: e.peer_id, answer: n, offer_id: e.offer_id };t._trackerId && (r.trackerid = t._trackerId), t._send(r);
          }), u.signal(e.offer), t.client.emit("peer", u)), e.answer && e.peer_id) {
            var c = d.binaryToHex(e.offer_id);u = t.peers[c], u ? (u.id = d.binaryToHex(e.peer_id), u.signal(e.answer), t.client.emit("peer", u), clearTimeout(u.trackerTimeout), u.trackerTimeout = null, delete t.peers[c]) : i("got unexpected answer: " + JSON.stringify(e.answer));
          }
        }
      }, r.prototype._onScrapeResponse = function (e) {
        var t = this;e = e.files || {};var n = Object.keys(e);if (0 === n.length) return void t.client.emit("warning", new Error("invalid scrape response"));n.forEach(function (n) {
          var r = Object.assign(e[n], { announce: t.announceUrl, infoHash: d.binaryToHex(n) });t.client.emit("scrape", r);
        });
      }, r.prototype._onSocketClose = function () {
        var e = this;e.destroyed || (e.destroy(), e._startReconnectTimer());
      }, r.prototype._onSocketError = function (e) {
        var t = this;t.destroyed || (t.destroy(), t.client.emit("warning", e), t._startReconnectTimer());
      }, r.prototype._startReconnectTimer = function () {
        var e = this,
            t = Math.floor(3e4 * Math.random()) + Math.min(15e3 * Math.pow(2, e.retries), 18e5);e.reconnecting = !0, clearTimeout(e.reconnectTimer), e.reconnectTimer = setTimeout(function () {
          e.retries++, e._openSocket();
        }, t), e.reconnectTimer.unref && e.reconnectTimer.unref(), i("reconnecting socket in %s ms", t);
      }, r.prototype._send = function (e) {
        var t = this;if (!t.destroyed) {
          t.expectingResponse = !0;var n = JSON.stringify(e);i("send %s", n), t.socket.send(n);
        }
      }, r.prototype._generateOffers = function (e, t) {
        function n() {
          o.length === e && (i("generated %s offers", e), t(o));
        }var r = this,
            o = [];i("generating %s offers", e);for (var s = 0; s < e; ++s) {
          !function () {
            var e = c(20).toString("hex");i("creating peer (from _generateOffers)");var t = r.peers[e] = r._createPeer({ initiator: !0 });t.once("signal", function (t) {
              o.push({ offer: t, offer_id: d.hexToBinary(e) }), n();
            }), t.trackerTimeout = setTimeout(function () {
              i("tracker timeout: destroying peer"), t.trackerTimeout = null, delete r.peers[e], t.destroy();
            }, p), t.trackerTimeout.unref && t.trackerTimeout.unref();
          }();
        }n();
      }, r.prototype._createPeer = function (e) {
        function t(e) {
          r.client.emit("warning", new Error("Connection error: " + e.message)), o.destroy();
        }function n() {
          o.removeListener("error", t), o.removeListener("connect", n);
        }var r = this;e = Object.assign({ trickle: !1, config: r.client._rtcConfig, wrtc: r.client._wrtc }, e);var o = new u(e);return o.once("error", t), o.once("connect", n), o;
      };
    }, { "../common": 18, "./tracker": 16, debug: 30, inherits: 41, randombytes: 73, "simple-peer": 91, "simple-websocket": 93, xtend: 119 }], 18: [function (e, t, n) {
      var r = e("safe-buffer").Buffer,
          o = e("xtend/mutable");n.DEFAULT_ANNOUNCE_PEERS = 50, n.MAX_ANNOUNCE_PEERS = 82, n.binaryToHex = function (e) {
        return "string" != typeof e && (e = String(e)), r.from(e, "binary").toString("hex");
      }, n.hexToBinary = function (e) {
        return "string" != typeof e && (e = String(e)), r.from(e, "hex").toString("binary");
      }, o(n, e("./common-node"));
    }, { "./common-node": 21, "safe-buffer": 88, "xtend/mutable": 120 }], 19: [function (e, t, n) {
      (function (e) {
        t.exports = function (t, n) {
          function r(t) {
            o.removeEventListener("loadend", r, !1), t.error ? n(t.error) : n(null, new e(o.result));
          }if ("undefined" == typeof Blob || !(t instanceof Blob)) throw new Error("first argument must be a Blob");if ("function" != typeof n) throw new Error("second argument must be a function");var o = new FileReader();o.addEventListener("loadend", r, !1), o.readAsArrayBuffer(t);
        };
      }).call(this, e("buffer").Buffer);
    }, { buffer: 24 }], 20: [function (e, t, n) {
      (function (n) {
        function r(e, t) {
          if (!(this instanceof r)) return new r(e, t);i.call(this), t || (t = {}), "object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) && (t = e, e = t.size), this.size = e || 512, t.nopad ? this._zeroPadding = !1 : this._zeroPadding = s(t.zeroPadding, !0), this._buffered = [], this._bufferedBytes = 0;
        }var o = e("inherits"),
            i = e("readable-stream").Transform,
            s = e("defined");t.exports = r, o(r, i), r.prototype._transform = function (e, t, r) {
          for (this._bufferedBytes += e.length, this._buffered.push(e); this._bufferedBytes >= this.size;) {
            var o = n.concat(this._buffered);this._bufferedBytes -= this.size, this.push(o.slice(0, this.size)), this._buffered = [o.slice(this.size, o.length)];
          }r();
        }, r.prototype._flush = function () {
          if (this._bufferedBytes && this._zeroPadding) {
            var e = new n(this.size - this._bufferedBytes);e.fill(0), this._buffered.push(e), this.push(n.concat(this._buffered)), this._buffered = null;
          } else this._bufferedBytes && (this.push(n.concat(this._buffered)), this._buffered = null);this.push(null);
        };
      }).call(this, e("buffer").Buffer);
    }, { buffer: 24, defined: 32, inherits: 41, "readable-stream": 82 }], 21: [function (e, t, n) {}, {}], 22: [function (e, t, n) {
      arguments[4][21][0].apply(n, arguments);
    }, { dup: 21 }], 23: [function (e, t, n) {
      (function (t) {
        "use strict";
        var r = e("buffer"),
            o = r.Buffer,
            i = r.SlowBuffer,
            s = r.kMaxLength || 2147483647;n.alloc = function (e, t, n) {
          if ("function" == typeof o.alloc) return o.alloc(e, t, n);if ("number" == typeof n) throw new TypeError("encoding must not be number");if ("number" != typeof e) throw new TypeError("size must be a number");if (e > s) throw new RangeError("size is too large");var r = n,
              i = t;void 0 === i && (r = void 0, i = 0);var a = new o(e);if ("string" == typeof i) for (var u = new o(i, r), c = u.length, f = -1; ++f < e;) {
            a[f] = u[f % c];
          } else a.fill(i);return a;
        }, n.allocUnsafe = function (e) {
          if ("function" == typeof o.allocUnsafe) return o.allocUnsafe(e);if ("number" != typeof e) throw new TypeError("size must be a number");if (e > s) throw new RangeError("size is too large");return new o(e);
        }, n.from = function (e, n, r) {
          if ("function" == typeof o.from && (!t.Uint8Array || Uint8Array.from !== o.from)) return o.from(e, n, r);if ("number" == typeof e) throw new TypeError('"value" argument must not be a number');if ("string" == typeof e) return new o(e, n);if ("undefined" != typeof ArrayBuffer && e instanceof ArrayBuffer) {
            var i = n;if (1 === arguments.length) return new o(e);void 0 === i && (i = 0);var s = r;if (void 0 === s && (s = e.byteLength - i), i >= e.byteLength) throw new RangeError("'offset' is out of bounds");if (s > e.byteLength - i) throw new RangeError("'length' is out of bounds");return new o(e.slice(i, i + s));
          }if (o.isBuffer(e)) {
            var a = new o(e.length);return e.copy(a, 0, 0, e.length), a;
          }if (e) {
            if (Array.isArray(e) || "undefined" != typeof ArrayBuffer && e.buffer instanceof ArrayBuffer || "length" in e) return new o(e);if ("Buffer" === e.type && Array.isArray(e.data)) return new o(e.data);
          }throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
        }, n.allocUnsafeSlow = function (e) {
          if ("function" == typeof o.allocUnsafeSlow) return o.allocUnsafeSlow(e);if ("number" != typeof e) throw new TypeError("size must be a number");if (e >= s) throw new RangeError("size is too large");return new i(e);
        };
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, { buffer: 24 }], 24: [function (e, t, n) {
      "use strict";
      function r(e) {
        if (e > X) throw new RangeError("Invalid typed array length");var t = new Uint8Array(e);return t.__proto__ = o.prototype, t;
      }function o(e, t, n) {
        if ("number" == typeof e) {
          if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");return u(e);
        }return i(e, t, n);
      }function i(e, t, n) {
        if ("number" == typeof e) throw new TypeError('"value" argument must not be a number');return e instanceof ArrayBuffer ? d(e, t, n) : "string" == typeof e ? c(e, t) : h(e);
      }function s(e) {
        if ("number" != typeof e) throw new TypeError('"size" argument must be a number');if (e < 0) throw new RangeError('"size" argument must not be negative');
      }function a(e, t, n) {
        return s(e), e <= 0 ? r(e) : void 0 !== t ? "string" == typeof n ? r(e).fill(t, n) : r(e).fill(t) : r(e);
      }function u(e) {
        return s(e), r(e < 0 ? 0 : 0 | l(e));
      }function c(e, t) {
        if ("string" == typeof t && "" !== t || (t = "utf8"), !o.isEncoding(t)) throw new TypeError('"encoding" must be a valid string encoding');var n = 0 | m(e, t),
            i = r(n),
            s = i.write(e, t);return s !== n && (i = i.slice(0, s)), i;
      }function f(e) {
        for (var t = e.length < 0 ? 0 : 0 | l(e.length), n = r(t), o = 0; o < t; o += 1) {
          n[o] = 255 & e[o];
        }return n;
      }function d(e, t, n) {
        if (t < 0 || e.byteLength < t) throw new RangeError("'offset' is out of bounds");if (e.byteLength < t + (n || 0)) throw new RangeError("'length' is out of bounds");var r;return r = void 0 === t && void 0 === n ? new Uint8Array(e) : void 0 === n ? new Uint8Array(e, t) : new Uint8Array(e, t, n), r.__proto__ = o.prototype, r;
      }function h(e) {
        if (o.isBuffer(e)) {
          var t = 0 | l(e.length),
              n = r(t);return 0 === n.length ? n : (e.copy(n, 0, 0, t), n);
        }if (e) {
          if (V(e) || "length" in e) return "number" != typeof e.length || G(e.length) ? r(0) : f(e);if ("Buffer" === e.type && Array.isArray(e.data)) return f(e.data);
        }throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
      }function l(e) {
        if (e >= X) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + X.toString(16) + " bytes");return 0 | e;
      }function p(e) {
        return +e != e && (e = 0), o.alloc(+e);
      }function m(e, t) {
        if (o.isBuffer(e)) return e.length;if (V(e) || e instanceof ArrayBuffer) return e.byteLength;"string" != typeof e && (e = "" + e);var n = e.length;if (0 === n) return 0;for (var r = !1;;) {
          switch (t) {case "ascii":case "latin1":case "binary":
              return n;case "utf8":case "utf-8":case void 0:
              return q(e).length;case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":
              return 2 * n;case "hex":
              return n >>> 1;case "base64":
              return z(e).length;default:
              if (r) return q(e).length;t = ("" + t).toLowerCase(), r = !0;}
        }
      }function g(e, t, n) {
        var r = !1;if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";if ((void 0 === n || n > this.length) && (n = this.length), n <= 0) return "";if (n >>>= 0, t >>>= 0, n <= t) return "";for (e || (e = "utf8");;) {
          switch (e) {case "hex":
              return L(this, t, n);case "utf8":case "utf-8":
              return B(this, t, n);case "ascii":
              return C(this, t, n);case "latin1":case "binary":
              return T(this, t, n);case "base64":
              return I(this, t, n);case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":
              return U(this, t, n);default:
              if (r) throw new TypeError("Unknown encoding: " + e);e = (e + "").toLowerCase(), r = !0;}
        }
      }function y(e, t, n) {
        var r = e[t];e[t] = e[n], e[n] = r;
      }function _(e, t, n, r, i) {
        if (0 === e.length) return -1;if ("string" == typeof n ? (r = n, n = 0) : n > 2147483647 ? n = 2147483647 : n < -2147483648 && (n = -2147483648), n = +n, G(n) && (n = i ? 0 : e.length - 1), n < 0 && (n = e.length + n), n >= e.length) {
          if (i) return -1;n = e.length - 1;
        } else if (n < 0) {
          if (!i) return -1;n = 0;
        }if ("string" == typeof t && (t = o.from(t, r)), o.isBuffer(t)) return 0 === t.length ? -1 : v(e, t, n, r, i);if ("number" == typeof t) return t &= 255, "function" == typeof Uint8Array.prototype.indexOf ? i ? Uint8Array.prototype.indexOf.call(e, t, n) : Uint8Array.prototype.lastIndexOf.call(e, t, n) : v(e, [t], n, r, i);throw new TypeError("val must be string, number or Buffer");
      }function v(e, t, n, r, o) {
        function i(e, t) {
          return 1 === s ? e[t] : e.readUInt16BE(t * s);
        }var s = 1,
            a = e.length,
            u = t.length;if (void 0 !== r && ("ucs2" === (r = String(r).toLowerCase()) || "ucs-2" === r || "utf16le" === r || "utf-16le" === r)) {
          if (e.length < 2 || t.length < 2) return -1;s = 2, a /= 2, u /= 2, n /= 2;
        }var c;if (o) {
          var f = -1;for (c = n; c < a; c++) {
            if (i(e, c) === i(t, -1 === f ? 0 : c - f)) {
              if (-1 === f && (f = c), c - f + 1 === u) return f * s;
            } else -1 !== f && (c -= c - f), f = -1;
          }
        } else for (n + u > a && (n = a - u), c = n; c >= 0; c--) {
          for (var d = !0, h = 0; h < u; h++) {
            if (i(e, c + h) !== i(t, h)) {
              d = !1;break;
            }
          }if (d) return c;
        }return -1;
      }function b(e, t, n, r) {
        n = Number(n) || 0;var o = e.length - n;r ? (r = Number(r)) > o && (r = o) : r = o;var i = t.length;if (i % 2 != 0) throw new TypeError("Invalid hex string");r > i / 2 && (r = i / 2);for (var s = 0; s < r; ++s) {
          var a = parseInt(t.substr(2 * s, 2), 16);if (G(a)) return s;e[n + s] = a;
        }return s;
      }function w(e, t, n, r) {
        return F(q(t, e.length - n), e, n, r);
      }function E(e, t, n, r) {
        return F(D(t), e, n, r);
      }function k(e, t, n, r) {
        return E(e, t, n, r);
      }function x(e, t, n, r) {
        return F(z(t), e, n, r);
      }function S(e, t, n, r) {
        return F(W(t, e.length - n), e, n, r);
      }function I(e, t, n) {
        return 0 === t && n === e.length ? $.fromByteArray(e) : $.fromByteArray(e.slice(t, n));
      }function B(e, t, n) {
        n = Math.min(e.length, n);for (var r = [], o = t; o < n;) {
          var i = e[o],
              s = null,
              a = i > 239 ? 4 : i > 223 ? 3 : i > 191 ? 2 : 1;if (o + a <= n) {
            var u, c, f, d;switch (a) {case 1:
                i < 128 && (s = i);break;case 2:
                u = e[o + 1], 128 == (192 & u) && (d = (31 & i) << 6 | 63 & u) > 127 && (s = d);break;case 3:
                u = e[o + 1], c = e[o + 2], 128 == (192 & u) && 128 == (192 & c) && (d = (15 & i) << 12 | (63 & u) << 6 | 63 & c) > 2047 && (d < 55296 || d > 57343) && (s = d);break;case 4:
                u = e[o + 1], c = e[o + 2], f = e[o + 3], 128 == (192 & u) && 128 == (192 & c) && 128 == (192 & f) && (d = (15 & i) << 18 | (63 & u) << 12 | (63 & c) << 6 | 63 & f) > 65535 && d < 1114112 && (s = d);}
          }null === s ? (s = 65533, a = 1) : s > 65535 && (s -= 65536, r.push(s >>> 10 & 1023 | 55296), s = 56320 | 1023 & s), r.push(s), o += a;
        }return A(r);
      }function A(e) {
        var t = e.length;if (t <= J) return String.fromCharCode.apply(String, e);for (var n = "", r = 0; r < t;) {
          n += String.fromCharCode.apply(String, e.slice(r, r += J));
        }return n;
      }function C(e, t, n) {
        var r = "";n = Math.min(e.length, n);for (var o = t; o < n; ++o) {
          r += String.fromCharCode(127 & e[o]);
        }return r;
      }function T(e, t, n) {
        var r = "";n = Math.min(e.length, n);for (var o = t; o < n; ++o) {
          r += String.fromCharCode(e[o]);
        }return r;
      }function L(e, t, n) {
        var r = e.length;(!t || t < 0) && (t = 0), (!n || n < 0 || n > r) && (n = r);for (var o = "", i = t; i < n; ++i) {
          o += N(e[i]);
        }return o;
      }function U(e, t, n) {
        for (var r = e.slice(t, n), o = "", i = 0; i < r.length; i += 2) {
          o += String.fromCharCode(r[i] + 256 * r[i + 1]);
        }return o;
      }function R(e, t, n) {
        if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");if (e + t > n) throw new RangeError("Trying to access beyond buffer length");
      }function O(e, t, n, r, i, s) {
        if (!o.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');if (t > i || t < s) throw new RangeError('"value" argument is out of bounds');if (n + r > e.length) throw new RangeError("Index out of range");
      }function M(e, t, n, r, o, i) {
        if (n + r > e.length) throw new RangeError("Index out of range");if (n < 0) throw new RangeError("Index out of range");
      }function P(e, t, n, r, o) {
        return t = +t, n >>>= 0, o || M(e, t, n, 4, 3.4028234663852886e38, -3.4028234663852886e38), K.write(e, t, n, r, 23, 4), n + 4;
      }function j(e, t, n, r, o) {
        return t = +t, n >>>= 0, o || M(e, t, n, 8, 1.7976931348623157e308, -1.7976931348623157e308), K.write(e, t, n, r, 52, 8), n + 8;
      }function H(e) {
        if (e = e.trim().replace(Y, ""), e.length < 2) return "";for (; e.length % 4 != 0;) {
          e += "=";
        }return e;
      }function N(e) {
        return e < 16 ? "0" + e.toString(16) : e.toString(16);
      }function q(e, t) {
        t = t || 1 / 0;for (var n, r = e.length, o = null, i = [], s = 0; s < r; ++s) {
          if ((n = e.charCodeAt(s)) > 55295 && n < 57344) {
            if (!o) {
              if (n > 56319) {
                (t -= 3) > -1 && i.push(239, 191, 189);continue;
              }if (s + 1 === r) {
                (t -= 3) > -1 && i.push(239, 191, 189);continue;
              }o = n;continue;
            }if (n < 56320) {
              (t -= 3) > -1 && i.push(239, 191, 189), o = n;continue;
            }n = 65536 + (o - 55296 << 10 | n - 56320);
          } else o && (t -= 3) > -1 && i.push(239, 191, 189);if (o = null, n < 128) {
            if ((t -= 1) < 0) break;i.push(n);
          } else if (n < 2048) {
            if ((t -= 2) < 0) break;i.push(n >> 6 | 192, 63 & n | 128);
          } else if (n < 65536) {
            if ((t -= 3) < 0) break;i.push(n >> 12 | 224, n >> 6 & 63 | 128, 63 & n | 128);
          } else {
            if (!(n < 1114112)) throw new Error("Invalid code point");if ((t -= 4) < 0) break;i.push(n >> 18 | 240, n >> 12 & 63 | 128, n >> 6 & 63 | 128, 63 & n | 128);
          }
        }return i;
      }function D(e) {
        for (var t = [], n = 0; n < e.length; ++n) {
          t.push(255 & e.charCodeAt(n));
        }return t;
      }function W(e, t) {
        for (var n, r, o, i = [], s = 0; s < e.length && !((t -= 2) < 0); ++s) {
          n = e.charCodeAt(s), r = n >> 8, o = n % 256, i.push(o), i.push(r);
        }return i;
      }function z(e) {
        return $.toByteArray(H(e));
      }function F(e, t, n, r) {
        for (var o = 0; o < r && !(o + n >= t.length || o >= e.length); ++o) {
          t[o + n] = e[o];
        }return o;
      }function V(e) {
        return "function" == typeof ArrayBuffer.isView && ArrayBuffer.isView(e);
      }function G(e) {
        return e !== e;
      }var $ = e("base64-js"),
          K = e("ieee754");n.Buffer = o, n.SlowBuffer = p, n.INSPECT_MAX_BYTES = 50;var X = 2147483647;n.kMaxLength = X, o.TYPED_ARRAY_SUPPORT = function () {
        try {
          var e = new Uint8Array(1);return e.__proto__ = { __proto__: Uint8Array.prototype, foo: function foo() {
              return 42;
            } }, 42 === e.foo();
        } catch (e) {
          return !1;
        }
      }(), o.TYPED_ARRAY_SUPPORT || "undefined" == typeof console || "function" != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), "undefined" != typeof Symbol && Symbol.species && o[Symbol.species] === o && Object.defineProperty(o, Symbol.species, { value: null, configurable: !0, enumerable: !1, writable: !1 }), o.poolSize = 8192, o.from = function (e, t, n) {
        return i(e, t, n);
      }, o.prototype.__proto__ = Uint8Array.prototype, o.__proto__ = Uint8Array, o.alloc = function (e, t, n) {
        return a(e, t, n);
      }, o.allocUnsafe = function (e) {
        return u(e);
      }, o.allocUnsafeSlow = function (e) {
        return u(e);
      }, o.isBuffer = function (e) {
        return null != e && !0 === e._isBuffer;
      }, o.compare = function (e, t) {
        if (!o.isBuffer(e) || !o.isBuffer(t)) throw new TypeError("Arguments must be Buffers");if (e === t) return 0;for (var n = e.length, r = t.length, i = 0, s = Math.min(n, r); i < s; ++i) {
          if (e[i] !== t[i]) {
            n = e[i], r = t[i];break;
          }
        }return n < r ? -1 : r < n ? 1 : 0;
      }, o.isEncoding = function (e) {
        switch (String(e).toLowerCase()) {case "hex":case "utf8":case "utf-8":case "ascii":case "latin1":case "binary":case "base64":case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":
            return !0;default:
            return !1;}
      }, o.concat = function (e, t) {
        if (!Array.isArray(e)) throw new TypeError('"list" argument must be an Array of Buffers');if (0 === e.length) return o.alloc(0);var n;if (void 0 === t) for (t = 0, n = 0; n < e.length; ++n) {
          t += e[n].length;
        }var r = o.allocUnsafe(t),
            i = 0;for (n = 0; n < e.length; ++n) {
          var s = e[n];if (!o.isBuffer(s)) throw new TypeError('"list" argument must be an Array of Buffers');s.copy(r, i), i += s.length;
        }return r;
      }, o.byteLength = m, o.prototype._isBuffer = !0, o.prototype.swap16 = function () {
        var e = this.length;if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");for (var t = 0; t < e; t += 2) {
          y(this, t, t + 1);
        }return this;
      }, o.prototype.swap32 = function () {
        var e = this.length;if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");for (var t = 0; t < e; t += 4) {
          y(this, t, t + 3), y(this, t + 1, t + 2);
        }return this;
      }, o.prototype.swap64 = function () {
        var e = this.length;if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");for (var t = 0; t < e; t += 8) {
          y(this, t, t + 7), y(this, t + 1, t + 6), y(this, t + 2, t + 5), y(this, t + 3, t + 4);
        }return this;
      }, o.prototype.toString = function () {
        var e = this.length;return 0 === e ? "" : 0 === arguments.length ? B(this, 0, e) : g.apply(this, arguments);
      }, o.prototype.equals = function (e) {
        if (!o.isBuffer(e)) throw new TypeError("Argument must be a Buffer");return this === e || 0 === o.compare(this, e);
      }, o.prototype.inspect = function () {
        var e = "",
            t = n.INSPECT_MAX_BYTES;return this.length > 0 && (e = this.toString("hex", 0, t).match(/.{2}/g).join(" "), this.length > t && (e += " ... ")), "<Buffer " + e + ">";
      }, o.prototype.compare = function (e, t, n, r, i) {
        if (!o.isBuffer(e)) throw new TypeError("Argument must be a Buffer");if (void 0 === t && (t = 0), void 0 === n && (n = e ? e.length : 0), void 0 === r && (r = 0), void 0 === i && (i = this.length), t < 0 || n > e.length || r < 0 || i > this.length) throw new RangeError("out of range index");if (r >= i && t >= n) return 0;if (r >= i) return -1;if (t >= n) return 1;if (t >>>= 0, n >>>= 0, r >>>= 0, i >>>= 0, this === e) return 0;for (var s = i - r, a = n - t, u = Math.min(s, a), c = this.slice(r, i), f = e.slice(t, n), d = 0; d < u; ++d) {
          if (c[d] !== f[d]) {
            s = c[d], a = f[d];break;
          }
        }return s < a ? -1 : a < s ? 1 : 0;
      }, o.prototype.includes = function (e, t, n) {
        return -1 !== this.indexOf(e, t, n);
      }, o.prototype.indexOf = function (e, t, n) {
        return _(this, e, t, n, !0);
      }, o.prototype.lastIndexOf = function (e, t, n) {
        return _(this, e, t, n, !1);
      }, o.prototype.write = function (e, t, n, r) {
        if (void 0 === t) r = "utf8", n = this.length, t = 0;else if (void 0 === n && "string" == typeof t) r = t, n = this.length, t = 0;else {
          if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");t >>>= 0, isFinite(n) ? (n >>>= 0, void 0 === r && (r = "utf8")) : (r = n, n = void 0);
        }var o = this.length - t;if ((void 0 === n || n > o) && (n = o), e.length > 0 && (n < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");r || (r = "utf8");for (var i = !1;;) {
          switch (r) {case "hex":
              return b(this, e, t, n);case "utf8":case "utf-8":
              return w(this, e, t, n);case "ascii":
              return E(this, e, t, n);case "latin1":case "binary":
              return k(this, e, t, n);case "base64":
              return x(this, e, t, n);case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":
              return S(this, e, t, n);default:
              if (i) throw new TypeError("Unknown encoding: " + r);r = ("" + r).toLowerCase(), i = !0;}
        }
      }, o.prototype.toJSON = function () {
        return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
      };var J = 4096;o.prototype.slice = function (e, t) {
        var n = this.length;e = ~~e, t = void 0 === t ? n : ~~t, e < 0 ? (e += n) < 0 && (e = 0) : e > n && (e = n), t < 0 ? (t += n) < 0 && (t = 0) : t > n && (t = n), t < e && (t = e);var r = this.subarray(e, t);return r.__proto__ = o.prototype, r;
      }, o.prototype.readUIntLE = function (e, t, n) {
        e >>>= 0, t >>>= 0, n || R(e, t, this.length);for (var r = this[e], o = 1, i = 0; ++i < t && (o *= 256);) {
          r += this[e + i] * o;
        }return r;
      }, o.prototype.readUIntBE = function (e, t, n) {
        e >>>= 0, t >>>= 0, n || R(e, t, this.length);for (var r = this[e + --t], o = 1; t > 0 && (o *= 256);) {
          r += this[e + --t] * o;
        }return r;
      }, o.prototype.readUInt8 = function (e, t) {
        return e >>>= 0, t || R(e, 1, this.length), this[e];
      }, o.prototype.readUInt16LE = function (e, t) {
        return e >>>= 0, t || R(e, 2, this.length), this[e] | this[e + 1] << 8;
      }, o.prototype.readUInt16BE = function (e, t) {
        return e >>>= 0, t || R(e, 2, this.length), this[e] << 8 | this[e + 1];
      }, o.prototype.readUInt32LE = function (e, t) {
        return e >>>= 0, t || R(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3];
      }, o.prototype.readUInt32BE = function (e, t) {
        return e >>>= 0, t || R(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
      }, o.prototype.readIntLE = function (e, t, n) {
        e >>>= 0, t >>>= 0, n || R(e, t, this.length);for (var r = this[e], o = 1, i = 0; ++i < t && (o *= 256);) {
          r += this[e + i] * o;
        }return o *= 128, r >= o && (r -= Math.pow(2, 8 * t)), r;
      }, o.prototype.readIntBE = function (e, t, n) {
        e >>>= 0, t >>>= 0, n || R(e, t, this.length);for (var r = t, o = 1, i = this[e + --r]; r > 0 && (o *= 256);) {
          i += this[e + --r] * o;
        }return o *= 128, i >= o && (i -= Math.pow(2, 8 * t)), i;
      }, o.prototype.readInt8 = function (e, t) {
        return e >>>= 0, t || R(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e];
      }, o.prototype.readInt16LE = function (e, t) {
        e >>>= 0, t || R(e, 2, this.length);var n = this[e] | this[e + 1] << 8;return 32768 & n ? 4294901760 | n : n;
      }, o.prototype.readInt16BE = function (e, t) {
        e >>>= 0, t || R(e, 2, this.length);var n = this[e + 1] | this[e] << 8;return 32768 & n ? 4294901760 | n : n;
      }, o.prototype.readInt32LE = function (e, t) {
        return e >>>= 0, t || R(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
      }, o.prototype.readInt32BE = function (e, t) {
        return e >>>= 0, t || R(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
      }, o.prototype.readFloatLE = function (e, t) {
        return e >>>= 0, t || R(e, 4, this.length), K.read(this, e, !0, 23, 4);
      }, o.prototype.readFloatBE = function (e, t) {
        return e >>>= 0, t || R(e, 4, this.length), K.read(this, e, !1, 23, 4);
      }, o.prototype.readDoubleLE = function (e, t) {
        return e >>>= 0, t || R(e, 8, this.length), K.read(this, e, !0, 52, 8);
      }, o.prototype.readDoubleBE = function (e, t) {
        return e >>>= 0, t || R(e, 8, this.length), K.read(this, e, !1, 52, 8);
      }, o.prototype.writeUIntLE = function (e, t, n, r) {
        if (e = +e, t >>>= 0, n >>>= 0, !r) {
          O(this, e, t, n, Math.pow(2, 8 * n) - 1, 0);
        }var o = 1,
            i = 0;for (this[t] = 255 & e; ++i < n && (o *= 256);) {
          this[t + i] = e / o & 255;
        }return t + n;
      }, o.prototype.writeUIntBE = function (e, t, n, r) {
        if (e = +e, t >>>= 0, n >>>= 0, !r) {
          O(this, e, t, n, Math.pow(2, 8 * n) - 1, 0);
        }var o = n - 1,
            i = 1;for (this[t + o] = 255 & e; --o >= 0 && (i *= 256);) {
          this[t + o] = e / i & 255;
        }return t + n;
      }, o.prototype.writeUInt8 = function (e, t, n) {
        return e = +e, t >>>= 0, n || O(this, e, t, 1, 255, 0), this[t] = 255 & e, t + 1;
      }, o.prototype.writeUInt16LE = function (e, t, n) {
        return e = +e, t >>>= 0, n || O(this, e, t, 2, 65535, 0), this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2;
      }, o.prototype.writeUInt16BE = function (e, t, n) {
        return e = +e, t >>>= 0, n || O(this, e, t, 2, 65535, 0), this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2;
      }, o.prototype.writeUInt32LE = function (e, t, n) {
        return e = +e, t >>>= 0, n || O(this, e, t, 4, 4294967295, 0), this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e, t + 4;
      }, o.prototype.writeUInt32BE = function (e, t, n) {
        return e = +e, t >>>= 0, n || O(this, e, t, 4, 4294967295, 0), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4;
      }, o.prototype.writeIntLE = function (e, t, n, r) {
        if (e = +e, t >>>= 0, !r) {
          var o = Math.pow(2, 8 * n - 1);O(this, e, t, n, o - 1, -o);
        }var i = 0,
            s = 1,
            a = 0;for (this[t] = 255 & e; ++i < n && (s *= 256);) {
          e < 0 && 0 === a && 0 !== this[t + i - 1] && (a = 1), this[t + i] = (e / s >> 0) - a & 255;
        }return t + n;
      }, o.prototype.writeIntBE = function (e, t, n, r) {
        if (e = +e, t >>>= 0, !r) {
          var o = Math.pow(2, 8 * n - 1);O(this, e, t, n, o - 1, -o);
        }var i = n - 1,
            s = 1,
            a = 0;for (this[t + i] = 255 & e; --i >= 0 && (s *= 256);) {
          e < 0 && 0 === a && 0 !== this[t + i + 1] && (a = 1), this[t + i] = (e / s >> 0) - a & 255;
        }return t + n;
      }, o.prototype.writeInt8 = function (e, t, n) {
        return e = +e, t >>>= 0, n || O(this, e, t, 1, 127, -128), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1;
      }, o.prototype.writeInt16LE = function (e, t, n) {
        return e = +e, t >>>= 0, n || O(this, e, t, 2, 32767, -32768), this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2;
      }, o.prototype.writeInt16BE = function (e, t, n) {
        return e = +e, t >>>= 0, n || O(this, e, t, 2, 32767, -32768), this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2;
      }, o.prototype.writeInt32LE = function (e, t, n) {
        return e = +e, t >>>= 0, n || O(this, e, t, 4, 2147483647, -2147483648), this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24, t + 4;
      }, o.prototype.writeInt32BE = function (e, t, n) {
        return e = +e, t >>>= 0, n || O(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4;
      }, o.prototype.writeFloatLE = function (e, t, n) {
        return P(this, e, t, !0, n);
      }, o.prototype.writeFloatBE = function (e, t, n) {
        return P(this, e, t, !1, n);
      }, o.prototype.writeDoubleLE = function (e, t, n) {
        return j(this, e, t, !0, n);
      }, o.prototype.writeDoubleBE = function (e, t, n) {
        return j(this, e, t, !1, n);
      }, o.prototype.copy = function (e, t, n, r) {
        if (n || (n = 0), r || 0 === r || (r = this.length), t >= e.length && (t = e.length), t || (t = 0), r > 0 && r < n && (r = n), r === n) return 0;if (0 === e.length || 0 === this.length) return 0;if (t < 0) throw new RangeError("targetStart out of bounds");if (n < 0 || n >= this.length) throw new RangeError("sourceStart out of bounds");if (r < 0) throw new RangeError("sourceEnd out of bounds");r > this.length && (r = this.length), e.length - t < r - n && (r = e.length - t + n);var o,
            i = r - n;if (this === e && n < t && t < r) for (o = i - 1; o >= 0; --o) {
          e[o + t] = this[o + n];
        } else if (i < 1e3) for (o = 0; o < i; ++o) {
          e[o + t] = this[o + n];
        } else Uint8Array.prototype.set.call(e, this.subarray(n, n + i), t);return i;
      }, o.prototype.fill = function (e, t, n, r) {
        if ("string" == typeof e) {
          if ("string" == typeof t ? (r = t, t = 0, n = this.length) : "string" == typeof n && (r = n, n = this.length), 1 === e.length) {
            var i = e.charCodeAt(0);i < 256 && (e = i);
          }if (void 0 !== r && "string" != typeof r) throw new TypeError("encoding must be a string");if ("string" == typeof r && !o.isEncoding(r)) throw new TypeError("Unknown encoding: " + r);
        } else "number" == typeof e && (e &= 255);if (t < 0 || this.length < t || this.length < n) throw new RangeError("Out of range index");if (n <= t) return this;t >>>= 0, n = void 0 === n ? this.length : n >>> 0, e || (e = 0);var s;if ("number" == typeof e) for (s = t; s < n; ++s) {
          this[s] = e;
        } else {
          var a = o.isBuffer(e) ? e : new o(e, r),
              u = a.length;for (s = 0; s < n - t; ++s) {
            this[s + t] = a[s % u];
          }
        }return this;
      };var Y = /[^+\/0-9A-Za-z-_]/g;
    }, { "base64-js": 8, ieee754: 39 }], 25: [function (e, t, n) {
      t.exports = { 100: "Continue", 101: "Switching Protocols", 102: "Processing", 200: "OK", 201: "Created", 202: "Accepted", 203: "Non-Authoritative Information", 204: "No Content", 205: "Reset Content", 206: "Partial Content", 207: "Multi-Status", 208: "Already Reported", 226: "IM Used", 300: "Multiple Choices", 301: "Moved Permanently", 302: "Found", 303: "See Other", 304: "Not Modified", 305: "Use Proxy", 307: "Temporary Redirect", 308: "Permanent Redirect", 400: "Bad Request", 401: "Unauthorized", 402: "Payment Required", 403: "Forbidden", 404: "Not Found", 405: "Method Not Allowed", 406: "Not Acceptable", 407: "Proxy Authentication Required", 408: "Request Timeout", 409: "Conflict", 410: "Gone", 411: "Length Required", 412: "Precondition Failed", 413: "Payload Too Large", 414: "URI Too Long", 415: "Unsupported Media Type", 416: "Range Not Satisfiable", 417: "Expectation Failed", 418: "I'm a teapot", 421: "Misdirected Request", 422: "Unprocessable Entity", 423: "Locked", 424: "Failed Dependency", 425: "Unordered Collection", 426: "Upgrade Required", 428: "Precondition Required", 429: "Too Many Requests", 431: "Request Header Fields Too Large", 451: "Unavailable For Legal Reasons", 500: "Internal Server Error", 501: "Not Implemented", 502: "Bad Gateway", 503: "Service Unavailable", 504: "Gateway Timeout", 505: "HTTP Version Not Supported", 506: "Variant Also Negotiates", 507: "Insufficient Storage", 508: "Loop Detected", 509: "Bandwidth Limit Exceeded", 510: "Not Extended", 511: "Network Authentication Required" };
    }, {}], 26: [function (e, t, n) {
      function r(e, t, n) {
        function i(t) {
          a.destroyed || (e.put(u, t), u += 1);
        }var a = this;if (!(a instanceof r)) return new r(e, t, n);if (s.Writable.call(a, n), n || (n = {}), !e || !e.put || !e.get) throw new Error("First argument must be an abstract-chunk-store compliant store");if (!(t = Number(t))) throw new Error("Second argument must be a chunk length");a._blockstream = new o(t, { zeroPadding: !1 }), a._blockstream.on("data", i).on("error", function (e) {
          a.destroy(e);
        });var u = 0;a.on("finish", function () {
          this._blockstream.end();
        });
      }t.exports = r;var o = e("block-stream2"),
          i = e("inherits"),
          s = e("readable-stream");i(r, s.Writable), r.prototype._write = function (e, t, n) {
        this._blockstream.write(e, t, n);
      }, r.prototype.destroy = function (e) {
        this.destroyed || (this.destroyed = !0, e && this.emit("error", e), this.emit("close"));
      };
    }, { "block-stream2": 20, inherits: 41, "readable-stream": 82 }], 27: [function (e, t, n) {
      function r(e, t, n) {
        for (var r, i, s, a = 1 / 0, u = 0, c = t.length - 1; u <= c && (r = u + (c - u >> 1), s = t[r] - e, s < 0 ? u = r + 1 : s > 0 && (c = r - 1), s = o(s), s < a && (a = s, i = r), t[r] !== e);) {}return n ? i : t[i];
      }var o = Math.abs;t.exports = r;
    }, {}], 28: [function (e, t, n) {
      (function (e) {
        function t(e) {
          return Array.isArray ? Array.isArray(e) : "[object Array]" === g(e);
        }function r(e) {
          return "boolean" == typeof e;
        }function o(e) {
          return null === e;
        }function i(e) {
          return null == e;
        }function s(e) {
          return "number" == typeof e;
        }function a(e) {
          return "string" == typeof e;
        }function u(e) {
          return "symbol" == (typeof e === "undefined" ? "undefined" : _typeof(e));
        }function c(e) {
          return void 0 === e;
        }function f(e) {
          return "[object RegExp]" === g(e);
        }function d(e) {
          return "object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) && null !== e;
        }function h(e) {
          return "[object Date]" === g(e);
        }function l(e) {
          return "[object Error]" === g(e) || e instanceof Error;
        }function p(e) {
          return "function" == typeof e;
        }function m(e) {
          return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == (typeof e === "undefined" ? "undefined" : _typeof(e)) || void 0 === e;
        }function g(e) {
          return Object.prototype.toString.call(e);
        }n.isArray = t, n.isBoolean = r, n.isNull = o, n.isNullOrUndefined = i, n.isNumber = s, n.isString = a, n.isSymbol = u, n.isUndefined = c, n.isRegExp = f, n.isObject = d, n.isDate = h, n.isError = l, n.isFunction = p, n.isPrimitive = m, n.isBuffer = e.isBuffer;
      }).call(this, { isBuffer: e("../../is-buffer/index.js") });
    }, { "../../is-buffer/index.js": 43 }], 29: [function (e, t, n) {
      (function (n, r, o) {
        function i(e, t, n) {
          if ("function" == typeof t) return i(e, null, t);t = t ? I(t) : {}, a(e, t, function (e, r, o) {
            if (e) return n(e);t.singleFileTorrent = o, l(r, t, n);
          });
        }function s(e, t, n) {
          if ("function" == typeof t) return s(e, null, t);t = t ? I(t) : {}, a(e, t, n);
        }function a(e, t, r) {
          function i() {
            O(e.map(function (e) {
              return function (t) {
                var n = {};if (m(e)) n.getStream = _(e), n.length = e.size;else if (o.isBuffer(e)) n.getStream = v(e), n.length = e.length;else {
                  if (!y(e)) {
                    if ("string" == typeof e) {
                      if ("function" != typeof C.stat) throw new Error("filesystem paths do not work in the browser");var r = a > 1 || c;return void u(e, r, t);
                    }throw new Error("invalid input type");
                  }n.getStream = w(e, n), n.length = 0;
                }n.path = e.path, t(null, n);
              };
            }), function (e, t) {
              if (e) return r(e);t = A(t), r(null, t, c);
            });
          }if (Array.isArray(e) && 0 === e.length) throw new Error("invalid input type");g(e) && (e = Array.prototype.slice.call(e)), Array.isArray(e) || (e = [e]), e = e.map(function (e) {
            return m(e) && "string" == typeof e.path && "function" == typeof C.stat ? e.path : e;
          }), 1 !== e.length || "string" == typeof e[0] || e[0].name || (e[0].name = t.name);var s = null;e.forEach(function (t, n) {
            if ("string" != typeof t) {
              var r = t.fullPath || t.name;r || (r = "Unknown File " + (n + 1), t.unknownName = !0), t.path = r.split("/"), t.path[0] || t.path.shift(), t.path.length < 2 ? s = null : 0 === n && e.length > 1 ? s = t.path[0] : t.path[0] !== s && (s = null);
            }
          }), e = e.filter(function (e) {
            if ("string" == typeof e) return !0;var t = e.path[e.path.length - 1];return d(t) && L.not(t);
          }), s && e.forEach(function (e) {
            var t = (o.isBuffer(e) || y(e)) && !e.path;"string" == typeof e || t || e.path.shift();
          }), !t.name && s && (t.name = s), t.name || e.some(function (e) {
            return "string" == typeof e ? (t.name = S.basename(e), !0) : e.unknownName ? void 0 : (t.name = e.path[e.path.length - 1], !0);
          }), t.name || (t.name = "Unnamed Torrent " + Date.now());var a = e.reduce(function (e, t) {
            return e + Number("string" == typeof t);
          }, 0),
              c = 1 === e.length;if (1 === e.length && "string" == typeof e[0]) {
            if ("function" != typeof C.stat) throw new Error("filesystem paths do not work in the browser");T(e[0], function (e, t) {
              if (e) return r(e);c = t, i();
            });
          } else n.nextTick(function () {
            i();
          });
        }function u(e, t, n) {
          f(e, c, function (r, o) {
            if (r) return n(r);o = Array.isArray(o) ? A(o) : [o], e = S.normalize(e), t && (e = e.slice(0, e.lastIndexOf(S.sep) + 1)), e[e.length - 1] !== S.sep && (e += S.sep), o.forEach(function (t) {
              t.getStream = b(t.path), t.path = t.path.replace(e, "").split(S.sep);
            }), n(null, o);
          });
        }function c(e, t) {
          t = R(t), C.stat(e, function (n, r) {
            if (n) return t(n);var o = { length: r.size, path: e };t(null, o);
          });
        }function f(e, t, n) {
          C.stat(e, function (r, o) {
            if (r) return n(r);o.isDirectory() ? C.readdir(e, function (r, o) {
              if (r) return n(r);O(o.filter(d).filter(L.not).map(function (n) {
                return function (r) {
                  f(S.join(e, n), t, r);
                };
              }), n);
            }) : o.isFile() && t(e, n);
          });
        }function d(e) {
          return "." !== e[0];
        }function h(e, t, n) {
          function r(e) {
            f += e.length;var t = l;M(e, function (e) {
              c[t] = e, h -= 1, u();
            }), h += 1, l += 1;
          }function i() {
            p = !0, u();
          }function s(e) {
            a(), n(e);
          }function a() {
            m.removeListener("error", s), g.removeListener("data", r), g.removeListener("end", i), g.removeListener("error", s);
          }function u() {
            p && 0 === h && (a(), n(null, o.from(c.join(""), "hex"), f));
          }n = R(n);var c = [],
              f = 0,
              d = e.map(function (e) {
            return e.getStream;
          }),
              h = 0,
              l = 0,
              p = !1,
              m = new U(d),
              g = new k(t, { zeroPadding: !1 });m.on("error", s), m.pipe(g).on("data", r).on("end", i).on("error", s);
        }function l(e, n, o) {
          var i = n.announceList;i || ("string" == typeof n.announce ? i = [[n.announce]] : Array.isArray(n.announce) && (i = n.announce.map(function (e) {
            return [e];
          }))), i || (i = []), r.WEBTORRENT_ANNOUNCE && ("string" == typeof r.WEBTORRENT_ANNOUNCE ? i.push([[r.WEBTORRENT_ANNOUNCE]]) : Array.isArray(r.WEBTORRENT_ANNOUNCE) && (i = i.concat(r.WEBTORRENT_ANNOUNCE.map(function (e) {
            return [e];
          })))), void 0 === n.announce && void 0 === n.announceList && (i = i.concat(t.exports.announceList)), "string" == typeof n.urlList && (n.urlList = [n.urlList]);var s = { info: { name: n.name }, "creation date": Math.ceil((Number(n.creationDate) || Date.now()) / 1e3), encoding: "UTF-8" };0 !== i.length && (s.announce = i[0][0], s["announce-list"] = i), void 0 !== n.comment && (s.comment = n.comment), void 0 !== n.createdBy && (s["created by"] = n.createdBy), void 0 !== n.private && (s.info.private = Number(n.private)), void 0 !== n.sslCert && (s.info["ssl-cert"] = n.sslCert), void 0 !== n.urlList && (s["url-list"] = n.urlList);var a = n.pieceLength || x(e.reduce(p, 0));s.info["piece length"] = a, h(e, a, function (t, r, i) {
            if (t) return o(t);s.info.pieces = r, e.forEach(function (e) {
              delete e.getStream;
            }), n.singleFileTorrent ? s.info.length = i : s.info.files = e, o(null, E.encode(s));
          });
        }function p(e, t) {
          return e + t.length;
        }function m(e) {
          return "undefined" != typeof Blob && e instanceof Blob;
        }function g(e) {
          return "undefined" != typeof FileList && e instanceof FileList;
        }function y(e) {
          return "object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) && null != e && "function" == typeof e.pipe;
        }function _(e) {
          return function () {
            return new B(e);
          };
        }function v(e) {
          return function () {
            var t = new P.PassThrough();return t.end(e), t;
          };
        }function b(e) {
          return function () {
            return C.createReadStream(e);
          };
        }function w(e, t) {
          return function () {
            var n = new P.Transform();return n._transform = function (e, n, r) {
              t.length += e.length, this.push(e), r();
            }, e.pipe(n), n;
          };
        }t.exports = i, t.exports.parseInput = s, t.exports.announceList = [["udp://tracker.leechers-paradise.org:6969"], ["udp://tracker.coppersurfer.tk:6969"], ["udp://tracker.opentrackr.org:1337"], ["udp://explodie.org:6969"], ["udp://tracker.empire-js.us:1337"], ["wss://tracker.btorrent.xyz"], ["wss://tracker.openwebtorrent.com"], ["wss://tracker.fastcast.nz"]];var E = e("bencode"),
            k = e("block-stream2"),
            x = e("piece-length"),
            S = e("path"),
            I = e("xtend"),
            B = e("filestream/read"),
            A = e("flatten"),
            C = e("fs"),
            T = e("is-file"),
            L = e("junk"),
            U = e("multistream"),
            R = e("once"),
            O = e("run-parallel"),
            M = e("simple-sha1"),
            P = e("readable-stream");
      }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("buffer").Buffer);
    }, { _process: 66, bencode: 11, "block-stream2": 20, buffer: 24, "filestream/read": 35, flatten: 36, fs: 22, "is-file": 44, junk: 47, multistream: 58, once: 60, path: 63, "piece-length": 64, "readable-stream": 82, "run-parallel": 86, "simple-sha1": 92, xtend: 119 }], 30: [function (e, t, n) {
      (function (r) {
        function o() {
          return !("undefined" == typeof window || !window || void 0 === window.process || "renderer" !== window.process.type) || "undefined" != typeof document && document && "WebkitAppearance" in document.documentElement.style || "undefined" != typeof window && window && window.console && (console.firebug || console.exception && console.table) || "undefined" != typeof navigator && navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || "undefined" != typeof navigator && navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
        }function i(e) {
          var t = this.useColors;if (e[0] = (t ? "%c" : "") + this.namespace + (t ? " %c" : " ") + e[0] + (t ? "%c " : " ") + "+" + n.humanize(this.diff), t) {
            var r = "color: " + this.color;e.splice(1, 0, r, "color: inherit");var o = 0,
                i = 0;e[0].replace(/%[a-zA-Z%]/g, function (e) {
              "%%" !== e && (o++, "%c" === e && (i = o));
            }), e.splice(i, 0, r);
          }
        }function s() {
          return "object" == (typeof console === "undefined" ? "undefined" : _typeof(console)) && console.log && Function.prototype.apply.call(console.log, console, arguments);
        }function a(e) {
          try {
            null == e ? n.storage.removeItem("debug") : n.storage.debug = e;
          } catch (e) {}
        }function u() {
          var e;try {
            e = n.storage.debug;
          } catch (e) {}return !e && void 0 !== r && "env" in r && (e = r.env.DEBUG), e;
        }n = t.exports = e("./debug"), n.log = s, n.formatArgs = i, n.save = a, n.load = u, n.useColors = o, n.storage = "undefined" != typeof chrome && void 0 !== chrome.storage ? chrome.storage.local : function () {
          try {
            return window.localStorage;
          } catch (e) {}
        }(), n.colors = ["lightseagreen", "forestgreen", "goldenrod", "dodgerblue", "darkorchid", "crimson"], n.formatters.j = function (e) {
          try {
            return JSON.stringify(e);
          } catch (e) {
            return "[UnexpectedJSONParseError]: " + e.message;
          }
        }, n.enable(u());
      }).call(this, e("_process"));
    }, { "./debug": 31, _process: 66 }], 31: [function (e, t, n) {
      function r(e) {
        var t,
            r = 0;for (t in e) {
          r = (r << 5) - r + e.charCodeAt(t), r |= 0;
        }return n.colors[Math.abs(r) % n.colors.length];
      }function o(e) {
        function t() {
          if (t.enabled) {
            var e = t,
                r = +new Date(),
                o = r - (c || r);e.diff = o, e.prev = c, e.curr = r, c = r;for (var i = new Array(arguments.length), s = 0; s < i.length; s++) {
              i[s] = arguments[s];
            }i[0] = n.coerce(i[0]), "string" != typeof i[0] && i.unshift("%O");var a = 0;i[0] = i[0].replace(/%([a-zA-Z%])/g, function (t, r) {
              if ("%%" === t) return t;a++;var o = n.formatters[r];if ("function" == typeof o) {
                var s = i[a];t = o.call(e, s), i.splice(a, 1), a--;
              }return t;
            }), n.formatArgs.call(e, i);(t.log || n.log || console.log.bind(console)).apply(e, i);
          }
        }return t.namespace = e, t.enabled = n.enabled(e), t.useColors = n.useColors(), t.color = r(e), "function" == typeof n.init && n.init(t), t;
      }function i(e) {
        n.save(e), n.names = [], n.skips = [];for (var t = (e || "").split(/[\s,]+/), r = t.length, o = 0; o < r; o++) {
          t[o] && (e = t[o].replace(/\*/g, ".*?"), "-" === e[0] ? n.skips.push(new RegExp("^" + e.substr(1) + "$")) : n.names.push(new RegExp("^" + e + "$")));
        }
      }function s() {
        n.enable("");
      }function a(e) {
        var t, r;for (t = 0, r = n.skips.length; t < r; t++) {
          if (n.skips[t].test(e)) return !1;
        }for (t = 0, r = n.names.length; t < r; t++) {
          if (n.names[t].test(e)) return !0;
        }return !1;
      }function u(e) {
        return e instanceof Error ? e.stack || e.message : e;
      }n = t.exports = o.debug = o.default = o, n.coerce = u, n.disable = s, n.enable = i, n.enabled = a, n.humanize = e("ms"), n.names = [], n.skips = [], n.formatters = {};var c;
    }, { ms: 57 }], 32: [function (e, t, n) {
      t.exports = function () {
        for (var e = 0; e < arguments.length; e++) {
          if (void 0 !== arguments[e]) return arguments[e];
        }
      };
    }, {}], 33: [function (e, t, n) {
      var r = e("once"),
          o = function o() {},
          i = function i(e) {
        return e.setHeader && "function" == typeof e.abort;
      },
          s = function s(e) {
        return e.stdio && Array.isArray(e.stdio) && 3 === e.stdio.length;
      },
          a = function a(e, t, n) {
        if ("function" == typeof t) return a(e, null, t);t || (t = {}), n = r(n || o);var u = e._writableState,
            c = e._readableState,
            f = t.readable || !1 !== t.readable && e.readable,
            d = t.writable || !1 !== t.writable && e.writable,
            h = function h() {
          e.writable || l();
        },
            l = function l() {
          d = !1, f || n.call(e);
        },
            p = function p() {
          f = !1, d || n.call(e);
        },
            m = function m(t) {
          n.call(e, t ? new Error("exited with error code: " + t) : null);
        },
            g = function g() {
          return (!f || c && c.ended) && (!d || u && u.ended) ? void 0 : n.call(e, new Error("premature close"));
        },
            y = function y() {
          e.req.on("finish", l);
        };return i(e) ? (e.on("complete", l), e.on("abort", g), e.req ? y() : e.on("request", y)) : d && !u && (e.on("end", h), e.on("close", h)), s(e) && e.on("exit", m), e.on("end", p), e.on("finish", l), !1 !== t.error && e.on("error", n), e.on("close", g), function () {
          e.removeListener("complete", l), e.removeListener("abort", g), e.removeListener("request", y), e.req && e.req.removeListener("finish", l), e.removeListener("end", h), e.removeListener("close", h), e.removeListener("finish", l), e.removeListener("exit", m), e.removeListener("end", p), e.removeListener("error", n), e.removeListener("close", g);
        };
      };t.exports = a;
    }, { once: 60 }], 34: [function (e, t, n) {
      function r() {
        this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0;
      }function o(e) {
        return "function" == typeof e;
      }function i(e) {
        return "number" == typeof e;
      }function s(e) {
        return "object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) && null !== e;
      }function a(e) {
        return void 0 === e;
      }t.exports = r, r.EventEmitter = r, r.prototype._events = void 0, r.prototype._maxListeners = void 0, r.defaultMaxListeners = 10, r.prototype.setMaxListeners = function (e) {
        if (!i(e) || e < 0 || isNaN(e)) throw TypeError("n must be a positive number");return this._maxListeners = e, this;
      }, r.prototype.emit = function (e) {
        var t, n, r, i, u, c;if (this._events || (this._events = {}), "error" === e && (!this._events.error || s(this._events.error) && !this._events.error.length)) {
          if ((t = arguments[1]) instanceof Error) throw t;var f = new Error('Uncaught, unspecified "error" event. (' + t + ")");throw f.context = t, f;
        }if (n = this._events[e], a(n)) return !1;if (o(n)) switch (arguments.length) {case 1:
            n.call(this);break;case 2:
            n.call(this, arguments[1]);break;case 3:
            n.call(this, arguments[1], arguments[2]);break;default:
            i = Array.prototype.slice.call(arguments, 1), n.apply(this, i);} else if (s(n)) for (i = Array.prototype.slice.call(arguments, 1), c = n.slice(), r = c.length, u = 0; u < r; u++) {
          c[u].apply(this, i);
        }return !0;
      }, r.prototype.addListener = function (e, t) {
        var n;if (!o(t)) throw TypeError("listener must be a function");return this._events || (this._events = {}), this._events.newListener && this.emit("newListener", e, o(t.listener) ? t.listener : t), this._events[e] ? s(this._events[e]) ? this._events[e].push(t) : this._events[e] = [this._events[e], t] : this._events[e] = t, s(this._events[e]) && !this._events[e].warned && (n = a(this._maxListeners) ? r.defaultMaxListeners : this._maxListeners) && n > 0 && this._events[e].length > n && (this._events[e].warned = !0, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[e].length), "function" == typeof console.trace && console.trace()), this;
      }, r.prototype.on = r.prototype.addListener, r.prototype.once = function (e, t) {
        function n() {
          this.removeListener(e, n), r || (r = !0, t.apply(this, arguments));
        }if (!o(t)) throw TypeError("listener must be a function");var r = !1;return n.listener = t, this.on(e, n), this;
      }, r.prototype.removeListener = function (e, t) {
        var n, r, i, a;if (!o(t)) throw TypeError("listener must be a function");if (!this._events || !this._events[e]) return this;if (n = this._events[e], i = n.length, r = -1, n === t || o(n.listener) && n.listener === t) delete this._events[e], this._events.removeListener && this.emit("removeListener", e, t);else if (s(n)) {
          for (a = i; a-- > 0;) {
            if (n[a] === t || n[a].listener && n[a].listener === t) {
              r = a;break;
            }
          }if (r < 0) return this;1 === n.length ? (n.length = 0, delete this._events[e]) : n.splice(r, 1), this._events.removeListener && this.emit("removeListener", e, t);
        }return this;
      }, r.prototype.removeAllListeners = function (e) {
        var t, n;if (!this._events) return this;if (!this._events.removeListener) return 0 === arguments.length ? this._events = {} : this._events[e] && delete this._events[e], this;if (0 === arguments.length) {
          for (t in this._events) {
            "removeListener" !== t && this.removeAllListeners(t);
          }return this.removeAllListeners("removeListener"), this._events = {}, this;
        }if (n = this._events[e], o(n)) this.removeListener(e, n);else if (n) for (; n.length;) {
          this.removeListener(e, n[n.length - 1]);
        }return delete this._events[e], this;
      }, r.prototype.listeners = function (e) {
        return this._events && this._events[e] ? o(this._events[e]) ? [this._events[e]] : this._events[e].slice() : [];
      }, r.prototype.listenerCount = function (e) {
        if (this._events) {
          var t = this._events[e];if (o(t)) return 1;if (t) return t.length;
        }return 0;
      }, r.listenerCount = function (e, t) {
        return e.listenerCount(t);
      };
    }, {}], 35: [function (e, t, n) {
      function r(e, t) {
        var n = this;if (!(this instanceof r)) return new r(e, t);t = t || {}, o.call(this, t), this._offset = 0, this._ready = !1, this._file = e, this._size = e.size, this._chunkSize = t.chunkSize || Math.max(this._size / 1e3, 204800), this.reader = new FileReader(), this._generateHeaderBlocks(e, t, function (e, t) {
          if (e) return n.emit("error", e);Array.isArray(t) && t.forEach(function (e) {
            n.push(e);
          }), n._ready = !0, n.emit("_ready");
        });
      }var o = e("readable-stream").Readable,
          i = e("inherits"),
          s = e("typedarray-to-buffer");i(r, o), t.exports = r, r.prototype._generateHeaderBlocks = function (e, t, n) {
        n(null, []);
      }, r.prototype._read = function () {
        if (!this._ready) return void this.once("_ready", this._read.bind(this));var e = this,
            t = this.reader,
            n = this._offset,
            r = this._offset + this._chunkSize;if (r > this._size && (r = this._size), n === this._size) return this.destroy(), void this.push(null);t.onload = function () {
          e._offset = r, e.push(s(t.result));
        }, t.onerror = function () {
          e.emit("error", t.error);
        }, t.readAsArrayBuffer(this._file.slice(n, r));
      }, r.prototype.destroy = function () {
        if (this._file = null, this.reader) {
          this.reader.onload = null, this.reader.onerror = null;try {
            this.reader.abort();
          } catch (e) {}
        }this.reader = null;
      };
    }, { inherits: 41, "readable-stream": 82, "typedarray-to-buffer": 108 }], 36: [function (e, t, n) {
      t.exports = function (e, t) {
        function n(e, r) {
          return e.reduce(function (e, o) {
            return Array.isArray(o) && r < t ? e.concat(n(o, r + 1)) : e.concat(o);
          }, []);
        }return t = "number" == typeof t ? t : 1 / 0, t ? n(e, 1) : Array.isArray(e) ? e.map(function (e) {
          return e;
        }) : e;
      };
    }, {}], 37: [function (e, t, n) {
      t.exports = function () {
        if ("undefined" == typeof window) return null;var e = { RTCPeerConnection: window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection, RTCSessionDescription: window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription, RTCIceCandidate: window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate };return e.RTCPeerConnection ? e : null;
      };
    }, {}], 38: [function (e, t, n) {
      function r(e) {
        if ("string" == typeof e && (e = i.parse(e)), e.protocol || (e.protocol = "https:"), "https:" !== e.protocol) throw new Error('Protocol "' + e.protocol + '" not supported. Expected "https:"');return e;
      }var o = e("http"),
          i = e("url"),
          s = t.exports;for (var a in o) {
        o.hasOwnProperty(a) && (s[a] = o[a]);
      }s.request = function (e, t) {
        return e = r(e), o.request.call(this, e, t);
      }, s.get = function (e, t) {
        return e = r(e), o.get.call(this, e, t);
      };
    }, { http: 95, url: 112 }], 39: [function (e, t, n) {
      n.read = function (e, t, n, r, o) {
        var i,
            s,
            a = 8 * o - r - 1,
            u = (1 << a) - 1,
            c = u >> 1,
            f = -7,
            d = n ? o - 1 : 0,
            h = n ? -1 : 1,
            l = e[t + d];for (d += h, i = l & (1 << -f) - 1, l >>= -f, f += a; f > 0; i = 256 * i + e[t + d], d += h, f -= 8) {}for (s = i & (1 << -f) - 1, i >>= -f, f += r; f > 0; s = 256 * s + e[t + d], d += h, f -= 8) {}if (0 === i) i = 1 - c;else {
          if (i === u) return s ? NaN : 1 / 0 * (l ? -1 : 1);s += Math.pow(2, r), i -= c;
        }return (l ? -1 : 1) * s * Math.pow(2, i - r);
      }, n.write = function (e, t, n, r, o, i) {
        var s,
            a,
            u,
            c = 8 * i - o - 1,
            f = (1 << c) - 1,
            d = f >> 1,
            h = 23 === o ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
            l = r ? 0 : i - 1,
            p = r ? 1 : -1,
            m = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (a = isNaN(t) ? 1 : 0, s = f) : (s = Math.floor(Math.log(t) / Math.LN2), t * (u = Math.pow(2, -s)) < 1 && (s--, u *= 2), t += s + d >= 1 ? h / u : h * Math.pow(2, 1 - d), t * u >= 2 && (s++, u /= 2), s + d >= f ? (a = 0, s = f) : s + d >= 1 ? (a = (t * u - 1) * Math.pow(2, o), s += d) : (a = t * Math.pow(2, d - 1) * Math.pow(2, o), s = 0)); o >= 8; e[n + l] = 255 & a, l += p, a /= 256, o -= 8) {}for (s = s << o | a, c += o; c > 0; e[n + l] = 255 & s, l += p, s /= 256, c -= 8) {}e[n + l - p] |= 128 * m;
      };
    }, {}], 40: [function (e, t, n) {
      (function (e) {
        function n(e) {
          if (!(this instanceof n)) return new n(e);if (this.store = e, this.chunkLength = e.chunkLength, !this.store || !this.store.get || !this.store.put) throw new Error("First argument must be abstract-chunk-store compliant");this.mem = [];
        }function r(t, n, r) {
          e.nextTick(function () {
            t && t(n, r);
          });
        }t.exports = n, n.prototype.put = function (e, t, n) {
          var r = this;r.mem[e] = t, r.store.put(e, t, function (t) {
            r.mem[e] = null, n && n(t);
          });
        }, n.prototype.get = function (e, t, n) {
          if ("function" == typeof t) return this.get(e, null, t);var o = t && t.offset || 0,
              i = t && t.length && o + t.length,
              s = this.mem[e];if (s) return r(n, null, t ? s.slice(o, i) : s);this.store.get(e, t, n);
        }, n.prototype.close = function (e) {
          this.store.close(e);
        }, n.prototype.destroy = function (e) {
          this.store.destroy(e);
        };
      }).call(this, e("_process"));
    }, { _process: 66 }], 41: [function (e, t, n) {
      "function" == typeof Object.create ? t.exports = function (e, t) {
        e.super_ = t, e.prototype = Object.create(t.prototype, { constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 } });
      } : t.exports = function (e, t) {
        e.super_ = t;var n = function n() {};n.prototype = t.prototype, e.prototype = new n(), e.prototype.constructor = e;
      };
    }, {}], 42: [function (e, t, n) {
      t.exports = function (e) {
        for (var t = 0, n = e.length; t < n; ++t) {
          if (e.charCodeAt(t) > 127) return !1;
        }return !0;
      };
    }, {}], 43: [function (e, t, n) {
      function r(e) {
        return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e);
      }function o(e) {
        return "function" == typeof e.readFloatLE && "function" == typeof e.slice && r(e.slice(0, 0));
      }t.exports = function (e) {
        return null != e && (r(e) || o(e) || !!e._isBuffer);
      };
    }, {}], 44: [function (e, t, n) {
      "use strict";
      function r(e) {
        return o.existsSync(e) && o.statSync(e).isFile();
      }var o = e("fs");t.exports = function (e, t) {
        if (!t) return r(e);o.stat(e, function (e, n) {
          return e ? t(e) : t(null, n.isFile());
        });
      }, t.exports.sync = r;
    }, { fs: 22 }], 45: [function (e, t, n) {
      function r(e) {
        return o(e) || i(e);
      }function o(e) {
        return e instanceof Int8Array || e instanceof Int16Array || e instanceof Int32Array || e instanceof Uint8Array || e instanceof Uint8ClampedArray || e instanceof Uint16Array || e instanceof Uint32Array || e instanceof Float32Array || e instanceof Float64Array;
      }function i(e) {
        return a[s.call(e)];
      }t.exports = r, r.strict = o, r.loose = i;var s = Object.prototype.toString,
          a = { "[object Int8Array]": !0, "[object Int16Array]": !0, "[object Int32Array]": !0, "[object Uint8Array]": !0, "[object Uint8ClampedArray]": !0, "[object Uint16Array]": !0, "[object Uint32Array]": !0, "[object Float32Array]": !0, "[object Float64Array]": !0 };
    }, {}], 46: [function (e, t, n) {
      var r = {}.toString;t.exports = Array.isArray || function (e) {
        return "[object Array]" == r.call(e);
      };
    }, {}], 47: [function (e, t, n) {
      "use strict";
      n.re = /^npm-debug\.log$|^\..*\.swp$|^\.DS_Store$|^\.AppleDouble$|^\.LSOverride$|^Icon\r$|^\._.*|^\.Spotlight-V100$|\.Trashes|^__MACOSX$|~$|^Thumbs\.db$|^ehthumbs\.db$|^Desktop\.ini$/, n.is = function (e) {
        return n.re.test(e);
      }, n.not = n.isnt = function (e) {
        return !n.is(e);
      };
    }, {}], 48: [function (e, t, n) {
      (function (n) {
        function r(e) {
          var t = {},
              r = e.split("magnet:?")[1];(r && r.length >= 0 ? r.split("&") : []).forEach(function (e) {
            var n = e.split("=");if (2 === n.length) {
              var r = n[0],
                  o = n[1];if ("dn" === r && (o = decodeURIComponent(o).replace(/\+/g, " ")), "tr" !== r && "xs" !== r && "as" !== r && "ws" !== r || (o = decodeURIComponent(o)), "kt" === r && (o = decodeURIComponent(o).split("+")), "ix" === r && (o = Number(o)), t[r]) {
                if (Array.isArray(t[r])) t[r].push(o);else {
                  var i = t[r];t[r] = [i, o];
                }
              } else t[r] = o;
            }
          });var o;if (t.xt) {
            (Array.isArray(t.xt) ? t.xt : [t.xt]).forEach(function (e) {
              if (o = e.match(/^urn:btih:(.{40})/)) t.infoHash = o[1].toLowerCase();else if (o = e.match(/^urn:btih:(.{32})/)) {
                var r = i.decode(o[1]);t.infoHash = n.from(r, "binary").toString("hex");
              }
            });
          }return t.infoHash && (t.infoHashBuffer = n.from(t.infoHash, "hex")), t.dn && (t.name = t.dn), t.kt && (t.keywords = t.kt), "string" == typeof t.tr ? t.announce = [t.tr] : Array.isArray(t.tr) ? t.announce = t.tr : t.announce = [], t.urlList = [], ("string" == typeof t.as || Array.isArray(t.as)) && (t.urlList = t.urlList.concat(t.as)), ("string" == typeof t.ws || Array.isArray(t.ws)) && (t.urlList = t.urlList.concat(t.ws)), a(t.announce), a(t.urlList), t;
        }function o(e) {
          e = s(e), e.infoHashBuffer && (e.xt = "urn:btih:" + e.infoHashBuffer.toString("hex")), e.infoHash && (e.xt = "urn:btih:" + e.infoHash), e.name && (e.dn = e.name), e.keywords && (e.kt = e.keywords), e.announce && (e.tr = e.announce), e.urlList && (e.ws = e.urlList, delete e.as);var t = "magnet:?";return Object.keys(e).filter(function (e) {
            return 2 === e.length;
          }).forEach(function (n, r) {
            (Array.isArray(e[n]) ? e[n] : [e[n]]).forEach(function (e, o) {
              !(r > 0 || o > 0) || "kt" === n && 0 !== o || (t += "&"), "dn" === n && (e = encodeURIComponent(e).replace(/%20/g, "+")), "tr" !== n && "xs" !== n && "as" !== n && "ws" !== n || (e = encodeURIComponent(e)), "kt" === n && (e = encodeURIComponent(e)), t += "kt" === n && o > 0 ? "+" + e : n + "=" + e;
            });
          }), t;
        }t.exports = r, t.exports.decode = r, t.exports.encode = o;var i = e("thirty-two"),
            s = e("xtend"),
            a = e("uniq");
      }).call(this, e("buffer").Buffer);
    }, { buffer: 24, "thirty-two": 103, uniq: 110, xtend: 119 }], 49: [function (e, t, n) {
      function r(e, t) {
        var n = this;if (!(n instanceof r)) return new r(e, t);if (!u) throw new Error("web browser lacks MediaSource support");t || (t = {}), n._bufferDuration = t.bufferDuration || c, n._elem = e, n._mediaSource = new u(), n._streams = [], n.detailedError = null, n._errorHandler = function () {
          n._elem.removeEventListener("error", n._errorHandler), n._streams.slice().forEach(function (e) {
            e.destroy(n._elem.error);
          });
        }, n._elem.addEventListener("error", n._errorHandler), n._elem.src = window.URL.createObjectURL(n._mediaSource);
      }function o(e, t) {
        var n = this;if (s.Writable.call(n), n._wrapper = e, n._elem = e._elem, n._mediaSource = e._mediaSource, n._allStreams = e._streams, n._allStreams.push(n), n._bufferDuration = e._bufferDuration, n._sourceBuffer = null, n._openHandler = function () {
          n._onSourceOpen();
        }, n._flowHandler = function () {
          n._flow();
        }, "string" == typeof t) n._type = t, "open" === n._mediaSource.readyState ? n._createSourceBuffer() : n._mediaSource.addEventListener("sourceopen", n._openHandler);else if (null === t._sourceBuffer) t.destroy(), n._type = t._type, n._mediaSource.addEventListener("sourceopen", n._openHandler);else {
          if (!t._sourceBuffer) throw new Error("The argument to MediaElementWrapper.createWriteStream must be a string or a previous stream returned from that function");t.destroy(), n._type = t._type, n._sourceBuffer = t._sourceBuffer, n._sourceBuffer.addEventListener("updateend", n._flowHandler);
        }n._elem.addEventListener("timeupdate", n._flowHandler), n.on("error", function (e) {
          n._wrapper.error(e);
        }), n.on("finish", function () {
          if (!n.destroyed && (n._finished = !0, n._allStreams.every(function (e) {
            return e._finished;
          }))) try {
            n._mediaSource.endOfStream();
          } catch (e) {}
        });
      }t.exports = r;var i = e("inherits"),
          s = e("readable-stream"),
          a = e("to-arraybuffer"),
          u = "undefined" != typeof window && window.MediaSource,
          c = 60;r.prototype.createWriteStream = function (e) {
        return new o(this, e);
      }, r.prototype.error = function (e) {
        var t = this;t.detailedError || (t.detailedError = e);try {
          t._mediaSource.endOfStream("decode");
        } catch (e) {}
      }, i(o, s.Writable), o.prototype._onSourceOpen = function () {
        var e = this;e.destroyed || (e._mediaSource.removeEventListener("sourceopen", e._openHandler), e._createSourceBuffer());
      }, o.prototype.destroy = function (e) {
        var t = this;t.destroyed || (t.destroyed = !0, t._allStreams.splice(t._allStreams.indexOf(t), 1), t._mediaSource.removeEventListener("sourceopen", t._openHandler), t._elem.removeEventListener("timeupdate", t._flowHandler), t._sourceBuffer && (t._sourceBuffer.removeEventListener("updateend", t._flowHandler), "open" === t._mediaSource.readyState && t._sourceBuffer.abort()), e && t.emit("error", e), t.emit("close"));
      }, o.prototype._createSourceBuffer = function () {
        var e = this;if (!e.destroyed) if (u.isTypeSupported(e._type)) {
          if (e._sourceBuffer = e._mediaSource.addSourceBuffer(e._type), e._sourceBuffer.addEventListener("updateend", e._flowHandler), e._cb) {
            var t = e._cb;e._cb = null, t();
          }
        } else e.destroy(new Error("The provided type is not supported"));
      }, o.prototype._write = function (e, t, n) {
        var r = this;if (!r.destroyed) {
          if (!r._sourceBuffer) return void (r._cb = function (o) {
            if (o) return n(o);r._write(e, t, n);
          });if (r._sourceBuffer.updating) return n(new Error("Cannot append buffer while source buffer updating"));try {
            r._sourceBuffer.appendBuffer(a(e));
          } catch (e) {
            return void r.destroy(e);
          }r._cb = n;
        }
      }, o.prototype._flow = function () {
        var e = this;if (!e.destroyed && e._sourceBuffer && !e._sourceBuffer.updating && !("open" === e._mediaSource.readyState && e._getBufferDuration() > e._bufferDuration) && e._cb) {
          var t = e._cb;e._cb = null, t();
        }
      };o.prototype._getBufferDuration = function () {
        for (var e = this, t = e._sourceBuffer.buffered, n = e._elem.currentTime, r = -1, o = 0; o < t.length; o++) {
          var i = t.start(o),
              s = t.end(o) + 0;if (i > n) break;(r >= 0 || n <= s) && (r = s);
        }var a = r - n;return a < 0 && (a = 0), a;
      };
    }, { inherits: 41, "readable-stream": 82, "to-arraybuffer": 105 }], 50: [function (e, t, n) {
      (function (e) {
        function n(e, t) {
          if (!(this instanceof n)) return new n(e, t);if (t || (t = {}), this.chunkLength = Number(e), !this.chunkLength) throw new Error("First argument must be a chunk length");this.chunks = [], this.closed = !1, this.length = Number(t.length) || 1 / 0, this.length !== 1 / 0 && (this.lastChunkLength = this.length % this.chunkLength || this.chunkLength, this.lastChunkIndex = Math.ceil(this.length / this.chunkLength) - 1);
        }function r(t, n, r) {
          e.nextTick(function () {
            t && t(n, r);
          });
        }t.exports = n, n.prototype.put = function (e, t, n) {
          if (this.closed) return r(n, new Error("Storage is closed"));var o = e === this.lastChunkIndex;return o && t.length !== this.lastChunkLength ? r(n, new Error("Last chunk length must be " + this.lastChunkLength)) : o || t.length === this.chunkLength ? (this.chunks[e] = t, void r(n, null)) : r(n, new Error("Chunk length must be " + this.chunkLength));
        }, n.prototype.get = function (e, t, n) {
          if ("function" == typeof t) return this.get(e, null, t);if (this.closed) return r(n, new Error("Storage is closed"));var o = this.chunks[e];if (!o) return r(n, new Error("Chunk not found"));if (!t) return r(n, null, o);var i = t.offset || 0,
              s = t.length || o.length - i;r(n, null, o.slice(i, s + i));
        }, n.prototype.close = n.prototype.destroy = function (e) {
          if (this.closed) return r(e, new Error("Storage is closed"));this.closed = !0, this.chunks = null, r(e, null);
        };
      }).call(this, e("_process"));
    }, { _process: 66 }], 51: [function (e, t, n) {
      (function (t) {
        function r(e, t, n) {
          for (var r = t; r < n; r++) {
            e[r] = 0;
          }
        }function o(e, t, n) {
          t.writeUInt32BE(Math.floor((e.getTime() + g) / 1e3), n);
        }function i(e, t, n) {
          t.writeUInt16BE(Math.floor(e) % 65536, n), t.writeUInt16BE(Math.floor(256 * e * 256) % 65536, n + 2);
        }function s(e, t, n) {
          t[n] = Math.floor(e) % 256, t[n + 1] = Math.floor(256 * e) % 256;
        }function a(e, t, n) {
          e || (e = [0, 0, 0, 0, 0, 0, 0, 0, 0]);for (var r = 0; r < e.length; r++) {
            i(e[r], t, n + 4 * r);
          }
        }function u(e, n, r) {
          var o = new t(e, "utf8");o.copy(n, r), n[r + o.length] = 0;
        }function c(e) {
          for (var t = new Array(e.length / 4), n = 0; n < t.length; n++) {
            t[n] = d(e, 4 * n);
          }return t;
        }function f(e, t) {
          return new Date(1e3 * e.readUInt32BE(t) - g);
        }function d(e, t) {
          return e.readUInt16BE(t) + e.readUInt16BE(t + 2) / 65536;
        }function h(e, t) {
          return e[t] + e[t + 1] / 256;
        }function l(e, t, n) {
          var r;for (r = 0; r < n && 0 !== e[t + r]; r++) {}return e.toString("utf8", t, t + r);
        }var p = e("./index"),
            m = e("./descriptor"),
            g = 20828448e5;n.fullBoxes = {}, ["mvhd", "tkhd", "mdhd", "vmhd", "smhd", "stsd", "esds", "stsz", "stco", "stss", "stts", "ctts", "stsc", "dref", "elst", "hdlr", "mehd", "trex", "mfhd", "tfhd", "tfdt", "trun"].forEach(function (e) {
          n.fullBoxes[e] = !0;
        }), n.ftyp = {}, n.ftyp.encode = function (e, r, o) {
          r = r ? r.slice(o) : new t(n.ftyp.encodingLength(e));var i = e.compatibleBrands || [];r.write(e.brand, 0, 4, "ascii"), r.writeUInt32BE(e.brandVersion, 4);for (var s = 0; s < i.length; s++) {
            r.write(i[s], 8 + 4 * s, 4, "ascii");
          }return n.ftyp.encode.bytes = 8 + 4 * i.length, r;
        }, n.ftyp.decode = function (e, t) {
          e = e.slice(t);for (var n = e.toString("ascii", 0, 4), r = e.readUInt32BE(4), o = [], i = 8; i < e.length; i += 4) {
            o.push(e.toString("ascii", i, i + 4));
          }return { brand: n, brandVersion: r, compatibleBrands: o };
        }, n.ftyp.encodingLength = function (e) {
          return 8 + 4 * (e.compatibleBrands || []).length;
        }, n.mvhd = {}, n.mvhd.encode = function (e, u, c) {
          return u = u ? u.slice(c) : new t(96), o(e.ctime || new Date(), u, 0), o(e.mtime || new Date(), u, 4), u.writeUInt32BE(e.timeScale || 0, 8), u.writeUInt32BE(e.duration || 0, 12), i(e.preferredRate || 0, u, 16), s(e.preferredVolume || 0, u, 20), r(u, 22, 32), a(e.matrix, u, 32), u.writeUInt32BE(e.previewTime || 0, 68), u.writeUInt32BE(e.previewDuration || 0, 72), u.writeUInt32BE(e.posterTime || 0, 76), u.writeUInt32BE(e.selectionTime || 0, 80), u.writeUInt32BE(e.selectionDuration || 0, 84), u.writeUInt32BE(e.currentTime || 0, 88), u.writeUInt32BE(e.nextTrackId || 0, 92), n.mvhd.encode.bytes = 96, u;
        }, n.mvhd.decode = function (e, t) {
          return e = e.slice(t), { ctime: f(e, 0), mtime: f(e, 4), timeScale: e.readUInt32BE(8), duration: e.readUInt32BE(12), preferredRate: d(e, 16), preferredVolume: h(e, 20), matrix: c(e.slice(32, 68)), previewTime: e.readUInt32BE(68), previewDuration: e.readUInt32BE(72), posterTime: e.readUInt32BE(76), selectionTime: e.readUInt32BE(80), selectionDuration: e.readUInt32BE(84), currentTime: e.readUInt32BE(88), nextTrackId: e.readUInt32BE(92) };
        }, n.mvhd.encodingLength = function (e) {
          return 96;
        }, n.tkhd = {}, n.tkhd.encode = function (e, i, s) {
          return i = i ? i.slice(s) : new t(80), o(e.ctime || new Date(), i, 0), o(e.mtime || new Date(), i, 4), i.writeUInt32BE(e.trackId || 0, 8), r(i, 12, 16), i.writeUInt32BE(e.duration || 0, 16), r(i, 20, 28), i.writeUInt16BE(e.layer || 0, 28), i.writeUInt16BE(e.alternateGroup || 0, 30), i.writeUInt16BE(e.volume || 0, 32), a(e.matrix, i, 36), i.writeUInt32BE(e.trackWidth || 0, 72), i.writeUInt32BE(e.trackHeight || 0, 76), n.tkhd.encode.bytes = 80, i;
        }, n.tkhd.decode = function (e, t) {
          return e = e.slice(t), { ctime: f(e, 0), mtime: f(e, 4), trackId: e.readUInt32BE(8), duration: e.readUInt32BE(16), layer: e.readUInt16BE(28), alternateGroup: e.readUInt16BE(30), volume: e.readUInt16BE(32), matrix: c(e.slice(36, 72)), trackWidth: e.readUInt32BE(72), trackHeight: e.readUInt32BE(76) };
        }, n.tkhd.encodingLength = function (e) {
          return 80;
        }, n.mdhd = {}, n.mdhd.encode = function (e, r, i) {
          return r = r ? r.slice(i) : new t(20), o(e.ctime || new Date(), r, 0), o(e.mtime || new Date(), r, 4), r.writeUInt32BE(e.timeScale || 0, 8), r.writeUInt32BE(e.duration || 0, 12), r.writeUInt16BE(e.language || 0, 16), r.writeUInt16BE(e.quality || 0, 18), n.mdhd.encode.bytes = 20, r;
        }, n.mdhd.decode = function (e, t) {
          return e = e.slice(t), { ctime: f(e, 0), mtime: f(e, 4), timeScale: e.readUInt32BE(8), duration: e.readUInt32BE(12), language: e.readUInt16BE(16), quality: e.readUInt16BE(18) };
        }, n.mdhd.encodingLength = function (e) {
          return 20;
        }, n.vmhd = {}, n.vmhd.encode = function (e, r, o) {
          r = r ? r.slice(o) : new t(8), r.writeUInt16BE(e.graphicsMode || 0, 0);var i = e.opcolor || [0, 0, 0];return r.writeUInt16BE(i[0], 2), r.writeUInt16BE(i[1], 4), r.writeUInt16BE(i[2], 6), n.vmhd.encode.bytes = 8, r;
        }, n.vmhd.decode = function (e, t) {
          return e = e.slice(t), { graphicsMode: e.readUInt16BE(0), opcolor: [e.readUInt16BE(2), e.readUInt16BE(4), e.readUInt16BE(6)] };
        }, n.vmhd.encodingLength = function (e) {
          return 8;
        }, n.smhd = {}, n.smhd.encode = function (e, o, i) {
          return o = o ? o.slice(i) : new t(4), o.writeUInt16BE(e.balance || 0, 0), r(o, 2, 4), n.smhd.encode.bytes = 4, o;
        }, n.smhd.decode = function (e, t) {
          return e = e.slice(t), { balance: e.readUInt16BE(0) };
        }, n.smhd.encodingLength = function (e) {
          return 4;
        }, n.stsd = {}, n.stsd.encode = function (e, r, o) {
          r = r ? r.slice(o) : new t(n.stsd.encodingLength(e));var i = e.entries || [];r.writeUInt32BE(i.length, 0);for (var s = 4, a = 0; a < i.length; a++) {
            var u = i[a];p.encode(u, r, s), s += p.encode.bytes;
          }return n.stsd.encode.bytes = s, r;
        }, n.stsd.decode = function (e, t, n) {
          e = e.slice(t);for (var r = e.readUInt32BE(0), o = new Array(r), i = 4, s = 0; s < r; s++) {
            var a = p.decode(e, i, n);o[s] = a, i += a.length;
          }return { entries: o };
        }, n.stsd.encodingLength = function (e) {
          var t = 4;if (!e.entries) return t;for (var n = 0; n < e.entries.length; n++) {
            t += p.encodingLength(e.entries[n]);
          }return t;
        }, n.avc1 = n.VisualSampleEntry = {}, n.VisualSampleEntry.encode = function (e, o, i) {
          o = o ? o.slice(i) : new t(n.VisualSampleEntry.encodingLength(e)), r(o, 0, 6), o.writeUInt16BE(e.dataReferenceIndex || 0, 6), r(o, 8, 24), o.writeUInt16BE(e.width || 0, 24), o.writeUInt16BE(e.height || 0, 26), o.writeUInt32BE(e.hResolution || 4718592, 28), o.writeUInt32BE(e.vResolution || 4718592, 32), r(o, 36, 40), o.writeUInt16BE(e.frameCount || 1, 40);var s = e.compressorName || "",
              a = Math.min(s.length, 31);o.writeUInt8(a, 42), o.write(s, 43, a, "utf8"), o.writeUInt16BE(e.depth || 24, 74), o.writeInt16BE(-1, 76);var u = 78;(e.children || []).forEach(function (e) {
            p.encode(e, o, u), u += p.encode.bytes;
          }), n.VisualSampleEntry.encode.bytes = u;
        }, n.VisualSampleEntry.decode = function (e, t, n) {
          e = e.slice(t);for (var r = n - t, o = Math.min(e.readUInt8(42), 31), i = { dataReferenceIndex: e.readUInt16BE(6), width: e.readUInt16BE(24), height: e.readUInt16BE(26), hResolution: e.readUInt32BE(28), vResolution: e.readUInt32BE(32), frameCount: e.readUInt16BE(40), compressorName: e.toString("utf8", 43, 43 + o), depth: e.readUInt16BE(74), children: [] }, s = 78; r - s >= 8;) {
            var a = p.decode(e, s, r);i.children.push(a), i[a.type] = a, s += a.length;
          }return i;
        }, n.VisualSampleEntry.encodingLength = function (e) {
          var t = 78;return (e.children || []).forEach(function (e) {
            t += p.encodingLength(e);
          }), t;
        }, n.avcC = {}, n.avcC.encode = function (e, r, o) {
          r = r ? r.slice(o) : t(e.buffer.length), e.buffer.copy(r), n.avcC.encode.bytes = e.buffer.length;
        }, n.avcC.decode = function (e, n, r) {
          return e = e.slice(n, r), { mimeCodec: e.toString("hex", 1, 4), buffer: new t(e) };
        }, n.avcC.encodingLength = function (e) {
          return e.buffer.length;
        }, n.mp4a = n.AudioSampleEntry = {}, n.AudioSampleEntry.encode = function (e, o, i) {
          o = o ? o.slice(i) : new t(n.AudioSampleEntry.encodingLength(e)), r(o, 0, 6), o.writeUInt16BE(e.dataReferenceIndex || 0, 6), r(o, 8, 16), o.writeUInt16BE(e.channelCount || 2, 16), o.writeUInt16BE(e.sampleSize || 16, 18), r(o, 20, 24), o.writeUInt32BE(e.sampleRate || 0, 24);var s = 28;(e.children || []).forEach(function (e) {
            p.encode(e, o, s), s += p.encode.bytes;
          }), n.AudioSampleEntry.encode.bytes = s;
        }, n.AudioSampleEntry.decode = function (e, t, n) {
          e = e.slice(t, n);for (var r = n - t, o = { dataReferenceIndex: e.readUInt16BE(6), channelCount: e.readUInt16BE(16), sampleSize: e.readUInt16BE(18), sampleRate: e.readUInt32BE(24), children: [] }, i = 28; r - i >= 8;) {
            var s = p.decode(e, i, r);o.children.push(s), o[s.type] = s, i += s.length;
          }return o;
        }, n.AudioSampleEntry.encodingLength = function (e) {
          var t = 28;return (e.children || []).forEach(function (e) {
            t += p.encodingLength(e);
          }), t;
        }, n.esds = {}, n.esds.encode = function (e, r, o) {
          r = r ? r.slice(o) : t(e.buffer.length), e.buffer.copy(r, 0), n.esds.encode.bytes = e.buffer.length;
        }, n.esds.decode = function (e, n, r) {
          e = e.slice(n, r);var o = m.Descriptor.decode(e, 0, e.length),
              i = "ESDescriptor" === o.tagName ? o : {},
              s = i.DecoderConfigDescriptor || {},
              a = s.oti || 0,
              u = s.DecoderSpecificInfo,
              c = u ? (248 & u.buffer.readUInt8(0)) >> 3 : 0,
              f = null;return a && (f = a.toString(16), c && (f += "." + c)), { mimeCodec: f, buffer: new t(e.slice(0)) };
        }, n.esds.encodingLength = function (e) {
          return e.buffer.length;
        }, n.stsz = {}, n.stsz.encode = function (e, r, o) {
          var i = e.entries || [];r = r ? r.slice(o) : t(n.stsz.encodingLength(e)), r.writeUInt32BE(0, 0), r.writeUInt32BE(i.length, 4);for (var s = 0; s < i.length; s++) {
            r.writeUInt32BE(i[s], 4 * s + 8);
          }return n.stsz.encode.bytes = 8 + 4 * i.length, r;
        }, n.stsz.decode = function (e, t) {
          e = e.slice(t);for (var n = e.readUInt32BE(0), r = e.readUInt32BE(4), o = new Array(r), i = 0; i < r; i++) {
            o[i] = 0 === n ? e.readUInt32BE(4 * i + 8) : n;
          }return { entries: o };
        }, n.stsz.encodingLength = function (e) {
          return 8 + 4 * e.entries.length;
        }, n.stss = n.stco = {}, n.stco.encode = function (e, r, o) {
          var i = e.entries || [];r = r ? r.slice(o) : new t(n.stco.encodingLength(e)), r.writeUInt32BE(i.length, 0);for (var s = 0; s < i.length; s++) {
            r.writeUInt32BE(i[s], 4 * s + 4);
          }return n.stco.encode.bytes = 4 + 4 * i.length, r;
        }, n.stco.decode = function (e, t) {
          e = e.slice(t);for (var n = e.readUInt32BE(0), r = new Array(n), o = 0; o < n; o++) {
            r[o] = e.readUInt32BE(4 * o + 4);
          }return { entries: r };
        }, n.stco.encodingLength = function (e) {
          return 4 + 4 * e.entries.length;
        }, n.stts = {}, n.stts.encode = function (e, r, o) {
          var i = e.entries || [];r = r ? r.slice(o) : new t(n.stts.encodingLength(e)), r.writeUInt32BE(i.length, 0);for (var s = 0; s < i.length; s++) {
            var a = 8 * s + 4;r.writeUInt32BE(i[s].count || 0, a), r.writeUInt32BE(i[s].duration || 0, a + 4);
          }return n.stts.encode.bytes = 4 + 8 * e.entries.length, r;
        }, n.stts.decode = function (e, t) {
          e = e.slice(t);for (var n = e.readUInt32BE(0), r = new Array(n), o = 0; o < n; o++) {
            var i = 8 * o + 4;r[o] = { count: e.readUInt32BE(i), duration: e.readUInt32BE(i + 4) };
          }return { entries: r };
        }, n.stts.encodingLength = function (e) {
          return 4 + 8 * e.entries.length;
        }, n.ctts = {}, n.ctts.encode = function (e, r, o) {
          var i = e.entries || [];r = r ? r.slice(o) : new t(n.ctts.encodingLength(e)), r.writeUInt32BE(i.length, 0);for (var s = 0; s < i.length; s++) {
            var a = 8 * s + 4;r.writeUInt32BE(i[s].count || 0, a), r.writeUInt32BE(i[s].compositionOffset || 0, a + 4);
          }return n.ctts.encode.bytes = 4 + 8 * i.length, r;
        }, n.ctts.decode = function (e, t) {
          e = e.slice(t);for (var n = e.readUInt32BE(0), r = new Array(n), o = 0; o < n; o++) {
            var i = 8 * o + 4;r[o] = { count: e.readUInt32BE(i), compositionOffset: e.readInt32BE(i + 4) };
          }return { entries: r };
        }, n.ctts.encodingLength = function (e) {
          return 4 + 8 * e.entries.length;
        }, n.stsc = {}, n.stsc.encode = function (e, r, o) {
          var i = e.entries || [];r = r ? r.slice(o) : new t(n.stsc.encodingLength(e)), r.writeUInt32BE(i.length, 0);for (var s = 0; s < i.length; s++) {
            var a = 12 * s + 4;r.writeUInt32BE(i[s].firstChunk || 0, a), r.writeUInt32BE(i[s].samplesPerChunk || 0, a + 4), r.writeUInt32BE(i[s].sampleDescriptionId || 0, a + 8);
          }return n.stsc.encode.bytes = 4 + 12 * i.length, r;
        }, n.stsc.decode = function (e, t) {
          e = e.slice(t);for (var n = e.readUInt32BE(0), r = new Array(n), o = 0; o < n; o++) {
            var i = 12 * o + 4;r[o] = { firstChunk: e.readUInt32BE(i), samplesPerChunk: e.readUInt32BE(i + 4), sampleDescriptionId: e.readUInt32BE(i + 8) };
          }return { entries: r };
        }, n.stsc.encodingLength = function (e) {
          return 4 + 12 * e.entries.length;
        }, n.dref = {}, n.dref.encode = function (e, r, o) {
          r = r ? r.slice(o) : new t(n.dref.encodingLength(e));var i = e.entries || [];r.writeUInt32BE(i.length, 0);for (var s = 4, a = 0; a < i.length; a++) {
            var u = i[a],
                c = (u.buf ? u.buf.length : 0) + 4 + 4;r.writeUInt32BE(c, s), s += 4, r.write(u.type, s, 4, "ascii"), s += 4, u.buf && (u.buf.copy(r, s), s += u.buf.length);
          }return n.dref.encode.bytes = s, r;
        }, n.dref.decode = function (e, t) {
          e = e.slice(t);for (var n = e.readUInt32BE(0), r = new Array(n), o = 4, i = 0; i < n; i++) {
            var s = e.readUInt32BE(o),
                a = e.toString("ascii", o + 4, o + 8),
                u = e.slice(o + 8, o + s);o += s, r[i] = { type: a, buf: u };
          }return { entries: r };
        }, n.dref.encodingLength = function (e) {
          var t = 4;if (!e.entries) return t;for (var n = 0; n < e.entries.length; n++) {
            var r = e.entries[n].buf;t += (r ? r.length : 0) + 4 + 4;
          }return t;
        }, n.elst = {}, n.elst.encode = function (e, r, o) {
          var s = e.entries || [];r = r ? r.slice(o) : new t(n.elst.encodingLength(e)), r.writeUInt32BE(s.length, 0);for (var a = 0; a < s.length; a++) {
            var u = 12 * a + 4;r.writeUInt32BE(s[a].trackDuration || 0, u), r.writeUInt32BE(s[a].mediaTime || 0, u + 4), i(s[a].mediaRate || 0, r, u + 8);
          }return n.elst.encode.bytes = 4 + 12 * s.length, r;
        }, n.elst.decode = function (e, t) {
          e = e.slice(t);for (var n = e.readUInt32BE(0), r = new Array(n), o = 0; o < n; o++) {
            var i = 12 * o + 4;r[o] = { trackDuration: e.readUInt32BE(i), mediaTime: e.readInt32BE(i + 4), mediaRate: d(e, i + 8) };
          }return { entries: r };
        }, n.elst.encodingLength = function (e) {
          return 4 + 12 * e.entries.length;
        }, n.hdlr = {}, n.hdlr.encode = function (e, r, o) {
          r = r ? r.slice(o) : new t(n.hdlr.encodingLength(e));var i = 21 + (e.name || "").length;return r.fill(0, 0, i), r.write(e.handlerType || "", 4, 4, "ascii"), u(e.name || "", r, 20), n.hdlr.encode.bytes = i, r;
        }, n.hdlr.decode = function (e, t, n) {
          return e = e.slice(t), { handlerType: e.toString("ascii", 4, 8), name: l(e, 20, n) };
        }, n.hdlr.encodingLength = function (e) {
          return 21 + (e.name || "").length;
        }, n.mehd = {}, n.mehd.encode = function (e, r, o) {
          return r = r ? r.slice(o) : new t(4), r.writeUInt32BE(e.fragmentDuration || 0, 0), n.mehd.encode.bytes = 4, r;
        }, n.mehd.decode = function (e, t) {
          return e = e.slice(t), { fragmentDuration: e.readUInt32BE(0) };
        }, n.mehd.encodingLength = function (e) {
          return 4;
        }, n.trex = {}, n.trex.encode = function (e, r, o) {
          return r = r ? r.slice(o) : new t(20), r.writeUInt32BE(e.trackId || 0, 0), r.writeUInt32BE(e.defaultSampleDescriptionIndex || 0, 4), r.writeUInt32BE(e.defaultSampleDuration || 0, 8), r.writeUInt32BE(e.defaultSampleSize || 0, 12), r.writeUInt32BE(e.defaultSampleFlags || 0, 16), n.trex.encode.bytes = 20, r;
        }, n.trex.decode = function (e, t) {
          return e = e.slice(t), { trackId: e.readUInt32BE(0), defaultSampleDescriptionIndex: e.readUInt32BE(4), defaultSampleDuration: e.readUInt32BE(8), defaultSampleSize: e.readUInt32BE(12), defaultSampleFlags: e.readUInt32BE(16) };
        }, n.trex.encodingLength = function (e) {
          return 20;
        }, n.mfhd = {}, n.mfhd.encode = function (e, r, o) {
          return r = r ? r.slice(o) : new t(4), r.writeUInt32BE(e.sequenceNumber || 0, 0), n.mfhd.encode.bytes = 4, r;
        }, n.mfhd.decode = function (e, t) {
          return { sequenceNumber: e.readUint32BE(0) };
        }, n.mfhd.encodingLength = function (e) {
          return 4;
        }, n.tfhd = {}, n.tfhd.encode = function (e, r, o) {
          return r = r ? r.slice(o) : new t(4), r.writeUInt32BE(e.trackId, 0), n.tfhd.encode.bytes = 4, r;
        }, n.tfhd.decode = function (e, t) {}, n.tfhd.encodingLength = function (e) {
          return 4;
        }, n.tfdt = {}, n.tfdt.encode = function (e, r, o) {
          return r = r ? r.slice(o) : new t(4), r.writeUInt32BE(e.baseMediaDecodeTime || 0, 0), n.tfdt.encode.bytes = 4, r;
        }, n.tfdt.decode = function (e, t) {}, n.tfdt.encodingLength = function (e) {
          return 4;
        }, n.trun = {}, n.trun.encode = function (e, r, o) {
          r = r ? r.slice(o) : new t(8 + 16 * e.entries.length), r.writeUInt32BE(e.entries.length, 0), r.writeInt32BE(e.dataOffset, 4);for (var i = 8, s = 0; s < e.entries.length; s++) {
            var a = e.entries[s];r.writeUInt32BE(a.sampleDuration, i), i += 4, r.writeUInt32BE(a.sampleSize, i), i += 4, r.writeUInt32BE(a.sampleFlags, i), i += 4, r.writeUInt32BE(a.sampleCompositionTimeOffset, i), i += 4;
          }n.trun.encode.bytes = i;
        }, n.trun.decode = function (e, t) {}, n.trun.encodingLength = function (e) {
          return 8 + 16 * e.entries.length;
        }, n.mdat = {}, n.mdat.encode = function (e, t, r) {
          e.buffer ? (e.buffer.copy(t, r), n.mdat.encode.bytes = e.buffer.length) : n.mdat.encode.bytes = n.mdat.encodingLength(e);
        }, n.mdat.decode = function (e, n, r) {
          return { buffer: new t(e.slice(n, r)) };
        }, n.mdat.encodingLength = function (e) {
          return e.buffer ? e.buffer.length : e.contentLength;
        };
      }).call(this, e("buffer").Buffer);
    }, { "./descriptor": 52, "./index": 53, buffer: 24 }], 52: [function (e, t, n) {
      (function (e) {
        var t = { 3: "ESDescriptor", 4: "DecoderConfigDescriptor", 5: "DecoderSpecificInfo", 6: "SLConfigDescriptor" };n.Descriptor = {}, n.Descriptor.decode = function (r, o, i) {
          var s,
              a = r.readUInt8(o),
              u = o + 1,
              c = 0;do {
            s = r.readUInt8(u++), c = c << 7 | 127 & s;
          } while (128 & s);var f,
              d = t[a];return f = n[d] ? n[d].decode(r, u, i) : { buffer: new e(r.slice(u, u + c)) }, f.tag = a, f.tagName = d, f.length = u - o + c, f.contentsLen = c, f;
        }, n.DescriptorArray = {}, n.DescriptorArray.decode = function (e, r, o) {
          for (var i = r, s = {}; i + 2 <= o;) {
            var a = n.Descriptor.decode(e, i, o);i += a.length;s[t[a.tag] || "Descriptor" + a.tag] = a;
          }return s;
        }, n.ESDescriptor = {}, n.ESDescriptor.decode = function (e, t, r) {
          var o = e.readUInt8(t + 2),
              i = t + 3;if (128 & o && (i += 2), 64 & o) {
            i += e.readUInt8(i) + 1;
          }return 32 & o && (i += 2), n.DescriptorArray.decode(e, i, r);
        }, n.DecoderConfigDescriptor = {}, n.DecoderConfigDescriptor.decode = function (e, t, r) {
          var o = e.readUInt8(t),
              i = n.DescriptorArray.decode(e, t + 13, r);return i.oti = o, i;
        };
      }).call(this, e("buffer").Buffer);
    }, { buffer: 24 }], 53: [function (e, t, n) {
      (function (t) {
        var r = e("uint64be"),
            o = e("./boxes"),
            i = n,
            s = n.containers = { moov: ["mvhd", "meta", "traks", "mvex"], trak: ["tkhd", "tref", "trgr", "edts", "meta", "mdia", "udta"], edts: ["elst"], mdia: ["mdhd", "hdlr", "elng", "minf"], minf: ["vmhd", "smhd", "hmhd", "sthd", "nmhd", "dinf", "stbl"], dinf: ["dref"], stbl: ["stsd", "stts", "ctts", "cslg", "stsc", "stsz", "stz2", "stco", "co64", "stss", "stsh", "padb", "stdp", "sdtp", "sbgps", "sgpds", "subss", "saizs", "saios"], mvex: ["mehd", "trexs", "leva"], moof: ["mfhd", "meta", "trafs"], traf: ["tfhd", "trun", "sbgps", "sgpds", "subss", "saizs", "saios", "tfdt", "meta"] };i.encode = function (e, n, r) {
          return i.encodingLength(e), r = r || 0, n = n || new t(e.length), i._encode(e, n, r);
        }, i._encode = function (e, t, n) {
          var a = e.type,
              u = e.length;u > 4294967295 && (u = 1), t.writeUInt32BE(u, n), t.write(e.type, n + 4, 4, "ascii");var c = n + 8;if (1 === u && (r.encode(e.length, t, c), c += 8), o.fullBoxes[a] && (t.writeUInt32BE(e.flags || 0, c), t.writeUInt8(e.version || 0, c), c += 4), s[a]) {
            s[a].forEach(function (n) {
              if (5 === n.length) {
                var r = e[n] || [];n = n.substr(0, 4), r.forEach(function (e) {
                  i._encode(e, t, c), c += i.encode.bytes;
                });
              } else e[n] && (i._encode(e[n], t, c), c += i.encode.bytes);
            }), e.otherBoxes && e.otherBoxes.forEach(function (e) {
              i._encode(e, t, c), c += i.encode.bytes;
            });
          } else if (o[a]) {
            var f = o[a].encode;f(e, t, c), c += f.bytes;
          } else {
            if (!e.buffer) throw new Error("Either `type` must be set to a known type (not'" + a + "') or `buffer` must be set");var d = e.buffer;d.copy(t, c), c += e.buffer.length;
          }return i.encode.bytes = c - n, t;
        }, i.readHeaders = function (e, t, n) {
          if (t = t || 0, (n = n || e.length) - t < 8) return 8;var i = e.readUInt32BE(t),
              s = e.toString("ascii", t + 4, t + 8),
              a = t + 8;if (1 === i) {
            if (n - t < 16) return 16;i = r.decode(e, a), a += 8;
          }var u, c;return o.fullBoxes[s] && (u = e.readUInt8(a), c = 16777215 & e.readUInt32BE(a), a += 4), { length: i, headersLen: a - t, contentLen: i - (a - t), type: s, version: u, flags: c };
        }, i.decode = function (e, t, n) {
          t = t || 0, n = n || e.length;var r = i.readHeaders(e, t, n);if (!r || r.length > n - t) throw new Error("Data too short");return i.decodeWithoutHeaders(r, e, t + r.headersLen, t + r.length);
        }, i.decodeWithoutHeaders = function (e, n, r, a) {
          r = r || 0, a = a || n.length;var u = e.type,
              c = {};if (s[u]) {
            c.otherBoxes = [];for (var f = s[u], d = r; a - d >= 8;) {
              var h = i.decode(n, d, a);if (d += h.length, f.indexOf(h.type) >= 0) c[h.type] = h;else if (f.indexOf(h.type + "s") >= 0) {
                var l = h.type + "s",
                    p = c[l] = c[l] || [];p.push(h);
              } else c.otherBoxes.push(h);
            }
          } else if (o[u]) {
            var m = o[u].decode;c = m(n, r, a);
          } else c.buffer = new t(n.slice(r, a));return c.length = e.length, c.contentLen = e.contentLen, c.type = e.type, c.version = e.version, c.flags = e.flags, c;
        }, i.encodingLength = function (e) {
          var t = e.type,
              n = 8;if (o.fullBoxes[t] && (n += 4), s[t]) {
            s[t].forEach(function (t) {
              if (5 === t.length) {
                var r = e[t] || [];t = t.substr(0, 4), r.forEach(function (e) {
                  e.type = t, n += i.encodingLength(e);
                });
              } else if (e[t]) {
                var o = e[t];o.type = t, n += i.encodingLength(o);
              }
            }), e.otherBoxes && e.otherBoxes.forEach(function (e) {
              n += i.encodingLength(e);
            });
          } else if (o[t]) n += o[t].encodingLength(e);else {
            if (!e.buffer) throw new Error("Either `type` must be set to a known type (not'" + t + "') or `buffer` must be set");n += e.buffer.length;
          }return n > 4294967295 && (n += 8), e.length = n, n;
        };
      }).call(this, e("buffer").Buffer);
    }, { "./boxes": 51, buffer: 24, uint64be: 109 }], 54: [function (e, t, n) {
      (function (n) {
        function r() {
          if (!(this instanceof r)) return new r();i.Writable.call(this), this.destroyed = !1, this._pending = 0, this._missing = 0, this._buf = null, this._str = null, this._cb = null, this._ondrain = null, this._writeBuffer = null, this._writeCb = null, this._ondrain = null, this._kick();
        }function o(e) {
          this._parent = e, this.destroyed = !1, i.PassThrough.call(this);
        }var i = e("readable-stream"),
            s = e("inherits"),
            a = e("next-event"),
            u = e("mp4-box-encoding"),
            c = new n(0);t.exports = r, s(r, i.Writable), r.prototype.destroy = function (e) {
          this.destroyed || (this.destroyed = !0, e && this.emit("error", e), this.emit("close"));
        }, r.prototype._write = function (e, t, n) {
          if (!this.destroyed) {
            for (var r = !this._str || !this._str._writableState.needDrain; e.length && !this.destroyed;) {
              if (!this._missing) return this._writeBuffer = e, void (this._writeCb = n);var o = e.length < this._missing ? e.length : this._missing;if (this._buf ? e.copy(this._buf, this._buf.length - this._missing) : this._str && (r = this._str.write(o === e.length ? e : e.slice(0, o))), this._missing -= o, !this._missing) {
                var i = this._buf,
                    s = this._cb,
                    a = this._str;this._buf = this._cb = this._str = this._ondrain = null, r = !0, a && a.end(), s && s(i);
              }e = o === e.length ? c : e.slice(o);
            }if (this._pending && !this._missing) return this._writeBuffer = e, void (this._writeCb = n);r ? n() : this._ondrain(n);
          }
        }, r.prototype._buffer = function (e, t) {
          this._missing = e, this._buf = new n(e), this._cb = t;
        }, r.prototype._stream = function (e, t) {
          var n = this;return this._missing = e, this._str = new o(this), this._ondrain = a(this._str, "drain"), this._pending++, this._str.on("end", function () {
            n._pending--, n._kick();
          }), this._cb = t, this._str;
        }, r.prototype._readBox = function () {
          function e(r, o) {
            t._buffer(r, function (r) {
              o = o ? n.concat([o, r]) : r;var i = u.readHeaders(o);"number" == typeof i ? e(i - o.length, o) : (t._pending++, t._headers = i, t.emit("box", i));
            });
          }var t = this;e(8);
        }, r.prototype.stream = function () {
          var e = this;if (!e._headers) throw new Error("this function can only be called once after 'box' is emitted");var t = e._headers;return e._headers = null, e._stream(t.contentLen, null);
        }, r.prototype.decode = function (e) {
          var t = this;if (!t._headers) throw new Error("this function can only be called once after 'box' is emitted");var n = t._headers;t._headers = null, t._buffer(n.contentLen, function (r) {
            var o = u.decodeWithoutHeaders(n, r);e(o), t._pending--, t._kick();
          });
        }, r.prototype.ignore = function () {
          var e = this;if (!e._headers) throw new Error("this function can only be called once after 'box' is emitted");var t = e._headers;e._headers = null, this._missing = t.contentLen, this._cb = function () {
            e._pending--, e._kick();
          };
        }, r.prototype._kick = function () {
          if (!this._pending && (this._buf || this._str || this._readBox(), this._writeBuffer)) {
            var e = this._writeCb,
                t = this._writeBuffer;this._writeBuffer = null, this._writeCb = null, this._write(t, null, e);
          }
        }, s(o, i.PassThrough), o.prototype.destroy = function (e) {
          this.destroyed || (this.destroyed = !0, this._parent.destroy(e), e && this.emit("error", e), this.emit("close"));
        };
      }).call(this, e("buffer").Buffer);
    }, { buffer: 24, inherits: 41, "mp4-box-encoding": 53, "next-event": 59, "readable-stream": 82 }], 55: [function (e, t, n) {
      (function (n, r) {
        function o() {}function i() {
          function e() {
            n._want && (n._want = !1, n._read());
          }function t() {
            n._stream = null;
          }if (!(this instanceof i)) return new i();a.Readable.call(this), this.destroyed = !1, this._reading = !1, this._stream = null, this._drain = null, this._want = !1, this._onreadable = e, this._onend = t;var n = this;
        }function s(e) {
          this._parent = e, this.destroyed = !1, a.PassThrough.call(this);
        }var a = e("readable-stream"),
            u = e("inherits"),
            c = e("mp4-box-encoding");t.exports = i, u(i, a.Readable), i.prototype.mediaData = i.prototype.mdat = function (e, t) {
          var n = new s(this);return this.box({ type: "mdat", contentLength: e, encodeBufferLen: 8, stream: n }, t), n;
        }, i.prototype.box = function (e, t) {
          if (t || (t = o), this.destroyed) return t(new Error("Encoder is destroyed"));var i;if (e.encodeBufferLen && (i = new r(e.encodeBufferLen)), e.stream) e.buffer = null, i = c.encode(e, i), this.push(i), this._stream = e.stream, this._stream.on("readable", this._onreadable), this._stream.on("end", this._onend), this._stream.on("end", t), this._forward();else {
            i = c.encode(e, i);if (this.push(i)) return n.nextTick(t);this._drain = t;
          }
        }, i.prototype.destroy = function (e) {
          if (!this.destroyed) {
            if (this.destroyed = !0, this._stream && this._stream.destroy && this._stream.destroy(), this._stream = null, this._drain) {
              var t = this._drain;this._drain = null, t(e);
            }e && this.emit("error", e), this.emit("close");
          }
        }, i.prototype.finalize = function () {
          this.push(null);
        }, i.prototype._forward = function () {
          if (this._stream) for (; !this.destroyed;) {
            var e = this._stream.read();if (!e) return void (this._want = !!this._stream);if (!this.push(e)) return;
          }
        }, i.prototype._read = function () {
          if (!this._reading && !this.destroyed) {
            if (this._reading = !0, this._stream && this._forward(), this._drain) {
              var e = this._drain;this._drain = null, e();
            }this._reading = !1;
          }
        }, u(s, a.PassThrough), s.prototype.destroy = function (e) {
          this.destroyed || (this.destroyed = !0, this._parent.destroy(e), e && this.emit("error", e), this.emit("close"));
        };
      }).call(this, e("_process"), e("buffer").Buffer);
    }, { _process: 66, buffer: 24, inherits: 41, "mp4-box-encoding": 53, "readable-stream": 82 }], 56: [function (e, t, n) {
      n.decode = e("./decode"), n.encode = e("./encode");
    }, { "./decode": 54, "./encode": 55 }], 57: [function (e, t, n) {
      function r(e) {
        if (e = String(e), !(e.length > 1e4)) {
          var t = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(e);if (t) {
            var n = parseFloat(t[1]);switch ((t[2] || "ms").toLowerCase()) {case "years":case "year":case "yrs":case "yr":case "y":
                return n * d;case "days":case "day":case "d":
                return n * f;case "hours":case "hour":case "hrs":case "hr":case "h":
                return n * c;case "minutes":case "minute":case "mins":case "min":case "m":
                return n * u;case "seconds":case "second":case "secs":case "sec":case "s":
                return n * a;case "milliseconds":case "millisecond":case "msecs":case "msec":case "ms":
                return n;default:
                return;}
          }
        }
      }function o(e) {
        return e >= f ? Math.round(e / f) + "d" : e >= c ? Math.round(e / c) + "h" : e >= u ? Math.round(e / u) + "m" : e >= a ? Math.round(e / a) + "s" : e + "ms";
      }function i(e) {
        return s(e, f, "day") || s(e, c, "hour") || s(e, u, "minute") || s(e, a, "second") || e + " ms";
      }function s(e, t, n) {
        if (!(e < t)) return e < 1.5 * t ? Math.floor(e / t) + " " + n : Math.ceil(e / t) + " " + n + "s";
      }var a = 1e3,
          u = 60 * a,
          c = 60 * u,
          f = 24 * c,
          d = 365.25 * f;t.exports = function (e, t) {
        t = t || {};var n = typeof e === "undefined" ? "undefined" : _typeof(e);if ("string" === n && e.length > 0) return r(e);if ("number" === n && !1 === isNaN(e)) return t.long ? i(e) : o(e);throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(e));
      };
    }, {}], 58: [function (e, t, n) {
      function r(e, t) {
        var n = this;if (!(n instanceof r)) return new r(e, t);s.Readable.call(n, t), n.destroyed = !1, n._drained = !1, n._forwarding = !1, n._current = null, "function" == typeof e ? n._queue = e : (n._queue = e.map(o), n._queue.forEach(function (e) {
          "function" != typeof e && n._attachErrorListener(e);
        })), n._next();
      }function o(e) {
        if (!e || "function" == typeof e || e._readableState) return e;var t = new s.Readable().wrap(e);return e.destroy && (t.destroy = e.destroy.bind(e)), t;
      }t.exports = r;var i = e("inherits"),
          s = e("readable-stream");i(r, s.Readable), r.obj = function (e) {
        return new r(e, { objectMode: !0, highWaterMark: 16 });
      }, r.prototype._read = function () {
        this._drained = !0, this._forward();
      }, r.prototype._forward = function () {
        if (!this._forwarding && this._drained && this._current) {
          this._forwarding = !0;for (var e; null !== (e = this._current.read());) {
            this._drained = this.push(e);
          }this._forwarding = !1;
        }
      }, r.prototype.destroy = function (e) {
        this.destroyed || (this.destroyed = !0, this._current && this._current.destroy && this._current.destroy(), "function" != typeof this._queue && this._queue.forEach(function (e) {
          e.destroy && e.destroy();
        }), e && this.emit("error", e), this.emit("close"));
      }, r.prototype._next = function () {
        var e = this;if (e._current = null, "function" == typeof e._queue) e._queue(function (t, n) {
          if (t) return e.destroy(t);n = o(n), e._attachErrorListener(n), e._gotNextStream(n);
        });else {
          var t = e._queue.shift();"function" == typeof t && (t = o(t()), e._attachErrorListener(t)), e._gotNextStream(t);
        }
      }, r.prototype._gotNextStream = function (e) {
        function t() {
          o._forward();
        }function n() {
          e._readableState.ended || o.destroy();
        }function r() {
          o._current = null, e.removeListener("readable", t), e.removeListener("end", r), e.removeListener("close", n), o._next();
        }var o = this;if (!e) return o.push(null), void o.destroy();o._current = e, o._forward(), e.on("readable", t), e.once("end", r), e.once("close", n);
      }, r.prototype._attachErrorListener = function (e) {
        function t(r) {
          e.removeListener("error", t), n.destroy(r);
        }var n = this;e && e.once("error", t);
      };
    }, { inherits: 41, "readable-stream": 82 }], 59: [function (e, t, n) {
      function r(e, t) {
        var n = null;return e.on(t, function (e) {
          if (n) {
            var t = n;n = null, t(e);
          }
        }), function (e) {
          n = e;
        };
      }t.exports = r;
    }, {}], 60: [function (e, t, n) {
      function r(e) {
        var t = function t() {
          return t.called ? t.value : (t.called = !0, t.value = e.apply(this, arguments));
        };return t.called = !1, t;
      }function o(e) {
        var t = function t() {
          if (t.called) throw new Error(t.onceError);return t.called = !0, t.value = e.apply(this, arguments);
        },
            n = e.name || "Function wrapped with `once`";return t.onceError = n + " shouldn't be called more than once", t.called = !1, t;
      }var i = e("wrappy");t.exports = i(r), t.exports.strict = i(o), r.proto = r(function () {
        Object.defineProperty(Function.prototype, "once", { value: function value() {
            return r(this);
          }, configurable: !0 }), Object.defineProperty(Function.prototype, "onceStrict", { value: function value() {
            return o(this);
          }, configurable: !0 });
      });
    }, { wrappy: 118 }], 61: [function (e, t, n) {
      (function (n) {
        function r(e) {
          n.isBuffer(e) && (e = u.decode(e)), a(e.info, "info"), a(e.info["name.utf-8"] || e.info.name, "info.name"), a(e.info["piece length"], "info['piece length']"), a(e.info.pieces, "info.pieces"), e.info.files ? e.info.files.forEach(function (e) {
            a("number" == typeof e.length, "info.files[0].length"), a(e["path.utf-8"] || e.path, "info.files[0].path");
          }) : a("number" == typeof e.info.length, "info.length");var t = {};t.info = e.info, t.infoBuffer = u.encode(e.info), t.infoHash = f.sync(t.infoBuffer), t.infoHashBuffer = new n(t.infoHash, "hex"), t.name = (e.info["name.utf-8"] || e.info.name).toString(), void 0 !== e.info.private && (t.private = !!e.info.private), e["creation date"] && (t.created = new Date(1e3 * e["creation date"])), e["created by"] && (t.createdBy = e["created by"].toString()), n.isBuffer(e.comment) && (t.comment = e.comment.toString()), t.announce = [], e["announce-list"] && e["announce-list"].length ? e["announce-list"].forEach(function (e) {
            e.forEach(function (e) {
              t.announce.push(e.toString());
            });
          }) : e.announce && t.announce.push(e.announce.toString()), n.isBuffer(e["url-list"]) && (e["url-list"] = e["url-list"].length > 0 ? [e["url-list"]] : []), t.urlList = (e["url-list"] || []).map(function (e) {
            return e.toString();
          }), d(t.announce), d(t.urlList);var r = e.info.files || [e.info];t.files = r.map(function (e, n) {
            var o = [].concat(t.name, e["path.utf-8"] || e.path || []).map(function (e) {
              return e.toString();
            });return { path: c.join.apply(null, [c.sep].concat(o)).slice(1), name: o[o.length - 1], length: e.length, offset: r.slice(0, n).reduce(i, 0) };
          }), t.length = r.reduce(i, 0);var o = t.files[t.files.length - 1];return t.pieceLength = e.info["piece length"], t.lastPieceLength = (o.offset + o.length) % t.pieceLength || t.pieceLength, t.pieces = s(e.info.pieces), t;
        }function o(e) {
          var t = { info: e.info };return t["announce-list"] = (e.announce || []).map(function (e) {
            return t.announce || (t.announce = e), e = new n(e, "utf8"), [e];
          }), t["url-list"] = e.urlList || [], e.created && (t["creation date"] = e.created.getTime() / 1e3 | 0), e.createdBy && (t["created by"] = e.createdBy), e.comment && (t.comment = e.comment), u.encode(t);
        }function i(e, t) {
          return e + t.length;
        }function s(e) {
          for (var t = [], n = 0; n < e.length; n += 20) {
            t.push(e.slice(n, n + 20).toString("hex"));
          }return t;
        }function a(e, t) {
          if (!e) throw new Error("Torrent is missing required field: " + t);
        }t.exports = r, t.exports.decode = r, t.exports.encode = o;var u = e("bencode"),
            c = e("path"),
            f = e("simple-sha1"),
            d = e("uniq");
      }).call(this, e("buffer").Buffer);
    }, { bencode: 11, buffer: 24, path: 63, "simple-sha1": 92, uniq: 110 }], 62: [function (e, t, n) {
      (function (n, r) {
        function o(e) {
          if ("string" == typeof e && /^(stream-)?magnet:/.test(e)) return f(e);if ("string" == typeof e && (/^[a-f0-9]{40}$/i.test(e) || /^[a-z2-7]{32}$/i.test(e))) return f("magnet:?xt=urn:btih:" + e);if (r.isBuffer(e) && 20 === e.length) return f("magnet:?xt=urn:btih:" + e.toString("hex"));if (r.isBuffer(e)) return d(e);if (e && e.infoHash) return e.announce || (e.announce = []), "string" == typeof e.announce && (e.announce = [e.announce]), e.urlList || (e.urlList = []), e;throw new Error("Invalid torrent identifier");
        }function i(e, t) {
          function r(e) {
            try {
              i = o(e);
            } catch (e) {
              return t(e);
            }i && i.infoHash ? t(null, i) : t(new Error("Invalid torrent identifier"));
          }var i;if ("function" != typeof t) throw new Error("second argument must be a Function");try {
            i = o(e);
          } catch (e) {}i && i.infoHash ? n.nextTick(function () {
            t(null, i);
          }) : s(e) ? a(e, function (e, n) {
            if (e) return t(new Error("Error converting Blob: " + e.message));r(n);
          }) : "function" == typeof c && /^https?:/.test(e) ? c.concat({ url: e, timeout: 3e4, headers: { "user-agent": "WebTorrent (http://webtorrent.io)" } }, function (e, n, o) {
            if (e) return t(new Error("Error downloading torrent: " + e.message));r(o);
          }) : "function" == typeof u.readFile && "string" == typeof e ? u.readFile(e, function (e, n) {
            if (e) return t(new Error("Invalid torrent identifier"));r(n);
          }) : n.nextTick(function () {
            t(new Error("Invalid torrent identifier"));
          });
        }function s(e) {
          return "undefined" != typeof Blob && e instanceof Blob;
        }t.exports = o, t.exports.remote = i;var a = e("blob-to-buffer"),
            u = e("fs"),
            c = e("simple-get"),
            f = e("magnet-uri"),
            d = e("parse-torrent-file");t.exports.toMagnetURI = f.encode, t.exports.toTorrentFile = d.encode, function () {
          r.alloc(0);
        }();
      }).call(this, e("_process"), e("buffer").Buffer);
    }, { _process: 66, "blob-to-buffer": 19, buffer: 24, fs: 22, "magnet-uri": 48, "parse-torrent-file": 61, "simple-get": 90 }], 63: [function (e, t, n) {
      (function (e) {
        function t(e, t) {
          for (var n = 0, r = e.length - 1; r >= 0; r--) {
            var o = e[r];"." === o ? e.splice(r, 1) : ".." === o ? (e.splice(r, 1), n++) : n && (e.splice(r, 1), n--);
          }if (t) for (; n--; n) {
            e.unshift("..");
          }return e;
        }function r(e, t) {
          if (e.filter) return e.filter(t);for (var n = [], r = 0; r < e.length; r++) {
            t(e[r], r, e) && n.push(e[r]);
          }return n;
        }var o = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/,
            i = function i(e) {
          return o.exec(e).slice(1);
        };n.resolve = function () {
          for (var n = "", o = !1, i = arguments.length - 1; i >= -1 && !o; i--) {
            var s = i >= 0 ? arguments[i] : e.cwd();if ("string" != typeof s) throw new TypeError("Arguments to path.resolve must be strings");s && (n = s + "/" + n, o = "/" === s.charAt(0));
          }return n = t(r(n.split("/"), function (e) {
            return !!e;
          }), !o).join("/"), (o ? "/" : "") + n || ".";
        }, n.normalize = function (e) {
          var o = n.isAbsolute(e),
              i = "/" === s(e, -1);return e = t(r(e.split("/"), function (e) {
            return !!e;
          }), !o).join("/"), e || o || (e = "."), e && i && (e += "/"), (o ? "/" : "") + e;
        }, n.isAbsolute = function (e) {
          return "/" === e.charAt(0);
        }, n.join = function () {
          var e = Array.prototype.slice.call(arguments, 0);return n.normalize(r(e, function (e, t) {
            if ("string" != typeof e) throw new TypeError("Arguments to path.join must be strings");return e;
          }).join("/"));
        }, n.relative = function (e, t) {
          function r(e) {
            for (var t = 0; t < e.length && "" === e[t]; t++) {}for (var n = e.length - 1; n >= 0 && "" === e[n]; n--) {}return t > n ? [] : e.slice(t, n - t + 1);
          }e = n.resolve(e).substr(1), t = n.resolve(t).substr(1);for (var o = r(e.split("/")), i = r(t.split("/")), s = Math.min(o.length, i.length), a = s, u = 0; u < s; u++) {
            if (o[u] !== i[u]) {
              a = u;break;
            }
          }for (var c = [], u = a; u < o.length; u++) {
            c.push("..");
          }return c = c.concat(i.slice(a)), c.join("/");
        }, n.sep = "/", n.delimiter = ":", n.dirname = function (e) {
          var t = i(e),
              n = t[0],
              r = t[1];return n || r ? (r && (r = r.substr(0, r.length - 1)), n + r) : ".";
        }, n.basename = function (e, t) {
          var n = i(e)[2];return t && n.substr(-1 * t.length) === t && (n = n.substr(0, n.length - t.length)), n;
        }, n.extname = function (e) {
          return i(e)[3];
        };var s = "b" === "ab".substr(-1) ? function (e, t, n) {
          return e.substr(t, n);
        } : function (e, t, n) {
          return t < 0 && (t = e.length + t), e.substr(t, n);
        };
      }).call(this, e("_process"));
    }, { _process: 66 }], 64: [function (e, t, n) {
      for (var r = e("closest-to"), o = Math.pow(2, 10), i = 13, s = []; i++ < 22;) {
        s.push(Math.pow(2, i));
      }t.exports = function (e) {
        return r(e / o, s);
      };
    }, { "closest-to": 27 }], 65: [function (e, t, n) {
      (function (e) {
        "use strict";
        function n(t, n, r, o) {
          if ("function" != typeof t) throw new TypeError('"callback" argument must be a function');var i,
              s,
              a = arguments.length;switch (a) {case 0:case 1:
              return e.nextTick(t);case 2:
              return e.nextTick(function () {
                t.call(null, n);
              });case 3:
              return e.nextTick(function () {
                t.call(null, n, r);
              });case 4:
              return e.nextTick(function () {
                t.call(null, n, r, o);
              });default:
              for (i = new Array(a - 1), s = 0; s < i.length;) {
                i[s++] = arguments[s];
              }return e.nextTick(function () {
                t.apply(null, i);
              });}
        }!e.version || 0 === e.version.indexOf("v0.") || 0 === e.version.indexOf("v1.") && 0 !== e.version.indexOf("v1.8.") ? t.exports = n : t.exports = e.nextTick;
      }).call(this, e("_process"));
    }, { _process: 66 }], 66: [function (e, t, n) {
      function r() {
        throw new Error("setTimeout has not been defined");
      }function o() {
        throw new Error("clearTimeout has not been defined");
      }function i(e) {
        if (d === setTimeout) return setTimeout(e, 0);if ((d === r || !d) && setTimeout) return d = setTimeout, setTimeout(e, 0);try {
          return d(e, 0);
        } catch (t) {
          try {
            return d.call(null, e, 0);
          } catch (t) {
            return d.call(this, e, 0);
          }
        }
      }function s(e) {
        if (h === clearTimeout) return clearTimeout(e);if ((h === o || !h) && clearTimeout) return h = clearTimeout, clearTimeout(e);try {
          return h(e);
        } catch (t) {
          try {
            return h.call(null, e);
          } catch (t) {
            return h.call(this, e);
          }
        }
      }function a() {
        g && p && (g = !1, p.length ? m = p.concat(m) : y = -1, m.length && u());
      }function u() {
        if (!g) {
          var e = i(a);g = !0;for (var t = m.length; t;) {
            for (p = m, m = []; ++y < t;) {
              p && p[y].run();
            }y = -1, t = m.length;
          }p = null, g = !1, s(e);
        }
      }function c(e, t) {
        this.fun = e, this.array = t;
      }function f() {}var d,
          h,
          l = t.exports = {};!function () {
        try {
          d = "function" == typeof setTimeout ? setTimeout : r;
        } catch (e) {
          d = r;
        }try {
          h = "function" == typeof clearTimeout ? clearTimeout : o;
        } catch (e) {
          h = o;
        }
      }();var p,
          m = [],
          g = !1,
          y = -1;l.nextTick = function (e) {
        var t = new Array(arguments.length - 1);if (arguments.length > 1) for (var n = 1; n < arguments.length; n++) {
          t[n - 1] = arguments[n];
        }m.push(new c(e, t)), 1 !== m.length || g || i(u);
      }, c.prototype.run = function () {
        this.fun.apply(null, this.array);
      }, l.title = "browser", l.browser = !0, l.env = {}, l.argv = [], l.version = "", l.versions = {}, l.on = f, l.addListener = f, l.once = f, l.off = f, l.removeListener = f, l.removeAllListeners = f, l.emit = f, l.binding = function (e) {
        throw new Error("process.binding is not supported");
      }, l.cwd = function () {
        return "/";
      }, l.chdir = function (e) {
        throw new Error("process.chdir is not supported");
      }, l.umask = function () {
        return 0;
      };
    }, {}], 67: [function (e, t, n) {
      var r = e("once"),
          o = e("end-of-stream"),
          i = e("fs"),
          s = function s() {},
          a = function a(e) {
        return "function" == typeof e;
      },
          u = function u(e) {
        return !!i && (e instanceof (i.ReadStream || s) || e instanceof (i.WriteStream || s)) && a(e.close);
      },
          c = function c(e) {
        return e.setHeader && a(e.abort);
      },
          f = function f(e, t, n, i) {
        i = r(i);var s = !1;e.on("close", function () {
          s = !0;
        }), o(e, { readable: t, writable: n }, function (e) {
          if (e) return i(e);s = !0, i();
        });var f = !1;return function (t) {
          if (!s && !f) return f = !0, u(e) ? e.close() : c(e) ? e.abort() : a(e.destroy) ? e.destroy() : void i(t || new Error("stream was destroyed"));
        };
      },
          d = function d(e) {
        e();
      },
          h = function h(e, t) {
        return e.pipe(t);
      },
          l = function l() {
        var e = Array.prototype.slice.call(arguments),
            t = a(e[e.length - 1] || s) && e.pop() || s;if (Array.isArray(e[0]) && (e = e[0]), e.length < 2) throw new Error("pump requires two streams per minimum");var n,
            r = e.map(function (o, i) {
          var s = i < e.length - 1;return f(o, s, i > 0, function (e) {
            n || (n = e), e && r.forEach(d), s || (r.forEach(d), t(n));
          });
        });return e.reduce(h);
      };t.exports = l;
    }, { "end-of-stream": 33, fs: 21, once: 60 }], 68: [function (t, n, r) {
      (function (t) {
        !function (o) {
          function i(e) {
            throw new RangeError(O[e]);
          }function s(e, t) {
            for (var n = e.length, r = []; n--;) {
              r[n] = t(e[n]);
            }return r;
          }function a(e, t) {
            var n = e.split("@"),
                r = "";return n.length > 1 && (r = n[0] + "@", e = n[1]), e = e.replace(R, "."), r + s(e.split("."), t).join(".");
          }function u(e) {
            for (var t, n, r = [], o = 0, i = e.length; o < i;) {
              t = e.charCodeAt(o++), t >= 55296 && t <= 56319 && o < i ? (n = e.charCodeAt(o++), 56320 == (64512 & n) ? r.push(((1023 & t) << 10) + (1023 & n) + 65536) : (r.push(t), o--)) : r.push(t);
            }return r;
          }function c(e) {
            return s(e, function (e) {
              var t = "";return e > 65535 && (e -= 65536, t += j(e >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), t += j(e);
            }).join("");
          }function f(e) {
            return e - 48 < 10 ? e - 22 : e - 65 < 26 ? e - 65 : e - 97 < 26 ? e - 97 : k;
          }function d(e, t) {
            return e + 22 + 75 * (e < 26) - ((0 != t) << 5);
          }function h(e, t, n) {
            var r = 0;for (e = n ? P(e / B) : e >> 1, e += P(e / t); e > M * S >> 1; r += k) {
              e = P(e / M);
            }return P(r + (M + 1) * e / (e + I));
          }function l(e) {
            var t,
                n,
                r,
                o,
                s,
                a,
                u,
                d,
                l,
                p,
                m = [],
                g = e.length,
                y = 0,
                _ = C,
                v = A;for (n = e.lastIndexOf(T), n < 0 && (n = 0), r = 0; r < n; ++r) {
              e.charCodeAt(r) >= 128 && i("not-basic"), m.push(e.charCodeAt(r));
            }for (o = n > 0 ? n + 1 : 0; o < g;) {
              for (s = y, a = 1, u = k; o >= g && i("invalid-input"), d = f(e.charCodeAt(o++)), (d >= k || d > P((E - y) / a)) && i("overflow"), y += d * a, l = u <= v ? x : u >= v + S ? S : u - v, !(d < l); u += k) {
                p = k - l, a > P(E / p) && i("overflow"), a *= p;
              }t = m.length + 1, v = h(y - s, t, 0 == s), P(y / t) > E - _ && i("overflow"), _ += P(y / t), y %= t, m.splice(y++, 0, _);
            }return c(m);
          }function p(e) {
            var t,
                n,
                r,
                o,
                s,
                a,
                c,
                f,
                l,
                p,
                m,
                g,
                y,
                _,
                v,
                b = [];for (e = u(e), g = e.length, t = C, n = 0, s = A, a = 0; a < g; ++a) {
              (m = e[a]) < 128 && b.push(j(m));
            }for (r = o = b.length, o && b.push(T); r < g;) {
              for (c = E, a = 0; a < g; ++a) {
                (m = e[a]) >= t && m < c && (c = m);
              }for (y = r + 1, c - t > P((E - n) / y) && i("overflow"), n += (c - t) * y, t = c, a = 0; a < g; ++a) {
                if (m = e[a], m < t && ++n > E && i("overflow"), m == t) {
                  for (f = n, l = k; p = l <= s ? x : l >= s + S ? S : l - s, !(f < p); l += k) {
                    v = f - p, _ = k - p, b.push(j(d(p + v % _, 0))), f = P(v / _);
                  }b.push(j(d(f, 0))), s = h(n, y, r == o), n = 0, ++r;
                }
              }++n, ++t;
            }return b.join("");
          }function m(e) {
            return a(e, function (e) {
              return L.test(e) ? l(e.slice(4).toLowerCase()) : e;
            });
          }function g(e) {
            return a(e, function (e) {
              return U.test(e) ? "xn--" + p(e) : e;
            });
          }var y = "object" == (typeof r === "undefined" ? "undefined" : _typeof(r)) && r && !r.nodeType && r,
              _ = "object" == (typeof n === "undefined" ? "undefined" : _typeof(n)) && n && !n.nodeType && n,
              v = "object" == (typeof t === "undefined" ? "undefined" : _typeof(t)) && t;v.global !== v && v.window !== v && v.self !== v || (o = v);var b,
              w,
              E = 2147483647,
              k = 36,
              x = 1,
              S = 26,
              I = 38,
              B = 700,
              A = 72,
              C = 128,
              T = "-",
              L = /^xn--/,
              U = /[^\x20-\x7E]/,
              R = /[\x2E\u3002\uFF0E\uFF61]/g,
              O = { overflow: "Overflow: input needs wider integers to process", "not-basic": "Illegal input >= 0x80 (not a basic code point)", "invalid-input": "Invalid input" },
              M = k - x,
              P = Math.floor,
              j = String.fromCharCode;if (b = { version: "1.4.1", ucs2: { decode: u, encode: c }, decode: l, encode: p, toASCII: g, toUnicode: m }, "function" == typeof e && "object" == _typeof(e.amd) && e.amd) e("punycode", function () {
            return b;
          });else if (y && _) {
            if (n.exports == y) _.exports = b;else for (w in b) {
              b.hasOwnProperty(w) && (y[w] = b[w]);
            }
          } else o.punycode = b;
        }(this);
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {}], 69: [function (e, t, n) {
      "use strict";
      function r(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }t.exports = function (e, t, n, i) {
        t = t || "&", n = n || "=";var s = {};if ("string" != typeof e || 0 === e.length) return s;e = e.split(t);var a = 1e3;i && "number" == typeof i.maxKeys && (a = i.maxKeys);var u = e.length;a > 0 && u > a && (u = a);for (var c = 0; c < u; ++c) {
          var f,
              d,
              h,
              l,
              p = e[c].replace(/\+/g, "%20"),
              m = p.indexOf(n);m >= 0 ? (f = p.substr(0, m), d = p.substr(m + 1)) : (f = p, d = ""), h = decodeURIComponent(f), l = decodeURIComponent(d), r(s, h) ? o(s[h]) ? s[h].push(l) : s[h] = [s[h], l] : s[h] = l;
        }return s;
      };var o = Array.isArray || function (e) {
        return "[object Array]" === Object.prototype.toString.call(e);
      };
    }, {}], 70: [function (e, t, n) {
      "use strict";
      function r(e, t) {
        if (e.map) return e.map(t);for (var n = [], r = 0; r < e.length; r++) {
          n.push(t(e[r], r));
        }return n;
      }var o = function o(e) {
        switch (typeof e === "undefined" ? "undefined" : _typeof(e)) {
          case "string":
            return e;case "boolean":
            return e ? "true" : "false";case "number":
            return isFinite(e) ? e : "";default:
            return "";}
      };t.exports = function (e, t, n, a) {
        return t = t || "&", n = n || "=", null === e && (e = void 0), "object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) ? r(s(e), function (s) {
          var a = encodeURIComponent(o(s)) + n;return i(e[s]) ? r(e[s], function (e) {
            return a + encodeURIComponent(o(e));
          }).join(t) : a + encodeURIComponent(o(e[s]));
        }).join(t) : a ? encodeURIComponent(o(a)) + n + encodeURIComponent(o(e)) : "";
      };var i = Array.isArray || function (e) {
        return "[object Array]" === Object.prototype.toString.call(e);
      },
          s = Object.keys || function (e) {
        var t = [];for (var n in e) {
          Object.prototype.hasOwnProperty.call(e, n) && t.push(n);
        }return t;
      };
    }, {}], 71: [function (e, t, n) {
      "use strict";
      n.decode = n.parse = e("./decode"), n.encode = n.stringify = e("./encode");
    }, { "./decode": 69, "./encode": 70 }], 72: [function (e, t, n) {
      var r = function r(e) {
        var t = 0;return function () {
          if (t === e.length) return null;var n = e.length - t,
              r = Math.random() * n | 0,
              o = e[t + r],
              i = e[t];return e[t] = o, e[t + r] = i, t++, o;
        };
      };t.exports = r;
    }, {}], 73: [function (e, t, n) {
      (function (e, n, r) {
        "use strict";
        function o() {
          throw new Error("secure random number generation not supported by this browser\nuse chrome, FireFox or Internet Explorer 11");
        }function i(t, o) {
          if (t > 65536) throw new Error("requested too many random bytes");var i = new n.Uint8Array(t);t > 0 && s.getRandomValues(i);var a = new r(i.buffer);return "function" == typeof o ? e.nextTick(function () {
            o(null, a);
          }) : a;
        }var s = n.crypto || n.msCrypto;s && s.getRandomValues ? t.exports = i : t.exports = o;
      }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("buffer").Buffer);
    }, { _process: 66, buffer: 24 }], 74: [function (e, t, n) {
      function r(e, t) {
        var n = this;if (!(n instanceof r)) return new r(e);i.Writable.call(n, t), n.destroyed = !1, n._queue = [], n._position = e || 0, n._cb = null, n._buffer = null, n._out = null;
      }var o = e("inherits"),
          i = e("readable-stream");t.exports = r, o(r, i.Writable), r.prototype._write = function (e, t, n) {
        for (var r = this, o = !0;;) {
          if (r.destroyed) return;if (0 === r._queue.length) return r._buffer = e, void (r._cb = n);r._buffer = null;var i = r._queue[0],
              s = Math.max(i.start - r._position, 0),
              a = i.end - r._position;if (s >= e.length) return r._position += e.length, n(null);var u;if (a > e.length) {
            r._position += e.length, u = 0 === s ? e : e.slice(s), o = i.stream.write(u) && o;break;
          }r._position += a, u = 0 === s && a === e.length ? e : e.slice(s, a), o = i.stream.write(u) && o, i.last && i.stream.end(), e = e.slice(a), r._queue.shift();
        }o ? n(null) : i.stream.once("drain", n.bind(null, null));
      }, r.prototype.slice = function (e) {
        var t = this;if (t.destroyed) return null;e instanceof Array || (e = [e]);var n = new i.PassThrough();return e.forEach(function (r, o) {
          t._queue.push({ start: r.start, end: r.end, stream: n, last: o === e.length - 1 });
        }), t._buffer && t._write(t._buffer, null, t._cb), n;
      }, r.prototype.destroy = function (e) {
        var t = this;t.destroyed || (t.destroyed = !0, e && t.emit("error", e));
      };
    }, { inherits: 41, "readable-stream": 82 }], 75: [function (e, t, n) {
      "use strict";
      function r(e) {
        if (!(this instanceof r)) return new r(e);c.call(this, e), f.call(this, e), e && !1 === e.readable && (this.readable = !1), e && !1 === e.writable && (this.writable = !1), this.allowHalfOpen = !0, e && !1 === e.allowHalfOpen && (this.allowHalfOpen = !1), this.once("end", o);
      }function o() {
        this.allowHalfOpen || this._writableState.ended || a(i, this);
      }function i(e) {
        e.end();
      }var s = Object.keys || function (e) {
        var t = [];for (var n in e) {
          t.push(n);
        }return t;
      };t.exports = r;var a = e("process-nextick-args"),
          u = e("core-util-is");u.inherits = e("inherits");var c = e("./_stream_readable"),
          f = e("./_stream_writable");u.inherits(r, c);for (var d = s(f.prototype), h = 0; h < d.length; h++) {
        var l = d[h];r.prototype[l] || (r.prototype[l] = f.prototype[l]);
      }
    }, { "./_stream_readable": 77, "./_stream_writable": 79, "core-util-is": 28, inherits: 41, "process-nextick-args": 65 }], 76: [function (e, t, n) {
      "use strict";
      function r(e) {
        if (!(this instanceof r)) return new r(e);o.call(this, e);
      }t.exports = r;var o = e("./_stream_transform"),
          i = e("core-util-is");i.inherits = e("inherits"), i.inherits(r, o), r.prototype._transform = function (e, t, n) {
        n(null, e);
      };
    }, { "./_stream_transform": 78, "core-util-is": 28, inherits: 41 }], 77: [function (e, t, n) {
      (function (n) {
        "use strict";
        function r(e, t, n) {
          if ("function" == typeof e.prependListener) return e.prependListener(t, n);e._events && e._events[t] ? T(e._events[t]) ? e._events[t].unshift(n) : e._events[t] = [n, e._events[t]] : e.on(t, n);
        }function o(t, n) {
          A = A || e("./_stream_duplex"), t = t || {}, this.objectMode = !!t.objectMode, n instanceof A && (this.objectMode = this.objectMode || !!t.readableObjectMode);var r = t.highWaterMark,
              o = this.objectMode ? 16 : 16384;this.highWaterMark = r || 0 === r ? r : o, this.highWaterMark = ~~this.highWaterMark, this.buffer = new N(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.defaultEncoding = t.defaultEncoding || "utf8", this.ranOut = !1, this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, t.encoding && (H || (H = e("string_decoder/").StringDecoder), this.decoder = new H(t.encoding), this.encoding = t.encoding);
        }function i(t) {
          if (A = A || e("./_stream_duplex"), !(this instanceof i)) return new i(t);this._readableState = new o(t, this), this.readable = !0, t && "function" == typeof t.read && (this._read = t.read), U.call(this);
        }function s(e, t, n, r, o) {
          var i = f(t, n);if (i) e.emit("error", i);else if (null === n) t.reading = !1, d(e, t);else if (t.objectMode || n && n.length > 0) {
            if (t.ended && !o) {
              var s = new Error("stream.push() after EOF");e.emit("error", s);
            } else if (t.endEmitted && o) {
              var u = new Error("stream.unshift() after end event");e.emit("error", u);
            } else {
              var c;!t.decoder || o || r || (n = t.decoder.write(n), c = !t.objectMode && 0 === n.length), o || (t.reading = !1), c || (t.flowing && 0 === t.length && !t.sync ? (e.emit("data", n), e.read(0)) : (t.length += t.objectMode ? 1 : n.length, o ? t.buffer.unshift(n) : t.buffer.push(n), t.needReadable && h(e))), p(e, t);
            }
          } else o || (t.reading = !1);return a(t);
        }function a(e) {
          return !e.ended && (e.needReadable || e.length < e.highWaterMark || 0 === e.length);
        }function u(e) {
          return e >= D ? e = D : (e--, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e++), e;
        }function c(e, t) {
          return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : e !== e ? t.flowing && t.length ? t.buffer.head.data.length : t.length : (e > t.highWaterMark && (t.highWaterMark = u(e)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0));
        }function f(e, t) {
          var n = null;return R.isBuffer(t) || "string" == typeof t || null === t || void 0 === t || e.objectMode || (n = new TypeError("Invalid non-string/buffer chunk")), n;
        }function d(e, t) {
          if (!t.ended) {
            if (t.decoder) {
              var n = t.decoder.end();n && n.length && (t.buffer.push(n), t.length += t.objectMode ? 1 : n.length);
            }t.ended = !0, h(e);
          }
        }function h(e) {
          var t = e._readableState;t.needReadable = !1, t.emittedReadable || (j("emitReadable", t.flowing), t.emittedReadable = !0, t.sync ? C(l, e) : l(e));
        }function l(e) {
          j("emit readable"), e.emit("readable"), b(e);
        }function p(e, t) {
          t.readingMore || (t.readingMore = !0, C(m, e, t));
        }function m(e, t) {
          for (var n = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (j("maybeReadMore read 0"), e.read(0), n !== t.length);) {
            n = t.length;
          }t.readingMore = !1;
        }function g(e) {
          return function () {
            var t = e._readableState;j("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, 0 === t.awaitDrain && L(e, "data") && (t.flowing = !0, b(e));
          };
        }function y(e) {
          j("readable nexttick read 0"), e.read(0);
        }function _(e, t) {
          t.resumeScheduled || (t.resumeScheduled = !0, C(v, e, t));
        }function v(e, t) {
          t.reading || (j("resume read 0"), e.read(0)), t.resumeScheduled = !1, t.awaitDrain = 0, e.emit("resume"), b(e), t.flowing && !t.reading && e.read(0);
        }function b(e) {
          var t = e._readableState;for (j("flow", t.flowing); t.flowing && null !== e.read();) {}
        }function w(e, t) {
          if (0 === t.length) return null;var n;return t.objectMode ? n = t.buffer.shift() : !e || e >= t.length ? (n = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.head.data : t.buffer.concat(t.length), t.buffer.clear()) : n = E(e, t.buffer, t.decoder), n;
        }function E(e, t, n) {
          var r;return e < t.head.data.length ? (r = t.head.data.slice(0, e), t.head.data = t.head.data.slice(e)) : r = e === t.head.data.length ? t.shift() : n ? k(e, t) : x(e, t), r;
        }function k(e, t) {
          var n = t.head,
              r = 1,
              o = n.data;for (e -= o.length; n = n.next;) {
            var i = n.data,
                s = e > i.length ? i.length : e;if (s === i.length ? o += i : o += i.slice(0, e), 0 === (e -= s)) {
              s === i.length ? (++r, n.next ? t.head = n.next : t.head = t.tail = null) : (t.head = n, n.data = i.slice(s));break;
            }++r;
          }return t.length -= r, o;
        }function x(e, t) {
          var n = O.allocUnsafe(e),
              r = t.head,
              o = 1;for (r.data.copy(n), e -= r.data.length; r = r.next;) {
            var i = r.data,
                s = e > i.length ? i.length : e;if (i.copy(n, n.length - e, 0, s), 0 === (e -= s)) {
              s === i.length ? (++o, r.next ? t.head = r.next : t.head = t.tail = null) : (t.head = r, r.data = i.slice(s));break;
            }++o;
          }return t.length -= o, n;
        }function S(e) {
          var t = e._readableState;if (t.length > 0) throw new Error('"endReadable()" called on non-empty stream');t.endEmitted || (t.ended = !0, C(I, t, e));
        }function I(e, t) {
          e.endEmitted || 0 !== e.length || (e.endEmitted = !0, t.readable = !1, t.emit("end"));
        }function B(e, t) {
          for (var n = 0, r = e.length; n < r; n++) {
            if (e[n] === t) return n;
          }return -1;
        }t.exports = i;var A,
            C = e("process-nextick-args"),
            T = e("isarray");i.ReadableState = o;var L = (e("events").EventEmitter, function (e, t) {
          return e.listeners(t).length;
        }),
            U = e("./internal/streams/stream"),
            R = e("buffer").Buffer,
            O = e("buffer-shims"),
            M = e("core-util-is");M.inherits = e("inherits");var P = e("util"),
            j = void 0;j = P && P.debuglog ? P.debuglog("stream") : function () {};var H,
            N = e("./internal/streams/BufferList");M.inherits(i, U);var q = ["error", "close", "destroy", "pause", "resume"];i.prototype.push = function (e, t) {
          var n = this._readableState;return n.objectMode || "string" != typeof e || (t = t || n.defaultEncoding) !== n.encoding && (e = O.from(e, t), t = ""), s(this, n, e, t, !1);
        }, i.prototype.unshift = function (e) {
          return s(this, this._readableState, e, "", !0);
        }, i.prototype.isPaused = function () {
          return !1 === this._readableState.flowing;
        }, i.prototype.setEncoding = function (t) {
          return H || (H = e("string_decoder/").StringDecoder), this._readableState.decoder = new H(t), this._readableState.encoding = t, this;
        };var D = 8388608;i.prototype.read = function (e) {
          j("read", e), e = parseInt(e, 10);var t = this._readableState,
              n = e;if (0 !== e && (t.emittedReadable = !1), 0 === e && t.needReadable && (t.length >= t.highWaterMark || t.ended)) return j("read: emitReadable", t.length, t.ended), 0 === t.length && t.ended ? S(this) : h(this), null;if (0 === (e = c(e, t)) && t.ended) return 0 === t.length && S(this), null;var r = t.needReadable;j("need readable", r), (0 === t.length || t.length - e < t.highWaterMark) && (r = !0, j("length less than watermark", r)), t.ended || t.reading ? (r = !1, j("reading or ended", r)) : r && (j("do read"), t.reading = !0, t.sync = !0, 0 === t.length && (t.needReadable = !0), this._read(t.highWaterMark), t.sync = !1, t.reading || (e = c(n, t)));var o;return o = e > 0 ? w(e, t) : null, null === o ? (t.needReadable = !0, e = 0) : t.length -= e, 0 === t.length && (t.ended || (t.needReadable = !0), n !== e && t.ended && S(this)), null !== o && this.emit("data", o), o;
        }, i.prototype._read = function (e) {
          this.emit("error", new Error("_read() is not implemented"));
        }, i.prototype.pipe = function (e, t) {
          function o(e) {
            j("onunpipe"), e === h && s();
          }function i() {
            j("onend"), e.end();
          }function s() {
            j("cleanup"), e.removeListener("close", c), e.removeListener("finish", f), e.removeListener("drain", y), e.removeListener("error", u), e.removeListener("unpipe", o), h.removeListener("end", i), h.removeListener("end", s), h.removeListener("data", a), _ = !0, !l.awaitDrain || e._writableState && !e._writableState.needDrain || y();
          }function a(t) {
            j("ondata"), v = !1, !1 !== e.write(t) || v || ((1 === l.pipesCount && l.pipes === e || l.pipesCount > 1 && -1 !== B(l.pipes, e)) && !_ && (j("false write response, pause", h._readableState.awaitDrain), h._readableState.awaitDrain++, v = !0), h.pause());
          }function u(t) {
            j("onerror", t), d(), e.removeListener("error", u), 0 === L(e, "error") && e.emit("error", t);
          }function c() {
            e.removeListener("finish", f), d();
          }function f() {
            j("onfinish"), e.removeListener("close", c), d();
          }function d() {
            j("unpipe"), h.unpipe(e);
          }var h = this,
              l = this._readableState;switch (l.pipesCount) {case 0:
              l.pipes = e;break;case 1:
              l.pipes = [l.pipes, e];break;default:
              l.pipes.push(e);}l.pipesCount += 1, j("pipe count=%d opts=%j", l.pipesCount, t);var p = (!t || !1 !== t.end) && e !== n.stdout && e !== n.stderr,
              m = p ? i : s;l.endEmitted ? C(m) : h.once("end", m), e.on("unpipe", o);var y = g(h);e.on("drain", y);var _ = !1,
              v = !1;return h.on("data", a), r(e, "error", u), e.once("close", c), e.once("finish", f), e.emit("pipe", h), l.flowing || (j("pipe resume"), h.resume()), e;
        }, i.prototype.unpipe = function (e) {
          var t = this._readableState;if (0 === t.pipesCount) return this;if (1 === t.pipesCount) return e && e !== t.pipes ? this : (e || (e = t.pipes), t.pipes = null, t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this), this);if (!e) {
            var n = t.pipes,
                r = t.pipesCount;t.pipes = null, t.pipesCount = 0, t.flowing = !1;for (var o = 0; o < r; o++) {
              n[o].emit("unpipe", this);
            }return this;
          }var i = B(t.pipes, e);return -1 === i ? this : (t.pipes.splice(i, 1), t.pipesCount -= 1, 1 === t.pipesCount && (t.pipes = t.pipes[0]), e.emit("unpipe", this), this);
        }, i.prototype.on = function (e, t) {
          var n = U.prototype.on.call(this, e, t);if ("data" === e) !1 !== this._readableState.flowing && this.resume();else if ("readable" === e) {
            var r = this._readableState;r.endEmitted || r.readableListening || (r.readableListening = r.needReadable = !0, r.emittedReadable = !1, r.reading ? r.length && h(this) : C(y, this));
          }return n;
        }, i.prototype.addListener = i.prototype.on, i.prototype.resume = function () {
          var e = this._readableState;return e.flowing || (j("resume"), e.flowing = !0, _(this, e)), this;
        }, i.prototype.pause = function () {
          return j("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (j("pause"), this._readableState.flowing = !1, this.emit("pause")), this;
        }, i.prototype.wrap = function (e) {
          var t = this._readableState,
              n = !1,
              r = this;e.on("end", function () {
            if (j("wrapped end"), t.decoder && !t.ended) {
              var e = t.decoder.end();e && e.length && r.push(e);
            }r.push(null);
          }), e.on("data", function (o) {
            if (j("wrapped data"), t.decoder && (o = t.decoder.write(o)), (!t.objectMode || null !== o && void 0 !== o) && (t.objectMode || o && o.length)) {
              r.push(o) || (n = !0, e.pause());
            }
          });for (var o in e) {
            void 0 === this[o] && "function" == typeof e[o] && (this[o] = function (t) {
              return function () {
                return e[t].apply(e, arguments);
              };
            }(o));
          }for (var i = 0; i < q.length; i++) {
            e.on(q[i], r.emit.bind(r, q[i]));
          }return r._read = function (t) {
            j("wrapped _read", t), n && (n = !1, e.resume());
          }, r;
        }, i._fromList = w;
      }).call(this, e("_process"));
    }, { "./_stream_duplex": 75, "./internal/streams/BufferList": 80, "./internal/streams/stream": 81, _process: 66, buffer: 24, "buffer-shims": 23, "core-util-is": 28, events: 34, inherits: 41, isarray: 46, "process-nextick-args": 65, "string_decoder/": 102, util: 21 }], 78: [function (e, t, n) {
      "use strict";
      function r(e) {
        this.afterTransform = function (t, n) {
          return o(e, t, n);
        }, this.needTransform = !1, this.transforming = !1, this.writecb = null, this.writechunk = null, this.writeencoding = null;
      }function o(e, t, n) {
        var r = e._transformState;r.transforming = !1;var o = r.writecb;if (!o) return e.emit("error", new Error("no writecb in Transform class"));r.writechunk = null, r.writecb = null, null !== n && void 0 !== n && e.push(n), o(t);var i = e._readableState;i.reading = !1, (i.needReadable || i.length < i.highWaterMark) && e._read(i.highWaterMark);
      }function i(e) {
        if (!(this instanceof i)) return new i(e);a.call(this, e), this._transformState = new r(this);var t = this;this._readableState.needReadable = !0, this._readableState.sync = !1, e && ("function" == typeof e.transform && (this._transform = e.transform), "function" == typeof e.flush && (this._flush = e.flush)), this.once("prefinish", function () {
          "function" == typeof this._flush ? this._flush(function (e, n) {
            s(t, e, n);
          }) : s(t);
        });
      }function s(e, t, n) {
        if (t) return e.emit("error", t);null !== n && void 0 !== n && e.push(n);var r = e._writableState,
            o = e._transformState;if (r.length) throw new Error("Calling transform done when ws.length != 0");if (o.transforming) throw new Error("Calling transform done when still transforming");return e.push(null);
      }t.exports = i;var a = e("./_stream_duplex"),
          u = e("core-util-is");u.inherits = e("inherits"), u.inherits(i, a), i.prototype.push = function (e, t) {
        return this._transformState.needTransform = !1, a.prototype.push.call(this, e, t);
      }, i.prototype._transform = function (e, t, n) {
        throw new Error("_transform() is not implemented");
      }, i.prototype._write = function (e, t, n) {
        var r = this._transformState;if (r.writecb = n, r.writechunk = e, r.writeencoding = t, !r.transforming) {
          var o = this._readableState;(r.needTransform || o.needReadable || o.length < o.highWaterMark) && this._read(o.highWaterMark);
        }
      }, i.prototype._read = function (e) {
        var t = this._transformState;null !== t.writechunk && t.writecb && !t.transforming ? (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform)) : t.needTransform = !0;
      };
    }, { "./_stream_duplex": 75, "core-util-is": 28, inherits: 41 }], 79: [function (e, t, n) {
      (function (n) {
        "use strict";
        function r() {}function o(e, t, n) {
          this.chunk = e, this.encoding = t, this.callback = n, this.next = null;
        }function i(t, n) {
          k = k || e("./_stream_duplex"), t = t || {}, this.objectMode = !!t.objectMode, n instanceof k && (this.objectMode = this.objectMode || !!t.writableObjectMode);var r = t.highWaterMark,
              o = this.objectMode ? 16 : 16384;this.highWaterMark = r || 0 === r ? r : o, this.highWaterMark = ~~this.highWaterMark, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1;var i = !1 === t.decodeStrings;this.decodeStrings = !i, this.defaultEncoding = t.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function (e) {
            p(n, e);
          }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new E(this);
        }function s(t) {
          if (k = k || e("./_stream_duplex"), !(L.call(s, this) || this instanceof k)) return new s(t);this._writableState = new i(t, this), this.writable = !0, t && ("function" == typeof t.write && (this._write = t.write), "function" == typeof t.writev && (this._writev = t.writev)), A.call(this);
        }function a(e, t) {
          var n = new Error("write after end");e.emit("error", n), x(t, n);
        }function u(e, t, n, r) {
          var o = !0,
              i = !1;return null === n ? i = new TypeError("May not write null values to stream") : "string" == typeof n || void 0 === n || t.objectMode || (i = new TypeError("Invalid non-string/buffer chunk")), i && (e.emit("error", i), x(r, i), o = !1), o;
        }function c(e, t, n) {
          return e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = T.from(t, n)), t;
        }function f(e, t, n, r, i, s) {
          n || (r = c(t, r, i), C.isBuffer(r) && (i = "buffer"));var a = t.objectMode ? 1 : r.length;t.length += a;var u = t.length < t.highWaterMark;if (u || (t.needDrain = !0), t.writing || t.corked) {
            var f = t.lastBufferedRequest;t.lastBufferedRequest = new o(r, i, s), f ? f.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, t.bufferedRequestCount += 1;
          } else d(e, t, !1, a, r, i, s);return u;
        }function d(e, t, n, r, o, i, s) {
          t.writelen = r, t.writecb = s, t.writing = !0, t.sync = !0, n ? e._writev(o, t.onwrite) : e._write(o, i, t.onwrite), t.sync = !1;
        }function h(e, t, n, r, o) {
          --t.pendingcb, n ? x(o, r) : o(r), e._writableState.errorEmitted = !0, e.emit("error", r);
        }function l(e) {
          e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0;
        }function p(e, t) {
          var n = e._writableState,
              r = n.sync,
              o = n.writecb;if (l(n), t) h(e, n, r, t, o);else {
            var i = _(n);i || n.corked || n.bufferProcessing || !n.bufferedRequest || y(e, n), r ? S(m, e, n, i, o) : m(e, n, i, o);
          }
        }function m(e, t, n, r) {
          n || g(e, t), t.pendingcb--, r(), b(e, t);
        }function g(e, t) {
          0 === t.length && t.needDrain && (t.needDrain = !1, e.emit("drain"));
        }function y(e, t) {
          t.bufferProcessing = !0;var n = t.bufferedRequest;if (e._writev && n && n.next) {
            var r = t.bufferedRequestCount,
                o = new Array(r),
                i = t.corkedRequestsFree;i.entry = n;for (var s = 0; n;) {
              o[s] = n, n = n.next, s += 1;
            }d(e, t, !0, t.length, o, "", i.finish), t.pendingcb++, t.lastBufferedRequest = null, i.next ? (t.corkedRequestsFree = i.next, i.next = null) : t.corkedRequestsFree = new E(t);
          } else {
            for (; n;) {
              var a = n.chunk,
                  u = n.encoding,
                  c = n.callback;if (d(e, t, !1, t.objectMode ? 1 : a.length, a, u, c), n = n.next, t.writing) break;
            }null === n && (t.lastBufferedRequest = null);
          }t.bufferedRequestCount = 0, t.bufferedRequest = n, t.bufferProcessing = !1;
        }function _(e) {
          return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing;
        }function v(e, t) {
          t.prefinished || (t.prefinished = !0, e.emit("prefinish"));
        }function b(e, t) {
          var n = _(t);return n && (0 === t.pendingcb ? (v(e, t), t.finished = !0, e.emit("finish")) : v(e, t)), n;
        }function w(e, t, n) {
          t.ending = !0, b(e, t), n && (t.finished ? x(n) : e.once("finish", n)), t.ended = !0, e.writable = !1;
        }function E(e) {
          var t = this;this.next = null, this.entry = null, this.finish = function (n) {
            var r = t.entry;for (t.entry = null; r;) {
              var o = r.callback;e.pendingcb--, o(n), r = r.next;
            }e.corkedRequestsFree ? e.corkedRequestsFree.next = t : e.corkedRequestsFree = t;
          };
        }t.exports = s;var k,
            x = e("process-nextick-args"),
            S = !n.browser && ["v0.10", "v0.9."].indexOf(n.version.slice(0, 5)) > -1 ? setImmediate : x;s.WritableState = i;var I = e("core-util-is");I.inherits = e("inherits");var B = { deprecate: e("util-deprecate") },
            A = e("./internal/streams/stream"),
            C = e("buffer").Buffer,
            T = e("buffer-shims");I.inherits(s, A), i.prototype.getBuffer = function () {
          for (var e = this.bufferedRequest, t = []; e;) {
            t.push(e), e = e.next;
          }return t;
        }, function () {
          try {
            Object.defineProperty(i.prototype, "buffer", { get: B.deprecate(function () {
                return this.getBuffer();
              }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.") });
          } catch (e) {}
        }();var L;"function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance] ? (L = Function.prototype[Symbol.hasInstance], Object.defineProperty(s, Symbol.hasInstance, { value: function value(e) {
            return !!L.call(this, e) || e && e._writableState instanceof i;
          } })) : L = function L(e) {
          return e instanceof this;
        }, s.prototype.pipe = function () {
          this.emit("error", new Error("Cannot pipe, not readable"));
        }, s.prototype.write = function (e, t, n) {
          var o = this._writableState,
              i = !1,
              s = C.isBuffer(e);return "function" == typeof t && (n = t, t = null), s ? t = "buffer" : t || (t = o.defaultEncoding), "function" != typeof n && (n = r), o.ended ? a(this, n) : (s || u(this, o, e, n)) && (o.pendingcb++, i = f(this, o, s, e, t, n)), i;
        }, s.prototype.cork = function () {
          this._writableState.corked++;
        }, s.prototype.uncork = function () {
          var e = this._writableState;e.corked && (e.corked--, e.writing || e.corked || e.finished || e.bufferProcessing || !e.bufferedRequest || y(this, e));
        }, s.prototype.setDefaultEncoding = function (e) {
          if ("string" == typeof e && (e = e.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + e);return this._writableState.defaultEncoding = e, this;
        }, s.prototype._write = function (e, t, n) {
          n(new Error("_write() is not implemented"));
        }, s.prototype._writev = null, s.prototype.end = function (e, t, n) {
          var r = this._writableState;"function" == typeof e ? (n = e, e = null, t = null) : "function" == typeof t && (n = t, t = null), null !== e && void 0 !== e && this.write(e, t), r.corked && (r.corked = 1, this.uncork()), r.ending || r.finished || w(this, r, n);
        };
      }).call(this, e("_process"));
    }, { "./_stream_duplex": 75, "./internal/streams/stream": 81, _process: 66, buffer: 24, "buffer-shims": 23, "core-util-is": 28, inherits: 41, "process-nextick-args": 65, "util-deprecate": 115 }], 80: [function (e, t, n) {
      "use strict";
      function r() {
        this.head = null, this.tail = null, this.length = 0;
      }var o = (e("buffer").Buffer, e("buffer-shims"));t.exports = r, r.prototype.push = function (e) {
        var t = { data: e, next: null };this.length > 0 ? this.tail.next = t : this.head = t, this.tail = t, ++this.length;
      }, r.prototype.unshift = function (e) {
        var t = { data: e, next: this.head };0 === this.length && (this.tail = t), this.head = t, ++this.length;
      }, r.prototype.shift = function () {
        if (0 !== this.length) {
          var e = this.head.data;return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next, --this.length, e;
        }
      }, r.prototype.clear = function () {
        this.head = this.tail = null, this.length = 0;
      }, r.prototype.join = function (e) {
        if (0 === this.length) return "";for (var t = this.head, n = "" + t.data; t = t.next;) {
          n += e + t.data;
        }return n;
      }, r.prototype.concat = function (e) {
        if (0 === this.length) return o.alloc(0);if (1 === this.length) return this.head.data;for (var t = o.allocUnsafe(e >>> 0), n = this.head, r = 0; n;) {
          n.data.copy(t, r), r += n.data.length, n = n.next;
        }return t;
      };
    }, { buffer: 24, "buffer-shims": 23 }], 81: [function (e, t, n) {
      t.exports = e("events").EventEmitter;
    }, { events: 34 }], 82: [function (e, t, n) {
      n = t.exports = e("./lib/_stream_readable.js"), n.Stream = n, n.Readable = n, n.Writable = e("./lib/_stream_writable.js"), n.Duplex = e("./lib/_stream_duplex.js"), n.Transform = e("./lib/_stream_transform.js"), n.PassThrough = e("./lib/_stream_passthrough.js");
    }, { "./lib/_stream_duplex.js": 75, "./lib/_stream_passthrough.js": 76, "./lib/_stream_readable.js": 77, "./lib/_stream_transform.js": 78, "./lib/_stream_writable.js": 79 }], 83: [function (e, t, n) {
      function r(e, t, n, r) {
        "function" == typeof n && (r = n, n = {}), n || (n = {}), r || (r = function r() {}), a(e), c(n), "string" == typeof t && (t = document.querySelector(t)), i(e, function (n) {
          if (t.nodeName !== n.toUpperCase()) {
            var r = l.extname(e.name).toLowerCase();throw new Error('Cannot render "' + r + '" inside a "' + t.nodeName.toLowerCase() + '" element, expected "' + n + '"');
          }return t;
        }, n, r);
      }function o(e, t, n, r) {
        function o(e) {
          return "video" === e || "audio" === e ? s(e) : u(e);
        }function s(e) {
          var r = u(e);return n.controls && (r.controls = !0), n.autoplay && (r.autoplay = !0), t.appendChild(r), r;
        }function u(e) {
          var n = document.createElement(e);return t.appendChild(n), n;
        }function f(e, t) {
          e && t && t.remove(), r(e, t);
        }if ("function" == typeof n && (r = n, n = {}), n || (n = {}), r || (r = function r() {}), a(e), c(n), "string" == typeof t && (t = document.querySelector(t)), t && ("VIDEO" === t.nodeName || "AUDIO" === t.nodeName)) throw new Error("Invalid video/audio node argument. Argument must be root element that video/audio tag will be appended to.");i(e, o, n, f);
      }function i(e, t, n, r) {
        function o() {
          p.removeEventListener("loadstart", o), n.autoplay && p.play();
        }function i() {
          p.removeEventListener("canplay", i), r(null, p);
        }function a() {
          p = t("iframe"), s(e, function (e, t) {
            if (e) return c(e);p.src = t, ".pdf" !== _ && (p.sandbox = "allow-forms allow-scripts"), r(null, p);
          });
        }function c(t) {
          t.message = 'Error rendering file "' + e.name + '": ' + t.message, f(t.message), r(t);
        }var p,
            _ = l.extname(e.name).toLowerCase(),
            k = 0;v.indexOf(_) >= 0 ? function () {
          function r() {
            f("Use MediaSource API for " + e.name), v(), p.addEventListener("error", l), p.addEventListener("loadstart", o), p.addEventListener("canplay", i);var t = new h(p),
                n = t.createWriteStream(u(e.name));e.createReadStream().pipe(n), k && (p.currentTime = k);
          }function a() {
            f("Use Blob URL for " + e.name), v(), p.addEventListener("error", c), p.addEventListener("loadstart", o), p.addEventListener("canplay", i), s(e, function (e, t) {
              if (e) return c(e);p.src = t, k && (p.currentTime = k);
            });
          }function d(e) {
            f("videostream error: fallback to MediaSource API: %o", e.message || e), p.removeEventListener("error", d), p.removeEventListener("canplay", i), r();
          }function l(t) {
            if (f("MediaSource API error: fallback to Blob URL: %o", t.message || t), "number" == typeof e.length && e.length > n.maxBlobLength) return f("File length too large for Blob URL approach: %d (max: %d)", e.length, n.maxBlobLength), c(new Error("File length too large for Blob URL approach: " + e.length + " (max: " + n.maxBlobLength + ")"));p.removeEventListener("error", l), p.removeEventListener("canplay", i), a();
          }function v() {
            p || (p = t(b), p.addEventListener("progress", function () {
              k = p.currentTime;
            }));
          }var b = y.indexOf(_) >= 0 ? "video" : "audio";x ? g.indexOf(_) >= 0 ? function () {
            f("Use `videostream` package for " + e.name), v(), p.addEventListener("error", d), p.addEventListener("loadstart", o), p.addEventListener("canplay", i), m(e, p);
          }() : r() : a();
        }() : b.indexOf(_) >= 0 ? function () {
          p = t("audio"), s(e, function (e, t) {
            if (e) return c(e);p.addEventListener("error", c), p.addEventListener("loadstart", o), p.addEventListener("canplay", i), p.src = t;
          });
        }() : w.indexOf(_) >= 0 ? function () {
          p = t("img"), s(e, function (t, n) {
            if (t) return c(t);p.src = n, p.alt = e.name, r(null, p);
          });
        }() : E.indexOf(_) >= 0 ? a() : function () {
          function t() {
            d(n) ? (f('File extension "%s" appears ascii, so will render.', _), a()) : (f('File extension "%s" appears non-ascii, will not render.', _), r(new Error('Unsupported file type "' + _ + '": Cannot append to DOM')));
          }f('Unknown file extension "%s" - will attempt to render into iframe', _);var n = "";e.createReadStream({ start: 0, end: 1e3 }).setEncoding("utf8").on("data", function (e) {
            n += e;
          }).on("end", t).on("error", r);
        }();
      }function s(e, t) {
        var r = l.extname(e.name).toLowerCase();p(e.createReadStream(), n.mime[r], t);
      }function a(e) {
        if (null == e) throw new Error("file cannot be null or undefined");if ("string" != typeof e.name) throw new Error("missing or invalid file.name property");if ("function" != typeof e.createReadStream) throw new Error("missing or invalid file.createReadStream property");
      }function u(e) {
        return { ".m4a": 'audio/mp4; codecs="mp4a.40.5"', ".m4v": 'video/mp4; codecs="avc1.640029, mp4a.40.5"', ".mkv": 'video/webm; codecs="avc1.640029, mp4a.40.5"', ".mp3": "audio/mpeg", ".mp4": 'video/mp4; codecs="avc1.640029, mp4a.40.5"', ".webm": 'video/webm; codecs="vorbis, vp8"' }[l.extname(e).toLowerCase()];
      }function c(e) {
        null == e.autoplay && (e.autoplay = !0), null == e.controls && (e.controls = !0), null == e.maxBlobLength && (e.maxBlobLength = k);
      }n.render = r, n.append = o, n.mime = e("./lib/mime.json");var f = e("debug")("render-media"),
          d = e("is-ascii"),
          h = e("mediasource"),
          l = e("path"),
          p = e("stream-to-blob-url"),
          m = e("videostream"),
          g = [".m4a", ".m4v", ".mp4"],
          y = [".m4v", ".mkv", ".mp4", ".webm"],
          _ = [".m4a", ".mp3"],
          v = [].concat(y, _),
          b = [".aac", ".oga", ".ogg", ".wav"],
          w = [".bmp", ".gif", ".jpeg", ".jpg", ".png", ".svg"],
          E = [".css", ".html", ".js", ".md", ".pdf", ".txt"],
          k = 2e8,
          x = "undefined" != typeof window && window.MediaSource;
    }, { "./lib/mime.json": 84, debug: 30, "is-ascii": 42, mediasource: 49, path: 63, "stream-to-blob-url": 99, videostream: 117 }], 84: [function (e, t, n) {
      t.exports = { ".3gp": "video/3gpp", ".aac": "audio/aac", ".aif": "audio/x-aiff", ".aiff": "audio/x-aiff", ".atom": "application/atom+xml", ".avi": "video/x-msvideo", ".bmp": "image/bmp", ".bz2": "application/x-bzip2", ".conf": "text/plain", ".css": "text/css", ".csv": "text/plain", ".diff": "text/x-diff", ".doc": "application/msword", ".flv": "video/x-flv", ".gif": "image/gif", ".gz": "application/x-gzip", ".htm": "text/html", ".html": "text/html", ".ico": "image/vnd.microsoft.icon", ".ics": "text/calendar", ".iso": "application/octet-stream", ".jar": "application/java-archive", ".jpeg": "image/jpeg", ".jpg": "image/jpeg", ".js": "application/javascript", ".json": "application/json", ".less": "text/css", ".log": "text/plain", ".m3u": "audio/x-mpegurl", ".m4a": "audio/mp4", ".m4v": "video/mp4", ".manifest": "text/cache-manifest", ".markdown": "text/x-markdown", ".mathml": "application/mathml+xml", ".md": "text/x-markdown", ".mid": "audio/midi", ".midi": "audio/midi", ".mov": "video/quicktime", ".mp3": "audio/mpeg", ".mp4": "video/mp4", ".mp4v": "video/mp4", ".mpeg": "video/mpeg", ".mpg": "video/mpeg", ".odp": "application/vnd.oasis.opendocument.presentation", ".ods": "application/vnd.oasis.opendocument.spreadsheet", ".odt": "application/vnd.oasis.opendocument.text", ".oga": "audio/ogg", ".ogg": "application/ogg", ".pdf": "application/pdf", ".png": "image/png", ".pps": "application/vnd.ms-powerpoint", ".ppt": "application/vnd.ms-powerpoint", ".ps": "application/postscript", ".psd": "image/vnd.adobe.photoshop", ".qt": "video/quicktime", ".rar": "application/x-rar-compressed", ".rdf": "application/rdf+xml", ".rss": "application/rss+xml", ".rtf": "application/rtf", ".svg": "image/svg+xml", ".svgz": "image/svg+xml", ".swf": "application/x-shockwave-flash", ".tar": "application/x-tar", ".tbz": "application/x-bzip-compressed-tar", ".text": "text/plain", ".tif": "image/tiff", ".tiff": "image/tiff", ".torrent": "application/x-bittorrent", ".ttf": "application/x-font-ttf", ".txt": "text/plain", ".wav": "audio/wav", ".webm": "video/webm", ".wma": "audio/x-ms-wma", ".wmv": "video/x-ms-wmv", ".xls": "application/vnd.ms-excel", ".xml": "application/xml", ".yaml": "text/yaml", ".yml": "text/yaml", ".zip": "application/zip" };
    }, {}], 85: [function (e, t, n) {
      (function (e) {
        t.exports = function (t, n, r) {
          function o(t) {
            function n() {
              r && r(t, s), r = null;
            }d ? e.nextTick(n) : n();
          }function i(e, n, r) {
            if (s[e] = r, n && (f = !0), 0 == --u || n) o(n);else if (!f && h < a) {
              var d;c ? (d = c[h], h += 1, t[d](function (e, t) {
                i(d, e, t);
              })) : (d = h, h += 1, t[d](function (e, t) {
                i(d, e, t);
              }));
            }
          }if ("number" != typeof n) throw new Error("second argument must be a Number");var s,
              a,
              u,
              c,
              f,
              d = !0;Array.isArray(t) ? (s = [], u = a = t.length) : (c = Object.keys(t), s = {}, u = a = c.length);var h = n;u ? c ? c.some(function (e, r) {
            if (t[e](function (t, n) {
              i(e, t, n);
            }), r === n - 1) return !0;
          }) : t.some(function (e, t) {
            if (e(function (e, n) {
              i(t, e, n);
            }), t === n - 1) return !0;
          }) : o(null), d = !1;
        };
      }).call(this, e("_process"));
    }, { _process: 66 }], 86: [function (e, t, n) {
      (function (e) {
        t.exports = function (t, n) {
          function r(t) {
            function r() {
              n && n(t, i), n = null;
            }u ? e.nextTick(r) : r();
          }function o(e, t, n) {
            i[e] = n, (0 == --s || t) && r(t);
          }var i,
              s,
              a,
              u = !0;Array.isArray(t) ? (i = [], s = t.length) : (a = Object.keys(t), i = {}, s = a.length), s ? a ? a.forEach(function (e) {
            t[e](function (t, n) {
              o(e, t, n);
            });
          }) : t.forEach(function (e, t) {
            e(function (e, n) {
              o(t, e, n);
            });
          }) : r(null), u = !1;
        };
      }).call(this, e("_process"));
    }, { _process: 66 }], 87: [function (e, t, n) {
      (function (e) {
        !function () {
          function n(e) {
            "use strict";
            for (var t = { fill: 0 }, i = function i(e) {
              for (e += 9; e % 64 > 0; e += 1) {}return e;
            }, s = function s(e, t) {
              var n = new Uint8Array(e.buffer),
                  r = t % 4,
                  o = t - r;switch (r) {case 0:
                  n[o + 3] = 0;case 1:
                  n[o + 2] = 0;case 2:
                  n[o + 1] = 0;case 3:
                  n[o + 0] = 0;}for (var i = 1 + (t >> 2); i < e.length; i++) {
                e[i] = 0;
              }
            }, a = function a(e, t, n) {
              e[t >> 2] |= 128 << 24 - (t % 4 << 3), e[14 + (2 + (t >> 2) & -16)] = n / (1 << 29) | 0, e[15 + (2 + (t >> 2) & -16)] = n << 3;
            }, u = function u(e, t, n, r, o) {
              var i,
                  s = this,
                  a = o % 4,
                  u = (r + a) % 4,
                  c = r - u;switch (a) {case 0:
                  e[o] = s.charCodeAt(n + 3);case 1:
                  e[o + 1 - (a << 1) | 0] = s.charCodeAt(n + 2);case 2:
                  e[o + 2 - (a << 1) | 0] = s.charCodeAt(n + 1);case 3:
                  e[o + 3 - (a << 1) | 0] = s.charCodeAt(n);}if (!(r < u + a)) {
                for (i = 4 - a; i < c; i = i + 4 | 0) {
                  t[o + i >> 2] = s.charCodeAt(n + i) << 24 | s.charCodeAt(n + i + 1) << 16 | s.charCodeAt(n + i + 2) << 8 | s.charCodeAt(n + i + 3);
                }switch (u) {case 3:
                    e[o + c + 1 | 0] = s.charCodeAt(n + c + 2);case 2:
                    e[o + c + 2 | 0] = s.charCodeAt(n + c + 1);case 1:
                    e[o + c + 3 | 0] = s.charCodeAt(n + c);}
              }
            }, c = function c(e, t, n, r, o) {
              var i,
                  s = this,
                  a = o % 4,
                  u = (r + a) % 4,
                  c = r - u;switch (a) {case 0:
                  e[o] = s[n + 3];case 1:
                  e[o + 1 - (a << 1) | 0] = s[n + 2];case 2:
                  e[o + 2 - (a << 1) | 0] = s[n + 1];case 3:
                  e[o + 3 - (a << 1) | 0] = s[n];}if (!(r < u + a)) {
                for (i = 4 - a; i < c; i = i + 4 | 0) {
                  t[o + i >> 2 | 0] = s[n + i] << 24 | s[n + i + 1] << 16 | s[n + i + 2] << 8 | s[n + i + 3];
                }switch (u) {case 3:
                    e[o + c + 1 | 0] = s[n + c + 2];case 2:
                    e[o + c + 2 | 0] = s[n + c + 1];case 1:
                    e[o + c + 3 | 0] = s[n + c];}
              }
            }, f = function f(e, t, n, r, i) {
              var s,
                  a = this,
                  u = i % 4,
                  c = (r + u) % 4,
                  f = r - c,
                  d = new Uint8Array(o.readAsArrayBuffer(a.slice(n, n + r)));switch (u) {case 0:
                  e[i] = d[3];case 1:
                  e[i + 1 - (u << 1) | 0] = d[2];case 2:
                  e[i + 2 - (u << 1) | 0] = d[1];case 3:
                  e[i + 3 - (u << 1) | 0] = d[0];}if (!(r < c + u)) {
                for (s = 4 - u; s < f; s = s + 4 | 0) {
                  t[i + s >> 2 | 0] = d[s] << 24 | d[s + 1] << 16 | d[s + 2] << 8 | d[s + 3];
                }switch (c) {case 3:
                    e[i + f + 1 | 0] = d[f + 2];case 2:
                    e[i + f + 2 | 0] = d[f + 1];case 1:
                    e[i + f + 3 | 0] = d[f];}
              }
            }, d = function d(e) {
              switch (r.getDataType(e)) {case "string":
                  return u.bind(e);case "array":case "buffer":
                  return c.bind(e);case "arraybuffer":
                  return c.bind(new Uint8Array(e));case "view":
                  return c.bind(new Uint8Array(e.buffer, e.byteOffset, e.byteLength));case "blob":
                  return f.bind(e);}
            }, h = new Array(256), l = 0; l < 256; l++) {
              h[l] = (l < 16 ? "0" : "") + l.toString(16);
            }var p = function p(e) {
              for (var t = new Uint8Array(e), n = new Array(e.byteLength), r = 0; r < n.length; r++) {
                n[r] = h[t[r]];
              }return n.join("");
            },
                m = function m(e) {
              var t;if (e <= 65536) return 65536;if (e < 16777216) for (t = 1; t < e; t <<= 1) {} else for (t = 16777216; t < e; t += 16777216) {}return t;
            };!function (e) {
              if (e % 64 > 0) throw new Error("Chunk size must be a multiple of 128 bit");t.offset = 0, t.maxChunkLen = e, t.padMaxChunkLen = i(e), t.heap = new ArrayBuffer(m(t.padMaxChunkLen + 320 + 20)), t.h32 = new Int32Array(t.heap), t.h8 = new Int8Array(t.heap), t.core = new n._core({ Int32Array: Int32Array, DataView: DataView }, {}, t.heap), t.buffer = null;
            }(e || 65536);var g = function g(e, n) {
              t.offset = 0;var r = new Int32Array(e, n + 320, 5);r[0] = 1732584193, r[1] = -271733879, r[2] = -1732584194, r[3] = 271733878, r[4] = -1009589776;
            },
                y = function y(e, n) {
              var r = i(e),
                  o = new Int32Array(t.heap, 0, r >> 2);return s(o, e), a(o, e, n), r;
            },
                _ = function _(e, n, r, o) {
              d(e)(t.h8, t.h32, n, r, o || 0);
            },
                v = function v(e, n, r, o, i) {
              var s = r;_(e, n, r), i && (s = y(r, o)), t.core.hash(s, t.padMaxChunkLen);
            },
                b = function b(e, t) {
              var n = new Int32Array(e, t + 320, 5),
                  r = new Int32Array(5),
                  o = new DataView(r.buffer);return o.setInt32(0, n[0], !1), o.setInt32(4, n[1], !1), o.setInt32(8, n[2], !1), o.setInt32(12, n[3], !1), o.setInt32(16, n[4], !1), r;
            },
                w = this.rawDigest = function (e) {
              var n = e.byteLength || e.length || e.size || 0;g(t.heap, t.padMaxChunkLen);var r = 0,
                  o = t.maxChunkLen;for (r = 0; n > r + o; r += o) {
                v(e, r, o, n, !1);
              }return v(e, r, n - r, n, !0), b(t.heap, t.padMaxChunkLen);
            };this.digest = this.digestFromString = this.digestFromBuffer = this.digestFromArrayBuffer = function (e) {
              return p(w(e).buffer);
            }, this.resetState = function () {
              return g(t.heap, t.padMaxChunkLen), this;
            }, this.append = function (e) {
              var n,
                  r = 0,
                  o = e.byteLength || e.length || e.size || 0,
                  i = t.offset % t.maxChunkLen;for (t.offset += o; r < o;) {
                n = Math.min(o - r, t.maxChunkLen - i), _(e, r, n, i), i += n, r += n, i === t.maxChunkLen && (t.core.hash(t.maxChunkLen, t.padMaxChunkLen), i = 0);
              }return this;
            }, this.getState = function () {
              var e,
                  n = t.offset % t.maxChunkLen;if (n) e = t.heap.slice(0);else {
                var r = new Int32Array(t.heap, t.padMaxChunkLen + 320, 5);e = r.buffer.slice(r.byteOffset, r.byteOffset + r.byteLength);
              }return { offset: t.offset, heap: e };
            }, this.setState = function (e) {
              if (t.offset = e.offset, 20 === e.heap.byteLength) {
                new Int32Array(t.heap, t.padMaxChunkLen + 320, 5).set(new Int32Array(e.heap));
              } else t.h32.set(new Int32Array(e.heap));return this;
            };var E = this.rawEnd = function () {
              var e = t.offset,
                  n = e % t.maxChunkLen,
                  r = y(n, e);t.core.hash(r, t.padMaxChunkLen);var o = b(t.heap, t.padMaxChunkLen);return g(t.heap, t.padMaxChunkLen), o;
            };this.end = function () {
              return p(E().buffer);
            };
          }var r = { getDataType: function getDataType(t) {
              if ("string" == typeof t) return "string";if (t instanceof Array) return "array";if (void 0 !== e && e.Buffer && e.Buffer.isBuffer(t)) return "buffer";if (t instanceof ArrayBuffer) return "arraybuffer";if (t.buffer instanceof ArrayBuffer) return "view";if (t instanceof Blob) return "blob";throw new Error("Unsupported data type.");
            } };if (n._core = function (e, t, n) {
            "use asm";
            var r = new e.Int32Array(n);function o(e, t) {
              e = e | 0;t = t | 0;var n = 0,
                  o = 0,
                  i = 0,
                  s = 0,
                  a = 0,
                  u = 0,
                  c = 0,
                  f = 0,
                  d = 0,
                  h = 0,
                  l = 0,
                  p = 0,
                  m = 0,
                  g = 0;i = r[t + 320 >> 2] | 0;a = r[t + 324 >> 2] | 0;c = r[t + 328 >> 2] | 0;d = r[t + 332 >> 2] | 0;l = r[t + 336 >> 2] | 0;for (n = 0; (n | 0) < (e | 0); n = n + 64 | 0) {
                s = i;u = a;f = c;h = d;p = l;for (o = 0; (o | 0) < 64; o = o + 4 | 0) {
                  g = r[n + o >> 2] | 0;m = ((i << 5 | i >>> 27) + (a & c | ~a & d) | 0) + ((g + l | 0) + 1518500249 | 0) | 0;l = d;d = c;c = a << 30 | a >>> 2;a = i;i = m;r[e + o >> 2] = g;
                }for (o = e + 64 | 0; (o | 0) < (e + 80 | 0); o = o + 4 | 0) {
                  g = (r[o - 12 >> 2] ^ r[o - 32 >> 2] ^ r[o - 56 >> 2] ^ r[o - 64 >> 2]) << 1 | (r[o - 12 >> 2] ^ r[o - 32 >> 2] ^ r[o - 56 >> 2] ^ r[o - 64 >> 2]) >>> 31;m = ((i << 5 | i >>> 27) + (a & c | ~a & d) | 0) + ((g + l | 0) + 1518500249 | 0) | 0;l = d;d = c;c = a << 30 | a >>> 2;a = i;i = m;r[o >> 2] = g;
                }for (o = e + 80 | 0; (o | 0) < (e + 160 | 0); o = o + 4 | 0) {
                  g = (r[o - 12 >> 2] ^ r[o - 32 >> 2] ^ r[o - 56 >> 2] ^ r[o - 64 >> 2]) << 1 | (r[o - 12 >> 2] ^ r[o - 32 >> 2] ^ r[o - 56 >> 2] ^ r[o - 64 >> 2]) >>> 31;m = ((i << 5 | i >>> 27) + (a ^ c ^ d) | 0) + ((g + l | 0) + 1859775393 | 0) | 0;l = d;d = c;c = a << 30 | a >>> 2;a = i;i = m;r[o >> 2] = g;
                }for (o = e + 160 | 0; (o | 0) < (e + 240 | 0); o = o + 4 | 0) {
                  g = (r[o - 12 >> 2] ^ r[o - 32 >> 2] ^ r[o - 56 >> 2] ^ r[o - 64 >> 2]) << 1 | (r[o - 12 >> 2] ^ r[o - 32 >> 2] ^ r[o - 56 >> 2] ^ r[o - 64 >> 2]) >>> 31;m = ((i << 5 | i >>> 27) + (a & c | a & d | c & d) | 0) + ((g + l | 0) - 1894007588 | 0) | 0;l = d;d = c;c = a << 30 | a >>> 2;a = i;i = m;r[o >> 2] = g;
                }for (o = e + 240 | 0; (o | 0) < (e + 320 | 0); o = o + 4 | 0) {
                  g = (r[o - 12 >> 2] ^ r[o - 32 >> 2] ^ r[o - 56 >> 2] ^ r[o - 64 >> 2]) << 1 | (r[o - 12 >> 2] ^ r[o - 32 >> 2] ^ r[o - 56 >> 2] ^ r[o - 64 >> 2]) >>> 31;m = ((i << 5 | i >>> 27) + (a ^ c ^ d) | 0) + ((g + l | 0) - 899497514 | 0) | 0;l = d;d = c;c = a << 30 | a >>> 2;a = i;i = m;r[o >> 2] = g;
                }i = i + s | 0;a = a + u | 0;c = c + f | 0;d = d + h | 0;l = l + p | 0;
              }r[t + 320 >> 2] = i;r[t + 324 >> 2] = a;r[t + 328 >> 2] = c;r[t + 332 >> 2] = d;r[t + 336 >> 2] = l;
            }return { hash: o };
          }, void 0 !== t ? t.exports = n : "undefined" != typeof window && (window.Rusha = n), "undefined" != typeof FileReaderSync) {
            var o = new FileReaderSync(),
                i = new n(4194304);self.onmessage = function (e) {
              var t,
                  n = e.data.data;try {
                t = i.digest(n), self.postMessage({ id: e.data.id, hash: t });
              } catch (t) {
                self.postMessage({ id: e.data.id, error: t.name });
              }
            };
          }
        }();
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {}], 88: [function (e, t, n) {
      t.exports = e("buffer");
    }, { buffer: 24 }], 89: [function (e, t, n) {
      (function (e) {
        t.exports = function (t, n) {
          var r = [];t.on("data", function (e) {
            r.push(e);
          }), t.once("end", function () {
            n && n(null, e.concat(r)), n = null;
          }), t.once("error", function (e) {
            n && n(e), n = null;
          });
        };
      }).call(this, e("buffer").Buffer);
    }, { buffer: 24 }], 90: [function (e, t, n) {
      (function (n) {
        function r(e, t) {
          e = "string" == typeof e ? { url: e } : Object.assign({}, e), t = u(t), e.url && o(e), null == e.headers && (e.headers = {}), null == e.maxRedirects && (e.maxRedirects = 10);var i;e.form && (i = "string" == typeof e.form ? e.form : c.stringify(e.form)), e.body && (i = e.json ? JSON.stringify(e.body) : e.body), e.json && (e.headers.accept = "application/json"), e.json && i && (e.headers["content-type"] = "application/json"), e.form && (e.headers["content-type"] = "application/x-www-form-urlencoded"), i && (e.headers["content-length"] = n.byteLength(i)), delete e.body, delete e.form, i && !e.method && (e.method = "POST"), e.method && (e.method = e.method.toUpperCase()), Object.keys(e.headers).some(function (e) {
            return "accept-encoding" === e.toLowerCase();
          }) || (e.headers["accept-encoding"] = "gzip, deflate");var d = "https:" === e.protocol ? a : s,
              h = d.request(e, function (n) {
            if (n.statusCode >= 300 && n.statusCode < 400 && "location" in n.headers) return e.url = n.headers.location, n.resume(), void (e.maxRedirects > 0 ? (e.maxRedirects -= 1, r(e, t)) : t(new Error("too many redirects")));var o = "function" == typeof f && "HEAD" !== e.method;t(null, o ? f(n) : n);
          });return h.on("timeout", function () {
            h.abort(), t(new Error("Request timed out"));
          }), h.on("error", t), h.end(i), h;
        }function o(e) {
          var t = d.parse(e.url);t.hostname && (e.hostname = t.hostname), t.port && (e.port = t.port), t.protocol && (e.protocol = t.protocol), t.auth && (e.auth = t.auth), e.path = t.path, delete e.url;
        }t.exports = r;var i = e("simple-concat"),
            s = e("http"),
            a = e("https"),
            u = e("once"),
            c = e("querystring"),
            f = e("unzip-response"),
            d = e("url");r.concat = function (e, t) {
          return r(e, function (n, r) {
            if (n) return t(n);i(r, function (n, o) {
              if (n) return t(n);if (e.json) try {
                o = JSON.parse(o.toString());
              } catch (n) {
                return t(n, r, o);
              }t(null, r, o);
            });
          });
        }, ["get", "post", "put", "patch", "head", "delete"].forEach(function (e) {
          r[e] = function (t, n) {
            return "string" == typeof t && (t = { url: t }), t.method = e.toUpperCase(), r(t, n);
          };
        });
      }).call(this, e("buffer").Buffer);
    }, { buffer: 24, http: 95, https: 38, once: 60, querystring: 71, "simple-concat": 89, "unzip-response": 21, url: 112 }], 91: [function (e, t, n) {
      (function (n) {
        function r(e) {
          var t = this;if (!(t instanceof r)) return new r(e);if (t._id = u(4).toString("hex").slice(0, 7), t._debug("new peer %o", e), e = Object.assign({ allowHalfOpen: !1 }, e), c.Duplex.call(t, e), t.channelName = e.initiator ? e.channelName || u(20).toString("hex") : null, t._isChromium = "undefined" != typeof window && !!window.webkitRTCPeerConnection, t.initiator = e.initiator || !1, t.channelConfig = e.channelConfig || r.channelConfig, t.config = e.config || r.config, t.constraints = t._transformConstraints(e.constraints || r.constraints), t.offerConstraints = t._transformConstraints(e.offerConstraints || {}), t.answerConstraints = t._transformConstraints(e.answerConstraints || {}), t.reconnectTimer = e.reconnectTimer || !1, t.sdpTransform = e.sdpTransform || function (e) {
            return e;
          }, t.stream = e.stream || !1, t.trickle = void 0 === e.trickle || e.trickle, t.destroyed = !1, t.connected = !1, t.remoteAddress = void 0, t.remoteFamily = void 0, t.remotePort = void 0, t.localAddress = void 0, t.localPort = void 0, t._wrtc = e.wrtc && "object" == _typeof(e.wrtc) ? e.wrtc : s(), !t._wrtc) throw "undefined" == typeof window ? new Error("No WebRTC support: Specify `opts.wrtc` option in this environment") : new Error("No WebRTC support: Not a supported browser");if (t._pcReady = !1, t._channelReady = !1, t._iceComplete = !1, t._channel = null, t._pendingCandidates = [], t._previousStreams = [], t._chunk = null, t._cb = null, t._interval = null, t._reconnectTimeout = null, t._pc = new t._wrtc.RTCPeerConnection(t.config, t.constraints), t._isWrtc = Array.isArray(t._pc.RTCIceConnectionStates), t._isReactNativeWebrtc = "number" == typeof t._pc._peerConnectionId, t._pc.oniceconnectionstatechange = function () {
            t._onIceStateChange();
          }, t._pc.onicegatheringstatechange = function () {
            t._onIceStateChange();
          }, t._pc.onsignalingstatechange = function () {
            t._onSignalingStateChange();
          }, t._pc.onicecandidate = function (e) {
            t._onIceCandidate(e);
          }, t.initiator) {
            var n = !1;t._pc.onnegotiationneeded = function () {
              n || t._createOffer(), n = !0;
            }, t._setupData({ channel: t._pc.createDataChannel(t.channelName, t.channelConfig) });
          } else t._pc.ondatachannel = function (e) {
            t._setupData(e);
          };"addTrack" in t._pc ? (t.stream && t.stream.getTracks().forEach(function (e) {
            t._pc.addTrack(e, t.stream);
          }), t._pc.ontrack = function (e) {
            t._onTrack(e);
          }) : (t.stream && t._pc.addStream(t.stream), t._pc.onaddstream = function (e) {
            t._onAddStream(e);
          }), t.initiator && t._isWrtc && t._pc.onnegotiationneeded(), t._onFinishBound = function () {
            t._onFinish();
          }, t.once("finish", t._onFinishBound);
        }function o() {}t.exports = r;var i = e("debug")("simple-peer"),
            s = e("get-browser-rtc"),
            a = e("inherits"),
            u = e("randombytes"),
            c = e("readable-stream");a(r, c.Duplex), r.WEBRTC_SUPPORT = !!s(), r.config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:global.stun.twilio.com:3478?transport=udp" }] }, r.constraints = {}, r.channelConfig = {}, Object.defineProperty(r.prototype, "bufferSize", { get: function get() {
            var e = this;return e._channel && e._channel.bufferedAmount || 0;
          } }), r.prototype.address = function () {
          var e = this;return { port: e.localPort, family: "IPv4", address: e.localAddress };
        }, r.prototype.signal = function (e) {
          var t = this;if (t.destroyed) throw new Error("cannot signal after peer is destroyed");if ("string" == typeof e) try {
            e = JSON.parse(e);
          } catch (t) {
            e = {};
          }t._debug("signal()"), e.candidate && (t._pc.remoteDescription ? t._addIceCandidate(e.candidate) : t._pendingCandidates.push(e.candidate)), e.sdp && t._pc.setRemoteDescription(new t._wrtc.RTCSessionDescription(e), function () {
            t.destroyed || (t._pendingCandidates.forEach(function (e) {
              t._addIceCandidate(e);
            }), t._pendingCandidates = [], "offer" === t._pc.remoteDescription.type && t._createAnswer());
          }, function (e) {
            t._destroy(e);
          }), e.sdp || e.candidate || t._destroy(new Error("signal() called with invalid signal data"));
        }, r.prototype._addIceCandidate = function (e) {
          var t = this;try {
            t._pc.addIceCandidate(new t._wrtc.RTCIceCandidate(e), o, function (e) {
              t._destroy(e);
            });
          } catch (e) {
            t._destroy(new Error("error adding candidate: " + e.message));
          }
        }, r.prototype.send = function (e) {
          var t = this;t._isWrtc && n.isBuffer(e) && (e = new Uint8Array(e)), t._channel.send(e);
        }, r.prototype.destroy = function (e) {
          this._destroy(null, e);
        }, r.prototype._destroy = function (e, t) {
          var n = this;if (!n.destroyed) {
            if (t && n.once("close", t), n._debug("destroy (error: %s)", e && (e.message || e)), n.readable = n.writable = !1, n._readableState.ended || n.push(null), n._writableState.finished || n.end(), n.destroyed = !0, n.connected = !1, n._pcReady = !1, n._channelReady = !1, n._previousStreams = null, clearInterval(n._interval), clearTimeout(n._reconnectTimeout), n._interval = null, n._reconnectTimeout = null, n._chunk = null, n._cb = null, n._onFinishBound && n.removeListener("finish", n._onFinishBound), n._onFinishBound = null, n._pc) {
              try {
                n._pc.close();
              } catch (e) {}n._pc.oniceconnectionstatechange = null, n._pc.onicegatheringstatechange = null, n._pc.onsignalingstatechange = null, n._pc.onicecandidate = null, "addTrack" in n._pc ? n._pc.ontrack = null : n._pc.onaddstream = null, n._pc.onnegotiationneeded = null, n._pc.ondatachannel = null;
            }if (n._channel) {
              try {
                n._channel.close();
              } catch (e) {}n._channel.onmessage = null, n._channel.onopen = null, n._channel.onclose = null, n._channel.onerror = null;
            }n._pc = null, n._channel = null, e && n.emit("error", e), n.emit("close");
          }
        }, r.prototype._setupData = function (e) {
          var t = this;if (!e.channel) return t._destroy(new Error("Data channel event is missing `channel` property"));t._channel = e.channel, t._channel.binaryType = "arraybuffer", "number" == typeof t._channel.bufferedAmountLowThreshold && (t._channel.bufferedAmountLowThreshold = 65536), t.channelName = t._channel.label, t._channel.onmessage = function (e) {
            t._onChannelMessage(e);
          }, t._channel.onbufferedamountlow = function () {
            t._onChannelBufferedAmountLow();
          }, t._channel.onopen = function () {
            t._onChannelOpen();
          }, t._channel.onclose = function () {
            t._onChannelClose();
          }, t._channel.onerror = function (e) {
            t._destroy(e);
          };
        }, r.prototype._read = function () {}, r.prototype._write = function (e, t, n) {
          var r = this;if (r.destroyed) return n(new Error("cannot write after peer is destroyed"));if (r.connected) {
            try {
              r.send(e);
            } catch (e) {
              return r._destroy(e);
            }r._channel.bufferedAmount > 65536 ? (r._debug("start backpressure: bufferedAmount %d", r._channel.bufferedAmount), r._cb = n) : n(null);
          } else r._debug("write before connect"), r._chunk = e, r._cb = n;
        }, r.prototype._onFinish = function () {
          function e() {
            setTimeout(function () {
              t._destroy();
            }, 1e3);
          }var t = this;t.destroyed || (t.connected ? e() : t.once("connect", e));
        }, r.prototype._createOffer = function () {
          var e = this;e.destroyed || e._pc.createOffer(function (t) {
            function n() {
              e.destroyed || (e.trickle || e._iceComplete ? o() : e.once("_iceComplete", o));
            }function r(t) {
              e._destroy(t);
            }function o() {
              var n = e._pc.localDescription || t;e._debug("signal"), e.emit("signal", { type: n.type, sdp: n.sdp });
            }e.destroyed || (t.sdp = e.sdpTransform(t.sdp), e._pc.setLocalDescription(t, n, r));
          }, function (t) {
            e._destroy(t);
          }, e.offerConstraints);
        }, r.prototype._createAnswer = function () {
          var e = this;e.destroyed || e._pc.createAnswer(function (t) {
            function n() {
              e.destroyed || (e.trickle || e._iceComplete ? o() : e.once("_iceComplete", o));
            }function r(t) {
              e._destroy(t);
            }function o() {
              var n = e._pc.localDescription || t;e._debug("signal"), e.emit("signal", { type: n.type, sdp: n.sdp });
            }e.destroyed || (t.sdp = e.sdpTransform(t.sdp), e._pc.setLocalDescription(t, n, r));
          }, function (t) {
            e._destroy(t);
          }, e.answerConstraints);
        }, r.prototype._onIceStateChange = function () {
          var e = this;if (!e.destroyed) {
            var t = e._pc.iceConnectionState,
                n = e._pc.iceGatheringState;e._debug("iceStateChange (connection: %s) (gathering: %s)", t, n), e.emit("iceStateChange", t, n), "connected" !== t && "completed" !== t || (clearTimeout(e._reconnectTimeout), e._pcReady = !0, e._maybeReady()), "disconnected" === t && (e.reconnectTimer ? (clearTimeout(e._reconnectTimeout), e._reconnectTimeout = setTimeout(function () {
              e._destroy();
            }, e.reconnectTimer)) : e._destroy()), "failed" === t && e._destroy(new Error("Ice connection failed.")), "closed" === t && e._destroy();
          }
        }, r.prototype.getStats = function (e) {
          var t = this;0 === t._pc.getStats.length ? t._pc.getStats().then(function (t) {
            var n = [];t.forEach(function (e) {
              n.push(e);
            }), e(null, n);
          }, function (t) {
            e(t);
          }) : t._isReactNativeWebrtc ? t._pc.getStats(null, function (t) {
            var n = [];t.forEach(function (e) {
              n.push(e);
            }), e(null, n);
          }, function (t) {
            e(t);
          }) : t._pc.getStats.length > 0 ? t._pc.getStats(function (t) {
            var n = [];t.result().forEach(function (e) {
              var t = {};e.names().forEach(function (n) {
                t[n] = e.stat(n);
              }), t.id = e.id, t.type = e.type, t.timestamp = e.timestamp, n.push(t);
            }), e(null, n);
          }, function (t) {
            e(t);
          }) : e(null, []);
        }, r.prototype._maybeReady = function () {
          var e = this;e._debug("maybeReady pc %s channel %s", e._pcReady, e._channelReady), !e.connected && !e._connecting && e._pcReady && e._channelReady && (e._connecting = !0, e.getStats(function (t, n) {
            function r(t) {
              var n = i[t.localCandidateId];n && n.ip ? (e.localAddress = n.ip, e.localPort = Number(n.port)) : n && n.ipAddress ? (e.localAddress = n.ipAddress, e.localPort = Number(n.portNumber)) : "string" == typeof t.googLocalAddress && (n = t.googLocalAddress.split(":"), e.localAddress = n[0], e.localPort = Number(n[1]));var r = o[t.remoteCandidateId];r && r.ip ? (e.remoteAddress = r.ip, e.remotePort = Number(r.port)) : r && r.ipAddress ? (e.remoteAddress = r.ipAddress, e.remotePort = Number(r.portNumber)) : "string" == typeof t.googRemoteAddress && (r = t.googRemoteAddress.split(":"), e.remoteAddress = r[0], e.remotePort = Number(r[1])), e.remoteFamily = "IPv4", e._debug("connect local: %s:%s remote: %s:%s", e.localAddress, e.localPort, e.remoteAddress, e.remotePort);
            }if (!e.destroyed) {
              t && (n = []), e._connecting = !1, e.connected = !0;var o = {},
                  i = {},
                  s = {};if (n.forEach(function (e) {
                "remotecandidate" !== e.type && "remote-candidate" !== e.type || (o[e.id] = e), "localcandidate" !== e.type && "local-candidate" !== e.type || (i[e.id] = e), "candidatepair" !== e.type && "candidate-pair" !== e.type || (s[e.id] = e);
              }), n.forEach(function (e) {
                "transport" === e.type && r(s[e.selectedCandidatePairId]), ("googCandidatePair" === e.type && "true" === e.googActiveConnection || ("candidatepair" === e.type || "candidate-pair" === e.type) && e.selected) && r(e);
              }), e._chunk) {
                try {
                  e.send(e._chunk);
                } catch (t) {
                  return e._destroy(t);
                }e._chunk = null, e._debug('sent chunk from "write before connect"');var a = e._cb;e._cb = null, a(null);
              }"number" != typeof e._channel.bufferedAmountLowThreshold && (e._interval = setInterval(function () {
                e._onInterval();
              }, 150), e._interval.unref && e._interval.unref()), e._debug("connect"), e.emit("connect");
            }
          }));
        }, r.prototype._onInterval = function () {
          !this._cb || !this._channel || this._channel.bufferedAmount > 65536 || this._onChannelBufferedAmountLow();
        }, r.prototype._onSignalingStateChange = function () {
          var e = this;e.destroyed || (e._debug("signalingStateChange %s", e._pc.signalingState), e.emit("signalingStateChange", e._pc.signalingState));
        }, r.prototype._onIceCandidate = function (e) {
          var t = this;t.destroyed || (e.candidate && t.trickle ? t.emit("signal", { candidate: { candidate: e.candidate.candidate, sdpMLineIndex: e.candidate.sdpMLineIndex, sdpMid: e.candidate.sdpMid } }) : e.candidate || (t._iceComplete = !0, t.emit("_iceComplete")));
        }, r.prototype._onChannelMessage = function (e) {
          var t = this;if (!t.destroyed) {
            var r = e.data;r instanceof ArrayBuffer && (r = n.from(r)), t.push(r);
          }
        }, r.prototype._onChannelBufferedAmountLow = function () {
          var e = this;if (!e.destroyed && e._cb) {
            e._debug("ending backpressure: bufferedAmount %d", e._channel.bufferedAmount);var t = e._cb;e._cb = null, t(null);
          }
        }, r.prototype._onChannelOpen = function () {
          var e = this;e.connected || e.destroyed || (e._debug("on channel open"), e._channelReady = !0, e._maybeReady());
        }, r.prototype._onChannelClose = function () {
          var e = this;e.destroyed || (e._debug("on channel close"), e._destroy());
        }, r.prototype._onAddStream = function (e) {
          var t = this;t.destroyed || (t._debug("on add stream"), t.emit("stream", e.stream));
        }, r.prototype._onTrack = function (e) {
          var t = this;if (!t.destroyed) {
            t._debug("on track");var n = e.streams[0].id;-1 === t._previousStreams.indexOf(n) && (t._previousStreams.push(n), t.emit("stream", e.streams[0]));
          }
        }, r.prototype._debug = function () {
          var e = this,
              t = [].slice.call(arguments);t[0] = "[" + e._id + "] " + t[0], i.apply(null, t);
        }, r.prototype._transformConstraints = function (e) {
          var t = this;if (0 === Object.keys(e).length) return e;if ((e.mandatory || e.optional) && !t._isChromium) {
            var n = Object.assign({}, e.optional, e.mandatory);return void 0 !== n.OfferToReceiveVideo && (n.offerToReceiveVideo = n.OfferToReceiveVideo, delete n.OfferToReceiveVideo), void 0 !== n.OfferToReceiveAudio && (n.offerToReceiveAudio = n.OfferToReceiveAudio, delete n.OfferToReceiveAudio), n;
          }return e.mandatory || e.optional || !t._isChromium ? e : (void 0 !== e.offerToReceiveVideo && (e.OfferToReceiveVideo = e.offerToReceiveVideo, delete e.offerToReceiveVideo), void 0 !== e.offerToReceiveAudio && (e.OfferToReceiveAudio = e.offerToReceiveAudio, delete e.offerToReceiveAudio), { mandatory: e });
        };
      }).call(this, e("buffer").Buffer);
    }, { buffer: 24, debug: 30, "get-browser-rtc": 37, inherits: 41, randombytes: 73, "readable-stream": 82 }], 92: [function (e, t, n) {
      function r(e) {
        return u.digest(e);
      }function o(e, t) {
        if (!d) return void setTimeout(t, 0, r(e));"string" == typeof e && (e = i(e)), d.digest({ name: "sha-1" }, e).then(function (e) {
          t(s(new Uint8Array(e)));
        }, function (n) {
          t(r(e));
        });
      }function i(e) {
        for (var t = e.length, n = new Uint8Array(t), r = 0; r < t; r++) {
          n[r] = e.charCodeAt(r);
        }return n;
      }function s(e) {
        for (var t = e.length, n = [], r = 0; r < t; r++) {
          var o = e[r];n.push((o >>> 4).toString(16)), n.push((15 & o).toString(16));
        }return n.join("");
      }var a = e("rusha"),
          u = new a(),
          c = "undefined" != typeof window ? window : self,
          f = c.crypto || c.msCrypto || {},
          d = f.subtle || f.webkitSubtle;try {
        d.digest({ name: "sha-1" }, new Uint8Array()).catch(function () {
          d = !1;
        });
      } catch (e) {
        d = !1;
      }t.exports = o, t.exports.sync = r;
    }, { rusha: 87 }], 93: [function (e, t, n) {
      (function (n) {
        function r(e) {
          var t = this;if (!(t instanceof r)) return new r(e);if (e || (e = {}), "string" == typeof e && (e = { url: e }), null == e.url && null == e.socket) throw new Error("Missing required `url` or `socket` option");if (null != e.url && null != e.socket) throw new Error("Must specify either `url` or `socket` option, not both");if (t._id = a(4).toString("hex").slice(0, 7), t._debug("new websocket: %o", e), e = Object.assign({ allowHalfOpen: !1 }, e), u.Duplex.call(t, e), t.connected = !1, t.destroyed = !1, t._chunk = null, t._cb = null, t._interval = null, e.socket) t.url = e.socket.url, t._ws = e.socket;else {
            t.url = e.url;try {
              t._ws = "function" == typeof c ? new f(e.url, e) : new f(e.url);
            } catch (e) {
              return void n.nextTick(function () {
                t._destroy(e);
              });
            }
          }t._ws.binaryType = "arraybuffer", t._ws.onopen = function () {
            t._onOpen();
          }, t._ws.onmessage = function (e) {
            t._onMessage(e);
          }, t._ws.onclose = function () {
            t._onClose();
          }, t._ws.onerror = function () {
            t._destroy(new Error("connection error to " + t.url));
          }, t._onFinishBound = function () {
            t._onFinish();
          }, t.once("finish", t._onFinishBound);
        }t.exports = r;var o = e("safe-buffer").Buffer,
            i = e("debug")("simple-websocket"),
            s = e("inherits"),
            a = e("randombytes"),
            u = e("readable-stream"),
            c = e("ws"),
            f = "function" != typeof c ? WebSocket : c;s(r, u.Duplex), r.WEBSOCKET_SUPPORT = !!f, r.prototype.send = function (e) {
          this._ws.send(e);
        }, r.prototype.destroy = function (e) {
          this._destroy(null, e);
        }, r.prototype._destroy = function (e, t) {
          var n = this;if (!n.destroyed) {
            if (t && n.once("close", t), n._debug("destroy (error: %s)", e && (e.message || e)), n.readable = n.writable = !1, n._readableState.ended || n.push(null), n._writableState.finished || n.end(), n.connected = !1, n.destroyed = !0, clearInterval(n._interval), n._interval = null, n._chunk = null, n._cb = null, n._onFinishBound && n.removeListener("finish", n._onFinishBound), n._onFinishBound = null, n._ws) {
              var r = n._ws,
                  o = function o() {
                r.onclose = null;
              };if (r.readyState === f.CLOSED) o();else try {
                r.onclose = o, r.close();
              } catch (e) {
                o();
              }r.onopen = null, r.onmessage = null, r.onerror = null;
            }n._ws = null, e && n.emit("error", e), n.emit("close");
          }
        }, r.prototype._read = function () {}, r.prototype._write = function (e, t, n) {
          if (this.destroyed) return n(new Error("cannot write after socket is destroyed"));if (this.connected) {
            try {
              this.send(e);
            } catch (e) {
              return this._destroy(e);
            }"function" != typeof c && this._ws.bufferedAmount > 65536 ? (this._debug("start backpressure: bufferedAmount %d", this._ws.bufferedAmount), this._cb = n) : n(null);
          } else this._debug("write before connect"), this._chunk = e, this._cb = n;
        }, r.prototype._onFinish = function () {
          function e() {
            setTimeout(function () {
              t._destroy();
            }, 1e3);
          }var t = this;t.destroyed || (t.connected ? e() : t.once("connect", e));
        }, r.prototype._onMessage = function (e) {
          if (!this.destroyed) {
            var t = e.data;t instanceof ArrayBuffer && (t = o.from(t)), this.push(t);
          }
        }, r.prototype._onOpen = function () {
          var e = this;if (!e.connected && !e.destroyed) {
            if (e.connected = !0, e._chunk) {
              try {
                e.send(e._chunk);
              } catch (t) {
                return e._destroy(t);
              }e._chunk = null, e._debug('sent chunk from "write before connect"');var t = e._cb;e._cb = null, t(null);
            }"function" != typeof c && (e._interval = setInterval(function () {
              e._onInterval();
            }, 150), e._interval.unref && e._interval.unref()), e._debug("connect"), e.emit("connect");
          }
        }, r.prototype._onInterval = function () {
          if (this._cb && this._ws && !(this._ws.bufferedAmount > 65536)) {
            this._debug("ending backpressure: bufferedAmount %d", this._ws.bufferedAmount);var e = this._cb;this._cb = null, e(null);
          }
        }, r.prototype._onClose = function () {
          this.destroyed || (this._debug("on close"), this._destroy());
        }, r.prototype._debug = function () {
          var e = [].slice.call(arguments);e[0] = "[" + this._id + "] " + e[0], i.apply(null, e);
        };
      }).call(this, e("_process"));
    }, { _process: 66, debug: 30, inherits: 41, randombytes: 73, "readable-stream": 82, "safe-buffer": 88, ws: 21 }], 94: [function (e, t, n) {
      var r = 1,
          o = function o() {
        r = r + 1 & 65535;
      },
          i = setInterval(o, 250);i.unref && i.unref(), t.exports = function (e) {
        var t = 4 * (e || 5),
            n = [0],
            o = 1,
            i = r - 1 & 65535;return function (e) {
          var s = r - i & 65535;for (s > t && (s = t), i = r; s--;) {
            o === t && (o = 0), n[o] = n[0 === o ? t - 1 : o - 1], o++;
          }e && (n[o - 1] += e);var a = n[o - 1],
              u = n.length < t ? 0 : n[o === t ? 0 : o];return n.length < 4 ? a : 4 * (a - u) / n.length;
        };
      };
    }, {}], 95: [function (e, t, n) {
      (function (t) {
        var r = e("./lib/request"),
            o = e("xtend"),
            i = e("builtin-status-codes"),
            s = e("url"),
            a = n;a.request = function (e, n) {
          e = "string" == typeof e ? s.parse(e) : o(e);var i = -1 === t.location.protocol.search(/^https?:$/) ? "http:" : "",
              a = e.protocol || i,
              u = e.hostname || e.host,
              c = e.port,
              f = e.path || "/";u && -1 !== u.indexOf(":") && (u = "[" + u + "]"), e.url = (u ? a + "//" + u : "") + (c ? ":" + c : "") + f, e.method = (e.method || "GET").toUpperCase(), e.headers = e.headers || {};var d = new r(e);return n && d.on("response", n), d;
        }, a.get = function (e, t) {
          var n = a.request(e, t);return n.end(), n;
        }, a.Agent = function () {}, a.Agent.defaultMaxSockets = 4, a.STATUS_CODES = i, a.METHODS = ["CHECKOUT", "CONNECT", "COPY", "DELETE", "GET", "HEAD", "LOCK", "M-SEARCH", "MERGE", "MKACTIVITY", "MKCOL", "MOVE", "NOTIFY", "OPTIONS", "PATCH", "POST", "PROPFIND", "PROPPATCH", "PURGE", "PUT", "REPORT", "SEARCH", "SUBSCRIBE", "TRACE", "UNLOCK", "UNSUBSCRIBE"];
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, { "./lib/request": 97, "builtin-status-codes": 25, url: 112, xtend: 119 }], 96: [function (e, t, n) {
      (function (e) {
        function t() {
          if (void 0 !== i) return i;if (e.XMLHttpRequest) {
            i = new e.XMLHttpRequest();try {
              i.open("GET", e.XDomainRequest ? "/" : "https://example.com");
            } catch (e) {
              i = null;
            }
          } else i = null;return i;
        }function r(e) {
          var n = t();if (!n) return !1;try {
            return n.responseType = e, n.responseType === e;
          } catch (e) {}return !1;
        }function o(e) {
          return "function" == typeof e;
        }n.fetch = o(e.fetch) && o(e.ReadableStream), n.blobConstructor = !1;try {
          new Blob([new ArrayBuffer(1)]), n.blobConstructor = !0;
        } catch (e) {}var i,
            s = void 0 !== e.ArrayBuffer,
            a = s && o(e.ArrayBuffer.prototype.slice);n.arraybuffer = n.fetch || s && r("arraybuffer"), n.msstream = !n.fetch && a && r("ms-stream"), n.mozchunkedarraybuffer = !n.fetch && s && r("moz-chunked-arraybuffer"), n.overrideMimeType = n.fetch || !!t() && o(t().overrideMimeType), n.vbArray = o(e.VBArray), i = null;
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {}], 97: [function (e, t, n) {
      (function (n, r, o) {
        function i(e, t) {
          return a.fetch && t ? "fetch" : a.mozchunkedarraybuffer ? "moz-chunked-arraybuffer" : a.msstream ? "ms-stream" : a.arraybuffer && e ? "arraybuffer" : a.vbArray && e ? "text:vbarray" : "text";
        }function s(e) {
          try {
            var t = e.status;return null !== t && 0 !== t;
          } catch (e) {
            return !1;
          }
        }var a = e("./capability"),
            u = e("inherits"),
            c = e("./response"),
            f = e("readable-stream"),
            d = e("to-arraybuffer"),
            h = c.IncomingMessage,
            l = c.readyStates,
            p = t.exports = function (e) {
          var t = this;f.Writable.call(t), t._opts = e, t._body = [], t._headers = {}, e.auth && t.setHeader("Authorization", "Basic " + new o(e.auth).toString("base64")), Object.keys(e.headers).forEach(function (n) {
            t.setHeader(n, e.headers[n]);
          });var n,
              r = !0;if ("disable-fetch" === e.mode || "timeout" in e) r = !1, n = !0;else if ("prefer-streaming" === e.mode) n = !1;else if ("allow-wrong-content-type" === e.mode) n = !a.overrideMimeType;else {
            if (e.mode && "default" !== e.mode && "prefer-fast" !== e.mode) throw new Error("Invalid value for opts.mode");n = !0;
          }t._mode = i(n, r), t.on("finish", function () {
            t._onFinish();
          });
        };u(p, f.Writable), p.prototype.setHeader = function (e, t) {
          var n = this,
              r = e.toLowerCase();-1 === m.indexOf(r) && (n._headers[r] = { name: e, value: t });
        }, p.prototype.getHeader = function (e) {
          return this._headers[e.toLowerCase()].value;
        }, p.prototype.removeHeader = function (e) {
          delete this._headers[e.toLowerCase()];
        }, p.prototype._onFinish = function () {
          var e = this;if (!e._destroyed) {
            var t = e._opts,
                i = e._headers,
                s = null;"GET" !== t.method && "HEAD" !== t.method && (s = a.blobConstructor ? new r.Blob(e._body.map(function (e) {
              return d(e);
            }), { type: (i["content-type"] || {}).value || "" }) : o.concat(e._body).toString());var u = [];if (Object.keys(i).forEach(function (e) {
              var t = i[e].name,
                  n = i[e].value;Array.isArray(n) ? n.forEach(function (e) {
                u.push([t, e]);
              }) : u.push([t, n]);
            }), "fetch" === e._mode) r.fetch(e._opts.url, { method: e._opts.method, headers: u, body: s || void 0, mode: "cors", credentials: t.withCredentials ? "include" : "same-origin" }).then(function (t) {
              e._fetchResponse = t, e._connect();
            }, function (t) {
              e.emit("error", t);
            });else {
              var c = e._xhr = new r.XMLHttpRequest();try {
                c.open(e._opts.method, e._opts.url, !0);
              } catch (t) {
                return void n.nextTick(function () {
                  e.emit("error", t);
                });
              }"responseType" in c && (c.responseType = e._mode.split(":")[0]), "withCredentials" in c && (c.withCredentials = !!t.withCredentials), "text" === e._mode && "overrideMimeType" in c && c.overrideMimeType("text/plain; charset=x-user-defined"), "timeout" in t && (c.timeout = t.timeout, c.ontimeout = function () {
                e.emit("timeout");
              }), u.forEach(function (e) {
                c.setRequestHeader(e[0], e[1]);
              }), e._response = null, c.onreadystatechange = function () {
                switch (c.readyState) {case l.LOADING:case l.DONE:
                    e._onXHRProgress();}
              }, "moz-chunked-arraybuffer" === e._mode && (c.onprogress = function () {
                e._onXHRProgress();
              }), c.onerror = function () {
                e._destroyed || e.emit("error", new Error("XHR error"));
              };try {
                c.send(s);
              } catch (t) {
                return void n.nextTick(function () {
                  e.emit("error", t);
                });
              }
            }
          }
        }, p.prototype._onXHRProgress = function () {
          var e = this;s(e._xhr) && !e._destroyed && (e._response || e._connect(), e._response._onXHRProgress());
        }, p.prototype._connect = function () {
          var e = this;e._destroyed || (e._response = new h(e._xhr, e._fetchResponse, e._mode), e._response.on("error", function (t) {
            e.emit("error", t);
          }), e.emit("response", e._response));
        }, p.prototype._write = function (e, t, n) {
          this._body.push(e), n();
        }, p.prototype.abort = p.prototype.destroy = function () {
          var e = this;e._destroyed = !0, e._response && (e._response._destroyed = !0), e._xhr && e._xhr.abort();
        }, p.prototype.end = function (e, t, n) {
          var r = this;"function" == typeof e && (n = e, e = void 0), f.Writable.prototype.end.call(r, e, t, n);
        }, p.prototype.flushHeaders = function () {}, p.prototype.setTimeout = function () {}, p.prototype.setNoDelay = function () {}, p.prototype.setSocketKeepAlive = function () {};var m = ["accept-charset", "accept-encoding", "access-control-request-headers", "access-control-request-method", "connection", "content-length", "cookie", "cookie2", "date", "dnt", "expect", "host", "keep-alive", "origin", "referer", "te", "trailer", "transfer-encoding", "upgrade", "user-agent", "via"];
      }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("buffer").Buffer);
    }, { "./capability": 96, "./response": 98, _process: 66, buffer: 24, inherits: 41, "readable-stream": 82, "to-arraybuffer": 105 }], 98: [function (e, t, n) {
      (function (t, r, o) {
        var i = e("./capability"),
            s = e("inherits"),
            a = e("readable-stream"),
            u = n.readyStates = { UNSENT: 0, OPENED: 1,
          HEADERS_RECEIVED: 2, LOADING: 3, DONE: 4 },
            c = n.IncomingMessage = function (e, n, r) {
          function s() {
            c.read().then(function (e) {
              if (!u._destroyed) {
                if (e.done) return void u.push(null);u.push(new o(e.value)), s();
              }
            }).catch(function (e) {
              u.emit("error", e);
            });
          }var u = this;if (a.Readable.call(u), u._mode = r, u.headers = {}, u.rawHeaders = [], u.trailers = {}, u.rawTrailers = [], u.on("end", function () {
            t.nextTick(function () {
              u.emit("close");
            });
          }), "fetch" === r) {
            u._fetchResponse = n, u.url = n.url, u.statusCode = n.status, u.statusMessage = n.statusText, n.headers.forEach(function (e, t) {
              u.headers[t.toLowerCase()] = e, u.rawHeaders.push(t, e);
            });var c = n.body.getReader();s();
          } else {
            u._xhr = e, u._pos = 0, u.url = e.responseURL, u.statusCode = e.status, u.statusMessage = e.statusText;if (e.getAllResponseHeaders().split(/\r?\n/).forEach(function (e) {
              var t = e.match(/^([^:]+):\s*(.*)/);if (t) {
                var n = t[1].toLowerCase();"set-cookie" === n ? (void 0 === u.headers[n] && (u.headers[n] = []), u.headers[n].push(t[2])) : void 0 !== u.headers[n] ? u.headers[n] += ", " + t[2] : u.headers[n] = t[2], u.rawHeaders.push(t[1], t[2]);
              }
            }), u._charset = "x-user-defined", !i.overrideMimeType) {
              var f = u.rawHeaders["mime-type"];if (f) {
                var d = f.match(/;\s*charset=([^;])(;|$)/);d && (u._charset = d[1].toLowerCase());
              }u._charset || (u._charset = "utf-8");
            }
          }
        };s(c, a.Readable), c.prototype._read = function () {}, c.prototype._onXHRProgress = function () {
          var e = this,
              t = e._xhr,
              n = null;switch (e._mode) {case "text:vbarray":
              if (t.readyState !== u.DONE) break;try {
                n = new r.VBArray(t.responseBody).toArray();
              } catch (e) {}if (null !== n) {
                e.push(new o(n));break;
              }case "text":
              try {
                n = t.responseText;
              } catch (t) {
                e._mode = "text:vbarray";break;
              }if (n.length > e._pos) {
                var i = n.substr(e._pos);if ("x-user-defined" === e._charset) {
                  for (var s = new o(i.length), a = 0; a < i.length; a++) {
                    s[a] = 255 & i.charCodeAt(a);
                  }e.push(s);
                } else e.push(i, e._charset);e._pos = n.length;
              }break;case "arraybuffer":
              if (t.readyState !== u.DONE || !t.response) break;n = t.response, e.push(new o(new Uint8Array(n)));break;case "moz-chunked-arraybuffer":
              if (n = t.response, t.readyState !== u.LOADING || !n) break;e.push(new o(new Uint8Array(n)));break;case "ms-stream":
              if (n = t.response, t.readyState !== u.LOADING) break;var c = new r.MSStreamReader();c.onprogress = function () {
                c.result.byteLength > e._pos && (e.push(new o(new Uint8Array(c.result.slice(e._pos)))), e._pos = c.result.byteLength);
              }, c.onload = function () {
                e.push(null);
              }, c.readAsArrayBuffer(n);}e._xhr.readyState === u.DONE && "ms-stream" !== e._mode && e.push(null);
        };
      }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("buffer").Buffer);
    }, { "./capability": 96, _process: 66, buffer: 24, inherits: 41, "readable-stream": 82 }], 99: [function (e, t, n) {
      var r = e("stream-to-blob");t.exports = function e(t, n, o) {
        if ("function" == typeof n) return e(t, null, n);r(t, n, function (e, t) {
          if (e) return o(e);var n = URL.createObjectURL(t);o(null, n);
        });
      };
    }, { "stream-to-blob": 100 }], 100: [function (e, t, n) {
      var r = e("once");t.exports = function e(t, n, o) {
        if ("function" == typeof n) return e(t, null, n);o = r(o);var i = [];t.on("data", function (e) {
          i.push(e);
        }).on("end", function () {
          var e = n ? new Blob(i, { type: n }) : new Blob(i);o(null, e);
        }).on("error", o);
      };
    }, { once: 60 }], 101: [function (e, t, n) {
      (function (n) {
        var r = e("once");t.exports = function (e, t, o) {
          o = r(o);var i = new n(t),
              s = 0;e.on("data", function (e) {
            e.copy(i, s), s += e.length;
          }).on("end", function () {
            o(null, i);
          }).on("error", o);
        };
      }).call(this, e("buffer").Buffer);
    }, { buffer: 24, once: 60 }], 102: [function (e, t, n) {
      "use strict";
      function r(e) {
        if (!e) return "utf8";for (var t;;) {
          switch (e) {case "utf8":case "utf-8":
              return "utf8";case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":
              return "utf16le";case "latin1":case "binary":
              return "latin1";case "base64":case "ascii":case "hex":
              return e;default:
              if (t) return;e = ("" + e).toLowerCase(), t = !0;}
        }
      }function o(e) {
        var t = r(e);if ("string" != typeof t && (_.isEncoding === b || !b(e))) throw new Error("Unknown encoding: " + e);return t || e;
      }function i(e) {
        this.encoding = o(e);var t;switch (this.encoding) {case "utf16le":
            this.text = h, this.end = l, t = 4;break;case "utf8":
            this.fillLast = c, t = 4;break;case "base64":
            this.text = p, this.end = m, t = 3;break;default:
            return this.write = g, void (this.end = y);}this.lastNeed = 0, this.lastTotal = 0, this.lastChar = v.allocUnsafe(t);
      }function s(e) {
        return e <= 127 ? 0 : e >> 5 == 6 ? 2 : e >> 4 == 14 ? 3 : e >> 3 == 30 ? 4 : -1;
      }function a(e, t, n) {
        var r = t.length - 1;if (r < n) return 0;var o = s(t[r]);return o >= 0 ? (o > 0 && (e.lastNeed = o - 1), o) : --r < n ? 0 : (o = s(t[r])) >= 0 ? (o > 0 && (e.lastNeed = o - 2), o) : --r < n ? 0 : (o = s(t[r]), o >= 0 ? (o > 0 && (2 === o ? o = 0 : e.lastNeed = o - 3), o) : 0);
      }function u(e, t, n) {
        if (128 != (192 & t[0])) return e.lastNeed = 0, "�".repeat(n);if (e.lastNeed > 1 && t.length > 1) {
          if (128 != (192 & t[1])) return e.lastNeed = 1, "�".repeat(n + 1);if (e.lastNeed > 2 && t.length > 2 && 128 != (192 & t[2])) return e.lastNeed = 2, "�".repeat(n + 2);
        }
      }function c(e) {
        var t = this.lastTotal - this.lastNeed,
            n = u(this, e, t);return void 0 !== n ? n : this.lastNeed <= e.length ? (e.copy(this.lastChar, t, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal)) : (e.copy(this.lastChar, t, 0, e.length), void (this.lastNeed -= e.length));
      }function f(e, t) {
        var n = a(this, e, t);if (!this.lastNeed) return e.toString("utf8", t);this.lastTotal = n;var r = e.length - (n - this.lastNeed);return e.copy(this.lastChar, 0, r), e.toString("utf8", t, r);
      }function d(e) {
        var t = e && e.length ? this.write(e) : "";return this.lastNeed ? t + "�".repeat(this.lastTotal - this.lastNeed) : t;
      }function h(e, t) {
        if ((e.length - t) % 2 == 0) {
          var n = e.toString("utf16le", t);if (n) {
            var r = n.charCodeAt(n.length - 1);if (r >= 55296 && r <= 56319) return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = e[e.length - 2], this.lastChar[1] = e[e.length - 1], n.slice(0, -1);
          }return n;
        }return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = e[e.length - 1], e.toString("utf16le", t, e.length - 1);
      }function l(e) {
        var t = e && e.length ? this.write(e) : "";if (this.lastNeed) {
          var n = this.lastTotal - this.lastNeed;return t + this.lastChar.toString("utf16le", 0, n);
        }return t;
      }function p(e, t) {
        var n = (e.length - t) % 3;return 0 === n ? e.toString("base64", t) : (this.lastNeed = 3 - n, this.lastTotal = 3, 1 === n ? this.lastChar[0] = e[e.length - 1] : (this.lastChar[0] = e[e.length - 2], this.lastChar[1] = e[e.length - 1]), e.toString("base64", t, e.length - n));
      }function m(e) {
        var t = e && e.length ? this.write(e) : "";return this.lastNeed ? t + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : t;
      }function g(e) {
        return e.toString(this.encoding);
      }function y(e) {
        return e && e.length ? this.write(e) : "";
      }var _ = e("buffer").Buffer,
          v = e("buffer-shims"),
          b = _.isEncoding || function (e) {
        switch ((e = "" + e) && e.toLowerCase()) {case "hex":case "utf8":case "utf-8":case "ascii":case "binary":case "base64":case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":case "raw":
            return !0;default:
            return !1;}
      };n.StringDecoder = i, i.prototype.write = function (e) {
        if (0 === e.length) return "";var t, n;if (this.lastNeed) {
          if (void 0 === (t = this.fillLast(e))) return "";n = this.lastNeed, this.lastNeed = 0;
        } else n = 0;return n < e.length ? t ? t + this.text(e, n) : this.text(e, n) : t || "";
      }, i.prototype.end = d, i.prototype.text = f, i.prototype.fillLast = function (e) {
        if (this.lastNeed <= e.length) return e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length), this.lastNeed -= e.length;
      };
    }, { buffer: 24, "buffer-shims": 23 }], 103: [function (e, t, n) {
      var r = e("./thirty-two");n.encode = r.encode, n.decode = r.decode;
    }, { "./thirty-two": 104 }], 104: [function (e, t, n) {
      (function (e) {
        "use strict";
        function t(e) {
          var t = Math.floor(e.length / 5);return e.length % 5 == 0 ? t : t + 1;
        }var r = [255, 255, 26, 27, 28, 29, 30, 31, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 255, 255, 255, 255, 255, 255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 255, 255, 255, 255, 255];n.encode = function (n) {
          e.isBuffer(n) || (n = new e(n));for (var r = 0, o = 0, i = 0, s = 0, a = new e(8 * t(n)); r < n.length;) {
            var u = n[r];i > 3 ? (s = u & 255 >> i, i = (i + 5) % 8, s = s << i | (r + 1 < n.length ? n[r + 1] : 0) >> 8 - i, r++) : (s = u >> 8 - (i + 5) & 31, 0 == (i = (i + 5) % 8) && r++), a[o] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567".charCodeAt(s), o++;
          }for (r = o; r < a.length; r++) {
            a[r] = 61;
          }return a;
        }, n.decode = function (t) {
          var n,
              o = 0,
              i = 0,
              s = 0;e.isBuffer(t) || (t = new e(t));for (var a = new e(Math.ceil(5 * t.length / 8)), u = 0; u < t.length && 61 !== t[u]; u++) {
            var c = t[u] - 48;if (!(c < r.length)) throw new Error("Invalid input - it is not base32 encoded string");i = r[c], o <= 3 ? (o = (o + 5) % 8, 0 === o ? (n |= i, a[s] = n, s++, n = 0) : n |= 255 & i << 8 - o) : (o = (o + 5) % 8, n |= 255 & i >>> o, a[s] = n, s++, n = 255 & i << 8 - o);
          }return a.slice(0, s);
        };
      }).call(this, e("buffer").Buffer);
    }, { buffer: 24 }], 105: [function (e, t, n) {
      var r = e("buffer").Buffer;t.exports = function (e) {
        if (e instanceof Uint8Array) {
          if (0 === e.byteOffset && e.byteLength === e.buffer.byteLength) return e.buffer;if ("function" == typeof e.buffer.slice) return e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength);
        }if (r.isBuffer(e)) {
          for (var t = new Uint8Array(e.length), n = e.length, o = 0; o < n; o++) {
            t[o] = e[o];
          }return t.buffer;
        }throw new Error("Argument must be a Buffer");
      };
    }, { buffer: 24 }], 106: [function (e, t, n) {
      (function (n) {
        function r(e) {
          function t(e, t) {
            var n = new i(t);return n.on("warning", o._onWarning), n.on("error", o._onError), n.listen(e), o._internalDHT = !0, n;
          }var o = this;if (!(o instanceof r)) return new r(e);if (s.call(o), !e.peerId) throw new Error("Option `peerId` is required");if (!e.infoHash) throw new Error("Option `infoHash` is required");if (!n.browser && !e.port) throw new Error("Option `port` is required");o.peerId = "string" == typeof e.peerId ? e.peerId : e.peerId.toString("hex"), o.infoHash = "string" == typeof e.infoHash ? e.infoHash : e.infoHash.toString("hex"), o._port = e.port, o._userAgent = e.userAgent, o.destroyed = !1, o._announce = e.announce || [], o._intervalMs = e.intervalMs || 9e5, o._trackerOpts = null, o._dhtAnnouncing = !1, o._dhtTimeout = !1, o._internalDHT = !1, o._onWarning = function (e) {
            o.emit("warning", e);
          }, o._onError = function (e) {
            o.emit("error", e);
          }, o._onDHTPeer = function (e, t) {
            t.toString("hex") === o.infoHash && o.emit("peer", e.host + ":" + e.port, "dht");
          }, o._onTrackerPeer = function (e) {
            o.emit("peer", e, "tracker");
          }, o._onTrackerAnnounce = function () {
            o.emit("trackerAnnounce");
          }, !1 === e.tracker ? o.tracker = null : e.tracker && "object" == _typeof(e.tracker) ? (o._trackerOpts = a(e.tracker), o.tracker = o._createTracker()) : o.tracker = o._createTracker(), !1 === e.dht || "function" != typeof i ? o.dht = null : e.dht && "function" == typeof e.dht.addNode ? o.dht = e.dht : e.dht && "object" == _typeof(e.dht) ? o.dht = t(e.dhtPort, e.dht) : o.dht = t(e.dhtPort), o.dht && (o.dht.on("peer", o._onDHTPeer), o._dhtAnnounce());
        }t.exports = r;var o = e("debug")("torrent-discovery"),
            i = e("bittorrent-dht/client"),
            s = e("events").EventEmitter,
            a = e("xtend"),
            u = e("inherits"),
            c = e("run-parallel"),
            f = e("bittorrent-tracker/client");u(r, s), r.prototype.updatePort = function (e) {
          var t = this;e !== t._port && (t._port = e, t.dht && t._dhtAnnounce(), t.tracker && (t.tracker.stop(), t.tracker.destroy(function () {
            t.tracker = t._createTracker();
          })));
        }, r.prototype.complete = function (e) {
          this.tracker && this.tracker.complete(e);
        }, r.prototype.destroy = function (e) {
          var t = this;if (!t.destroyed) {
            t.destroyed = !0, clearTimeout(t._dhtTimeout);var n = [];t.tracker && (t.tracker.stop(), t.tracker.removeListener("warning", t._onWarning), t.tracker.removeListener("error", t._onError), t.tracker.removeListener("peer", t._onTrackerPeer), t.tracker.removeListener("update", t._onTrackerAnnounce), n.push(function (e) {
              t.tracker.destroy(e);
            })), t.dht && t.dht.removeListener("peer", t._onDHTPeer), t._internalDHT && (t.dht.removeListener("warning", t._onWarning), t.dht.removeListener("error", t._onError), n.push(function (e) {
              t.dht.destroy(e);
            })), c(n, e), t.dht = null, t.tracker = null, t._announce = null;
          }
        }, r.prototype._createTracker = function () {
          var e = a(this._trackerOpts, { infoHash: this.infoHash, announce: this._announce, peerId: this.peerId, port: this._port, userAgent: this._userAgent }),
              t = new f(e);return t.on("warning", this._onWarning), t.on("error", this._onError), t.on("peer", this._onTrackerPeer), t.on("update", this._onTrackerAnnounce), t.setInterval(this._intervalMs), t.start(), t;
        }, r.prototype._dhtAnnounce = function () {
          function e() {
            return t._intervalMs + Math.floor(Math.random() * t._intervalMs / 5);
          }var t = this;t._dhtAnnouncing || (o("dht announce"), t._dhtAnnouncing = !0, clearTimeout(t._dhtTimeout), t.dht.announce(t.infoHash, t._port, function (n) {
            t._dhtAnnouncing = !1, o("dht announce complete"), n && t.emit("warning", n), t.emit("dhtAnnounce"), t.destroyed || (t._dhtTimeout = setTimeout(function () {
              t._dhtAnnounce();
            }, e()), t._dhtTimeout.unref && t._dhtTimeout.unref());
          }));
        };
      }).call(this, e("_process"));
    }, { _process: 66, "bittorrent-dht/client": 21, "bittorrent-tracker/client": 15, debug: 30, events: 34, inherits: 41, "run-parallel": 86, xtend: 119 }], 107: [function (e, t, n) {
      (function (e) {
        function n(e) {
          if (!(this instanceof n)) return new n(e);this.length = e, this.missing = e, this.sources = null, this._chunks = Math.ceil(e / r), this._remainder = e % r || r, this._buffered = 0, this._buffer = null, this._cancellations = null, this._reservations = 0, this._flushed = !1;
        }t.exports = n;var r = 16384;n.BLOCK_LENGTH = r, n.prototype.chunkLength = function (e) {
          return e === this._chunks - 1 ? this._remainder : r;
        }, n.prototype.chunkLengthRemaining = function (e) {
          return this.length - e * r;
        }, n.prototype.chunkOffset = function (e) {
          return e * r;
        }, n.prototype.reserve = function () {
          return this.init() ? this._cancellations.length ? this._cancellations.pop() : this._reservations < this._chunks ? this._reservations++ : -1 : -1;
        }, n.prototype.reserveRemaining = function () {
          if (!this.init()) return -1;if (this._reservations < this._chunks) {
            var e = this._reservations;return this._reservations = this._chunks, e;
          }return -1;
        }, n.prototype.cancel = function (e) {
          this.init() && this._cancellations.push(e);
        }, n.prototype.cancelRemaining = function (e) {
          this.init() && (this._reservations = e);
        }, n.prototype.get = function (e) {
          return this.init() ? this._buffer[e] : null;
        }, n.prototype.set = function (e, t, n) {
          if (!this.init()) return !1;for (var o = t.length, i = Math.ceil(o / r), s = 0; s < i; s++) {
            if (!this._buffer[e + s]) {
              var a = s * r,
                  u = t.slice(a, a + r);this._buffered++, this._buffer[e + s] = u, this.missing -= u.length, -1 === this.sources.indexOf(n) && this.sources.push(n);
            }
          }return this._buffered === this._chunks;
        }, n.prototype.flush = function () {
          if (!this._buffer || this._chunks !== this._buffered) return null;var t = e.concat(this._buffer, this.length);return this._buffer = null, this._cancellations = null, this.sources = null, this._flushed = !0, t;
        }, n.prototype.init = function () {
          return !this._flushed && (!!this._buffer || (this._buffer = new Array(this._chunks), this._cancellations = [], this.sources = [], !0));
        };
      }).call(this, e("buffer").Buffer);
    }, { buffer: 24 }], 108: [function (e, t, n) {
      (function (n) {
        var r = e("is-typedarray").strict;t.exports = function (e) {
          if (r(e)) {
            var t = new n(e.buffer);return e.byteLength !== e.buffer.byteLength && (t = t.slice(e.byteOffset, e.byteOffset + e.byteLength)), t;
          }return new n(e);
        };
      }).call(this, e("buffer").Buffer);
    }, { buffer: 24, "is-typedarray": 45 }], 109: [function (e, t, n) {
      (function (e) {
        n.encodingLength = function () {
          return 8;
        }, n.encode = function (t, n, r) {
          n || (n = new e(8)), r || (r = 0);var o = Math.floor(t / 4294967295),
              i = t - 4294967295 * o;return n.writeUInt32BE(o, r), n.writeUInt32BE(i, r + 4), n;
        }, n.decode = function (t, n) {
          return n || (n = 0), t || (t = new e(4)), n || (n = 0), 4294967295 * t.readUInt32BE(n) + t.readUInt32BE(n + 4);
        }, n.encode.bytes = 8, n.decode.bytes = 8;
      }).call(this, e("buffer").Buffer);
    }, { buffer: 24 }], 110: [function (e, t, n) {
      "use strict";
      function r(e, t) {
        for (var n = 1, r = e.length, o = e[0], i = e[0], s = 1; s < r; ++s) {
          if (i = o, o = e[s], t(o, i)) {
            if (s === n) {
              n++;continue;
            }e[n++] = o;
          }
        }return e.length = n, e;
      }function o(e) {
        for (var t = 1, n = e.length, r = e[0], o = e[0], i = 1; i < n; ++i, o = r) {
          if (o = r, (r = e[i]) !== o) {
            if (i === t) {
              t++;continue;
            }e[t++] = r;
          }
        }return e.length = t, e;
      }function i(e, t, n) {
        return 0 === e.length ? e : t ? (n || e.sort(t), r(e, t)) : (n || e.sort(), o(e));
      }t.exports = i;
    }, {}], 111: [function (e, t, n) {
      function r(e, t) {
        if (!(t >= e.length || t < 0)) {
          var n = e.pop();if (t < e.length) {
            var r = e[t];return e[t] = n, r;
          }return n;
        }
      }t.exports = r;
    }, {}], 112: [function (e, t, n) {
      "use strict";
      function r() {
        this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, this.path = null, this.href = null;
      }function o(e, t, n) {
        if (e && c.isObject(e) && e instanceof r) return e;var o = new r();return o.parse(e, t, n), o;
      }function i(e) {
        return c.isString(e) && (e = o(e)), e instanceof r ? e.format() : r.prototype.format.call(e);
      }function s(e, t) {
        return o(e, !1, !0).resolve(t);
      }function a(e, t) {
        return e ? o(e, !1, !0).resolveObject(t) : t;
      }var u = e("punycode"),
          c = e("./util");n.parse = o, n.resolve = s, n.resolveObject = a, n.format = i, n.Url = r;var f = /^([a-z0-9.+-]+:)/i,
          d = /:[0-9]*$/,
          h = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
          l = ["<", ">", '"', "`", " ", "\r", "\n", "\t"],
          p = ["{", "}", "|", "\\", "^", "`"].concat(l),
          m = ["'"].concat(p),
          g = ["%", "/", "?", ";", "#"].concat(m),
          y = ["/", "?", "#"],
          _ = { javascript: !0, "javascript:": !0 },
          v = { javascript: !0, "javascript:": !0 },
          b = { http: !0, https: !0, ftp: !0, gopher: !0, file: !0, "http:": !0, "https:": !0, "ftp:": !0, "gopher:": !0, "file:": !0 },
          w = e("querystring");r.prototype.parse = function (e, t, n) {
        if (!c.isString(e)) throw new TypeError("Parameter 'url' must be a string, not " + (typeof e === "undefined" ? "undefined" : _typeof(e)));var r = e.indexOf("?"),
            o = -1 !== r && r < e.indexOf("#") ? "?" : "#",
            i = e.split(o);i[0] = i[0].replace(/\\/g, "/"), e = i.join(o);var s = e;if (s = s.trim(), !n && 1 === e.split("#").length) {
          var a = h.exec(s);if (a) return this.path = s, this.href = s, this.pathname = a[1], a[2] ? (this.search = a[2], this.query = t ? w.parse(this.search.substr(1)) : this.search.substr(1)) : t && (this.search = "", this.query = {}), this;
        }var d = f.exec(s);if (d) {
          d = d[0];var l = d.toLowerCase();this.protocol = l, s = s.substr(d.length);
        }if (n || d || s.match(/^\/\/[^@\/]+@[^@\/]+/)) {
          var p = "//" === s.substr(0, 2);!p || d && v[d] || (s = s.substr(2), this.slashes = !0);
        }if (!v[d] && (p || d && !b[d])) {
          for (var E = -1, k = 0; k < y.length; k++) {
            var x = s.indexOf(y[k]);-1 !== x && (-1 === E || x < E) && (E = x);
          }var S, I;I = -1 === E ? s.lastIndexOf("@") : s.lastIndexOf("@", E), -1 !== I && (S = s.slice(0, I), s = s.slice(I + 1), this.auth = decodeURIComponent(S)), E = -1;for (var k = 0; k < g.length; k++) {
            var x = s.indexOf(g[k]);-1 !== x && (-1 === E || x < E) && (E = x);
          }-1 === E && (E = s.length), this.host = s.slice(0, E), s = s.slice(E), this.parseHost(), this.hostname = this.hostname || "";var B = "[" === this.hostname[0] && "]" === this.hostname[this.hostname.length - 1];if (!B) for (var A = this.hostname.split(/\./), k = 0, C = A.length; k < C; k++) {
            var T = A[k];if (T && !T.match(/^[+a-z0-9A-Z_-]{0,63}$/)) {
              for (var L = "", U = 0, R = T.length; U < R; U++) {
                T.charCodeAt(U) > 127 ? L += "x" : L += T[U];
              }if (!L.match(/^[+a-z0-9A-Z_-]{0,63}$/)) {
                var O = A.slice(0, k),
                    M = A.slice(k + 1),
                    P = T.match(/^([+a-z0-9A-Z_-]{0,63})(.*)$/);P && (O.push(P[1]), M.unshift(P[2])), M.length && (s = "/" + M.join(".") + s), this.hostname = O.join(".");break;
              }
            }
          }this.hostname.length > 255 ? this.hostname = "" : this.hostname = this.hostname.toLowerCase(), B || (this.hostname = u.toASCII(this.hostname));var j = this.port ? ":" + this.port : "",
              H = this.hostname || "";this.host = H + j, this.href += this.host, B && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), "/" !== s[0] && (s = "/" + s));
        }if (!_[l]) for (var k = 0, C = m.length; k < C; k++) {
          var N = m[k];if (-1 !== s.indexOf(N)) {
            var q = encodeURIComponent(N);q === N && (q = escape(N)), s = s.split(N).join(q);
          }
        }var D = s.indexOf("#");-1 !== D && (this.hash = s.substr(D), s = s.slice(0, D));var W = s.indexOf("?");if (-1 !== W ? (this.search = s.substr(W), this.query = s.substr(W + 1), t && (this.query = w.parse(this.query)), s = s.slice(0, W)) : t && (this.search = "", this.query = {}), s && (this.pathname = s), b[l] && this.hostname && !this.pathname && (this.pathname = "/"), this.pathname || this.search) {
          var j = this.pathname || "",
              z = this.search || "";this.path = j + z;
        }return this.href = this.format(), this;
      }, r.prototype.format = function () {
        var e = this.auth || "";e && (e = encodeURIComponent(e), e = e.replace(/%3A/i, ":"), e += "@");var t = this.protocol || "",
            n = this.pathname || "",
            r = this.hash || "",
            o = !1,
            i = "";this.host ? o = e + this.host : this.hostname && (o = e + (-1 === this.hostname.indexOf(":") ? this.hostname : "[" + this.hostname + "]"), this.port && (o += ":" + this.port)), this.query && c.isObject(this.query) && Object.keys(this.query).length && (i = w.stringify(this.query));var s = this.search || i && "?" + i || "";return t && ":" !== t.substr(-1) && (t += ":"), this.slashes || (!t || b[t]) && !1 !== o ? (o = "//" + (o || ""), n && "/" !== n.charAt(0) && (n = "/" + n)) : o || (o = ""), r && "#" !== r.charAt(0) && (r = "#" + r), s && "?" !== s.charAt(0) && (s = "?" + s), n = n.replace(/[?#]/g, function (e) {
          return encodeURIComponent(e);
        }), s = s.replace("#", "%23"), t + o + n + s + r;
      }, r.prototype.resolve = function (e) {
        return this.resolveObject(o(e, !1, !0)).format();
      }, r.prototype.resolveObject = function (e) {
        if (c.isString(e)) {
          var t = new r();t.parse(e, !1, !0), e = t;
        }for (var n = new r(), o = Object.keys(this), i = 0; i < o.length; i++) {
          var s = o[i];n[s] = this[s];
        }if (n.hash = e.hash, "" === e.href) return n.href = n.format(), n;if (e.slashes && !e.protocol) {
          for (var a = Object.keys(e), u = 0; u < a.length; u++) {
            var f = a[u];"protocol" !== f && (n[f] = e[f]);
          }return b[n.protocol] && n.hostname && !n.pathname && (n.path = n.pathname = "/"), n.href = n.format(), n;
        }if (e.protocol && e.protocol !== n.protocol) {
          if (!b[e.protocol]) {
            for (var d = Object.keys(e), h = 0; h < d.length; h++) {
              var l = d[h];n[l] = e[l];
            }return n.href = n.format(), n;
          }if (n.protocol = e.protocol, e.host || v[e.protocol]) n.pathname = e.pathname;else {
            for (var p = (e.pathname || "").split("/"); p.length && !(e.host = p.shift());) {}e.host || (e.host = ""), e.hostname || (e.hostname = ""), "" !== p[0] && p.unshift(""), p.length < 2 && p.unshift(""), n.pathname = p.join("/");
          }if (n.search = e.search, n.query = e.query, n.host = e.host || "", n.auth = e.auth, n.hostname = e.hostname || e.host, n.port = e.port, n.pathname || n.search) {
            var m = n.pathname || "",
                g = n.search || "";n.path = m + g;
          }return n.slashes = n.slashes || e.slashes, n.href = n.format(), n;
        }var y = n.pathname && "/" === n.pathname.charAt(0),
            _ = e.host || e.pathname && "/" === e.pathname.charAt(0),
            w = _ || y || n.host && e.pathname,
            E = w,
            k = n.pathname && n.pathname.split("/") || [],
            p = e.pathname && e.pathname.split("/") || [],
            x = n.protocol && !b[n.protocol];if (x && (n.hostname = "", n.port = null, n.host && ("" === k[0] ? k[0] = n.host : k.unshift(n.host)), n.host = "", e.protocol && (e.hostname = null, e.port = null, e.host && ("" === p[0] ? p[0] = e.host : p.unshift(e.host)), e.host = null), w = w && ("" === p[0] || "" === k[0])), _) n.host = e.host || "" === e.host ? e.host : n.host, n.hostname = e.hostname || "" === e.hostname ? e.hostname : n.hostname, n.search = e.search, n.query = e.query, k = p;else if (p.length) k || (k = []), k.pop(), k = k.concat(p), n.search = e.search, n.query = e.query;else if (!c.isNullOrUndefined(e.search)) {
          if (x) {
            n.hostname = n.host = k.shift();var S = !!(n.host && n.host.indexOf("@") > 0) && n.host.split("@");S && (n.auth = S.shift(), n.host = n.hostname = S.shift());
          }return n.search = e.search, n.query = e.query, c.isNull(n.pathname) && c.isNull(n.search) || (n.path = (n.pathname ? n.pathname : "") + (n.search ? n.search : "")), n.href = n.format(), n;
        }if (!k.length) return n.pathname = null, n.search ? n.path = "/" + n.search : n.path = null, n.href = n.format(), n;for (var I = k.slice(-1)[0], B = (n.host || e.host || k.length > 1) && ("." === I || ".." === I) || "" === I, A = 0, C = k.length; C >= 0; C--) {
          I = k[C], "." === I ? k.splice(C, 1) : ".." === I ? (k.splice(C, 1), A++) : A && (k.splice(C, 1), A--);
        }if (!w && !E) for (; A--; A) {
          k.unshift("..");
        }!w || "" === k[0] || k[0] && "/" === k[0].charAt(0) || k.unshift(""), B && "/" !== k.join("/").substr(-1) && k.push("");var T = "" === k[0] || k[0] && "/" === k[0].charAt(0);if (x) {
          n.hostname = n.host = T ? "" : k.length ? k.shift() : "";var S = !!(n.host && n.host.indexOf("@") > 0) && n.host.split("@");S && (n.auth = S.shift(), n.host = n.hostname = S.shift());
        }return w = w || n.host && k.length, w && !T && k.unshift(""), k.length ? n.pathname = k.join("/") : (n.pathname = null, n.path = null), c.isNull(n.pathname) && c.isNull(n.search) || (n.path = (n.pathname ? n.pathname : "") + (n.search ? n.search : "")), n.auth = e.auth || n.auth, n.slashes = n.slashes || e.slashes, n.href = n.format(), n;
      }, r.prototype.parseHost = function () {
        var e = this.host,
            t = d.exec(e);t && (t = t[0], ":" !== t && (this.port = t.substr(1)), e = e.substr(0, e.length - t.length)), e && (this.hostname = e);
      };
    }, { "./util": 113, punycode: 68, querystring: 71 }], 113: [function (e, t, n) {
      "use strict";
      t.exports = { isString: function isString(e) {
          return "string" == typeof e;
        }, isObject: function isObject(e) {
          return "object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) && null !== e;
        }, isNull: function isNull(e) {
          return null === e;
        }, isNullOrUndefined: function isNullOrUndefined(e) {
          return null == e;
        } };
    }, {}], 114: [function (e, t, n) {
      var r = e("bencode"),
          o = e("bitfield"),
          i = e("safe-buffer").Buffer,
          s = e("debug")("ut_metadata"),
          a = e("events").EventEmitter,
          u = e("inherits"),
          c = e("simple-sha1"),
          f = 1e3;t.exports = function (e) {
        function t(t) {
          a.call(this), this._wire = t, this._metadataComplete = !1, this._metadataSize = null, this._remainingRejects = null, this._fetching = !1, this._bitfield = new o(0, { grow: f }), i.isBuffer(e) && this.setMetadata(e);
        }return u(t, a), t.prototype.name = "ut_metadata", t.prototype.onHandshake = function (e, t, n) {
          this._infoHash = e;
        }, t.prototype.onExtendedHandshake = function (e) {
          return e.m && e.m.ut_metadata ? e.metadata_size ? "number" != typeof e.metadata_size || 1e7 < e.metadata_size || e.metadata_size <= 0 ? this.emit("warning", new Error("Peer gave invalid metadata size")) : (this._metadataSize = e.metadata_size, this._numPieces = Math.ceil(this._metadataSize / 16384), this._remainingRejects = 2 * this._numPieces, void (this._fetching && this._requestPieces())) : this.emit("warning", new Error("Peer does not have metadata")) : this.emit("warning", new Error("Peer does not support ut_metadata"));
        }, t.prototype.onMessage = function (e) {
          var t, n;try {
            var o = e.toString(),
                i = o.indexOf("ee") + 2;t = r.decode(o.substring(0, i)), n = e.slice(i);
          } catch (e) {
            return;
          }switch (t.msg_type) {case 0:
              this._onRequest(t.piece);break;case 1:
              this._onData(t.piece, n, t.total_size);break;case 2:
              this._onReject(t.piece);}
        }, t.prototype.fetch = function () {
          this._metadataComplete || (this._fetching = !0, this._metadataSize && this._requestPieces());
        }, t.prototype.cancel = function () {
          this._fetching = !1;
        }, t.prototype.setMetadata = function (e) {
          if (this._metadataComplete) return !0;s("set metadata");try {
            var t = r.decode(e).info;t && (e = r.encode(t));
          } catch (e) {}return (!this._infoHash || this._infoHash === c.sync(e)) && (this.cancel(), this.metadata = e, this._metadataComplete = !0, this._metadataSize = this.metadata.length, this._wire.extendedHandshake.metadata_size = this._metadataSize, this.emit("metadata", r.encode({ info: r.decode(this.metadata) })), !0);
        }, t.prototype._send = function (e, t) {
          var n = r.encode(e);i.isBuffer(t) && (n = i.concat([n, t])), this._wire.extended("ut_metadata", n);
        }, t.prototype._request = function (e) {
          this._send({ msg_type: 0, piece: e });
        }, t.prototype._data = function (e, t, n) {
          var r = { msg_type: 1, piece: e };"number" == typeof n && (r.total_size = n), this._send(r, t);
        }, t.prototype._reject = function (e) {
          this._send({ msg_type: 2, piece: e });
        }, t.prototype._onRequest = function (e) {
          if (!this._metadataComplete) return void this._reject(e);var t = 16384 * e,
              n = t + 16384;n > this._metadataSize && (n = this._metadataSize);var r = this.metadata.slice(t, n);this._data(e, r, this._metadataSize);
        }, t.prototype._onData = function (e, t, n) {
          t.length > 16384 || (t.copy(this.metadata, 16384 * e), this._bitfield.set(e), this._checkDone());
        }, t.prototype._onReject = function (e) {
          this._remainingRejects > 0 && this._fetching ? (this._request(e), this._remainingRejects -= 1) : this.emit("warning", new Error('Peer sent "reject" too much'));
        }, t.prototype._requestPieces = function () {
          this.metadata = i.alloc(this._metadataSize);for (var e = 0; e < this._numPieces; e++) {
            this._request(e);
          }
        }, t.prototype._checkDone = function () {
          for (var e = !0, t = 0; t < this._numPieces; t++) {
            if (!this._bitfield.get(t)) {
              e = !1;break;
            }
          }if (e) {
            this.setMetadata(this.metadata) || this._failedMetadata();
          }
        }, t.prototype._failedMetadata = function () {
          this._bitfield = new o(0, { grow: f }), this._remainingRejects -= this._numPieces, this._remainingRejects > 0 ? this._requestPieces() : this.emit("warning", new Error("Peer sent invalid metadata"));
        }, t;
      };
    }, { bencode: 11, bitfield: 13, debug: 30, events: 34, inherits: 41, "safe-buffer": 88, "simple-sha1": 92 }], 115: [function (e, t, n) {
      (function (e) {
        function n(e, t) {
          function n() {
            if (!o) {
              if (r("throwDeprecation")) throw new Error(t);r("traceDeprecation") ? console.trace(t) : console.warn(t), o = !0;
            }return e.apply(this, arguments);
          }if (r("noDeprecation")) return e;var o = !1;return n;
        }function r(t) {
          try {
            if (!e.localStorage) return !1;
          } catch (e) {
            return !1;
          }var n = e.localStorage[t];return null != n && "true" === String(n).toLowerCase();
        }t.exports = n;
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {}], 116: [function (e, t, n) {
      (function (n) {
        function r(e) {
          var t = this;a.call(t), t._tracks = [], t._fragmentSequence = 1, t._file = e, t._decoder = null, t._findMoov(0);
        }function o(e, t) {
          var n = this;n._entries = e, n._countName = t || "count", n._index = 0, n._offset = 0, n.value = n._entries[0];
        }function i() {
          return { version: 0, flags: 0, entries: [] };
        }var s = e("binary-search"),
            a = e("events").EventEmitter,
            u = e("inherits"),
            c = e("mp4-stream"),
            f = e("mp4-box-encoding"),
            d = e("range-slice-stream");t.exports = r, u(r, a), r.prototype._findMoov = function (e) {
          var t = this;t._decoder && t._decoder.destroy(), t._decoder = c.decode();var n = t._file.createReadStream({ start: e });n.pipe(t._decoder), t._decoder.once("box", function (r) {
            "moov" === r.type ? t._decoder.decode(function (e) {
              n.destroy();try {
                t._processMoov(e);
              } catch (e) {
                e.message = "Cannot parse mp4 file: " + e.message, t.emit("error", e);
              }
            }) : (n.destroy(), t._findMoov(e + r.length));
          });
        }, o.prototype.inc = function () {
          var e = this;e._offset++, e._offset >= e._entries[e._index][e._countName] && (e._index++, e._offset = 0), e.value = e._entries[e._index];
        }, r.prototype._processMoov = function (e) {
          var t = this,
              r = e.traks;t._tracks = [], t._hasVideo = !1, t._hasAudio = !1;for (var s = 0; s < r.length; s++) {
            var a,
                u,
                c = r[s],
                d = c.mdia.minf.stbl,
                h = d.stsd.entries[0],
                l = c.mdia.hdlr.handlerType;if ("vide" === l && "avc1" === h.type) {
              if (t._hasVideo) continue;t._hasVideo = !0, a = "avc1", h.avcC && (a += "." + h.avcC.mimeCodec), u = 'video/mp4; codecs="' + a + '"';
            } else {
              if ("soun" !== l || "mp4a" !== h.type) continue;if (t._hasAudio) continue;t._hasAudio = !0, a = "mp4a", h.esds && h.esds.mimeCodec && (a += "." + h.esds.mimeCodec), u = 'audio/mp4; codecs="' + a + '"';
            }var p = [],
                m = 0,
                g = 0,
                y = 0,
                _ = 0,
                v = 0,
                b = 0,
                w = new o(d.stts.entries),
                E = null;d.ctts && (E = new o(d.ctts.entries));for (var k = 0;;) {
              var x = d.stsc.entries[v],
                  S = d.stsz.entries[m],
                  I = w.value.duration,
                  B = E ? E.value.compositionOffset : 0,
                  A = !0;if (d.stss && (A = d.stss.entries[k] === m + 1), p.push({ size: S, duration: I, dts: b, presentationOffset: B, sync: A, offset: _ + d.stco.entries[y] }), ++m >= d.stsz.entries.length) break;if (g++, _ += S, g >= x.samplesPerChunk) {
                g = 0, _ = 0, y++;var C = d.stsc.entries[v + 1];C && y + 1 >= C.firstChunk && v++;
              }b += I, w.inc(), E && E.inc(), A && k++;
            }c.mdia.mdhd.duration = 0, c.tkhd.duration = 0;var T = x.sampleDescriptionId,
                L = { type: "moov", mvhd: e.mvhd, traks: [{ tkhd: c.tkhd, mdia: { mdhd: c.mdia.mdhd, hdlr: c.mdia.hdlr, elng: c.mdia.elng, minf: { vmhd: c.mdia.minf.vmhd, smhd: c.mdia.minf.smhd, dinf: c.mdia.minf.dinf, stbl: { stsd: d.stsd, stts: i(), ctts: i(), stsc: i(), stsz: i(), stco: i(), stss: i() } } } }], mvex: { mehd: { fragmentDuration: e.mvhd.duration }, trexs: [{ trackId: c.tkhd.trackId, defaultSampleDescriptionIndex: T, defaultSampleDuration: 0, defaultSampleSize: 0, defaultSampleFlags: 0 }] } };t._tracks.push({ trackId: c.tkhd.trackId, timeScale: c.mdia.mdhd.timeScale, samples: p, currSample: null, currTime: null, moov: L, mime: u });
          }if (0 === t._tracks.length) return void t.emit("error", new Error("no playable tracks"));e.mvhd.duration = 0, t._ftyp = { type: "ftyp", brand: "iso5", brandVersion: 0, compatibleBrands: ["iso5"] };var U = f.encode(t._ftyp),
              R = t._tracks.map(function (e) {
            var t = f.encode(e.moov);return { mime: e.mime, init: n.concat([U, t]) };
          });t.emit("ready", R);
        }, r.prototype.seek = function (e) {
          var t = this;if (!t._tracks) throw new Error("Not ready yet; wait for 'ready' event");t._fileStream && (t._fileStream.destroy(), t._fileStream = null);var n = -1;if (t._tracks.map(function (r, o) {
            function i(e) {
              s.destroyed || s.box(e.moof, function (n) {
                if (n) return t.emit("error", n);if (!s.destroyed) {
                  r.inStream.slice(e.ranges).pipe(s.mediaData(e.length, function (e) {
                    if (e) return t.emit("error", e);if (!s.destroyed) {
                      var n = t._generateFragment(o);if (!n) return s.finalize();i(n);
                    }
                  }));
                }
              });
            }r.outStream && r.outStream.destroy(), r.inStream && (r.inStream.destroy(), r.inStream = null);var s = r.outStream = c.encode(),
                a = t._generateFragment(o, e);if (!a) return s.finalize();(-1 === n || a.ranges[0].start < n) && (n = a.ranges[0].start), i(a);
          }), n >= 0) {
            var r = t._fileStream = t._file.createReadStream({ start: n });t._tracks.forEach(function (e) {
              e.inStream = new d(n, { highWaterMark: 1e7 }), r.pipe(e.inStream);
            });
          }return t._tracks.map(function (e) {
            return e.outStream;
          });
        }, r.prototype._findSampleBefore = function (e, t) {
          var n = this,
              r = n._tracks[e],
              o = Math.floor(r.timeScale * t),
              i = s(r.samples, o, function (e, t) {
            return e.dts + e.presentationOffset - t;
          });for (-1 === i ? i = 0 : i < 0 && (i = -i - 2); !r.samples[i].sync;) {
            i--;
          }return i;
        };r.prototype._generateFragment = function (e, t) {
          var n,
              r = this,
              o = r._tracks[e];if ((n = void 0 !== t ? r._findSampleBefore(e, t) : o.currSample) >= o.samples.length) return null;for (var i = o.samples[n].dts, s = 0, a = [], u = n; u < o.samples.length; u++) {
            var c = o.samples[u];if (c.sync && c.dts - i >= 1 * o.timeScale) break;s += c.size;var f = a.length - 1;f < 0 || a[f].end !== c.offset ? a.push({ start: c.offset, end: c.offset + c.size }) : a[f].end += c.size;
          }return o.currSample = u, { moof: r._generateMoof(e, n, u), ranges: a, length: s };
        }, r.prototype._generateMoof = function (e, t, n) {
          for (var r = this, o = r._tracks[e], i = [], s = t; s < n; s++) {
            var a = o.samples[s];i.push({ sampleDuration: a.duration, sampleSize: a.size, sampleFlags: a.sync ? 33554432 : 16842752, sampleCompositionTimeOffset: a.presentationOffset });
          }var u = { type: "moof", mfhd: { sequenceNumber: r._fragmentSequence++ }, trafs: [{ tfhd: { flags: 131072, trackId: o.trackId }, tfdt: { baseMediaDecodeTime: o.samples[t].dts }, trun: {
                flags: 3841, dataOffset: 8, entries: i } }] };return u.trafs[0].trun.dataOffset += f.encodingLength(u), u;
        };
      }).call(this, e("buffer").Buffer);
    }, { "binary-search": 12, buffer: 24, events: 34, inherits: 41, "mp4-box-encoding": 53, "mp4-stream": 56, "range-slice-stream": 74 }], 117: [function (e, t, n) {
      function r(e, t, n) {
        var i = this;if (!(this instanceof r)) return new r(e, t, n);n = n || {}, i.detailedError = null, i._elem = t, i._elemWrapper = new o(t), i._waitingFired = !1, i._trackMeta = null, i._file = e, i._tracks = null, "none" !== i._elem.preload && i._createMuxer(), i._onError = function (e) {
          i.detailedError = i._elemWrapper.detailedError, i.destroy();
        }, i._onWaiting = function () {
          i._waitingFired = !0, i._muxer ? i._tracks && i._pump() : i._createMuxer();
        }, i._elem.addEventListener("waiting", i._onWaiting), i._elem.addEventListener("error", i._onError);
      }var o = e("mediasource"),
          i = e("pump"),
          s = e("./mp4-remuxer");t.exports = r, r.prototype._createMuxer = function () {
        var e = this;e._muxer = new s(e._file), e._muxer.on("ready", function (t) {
          e._tracks = t.map(function (t) {
            var n = e._elemWrapper.createWriteStream(t.mime);n.on("error", function (t) {
              e._elemWrapper.error(t);
            });var r = { muxed: null, mediaSource: n, initFlushed: !1, onInitFlushed: null };return n.write(t.init, function (e) {
              r.initFlushed = !0, r.onInitFlushed && r.onInitFlushed(e);
            }), r;
          }), (e._waitingFired || "auto" === e._elem.preload) && e._pump();
        }), e._muxer.on("error", function (t) {
          e._elemWrapper.error(t);
        });
      }, r.prototype._pump = function () {
        var e = this,
            t = e._muxer.seek(e._elem.currentTime, !e._tracks);e._tracks.forEach(function (n, r) {
          var o = function o() {
            n.muxed && (n.muxed.destroy(), n.mediaSource = e._elemWrapper.createWriteStream(n.mediaSource), n.mediaSource.on("error", function (t) {
              e._elemWrapper.error(t);
            })), n.muxed = t[r], i(n.muxed, n.mediaSource);
          };n.initFlushed ? o() : n.onInitFlushed = function (t) {
            if (t) return void e._elemWrapper.error(t);o();
          };
        });
      }, r.prototype.destroy = function () {
        var e = this;e.destroyed || (e.destroyed = !0, e._elem.removeEventListener("waiting", e._onWaiting), e._elem.removeEventListener("error", e._onError), e._tracks && e._tracks.forEach(function (e) {
          e.muxed.destroy();
        }), e._elem.src = "");
      };
    }, { "./mp4-remuxer": 116, mediasource: 49, pump: 67 }], 118: [function (e, t, n) {
      function r(e, t) {
        function n() {
          for (var t = new Array(arguments.length), n = 0; n < t.length; n++) {
            t[n] = arguments[n];
          }var r = e.apply(this, t),
              o = t[t.length - 1];return "function" == typeof r && r !== o && Object.keys(o).forEach(function (e) {
            r[e] = o[e];
          }), r;
        }if (e && t) return r(e)(t);if ("function" != typeof e) throw new TypeError("need wrapper function");return Object.keys(e).forEach(function (t) {
          n[t] = e[t];
        }), n;
      }t.exports = r;
    }, {}], 119: [function (e, t, n) {
      function r() {
        for (var e = {}, t = 0; t < arguments.length; t++) {
          var n = arguments[t];for (var r in n) {
            o.call(n, r) && (e[r] = n[r]);
          }
        }return e;
      }t.exports = r;var o = Object.prototype.hasOwnProperty;
    }, {}], 120: [function (e, t, n) {
      function r(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = arguments[t];for (var r in n) {
            o.call(n, r) && (e[r] = n[r]);
          }
        }return e;
      }t.exports = r;var o = Object.prototype.hasOwnProperty;
    }, {}], 121: [function (e, t, n) {
      t.exports = function e(t, n, r) {
        return void 0 === n ? function (n, r) {
          return e(t, n, r);
        } : (void 0 === r && (r = "0"), t -= n.toString().length, t > 0 ? new Array(t + (/\./.test(n) ? 2 : 1)).join(r) + n : n + "");
      };
    }, {}], 122: [function (e, t, n) {
      t.exports = { version: "0.98.18" };
    }, {}], 123: [function (e, t, n) {
      (function (n, r) {
        function o(e) {
          function t() {
            i.destroyed || (i.ready = !0, i.emit("ready"));
          }var i = this;if (!(i instanceof o)) return new o(e);h.call(i), e || (e = {}), "string" == typeof e.peerId ? i.peerId = e.peerId : a.isBuffer(e.peerId) ? i.peerId = e.peerId.toString("hex") : i.peerId = a.from(B + b(9).toString("base64")).toString("hex"), i.peerIdBuffer = a.from(i.peerId, "hex"), "string" == typeof e.nodeId ? i.nodeId = e.nodeId : a.isBuffer(e.nodeId) ? i.nodeId = e.nodeId.toString("hex") : i.nodeId = b(20).toString("hex"), i.nodeIdBuffer = a.from(i.nodeId, "hex"), i._debugId = i.peerId.toString("hex").substring(0, 7), i.destroyed = !1, i.listening = !1, i.torrentPort = e.torrentPort || 0, i.dhtPort = e.dhtPort || 0, i.tracker = void 0 !== e.tracker ? e.tracker : {}, i.torrents = [], i.maxConns = Number(e.maxConns) || 55, i._debug("new webtorrent (peerId %s, nodeId %s, port %s)", i.peerId, i.nodeId, i.torrentPort), i.tracker && ("object" != _typeof(i.tracker) && (i.tracker = {}), e.rtcConfig && (console.warn("WebTorrent: opts.rtcConfig is deprecated. Use opts.tracker.rtcConfig instead"), i.tracker.rtcConfig = e.rtcConfig), e.wrtc && (console.warn("WebTorrent: opts.wrtc is deprecated. Use opts.tracker.wrtc instead"), i.tracker.wrtc = e.wrtc), r.WRTC && !i.tracker.wrtc && (i.tracker.wrtc = r.WRTC)), "function" == typeof k ? i._tcpPool = new k(i) : n.nextTick(function () {
            i._onListening();
          }), i._downloadSpeed = w(), i._uploadSpeed = w(), !1 !== e.dht && "function" == typeof d ? (i.dht = new d(l({ nodeId: i.nodeId }, e.dht)), i.dht.once("error", function (e) {
            i._destroy(e);
          }), i.dht.once("listening", function () {
            var e = i.dht.address();e && (i.dhtPort = e.port);
          }), i.dht.setMaxListeners(0), i.dht.listen(i.dhtPort)) : i.dht = !1, i.enableWebSeeds = !1 !== e.webSeeds, "function" == typeof m && null != e.blocklist ? m(e.blocklist, { headers: { "user-agent": "WebTorrent/" + S + " (https://webtorrent.io)" } }, function (e, n) {
            if (e) return i.error("Failed to load blocklist: " + e.message);i.blocked = n, t();
          }) : n.nextTick(t);
        }function i(e) {
          return "object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) && null != e && "function" == typeof e.pipe;
        }function s(e) {
          return "undefined" != typeof FileList && e instanceof FileList;
        }t.exports = o;var a = e("safe-buffer").Buffer,
            u = e("simple-concat"),
            c = e("create-torrent"),
            f = e("debug")("webtorrent"),
            d = e("bittorrent-dht/client"),
            h = e("events").EventEmitter,
            l = e("xtend"),
            p = e("inherits"),
            m = e("load-ip-set"),
            g = e("run-parallel"),
            y = e("parse-torrent"),
            _ = e("path"),
            v = e("simple-peer"),
            b = e("randombytes"),
            w = e("speedometer"),
            E = e("zero-fill"),
            k = e("./lib/tcp-pool"),
            x = e("./lib/torrent"),
            S = e("./package.json").version,
            I = S.match(/([0-9]+)/g).slice(0, 2).map(function (e) {
          return E(2, e);
        }).join(""),
            B = "-WW" + I + "-";p(o, h), o.WEBRTC_SUPPORT = v.WEBRTC_SUPPORT, Object.defineProperty(o.prototype, "downloadSpeed", { get: function get() {
            return this._downloadSpeed();
          } }), Object.defineProperty(o.prototype, "uploadSpeed", { get: function get() {
            return this._uploadSpeed();
          } }), Object.defineProperty(o.prototype, "progress", { get: function get() {
            var e = this.torrents.filter(function (e) {
              return 1 !== e.progress;
            });return e.reduce(function (e, t) {
              return e + t.downloaded;
            }, 0) / (e.reduce(function (e, t) {
              return e + (t.length || 0);
            }, 0) || 1);
          } }), Object.defineProperty(o.prototype, "ratio", { get: function get() {
            return this.torrents.reduce(function (e, t) {
              return e + t.uploaded;
            }, 0) / (this.torrents.reduce(function (e, t) {
              return e + t.received;
            }, 0) || 1);
          } }), o.prototype.get = function (e) {
          var t,
              n,
              r = this,
              o = r.torrents.length;if (e instanceof x) {
            for (t = 0; t < o; t++) {
              if ((n = r.torrents[t]) === e) return n;
            }
          } else {
            var i;try {
              i = y(e);
            } catch (e) {}if (!i) return null;if (!i.infoHash) throw new Error("Invalid torrent identifier");for (t = 0; t < o; t++) {
              if (n = r.torrents[t], n.infoHash === i.infoHash) return n;
            }
          }return null;
        }, o.prototype.download = function (e, t, n) {
          return console.warn("WebTorrent: client.download() is deprecated. Use client.add() instead"), this.add(e, t, n);
        }, o.prototype.add = function (e, t, n) {
          function r() {
            if (!s.destroyed) for (var e = 0, t = s.torrents.length; e < t; e++) {
              var n = s.torrents[e];if (n.infoHash === a.infoHash && n !== a) return void a._destroy(new Error("Cannot add duplicate torrent " + a.infoHash));
            }
          }function o() {
            s.destroyed || ("function" == typeof n && n(a), s.emit("torrent", a));
          }function i() {
            a.removeListener("_infoHash", r), a.removeListener("ready", o), a.removeListener("close", i);
          }var s = this;if (s.destroyed) throw new Error("client is destroyed");if ("function" == typeof t) return s.add(e, null, t);s._debug("add"), t = t ? l(t) : {};var a = new x(e, s, t);return s.torrents.push(a), a.once("_infoHash", r), a.once("ready", o), a.once("close", i), a;
        }, o.prototype.seed = function (e, t, n) {
          function r(e) {
            var t = [function (t) {
              e.load(f, t);
            }];a.dht && t.push(function (t) {
              e.once("dhtAnnounce", t);
            }), g(t, function (t) {
              if (!a.destroyed) return t ? e._destroy(t) : void o(e);
            });
          }function o(e) {
            a._debug("on seed"), "function" == typeof n && n(e), e.emit("seed"), a.emit("seed", e);
          }var a = this;if (a.destroyed) throw new Error("client is destroyed");if ("function" == typeof t) return a.seed(e, null, t);a._debug("seed"), t = t ? l(t) : {}, "string" == typeof e && (t.path = _.dirname(e)), t.createdBy || (t.createdBy = "WebTorrent/" + I);var f,
              d = a.add(null, t, r);return s(e) && (e = Array.prototype.slice.call(e)), Array.isArray(e) || (e = [e]), g(e.map(function (e) {
            return function (t) {
              i(e) ? u(e, t) : t(null, e);
            };
          }), function (e, n) {
            if (!a.destroyed) return e ? d._destroy(e) : void c.parseInput(n, t, function (e, r) {
              if (!a.destroyed) {
                if (e) return d._destroy(e);f = r.map(function (e) {
                  return e.getStream;
                }), c(n, t, function (e, t) {
                  if (!a.destroyed) {
                    if (e) return d._destroy(e);var n = a.get(t);n ? d._destroy(new Error("Cannot add duplicate torrent " + n.infoHash)) : d._onTorrentId(t);
                  }
                });
              }
            });
          }), d;
        }, o.prototype.remove = function (e, t) {
          if (this._debug("remove"), !this.get(e)) throw new Error("No torrent with id " + e);this._remove(e, t);
        }, o.prototype._remove = function (e, t) {
          var n = this.get(e);n && (this.torrents.splice(this.torrents.indexOf(n), 1), n.destroy(t));
        }, o.prototype.address = function () {
          return this.listening ? this._tcpPool ? this._tcpPool.server.address() : { address: "0.0.0.0", family: "IPv4", port: 0 } : null;
        }, o.prototype.destroy = function (e) {
          if (this.destroyed) throw new Error("client already destroyed");this._destroy(null, e);
        }, o.prototype._destroy = function (e, t) {
          var n = this;n._debug("client destroy"), n.destroyed = !0;var r = n.torrents.map(function (e) {
            return function (t) {
              e.destroy(t);
            };
          });n._tcpPool && r.push(function (e) {
            n._tcpPool.destroy(e);
          }), n.dht && r.push(function (e) {
            n.dht.destroy(e);
          }), g(r, t), e && n.emit("error", e), n.torrents = [], n._tcpPool = null, n.dht = null;
        }, o.prototype._onListening = function () {
          if (this._debug("listening"), this.listening = !0, this._tcpPool) {
            var e = this._tcpPool.server.address();e && (this.torrentPort = e.port);
          }this.emit("listening");
        }, o.prototype._debug = function () {
          var e = [].slice.call(arguments);e[0] = "[" + this._debugId + "] " + e[0], f.apply(null, e);
        };
      }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, { "./lib/tcp-pool": 21, "./lib/torrent": 5, "./package.json": 122, _process: 66, "bittorrent-dht/client": 21, "create-torrent": 29, debug: 30, events: 34, inherits: 41, "load-ip-set": 21, "parse-torrent": 62, path: 63, randombytes: 73, "run-parallel": 86, "safe-buffer": 88, "simple-concat": 89, "simple-peer": 91, speedometer: 94, xtend: 119, "zero-fill": 121 }] }, {}, [123])(123);
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(14).setImmediate))

/***/ })

/******/ });
});