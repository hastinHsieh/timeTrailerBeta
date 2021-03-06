/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

const root = document.documentElement;
// var script = document.currentScript;
// var fullUrl = script.src;
//TODO: check function when online
// var rootPath = fullUrl.replace("js/main.js", "jsx/");
// var rootPath = csInterface.getSystemPath(SystemPath.EXTENSION) + "/jsx/"
var csInterface = new CSInterface();
var subAry = new Array();
var subFormsContainer = document.getElementById("subForms");
var projectFPS = 24;
var subtitleLayerID = null;
var prevEditItemIndex = 0;
var curEditItemIndex = 0;

const addTextKey_jsxbin =
     'eval("@JSXBIN@ES@2.1@MyBbyBnABMAbyBnABMUbyBn0ABgVbyBn0ABZWnAEXzJjMjBjZjFjSiCjZiJiEBfXzHjQjSjPjKjFjDjUCfjzDjBjQjQDfRBVzHjMjBjZjFjSiJiEEfAffABnzBjFFnbyBn0ABZYnAFbABE40BhAB0AzMjHjFjUiMjBjZjFjSiCjZiJiEGAgaDJBnAEXzOjCjFjHjJjOiVjOjEjPiHjSjPjVjQHfjDfRBFeMjBjEjEifjTjVjCjUjJjUjMjFffgCbyBn0AEJDnASzHjJjUjFjNiGiQiTIAXzJjGjSjBjNjFiSjBjUjFJfXzKjBjDjUjJjWjFiJjUjFjNKfXCfjDfnftJEnABjzPjTjVjCjUjJjUjMjFiMjBjZjFjSiJiELfEjzGiOjVjNjCjFjSMfRBjLfffnfJFnABjzNjTjVjCjUjJjUjMjFiMjBjZjFjSNfEjGfRBjLfffnfJGnAEXzOjTjFjUiWjBjMjVjFiBjUiUjJjNjFOfEXzIjQjSjPjQjFjSjUjZPfjNfRBFeLiTjPjVjSjDjFhAiUjFjYjUffRCXzKjTjVjCiUjJjNjFiOjVjNQfVzJjTjVjCiPjCjKjFjDjURfBEjzMiUjFjYjUiEjPjDjVjNjFjOjUSfRBXzKjTjVjCiDjPjOjUjFjOjUTfVRfBftffABnFnbyBn0ABJInAEjzFjBjMjFjSjUUfRCjFfXzEjMjJjOjFVfjFfffJKnAEXzMjFjOjEiVjOjEjPiHjSjPjVjQWfjDfnfACR40BhAI40BiABBAzNjDjSjFjBjUjFiUjFjYjUiLjFjZXAgb0EzAYByB")';

