/* eslint-disable */
import { utm } from './utm'
import { tree } from './jl'
//主函数
export function operation(obj){
    var data = obj.data;  //数据文件名称
    var color = obj.color;
    var grouping = obj.grouping;  //分组数量
    var nearl = obj.points;  //点数量(当p点位0时寻找附近的点数)，默认12个
    var cycle = obj.cycle;  //迭代次数
    var latrt = parseFloat(obj.latrt);  //右上角坐标
    var lngrt = parseFloat(obj.lngrt);
    var latlb = parseFloat(obj.latlb);  //左下角坐标
    var lnglb = parseFloat(obj.lnglb);
    var rt = utm(lngrt,latrt);
    var lb = utm(lnglb,latlb);
    var lbx = lb.xy[1];   //左下x
    var lby = lb.xy[0];   //左下y
    var rtx = rt.xy[1];   //右上x
    var rty = rt.xy[0];   //右上y
    var zone = rt.zone;
    var n = Math.ceil(rtx-lbx);   //右上x-左下x(向上取整)
    var m = Math.ceil(rty-lby);   //右上y-左下y(向上取整)
    var distance = []; //所有点及其最近12个点的距离
    var pvalue = [];  //组合点的data数据
    for(var i = 1; i <= m; i++){
        for(var y = 1; y <= n; y++){
            var point = y+'_'+i;
            var result = tree(point,n,m,nearl);
            distance.push(result);
            pvalue.push({
                name:'p'+point,
                value: []
            });
        };
    };
    /*data数据经纬度转utm*/
    data.forEach(function(e,index){
        var ut = utm(e.lng, e.lat);
        data[index].x = ut.xy[1];
        data[index].y = ut.xy[0];
        data[index].zone = ut.zone;
    });

    /*x,y值区间确定-区间值*/
    var n_x = [];
    var m_y = [];
    var lbx2 = lbx;
    var lby2 = lby;
    for(var i = 1; i <= n; i++){
        n_x.push(lbx2);
        lbx2+=1;
    };
    for(var i = 1; i <= m; i++){
        m_y.push(lby2);
        lby2+=1;
    };
    
    /*x,y值区间确定-与区间值比对*/
    for(var i = 0; i < data.length; i++){
        var x0 = 0;
        var y0 = 0;
        /*过滤掉小于等于0的值*/
        if(data[i].ECdp > 0){
            for(var y = 0; y < n_x.length; y++){
                if(y+1 <= n_x.length-1){
                    if(data[i].x >= n_x[y] && data[i].x < n_x[y+1]){
                        x0 = y+1;
                        break;
                    };
                }else{
                    x0 = y+1;
                };
            };
            for(var f = 0; f < m_y.length; f++){
                if(f+1 <= m_y.length-1){
                    if(data[i].y >= m_y[f] && data[i].y < m_y[f+1]){
                        y0 = f+1;
                        break;
                    };
                }else{
                    y0 = f+1;
                };
            };
            var index = arte(pvalue,'p'+x0+'_'+y0);
            pvalue[index].value.push(data[i].ECdp);
        };
    };

    /*求各个点平均数*/
    pvalue.forEach(function(e,index){
        var ary = e.value;
        var he = 0;
        if(ary.length>=1){
            ary.forEach(function(j){
                he+=parseFloat(j);
            });
            pvalue[index].value = [Math.floor((he/ary.length)*1000)/1000];
        }else{
            pvalue[index].value = [0];
        };
    });

    /*平均值为0做处理*/
    pvalue.forEach(function(e,index){
        if(e.value[0]==0){
            /*计算wi数组*/
            var wi = [];
            var name = e.name.split('p')[1];
            var dp = distance[arte(distance,name)].value;
            for(var i = 0; i < nearl; i++){
                var d = kill(name,dp[i]);
                if(d == 0){
                    var fm = 0;
                }else{
                    var fm = Math.pow(1/d,2);
                };
                var fz = 0;
                for(var y = 0; y < nearl; y++){
                    var di = kill(name,dp[y]);
                    if(di != 0){
                        fz+=Math.pow(1/di,2);
                    };
                };
                wi.push(Math.floor(fm/fz*1000)/1000);
            };
            /*计算P*/
            var p = 0;
            for(var i = 0; i < nearl; i++){
                var idx = arte(pvalue,dp[i]);
                var attr = pvalue[idx].value[0];
                p+=(parseFloat(wi[i])*parseFloat(attr));
            };
            pvalue[index].value[0] = Math.floor(p*1000)/1000;
        };
    });

    /*所有平均值，从小到大排序-排序完的保存在新数组*/
    var jz = pvalue;
    jz.sort(function(a,b){
        return a.value[0] - b.value[0];
    });
    
    /*分组*/
    var idx = grouping;  //分几组
    var index = Math.floor(n*m/idx);  //一组几个，剩余放入最后一组
    var group = [];
    for(var i = 0; i < idx; i++){
        if(i <= idx-2){
            //不是最后一组，每组数量固定，为index
            var go = i + (i * (index-1));
            var end = go + (index-1);
            var arry = [];
            for(var y = go; y <= end; y++){
                arry.push(jz[y]);
            };
            group[i] = arry;
        }else{
            //最后一组数据
            var go = i + (i * (index-1));
            var end = jz.length-1;
            var arry = [];
            for(var y = go; y <= end; y++){
                arry.push(jz[y]);
            };
            group[i] = arry;
        };
    };
    
    /*所有点平均值得平均值*/
    var _p = 0;
    for(var i = 0; i < jz.length; i++){
        _p+=parseFloat(jz[i].value);
    };
    _p = _p/jz.length;
    _p = Math.floor(_p*1000)/1000;
    
    /*整体的偏差方*/
    var d = 0;
    for(var i = 0; i < n*m; i++){
        var v = jz[i].value-_p;
        d+=Math.pow(v,2);
    };
    d = Math.floor(d*1000)/1000;

    for(var lucky = 0; lucky <= cycle; lucky++){
        //各组平均偏差平方
        var di = [];
        for(var i = 0; i < group.length; i++){
            //该组内的平局值
            var _zp = 0;
            for(var j = 0; j < group[i].length; j++){
                _zp+=parseFloat(group[i][j].value);
            };
            _zp = _zp/group[i].length;
            _zp = Math.floor(_zp*1000)/1000;
            //计算组内平方差
            var zd = 0;
            for(var k = 0; k < group[i].length; k++){
                var v = group[i][k].value-_zp;
                var v = Math.floor(v*1000)/1000;
                zd+=Math.pow(v,2)
            };
            zd = Math.floor(zd*1000)/1000;
            di[i] = zd;
        };
        //各组均值的平均偏差平方和dx
        var dx = 0;
        for(var i = 0; i < di.length; i++){
            dx+=parseFloat(di[i]);
        };
        var gvf = 1-(dx/d);
        //移动分组
        var di2 = JSON.parse(JSON.stringify(di));
        di2.sort(function(a,b){return a-b});
        var min = di.indexOf(di2[0]);
        var max = di.indexOf(di2[di2.length-1]);
        if(max > min){
            //向左移动，移动最小的数
            var test = JSON.parse(JSON.stringify(group[max]));
            test.sort(function(a,b){return a.value-b.value});
            var ti = 0;
            for(i = 0; i < group[max].length; i++){
                if(group[max][i].value == test[0].value){
                    ti = i;
                    break;
                }
            };
            group[max-1].push(group[max][ti]);
            group[max].splice(ti,1);
        }else{
            //有右移动，移动最大的数
            var test = JSON.parse(JSON.stringify(group[max]));
            test.sort(function(a,b){return a.value-b.value});
            var ti = 0;
            for(i = 0; i < group[max].length; i++){
                if(group[max][i].value == test[test.length-1].value){
                    ti = i;
                    break;
                }
            };
            group[max+1].push(group[max][ti]);
            group[max].splice(ti,1);
        };
    };
    return gMap(group, n, m, color)
}


