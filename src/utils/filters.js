export function amount(n) {
	n = (n / 100).toFloor(2);
	var num = String(n).split(".");
	return (
		num[0]
			.split("")
			.reverse()
			.map((item, index, array) => {
				if (++index !== array.length && index % 3 === 0) {
					return "," + item;
				}
				return item;
			})
			.reverse()
			.join("") + (num[1] ? "." + num[1] : "")
	);
}
export function dateFormat (date,arg) {
	var time=new Date(date);
	var fmt= arg || 'yyyy-MM-dd';
	var o = {
		"M+": time.getMonth() + 1, //月份
		"d+": time.getDate(), //日
		"h+": time.getHours(), //小时
		"m+": time.getMinutes(), //分
		"s+": time.getSeconds(), //秒
		"q+": Math.floor((time.getMonth() + 3) / 3), //季度
		"S": time.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}