const createTextKeys_jsxbin =
     'eval("@JSXBIN@ES@2.1@MyBbyBnABMBbyBn0ABgCbyBnABMgebyBn0AFJgfnASzEjIjPjVjSBACzBhKCEjzIjQjBjSjTjFiJjOjUDfRBEXzJjTjVjCjTjUjSjJjOjHEfVzHiTiSiUiUjJjNjFFfERCFdAFdCffffnnd2QOnftJhAnASzDjNjJjOGBCCEjDfRBEXEfVFfERCFdDFdFffffnndhcnftJhBnASzDjTjFjDHCEjDfRBEXEfVFfERCFdGFdIffffnftJhCnASzEjNiTjFjDIDCzBhPJEXzFjSjPjVjOjEKfjzEiNjBjUjILfRBCCCJEjDfRBEXEfVFfERCFdJFdMffffnnd2nIDjzHjJjUjFjNiGiQiTMfnnffjMfnnnftZhDnAEjzGiOjVjNjCjFjSNfRBCzBhLOCOCOVBfAVGfBnnVHfCnnVIfDnnffAFG4B0AiAF40BhAB40BiAH4C0AiAI4D0AiABEAzRjHjFjUiTjFjDiGjSjPjNiTiSiUiUjJjNjFPAhENJDnASzGjTjVjCiBjSjZQAVzLjTjVjCiBjSjZiJjOjQjVjURfFnftJFnASMCXzJjGjSjBjNjFiSjBjUjFSfXzKjBjDjUjJjWjFiJjUjFjNTfXzHjQjSjPjKjFjDjUUfjzDjBjQjQVfnftJGnASzDjXjJjOWDEjzGiXjJjOjEjPjXXfRDFeHjQjBjMjFjUjUjFFeG2hPiT2jFiR2hNiOhOhOhOjzJjVjOjEjFjGjJjOjFjEYfftnftJHnABXzIjQjSjPjHjSjFjTjTZfVWfDEXzDjBjEjEgafVWfDRFFeLjQjSjPjHjSjFjTjTjCjBjSAREFdAFdAFdmIFdUfFdAXzGjMjFjOjHjUjIgbfVQfAFdAffnfJInAEXzEjTjIjPjXgcfVWfDnfJJnAEXzGjVjQjEjBjUjFgdfVWfDnfJKnAEXzOjCjFjHjJjOiVjOjEjPiHjSjPjVjQgefjVfRBFePjJjNjQjPjSjUifjTjVjCjUjJjUjMjFffOLbyMn0ABJMnASzNjTjVjCjUjJjUjMjFiMjBjZjFjSgfBXzBhQhAfXzOjTjFjMjFjDjUjFjEiMjBjZjFjSjThBfXTfXUfjVfnffACzChBhdhCXhAfXhBfXTfXUfjVfnnbbOn0AHJOnASgfBEXzHjBjEjEiUjFjYjUhDfXzGjMjBjZjFjSjThEfXTfXUfjVfnfnffJPnABXzEjOjBjNjFhFfVgffBneMhDhAjchAiTjVjCjUjJjUjMjFfJQnABXzJjTjUjBjSjUiUjJjNjFhGfVgffBndAfJRnABXzKjFjYjQjSjFjTjTjJjPjOhHfEXzIjQjSjPjQjFjSjUjZhIfVgffBRBFeLiTjPjVjSjDjFhAiUjFjYjUffneChPhQfJSnAEXzOjFjYjFjDjVjUjFiDjPjNjNjBjOjEhJfjVfRBEXzRjGjJjOjEiNjFjOjViDjPjNjNjBjOjEiJjEhKfjVfRBFeYiSjFjWjFjBjMhAiFjYjQjSjFjTjTjJjPjOhAiFjSjSjPjSjTffffJTnAEXzFjTjMjFjFjQhLfjzBhEhMfRBFdBffJUnABXhHfEXhIfVgffBRBFeLiTjPjVjSjDjFhAiUjFjYjUffneAfJWnABXzEjUjJjNjFhNfXTfXUfjVfXzKjTjVjCiUjJjNjFiOjVjNhOfXzBhRhPfVQfAnfaXbYn0ADJYnAEXzOjTjFjUiWjBjMjVjFiBjUiUjJjNjFhQfEXhIfVgffBRBFeLiTjPjVjSjDjFhAiUjFjYjUffRCXhOfQzAhRfVQfAVzBjJhSfEEjzMiUjFjYjUiEjPjDjVjNjFjOjUhTfRBXzKjTjVjCiDjPjOjUjFjOjUhUfQhRfVQfAVhSfEftffJZnABXzFjWjBjMjVjFhVfXZfVWfDVhSfEnfJganAEXgdfVWfDnfAVhSfEAXgbfVRfFByBzBhchWJgcnAEXzMjFjOjEiVjOjEjPiHjSjPjVjQhXfjVfnfJgdnAEXzFjDjMjPjTjFhYfVWfDnfZhFnAXzCjJjEhZfVgffBABnzBjFhanbyBn0ABJhInAEjzFjBjMjFjSjUhbfRCjhafXzEjMjJjOjFhcfjhafffAGhS4E0AiAR40BhAQ40BiAgf4B0AiAM4C0AiAW4D0AiABFAzOjDjSjFjBjUjFiUjFjYjUiLjFjZjThdAhK0EhRByB")';

