var elem = document.createElement('div');
elem.style.position = '-webkit-sticky';
elem.style.position = 'sticky';

if (elem.style.position.indexOf('sticky') < 0) {
  // 当前浏览器不支持粘性定位，需要 fallback 实现
  Array.prototype.forEach.call(document.querySelectorAll('dt'), function (elem) {
    elem.style.height = elem.clientHeight + 'px';
  });
  addEventListener('scroll', function() {
    var stickyElements = document.querySelectorAll('dt');
    for (let idx = 0; idx < stickyElements.length; ++idx) {
      var elem = stickyElements[idx];
      // 对于滚 window 而言，BoundingClientRect 就是元素的视口坐标值
      var clientRect = elem.getBoundingClientRect();
      // 如果标题行被滚到了窗口外
      if (clientRect.top < 0) {
        const parentBottom = elem.parentElement.getBoundingClientRect().bottom;
        if (parentBottom < 0) {
          // 如果父元素整个区域都滚动到了窗口外，则去除标题行的 sticky 类
          elem.classList.remove('sticky');
        } else {
          // 添加 sticky 类，将标题行固定在顶部
          elem.classList.add('sticky');
          // 动态计算 style.top，表现推上去的效果
          elem.style.top = Math.min(0, parentBottom - clientRect.height) + 'px';
        }
      } else {
        // 如果标题行还在窗口内部或下面，则中断循环，将其后的所有标题行的 sticky 类全部删除
        // 用于解决用户滚动太快时的问题
        for (let j = idx; j < stickyElements.length; ++j) {
          stickyElements[j].classList.remove('sticky');
        }
        break;
      }
    }
  });
}