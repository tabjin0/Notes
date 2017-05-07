需求，当刷新页面的时候，会有一个卡片伴随的入场动画进入到页面，当点击卡片上的按钮的时候卡片会有一个出场 的动画，卡片的另外一面会有一个入场动画，同时卡片上的四张图片也会有一个弹出式的效果。
实现动画的手段是多种多样的，比如flash，jquery，css3，这边使用Velocity.js

* {
    margin: 0;
    padding
}//记得全局清除内外边距

正面效果

.container {
    width: 320px;
    height: 420px;
    border: 1px solid #ddd;
    background: #fff;
    margin: 10px auto;
    position: relative;
}
.box {
    position: relative;    
}
.box #top_back_img {
    width: 320px;
    height: 213px;
}
.box #head_img {
    position: absolute;
    width: 96px;
    height: 96px;
    left: 50%;
    top: 213px;
    border-radius: 50%;
    margin-left: -48px;
    margin-top: -48px;
}
.inner {
    margin-top: 66px; /*header.height*0.5 + 26px*/
    text-align: center;
}
.inner span {
    font-size: 14px;
    color: #b4b4b4;
    display: block;
    margin-top: 5px;
}
.inner .bottom_button {
    width: 180px;
    height: 45px;
    inline-height: 45px;
    margin-top: 25px;
    background-color: #5677fc;
    color: #fff;
    border-radius: 5px;
    display: inline-block;
    cursor: pointer;
    transition: background-color 0.2s;
}
.inner .bottom_button:hover {
    background-color: #3b50ce;
}

下面着手背面效果
背面效果

<div class="back_box">
            <div class="close">&times;</div>
            <h3>Tabbits Velocity.js Demo</h3>
            <span>我是小进</span>
            <img src="imgs/1.jpg" alt="">
            <img src="imgs/2.jpg" alt="">
            <img src="imgs/3.jpg" alt="">
            <img src="imgs/4.jpg" alt="">
        </div>

.back_box {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    text-align: center;
}
.back_box .close {
    position: absolute;
    top: 0px;
    right: 10px;
    color: #999;
    font-size: 24px;
    font-family: helvetica;
}
.back_box .close:hover {
    color: #111;
    cursor: pointer;
}
.back_box h3 {
    margin-top: 15px;
}
.back_box span {
    display: block;
    font-size: 12px;
    color: #999;
    margin-top: 20px;
    margin-bottom: 20px;
}
.back_box img {
    width: 125px;
    height: 125px;
    display: inline-block;
    margin: 10px;
}



动画效果
1.入场动画
(function($) {
    //将DOM中的元素选出来
    var container = $(".container");
    var box = $(".box");
    var head_img = $("#head_img");
    var back = $(".back");
    var open = $(".bottom_button");
    var close = $(".close");
    var imgs = back.find("img");//z这边的imgs将是一个数组

    // 首先入场动画
    //1.自定义动画，即从下往上入场
    $.Velocity.RegisterEffect("Tabbits.fromButtonToTop",{
        defaultDuration: 500,
        //定义数组calls,calls里面的每一个元素也是数组
        calls: [
            [{opacity:[1,0],translateY:[0,100]}]
            //{opacity:[1,0]中的1指的是动画结束时的状态，0指的是动画开始时的状态
            //Y方向上的位移使用translateY，translateY:[0,100]，结束的时候为0，开始的时候向下100px
        ]
    });//至此，自定义动画暂告一段落

    //2.定义一个sequnence动画序列
    var seqInit = [{
        elements: container,//每个元素都有elements
        properties: "Tabbits.fromButtonToTop",//properties使用上面的自定义动画
        //还有options，不希望页面刚打开动画就开始
        options: {
            delay: 300
        }
    },{
        elements: box,//每个元素都有elements
        properties: "Tabbits.fromButtonToTop",//properties使用上面的自定义动画
        //还有options，不希望页面刚打开动画就开始
        options: {
            // delay: 300 //box不需要delay
        }
    },{
        elements: head_img,//每个元素都有elements
        properties: "Tabbits.fromButtonToTop",//properties使用上面的自定义动画
        //还有options，不希望页面刚打开动画就开始
        options: {
            delay: 60
        }
    }
    ];
    //3.调用RunSequence函数将自定义动画跑起来
    $.Velocity.RunSequence(seqInit);
})(jQuery);


