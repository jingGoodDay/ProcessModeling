/**
 * Created by RJ on 2018/1/5.
 */
let map={
    instance:jsPlumb.getInstance({
        // default drag options
        DragOptions: { cursor: 'pointer', zIndex: 2000 },
        // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
        // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
        //连接线上覆盖物的效果
        ConnectionOverlays: [
            //添加箭头效果
            [ "Arrow", {
                location: 1,
                visible:true,
                width:11,
                length:11,
                id:"ARROW",
                // events:{
                //     click:function() { console.log("you clicked on the arrow overlay")}
                // }
            } ]
            //连接线中间添加的文本
            // [ "Label", {
            //     location: 0.5,
            //     id: "label",
            //     cssClass: "aLabel",
            //     events:{
            //         click:function() { console.log("hey"); }
            //     }
            // }]
            //可自定义覆盖物类型
            // ["Custom", {
            //     create:function(component) {
            //         return $("<select id='myDropDown'><option value='foo'>foo</option><option value='bar'>bar</option></select>");
            //     },
            //     location:0.5,
            //     id:"customOverlay"
            // }]
        ],
        //流程图的容器
        Container: "myholder"
    }),
    // this is the paint style for the connecting lines..
    connectorPaintStyle : {
        //连接线的默认样式
        strokeWidth: 2,
        stroke: "#61B7CF",
        joinstyle: "round",
        outlineStroke: "white",
        outlineWidth: 2
    },
    // 连接线的hover样式
    connectorHoverStyle : {
        strokeWidth: 3,
        stroke: "#216477",
        outlineWidth: 5,
        outlineStroke: "white"
    },
    //端点的hover样式
    endpointHoverStyle : {
        fill: "#216477",
        stroke: "#216477"
    },
    // 源头端点的样式设置
    Endpoint : {
        endpoint: "Dot",
        paintStyle: { fill: "#3398C9", radius: 5 },
        // paintStyle: {
        //     stroke: "#3398C9",
        //     fill: "transparent",
        //     radius: 7,
        //     strokeWidth: 1
        // },
        isSource: true,
        isTarget: true,
        connector: [ "Flowchart", { stub: 10, gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
        connectorStyle: {
            //连接线的默认样式
            strokeWidth: 2,
            stroke: "#61B7CF",
            joinstyle: "round",
            outlineStroke: "white",
            outlineWidth: 2
        },
        hoverPaintStyle: {
            fill: "#216477",
            stroke: "#216477"
        },
        maxConnections: -3,//每个端点最多连接3条线
        connectorHoverStyle: {
            strokeWidth: 3,
            stroke: "#216477",
            outlineWidth: 5,
            outlineStroke: "white"
        },
        dragOptions: {},
        dropOptions: { hoverClass: "hover", activeClass: "active" }
        // overlays: [
        //     [ "Label", {
        //         location: [0.5, 1.5],
        //         label: "Drag",
        //         cssClass: "endpointSourceLabel",
        //         visible:false
        //     } ]
        // ]
    },
    // the definition of target endpoints (will appear when the user drags a connection)
    // targetEndpoint : {
    //     endpoint: "Dot",
    //     paintStyle: { fill: "#3398C9", radius: 7 },
    //     hoverPaintStyle: endpointHoverStyle,
    //     maxConnections: -1,
    //     dropOptions: { hoverClass: "hover", activeClass: "active" },
    //     isTarget: true,
    //     overlays: [
    //         [ "Label", { location: [0.5, -0.5], label: "Drop", cssClass: "endpointTargetLabel", visible:false } ]
    //     ]
    // },

    initMap:function (windowID) {

        jsPlumb.ready(function() {
            let _addEndpoints = function (toId, sourceAnchors) {
                for (let i = 0; i < sourceAnchors.length; i++) {
                    let sourceUUID = toId + sourceAnchors[i];
                    map.instance.addEndpoint(toId, map.Endpoint, {
                        anchor: sourceAnchors[i], uuid: sourceUUID
                    });
                }
            };


            //在连接线上显示是哪两个组件相连
            // init = function (connection) {
            //     connection.getOverlay("label").setLabel(connection.sourceId.substring(15) + "-" + connection.targetId.substring(15));
            // };


            _addEndpoints(windowID, ["TopCenter", "BottomCenter"]);

            // listen for new connections; initialise them the same way we initialise the connections at startup.
            map.instance.bind("connection", function (connInfo, originalEvent) {
                init(connInfo.connection);
            });

            // make all the window divs draggable
            map.instance.draggable(jsPlumb.getSelector("#myholder .item"), { grid: [20, 20] });
            // THIS DEMO ONLY USES getSelector FOR CONVENIENCE. Use your library's appropriate selector
            // method, or document.querySelectorAll:
            //jsPlumb.draggable(document.querySelectorAll(".window"), { grid: [20, 20] });

            // // connect a few up
            // instance.connect({uuids: ["Window2BottomCenter", "Window3TopCenter"], editable: true});
            // instance.connect({uuids: ["Window2LeftMiddle", "Window4LeftMiddle"], editable: true});
            // instance.connect({uuids: ["Window4TopCenter", "Window4RightMiddle"], editable: true});
            //

            //
            // listen for clicks on connections, and offer to delete connections on click.
            //
            map.instance.bind("click", function (conn, originalEvent) {
                // if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
                //   instance.detach(conn);
                conn.toggleType("basic");
            });

            map.instance.bind("connectionDrag", function (connection) {
                console.log("connection " + connection.id + " is being dragged. suspendedElement is ", connection.suspendedElement, " of type ", connection.suspendedElementType);
            });

            map.instance.bind("connectionDragStop", function (connection) {
                console.log("connection " + connection.id + " was dragged");
            });

            map.instance.bind("connectionMoved", function (params) {
                console.log("connection " + params.connection.id + " was moved");
            });
            // suspend drawing and initialise.
            // instance.batch(function () {
            //
            //
            // });

            jsPlumb.fire("jsPlumbDemoLoaded", map.instance);


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