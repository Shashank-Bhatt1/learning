define(['jquery'], function ($) {
    'use strict';
    
    return function() {
        $.extend($.validator.prototype,{
           elements: function () {
                var validator = this,
                    rulesCache = {};

                
                //instead of finding only within the form, make every element validate with form attr that are part of the currentForm
                return $.merge($(this.currentForm).find("input, select, textarea"),
                    $( this.currentForm.elements ).filter("input, select, textarea"))
                    .not(":submit, :reset, :image, [disabled]")
                    .not(this.settings.ignore)
                    .filter(function () {
                        if (!this.name && validator.settings.debug && window.console) {
                            console.error("%o has no name assigned", this);
                        }

                        // select only the first element for each name, and only those with rules specified
                        if (this.name in rulesCache || !validator.objectLength($(this).rules())) {
                            return false;
                        }

                        rulesCache[this.name] = true;
                        return true;
                });
            },
        });
        return $.mage.validation;
    }
});