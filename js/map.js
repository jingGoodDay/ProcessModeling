/**
 * Created by RJ on 2018/1/5.
 */
let map={
    initMap:function () {
        //-----------jointjs的hello world-----------------//
        // let graph = new joint.dia.Graph;
        // let paper = new joint.dia.Paper({
        //     el: $('#myholder'),
        //     width: 1000,
        //     height: 350,
        //     model: graph,
        //     gridSize: 1
        // });
        // let rect = new joint.shapes.basic.Rect({
        //     position: { x: 100, y: 30 },
        //     size: { width: 100, height: 30 },
        //     attrs: { rect: { fill: 'blue' }, text: { text: 'my box', fill: 'white' } }
        // });
        // graph.addCell(rect);
        //-----------jointjs的hello world End-----------------//
        // 拖拽列表添加流程图元素


        jsPlumb.ready(function() {

            let instance = jsPlumb.getInstance({
                // default drag options
                DragOptions: { cursor: 'pointer', zIndex: 2000 },
                // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
                // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
                ConnectionOverlays: [
                    [ "Arrow", {
                        location: 1,
                        visible:true,
                        width:11,
                        length:11,
                        id:"ARROW",
                        events:{
                            click:function() { console.log("you clicked on the arrow overlay")}
                        }
                    } ],
                    [ "Label", {
                        location: 0.1,
                        id: "label",
                        cssClass: "aLabel",
                        events:{
                            click:function() { console.log("hey"); }
                        }
                    }]
                ],
                Container: "myholder"
            });

            // this is the paint style for the connecting lines..
            let connectorPaintStyle = {
                //连接线的默认样式
                    strokeWidth: 2,
                    stroke: "#61B7CF",
                    joinstyle: "round",
                    outlineStroke: "white",
                    outlineWidth: 2
                },
                // 连接线的hover样式
                connectorHoverStyle = {
                    strokeWidth: 3,
                    stroke: "#216477",
                    outlineWidth: 5,
                    outlineStroke: "white"
                },
                //端点的hover样式
                endpointHoverStyle = {
                    fill: "#216477",
                    stroke: "#216477"
                },
                // 源头端点的样式设置
                sourceEndpoint = {
                    endpoint: "Dot",
                    paintStyle: {
                        stroke: "#3398C9",
                        fill: "transparent",
                        radius: 7,
                        strokeWidth: 1
                    },
                    isSource: true,
                    connector: [ "Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
                    connectorStyle: connectorPaintStyle,
                    hoverPaintStyle: endpointHoverStyle,
                    connectorHoverStyle: connectorHoverStyle,
                    dragOptions: {},
                    overlays: [
                        [ "Label", {
                            location: [0.5, 1.5],
                            label: "Drag",
                            cssClass: "endpointSourceLabel",
                            visible:false
                        } ]
                    ]
                },
                // the definition of target endpoints (will appear when the user drags a connection)
                targetEndpoint = {
                    endpoint: "Dot",
                    paintStyle: { fill: "#3398C9", radius: 7 },
                    hoverPaintStyle: endpointHoverStyle,
                    maxConnections: -1,
                    dropOptions: { hoverClass: "hover", activeClass: "active" },
                    isTarget: true,
                    overlays: [
                        [ "Label", { location: [0.5, -0.5], label: "Drop", cssClass: "endpointTargetLabel", visible:false } ]
                    ]
                },
                init = function (connection) {
                    connection.getOverlay("label").setLabel(connection.sourceId.substring(15) + "-" + connection.targetId.substring(15));
                };
                let _addEndpoints = function (toId, sourceAnchors, targetAnchors) {
                    for (let i = 0; i < sourceAnchors.length; i++) {
                        let sourceUUID = toId + sourceAnchors[i];
                        instance.addEndpoint(toId, sourceEndpoint, {
                            anchor: sourceAnchors[i], uuid: sourceUUID
                        });
                    }
                    for (let j = 0; j < targetAnchors.length; j++) {
                        let targetUUID = toId + targetAnchors[j];
                        instance.addEndpoint(toId, targetEndpoint, { anchor: targetAnchors[j], uuid: targetUUID });
                    }
                };

                _addEndpoints("Window4", ["TopCenter", "BottomCenter"], ["LeftMiddle", "RightMiddle"]);
                _addEndpoints("Window2", ["LeftMiddle", "BottomCenter"], ["TopCenter", "RightMiddle"]);
                _addEndpoints("Window3", ["RightMiddle", "BottomCenter"], ["LeftMiddle", "TopCenter"]);
                _addEndpoints("Window1", ["LeftMiddle", "RightMiddle"], ["TopCenter", "BottomCenter"]);

                // listen for new connections; initialise them the same way we initialise the connections at startup.
                instance.bind("connection", function (connInfo, originalEvent) {
                    init(connInfo.connection);
                });

                // make all the window divs draggable
                instance.draggable(jsPlumb.getSelector(".flowchart-demo .window"), { grid: [20, 20] });
                // THIS DEMO ONLY USES getSelector FOR CONVENIENCE. Use your library's appropriate selector
                // method, or document.querySelectorAll:
                //jsPlumb.draggable(document.querySelectorAll(".window"), { grid: [20, 20] });

                // connect a few up
                instance.connect({uuids: ["Window2BottomCenter", "Window3TopCenter"], editable: true});
                instance.connect({uuids: ["Window2LeftMiddle", "Window4LeftMiddle"], editable: true});
                instance.connect({uuids: ["Window4TopCenter", "Window4RightMiddle"], editable: true});
                instance.connect({uuids: ["Window3RightMiddle", "Window2RightMiddle"], editable: true});
                instance.connect({uuids: ["Window4BottomCenter", "Window1TopCenter"], editable: true});
                instance.connect({uuids: ["Window3BottomCenter", "Window1BottomCenter"], editable: true});
                //

                //
                // listen for clicks on connections, and offer to delete connections on click.
                //
                instance.bind("click", function (conn, originalEvent) {
                    // if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
                    //   instance.detach(conn);
                    conn.toggleType("basic");
                });

                instance.bind("connectionDrag", function (connection) {
                    console.log("connection " + connection.id + " is being dragged. suspendedElement is ", connection.suspendedElement, " of type ", connection.suspendedElementType);
                });

                instance.bind("connectionDragStop", function (connection) {
                    console.log("connection " + connection.id + " was dragged");
                });

                instance.bind("connectionMoved", function (params) {
                    console.log("connection " + params.connection.id + " was moved");
                });
                // suspend drawing and initialise.
                // instance.batch(function () {
                //
                //
                // });

                jsPlumb.fire("jsPlumbDemoLoaded", instance);


            // 创建实例，配置默认的绘制属性，建立通用绘图方式等
            // jsPlumb.setContainer($('#myholder'));
            // let defaultAnchors = ["Top", "Right", "Bottom", "Left", [0.25, 0, 0, -1], [0.75, 0, 0, -1], [0.25, 1, 0, 1], [0.75, 1, 0, 1]
            //     , [0, 0.25, 0, -1], [0, 0.75, 0, -1], [1, 0.25, 0, 1], [1, 0.75, 0, 1]];//设置锚点的位置
            //
            // firstInstance.registerEndpointTypes({
            //     "basic":{
            //         endpoint:"Dot",
            //         paintStyle:{ radius:5, fill:'#ffffff',stroke:"#FFBA13",strokeWidth:2},
            //         connectorStyle : { stroke:"#FFBA13" , strokeWidth:3 },
            //         isTarget:true,
            //         isSource:true,
            //         scope:"blueline",
            //         dragAllowedWhenFull:false
            //     }
            //     // "selected":{
            //     //     endpoint:"Dot",
            //     //     paintStyle:{ radius:5, fill:'#FFBA13'},
            //     //     connectorStyle : { stroke:"#FFBA13" , strokeWidth:3 },
            //     //     isTarget:true,
            //     //     isSource:true
            //     // }
            // });//设置一种默认的端点样式
            // let EndpointOptions = {
            //     isTarget:true,
            //     isSource:true
            // };//设置一种默认的端点样式
            //
            //  firstInstance.importDefaults({
            //     PaintStyle:{
            //         strokeWidth:4,
            //         stroke:"#FFEC54",
            //         outlineStroke:"#FFBA13",
            //         outlineWidth:2
            //     },
            //     // Connector:[ "Bezier", { curviness: 30 } ],
            //     Connector:[ "Flowchart"],
            //     Endpoint:[ "Dot", { radius:5 } ],
            //     EndpointStyle : { fill: "#FFBA13"  },
            //     Anchor : [ defaultAnchors ],
            //     DragOptions: { cursor: 'pointer', zIndex: 2000 },
            //     // ConnectionOverlays: [
            //     //     ["Arrow", {
            //     //         location: 1,
            //     //         //foldback: 1,
            //     //         foldback: 0.618, ///0.618： 普通箭头，1：平底箭头，2：钻石箭头
            //     //         visible: true,
            //     //         id: "arrow"
            //     //     }],
            //     //     ["Label", { location: 0.5, label: "XXX", cssClass: "endpointTargetLabel", visible: true, id: "label" }]
            //     // ]
            //     ConnectionOverlays:[
            //         ["Custom", {
            //             create:function(component) {
            //                 return $("<select id='myDropDown'><option value='foo'>foo</option><option value='bar'>bar</option></select>");
            //             },
            //             location:0.5,
            //             id:"customOverlay"
            //         }]
            //     ]
            //     // ConnectionsDetachable:false//禁止拖动连接线
            // });
            //
            //
            //
            // firstInstance.setSuspendDrawing(true);
            // //使组件可拖动
            // firstInstance.draggable(
            //     [$('#element1'),$('#element2'),$('#element3')]
            //     // {grid:[50,50]}
            // );
            //
            // //连接两个组件
            // // firstInstance.connect({
            // //     source:"element1",
            // //     target:"element2"
            // //     // endpoint:[EndpointOptions]
            // //     // endpoint:[ "Rectangle", {
            // //     //     cssClass:"myEndpoint",
            // //     //     width:3,
            // //     //     height:1
            // //     // }]
            // //     // anchor:"Continuous"
            // // });
            //
            // let endpoint=firstInstance.addEndpoints(["element1","element2","element3"],[{anchor:"Bottom",type:"basic"},{anchor:"Top",type:"basic"}],EndpointOptions);
            // //失败
            // // for (let i=0; i<endpoint.length;i++){
            // //     endpoint[i].bind("mouseover", function(e) {
            // //         endpoint[i].toggleType("selected");
            // //     });
            // //     endpoint[i].bind("mouseout", function(e) {
            // //         endpoint[i].toggleType("basic");
            // //     });
            // // }
            // firstInstance.selectEndpoints({
            //     scope:"terminal"
            // }).toggleType("selected");
            // //连接时跳出
            // firstInstance.bind("connection", function(info) {
            //     console.log("1111");
            // });
            // firstInstance.setSuspendDrawing(false, true);

        });

    }
};