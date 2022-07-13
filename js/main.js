/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

$(function () {
     $('[data-bs-toggle="tooltip"]').tooltip();
});

(function () {
     "use strict";

     var csInterface = new CSInterface();

     function init() {
          themeManager.init();
          $("#btn_test").click(function () {
               csInterface.evalScript("alert(app.project.activeItem.name)");
          });
     }
     init();
})();
var script = document.currentScript;
var fullUrl = script.src;
var rootPath = "/jsx/";
var csInterface = new CSInterface();
var colorList = [];

function executeScript(scriptPath) {
     try {
          csInterface.evalScript('$.evalFile("' + rootPath + scriptPath + '")');
     } catch (err) {
          alert(err, err.line);
     }
     $("button").tooltip("hide");
}
