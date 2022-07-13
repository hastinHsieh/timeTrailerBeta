function markerToKey(){

    app.beginUndoGroup("markerToKey")

    var layer = app.project.activeItem.selectedLayers[0]
    var markerProp = layer.property("Marker")
    var sourceTextProp = layer.property("Source Text")
    var markers = []
    var markersTime = []

    var win = new Window("palette","轉換中...",undefined)
    win.progress = win.add("progressbar",[0,0,200,20],0,markerProp.numKeys,0)
    win.show()
    win.update()
    
    // 紀錄 Marker 資訊
    for( var i = 1; i <= markerProp.numKeys ; i++){
        markers[markers.length] = markerProp.keyValue(i).comment
        markersTime[markersTime.length] = markerProp.keyTime(i)
    }

    // 清空既有 SourceText Key
    for ( var i = sourceTextProp.numKeys; i > 0; i--){
        sourceTextProp.removeKey(i)
    }


    // 設定新 SourceText
    for( var i = 0; i < markers.length ; i++){    
        // sourceTextProp.setValueAtTime(markersTime[i], newTextDocument(markers[i]))
        sourceTextProp.setValueAtTime(markersTime[i], new TextDocument(markers[i]))
        win.progress.value = i
        win.update()
    }
    win.close()
    sourceTextProp.expressionEnabled = false

    app.endUndoGroup()
}