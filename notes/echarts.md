## Echarts 
---

### 常用组件
- 标题 title
  - 主标题 text
  - 副标题 subtext
  - 位置 left
  - 主标题样式 textStyle
  - 副标题样式 subtextStyle
  - 可见性 show
- 提示框 tooltip
  - 提示框触发方式 trigger
    - item 图形触发，主要在散点图，饼图等无类目轴的图表中使用
    - axis 坐标轴触发，主要在柱状图，折线图等会使用类目轴的图标
    - none 什么都不触发
- 图例 legend
  - 可以对不同系列的数据做标注和过滤，它需要与 series 搭配使用
- 工具栏 toolbox
  - 保存图片 saveAsImage
  - 配置项还原 restore
  - 数据视图工具 dataView
  - 数据区域缩放 dataZoom
  - 动态类型切换 magicType
- 坐标轴 xAxis yAxis
  - 坐标轴名称 name
  - 类目数据 data
  - y轴的分割设置
    - 分割段数 splitNumber
    - 强制设置坐标轴分割间隔 interval
    - 坐标轴最小间隔 minInterval
    - 坐标轴最大间隔 maxInterval
- 系列列表 series
  - 列表类型 type
  - 系列名 name 
    - 用于提示tooltip，图例legend 筛选，数据更新
  - 数据 data
  - 标记点 markPoint
  - 标记线 markLine

### 高级应用
- 多坐标轴
  - 多坐标轴的常见应用就是一个图表有两个 y 轴，例如，同一柱状图中两个系列的数据基数差距过大，但又需要在同一张涂标忠展示，如果用同一个 y 轴，其中一个系列数据间的差距会显得很小，此时可以对两个系列的数据采用不同的 y 轴。
  - 需要在声明 y 轴时创建两个对象，并且在其中一个系列中添加 yAxisIndex 
- 异步数据
  - 当遇到加载数据较大，或异步请求，可以先加载其他部分，然后设置showLoading，待数据加载完成后再设置hideLoading
```js
    /*有什么先配置什么*/
    myChart.setOption({
        title: {
            text: '中国地图',
            left:'center'
        }
    });
    //显示loading
    myChart.showLoading();
    fetch('./data/China.json')
        .then((res) => res.json())
        .then(data => {
            //隐藏loading
            myChart.hideLoading();
            /*注册地图*/
            echarts.registerMap('china', data);
            /*等请求到数据后，追加配置*/
            myChart.setOption({
                series: {
                    type:'map',
                    map:'china',
                }
            });
        })
```
- 数据集
  - dataset 数据集组件是从ECharts 4 开始有的，用于数据管理。
  - dataset 的优点
    - 基于原始数据，设置映射关系，形成图表
    - 数据和配置分离，便于单独管理
    - 数据可以被多个系列或者组件复用
    - 支持更多的数据的常用格式，例如二维数组、对象数组等
  - 创建方式
    - 二维数组
    - 对象数组
    - 最后在配置中引用dataset
```js
    //二维数组
    const source1=[
        ['大前端','学习人数','就业人数'],
        ['html', 30, 40],
        ['css', 20, 30],
        ['js', 40, 50],
    ];
    //对象数组
    const source2=[
        {'大前端':'html','学习人数':30,'就业人数':40},
        {'大前端':'css','学习人数':20,'就业人数':30},
        {'大前端':'js','学习人数':40,'就业人数':50},
    ];

    //配置中引用
    const option = {
        dataset:{source1}
    }
```
  - 行列映射
    - 在系列数据映射到图表中时，可以根据数据集进行行列映射
    - 系列声明时，添加 seriesLayoutBy ,该属性默认为 'column'
    - 需要更改为按行映射时，将其值改为 'row'
```js
        series: [
            {
                type:'bar',
                seriesLayoutBy:'row'
            }
        ]
```
  - 维度映射
    - 如果数据中没有提供列名等维度信息，可以自行设定维度信息
    - 同样通过 dataset 属性添加
```js
    const source=[
        ['html',  20,   25],
        ['css',   10,   15],
        ['js',    30,   40]
    ];

    const dimensions=['大前端','学习人数', {name:'就业人数'}];

    const option = {
        dataset: {source,dimensions},
    };
```
  - 编码映射
    -  series 从数据集中取数据时默认从第二列或第二行开始，当后端传输数据的顺序并不是按照前端展示顺序时，可以采用编码映射
    -  通过在 series 中添加 encode 属性，其中x代表x轴，y代表y轴
