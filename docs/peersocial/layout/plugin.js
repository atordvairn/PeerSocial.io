define(function(require, exports, module) {

    appPlugin.consumes = ["app", "state"];
    appPlugin.provides = ["layout", "ejs"];

    var ejs = require("../lib/ejs");

    return appPlugin;
    /* global $ */
    function appPlugin(options, imports, register) {

        $(document).on('DOMNodeInserted', function(e) {
            var $ta = $(e.target).find("time");
            if($ta.length) 
                $ta.timeago();
            
            var ddi = $(e.target).find(".dropdown-item");
            if(ddi.length)
                $(e.target).find(".dropdown-item").each((i, e) => {
                    var self = $(e);
                    self.click(() => {
                        var dropdown_id = self.closest(".dropdown-menu").attr("aria-labelledby");
                        self.closest('.navbar-collapse').collapse('hide');
                        $("#"+dropdown_id).dropdown('hide');
                    });
                });
            
        });

        register(null, {
            ejs: ejs,
            layout: {
                ejs: ejs,

                init: function() {
                    // $('.navbar-nav>li>a').on('load', function(e) {
                    //     $(e).on('click', function() {
                    //         $('.navbar-collapse').collapse('hide');
                    //     });
                    // }());

                    imports.state.$hash.on("404", function(currentHash, lastHash) {
                        ejs.render(require("./404-page_not_found.html"), {
                            /* options */
                        }, { async: true }).then(function(pageOutput) {
                            $("#main-container").html(pageOutput);
                        });
                    });
                    imports.state.$hash.on("200", function(currentHash, lastHash) {
                        $("#main-container").html(ejs.render(require("./loading.html")));
                    });

                },
                modal:require("./modal")(imports),
                get: function($selector) {
                    return $($selector);
                },
                addNavBar: function(e, clear) {
                    e = $(e);
                    e.find("a").on('click', function(e) {
                        if(!$(e.target).hasClass("dropdown-toggle"))
                            $('.navbar-collapse').collapse('hide');
                    });
                    if (clear)
                        $("#navbar-nav-right").html(e);
                    else
                        $("#navbar-nav-right").prepend(e);
                        
                    return e;
                }
            }
        });

    }

});