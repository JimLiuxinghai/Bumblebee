/**
 * Created by Administrator on 2017/9/1.
 * 日期类型帮助函数
 */


if (!Date.prototype.format) {
	Date.prototype.format = function (format) {
		/*
		 * format='yyyy-MM-dd hh:mm:ss';
		 */
		var o = {
			'M+': this.getMonth() + 1,
			'd+': this.getDate(),
			'h+': this.getHours(),
			'm+': this.getMinutes(),
			's+': this.getSeconds(),
			'q+': Math.floor((this.getMonth() + 3) / 3),
			'S': this.getMilliseconds()
		};

		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4
				- RegExp.$1.length));
		}

		for (var k in o) {
			if (new RegExp('(' + k + ')').test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1
					? o[k]
					: ('00' + o[k]).substr(('' + o[k]).length));
			}
		}
		return format;
	};
}
if (!String.prototype.parseDate) {
	String.prototype.parseDate = function () {
		var isoExp = /^\s*(\d{4})[-\/\u4e00-\u9fa5](\d\d?)[-\/\u4e00-\u9fa5](\d\d?)[\u4e00-\u9fa5]?\s*$/,
			date = new Date(), month,
			parts = isoExp.exec(this);
		if (parts) {
			month = +parts[2];
			date.setFullYear(parts[1], month - 1, parts[3]);
			if (month != date.getMonth() + 1) {
				date.setTime(NaN);
			}
		}
		return date;
	}
}