```js
        series:{
            type:'bar',
            encode:{
                // x:0,
                x:'大前端', //既可以填写数字，也可以填写字符
                y:2,
                seriesName:2, //通过编码映射后，tooltip会丢失列名，可以通过 seriesName来命名
                tooltip:[1,2] //也可以通过设置tooltip来命名
            }
        }
```
  - 区域缩放
    - 作用：概览整体，观察细节
    - 区域缩放的方式：
      - 框选型数据区域缩放组件 Select：提供一个选框进行数据区域缩放。即 toolbox.feature.dataZoom，配置项在 toolbox 中。
      - 内置型数据区域缩放组件 dataZoomInside：内置于坐标系中，使用户可以在坐标系上通过鼠标拖拽、鼠标滚轮、手指滑动（触屏上）来缩放或漫游坐标系。
      - 滑动条型数据区域缩放组件 dataZoomSlider：有单独的滑动条，用户在滑动条上进行缩放或漫游。
  - 视觉映射
    - visualMap 视觉映射可以让项目的数据和颜色、大小等属性相关联。
    - 如某项数据为 [1, 3, 7] 如果数据第一列和第二列分别对应散点在直角坐标系中的x、y 信息，第三列则默认对应visualMap。若果我设置一个从绿色到红色的渐变区间，那么1 就对应绿色，9 就对应红色
    - 映射方式
      - continuous 连续型
      - piecewise 分段型
    - min 映射区间的起始位置，如0
    - max 映射区间的接收位置，如90
    - calculable 是否显示拖拽用的手柄，只适用于连续型
    - range [] 显示此范围内的项目，实际数据，只适用于连续型,如[0,100]
    - dimension 基于哪个维度的数据进行视觉映射
    - inRange 自定义取色范围
      - color[] 颜色映射
      - symbolSize[] 大小映射
  - 事件监听
    - 通过 on 方法添加，事件名称对应 DOM 事件名称，均为小写的字符串
    - 鼠标事件
      - ECharts 支持常规的鼠标事件类型，包括 'click'、'dblclick'、'mousedown'、'mousemove'、'mouseup'、'mouseover'、'mouseout'、'globalout'、'contextmenu' 事件。
```js
myChart.on('click', function (params) {
    // 控制台打印数据的名称
    console.log(params.name);
});

```
  - 组件交互事件的监听
    - 在 ECharts 中基本上所有的组件交互行为都会触发相应的事件。图例开关的行为会触发 legendselectchanged 事件
    - ECharts 通过调用 echarts 实例对象的dispatchAction() 方法触发组件行为。
```js
myChart.on('legendselectchanged', function (params) {
        // 获取点击图例的选中状态
        let isSelected = params.selected[params.name];
        // 在控制台中打印
        console.log((isSelected ? '选中了' : '取消选中了') + '图例' + params.name);
        // 打印所有图例的状态
        console.log(params.selected);
});

//调用dispatchAction触发事件
myChart.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
      dataIndex: app.currentIndex
});
```
  - 富文本标签
    - 富文本标签，就是内容丰富的文本标签
    - 通过富文本标签可以添加丰富内容的标签，文字、表格、甚至图片
    - 通过在数据的label属性中添加rich属性来实现
```js
    // 数据
    const data=[
        {name:'杨戬',value:80,img:'./images/yj.jpg'},
        {name:'鲁班',value:60,img:'./images/lb.jpg'},
        {name:'沈梦溪',value:40,img:'./images/smx.jpg'},
        {name:'诸葛亮',value:30,img:'./images/zgl.jpg'}
    ];
    data.forEach(item=>{
        item.label={
            textBorderColor:'#fff',
            textBorderWidth:4,
            formatter:'{img|}\n{name|'+item.name+'}\n{val|实力：'+item.value+'}',
            rich:{
                img:{
                    width:60,
                    height:60,
                    backgroundColor:{
                        image:item.img
                    }
                },
                name:{
                    lineHeight:32,
                    fontSize:18,
                }
            }
        }
    })
```



