function keyToMarker(){

    app.beginUndoGroup("keyToMarker")

    var layer = app.project.activeItem.selectedLayers[0]
    var markerProp = layer.property("Marker")
    var sourceTextProp = layer.property("Source Text")
    var sourceTexts = []
    var sourceTextsTime = []

    var win = new Window("palette","轉換中...",undefined)
    win.progress = win.add("progressbar",[0,0,200,20],0,sourceTextProp.numKeys,0)
    win.show()
    win.update()
    if( sourceTextProp.numKeys > 0 ){
        // 紀錄 SourceText Key 資訊
        for( var i = 1; i <= sourceTextProp.numKeys ; i++){
            sourceTexts[sourceTexts.length] = sourceTextProp.keyValue(i).text
            sourceTextsTime[sourceTextsTime.length] = sourceTextProp.keyTime(i)
        }

        // 清空既有 Marker
        for ( var i = markerProp.numKeys; i > 0; i--){
            markerProp.removeKey(i)
        }

        // 設定新 Marker
        for( var i = 0; i < sourceTexts.length ; i++){    
            markerProp.setValueAtTime(sourceTextsTime[i], new MarkerValue(sourceTexts[i]))
            win.progress.value = i
            win.update()
        }
        win.close()
        sourceTextProp.expressionEnabled = true
    }

    app.endUndoGroup()
}