改进
动画是依次执行的，也就是这个sequence默认的是依次执行的。怎么让他同时执行呢？其实options里面还有一个属性sequenceQueue，将它设置为false.
var seqInit = [{
        elements: container,//每个元素都有elements
        properties: "Tabbits.fromButtonToTop",//properties使用上面的自定义动画
        //还有options，不希望页面刚打开动画就开始
        options: {
            delay: 300
        }
    },{
        elements: box,//每个元素都有elements
        properties: "Tabbits.fromButtonToTop",//properties使用上面的自定义动画
        //还有options，不希望页面刚打开动画就开始
        options: {
            // delay: 300 //box不需要delay
            sequneceQueue: false
        }
    },{
        elements: head_img,//每个元素都有elements
        properties: "Tabbits.fromButtonToTop",//properties使用上面的自定义动画
        //还有options，不希望页面刚打开动画就开始
        options: {
            sequneceQueue: false,
            delay: 60
        }
    }
    ];

2.按钮点击动画
按钮点击之后，首先container要向下消失，box也要向下消失，消失完之后container又会出现，back出现，back_img还会有弹出式的动画，一共是有5个序列让他们串联起来。
首先定义由上到下的出场动画Tabbits.FromTopToButtom
Tabbits.FromTopToButtom也很简单，将从下往上的自定义动画Tabbits.fromButtonToTop的始末值对换即可。
// 4.自定义出场动画，Y轴上的变化
    $.Velocity.RegisterEffect("Tabbits.fromTopToButtom",{
        defaultDuration: 200,        //时间稍微改短一下，收尾快点
        calls: [
            [{opacity: [0,1], translateY: [100,0]}]
        ]
    });
    //5.自定义back_img动画，有由小变到原来的尺寸，用scale
    $.Velocity.RegisterEffect("Tabbits.back_imgIn",{
        defaultDuration: 20000,
        calls: [
            [{opacity: [1,0], scale: [1,0.3]}]  //以0.2倍大小到1倍大小的动画出现
        ] 
    });

下面定义sequence

//6.定义点击按钮动画的sequence动画序列
    var sequenceButtonClick = [{
        elements: container,
        properties: "Tabbits.fromTopToButtom",
        options: {
            sequenceQueue: false,
            delay: 300
        }
    },{//正面出场
        elements: box,
        properties: "Tabbits.fromTopToButtom",
        options: {
            sequenceQueue: false
        }
    },{//容器重新入场
        elements: container,
        properties: "Tabbits.fromButtonToTop",//再让container进来
    },{//背面入场
        elements: back_box,
        properties: "Tabbits.fromButtonToTop",
        options: {
            sequenceQueue: false
        }
    },{//背面图片入场
        // elememts: imgs,
        // properties: "Tabbits.back_imgIn",
        elements: back_box_imgs,
        properties: "Tabbits.back_imgIn",
        options: {
            sequenceQueue: false
        }
    }];

    //3.调用RunSequence函数将自定义动画跑起来
    $.Velocity.RunSequence(sequenceInit);
    open.on('click',function(){
        $.Velocity.RunSequence(sequenceButtonClick);
    });
但是现在点击按钮是没有效果的，为什么？
这是因为样式的问题，这个demo有正面，有背面，正面的上面有背面，尽管将背面透明度设为0，也就是说背面是覆盖在正面之上的，所以点击的时候是作用在背面，或者说根本就没有点到按钮，很好解决，将正面的优先级提高，z-index: 2;就好了

3.关闭按钮
//7.自定义back_img出场动画
    $.Velocity.RegisterEffect("Tabbits.back_imgOut",{
        defaultDuration: 1000,
        calls: [
            [{opacity: [0,1],scale: [0.3,1]}]
        ]
    });
下面定义关闭按钮的sequence动画序列
//8.定义关闭按钮的sequence动画序列
    var sequenceClose = [{
        elements: back_box_imgs,
        properties: "Tabbits.back_imgOut"
    },{
        elements: container,
        properties: "Tabbits.fromTopToBottom",
        options: {
            sequenceQueue: false,
            delay: 3000
        }
    },{//背面出场
        elements: back_box,
        properties: "Tabbits.fromTopToBottom",
        options: {
            sequenceQueue: false
        }
    },{//容器重新入场
        elements: container,
        properties: "Tabbits.fromBottomToTop",//再让container进来
    },{//正面入场
        elements: box,
        properties: "Tabbits.fromBottomToTop",
        options: {
            sequenceQueue: false
        }
    }];

