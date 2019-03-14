{
    let view={
        el:'.wapper',
        render(data){
            $('.wapper>.nav>.content>.name').text(data.name)
            $('.wapper>.nav>.content>.singer').text(data.singer)       
            
            $('.wapper>.play>audio').attr("src",data.url);
        }
    }
    let model={
        data:{
            sing:[]
        }
    }
    let controller={
        init(view,model){
            this.view=view
            this.model=model
            this.view.render(this.model.data.sing)
            this.bindEvents()
        },
 
        get(value){
           

            let search=window.location.search
            value.id=search.split('=')[1].split('&')[0]
            value.name=decodeURI(search.split('=')[2].split('&')[0])
            value.singer=decodeURI(search.split('=')[3].split('&')[0])
            value.url=search.split('&')[3].replace('url=','').replace('http','https')
            console.log( value.url,'lllllldddddffffffffffllll') 
           $.ajax({
            url:'https://jirenguapi.applinzi.com/fm/getLyric.php',
            type:"post",
            data:{sid:value.id},
            dataType:"json",
            async:false, // 同步请求
            success:function(result){
                if(result != null && result != "" && result != undefined){
                    value.lyric=result.lyric.replace('音乐来自百度FM, by 饥人谷','')
                    console.log( value.lyric)
                }
            }
        })
            
            return value
        },

        bindEvents(){
            var value={}
            var song=this.get(value);

            this.model.data.sing.push(song)


            this.view.render( this.model.data.sing[0])

            $('.wapper>.play>ul>li').on('click',(e)=>{
                // $('.wapper>.play>ul:last-child>li:nth-child(2)').on('click',(e)=>{
                if($(e.currentTarget).find('svg>use').attr('xlink:href')==='#icon-play1'){
                    $(e.currentTarget).find('svg>use').attr('xlink:href','#icon-pause')
                    $('audio')[0].play()
                    $('.banner').css('animation-play-state',' running')
                }else{
                    $(e.currentTarget).find('svg>use').attr('xlink:href','#icon-play1')
                    $('audio')[0].pause()
                    $('.banner').css('animation-play-state',' paused')
                }             
            })
            // 设置初始音量
            // $('audio')[0].volume=0.5
            // $('.voice>.voice-num>.voice>.dot').css("left", ( $('audio')[0].volume*340)+'px')
            // $('.voice>.voice-num>.voice').css("width", ( $('audio')[0].volume*340)+'px')
 
             // 设置音量
              $('.voice').mouseup(function(e){
                var obj=document.getElementsByClassName("voice-num")[0]
                var left = obj.offsetLeft; //对应父容器的上边距 
                //判断是否有父容器，如果存在则累加其边距 
                while (obj = obj.offsetParent) {//等效 obj = obj.offsetParent;while (obj != undefined) 
                 //    t += obj.offsetTop; //叠加父容器的上边距 
                 left += obj.offsetLeft; //叠加父容器的左边距 
                } 
                var obj=document.getElementsByClassName("voice-num")[0]

                $('.voice>.voice-num>.voice>.dot').css("left",e.pageX-left+'px')
                $('.voice>.voice-num>.voice').css("width",e.pageX-left+'px')
                $('audio')[0].volume=(e.pageX-left)/obj.clientWidth 
              });

              
            //   设置初始歌词
           let lyric=this.model.data.sing[0].lyric
           lyric=lyric.split('\n')
           let lyric_time=[]
           for(let key in lyric){
               var timeReg = /\[\d{2}:\d{2}.\d{2}\]/g;
               var time = lyric[key].match(timeReg);
               if (!time) continue;
               time=lyric[key].split(']')[0].replace('[','').split(':')
               time=parseInt(time[0])*60+parseFloat(time[1])
               content=lyric[key].split(']')[1]
               if(content){
                   if(content[0]!='['){
                    lyric_time.push([time,content])
                   }
                
               }
            
               
           }
           var td = $(".lyric>p:first")
           td.text(lyric_time[0][1])
           var td = $(".lyric>p:nth-child(2)")
           td.text(lyric_time[1][1])
           var td = $(".lyric>p:last")

           td.text(lyric_time[2][1])
            // 设置播放进度 
           $('.process').mouseup(function(e){

            var obj=document.getElementsByClassName("process")[0]
            var width=obj.clientWidth 
            var left = obj.offsetLeft; 
     
            $('audio')[0].currentTime=(e.pageX-left)*$('audio')[0].duration/width
        
          });
         //   设置播放歌词
           $('audio').on('play',(e)=>{
            var obj=document.getElementsByClassName("process")[0]
            console.log('开始播放');
            idTime=setInterval((e)=>{
                $('.process>.process-num').css("width",obj.clientWidth /($('audio')[0].duration)*($('audio')[0].currentTime)+'px')
                $('.process>.process-dot').css("left",obj.clientWidth /($('audio')[0].duration)*($('audio')[0].currentTime)+'px')
                for(let i=1;i<lyric_time.length-1;i++){
                    // console.log(lyric_time[i],0)
                    if(((lyric_time[i][0])<($('audio')[0].currentTime))&((lyric_time[i+1][0])>($('audio')[0].currentTime))){
                        var td = $(".lyric>p:first")
                        // console.log(lyric_time[i],1)
                        td.text(lyric_time[i-1][1])
                        var td = $(".lyric>p:nth-child(2)")
                        td.text(lyric_time[i][1])
                        var td = $(".lyric>p:last")
                        td.text(lyric_time[i+1][1])
                        break
                    }
                }
            },300)
            
           })
           $('audio').bind('ended', function(){	
            console.log('结束');
            window.clearInterval(idTime)
            })
            $('audio').bind('pause', function(){
                    console.log('暂停');
                    window.clearInterval(idTime)

                    $('.play>ul>#pause>svg>use').attr('xlink:href','#icon-play1')
                    $('audio')[0].pause()
                    $('.banner').css('animation-play-state',' paused')


            })
                }

    }
    controller.init(view,model)

}


