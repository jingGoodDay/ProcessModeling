$(document).ready(function(){
    indexPg.init();


});

let indexPg={
    init:function () {
        indexPg.dragInit();
        $('#data').on('click','li div',function (event) {
            console.log(event.currentTarget);
            $(event.currentTarget).next().slideToggle();
        });

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