module.exports = {
    datetime: function (format = 'yyyy-MM-dd') {
        return this.format(new Date(), format);
    },
	format: function (d, format) {
		/*
		 * format='yyyy-MM-dd hh:mm:ss';
		 */
		const o = {
			'M+': d.getMonth() + 1,
			'd+': d.getDate(),
			'h+': d.getHours(),
			'm+': d.getMinutes(),
			's+': d.getSeconds(),
			'q+': Math.floor((d.getMonth() + 3) / 3),
			'S': d.getMilliseconds()
		};

		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (d.getFullYear() + '').substr(4
				- RegExp.$1.length));
		}

		for (let k in o) {
			if (new RegExp('(' + k + ')').test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1
					? o[k]
					: ('00' + o[k]).substr(('' + o[k]).length));
			}
		}
		return format;
	},
	/**
	 * 字符串转日期
	 * @param str
	 * @returns {Date}
	 */
	strToDate: function (str) {
		let isoExp = /^\s*(\d{4})[-\/\u4e00-\u9fa5](\d\d?)[-\/\u4e00-\u9fa5](\d\d?)[\u4e00-\u9fa5]?\s*$/;
		let date = new Date();
		let month;
		let parts = isoExp.exec(str);
		if (parts) {
			month = +parts[2];
			date.setFullYear(parts[1], month - 1, parts[3]);
			if (month != date.getMonth() + 1) {
				date.setTime(NaN);
			}
		}
		return date;
	},
	/**
	 * 日期段相差多少天
	 * @param startTime {Date} 2016-08-01
	 * @param endTime {Date} 2016-08-10
	 * @param isF {Boolean} isF 是否负数
	 * @returns 10 {Number}
	 * */
	getDateDiff: function (startTime, endTime, isF = false) {
		let start = new Date(startTime).getTime();
		let end = new Date(endTime).getTime();
        let d_value = end - start;
        if(isF) {
            return Math.floor(d_value / 1000 / 60 / 60 / 24);
        }
		return Math.abs(d_value / 86400000);
	},
	/**
	 * 切换日期
	 * @param date {String} 2016-08-01
	 * @param num {Number} 等于 0 当天
	 *                       大于0  例如为1时 2016-08-02
	 *                      小于0  例如为-1时 2016-07-31
	 * */
	switch: function (date, num) {
		let thisTime = new Date(date).getTime();
		let lastTime = new Date(thisTime + (num * 86400000));
		let lastYear = lastTime.getFullYear();
		let lastMonth = lastTime.getMonth() + 1;
		lastMonth = lastMonth < 10 ? `0${lastMonth}` : lastMonth;
		let lastDay = lastTime.getDate();
		lastDay = lastDay < 10 ? `0${lastDay}` : lastDay;

		return `${lastYear}-${lastMonth}-${lastDay}`;
	},
	/**
	 * 分开日期（包含今天）为2个数组
	 * @param dates {Array}
	 * @param date {Date}
	 * @returns {Object} {history: Array, future: Array}
	 */
	separate: function (dates, date) {
		let history = [];
		let future = [];
		let strToDate = this.strToDate;

		let now = strToDate(date);
		dates.forEach((d)=> {
			let time = strToDate(d);
			if (time < now) {
				history.push(d);
			} else {
				future.push(d);
			}
		});
		return {
			history,
			future
		}
	},

	/**
	 * 获取日期属于一年中第几周 星期几
	 * @param date 2016-01-01
	 * @returns {Object} year 属于哪一年第几周  num 第几周  week 周几 [0,1,2,3,4,5,6] 星期日为 0
	 * {
     *  year:2015,
     *  num:53,
     *  week:5
     * }
	 * */
	getWeekNum: function (date) {
		let thisTime = new Date(date);
		thisTime = new Date(new Date(date).getFullYear(), thisTime.getMonth(), thisTime.getDate());
		let nowTime = new Date(thisTime.getFullYear(), 0, 1);
		let nowWeek = nowTime.getDay();
		if (nowWeek !== 0) {
			nowTime = new Date(thisTime.getFullYear(), 0, 1 + (7 - nowWeek));
			if ((thisTime - nowTime) < 0) {
				nowTime = new Date(thisTime.getFullYear() - 1, 0, 1);
			}
		}
		let weekNum = Math.floor(((thisTime - nowTime ) / 86400000 ) / 7) + 1;

        let season = {1: 1, 2: 1, 3: 1,
                      4: 2, 5: 2, 6: 2,
                      7: 3, 8: 3, 9: 3,
                      10: 4, 11: 4, 12: 4};

        let month = thisTime.getMonth() + 1;
		return {
			year: nowTime.getFullYear(),
            num: weekNum,
            month: month,
            season: season[month],
			week: thisTime.getDay(),
			thisYear: thisTime.getFullYear()
		};
	},

	/**
	 * 获取一个区间内，指定的周有那些天（例如：['2016-07-05', '2016-08-15']中周一那些天是周一）
	 * @param dates {Array} 需要筛选的日期有那些, 如果type === 'section'，第一项是开始日期，第二项是结束日期
	 * @param weeks {Array} 筛选的周有那些 [0,1,2,3,4,5,6]
	 * @param type {String} 默认section
	 * @returns {Array}
	 */
	filterWeek: function (dates, weeks = [0, 1, 2, 3, 4, 5, 6], type = 'section') {
		let arr = [];
		if (type === 'section') {
			let startTime = this.strToDate(dates[0]);
			let endTime = this.strToDate(dates[1]);
			let currTime = startTime;
			while (currTime.getTime() <= endTime.getTime()) {
				let currYear = currTime.getFullYear();
				let currMonth = currTime.getMonth() + 1;
				if (currMonth < 10) {
					currMonth = `0${currMonth}`
				}
				let currDate = currTime.getDate();
				if (currDate < 10) {
					currDate = `0${currDate}`
				}
				let currWeek = currTime.getDay();

				for (let i = 0; i < weeks.length; i++) {
					if (currWeek == weeks[i]) {
						arr.push(`${currYear}-${currMonth}-${currDate}`);
						break;
					}
				}

				currTime.setDate(parseInt(currDate) + 1);

			}
		} else {
			dates.forEach((item) => {
				let currTime = this.strToDate(item);
				let currYear = currTime.getFullYear();
				let currMonth = currTime.getMonth() + 1;
				if (currMonth < 10) {
					currMonth = `0${currMonth}`
				}

				let currDate = currTime.getDate();
				if (currDate < 10) {
					currDate = `0${currDate}`
				}
				let currWeek = currTime.getDay();

				for (let i = 0; i < weeks.length; i++) {
					if (currWeek === weeks) {
						arr.push(`${currYear}-${currMonth}-${currDate}`);
					}
				}
			});
		}


		return arr;

	},

	getWeek: function (day, lang, len) {
		len = len || 3;
		if (Object.prototype.toString.call(lang) == '[object Number]') {
			len = lang;
			lang = 'en';
		}
		var zdate = this.parseDate(day),
			windex = zdate.getDay(),
			weekAry = {"en": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]},
			week = weekAry[(lang || "en")][windex];
		if (!week) {
			week = ""
		}
		return week.substr(0, len);
	},

	/**
	 * 获得时间戳
	 * */
	getTimestrp: function (statrT, endT) {
		var zdate = this.parseDate(statrT),
			edate = this.parseDate(endT),
			time = zdate - edate;
		return ( time / 1000 / 60 / 60 / 24).toFixed(0);
	},
	parseDate: function (dateStringInRange) {
		var isoExp = /^\s*(\d{4})[-\/\u4e00-\u9fa5](\d\d?)[-\/\u4e00-\u9fa5](\d\d?)[\u4e00-\u9fa5]?\s*$/,
			date = new Date(), month,
			parts = isoExp.exec(dateStringInRange);
		if (parts) {
			month = +parts[2];
			date.setFullYear(parts[1], month - 1, parts[3]);
			if (month != date.getMonth() + 1) {
				date.setTime(NaN);
			}
		}
		return date;
	},

	/**
	 * 是否连续日期
	 * @param arrDate
	 * @returns {boolean}
	 */
	isContinuous: function (arrDate) {
		let arrLen = arrDate.length - 1;
		let start = arrDate[0];
		let end = arrDate[arrLen];

		let startTime = this.strToDate(start).getTime();
		let endTime = this.strToDate(end).getTime();

		let num = (endTime - startTime) / 1000 / 60 / 60 / 24;
		return arrLen === num;
	},

    /**
     * 获取日期属于一年中第几周 星期几
     * @param date 2016-01-01
     * @param type week/day
     * @returns {Object} year 属于哪一年第几周  num 第几周  week 周几 [0,1,2,3,4,5,6] 星期日为 0
     * {
     *  year:2015,
     *  num:53,
     *  week:5
     * }
     * */
    getLastDate (date,type){
        let thisDate = new Date(date);
        let lastYear = thisDate.getFullYear()-1;
        let lastMonth = (thisDate.getMonth()+1)<10?'0'+(thisDate.getMonth()+1):(thisDate.getMonth()+1);
        let lastDay = thisDate.getDate()<10?'0'+thisDate.getDate():thisDate.getDate();
        let lastDate = '';
        if(type==='week'){
            lastDate = this.switch(date,-364);// 364 Ϊ52*7
        }
        if(type==='day'){
            lastDate = lastYear+'-'+lastMonth+'-'+lastDay;
        }
        return lastDate;
    },

    /**
     * 获取某一天
     * @day 0 更新时间前一天 1 更新时间当天
     * @newDate 更新时间 Date || String
     * @return  返回时间 Date || String   传入日期，返回日期， 传入日期字符串，返回 日期字符串
     * */
    getDate: function (day, date) {
        day = day ? day : 0;
        let start_dt;
        let type = Object.prototype.toString.call(date) === '[object Date]';
        if (type) {
            start_dt = date;
        } else {
            start_dt = this.strToDate(date);
        }
        let start_time = start_dt.getTime();
        //24 * 60 * 60 * 1000  === 86400000
        let newDate = new Date(start_time + (day * 86400000));
        if (!type) {
            newDate = newDate.format('yyyy-MM-dd');
        }
        return newDate;
    },

    /**
     * 获取日期段的去年同星期，去年同日期
     * @param dateArray {Array}  [ '2016-01-01','2016-01-31' ]  下标为0 开始日期，下标为1 结束日期
     * @param type {String} week 去年同星期 day 去年同日期
     * @returns {Array} week [2015-01-02,2015-01-31]  day [2015-01-01,2015-01-30]
     * */
    getLastSegment(dateArray,type){
        let array;
        if(dateArray.length===2){
            array = [this.getLastDate(dateArray[0],type), this.getLastDate(dateArray[1],type)];
        }
        return array;
    },

	/**
	 * 获取对比日期， 同日起，同星期，自定义
	 * **/
    getCompareDate(config = {}) {
        let dateType = config.dateType;
        let live_start = config.live_start;
        let live_end = config.live_end;
        let observe_dt = config.observe_dt;
        //对比类型
        let contrast_type = ['week', 'week', 'day'][dateType];

        //对比日期数组
        let live_contrast_dateArr;
        let observe_contrast_dateArr;
        //非自定义
        if (contrast_type) {
            live_contrast_dateArr = this.getLastSegment([live_start, live_end], contrast_type);
            observe_contrast_dateArr = this.getLastDate(observe_dt, contrast_type);
        }
        //自定义
        else {
            //对比日期和入住日期的差值 ，算出对比的预订日期
            //对比时间数组
            let _contrast = dateType.split(',');
            // 对比的开始时间
            let con_start = _contrast[0];
            //对比的开始时间 与 入住开始日期 差值
            let con_diff = this.getDateDiff(live_start, observe_dt);
            //入住预订日期的开始时间
            let con_book_start = this.switch(con_start, con_diff);
            //入住对比时间 数组
            if (_contrast.length === 1) {
                _contrast.push(_contrast[0]);
            }
            live_contrast_dateArr = _contrast;
            observe_contrast_dateArr = con_book_start;
        }
        return {
            live: [live_start, live_end],  //入住日期
            liveCon: live_contrast_dateArr,// 入住对比日期
            observe: observe_dt,         // 观察日期
            observeCon: observe_contrast_dateArr // 观察日期对比
        }
    },


};