/* eslint-disable */
export function tree(point,n,m,nearl){
    var ary = point.split('_');
    var a = parseInt(ary[0]);   //已定点的X
    var b = parseInt(ary[1]);   //已定点的y
    var term = true;  //是否停止查找
    var number = nearl;  //查找距离最近点个数
    var spacing = 1;  //轴间距
    var distance = {name: point, value:[]};

    for(var i = 1; term; i++){
        /*查找子代分支(i=分支数) 干枝->分支*/
        var k = (i*spacing);  //根部与几代干支的直线距离(1的i倍)
        var top = b+k <= m;
        var bottom = b-k >= 1;
        var left = a-k >= 1;
        var right = a+k <= n;
        /*主干*/
        if(top){ var name = 'p'+a+'_'+(b+k); distance.value.push(name); };
        if(bottom){ var name = 'p'+a+'_'+(b-k); distance.value.push(name); };
        if(left){ var name = 'p'+(a-k)+'_'+b; distance.value.push(name); };
        if(right){ var name = 'p'+(a+k)+'_'+b; distance.value.push(name); };
        /*支干--主干存在分支就一定存在 且为左上、右上、右下、左下四区，每个分支区长度为k,距离依次递增*/
        for(var z=1; z<=k; z++){ 
            if(left){   
                if(top){
                    var name = 'p'+(a-k)+'_'+(b+z); 
                    distance.value.push(name);
                    if(z != k){
                        var name = 'p'+(a-z)+'_'+(b+k); 
                        distance.value.push(name);
                    };
                };
                if(bottom){
                    var name = 'p'+(a-k)+'_'+(b-z); 
                    distance.value.push(name);
                    if(z != k){
                        var name = 'p'+(a-z)+'_'+(b-k); 
                        distance.value.push(name);
                    };
                };
            };
            if(right){
                if(top){
                    var name = 'p'+(a+k)+'_'+(b+z); 
                    distance.value.push(name);
                    if(z != k){
                        var name = 'p'+(a+z)+'_'+(b+k); 
                        distance.value.push(name);
                    };
                };
                if(bottom){
                    var name = 'p'+(a+k)+'_'+(b-z); 
                    distance.value.push(name);
                    if(z != k){
                        var name = 'p'+(a+z)+'_'+(b-k); 
                        distance.value.push(name);
                    };
                };
            };
        };
        if(distance.value.length >= number){
            term = false;
            return distance;
        };
    };
}
