/**
 * Created by RJ on 2018/1/5.
 */
var map={
    initMap:function () {
        var graph = new joint.dia.Graph;
        var paper = new joint.dia.Paper({
            el: $('#myholder'),
            width: 1000,
            height: 350,
            model: graph,
            gridSize: 1
        });
        var rect = new joint.shapes.basic.Rect({
            position: { x: 100, y: 30 },
            size: { width: 100, height: 30 },
            attrs: { rect: { fill: 'blue' }, text: { text: 'my box', fill: 'white' } }
        });
        graph.addCell(rect);
    }
};