const readInSubtitleData_jsxbin =
     'eval("@JSXBIN@ES@2.1@MyBbyBnABMAbyBnADMSbyBn0ABgTbyBn0ABZUnAEXzIjJjUjFjNiCjZiJiEBfXzHjQjSjPjKjFjDjUCfjzDjBjQjQDfRBVzGjJjUjFjNiJiEEfAffABnzBjFFnbyBn0ABZWnAFbABE40BhAB0AzLjHjFjUiJjUjFjNiCjZiJiEGAYMZbyBn0ABggabyBn0ABZgbnAEXzJjMjBjZjFjSiCjZiJiEHfXCfjDfRBVzHjMjBjZjFjSiJiEIfAffABnFnbyBn0ABZgdnAFbABI40BhAB0AzMjHjFjUiMjBjZjFjSiCjZiJiEJAgfMhAbyBn0AFJhBnASzEjIjPjVjSKAEXzFjTjMjJjDjFLfCzBhLMnEjzIjQjBjSjTjFiJjOjUNfRBCzBhPOVzHjTjFjDiUjJjNjFPfEnnd2QOffeChQhQnRBFdyCffnftJhCnASzDjNjJjOQBEXLfCMnEjNfRBCOCzBhFRVPfEnnd2QOnndhcffeChQhQnRBFdyCffnftJhDnASzDjTjFjDSCEXLfCMnEjNfRBCRVPfEnndhcffeChQhQnRBFdyCffnftJhEnASzEjNiTjFjDTDEXLfCMnEjNfRBCzBhKUCRVPfEnndBnnd2nIDffeDhQhQhQnRBFdyDffnftZhFnACMCMCMCMCMCMVKfAnneBhaVQfBnnnneBhaVSfCnnnneBhMVTfDnnAFK40BiAS4C0AiAT4D0AiAQ4B0AiAP40BhABEAzOjHjFjUiUjFjYjUiGjSjPjNiTjFjDVAhGBgBbyBn0AFJDnABjzNjTjVjCjUjJjUjMjFiMjBjZjFjSWfEjJfRBEjzGiOjVjNjCjFjSXfRBjzPjTjVjCjUjJjUjMjFiMjBjZjFjSiJiEYfffffnfJEnABjzVjTjVjCjUjJjUjMjFiMjBjZjFjSiUjFjYjUiQjSjPjQZfEXzIjQjSjPjQjFjSjUjZgafjWfRBFeLiTjPjVjSjDjFhAiUjFjYjUffnfJHnASzIjBjFiTjVjCiBjSjZgbAAnnftaIbKn0ACJKnASzHjLjFjZiUjJjNjFgcCEXgcfjZfRBCMVzBjJgdfBnndBffnftJLnAEXzEjQjVjTjIgefVgbfARBWzGiPjCjKjFjDjUgfDzKjTjVjCiUjJjNjFiUjYjUhAEjVfRBVgcfCffzKjTjVjCiUjJjNjFiOjVjNhBVgcfCzKjTjVjCiDjPjOjUjFjOjUhCXzEjUjFjYjUhDfEXzIjLjFjZiWjBjMjVjFhEfjZfRBCMVgdfBnndBffffAVgdfBAXzHjOjVjNiLjFjZjThFfjZfByBzBhchGZNnAEXzJjTjUjSjJjOjHjJjGjZhHfjzEiKiTiPiOhIfRBVgbfAffABnzDjFjSjShJnbyBn0ABJPnAEjzFjBjMjFjSjUhKfRCCMnjhJfeCiBhAnXzEjMjJjOjFhLfjhJfffADgd4B0AiAgb40BiAgc4C0AiAADAzSjSjFjBjEiJjOiTjVjCjUjJjUjMjFiEjBjUjBhMAhH0EzAhNByB")';

const removeTextKey_jsxbin =
     'eval("@JSXBIN@ES@2.1@MyBbyBnABMAbyBnABMMbyBn0ABgNbyBn0ABZOnAEXzJjMjBjZjFjSiCjZiJiEBfXzHjQjSjPjKjFjDjUCfjzDjBjQjQDfRBVzHjMjBjZjFjSiJiEEfAffABnzBjFFnbyBn0ABZQnAFbABE40BhAB0AzMjHjFjUiMjBjZjFjSiCjZiJiEGASDJBnAEXzOjCjFjHjJjOiVjOjEjPiHjSjPjVjQHfjDfRBFePjSjFjNjPjWjFifjTjVjCjUjJjUjMjFffgCbyBn0ADJEnABjzPjTjVjCjUjJjUjMjFiMjBjZjFjSiJiEIfEjzGiOjVjNjCjFjSJfRBjIfffnfJFnABjzNjTjVjCjUjJjUjMjFiMjBjZjFjSKfEjGfRBjIfffnfJGnAEXzJjSjFjNjPjWjFiLjFjZLfEXzIjQjSjPjQjFjSjUjZMfjKfRBFeLiTjPjVjSjDjFhAiUjFjYjUffRBCzBhLNVzNjGjPjSjNiJjUjFjNiJjOjEjFjYOfAnndBffABnFnbyBn0ABJInAEjzFjBjMjFjSjUPfRCjFfXzEjMjJjOjFQfjFfffJKnAEXzMjFjOjEiVjOjEjPiHjSjPjVjQRfjDfnfABO40BhAB0AzNjSjFjNjPjWjFiUjFjYjUiLjFjZSAT0EzATByB")';

