$(document).ready(function(){
    indexPg.init();
    // $('#myModal').modal();

});

let indexPg={
    init:function () {
        indexPg.dragInit();
        $('#data').on('click','li div',function (event) {
            console.log(event.currentTarget);
            $(event.currentTarget).next().slideToggle();
        });

        //模态框中的筛选字段-点击弹出弹窗，选择字段
        $('.modal-body .selectField .select').on('click',function(){
            console.log("select");
            $('#myModal2').modal();
        });


        //模态框中基本关联中的连接类型选择-绑定激活状态的点击事件
        $('#basicRelation .relations li').on('click',function(){
            $(this).addClass('active').siblings().removeClass('active');
        });

        //模态框中的取消按键和右上角小叉，绑定关闭事件，并取消连线
        $('.modal-footer .cancel,#myModal .close').on('click',function () {
            $('#myModal').modal('hide');
        });
        
        $('').on('click',function () {
            
        })


    },

    dragInit:function () {
        let index=1;
        //给所有可拖拽的<li>标签添加可拖拽属性
        $('.list3 li').each(function (index) {
            $(this).attr("draggable","true");
        });

        $.event.props.push('dataTransfer');
        $('#myholder').on('dragover',function(e){
            e.preventDefault();//允许拖放
        });

        $('#data .list3').on('dragstart','li',function(e){
            e.dataTransfer.setData("Text",$(e.target).children().text());
        });
        //放置事件
        $('#myholder').on('drop',function(ev) {
            ev.preventDefault();
            let data=ev.dataTransfer.getData("Text");
            let windowID="Window"+index;
            $(ev.target).append('<div id="'+windowID+'" class="item">'+data.split("").slice(1).join("")+'</div>');
            index++;
            $('#'+windowID).css({top:(ev.offsetY-20).toString()+'px',left:(ev.offsetX-55).toString()+'px'});

            map.initMap(windowID);
        });
    }

};



