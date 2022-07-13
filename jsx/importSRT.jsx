function importSRT() {
     try {
          //宣告後續是否要取代現有OISEE Subtitle圖層(預設為要取代)
          // 依照 SRT 的 TimeStamp 決定字幕 Marker 要插入的時間
          function insertMarkerBySRT(myLayer, textLines) {
               // SRT 的格式會是這樣，需轉成 Marker 吃的格式
               // 00:00:02,586 => 2.58608608608609
               // 00:25:10,143 => 1510.14347681014
               // 00:36:49,142 => 2209.14247580914
               // 01:01:00,393 => 3660.39372706039
               function getSecFromSRTTime(SRTTime) {
                    var hour = parseInt(SRTTime.substring(0, 2)) * 3600;
                    var min = parseInt(SRTTime.substring(3, 5)) * 60;
                    var sec = parseInt(SRTTime.substring(6, 8));
                    var mSec = parseInt(SRTTime.substring(9));
                    return hour + min + sec + ("." + mSec);
               }

               for (var i = 0; i < textLines.length; i += 4) {
                    // SRT 的 TimeStamp 欄位
                    var timeStamp = textLines[i + 1].substring(0, 12);
                    // SRT 的字幕欄位
                    var line = textLines[i + 2];
                    if (timeStamp === "00:00:00,000") {
                         continue;
                    }
                    if (myLayer.activeAtTime(Number(getSecFromSRTTime(timeStamp)) + 0.5)) {
                         myLayer.property("Marker").setValueAtTime(getSecFromSRTTime(timeStamp), new MarkerValue(line));
                    }
                    if (myLayer.outPoint < getSecFromSRTTime(timeStamp)) {
                         // break;
                    }
               }
          }

          // 選取要匯入的字幕純文字檔案

          var textFile = File.openDialog("選取 SRT 字幕檔", "*.srt");
          if (textFile != null) {
               // 將純文字檔內容全部存進陣列
               var textLines = new Array();
               textFile.open("r", "TEXT", "????");
               while (!textFile.eof) {
                    textLines[textLines.length] = textFile.readln();
               }
               textFile.close();

               var subFormat;
               // 1. 建立一個新的文字圖層 Text Layer
               if (app.project.activeItem.selectedLayers[0] != null && replaceSubtitleLayer == true) {
                    //如果有選擇圖層，且按下按鈕時沒有按住Shift，取代選擇的圖層
                    subtitleLayers = app.project.activeItem.selectedLayers;
               } else {
                    subtitleLayers = [app.project.activeItem.layers.addText()];
                    subtitleLayers[0].applyPreset(File(File($.fileName).path + "/../presets/textStyle.ffx"));
                    subtitleLayers[0].name = "OISEE Subtitle";
                    subtitleLayers[0].startTime = 0;
                    // 2. 設定圖層的文字大小、位置、置中對齊 以及 Expression
                    if (subFormat == "CHT") {
                         setCHTSubtitleLayerFormat(subtitleLayers[0]);
                    } else if (subFormat == "ENG") {
                         setENGSubtitleLayerFormat(subtitleLayers[0]);
                    } else {
                         setSubtitleLayerFormat(subtitleLayers[0]);
                    }
               }

               // 2. 插入 Marker
               //影片開頭新增空白 Marker，防止某些 bug (註1)
               for (var i = 0; i < subtitleLayers.length; i++) {
                    subtitleLayers[i].property("Marker").setValueAtTime(0, new MarkerValue(""));
                    insertMarkerBySRT(subtitleLayers[i], textLines);
               }
          }
     } catch (err) {
          alert(err, err.line);
     }
}