close.on('click',function() {
        $.Velocity.RunSequence(sequenceClose);
    });
    

总结
使用Velocity.js做动画是非常简单的，尤其是在动画序列的场景（A动完B动，B动完C动……）
1、Velocity.js的特性：在浏览器/兼容性方面和移动端性能方面做了优化
2、Velocity.js的用法
3、JS插件的学习方法（3步）：官网了解、案例运行、熟悉细节
代码小结
html：
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>velocity.js_demo</title>
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <script type="text/javascript" src="js/jquery-3.2.1.js"></script>
    <!-- 下面引入Velocity的两个库 -->
    <script type="text/javascript" src="js/velocity.min.js"></script>
    <script type="text/javascript" src="js/velocity.ui.min.js"></script>
</head>
<body>
    <div class="container">
        <div class="box">
            <img id="top_back_img" src="imgs/back.jpg" alt="">
            <img id="head_img" src="imgs/xiaojin.jpg" alt="">
            <div class="inner">
                <h3>Tabbits Velocity.js Demo</h3>
                <span>我是小进</span>
                <button class="bottom_button">快进来嘛</button>
            </div>
        </div>
        <div class="back_box">
            <div class="close">&times;</div>
            <h3>Tabbits Velocity.js Demo</h3>
            <span>我是小进</span>
            <img src="imgs/1.jpg" alt="">
            <img src="imgs/2.jpg" alt="">
            <img src="imgs/3.jpg" alt="">
            <img src="imgs/4.jpg" alt="">
        </div>
    </div>
    <script type="text/javascript" src="js/script.js"></script>
</body>
</html>

css：
@charset "utf-8";

* {
    margin: 0;
    padding: 0;
}
.container {
    width: 320px;
    height: 420px;
    border: 1px solid #ddd;
    background: #fff;
    margin: 10px auto;
    position: relative;
}
.box {
    position: relative;    
    z-index: 2;
}
.box #top_back_img {
    width: 320px;
    height: 213px;
}
.box #head_img {
    position: absolute;
    width: 96px;
    height: 96px;
    left: 50%;
    top: 213px;
    border-radius: 50%;
    margin-left: -48px;
    margin-top: -48px;
}
.inner {
    margin-top: 66px; /*header.height*0.5 + 26px*/
    text-align: center;
}
.inner span {
    font-size: 14px;
    color: #b4b4b4;
    display: block;
    margin-top: 5px;
}
.inner .bottom_button {
    width: 180px;
    height: 45px;
    inline-height: 45px;
    margin-top: 25px;
    background-color: #5677fc;
    color: #fff;
    border-radius: 5px;
    display: inline-block;
    cursor: pointer;
    transition: background-color 0.2s;
}
.inner .bottom_button:hover {
    background-color: #3b50ce;
}

/*
.box {
    display: none;
}*/


.back_box {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    text-align: center;
}
.back_box .close {
    position: absolute;
    top: 0px;
    right: 10px;
    color: #999;
    font-size: 24px;
    font-family: helvetica;
}
.back_box .close:hover {
    color: #111;
    cursor: pointer;
}
.back_box h3 {
    margin-top: 15px;
}
.back_box span {
    display: block;
    font-size: 12px;
    color: #999;
    margin-top: 20px;
    margin-bottom: 20px;
}
.back_box img {
    width: 125px;
    height: 125px;
    display: inline-block;
    margin: 10px;
}

.container,.box,.head_img,.back_box,.back_box img {
    opacity: 0.0;
}

