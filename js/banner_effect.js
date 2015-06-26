$(function(){
	// 先一一取得相關的元素及高度
	var $block = $('#abgne-block-20120804'),
		$photo = $block.find('.photo'),
		$photoA = $photo.find('a'),
		$photoImg = $photoA.find('img'),
		$photoDesc = $photoA.find('.desc-title'),
		$thumbs = $block.find('.thumbs'),
		$carousel = $block.find('.carousel'),
		_carouselHeight = $carousel.height(),
		$playPauseBtn = $photo.append('<a href="#playPause" id="playPause-btn" title="暫停">暫停</a>').find('#playPause-btn'),
		$ul = $thumbs.find('ul'),
		$li = $ul.find('li'),
		_liHeight = $li.height(),
		_set = Math.ceil(_carouselHeight / _liHeight),
		_count = Math.ceil($li.length / _set),
		_height = _set * _liHeight * -1,
		timer, speed = 1000, _animateSpeed = 400, // 分別設定輪播速度及動畫速度
		_index = 0, _countIndex = 0;

	// 先在縮圖前面都插入一個 .nav-bar, 主要是當點選到該縮圖時的效果
	$('<span class="nav-bar"></span>').insertBefore($li.find('img'));
	// 先讓描述區塊的背景有透明度
	$block.find('.desc-bg').css('opacity', 0.7);

	// 如果圖片組數超出一次能顯示的數量時, 產生可以切換的上下鈕
	var $controls = null;
	if(_count>1){
		$controls = $thumbs.append('<a href="#prev" class="prev"></a><a href="#next" class="next"></a>').find('.prev, .next');
		var $prev = $controls.eq(0).hide(),
			$next = $controls.eq(1);

		// 當點擊上下鈕時
		$controls.click(function(e){
			// 計算要顯示第幾組
			_countIndex = Math.floor((e.target.className == 'prev' ? _countIndex - 1 + _count : _countIndex + 1) % _count);

			// 進行動畫
			$ul.stop().animate({
				top: _countIndex * _height
			}, _animateSpeed);

			// 判斷上下鈕顯示與否
			$prev.toggle(_countIndex>0);
			$next.toggle(_countIndex!=_count-1);

			return false;
		});
	}

	// 如果縮圖 li 被點擊時
	$li.click(function(){
		var $this = $(this),
			$a = $this.find('a'),
			$img = $this.find('img');

		clearTimeout(timer);
		_index = $this.index();
		// 分別改變左邊顯示區塊的超連結, 圖片, alt 及描述內容
		$photoA.attr('href', $a.attr('href'));
		$photoImg.attr({
			src: $img.attr('src'),
			alt: $img.attr('alt')
		});
		$photoDesc.html($img.attr('alt'));
		$this.addClass('current').siblings('.current').removeClass('current');

		// 如果目前的播放鈕並不是在播放樣式時, 就啟動計時器
		if(!$playPauseBtn.hasClass('playPause-btn-play')) timer = setTimeout(auto, speed + _animateSpeed);

		return false;
	}).eq(_index).click();

	// 當播放鈕被點擊時
	$playPauseBtn.click(function(){
		// 進行 .playPause-btn-pause 及 .playPause-btn-play 樣式切換
		var $this = $(this).toggleClass('playPause-btn-pause playPause-btn-play'),
			_hasPlay = $this.hasClass('playPause-btn-play'),
			_txt = _hasPlay ? '播放' : '暫停';

		// 如果目前的播放鈕並不是在播放樣式時, 就啟動計時器; 反之則停止計時器
		if(_hasPlay) clearTimeout(timer);
		else timer = setTimeout(auto, speed);
		$this.attr('title', _txt).text(_txt);

		return false;
	});

	// 自動輪播使用
	function auto(){
		_index = (_index + 1) % $li.length;
		var $tmp = $li.eq(_index).click();

		var _indexCount = Math.floor(_index / _set);
		// 判斷是否要切換縮圖的顯示組數
		if($controls != null && (_index == (_countIndex + 1) * _set || _index == 0) && _countIndex != _indexCount){
			$next.click();
			$tmp.animate({opacity: 1}, _animateSpeed, function(){
				$tmp.addClass('current').siblings('.current').removeClass('current');
			})
		}
	}
});