const scrollToTime_AE_jsxbin =
     'eval("@JSXBIN@ES@2.1@MyBbyBnADMAbyBn0AGJBnABjzNjGjPjSjNiJjUjFjNiJjOjEjFjYBfXzQjDjVjSiFjEjJjUiJjUjFjNiJjOjEjFjYCfjzGjUjNjQiPjCjKDfnfJCnABjzPjTjVjCjUjJjUjMjFiMjBjZjFjSiJiEEfEjzGiOjVjNjCjFjSFfRBXEfjDfffnfJDnABjzNjTjVjCjUjJjUjMjFiMjBjZjFjSGfEjzMjHjFjUiMjBjZjFjSiCjZiJiEHfRBjEfffnfJEnABjzHjJjUjFjNiGiQiTIfXzJjGjSjBjNjFiSjBjUjFJfXzKjBjDjUjJjWjFiJjUjFjNKfXzHjQjSjPjKjFjDjULfjzDjBjQjQMfnfJFnASzHjLjFjZiUjJjNjFNAEXNfEXzIjQjSjPjQjFjSjUjZOfjGfRBFeLiTjPjVjSjDjFhAiUjFjYjUffRBCzBhLPjBfnndBffnftJInABXzEjUjJjNjFQfXKfXLfjMfCzBhPREXzEjDjFjJjMSfjzEiNjBjUjITfRBCzBhKUVNfAjIfnnffjIfnnnfABN40BiAABAzPjTjDjSjPjMjMiUjPiJjNjFifiBiFjKVAJMLbyBn0ABgMbyBn0ABZNnAEXzIjJjUjFjNiCjZiJiEWfXLfjMfRBVzGjJjUjFjNiJiEXfAffABnzBjFYnbyBn0ABZPnAFbABX40BhAB0AzLjHjFjUiJjUjFjNiCjZiJiEZARMSbyBn0ABgTbyBn0ABZUnAEXzJjMjBjZjFjSiCjZiJiEgafXLfjMfRBVzHjMjBjZjFjSiJiEgbfAffABnYnbyBn0ABZWnAFbABgb40BhAB0AHAY0EzAgcByB")';

const scrollToTime_form_jsxbin =
     'eval("@JSXBIN@ES@2.1@MyBbyBnABMAbyBn0ABaBbyCn0ABOCbyDn0ABZDnACzBhNBVzBjJCfAnndBACzBhcDXzEjUjJjNjFEfXzKjBjDjUjJjWjFiJjUjFjNFfXzHjQjSjPjKjFjDjUGfjzDjBjQjQHfCBXzKjTjVjCiUjJjNjFiOjVjNIfQzAJfjzGjTjVjCiBjSjZKfVCfAnnd8lYgekFnLiRlYkehfnnOEbyFn0ABZFnACBXzGjMjFjOjHjUjILfjKfnndBACzChdhdMVCfACBXLfjKfnndBnnbyHn0ABDHnAJfAVCf0AXLfjKfByBDABC40BiAABAzOjDjBjMjDjVjMjBjUjFiJjOjEjFjYNAK0EJByB")';

