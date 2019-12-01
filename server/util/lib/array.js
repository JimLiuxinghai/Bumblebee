const arrayUtil = {
	filterByKey: function (arr, keys, config = {}) {
		config.key = config.key || 'key';
		config.val = config.val || 'value';
		let str = [];
		let isKeys = (Object.prototype.toString.call(keys) === '[object Array]');
		arr.forEach((item)=> {
			if (isKeys) {
				for (let i = 0; i < keys.length; i++) {
					if (item[config.key] == keys[i]) {
						str.push(item[config.val]);
					}
				}
			} else {
				if (item[config.key] == keys) {
					str = item[config.val];
				}
			}

		});
		return str;
	},
	/**
	 * 递归查询 某项下 所包含的列
	 * */
	getColBy: (items, i = 0) => {
		i += items ? items.length : 1;
		if (items) {
			items.forEach((item) => {
				if (item.items) {
					i = arrayUtil.getColBy(item.items, i) - 1;
				}
			});
		}
		return i;
	},
	/**
	 * 列的总数
	 * */
	getColumnsNum: (columns) => {
		let cols = 0;
		columns.forEach((item) => {
			if (item.items) {
				cols += arrayUtil.getColBy(item.items);
			} else {
				cols++;
			}
		});
		return cols;
	},
	/**
	 * 获取数据长度， 取集合中一项
	 * @param {Object} data 数据集合
	 * @return {Number} rows 行数
	 * */
	getRowsNum: (data) => {
		let rows = 0;
		let error = 0;
		let initLen = [];

		function getAttr(data) {
			for (let key in data) {
				if (data.hasOwnProperty(key) && Object.keys(data[key]).length > 0) {
					if (!angular.isArray(data[key])) {
						return getAttr(data[key])
					}
					let len = data[key].length;
					if (len !== rows) {
						rows = len;
						error++;
					} else {
						initLen = len;
					}

				}
			}
		}

		getAttr(data);

		if (error > 1) {
			rows = initLen;
			console.warn(`数据中数组长度不一致，已默认去最小${initLen}`);
		}
		return rows;
	},
	/**
	 * 获取分页数组
	 * @param {Number} count 总条数
	 * @param {Number} pageIndex 页码
	 * @param {Number} page 每页条数
	 * */
	getPageArr: (count, pageIndex = 1, page = 20) => {
		let maxCount = pageIndex * page;
		pageIndex = pageIndex - 1;
		let len = count > maxCount ? maxCount : (count - (pageIndex * page));
		let ary = [];
		for (let i = pageIndex * page; i < len; i++) {
			ary.push(i);
		}
		return ary;
	}
};

/**
 * 获取value值
 * @param arr 对象数组
 * @param keys 对象中的keys
 * @param config key value配置
 * */
module.exports = arrayUtil;