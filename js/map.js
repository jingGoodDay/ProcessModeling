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

    newMap:function (windowID) {

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



            // suspend drawing and initialise.
            // instance.batch(function () {
            //
            //
            // });



            jsPlumb.fire("jsPlumbDemoLoaded", map.instance);

        });

    },

    init:function () {
        //单击删除连接线
        map.instance.bind("click", function (connection, originalEvent) {
            if (confirm("删除" + connection.sourceId + " 和 " + connection.targetId + "的连接线?"))
                map.instance.deleteConnection(connection);
        });

        map.instance.bind("connection", function (connection, originalEvent) {
            console.log("connection.sourceId:"+connection.sourceId+",connection.targetId:"+connection.targetId);
            if (connection.sourceId == connection.targetId) {
                // map.instance.deleteConnection(connection);
                console.log("不能连接自己！");
            }else{
                console.log("连接"+connection.sourceId+"==="+connection.targetId);
                //连接两个单元时，显示模态框

                $('#myModal').modal();
                //设置模态框中两个关联表格的名字
                $('#myModal .listA').text($('#'+connection.sourceId).text());
                $('#myModal .listB').text($('#'+connection.targetId).text());

            }
        });

        //每个建模单元的右上角添加一个小叉叉，用于删除单元
        $("#myholder").on("mouseenter", ".item", function () {
            $(this).append('<div class="del"><i class="iconfont">&#xe631;</i></div>');
            $('#myholder .del').on('click',function () {
                if (confirm("确定要删除吗?")) {
                    map.instance.removeAllEndpoints($(this).parent().attr("id"));
                    $(this).parent().remove();
                }
            });
        });
        //鼠标从建模单元上移开时，移除右上角小叉叉
        $("#myholder").on("mouseleave", ".item", function () {
            $(this).children(".del").remove();
        });

        // jsPlumb.fire("jsPlumbDemoLoaded", map.instance);

        // //拉出连接线时
        // map.instance.bind("connectionDrag", function (connection) {
        //     console.log("connection " + connection.id + " is being dragged." );
        // });
        //
        // //放下拖拽的线时
        // map.instance.bind("connectionDragStop", function (connection) {
        //     // $('#myModal').modal();
        //     console.log("connection " + connection.id + " was dragged");
        //
        // });
        // //连接线改变
        // map.instance.bind("connectionMoved", function (params) {
        //     console.log("connection " + params.connection.id + " was moved");
        // });

    }
};