const updateAETextContent_jsxbin =
     'eval("@JSXBIN@ES@2.1@MyBbyBnABMAbyBnACMRbyBn0ABgSbyBn0ABZTnAEXzIjJjUjFjNiCjZiJiEBfXzHjQjSjPjKjFjDjUCfjzDjBjQjQDfRBVzGjJjUjFjNiJiEEfAffABnzBjFFnbyBn0ABZVnAFbABE40BhAB0AzLjHjFjUiJjUjFjNiCjZiJiEGAXMYbyBn0ABgZbyBn0ABZganAEXzJjMjBjZjFjSiCjZiJiEHfXCfjDfRBVzHjMjBjZjFjSiJiEIfAffABnFnbyBn0ABZgcnAFbABI40BhAB0AzMjHjFjUiMjBjZjFjSiCjZiJiEJAgeEJBnABjzNjGjPjSjNiJjUjFjNiJjOjEjFjYKfXKfVzFjJjOjQjVjULfAnfJCnABjzLjUjFjYjUiDjPjOjUjFjOjUMfXMfVLfAnfJDnABjzPjTjVjCjUjJjUjMjFiMjBjZjFjSiJiENfEjzGiOjVjNjCjFjSOfRBXNfVLfAffnfgFbyBn0AEJGnAEXzOjCjFjHjJjOiVjOjEjPiHjSjPjVjQPfjDfRBFeNjFjEjJjUifjTjVjCjUjJjUjMjFffJHnABjzNjTjVjCjUjJjUjMjFiMjBjZjFjSQfEjJfRBjNfffnfJLnAEXzNjTjFjUiWjBjMjVjFiBjUiLjFjZRfEXzIjQjSjPjQjFjSjUjZSfjQfRBFeLiTjPjVjSjDjFhAiUjFjYjUffRCCzBhLTjKfnndBjMfffJMnAEXzMjFjOjEiVjOjEjPiHjSjPjVjQUfjDfnfABnzDjFjSjSVnbyBn0ABJOnAEjzFjBjMjFjSjUWfRCjVfXzEjMjJjOjFXfjVfffABL40BhAB0AzTjVjQjEjBjUjFiBiFiUjFjYjUiDjPjOjUjFjOjUYAgf0EzAZByB")';

//bootstrap tooltip
$(function () {
     $('[data-bs-toggle="tooltip"]').tooltip();
});
try {
     (function () {
          "use strict";
          function init() {
               themeManager.init();
          }
          init();
     })();
} catch (err) {
     document.getElementById("main").style.background = "#222222";
}

function getFPS() {
     csInterface.evalScript("app.project.activeItem.frameRate", function (result) {
          projectFPS = result;
     });
}
function getSecFromSRTTime(SRTTime) {
     var hour = parseInt(SRTTime.substring(0, 2)) * 3600;
     var min = parseInt(SRTTime.substring(3, 5)) * 60;
     var sec = parseInt(SRTTime.substring(6, 8));
     var mSec = Math.round((parseInt(SRTTime.substring(9, 12)) / 1000) * projectFPS) / projectFPS;
     return Number(hour + min + sec + mSec);
}

function getTextFromSec(secTime) {
     var hour = ("00" + parseInt(secTime / 3600)).slice(-2);
     var min = ("00" + parseInt((secTime % 3600) / 60)).slice(-2);
     var sec = ("00" + parseInt(secTime % 60)).slice(-2);
     var mSec = ("000" + parseInt((secTime % 1) * 1000)).slice(-3);
     return hour + ":" + min + ":" + sec + "," + mSec;
}

function getElementIndex(formItem) {
     formGroups = Array.prototype.slice.call(subFormsContainer.children);
     let formItemIndex = formGroups.indexOf(formItem.parentNode);
     return Number(formItemIndex);
}

//????????????????????????
$(document).keydown(function (eventRef) {
     var currentInput = document.activeElement;
     var currentTr = currentInput.parentNode;
     switch (eventRef.key) {
          case "ArrowUp":
               // Left pressed
               eventRef.preventDefault();
               var curCusor = currentInput.selectionStart;
               currentTr.previousElementSibling.getElementsByTagName("input")[0].focus();
               document.activeElement.selectionStart = curCusor;
               document.activeElement.selectionEnd = curCusor;
               break;
          case "ArrowDown":
               // Right pressed
               eventRef.preventDefault();
               var curCusor = currentInput.selectionStart;
               currentTr.nextElementSibling.getElementsByTagName("input")[0].focus();
               document.activeElement.selectionStart = curCusor;
               document.activeElement.selectionEnd = curCusor;
               break;
     }
});

//=============================================================
//====================   htmlElements   =======================
//=============================================================

