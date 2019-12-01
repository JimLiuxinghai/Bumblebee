/*
 * 判断obj是否为一个整数
 */
function isInt(obj) {
	return Math.floor(obj) === obj
}

/*
 * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
 * @param floatNum {number} 小数
 * @return {object}
 *   {times:100, num: 314}
 */
function toInteger(floatNum) {
	let ret = {times: 1, num: 0};
	let isNegative = floatNum < 0;
	if (isInt(floatNum)) {
		ret.num = floatNum;
		return ret
	}
	let strfi = floatNum + '';
	let dotPos = strfi.indexOf('.');
	let len = strfi.substr(dotPos + 1).length;
	let times = Math.pow(10, len);
	let intNum = parseInt(Math.abs(floatNum) * times + 0.5, 10);
	ret.times = times;
	if (isNegative) {
		intNum = -intNum
	}
	ret.num = intNum;
	return ret
}


const numberUtil = {
	sumValue: (datas, type)=> {
		let newData = [];
		let rootData = datas[0];
		let datas_len = datas.length;
		for (let i = 0; i < rootData.length; i++) {
			let sum = 0;
			for (let len = 0; len < datas_len; len++) {
				sum += +(datas[len][i] || 0);
			}
			if (type === '+%') {
				sum = sum / datas_len;
			}
			newData.push(sum);
		}
		return newData;
	},
	/**
	 * 除法，两个数字相除
	 * @param {Array} data
	 * @param {Array} dData
	 * @param {String} type  - 差值   % 差值率
	 * */
	dividesValue: (data, dData, type)=> {
		let newData = [];
		for (let i = 0; i < data.length; i++) {
			let _s = data[i];
			let _d = dData[i];
			let v = '';
			if (type === '%') {
				v = numberUtil.divides(_s, _d, '%');
			}
			newData.push(v);
		}

		return newData;
	},
	/**
	 * 计算差值，差值百分比 只支持两个值
	 * @param {Array} data
	 * @param {Array} dData
	 * @param {String} type  - 差值   % 差值率
	 * */
	diffValue: (data, dData, type)=> {
		let newData = [];
		for (let i = 0; i < data.length; i++) {
			let _s = data[i];
			let _d = dData[i];

			let v = _s - _d;
			if (isNaN(v)) {
				v = 0;
			}
			if (type === '%') {
				v = !_d || _d === 0 ? 0 : (v / _d ) * 100;
			}
			v = numberUtil.toFixed(v);
			newData.push(v);
		}
		return newData;
	},
	/**
	 * 保留几位小数
	 * @param str 字符或者数字
	 * @param number 数字
	 * */
	toFixed: (str, number = 2) => {
		let num = Number(str);
		if (!isNaN(num)) {
			let numStr = num.toFixed(number);
			if (numStr.indexOf('.00') > -1) {
				numStr = numStr.split('.')[0];
			}
			return parseFloat(numStr);
		}
		return str;
	},
	/**
	 * 两个数相除函数  前提num1 num2  必须为数字
	 * @param num1 {Number} 分子
	 * @param num2 {Number} 分母
	 * @param sum {Number} 保存几位小数
	 * @returns {Number}
	 */
	exceptNumber: function (num1, num2, sum) {
		var baseNum1 = 0, baseNum2 = 0;
		var baseNum3, baseNum4;

		try {
			baseNum1 = num1.toString().split('.')[1].length;

		} catch (e) {
			baseNum1 = 0;
		}
		try {
			baseNum2 = num2.toString().split('.')[1].length;
		} catch (e) {
			baseNum2 = 0;
		}
		baseNum3 = Number(num1.toString().replace('.', ''));
		baseNum4 = Number(num2.toString().replace('.', ''));
		return Number(((baseNum3 / baseNum4) * Math.pow(10, baseNum2 - baseNum1)).toFixed(sum));
	},
	/**
	 * 两个数相乘函数  前提num1 num2  必须为数字
	 * @param num1 {Number}
	 * @param num2 {Number}
	 * @returns {Number}
	 */
	rideNumber: function (num1, num2) {
		var baseNum = 0;
		try {
			baseNum += num1.toString().split(".")[1].length;
		} catch (e) {

		}
		try {
			baseNum += num2.toString().split(".")[1].length;
		} catch (e) {

		}
		return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
	},
	/**
	 * 两个数相除函数
	 * @param num1 {Number} 分子
	 * @param num2 {Number} 分母
	 * @returns {Number}
	 */
	divides: function (num1, num2, str) {
		if (num1 == '' || num2 == '') {
			return null;
		}
		if (num1 == null || num2 == null) {
			return null;
		}
		if (num2 == 0) {
			return 0;
		}
		// 非数字类型处理
		num1 = parseFloat(num1);
		num2 = parseFloat(num2);

		if (isNaN(num1) || isNaN(num2)) {
			return null;
		}
		if (str === '%') {
			return numberUtil.rideNumber(numberUtil.exceptNumber(num1, num2, 4), 100);
		}
		return numberUtil.exceptNumber(num1, num2, 2);
	},
	/**
	 * 加法
	 * @param arg1
	 * @param arg2
	 * @returns {number}
	 */
	add: function (arg1, arg2) {
		const o1 = toInteger(arg1);
		const o2 = toInteger(arg2);
		const n1 = o1.num;
		const n2 = o2.num;
		const t1 = o1.times;
		const t2 = o2.times;

		const max = Math.max(t1, t2);
		let result = 0;

		if (t1 === t2) {
			result = n1 + n2;
		} else if (t1 > t2) {
			result = n1 + n2 * (t1 / t2);
		} else {
			result = n1 * (t2 / t1) + n2
		}

		return result / max;
	},
	/**
	 * 减法
	 * @param arg1
	 * @param arg2
	 * @returns {*|number}
	 */
	minus: function (arg1, arg2) {
		const o1 = toInteger(arg1);
		const o2 = toInteger(arg2);
		const n1 = o1.num;
		const n2 = o2.num;
		const t1 = o1.times;
		const t2 = o2.times;

		const max = Math.max(t1, t2);
		let result = 0;

		if (t1 === t2) {
			result = n1 - n2
		} else if (t1 > t2) {
			result = n1 - n2 * (t1 / t2)
		} else {
			result = n1 * (t2 / t1) - n2
		}
		return result / max;
	},
	/**
	 * 乘法
	 * @param arg1
	 * @param arg2
	 * @returns {number}
	 */
	mul: function (arg1, arg2) {
		const o1 = toInteger(arg1);
		const o2 = toInteger(arg2);
		const n1 = o1.num;
		const n2 = o2.num;
		const t1 = o1.times;
		const t2 = o2.times;

		return (n1 * n2) / (t1 * t2)
	},
	/**
	 * 除法
	 * @param arg1
	 * @param arg2
	 * @returns {number}
	 */
	div: function (arg1, arg2) {
		const o1 = toInteger(arg1);
		const o2 = toInteger(arg2);
		const n1 = o1.num;
		const n2 = o2.num;
		const t1 = o1.times;
		const t2 = o2.times;

		return (n1 / n2) * (t2 / t1);
	}
};

module.exports = numberUtil;