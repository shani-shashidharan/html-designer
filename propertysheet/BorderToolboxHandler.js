/**
 * @author Swagatam Mitra
  
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, document, console, brackets, $, Mustache */

define(function (require, exports, module) {
    "use strict";
    
    var AppInit       = brackets.getModule("utils/AppInit");
    var lastSelectedRuleset = null;
    
    $(document).on("ruleset-wrapper.created ruleset-wrapper.refreshed","#html-design-editor",function(event,rulesetref){
        var asynchPromise = new $.Deferred();
       lastSelectedRuleset = rulesetref;
        _synchFromDOM();
        return asynchPromise.promise();
    });
    
    $(document).on("click","#border-toolbox-anchor",function(event){
        $("#border-editor").show();
        $("#border-radius-editor").hide();
        $(".border").removeClass("activeBorder");
        $("#border-all").addClass("activeBorder");
        $("#html-design-editor").trigger("border-radius-mode-off");
        event.preventDefault();
        event.stopPropagation();
    });
    
    $(document).on("click",".border",function(event){
        $(".border").removeClass("activeBorder");
        $(this).addClass("activeBorder");
        _synchFromDOM();
        event.preventDefault();
        event.stopPropagation();
    });
    
    function _synchFromDOM(){
        var color,width,style;
        color = lastSelectedRuleset.css($(".activeBorder").data('key')+'-color');
        width = lastSelectedRuleset.css($(".activeBorder").data('key')+'-width');
        style = lastSelectedRuleset.css($(".activeBorder").data('key')+'-style');
        
        $("#element-border-color").val(color);
        $("#element-border-style").val(style);
        $("#element-border-size").val(parseInt(width));
    }
    
    function _applyBorderColor(){
        var borderKey = $(".activeBorder").data('key');
        var borderColor = $("#element-border-color").val();
        lastSelectedRuleset.css(borderKey+'-color',borderColor);
        lastSelectedRuleset.persist();
    }
    
    function _applyBorderStyle(){
        var borderKey = $(".activeBorder").data('key');
        var borderStyle = $("#element-border-style").find(":selected").text();
        lastSelectedRuleset.css(borderKey+'-style',borderStyle);
        lastSelectedRuleset.persist();
    }
    
    function _applyBorderSize(){
        var borderKey = $(".activeBorder").data('key');
        var borderSize = $("#element-border-size").val();
        lastSelectedRuleset.css(borderKey+'-width',borderSize);
        lastSelectedRuleset.persist();
        $("#html-design-editor").trigger("refresh.element.selection");
    }
    
    AppInit.appReady(function () {
        $("#element-border-color").ColorPicker({
            onShow: function (colpkr) {
                $(colpkr).fadeIn(500);
                return false;
            },
            onHide: function (colpkr) {
                $(colpkr).fadeOut(500);
                return false;
            },
            onSubmit: function(hsb, hex, rgb, el) {
                $(el).val(hex);
                $(el).ColorPickerHide();
            },
            onBeforeShow: function () {
                $(this).ColorPickerSetColor(this.value);
            },
            onChange: function (hsb, hex, rgb) {
                $("#element-border-color").val('#' + hex);
                _applyBorderColor();
            }
        })
        .bind('keyup', function(){
            $(this).ColorPickerSetColor(this.value);
        });
    });
    
    function _stopPropagation(event){
        event.preventDefault();
        event.stopPropagation();
    }
        
    
    $(document).on("change","#element-border-color",_applyBorderColor);
    $(document).on("change","#element-border-size",_applyBorderSize);
    $(document).on("change","#element-border-style",_applyBorderStyle);
    
    $(document).on("click","#element-border-color",_stopPropagation);
    $(document).on("click","#element-border-size",_stopPropagation);
    $(document).on("click","#element-border-style",_stopPropagation);
        
});