function parseSqlData(data){
	const sql = [];
	const values = [];

	for(let key in data){
		sql.push(key);
		values.push(data[key]);
	}

	return {
		sql, values
	}
}
/**
 * 批量插入数据
 * @param dbname
 * @param data
 * @param flag
 * @returns {*}
 */
exports.insertMore = function(dbname, data, flag){
	if(!data.length){
		return null
	}

	if(data.length === 1){
		const sqlData = parseSqlData(data[0]);
		const sql = sqlData.sql.join(',');
		const values = sqlData.values;
		return {
			sql: {
				0: `insert into ${dbname} (${sql}) values (?)`
			},
			data: {
				0: [values]
			}
		};
	}

	let sql = {};
	const values = {};
	let index = 0;

	for(let i=0; i<data.length; i++){
		const sqlData = parseSqlData(data[i]);
		if(i%flag === 0){
			const sqlParam = sqlData.sql.join(',');
			index++;
			sql[index] = `insert into ${dbname} (${sqlParam}) values (?)`;
			values[index] = [];
		} else {
			sql[index] += ',(?)';
		}
		values[index].push(sqlData.values);
	}
	return {
		sql: sql,
		data: values
	}
}