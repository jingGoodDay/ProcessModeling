$(document).ready(function(){
    indexPg.init();
    map.init();
    $('#myModal').modal();

});

//用于记录参数的对象
function selfOperation(virtualTableId,calculateReseltName,calculateFieldName,operatorId,groupFields,calculateFunction,calculateField,filterCondition){
    this.virtualTableId=virtualTableId;//虚拟表名称
    this.calculateReseltName=calculateReseltName;//结果集中文名
    this.calculateFieldName=calculateFieldName;//新生成字段的中文名
    this.operatorId=operatorId;//算子ID
    this.groupFields=groupFields;//分组字段
    this.calculateFunction=calculateFunction;//计算函数
    this.calculateField=calculateField;//计算字段
    this.filterCondition=filterCondition;//筛选条件
}

function joinOperation(calculateReseltName,selectFields_A,selectFields_B,joinField_A,joinFeild_B,joinOperator,operatorId){
    this.calculateReseltName=calculateReseltName;//结果集中文名
    this.selectFields_A=selectFields_A;//表A筛选字段
    this.selectFields_B=selectFields_B;//表B筛选字段
    this.joinField_A=joinField_A;//表A的join条件字段
    this.joinFeild_B=joinFeild_B;//表B的join条件字段
    this.joinOperator=joinOperator;//join条件操作符，如=，！=，>，<等
    this.operatorId=operatorId;//算子id
}

let indexPg={
    init:function () {
        indexPg.dragInit();
        indexPg.modalInit();
        $('#data').on('click','li div',function (event) {
            console.log(event.currentTarget);
            $(event.currentTarget).next().slideToggle();
        });

    },
    modalInit:function () {

        //记录是点中了哪一个
        let selectPlace;

        //创建记录所选参数的对象
        let joinParas=new selfOperation();

        //-----------------模态框1相关的-----------------//
        //模态框中的A表筛选字段-点击弹出弹窗，选择字段
        $('.modal-body .selectField .selectA').on('click',function(){
            $('#myModal2').modal();
            selectPlace="A";
        });

        //模态框中的B表筛选字段-点击弹出弹窗，选择字段
        $('.modal-body .selectField .selectB').on('click',function(){
            $('#myModal2').modal();
            selectPlace="B";
        });

        //模态框中基本关联中的连接类型选择-绑定激活状态的点击事件
        $('#basicRelation .relations li').on('click',function(){
            $(this).addClass('active').siblings().removeClass('active');
        });

        //模态框中的取消按键和右上角小叉，绑定关闭事件，并取消连线
        $('#myModal .modal-footer .cancel,#myModal .close').on('click',function () {
            $('#myModal').modal('hide');
        });

        //点击确定按钮，记录下运算的相关信息
        $('#myModal .modal-footer .done').on('click',function () {
            joinParas.calculateReseltName=$('#myModal .resultData').val();
            joinParas.operatorId=$('#myModal #basicRelation .relations .active span').text();
            joinParas.joinOperator=$('.operation').find("option:selected").text();
            joinParas.joinField_A=$('.selectListA').find("option:selected").text();
            joinParas.joinField_B=$('.selectListB').find("option:selected").text();

            console.log(joinParas);
            $('#myModal').modal('hide');
        });



        //---------------模态框1相关的--end--------------//



        //-----------------模态框2相关的-----------------//
        //点击确定按钮，将选择的字段记录
        $('#myModal2 .modal-footer .done').on('click',function () {

            let selectValue=[];
            $.each($('input[type=checkbox]:checked'),function(){
                selectValue.push($(this).val());
            });
            $('#myModal2').modal('hide');
            if (selectPlace=="A"){
                $('.selectA').text(selectValue.join(";"));

                //改变选择表A中的待选运算字段
                $('.selectListA').empty();
                $('.selectListA').append('<option value="null"></option>');
                for(let i=0;i<selectValue.length;i++){
                    $('.selectListA').append('<option value="'+i+1+'">'+selectValue[i]+'</option>');
                }
                joinParas.selectFields_A=selectValue.join(',');

            }else if(selectPlace=="B"){
                $('.selectB').text(selectValue.join(";"));

                //改变选择表B中的待选运算字段
                $('.selectListB').empty();
                $('.selectListB').append('<option value="null"></option>');
                for(let i=0;i<selectValue.length;i++){
                    $('.selectListB').append('<option value="'+i+1+'">'+selectValue[i]+'</option>');
                }
                joinParas.selectFields_B=selectValue.join(',');
            }

        });

        //模态框中的取消按键和右上角小叉，绑定关闭事件，并取消连线
        $('#myModal2 .modal-footer .cancel,#myModal2 .close').on('click',function () {
            $('#myModal2').modal('hide');
        });

        //点击全选,选择所有字段
        $('#myModal2 .modal-footer .selectAll').on('click',function () {
            $('input[type=checkbox]').prop("checked","checked");
        });

        //点击反选
        $('#myModal2 .modal-footer .selectRev').on('click',function () {
            $("input:checkbox").each(function(){
                this.checked=!this.checked;
            });
        });




    },
    //拖放相关代码
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
            // let windowID="Window"+($('#myholder').children().length+1);
            let windowID="Window"+index;
            $(ev.target).append('<div id="'+windowID+'" class="item">'+data.split("").slice(1).join("")+'</div>');
            $('#'+windowID).css({top:(ev.offsetY-20).toString()+'px',left:(ev.offsetX-55).toString()+'px'});
            map.newMap(windowID);
            index++;
        });

    }

};



