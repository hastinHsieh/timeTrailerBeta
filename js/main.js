/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

const root = document.documentElement;
var script = document.currentScript;
var fullUrl = script.src;
//TODO: check function when online
var rootPath = fullUrl.toString().replace("file:///", "").replace("main.js", "") + "../jsx/";
var csInterface = new CSInterface();
var subAry = new Array();
var subFormsContainer = document.getElementById("subForms");
var projectFPS = 24;
var subtitleLayerID = null;
var prevEditItemIndex = 0;
var curEditItemIndex = 0;

(function () {
     "use strict";
     function init() {
          themeManager.init();
     }
     init();
})();

//bootstrap tooltip
$(function () {
     $('[data-bs-toggle="tooltip"]').tooltip();
});

function executeScript(scriptPath) {
     try {
          csInterface.evalScript('$.evalFile("' + rootPath + scriptPath + '")');
     } catch (err) {
          alert(err, err.line);
     }
     $("button").tooltip("hide");
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

//上下鍵切換輸入框
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
          //間隔過長的話，加入空白格
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
          csInterface.evalScript('subtitleLayerID=app.project.activeItem.selectedLayers[0].id;$.evalFile("' + rootPath + 'readInSubtitleData.jsx");readInSubtitleData()', function (result) {
               subAry = JSON.parse(result);
          });
     } catch (e) {
          alert(e, e.line);
     }
     return new Promise((r) => setTimeout(r, 500));
     // alert(subAry == aeSubAry);
}

function creatTextKeys() {
     csInterface.evalScript('try{$.evalFile("' + rootPath + 'createTextKeys.jsx");createTextKeys(' + JSON.stringify(subAry) + ")}catch(err){alert(err,err.line)}", function (result) {
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
     csInterface.evalScript('try{$.evalFile("' + rootPath + 'updateAETextContent.jsx"); updateAETextContent(' + JSON.stringify(tmpObj) + ");}catch(e){alert(err)}");

     prevEditItemIndex = curEditItemIndex;
}

function scrollToTime_AE(formItem) {
     let curEditItemIndex = getElementIndex(formItem);
     let tmpObj = new Object();
     tmpObj.curEditItemIndex = curEditItemIndex;
     tmpObj.subtitleLayerID = subtitleLayerID;
     csInterface.evalScript("tmpObj=" + JSON.stringify(tmpObj) + ';$.evalFile("' + rootPath + 'scrollToTime_AE.jsx");');
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
     csInterface.evalScript("subtitleLayerID=" + subtitleLayerID + ';$.evalFile("' + rootPath + 'addTextKey.jsx");createTextKey(' + JSON.stringify(tmpObject) + ")");
     newGroup.getElementsByTagName("input")[0].focus();
     formItem.blur();
}
function removeSub(formItem) {
     let formItemIndex = getElementIndex(formItem);
     subAry.splice(formItemIndex, 1);
     subFormsContainer.removeChild(formItem.parentNode);
     csInterface.evalScript("subtitleLayerID=" + subtitleLayerID + ';$.evalFile("' + rootPath + 'removeTextKey.jsx");removeTextKey(' + formItemIndex + ")");
}

function readSubtitleData() {
     var aeSubAry = [];
     csInterface.evalScript("subtitleLayerID=" + subtitleLayerID + ';$.evalFile("' + rootPath + 'readInSubtitleData.jsx");readInSubtitleData()', function (result) {
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

function importSRT(file) {
     alert("A");
     getFPS();
     readInSRT(file);
     creatTextKeys();
     updateSubForms();
}
function importTxtLayer() {
     getFPS();
     await readInTxtLayer();
     updateSubForms();
}
function setKeyOnSelectedTxtLayer() {
     csInterface.evalScript("app.project.activeItem.selectedLayers[0].id;", function (result) {
          if (result != subtitleLayerID) {
               creatTextKeys();
          } else {
               alert("請選擇設定好文字樣式的新圖層，以替換字幕樣式");
          }
     });
}