js：
(function($) {

//1.定义变量（动画元素，事件变量比如按钮）

    // 将DOM中的元素选出来
    var container = $(".container");
    var box = $(".box");
    var head_img = $("#head_img");
    var back_box = $(".back_box");
    var open = $(".bottom_button");
    var close = $(".close");
    var back_box_imgs = back_box.find("img");//z这边的imgs将是一个数组

//2.自定义动画（入场动画，出场动画，背面图片单独的入场动画，背面图片单独的出场动画）

    // 首先入场动画
    //2.自定义动画，即从下往上入场，Y轴上的变化
    $.Velocity.RegisterEffect("Tabbits.fromBottomToTop",{
        defaultDuration: 500,
        //定义数组calls,calls里面的每一个元素也是数组
        calls: [
            [{opacity:[1,0], translateY:[0,100]}]
            //{opacity:[1,0]中的1指的是动画结束时的状态，0指的是动画开始时的状态
            //Y方向上的位移使用translateY，translateY:[0,100]，结束的时候为0，开始的时候向下100px
        ]
    });
    // 5.自定义出场动画，Y轴上的变化
    $.Velocity.RegisterEffect("Tabbits.fromTopToBottom",{
        defaultDuration: 200,        //时间稍微改短一下，收尾快点
        calls: [
            [{opacity: [0,1], translateY: [100,0]}]
        ]
    });
    //6.自定义back_img入场动画，有由小变到原来的尺寸，用scale
    $.Velocity.RegisterEffect("Tabbits.back_imgIn",{
        defaultDuration: 1000,
        calls: [
            [{opacity: [1,0], scale: [1,0.3]}]  //以0.2倍大小到1倍大小的动画出现，注意始终值别弄反了，尤其是opacity弄反了直接看不来哦效果
        ] 
    });
    // $.Velocity.RegisterEffect("Tabbits.back_imgIn",{
    //         defaultDuration: 200,        //时间稍微改短一下，收尾快点
    //         calls: [
    //             [{opacity: [1,0], scale: [1,0.3]}]
    //         ]
    //     });

    //8.自定义back_img出场动画
    $.Velocity.RegisterEffect("Tabbits.back_imgOut",{
        defaultDuration: 3000,
        calls: [
            [{opacity: [0,1],scale: [0.3,1]}]
        ]
    });

//3.sequence动画序列（入场动画序列、点击按钮出场序列和入场序列、点击关闭的入场和出场序列）

    //3.定义入场动画sequnence动画序列
    var sequenceInit = [{
        elements: container,//每个元素都有elements
        properties: "Tabbits.fromBottomToTop",//properties使用上面的自定义动画
        //还有options，不希望页面刚打开动画就开始
        options: {
            delay: 300
        }
    },{
        elements: box,//每个元素都有elements
        properties: "Tabbits.fromBottomToTop",//properties使用上面的自定义动画
        //还有options，不希望页面刚打开动画就开始
        options: {
            // delay: 300 //box不需要delay
            sequneceQueue: false
        }
    },{
        elements: head_img,//每个元素都有elements
        properties: "Tabbits.fromBottomToTop",//properties使用上面的自定义动画
        //还有options，不希望页面刚打开动画就开始
        options: {
            sequneceQueue: false,
            delay: 60
        }
    }];

    //7.定义点击按钮动画的sequence动画序列
    var sequenceButtonClick = [{
        elements: container,
        properties: "Tabbits.fromTopToBottom",
        options: {
            sequenceQueue: false,
            delay: 300
        }
    },{//正面出场
        elements: box,
        properties: "Tabbits.fromTopToBottom",
        options: {
            sequenceQueue: false
        }
    },{//容器重新入场
        elements: container,
        properties: "Tabbits.fromBottomToTop",//再让container进来
    },{//背面入场
        elements: back_box,
        properties: "Tabbits.fromBottomToTop",
        options: {
            sequenceQueue: false
        }
    },{//背面图片入场
        // elememts: imgs,
        // properties: "Tabbits.back_imgIn",
        elements: back_box_imgs,
        properties: "Tabbits.back_imgIn",
        options: {
            sequenceQueue: false
        }
    }];

    //9.定义关闭按钮的sequence动画序列
    var sequenceClose = [{
        elements: back_box_imgs,
        properties: "Tabbits.back_imgOut"
    },{
        elements: container,
        properties: "Tabbits.fromTopToBottom",
        options: {
            sequenceQueue: false,
            delay: 3000
        }
    },{//背面出场
        elements: back_box,
        properties: "Tabbits.fromTopToBottom",
        options: {
            sequenceQueue: false
        }
    },{//容器重新入场
        elements: container,
        properties: "Tabbits.fromBottomToTop",//再让container进来
    },{//正面入场
        elements: box,
        properties: "Tabbits.fromBottomToTop",
        options: {
            sequenceQueue: false
        }
    }];

//4.事件绑定（在相应的事件发生的时候跑相应的动画序列）

    //4.调用RunSequence函数将自定义动画跑起来
    $.Velocity.RunSequence(sequenceInit);
    open.on('click',function() {
        $.Velocity.RunSequence(sequenceButtonClick);
    });
    close.on('click',function() {
        $.Velocity.RunSequence(sequenceClose);
    });

})(jQuery);