function updateSubForms() {
     if (subAry.length > 0) {
          subFormsContainer = document.getElementById("subForms");
          while (subFormsContainer.firstChild) {
               subFormsContainer.removeChild(subFormsContainer.firstChild);
          }

          for (let i = 0; i < subAry.length; i++) {
               subFormsContainer.appendChild(createformGroup(subAry[i]));
          }
     }
}
function createformGroup(subObj) {
     let newDiv = document.createElement("div");
     let newInnerHtml =
          '<button class="btn btn-subTimeBtn subTimeTxt" onclick="if(event.shiftKey){insertSub(event.target);}else if(event.altKey){removeSub(event.target)}else{scrollToTime_AE(event.target)}">' +
          subObj.subTimeTxt.substr(3, 5) +
          '</button><input type="text" class="form-control" aria-label="SubText" aria-describedby="basic-addon1" oninput="updateAETextcontent(event.target)" onfocus="scrollToTime_AE(event.target)" value="' +
          subObj.subContent.toString() +
          '">';
     newDiv.innerHTML = newInnerHtml;
     newDiv.classList = "input-group mb-3";
     return newDiv;
}

//Change SubTime Button when Alt, Shift key down
root.style.setProperty("--btnTxtHoverColor", `#fff`);
root.style.setProperty("--btnBGHoverColor", `#6c757d`);
document.addEventListener("keydown", function (eventRef) {
     if (eventRef.shiftKey) {
          root.style.setProperty("--btnBGHoverColor", `#0069d9`);
     } else if (eventRef.altKey) {
          root.style.setProperty("--btnBGHoverColor", `#bb2d3b`);
     } else {
          root.style.setProperty("--btnBGHoverColor", `#6c757d`);
     }
});
document.addEventListener("keyup", function (eventRef) {
     root.style.setProperty("--btnBGHoverColor", `#6c757d`);
});

document.addEventListener("mouseenter", function (eventRef) {
     if (subtitleLayerID != null) {
          readSubtitleData();
     }
});

////=============================================================
////=============================================================
////=============================================================

function readInSRT(srtFile) {
     console.log(srtFile);
     var subTxt = cep.encoding.convertion.b64_to_utf8(window.cep.fs.readFile(srtFile, cep.encoding.Base64).data);
     preAry = subTxt.split("\n\n");
     subAry = [{ subTimeTxt: "00:00:00,000", subTimeNum: 0, subContent: "" }];
     for (let i = 0; i < preAry.length; i++) {
          let curTimeAry = preAry[i].split("\n")[1].match(/[\d:,]+/g);
          subAry.push({
               subTimeTxt: getTextFromSec(getSecFromSRTTime(curTimeAry[0])),
               subTimeNum: getSecFromSRTTime(curTimeAry[0]),
               subContent: preAry[i].split("\n")[2],
          });
          //????????????????????????????????????
          if (i < preAry.length - 1) {
               let nextTimeAry = preAry[i + 1].split("\n")[1].match(/[\d:,]+/g);
               if (getSecFromSRTTime(nextTimeAry[0]) - getSecFromSRTTime(curTimeAry[1]) > 0.5) {
                    subAry.push({
                         subTimeTxt: getTextFromSec(getSecFromSRTTime(curTimeAry[1])),
                         subTimeNum: getSecFromSRTTime(curTimeAry[1]),
                         subContent: "",
                    });
               }
          }
     }
}
function readInTxtLayer() {
     try {
          csInterface.evalScript("if(app.project.activeItem.selectedLayers.length>0){app.project.activeItem.selectedLayers[0].id}else{null}", function (result) {
               if (result != null) {
                    subtitleLayerID = result;
               } else {
                    return;
               }
          });
          csInterface.evalScript("subtitleLayerID=app.project.activeItem.selectedLayers[0].id;" + readInSubtitleData_jsxbin + ";readInSubtitleData()", function (result) {
               subAry = JSON.parse(result);
          });
     } catch (e) {
          alert(e, e.line);
     }
     return new Promise((r) => setTimeout(r, 500));
}

function creatTextKeys() {
     csInterface.evalScript("try{" + createTextKeys_jsxbin + ";createTextKeys(" + JSON.stringify(subAry) + ")}catch(err){alert(err,err.line)}", function (result) {
          subtitleLayerID = result;
     });
}

function updateAETextcontent(formItem) {
     let curEditItemIndex = getElementIndex(formItem);
     var curContent = formItem.value.toString();
     let tmpObj = new Object();
     tmpObj.formItemIndex = curEditItemIndex;
     tmpObj.textContent = curContent;
     tmpObj.subtitleLayerID = subtitleLayerID;
     subAry[curEditItemIndex].subContent = tmpObj.textContent;
     csInterface.evalScript("try{" + updateAETextContent_jsxbin + "; updateAETextContent(" + JSON.stringify(tmpObj) + ");}catch(e){alert(err)}");

     prevEditItemIndex = curEditItemIndex;
}

