$(function(){
	//进入游戏页面动画
	let an = document.getElementById('start');
	an.onclick = function(){
		$("#frist").fadeOut("slow");
		$("#frist2").fadeOut("slow");
		$("#frist3").fadeOut("slow");
		$("#frist4").fadeOut("slow");
		$("#start").fadeOut("slow");
		$("#bj").fadeOut("slow");
		$(".logo").fadeOut("slow");
		$(".about").fadeOut("slow");
		$(".icon").css({display:'block'});
		setTimeout(function(){
			$('.fg').fadeIn("slow");
			$(".fg").css({display:'block'});
		},500);
		setTimeout(function(){
			$('.midt').slideDown("slow");
		},700)
 	};

 	//静音按钮 

	let jyclick = 0;
	let jy = document.getElementById('jy');
	jy.onclick = function(){
		jyclick++;
		if(jyclick==1){
			$('audio').eq(0).attr('src',1);
			jyclick++;
		}else{
			$('audio').eq(0).attr('src','./music/背景.mp3');
			jyclick = 0;
		}
		
	}
		// $('.midt').slideDown(3000);
	setTimeout(function(){
		$('#frist').animate({left:'-800px',top:'-800px'},1000);
		$('#frist2').animate({left:'800px',top:'-800px'},1000);
		$('#frist3').animate({left:'-800px',top:'800px'},1000);
		$('#frist4').animate({left:'800px',top:'800px'},1000);
	},500);
	setTimeout(function (){
		for(let i=0;i<7;i++){
			if(i<4){
				$('.txt li').eq(i).css({'transform':'translateZ(50px)','transition':'transform '+ (i+4)*0.2 +'s linear '});
			}
			$('.txt li').eq(i).css({'transform':'translateZ(50px)','transition':'transform '+ i*0.2 +'s linear '});
			setTimeout(function(){
				$('.txt li').eq(i).css({'transform':'translateZ(0px)','transition':'transform '+ i*0.2 +'s linear '});
			},1700);
		}
	},1600);


	//一、0 初始化系统中必要的数据
	let all_poker = [];      // 代表总牌组的数据
	// let player[0] = {name:'佩奇',integral:1000,poker:[],role:0};     //玩家1的数据
	// let player[1] = {name:'粉红豹',integral:1000,poker:[],role:0};     //玩家2的数据
	// let player[2] = {name:'独眼怪',integral:1000,poker:[],role:0};     //玩家3的数据
	let player = [
		{name:'佩奇', integral:1000, poker:[], role: 0},
		{name:'粉红豹', integral:1000, poker:[], role: 0},
		{name:'独眼怪', integral:1000, poker:[], role: 0}
	];


	// 初始化音乐
	let music = [3,4,5,6,7,8,9,10,11,12,13,1,2,14,15,'dui3','dui4','dui5','dui6','dui7','dui8','dui9','dui10','dui11','dui12','dui13','dui1',
				'dui2','抢地主','不抢','过','要不起','顺子','连对','飞机','三带一','三带一对','四带两对','四带二','炸弹','王炸','发牌','洗牌'];
	let src = '';

	// 背景音乐声音变小
	$('audio').eq(0).prop('volum',0.1);

	// 用于保存当前游戏具体情况的数据
	let game = {
		boss:null,            // 当前游戏的地主角色
		select_poker:{
			poker:[],         // 选中牌组的具体数组数据
			type:0,           // 选中牌组的牌型
			max:0             // 牌型中的对比值
		},      // 当前玩家选中的牌组数据
		desktop_poker:{
			poker:[],         // 选中牌组的具体数组数据
			type:0,           // 选中牌组的牌型
			max:0             // 牌型中的对比值   (3的max是1)
		}      // 当前桌面上的牌组数据
	}


	//一、1.1生成初始牌堆页面元素
	let poker_str ='';

	for(let i=0;i<54;i++){
		poker_str += '<li class="back" style="top:-'+i+'px;left:'+ 1*i+'px;"></li>';
	}
	$('.all_poker').append(poker_str);


    //一、1.2初始化牌堆数据
	// [{num:1,color:0}, {num:1, color:1}]
	for(let i=1;i<=13;i++){
		for(let j=0;j<4;j++){    //0:方块 1:梅花 2:红桃 3:黑桃
			all_poker.push({num:i,color:j});
		}
	}
	// 大王小王牌数据
	all_poker.push({num:14,color:0});
	all_poker.push({num:14,color:1});
	// console.log(all_poker);


	// 绑定洗牌跟发牌事件
	let click = 0;      // 用于保存点击牌的次数
	let status = false;     //设置状态值

	// $('.all_poker li').click(function(){
	// 为了防止绑定事件的失效，我们需要使用监听事件绑定
	$('body').on('click','.bgn',function(){
		// if(click == 0){
			src = './music/洗牌.mp3';
			$('audio').eq(1).attr('src',src);
			$('.midt').fadeOut(500);
			$(".fg").css({display:'none'});
			// alert('洗牌');
			clearPoker();    // 调用洗牌函数
			status = true;
	});
	$('body').on('click','.all_poker li',function(){
		src = './music/发牌.mp3';
		$('audio').eq(1).attr('src',src);
		// alert('发牌');
		deal();         //调用发牌函数   deal(1);
	});

	// 封装洗牌函数
	function clearPoker(){
		// 0 把牌组数据进行打乱
		for(let i=0;i<3;i++){
			all_poker.sort(function(x,y){
				return Math.random()-0.5;
			});
		}

		/**
		 * 开始洗牌
		 */
		// 1.1保存原牌组
		let $all = $('.all_poker');
		// 1.2删除原牌组
		$('.all_poker').remove();

		// 2 生成三个新的临时牌堆用于洗牌动画
		let temp_html = '';
		for(let i=0; i<2; i++){
			temp_html += '<ul class="all_poker" style="top:-'+i*275+'px;">';
			for(let j=0; j<27; j++){
				temp_html += '<li class="back" style="top:-'+j+'px;"></li>';
			}
			temp_html += '</ul>';
		}
		$('.mid_top').append(temp_html);

		// 3 洗牌动画
		for(let i=0; i<2; i++){
			$('.all_poker').eq(0).animate({left:'-500px'},250);
			$('.all_poker').eq(1).animate({left:'500px'},250);
		}
		setTimeout(function(){
			for(let j=0;j<54;j++){

				if(j<27){
					$('.all_poker>.back').eq(j).animate({left:+ j*15 +'px',top:-+ 0 +'px'},300)
					.css({'transform': 'rotateZ(0deg)','transition':'transform '+j*0.125+'s'})
					.css({'transform': 'rotateZ(1800deg)','transition':'transform '+j*0.125+'s'});
					
					$('.all_poker>.back').eq(j).animate({left:+j*15+'px',top:-+ 0 +'px'},300)
				}else{
					$('.all_poker>.back').eq(j).animate({left:+-(j-27)*15+'px',top:-+ 0 +'px'},300)
					.css({'transform': 'rotateZ(0deg)','transition':'transform '+(j-26)*0.125+'s'})
					.css({'transform': 'rotateZ(1800deg)','transition':'transform '+(j-26)*0.125+'s'});
					
				 }
			}
		},260);
		setTimeout(function(){
			for(let j=0;j<54;j++){

				if(j<27){
					$('.all_poker>.back').eq(j).animate({top:-+j+'px',left:-+(j*0.5)+'px'},210);
				}else{
					$('.all_poker>.back').eq(j).animate({top:-+(j-27)+'px',left:-+((j-27)*0.5)+'px'},210);
				 }
			}
		},3300);
		setTimeout(function(){
			for(let j=0;j<54;j++){

				if(j<27){
					$('.all_poker>.back').eq(j).animate({top:-+ 0 +'px',left:-+(j*0.5)+'px'},100);
				}else{
					$('.all_poker>.back').eq(j).animate({top:-+ 0 +'px',left:+((j-27)*0.5)+'px'},100);
				 }
			}
		},3400);
		setTimeout(function(){
			for(let j=0;j<54;j++){

				if(j<27){
					$('.all_poker>.back').eq(j).animate({top:-+ 0 +'px',left:-+(j*0.5)+'px'},350)
											.animate({top:-+ 0 +'px',left:-+(j*0.5)+'px'},350);
				}else{
					$('.all_poker>.back').eq(j).animate({top:-+ 0 +'px',left:+((j-27)*0.5)+'px'},350);
				 }
			}
		},3450);

		setTimeout(function(){
			for(let j=0;j<54;j++){

				if(j<27){
					$('.all_poker>.back').eq(j).css({'transform': 'rotateZ('+ ((j+26)*30) +'deg) translateX('+ (j+26)*1 +'px) translateY('+ (j+26)*3+'px)','transition':'transform '+ (j)*0.05 +'s linear'});
				}else{
					$('.all_poker>.back').eq(j).css({'transform': 'rotateZ('+ (j*30) +'deg) translateX('+ j*1 +'px) translateY('+ j*3 +'px)','transition':'transform '+ (j-26)*0.05 +'s linear'});
				 }
			}
		},3500);
		setTimeout(function(){
			for(let j=0;j<54;j++){

				if(j<27){
					$('.all_poker>.back').eq(j).css({'transform': 'rotateZ('+ ((j+26)*30) +'deg) translateX('+ (j+26)*1 +'px) translateY('+ (j+26)*3 +'px)','transition':'transform '+ j*0.1 +'s'}).animate({top:+ 100 +'px' ,left:+ 500 +'px'},500);
				}else{
					$('.all_poker>.back').eq(j).css({'transform': 'rotateZ('+ (j*30)+'deg) translateX('+ j*1 +'px) translateY('+ j*3 +'px)','transition':'transform '+ (j-26)*0.1 +'s'}).animate({top:+ 100 +'px' ,left:+ (- 500) +'px'},500);
				 }
			}
		},4500);
		setTimeout(function(){
			for(let j=0;j<54;j++){

				if(j<27){
					$('.all_poker>.back').eq(j).css({'transform': 'rotateZ('+ ((j+26)*10)+ 5 +'deg) translateX('+ (j+26)*1 +'px) translateY('+ (j+26)*3 +'px)','transition':'transform '+ j*0.15 +'s'}).animate({left:+ 500 +'px'},1000);
				}else{
					$('.all_poker>.back').eq(j).css({'transform': 'rotateZ('+ (j*10)+ 5 +'deg) translateX('+ j*2 +'px) translateY('+ j*5 +'px)','transition':'transform '+ (j-26)*0.15 +'s'}).animate({left:+ (- 500) +'px'},1000);
				 }
			}
		},5500);
		setTimeout(function(){
			for(let j=0;j<54;j++){

				if(j<27){
					$('.all_poker>.back').eq(j).css({'transform': 'rotateZ('+ 0 +'deg)','transition':'transform '+ j*0.1 +'s'}).animate({top:+ 0 +'px'},1000);
				}else{
					$('.all_poker>.back').eq(j).css({'transform': 'rotateZ('+ 0 +'deg)','transition':'transform '+ (j-26)*0.1 +'s'}).animate({top:+ 0 +'px'},1000);
				 }
			}
		},8000);

		//洗牌动画结束
		setTimeout(function(){
			// 4 删除三组临时牌堆
			$('.all_poker').remove();
			// 5 恢复原来牌组
			$('.mid_top').html($all);
			status = false;
			$('.all_poker').animate({left:'500px'});
			
			for(let j=0;j<54;j++){
				$('.all_poker>.back').eq(j).animate({left:+ -j*20 +'px',top:-+ 0 +'px'},500);
			}

		},10000);
		click++;

		// 左右玩家角色出现
		function show1(){
			$('.left .mid_role').show(2000);
			$('.right .mid_role').slideDown(2000);
		}
		show1();
	}


	// 封装发牌函数
	function deal(num){
		num = num || 0;      //把deal(1)中1去掉，要设置默认值
		let poker_html = '';

		if(num < 17){
			// 发牌给左边玩家
			$('.all_poker li:last').animate({left:'-500px',top:'300px'},20);
			setTimeout(function(){

				player[0].poker.push(all_poker.pop());
				poker_html = makePoker(player[0].poker[player[0].poker.length-1]);
				// console.log(poker_html);
				$('.play_1').append(poker_html);
				$('.play_1 li:last').css({top:num*20+'px'});
				$('.play_1').css({top:-10*num+200+'px'});

				$('.all_poker li:last').remove();
			},22);

			// 发牌给中间玩家
			setTimeout(function(){
				$('.all_poker li:last').animate({top:'600px'},20);
				setTimeout(function(){

					player[1].poker.push(all_poker.pop());    //把总牌组数据中的最后一个元素添加到玩家2，并且删除
					poker_html = makePoker(player[1].poker[player[1].poker.length-1]);
					// console.log(poker_html);
					$('.play_2').append(poker_html);
					$('.play_2 li:last').css({left:num*20+'px'});
					$('.play_2').css({left:-10*num+'px'});

					$('.all_poker li:last').remove();
				},22);
			},24);
			
			// 发牌给右边玩家
			setTimeout(function(){
				$('.all_poker li:last').animate({left:'500px',top:'300px'},20);
				setTimeout(function(){

					player[2].poker.push(all_poker.pop());
					poker_html = makePoker(player[2].poker[player[2].poker.length-1]);
					// console.log(poker_html);
					$('.play_3').append(poker_html);
					$('.play_3 li:last').css({top:num*20+'px'});
					$('.play_3').css({top:-10*num+200+'px'});

					$('.all_poker li:last').remove();
					deal(num+1);
				},22);
			},48);
		}else{
			$('.all_poker li').eq(0).animate({left:'-500px'},200);
			$('.all_poker li').eq(1).animate({left:'-650px'},200);
			$('.all_poker li').eq(2).animate({left:'-350px'},200);

			setTimeout(function(){
				//调用所有玩家排序的方法
				all_play_sort();
			},1000);
		}
	}

	//生成牌面HTML代码的函数
	function makePoker(poker_data){
		// console.log(poker_data);
		let color_arr = [
			[-17,-225],      // 方块花色的坐标
			[-17,-5],        // 梅花花色的坐标
			[-160,-5],       // 红桃花色的坐标
			[-160,-225]      // 黑桃花色的坐标
		];
		let x,y;
		// 判断是否为大小王
		if(poker_data.num < 14){
			// 生成本卡牌花色坐标
			x = color_arr[poker_data.color][0];
			y = color_arr[poker_data.color][1];
		}else{
			if(poker_data.color == 0){
				x = -160;
				y = -5;
			}else{
				x = -17;
				y = -5;
			}
		}

		poker_html ='<li style="width: 125px; height: 175px; border-radius:10px; background: url(./images/'+poker_data.num+'.png) '+x+'px '+y+'px;" data-color="'+poker_data.color+'"; data-num="'+poker_data.num+'";></li>';
		return poker_html;
	}


	//发牌完成后所有玩家的牌进行排序
	function all_play_sort(){
		// 调用牌组排序方法让玩家的手牌数据进行排序
		pokerSort(player[0].poker);
		pokerSort(player[1].poker);
		pokerSort(player[2].poker);

		// 使用动画效果让牌组看起进行了自动排序
		// 左边玩家
		$('.play_1 li').remove();
		for(let i=0;i<17;i++){
			$('.play_1').append('<li class="back"></li>');
			$('.play_1 li:last').css({top:20*i+'px'});
		}
		let poker_html = '';
		setTimeout(function(){
			$('.play_1 li').remove();
			for(let i=0;i<17;i++){
				poker_html = makePoker(player[0].poker[i]);
				// console.log(poker_html);
				$('.play_1').append(poker_html);
				$('.play_1 li:last').css({top:20*i+'px'});
			}
		},500);


		// 中间玩家
		$('.play_2 li').remove();
		for(let i=0;i<17;i++){
			$('.play_2').append('<li class="back"></li>');
			$('.play_2 li:last').css({left:20*i+'px'});
		}
		// let poker_html = '';
		setTimeout(function(){
			$('.play_2 li').remove();
			for(let i=0;i<17;i++){
				poker_html = makePoker(player[1].poker[i]);
				// console.log(poker_html);
				$('.play_2').append(poker_html);
				$('.play_2 li:last').css({left:20*i+'px'});
			}
		},500);


		// 右边玩家
		$('.play_3 li').remove();
		for(let i=0;i<17;i++){
			$('.play_3').append('<li class="back"></li>');
			$('.play_3 li:last').css({top:20*i+'px'});
		}
		// let poker_html = '';
		setTimeout(function(){
			$('.play_3 li').remove();
			for(let i=0;i<17;i++){
				poker_html = makePoker(player[2].poker[i]);
				// console.log(poker_html);
				$('.play_3').append(poker_html);
				$('.play_3 li:last').css({top:20*i+'px'});
			}
		},500);

		// 调用抢地主函数
		getBoss();

	}

	// 对牌组数据进行排序的方法
	function pokerSort(poker_arr){
		poker_arr.sort(function(x,y){
			if(x.num != y.num){
				return x.num - y.num;
			}else{
				return x.color - y.color;
			}
		});
	}

	//抢地主函数
	function getBoss(get_play,cancelNum){      //cancelNum ：不抢的次数  
		if(cancelNum === undefined){
			cancelNum = 0;
		}

		if(get_play === undefined){
			get_play = Math.floor(Math.random()*3);       //get_play：地主人选 0~3
		}

		// 把对应的玩家抢地主的按钮显示
		$('.play_btn').eq(get_play).css({'display':'block'});

		/**
		 * 时钟倒计时
		 */
		let t = 5;
		$('.timer1').eq(get_play).html('5');
		let time = setInterval(function () {
	        let time1 = new Date();
	        $('.timer1:eq(' + get_play + ')').html(t--);
	        if (t < 0) {
					$('.cancel').eq(get_play).click();
	       		 t = 5;
			}
	    }, 1000);
    

		// 绑定抢地主事件
		$('.play_btn').eq(get_play).on('click','.get',function(){
			// 清除倒计时
			clearInterval(time);

			src = './music/'+music[28]+'.mp3';  
			$('audio').eq(1).attr('src',src);      
			// 隐藏当前按钮组
			$('.play_btn').css({'display':'none'});
			// alert('抢地主');

			// 人物图片更换为农民地主图片
			$('.mid_role').css({'background':'url(./images/07.gif)no-repeat center'});
			$('.mid_role').eq(get_play).css({'background':'url(./images/00.gif)no-repeat center'});

			player[get_play].role = 1;      //设置玩家为地主角色（1）
			game.boss = player[get_play];
			
			poker_html = '';
			$('.all_poker li').remove();
			// 把最后三张牌的数据发给地主角色
			for(let i=0;i<all_poker.length;i++){
				poker_html = makePoker(all_poker[i]);
				// 地主牌生成
				$('.all_poker').append(poker_html);

				// 地主牌放入玩家牌组
				$('.play').eq(get_play).append(poker_html);
				// 中间玩家放牌的方式
				if(get_play == 1){
					$('.play').eq(get_play).find('li:last').css({left:(17+i)*20+'px'});
				}else{  // 两边玩家放牌的方式
					$('.play').eq(get_play).find('li:last').css({top:(17+i)*20+'px'});
				}
				// 把总牌组中的最后三张牌数据添加到地主玩家数据中
				player[get_play].poker.push(all_poker[i]);
			}

			// 地主牌开牌动画
			// $('.all_poker li').eq(0).animate({left:'0px'},500).animate({top:'-80px'},200);
			// $('.all_poker li').eq(1).animate({left:'-150px'},500).animate({top:'-80px'},200);
			// $('.all_poker li').eq(2).animate({left:'150px'},500).animate({top:'-80px'},200);
			$('.all_poker li').eq(0).animate({left:'-500px'},500).animate({top:'-90px'},200).animate({height:'130px',width:'100px'},200);
			$('.all_poker li').eq(1).animate({left:'-650px'},500).animate({top:'-90px'},200).animate({height:'130px',width:'100px'},200);
			$('.all_poker li').eq(2).animate({left:'-350px'},500).animate({top:'-90px'},200).animate({height:'130px',width:'100px'},200);


			// 地主玩家牌重新排序
			setTimeout(function(){
				// 删除原牌组
				$('.play').eq(get_play).find('li').remove();
				// 生成背面的牌组
				for(let i=0;i<20;i++){
					$('.play').eq(get_play).append('<li class="back"></li>');
					if(get_play == 1){
						$('.play').eq(get_play).find('li:last').css({left:20*i+'px'});
						$('.play').eq(get_play).css({left:-10*i+'px'});
					}else{
						$('.play').eq(get_play).find('li:last').css({top:20*i+'px'});
					}
					// $('.play').eq(get_play).find('li:last').css({left:20*i+'px'});
					// $('.play').eq(get_play).css({left:-10*i+'px'});
				}
				setTimeout(function(){
					// 地主牌数据重新排序
					pokerSort(player[get_play].poker);
					// 删除原牌组
					$('.play').eq(get_play).find('li').remove();
					let poker_html = '';
					for(let i=0;i<player[get_play].poker.length;i++){
						poker_html = makePoker(player[get_play].poker[i]);
						$('.play').eq(get_play).append(poker_html);
						if(get_play == 1){
							$('.play').eq(get_play).find('li:last').css({left:20*i+'px'});
							$('.play').eq(get_play).css({left:-10*i+'px'});
						}else{
							$('.play').eq(get_play).find('li:last').css({top:20*i+'px'});
						}
						// $('.play').eq(get_play).find('li:last').css({left:20*i+'px'});
						// $('.play').eq(get_play).css({left:-10*i+'px'});
					}
					// 开始出牌阶段
					playerCard(get_play,0);
				},200);

			},800);

		});

		// 绑定不抢地主事件
		$('.play_btn').eq(get_play).on('click','.cancel',function(){
			// 清除倒计时
			clearInterval(time);
			src = './music/'+music[29]+'.mp3';  
			$('audio').eq(1).attr('src',src);  
			// alert('不抢');
			cancelNum++;
			// 判断不抢地主的次数
			if(cancelNum == 3){
				alertMsg('没有玩家抢地主，重新发牌！');
				$('.btn_ok').click(function(){
					window.location.href = window.location.href;     //刷新当前页面
				});	
				$('.timer1').css({'display':'none'});       // 隐藏倒计时
			}
			
			// 隐藏当前的按钮组
			$('.play_btn').css({'display':'none'});

			// 移除本按钮组绑定的事件，防止重复绑定
			$('.play_btn').eq(get_play).find('.get').off('click');
			$('.play_btn').eq(get_play).find('.cancel').off('click');

			get_play = ++get_play > 2? 0 : get_play;
			getBoss(get_play,cancelNum);
		});

	}

	/**
	 * alertMsg 提示框
	 */
	function alertMsg(msg){
		$('.alertMsg .msg').html(msg);
		$('.alertMsg').css({'display':'block'});
		$('.bg_wrap').css({'display':'block'});
		$('.btn_ok').click(function(){
			$('.alertMsg').css({'display':'none'});
			$('.bg_wrap').css({'display':'none'});
		});
	}


	function alertWind(){
		setTimeout(function(){
			// $('.alertWind').slideDown(1000);
			$('.alertWind').css({'display':'block'});
		},700);
		setTimeout(function(){
			$('.btn_again').slideDown(2000);
		},800);
		$('.bg_wrap').css({'display':'block'});
		$('.btn_close').click(function(){
			$('.alertWind').css({'display':'none'});
			$('.bg_wrap').css({'display':'none'});
			$('.fg').css({'display':'none'});
		});
		$('.btn_again').click(function(){

			window.location.href = window.location.href; 

		});
	}

	function alertWinn(){
		setTimeout(function(){
			// $('.alertWinn').slideDown(1000);
			$('.alertWinn').css({'display':'block'});
			// $('.btn_again').slideDown("slow");
		},700);
		// $('.alertWinn').css({'display':'block'});
		$('.bg_wrap').css({'display':'block'});
		$('.btn_close').click(function(){
			$('.alertWinn').css({'display':'none'});
			$('.bg_wrap').css({'display':'none'});
		});
		$('.btn_again').click(function(){

			window.location.href = window.location.href; 

		})
	}

	// 出牌阶段
	function playerCard(index,cancelNum){          //老师写的playPoker
		// 0、初始化所有页面元素与事件
		$('.play_btn2').css({'display':'none'});
		// 解绑选牌事件
		$('.play').off('click','li');
		// 解绑出牌事件
		$('.play_btn2').off('click', '.play_out');
		// 解绑过牌事件
		$('.play_btn2').off('click', '.pass');
		// 解绑提示事件
		$('.play_btn2').off('click', '.tips');

		$('.pass').attr('disabled',false);
		// 桌面没牌时，不能点击“不出”
		if(game.desktop_poker.type == 0){
			$('.pass').eq(index).attr('disabled',true);
		}
		// console.log(game);
		
		/**
		 * 倒计时10秒
		 */
		let t = 15;
		$('.timer2').eq(index).html('15');
		let time2 = setInterval(function () {
            let time3 = new Date();
            $('.timer2:eq(' + index + ')').html(t--);
            if (t < 0) {
					$('.pass').eq(index).click();
           		 t = 10;
			}
        }, 1000);


		// 1、先让出牌玩家对应的按钮组显示
		$('.play_btn2').eq(index).css({'display':'block'});

		// 2、绑定选牌事件
		$('.play').eq(index).on('click','li',function(){
			let poker = {};
			poker.num = $(this).attr('data-num')*1;
			poker.color = $(this).attr('data-color')*1;

			if($(this).attr('class') == 'select'){
				// 删除玩家选中牌组的数据
				$(this).removeClass('select');	
				// 调用删除对应牌的数据方法
				delSelect(poker);
			}else{
				// 添加玩家选中的牌到牌组数据
				game.select_poker.poker.push(poker);
				$(this).addClass('select');
			}

			console.log(game.select_poker.max);

		});


		// 3、绑定出牌事件
		$('.play_btn2').eq(index).on('click','.play_out',function(){
			clearInterval(time2);
			// alert('出牌');
			// 调用检查牌型方法
			checkPoker(game.select_poker);
			console.log(game.select_poker.type);

			// 判断玩家出的牌是否符合规则
			if(game.select_poker.type == 0){
				// 提示框
				console.log(game.select_poker);
				alertMsg('您的牌有误!');
			}else{
				// 调用选中牌与桌面牌进行对比的函数
				if(vsPoker()){
					// 1、删除玩家手牌的数据
					delPlayerpoker(index);
					console.log(game.select_poker.max);

					// 调用出牌的音乐
					musics();

					/**
					 * 玩家出牌，更新桌面的牌数据
					 */
					// 清空桌面的牌数据
					game.desktop_poker.poker.splice(0);
					for(let i=0;i<game.select_poker.poker.length;i++){
						game.desktop_poker.poker.push(game.select_poker.poker[i]);
					}
					game.desktop_poker.type = game.select_poker.type;
					game.desktop_poker.max = game.select_poker.max;
					console.log(game.desktop_poker);
					

					/**
					 * 执行对应的桌面效果（桌面出现新牌，玩家手牌消失）
					 */
					// 桌面出现新牌
					$('.desktop_poker').find('li').remove();
					// console.log(game.select_poker);
					let poker_html = '';
					for(let i=0;i<game.select_poker.poker.length;i++){
						poker_html = makePoker(game.select_poker.poker[i]);
						$('.desktop_poker').append(poker_html);
						$('.desktop_poker').find('li:last').css({left:20*i+'px'});
						$('.desktop_poker').css({left:-10*i+'px'});
					}
					console.log(poker_html);

					// 调用王炸等动画方法
					if (game.select_poker.type == 6 || game.select_poker.type == 44 ||
                        game.select_poker.type == 9 || game.select_poker.type == 911 ||
                        game.select_poker.type == 110) {
                        effects();
                    }

					// 玩家手牌消失
					// 删除原牌组
					$('.play').eq(index).find('li').remove();
					for(let i=0;i<player[index].poker.length;i++){
						poker_html = makePoker(player[index].poker[i]);
						$('.play').eq(index).append(poker_html);
						if(index == 1){
							$('.play').eq(index).find('li:last').css({left:20*i+'px'});
							$('.play').eq(index).css({left:-10*i+'px'});
						}else{
							$('.play').eq(index).find('li:last').css({top:20*i+'px'});
						}
						
					}
				
					// 清空选中的牌数据
					game.select_poker.poker.splice(0);

					// 2、判断是否已经胜出
					if(player[index].poker.length == 0){
						// alertMsg('你赢了！');
						// $(".fg").css({display:'block'});
						setTimeout(function(){
							$('.fg').fadeIn("slow");
							$(".fg").css({display:'block'});
						},500);
						
						if(player[index].role == 1){
							alertWind();
						}else{
							alertWinn();
						}
					}else{
						// 3、准备让下一个玩家出牌
						index = index == 2? 0: index+1;
						playerCard(index,0);
					}
				}else{
					// 提示框
					alertMsg('您的牌有误！');
				}
			}
			
		});

		// 4、绑定过牌事件
		$('.play_btn2').eq(index).on('click','.pass',function(){
			clearInterval(time2);

			// 音乐
			let num1 = Math.floor(Math.random()+0.5)+ 30;
		    src = './music/'+music[num1]+'.mp3';
			$('audio').eq(1).attr('src',src);

			// alert('不出');
			// 点击“不出”时，选中的牌回位
			$('.play').eq(index).find('li').removeClass('select');
			// 清空选中牌的数据
			game.select_poker.poker.splice(0);
			// console.log(game.select_poker.poker);

			index = ++index > 2? 0 : index;
			cancelNum++;
			console.log(cancelNum);
			if(cancelNum == 2){
				// 1、清空桌面牌型数据
				game.desktop_poker.type = 0;
				game.desktop_poker.max = 0;
				game.desktop_poker.poker = [];
				// 2、重置过牌次数
				cancelNum = 0;
			}
			playerCard(index,cancelNum);
		});

		/**
		 * 绑定提示事件
		 */
		$('.play_btn2').eq(index).on('click','.tips',function(){
			tipsPoker(index);
		});

	}

	// 删除选中牌组的指定方法
	function delSelect(poker){
		let index = null;
		for(let i=0;i<game.select_poker.poker.length;i++){
			if(game.select_poker.poker[i].num == poker.num && game.select_poker.poker[i].color == poker.color){
				index = i;
				break;
			}
		}
		game.select_poker.poker.splice(index,1);
		// console.log(game.select_poker.poker);
	}

	/**
	 * 玩家出牌成功后，删除对应玩家手牌数据
	 */
	function delPlayerpoker(index){
		let select_poker = game.select_poker.poker;
		let player_poker = player[index].poker;

		for(let i=0; i<select_poker.length; i++){
			for(let j=0; j<player_poker.length; j++){
				if(select_poker[i].num == player_poker[j].num &&
					select_poker[i].color == player_poker[j].color){
					player_poker.splice(j,1);
				}
			}
		}
	}


	/**
	 * 检查牌型的方法
	 * @param   object poker_data  需要检查牌型的数据对象
	 * @return  {[type]}           [description]
	 * 
	 * 牌型代号：
	 * 0：无效
	 * 1：单张
	 * 2：对子
	 * 3：三张
	 * 4：三带一
	 * 44：两个三带一
	 * 444：三个三带一
	 * 4444：四个三带一
	 * 5：三带二
	 * 55：两个三带二
	 * 555：三个三带二
	 * 7：四带二
	 * 6: 顺子
	 * 9：连对
	 * 911：普通炸弹
	 * 110：王炸
	 */
	function checkPoker(poker_data){
		// 初始化牌型与判断值
		poker_data.type = 0;
		poker_data.max = 0;

		let poker = poker_data.poker;
		// 1、为了方便牌型的判断，需要先把选中的牌进行排序
		pokerSort(poker);
		// console.log(poker.length);

		// 2、通过牌的张数来进行各自牌型的判断
		switch(poker.length){
			// 判断1张牌的情况
			case 1:
				poker_data.type = 1;        // 设置牌型为单张
				// 判断普通单张的判断值
				if(poker[0].num < 14){
					poker_data.max = poker[0].num;
				}else{
					// 判断大小王
					if(poker[0].color == 0){
						poker_data.max = 14;    //小王的判断值
					}else{
						poker_data.max = 15;    //大王的判断值
					}
				}
				break;
			// 判断两张牌的情况
			case 2:
				// 判断两张牌的点数是否一样
				if(poker[0].num == poker[1].num){
					console.log(poker[0].num);
					console.log(poker[1].num);
					// 判断是否是普通对子还是王炸
					if(poker[0].num < 14){
						poker_data.type = 2;        // 设置牌型为对子
						poker_data.max = poker[0].num;      // 判断值
					}else{
						poker_data.type = 110;      //设置牌型为王炸
						poker_data.max = poker[0].num;  
					}
				}
				break;
			// 判断三张牌的情况
			case 3:
				// 判断三张牌的点数是否一样
				if(poker[0].num == poker[2].num){
					poker_data.type = 3;         // 设置牌型为为三张相同牌
					poker_data.max = poker[0].num
				}
				break;
			// 判断四张牌的情况
			case 4:
				// 判断四张牌的点数是否一样
				if(poker[0].num == poker[3].num){
					poker_data.type = 911;		   // 设置牌型为普通炸弹
					poker_data.max = poker[0].num;
				}else if(poker[0].num == poker[2].num || poker[1].num == poker[3].num){
					poker_data.type = 4;           // 设置牌型为三带一
					poker_data.max = poker[1].num;
				}
				break;
			// 判断五张牌的情况
			case 5:
				// 判断三带二
				if(poker[0].num == poker[2].num && poker[3].num == poker[4].num || 
					poker[2].num == poker[4].num && poker[0].num == poker[1].num){
					poker_data.type = 5;        // 设置牌型为三带二
					poker_data.max = poker[2].num;
				}else if(checkStraight(poker)){       // 判断顺子
					poker_data.type = 6;         // 设置牌型顺子
					poker_data.max = poker[poker.length-1].num;
				}
				break;
			// 判断六张牌的情况
			case 6:
				if(checkStraight(poker)){         // 判断顺子
					poker_data.type = 6;          // 设置牌型顺子
					poker_data.max = poker[poker.length-1].num;
				}else if(checkStraightPairs(poker)){         // 判断连对
					poker_data.type = 9;          // 设置牌型连对
					poker_data.max = poker[poker.length-1].num;
				}else if(poker[0].num == poker[3].num || poker[1].num == poker[4].num 
					|| poker[2].num == poker[5].num){     // 判断四带二
					poker_data.type = 7;        // 设置牌型为四带二
					poker_data.max = poker[3].num;
				}
				break;
			// 判断七张牌的情况
			case 7:
				if(checkStraight(poker)){         // 判断顺子
					poker_data.type = 6;          // 设置牌型顺子
					poker_data.max = poker[poker.length-1].num;
				}
				break;
			// 判断八张牌的情况
			case 8:
				if(checkStraight(poker)){         // 判断顺子
					poker_data.type = 6;          // 设置牌型顺子
					poker_data.max = poker[poker.length-1].num;
				}else if(checkStraightPairs(poker)){         // 判断连对
					poker_data.type = 9;          // 设置牌型连对
					poker_data.max = poker[poker.length-1].num;
				}else if(
				    (poker[0].num == poker[2].num &&    // 55566678
                    poker[0].num == poker[5].num - 1 &&
                    poker[3].num == poker[5].num) ||

                    (poker[1].num == poker[3].num &&    // 45556667
                    poker[1].num == poker[4].num - 1 &&
                    poker[4].num == poker[6].num) ||

                    (poker[2].num == poker[4].num &&    // 34555666
                    poker[2].num == poker[5].num - 1 &&
                    poker[5].num == poker[7].num)||

                    (poker[0].num == poker[2].num &&    // 55566677
                    poker[0].num == poker[3].num - 1 &&
                    poker[3].num == poker[5].num)){   
					poker_data.type = 44;		//判断牌型为两个三带一
					poker_data.max = poker[5].num;	// 判断值
					return true; 
				}
				break;
			// 判断九张牌的情况
			case 9:
				if(checkStraight(poker)){         // 判断顺子
					poker_data.type = 6;          // 设置牌型顺子
					poker_data.max = poker[poker.length-1].num;
				}
				break;
			// 判断十张牌的情况
			case 10:
				if(checkStraight(poker)){		// 判断顺子
					poker_data.type = 6;		// 设置牌型顺子
					poker_data.max = poker[poker.length-1].num;	// 判断值
				}else if (poker[0].num == poker[1].num &&   //3344555666
                    poker[2].num == poker[3].num &&
                    poker[4].num == poker[6].num &&
                    poker[7].num == poker[9].num &&
                    poker[4].num == poker[7].num - 1 ||

                    poker[0].num == poker[1].num &&         //4455566677
                    poker[2].num == poker[4].num &&
                    poker[5].num == poker[7].num &&
                    poker[8].num == poker[9].num &&
                    poker[2].num == poker[5].num - 1 ||

                    poker[0].num == poker[2].num &&         //5556667788
                    poker[3].num == poker[5].num &&
                    poker[6].num == poker[7].num &&
                    poker[8].num == poker[9].num &&
                    poker[0].num == poker[3].num - 1){
					poker_data.type = 44;		// 设置牌型两个连续的三带一对
					poker_data.max = poker[5].num;	
					return true;   
				}else if(checkStraightPairs(poker)){		// 判断连对
					poker_data.type = 9;		// 设置牌型连对
					poker_data.max = poker[poker.length-1].num;	
				}
			    break;
			// 判断十一张牌
			case 11:
				if(checkStraight(poker)){		// 判断顺子
					poker_data.type = 6;		// 设置牌型顺子
					poker_data.max = poker[poker.length-1].num;	
				}
			    break;
	    	// 判断十二张牌
			case 12:
				if(checkStraight(poker)){		// 判断顺子
					poker_data.type = 6;		// 设置牌型顺子
					poker_data.max = poker[poker.length-1].num;	
				}else if (	// 345 666777888
                    poker[3].num == poker[5].num &&
                    poker[6].num == poker[8].num &&         
                    poker[9].num == poker[11].num &&        
                    poker[3].num == poker[9].num - 2 &&     
                    poker[2].num != poker[3].num||          
                    // 34 666777888 J                       
                    poker[2].num == poker[4].num &&
                    poker[5].num == poker[7].num &&
                    poker[8].num == poker[10].num &&
                    poker[2].num == poker[8].num- 2 &&
                    poker[1].num != poker[2].num &&
                    poker[10].num != poker[11].num||
                    // 3 666777888 JQ
                    poker[1].number == poker[3].num &&
                    poker[4].number == poker[6].num &&
                    poker[7].number == poker[9].num &&
                    poker[1].number == poker[7].num - 2 &&
                    poker[0].num != poker[1].num &&
                    poker[9].num != poker[10].num||
                    // 666777888 JQK
                    poker[0].num == poker[2].num &&
                    poker[3].num == poker[5].num &&
                    poker[6].num == poker[8].num &&
                    poker[0].num == poker[6].num - 2 &&
                    poker[8].num == poker[9].num){
					poker_data.type = 44;   // 判断牌型为三个连续的三带一
					poker_data.max = poker[6].num; 
				}else if(checkStraightPairs(poker)){		// 判断连对
					poker_data.type = 9;		// 设置牌型连对
					poker_data.max = poker[poker.length-1].num;	
				}
			    break;
			// 判断十四张牌
			case 14:
				if(checkStraightPairs(poker)){		// 判断连对
					poker_data.type = 9;		// 设置牌型连对
					poker_data.max = poker[poker.length-1].num;	// 判断值
				}
			    break;
		    // 判断十五张牌
			case 15:
				if (//	334455 666777888	
                    poker[0].num== poker[1].num &&
                    poker[2].num== poker[3].num &&
                    poker[4].num== poker[5].num &&
                    poker[6].num== poker[8].num &&
                    poker[9].num== poker[11].num &&
                    poker[12].num == poker[14].num &&
                    poker[6].num== poker[12].num - 2 ||
                    //	3344 666777888 JJ	
                    poker[0].num == poker[1].num &&
                    poker[2].num == poker[3].num &&
                    poker[4].num == poker[6].num &&
                    poker[7].num == poker[9].num &&
                    poker[10].num == poker[12].num &&
                    poker[13].num == poker[14].num &&
                    poker[4].num == poker[10].num - 2 ||
                    //	33 666777888 99JJ	
                    poker[0].num == poker[1].num &&
                    poker[2].num == poker[4].num &&
                    poker[5].num == poker[7].num &&
                    poker[8].num == poker[10].num &&
                    poker[11].num == poker[12].num &&
                    poker[13].num == poker[14].num &&
                    poker[2].num == poker[8].num - 2 ||
                    //	666777888 99JJQQ	
                    poker[0].num == poker[2].num &&
                    poker[3].num == poker[5].num &&
                    poker[6].num == poker[8].num &&
                    poker[9].num == poker[10].num &&
                    poker[11].num == poker[12].num &&
                    poker[13].num == poker[14].num &&
                    poker[0].num == poker[6].num - 2) {
					poker_data.type = 44;		// 设置牌型三个三带二
					poker_data.max = poker[7].num;	
				}
			    break;
			// 判断十六张牌
			case 16:
				if(checkStraightPairs(poker)){		// 判断连对
					poker_data.type = 9;		// 设置牌型连对
					poker_data.max = poker[poker.length-1].num;	
				}else if(    // 777888999MMM JQKA
	                poker[0].num == poker[2].num &&
	                poker[3].num == poker[5].num &&
	                poker[6].num == poker[8].num &&
	                poker[9].num == poker[11].num &&
	                poker[0].num == poker[9].num - 3 &&
	                poker[11].num != poker[12].num ||
	                //  3 777888999MMM JQK
	                poker[1].num == poker[3].num &&
	                poker[4].num == poker[6].num &&
	                poker[7].num == poker[9].num &&
	                poker[10].num == poker[12].num &&
	                poker[1].num == poker[10].num - 3  &&
	                poker[0].num != poker[1].num  &&
	                poker[12].num != poker[13].num ||
	                //  34 777888999MMM JQ
	                poker[2].number == poker[4].num &&
	                poker[5].number == poker[7].num &&
	                poker[8].number == poker[10].num &&
	                poker[11].number == poker[13].num &&
	                poker[2].number == poker[11].num - 3  &&
	                poker[1].num != poker[2].num  &&
	                poker[13].num != poker[14].num||
	                //  345 777888999MMM J
	                poker[3].number == poker[5].num &&
	                poker[6].number == poker[8].num &&
	                poker[9].number == poker[11].num &&
	                poker[12].number == poker[14].num &&
	                poker[3].number == poker[12].num - 3  &&
	                poker[2].num != poker[3].num  &&
	                poker[14].num != poker[15].num||
	                //  3456 777888999MMM
	                poker[4].number == poker[6].num &&
	                poker[7].number == poker[9].num &&
	                poker[10].number == poker[12].num &&
	                poker[13].number == poker[15].num &&
	                poker[4].number == poker[13].num - 3 &&
	                poker[3].num != poker[4].num){
					poker_data.type = 44;		// 设置牌型四个三带一
					poker_data.max = poker[5].num;	
                }
                break;
            //判断十八张牌
            case 18:
                // 判断牌型为连对
               if(checkStraightPairs(poker)){		// 判断连对
					poker_data.type = 9;		// 设置牌型连对
					poker_data.max = poker[poker.length-1].num;	
				}
				break;
			//判断二十张牌
            case 20:
                // 判断牌型为连对
               if(checkStraightPairs(poker)){		// 判断连对
					poker_data.type = 9;		// 设置牌型连对
					poker_data.max = poker[poker.length-1].num;	
				}
				break;
		}

		/**
		 * 判断牌型是否为顺子
		 * 
		 * @param   Array poker  牌组的具体数据，用于判断是不是顺子
		 * @return  boolean      如果检查的数据是顺子，返回true,否则返回false
		 */
		// 34567
		function checkStraight(poker){
			if(poker[poker.length - 1].num < 13){
				for(let i=0; i<poker.length-1; i++){
					if((poker[i].num*1)+ 1 != poker[i+1].num){
						return false;
					}
				}
				return true;
			}
			
		}

		/**
		 * 检查牌型是否为连对
		 * @param   Array poker   牌组的具体数据
		 * @return  Boolean       如果检查的数据是连对，返回true,否则返回false
		 */
		function checkStraightPairs(poker){
			// 3344556677
			for(let i=0; i<poker.length-3; i+=2){
				if(poker[i].num*1 + 1 != poker[i+3].num || 
					poker[i+1].num*1 + 1 != poker[i+2].num){
					return false;
				}
			}
			return true;
		}

	}


	/**
	 * 选中牌与桌面牌进行对比的函数
	 * @return  Boolean  如果选中牌型大于桌面牌型，返回true,否则返回false
	 */
	function vsPoker(){
		// 判断桌面没牌肯定可以打出去
		if(game.desktop_poker.poker.length == 0){
			return true;
		}

		// 判断打出去的是王炸
		if(game.select_poker.type == 110){
			return true;
		}

		// 判断桌面上的牌是王炸
		if(game.desktop_poker.type == 110){
			return false;
		}

		// 判断如果桌面的不是炸弹，选中的是炸弹
		if(game.desktop_poker.type != 911 && game.select_poker.type == 911){
			return true;
		}

		// 判断普通牌型
		if(game.select_poker.type == game.desktop_poker.type && 
			game.select_poker.length == game.desktop_poker.length && 
			game.select_poker.max > game.desktop_poker.max){
			return true;
		}
		return false;
	}

	/**
	 * 背景音乐
	 */
	function musics(){
		switch (game.select_poker.type){
			case 1:
				src = './music/'+music[game.select_poker.max - 1]+'.mp3';
				$('audio').eq(1).attr('src',src);
				break;
			case 2:
				src = './music/'+music[game.select_poker.max + 14]+'.mp3';
				$('audio').eq(1).attr('src',src);
				break;
			case 110:
				src = './music/'+music[40]+'.mp3';
				$('audio').eq(1).attr('src',src);
				setTimeout(function(){
					src = './music/'+music[39]+'.mp3';
					$('audio').eq(1).attr('src',src);
				},1000);
				break;
			case 6:    // 顺子
				src = './music/'+music[32]+'.mp3';
				$('audio').eq(1).attr('src',src);
				break;
			case 9:    // 连对
				src = './music/'+music[33]+'.mp3';
				$('audio').eq(1).attr('src',src);
				break;
			case 4:    // 三带一
				src = './music/'+music[35]+'.mp3';
				$('audio').eq(1).attr('src',src);
				break;
			case 5:    // 三带二
				src = './music/'+music[36]+'.mp3';
				$('audio').eq(1).attr('src',src);
				break;
			case 7:    // 四带二
				src = './music/'+music[38]+'.mp3';
				$('audio').eq(1).attr('src',src);
				break;
			case 911:    // 炸弹
				$('audio').eq(1).attr('src','./music/人声炸弹.mp3');
				setTimeout(function(){
					src = './music/'+music[39]+'.mp3';
					$('audio').eq(1).attr('src',src);
				},1000);
				
				break;
		}
		// 飞机
		if(game.select_poker.type == 44 || game.select_poker.type == 444 || game.select_poker.type == 4444 
			|| game.select_poker.type == 55 || game.select_poker.type == 555){
			$('audio').eq(1).attr('src','./music/feiji.mp3');
			setTimeout(function(){
				src = './music/'+music[34]+'.mp3';
				$('audio').eq(1).attr('src',src);
			},1000);
		}
	}
	

	/**
	 * 特殊牌的动画特效
	 */
	function effects() {
        $('#effects').fadeIn();
        switch (game.select_poker.type) {
            //顺子
            case 6:
                $('.straight').fadeIn().fadeOut(3000);
                break;
            //    飞机
            case 44:
                $('.plane').fadeIn().animate({'left': '10%'}, 2000).fadeOut().css({'left': '70%'});
                break;
            case 9:
                //连对
                $('.evenOn').fadeIn().fadeOut(3000);
                break;
            case 911:
                //炸弹
                $('.bomb').css({'left': ($(window).width() - $('.bomb').width()) / 2}).fadeIn().animate({'top': '40%'}, 1000).fadeOut().css({'top': '-300px'});
                $('.floor').css({'left': ($(window).width() - $('.floor').width()) / 2});
                setTimeout(function(){
                	$('.floor').fadeIn(500).fadeOut(1500);
                },1300);
                
                break;
            case 110:
                //王炸
                $('.bombKing').css({'left': ($(window).width() - $('.bombKing').width()) / 2}).fadeIn().animate({'top': '-20%'}, 800).fadeOut().css({'top': '500px'});
                $('.floor').css({'left': ($(window).width() - $('.floor').width()) / 2}).fadeOut(500);
                break;
        }
        //3秒后隐藏动画
        setTimeout(function () {
            $('#effects').hide();
        }, 3000)
    }

	

	/**
	 * 提示函数：玩家手中的牌与桌面牌进行对比的函数
	 * @return  Boolean  如果手中牌型大于桌面牌型，返回true,否则返回false
	 */
	function tipsPoker(index){
		// 避免多次按提示发生出牌错误
		$('.play').eq(index).find('li').removeClass('select');
		game.select_poker.poker.splice(0);
		game.select_poker.type = 0;
		game.select_poker.max = 0;
		let sel_poker = game.select_poker.poker;
		let desk_max = game.desktop_poker.max;
		let desk_type = game.desktop_poker.type;
		let play_poker = player[index].poker;
		let desk_poker = game.desktop_poker.poker;
		let tip = [];
		// 判断桌面上的牌
		switch(game.desktop_poker.type){
			case 0:
				$('.play').eq(index).find('li').eq(0).addClass('select');
				sel_poker.push(play_poker[0]);
				break;
			case 1:
				for(let i=0;i<play_poker.length;i++){
					if(play_poker[i].num > desk_max){
						$('.play').eq(index).find('li').eq(i).addClass('select');
						// 提示的牌添加到选中的数据
						sel_poker.push(play_poker[i]);
						// console.log(game);
						break;
					}
				}
				break;
			case 2:
				for(let i=0;i<play_poker.length-1;i++){
					if(play_poker[i].num > desk_max && play_poker[i].num == play_poker[i+1].num){
						$('.play').eq(index).find('li').eq(i).addClass('select');
						$('.play').eq(index).find('li').eq(i+1).addClass('select');
						// 提示的牌添加到选中的数据
						sel_poker.push(play_poker[i],play_poker[i+1]);
						break;
					}
				}
				break;
			case 3:
				for(let i=0;i<play_poker.length-2;i++){
					if(play_poker[i].num > desk_max && play_poker[i].num == play_poker[i+2].num){
						$('.play').eq(index).find('li').eq(i).addClass('select');
						$('.play').eq(index).find('li').eq(i+1).addClass('select');
						$('.play').eq(index).find('li').eq(i+2).addClass('select');
						// 提示的牌添加到选中的数据
						sel_poker.push(play_poker[i],play_poker[i+1],play_poker[i+2]);
						break;
					}
				}
				break;
			case 4:      // 三带一
				for(let i = 0; i < play_poker.length - 2; i++){
					if(play_poker[i].num > desk_max && play_poker[i].num == play_poker[i + 2].num){
						sel_poker.push(play_poker[i], play_poker[i + 1], play_poker[i + 2]);
						if(i == 0){
							sel_poker.push(play_poker[3]);
							$('.play').eq(index).find('li').eq(3).addClass('select');
						}else{
							sel_poker.push(play_poker[0]);
							$('.play').eq(index).find('li').eq(0).addClass('select');
						}
						$('.play').eq(index).find('li').slice(i, i + 3).addClass('select');
						break;
					}
				}
				break;
			case 5:       // 三带二
				for(let i=0;i<play_poker.length;i++){
					if(play_poker[i].num > desk_max && play_poker[i].num < 14){
						threeTwo(play_poker,play_poker[i].num,tip);
					}
					if(tip.length == desk_poker.length){
						for(let k=0;k<tip.length;k++){
							sel_poker.push(play_poker[tip[k]]);
							$('.play').eq(index).find('li').eq(tip[k]).addClass('select');
						}
						break;
					}else{
						tip.splice(0);
					}
				}
				break;
			case 6:      // 顺子
				for(let i=0;i<play_poker.length;i++){
					if(play_poker[i].num > desk_max && play_poker[i].num <13){
						for(let j=0;j<desk_poker.length;j++){
							if(!containNum(play_poker , play_poker[i].num - j , tip)){
								break;
							}
						}
					}
					if(tip.length == desk_poker.length){
						for(let k=0;k<tip.length;k++){
							sel_poker.push(play_poker[tip[k]]);
							$('.play').eq(index).find('li').eq(tip[k]).addClass('select');
						}
						break;
					}else{
						tip.splice(0);
					}
					
				}
				break;
			case 9:      // 连对
				for(let i=0;i<play_poker.length;i++){
					if(play_poker[i].num > desk_max && play_poker[i].num < 14){
						for(let j=0;j<desk_poker.length / 2;j++){
							if(!containPairs(play_poker,play_poker[i].num - j,tip)){
								break;
							}
						}
					}
					if(tip.length == desk_poker.length){
						for(let k=0;k<tip.length;k++){
							sel_poker.push(play_poker[tip[k]]);
							$('.play').eq(index).find('li').eq(tip[k]).addClass('select');
						}
						break;
					}else{
						tip.splice(0);
					}
				}
				break;
			case 911:     // 普通炸弹
				for(let i = 0; i < play_poker.length - 3; i++){
					if(play_poker[i].num > desk_max && play_poker[i].num < 14 && play_poker[i].num == play_poker[i + 3].num){
						tip.push(i,i+1,i+2,i+3);
					}
					if(tip.length == desk_poker.length){
						for(let k=0; k < tip.length; k++){
							sel_poker.push(play_poker[tip[k]]);
							$('.play').eq(index).find('li').eq(tip[k]).addClass('select');
						}
						break;
					}else{
					tip.splice(0);
					}
				}
				break;
		}
		// 找不到相同牌型的牌时提示炸弹
		if(sel_poker.length == 0) {
			if(desk_type != 911) {
				for(let i = 0; i < play_poker.length - 3; i++) {
					if(play_poker[i].num == play_poker[i + 3].num) {
						//找到普通炸弹
						tip.push(i, i + 1, i + 2, i + 3);
						for(let k = 0; k < tip.length; k++) {
							sel_poker.push(play_poker[tip[k]]);
							$('.play').eq(index).find('li').eq(tip[k]).addClass('select');
						}
					}
				}
			}
			if(desk_type == 911 || sel_poker.length == 0) {
				if(play_poker[play_poker.length - 1].num == 14 && play_poker[play_poker.length - 2].num == 14) {
					tip.push(play_poker.length - 1, play_poker.length - 2);
				}
				if(tip.length == 2) {
					//找到王炸
					for(let k = 0; k < tip.length; k++) {
						sel_poker.push(play_poker[tip[k]]);
						$('.play').eq(index).find('li').eq(tip[k]).addClass('select');
					}
				}
			}
		}


	}
	//判断手牌中是否有特定点数的牌,若有则将对应下标加入tip数组中并返回true
	function containNum(arr, num, tip) {
		for(let i = 0; i < arr.length; i++) {
			if(arr[i].num == num) {
				tip.push(i);
				return true;
			}
		}
		return false;
	}

	//判断手牌中是否有特定点数的牌,若有则将对应下标加入tip数组中并返回true
	function containPairs(arr, num, tip) {
		for(let i = 0; i < arr.length - 1; i++) {
			if(arr[i].num == num && arr[i + 1].num == num) {
				tip.push(i, i + 1);
				return true;
			}
		}
		return false;
	}

	//判断手牌中是否有特定点数的三带二,若有则将对应下标加入tmp数组中并返回true
	function threeTwo(arr,num,tip){
		for(let i = 0; i < arr.length - 2; i++) {
			if(arr[i].num == num && arr[i + 1].num == num && arr[i + 2].num == num) {
				for(let j = 0; j < arr.length - 1; j++) {
					if(arr[j].num == arr[j + 1].num && arr[i].num != arr[j].num) {
						tip.push(i, i + 1, i + 2, j, j + 1);
						return true;
					}
				}
			}
		}
		return false;
	}

	/**
	 * 小人移动
	 * @return {[type]} [description]
	 */
	function people(){
    	let peo = ['小人','反小人'];
    	setInterval(function(){
			$('.people').animate({'left':'400px'},5000).css({'background':'url(./images/'+peo[0]+'.gif) no-repeat'})
			.css({'background-size':'contain'});			
			setTimeout(function(){
			$('.people').animate({'left':'1500px'},5000).css({'background':'url(./images/'+peo[1]+'.gif) no-repeat'})
			.css({'background-size':'contain'});
			},5000)
    	},10000)
    }


});