//数组里对象name查找,返回index
function arte(array,name){
    var idx = 0;
    for(var i = 0; i < array.length; i++){
        if(array[i].name == name){
            idx = i;
            break;
        };
    };
    return idx;
};
//计算两个点之间的距离 格式(1_1,p1_2)
function kill(go,end){
    var n1 = go.split('_');
    var x0 = n1[0];
    var y0 = n1[1];
    var n2 = end.split('p')[1].split('_');
    var x1 = n2[0];
    var y1 = n2[1];
    var d = Math.sqrt(Math.pow((x1-x0),2)+Math.pow((y1-y0),2));
    return Math.floor(d*100)/100;
};


/*按照分组描绘到地图*/
async function gMap(group,n,m,ys){
    var btx = document.createElement('canvas')
    btx.width = n
    btx.height = m
    btx.style.display = 'none'
    document.getElementsByClassName('device-container')[0].appendChild(btx)
    var ctx = btx.getContext("2d")
    ctx.clearRect(0, 0, n, m);
    ctx.save(); 
    group.forEach(function(e,index){
        var arry = e;
        var color =  ys[index];
        arry.forEach(function(t,index2){
            var pot = t.name.split('p')[1].split('_');
            var x = pot[0];
            var y = pot[1];
            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.fillStyle = color;
            ctx.fillRect((x-1)*1,(y-1)*1,1,1);
            ctx.fill();
            ctx.closePath();
            ctx.stroke();
        });
    });
    ctx.restore();
    await newImage(btx.toDataURL("image/png")).then((img)=>{
        const width = btx.width
        btx.width = btx.height
        btx.height = width
        ctx.clearRect(0, 0, btx.width, btx.height);
        ctx.translate(btx.width/2, btx.height/2)
        ctx.rotate(270*Math.PI/180)
        ctx.translate(-btx.height/2, -btx.width/2)
        ctx.drawImage(img, 0, 0)
    })
    var imgUrl = btx.toDataURL("image/png")
    btx.parentNode.removeChild(btx)
    return imgUrl
};

function newImage(url){
    return new Promise((resolve, reject) => {
        let img = new Image()
        img.src = url
        img.onload = () => resolve(img)
        img.onerror = ()=>reject("加载失败")
    })
}