function scrollToTime_AE(formItem) {
     let curEditItemIndex = getElementIndex(formItem);
     let tmpObj = new Object();
     tmpObj.curEditItemIndex = curEditItemIndex;
     tmpObj.subtitleLayerID = subtitleLayerID;
     csInterface.evalScript("tmpObj=" + JSON.stringify(tmpObj) + ";" + scrollToTime_AE_jsxbin + ";scrollToIme_AEj()");
}

function scrollToTime_form() {
     csInterface.evalScript("app.project.activeItem.time", function (aeTime) {
          for (let i = 0; i < subAry.length; i++) {
               if (aeTime < subAry[i].subTimeNum - 0.03) {
                    subFormsContainer.children[i - 1].children[0].focus();
                    return;
               } else if (i == subAry.length - 1) {
                    subFormsContainer.children[subAry.length - 1].children[0].focus();
               } else {
                    continue;
               }
          }
     });
}

function insertSub(formItem) {
     let formItemIndex = getElementIndex(formItem);
     let newTime;
     if (subAry.length - 1 == formItemIndex) {
          newTime = subAry[formItemIndex].subTimeNum + 1;
     } else {
          newTime = Math.round((subAry[formItemIndex].subTimeNum * 0.2 + subAry[formItemIndex + 1].subTimeNum * 0.8) * projectFPS) / projectFPS;
     }
     let tmpObject = { subTimeTxt: getTextFromSec(newTime), subTimeNum: newTime, subContent: "" };
     subAry.splice(formItemIndex + 1, 0, tmpObject);
     let newGroup = subFormsContainer.insertBefore(createformGroup(tmpObject), formGroups[formItemIndex + 1]);
     csInterface.evalScript("subtitleLayerID=" + subtitleLayerID + ";" + addTextKey_jsxbin + ";createTextKey(" + JSON.stringify(tmpObject) + ")");
     newGroup.getElementsByTagName("input")[0].focus();
     formItem.blur();
}
function removeSub(formItem) {
     let formItemIndex = getElementIndex(formItem);
     subAry.splice(formItemIndex, 1);
     subFormsContainer.removeChild(formItem.parentNode);
     csInterface.evalScript("subtitleLayerID=" + subtitleLayerID + ";" + removeTextKey_jsxbin + ";removeTextKey(" + formItemIndex + ")");
}

function readSubtitleData() {
     var aeSubAry = [];
     csInterface.evalScript("subtitleLayerID=" + subtitleLayerID + ";" + readInSubtitleData_jsxbin + ";readInSubtitleData()", function (result) {
          aeSubAry = JSON.parse(result);
          if (subAry != aeSubAry) {
               for (let i = 0; i < subAry.length; i++) {
                    if (subAry[i].subTimeTxt != aeSubAry[i].subTimeTxt) {
                         subFormsContainer.children[i].children[0].innerHTML = aeSubAry[i].subTimeTxt.substr(3, 5);
                         subFormsContainer.children[i].children[0].classList.add("changedForm");
                         document.addEventListener("keydown", function removeCSS() {
                              subFormsContainer.children[i].children[0].classList.remove("changedForm");
                              document.removeEventListener("keydown", removeCSS());
                         });
                    }
                    if (subAry[i].subContent != aeSubAry[i].subContent) {
                         subFormsContainer.children[i].children[1].value = aeSubAry[i].subContent;
                         subFormsContainer.children[i].children[1].classList.add("changedForm");
                         document.addEventListener("keydown", function removeCSS() {
                              subFormsContainer.children[i].children[1].classList.remove("changedForm");
                              document.removeEventListener("keydown", removeCSS());
                         });
                    }
               }
          }
          subAry = aeSubAry;
     });
}

async function importSRT(file) {
     getFPS();
     readInSRT(file);
     creatTextKeys();
     updateSubForms();
}
async function importTxtLayer() {
     try {
          getFPS();
          await readInTxtLayer();
          updateSubForms();
     } catch (e) {
          alert(e, e.line);
     }
}
function setKeyOnSelectedTxtLayer() {
     csInterface.evalScript(";app.project.activeItem.selectedLayers[0].id;", function (result) {
          if (result != subtitleLayerID) {
               creatTextKeys();
          } else {
               alert("??????????????????????????????????????????????????????????????????");
          }
     });
}
