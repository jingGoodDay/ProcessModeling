$(document).ready(function(){
    indexPg.init();
});

var indexPg={
    init:function () {
        $('#data').on('click','li div',function (event) {
            console.log(event.currentTarget);
            $(event.currentTarget).next().slideToggle();
        })
    }
};